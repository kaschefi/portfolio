import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, Mail, Terminal as TerminalIcon } from 'lucide-react';

interface HeroFluidRevealProps {
  onExploreBookshelf?: () => void;
  onOpenAbout?: () => void;
  onOpenEmail?: () => void;
}

export const HeroFluidReveal: React.FC<HeroFluidRevealProps> = ({ onExploreBookshelf, onOpenEmail }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const captionRef = useRef<HTMLDivElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. Initialize WebGL Context with float/half-float texture capabilities
    const gl =
      (canvas.getContext('webgl2', { alpha: false, depth: false, antialias: false }) as WebGL2RenderingContext | null) ||
      (canvas.getContext('webgl', { alpha: false, depth: false, antialias: false }) as WebGLRenderingContext | null);

    if (!gl) {
      console.warn('WebGL is not available for fluid simulation');
      return;
    }

    const isWebGL2 = 'WebGL2RenderingContext' in window && gl instanceof WebGL2RenderingContext;

    // Texture format resolution
    let internalFormat = gl.RGBA;
    let format = gl.RGBA;
    let type = gl.UNSIGNED_BYTE;
    let supportLinear = true;

    if (isWebGL2) {
      const gl2 = gl as WebGL2RenderingContext;
      gl2.getExtension('EXT_color_buffer_float');
      const halfFloatLinear = gl2.getExtension('OES_texture_float_linear') || gl2.getExtension('OES_texture_half_float_linear');
      internalFormat = (gl2 as any).RGBA16F || gl.RGBA;
      format = gl.RGBA;
      type = (gl2 as any).HALF_FLOAT || gl.FLOAT;
      supportLinear = Boolean(halfFloatLinear);
    } else {
      const halfFloat = gl.getExtension('OES_texture_half_float');
      const halfFloatLinear = gl.getExtension('OES_texture_half_float_linear');
      gl.getExtension('EXT_color_buffer_half_float');
      if (halfFloat) {
        internalFormat = gl.RGBA;
        format = gl.RGBA;
        type = (halfFloat as any).HALF_FLOAT_OES || gl.FLOAT;
        supportLinear = Boolean(halfFloatLinear);
      }
    }

    // Shader compiler helper
    const createShader = (shaderType: number, source: string) => {
      const s = gl.createShader(shaderType);
      if (!s) return null;
      gl.shaderSource(s, source);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    };

    const createProgram = (vsSrc: string, fsSrc: string) => {
      const vs = createShader(gl.VERTEX_SHADER, vsSrc);
      const fs = createShader(gl.FRAGMENT_SHADER, fsSrc);
      if (!vs || !fs) return null;
      const p = gl.createProgram();
      if (!p) return null;
      gl.attachShader(p, vs);
      gl.attachShader(p, fs);
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        console.error('Program link error:', gl.getProgramInfoLog(p));
        return null;
      }
      return p;
    };

    // Full-screen Quad Buffer
    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,
        1, -1,
        -1, 1,
        -1, 1,
        1, -1,
        1, 1
      ]),
      gl.STATIC_DRAW
    );

    const bindQuad = (prog: WebGLProgram) => {
      gl.useProgram(prog);
      const loc = gl.getAttribLocation(prog, 'aPosition');
      if (loc !== -1) {
        gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      }
    };

    // 2. Vertex Shaders with 4-neighborhood offsets for Jacobi and gradient passes
    const baseVS = `
      attribute vec2 aPosition;
      varying vec2 vUV;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform vec2 uTexelSize;

      void main() {
        vUV = (aPosition + 1.0) * 0.5;
        vL = vUV - vec2(uTexelSize.x, 0.0);
        vR = vUV + vec2(uTexelSize.x, 0.0);
        vT = vUV + vec2(0.0, uTexelSize.y);
        vB = vUV - vec2(0.0, uTexelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    const simpleVS = `
      attribute vec2 aPosition;
      varying vec2 vUV;
      void main() {
        vUV = (aPosition + 1.0) * 0.5;
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    // 3. Navier-Stokes Fragment Shaders

    // Splat: Injects force or dye with circular aspect ratio correction
    const splatFS = `
      precision highp float;
      varying vec2 vUV;
      uniform sampler2D uTarget;
      uniform float uAspectRatio;
      uniform vec2 uPoint;
      uniform vec3 uColor;
      uniform float uRadius;

      void main() {
        vec2 p = vUV - uPoint;
        p.x *= uAspectRatio;
        vec3 splat = exp(-dot(p, p) / uRadius) * uColor;
        vec3 base = texture2D(uTarget, vUV).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
      }
    `;

    // Curl (Vorticity Computation): Computes partial derivatives of velocity (curl = dv_y/dx - dv_x/dy)
    const curlFS = `
      precision highp float;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;

      void main() {
        float L = texture2D(uVelocity, vL).y;
        float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x;
        float B = texture2D(uVelocity, vB).x;
        float vorticity = 0.5 * ((R - L) - (T - B));
        gl_FragColor = vec4(vorticity, 0.0, 0.0, 1.0);
      }
    `;

    // Vorticity Confinement: Restores micro-turbulence, curls, and eddies
    const vorticityFS = `
      precision highp float;
      varying vec2 vUV;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float uCurlStrength;
      uniform float uDt;

      void main() {
        float L = texture2D(uCurl, vL).x;
        float R = texture2D(uCurl, vR).x;
        float T = texture2D(uCurl, vT).x;
        float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUV).x;

        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        float len = length(force) + 0.0001;
        force = (force / len) * vec2(1.0, -1.0) * (uCurlStrength * C);

        vec2 vel = texture2D(uVelocity, vUV).xy;
        gl_FragColor = vec4(vel + force * uDt, 0.0, 1.0);
      }
    `;

    // Divergence: Computes incompressibility deviation
    const divergenceFS = `
      precision highp float;
      varying vec2 vUV;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;

      void main() {
        float L = texture2D(uVelocity, vL).x;
        float R = texture2D(uVelocity, vR).x;
        float T = texture2D(uVelocity, vT).y;
        float B = texture2D(uVelocity, vB).y;

        vec2 C = texture2D(uVelocity, vUV).xy;
        if (vL.x < 0.0) L = -C.x;
        if (vR.x > 1.0) R = -C.x;
        if (vT.y > 1.0) T = -C.y;
        if (vB.y < 0.0) B = -C.y;

        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `;

    // Pressure Poisson Solver (Jacobi iteration)
    const pressureFS = `
      precision highp float;
      varying vec2 vUV;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;

      void main() {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        float div = texture2D(uDivergence, vUV).x;
        float p = (L + R + T + B - div) * 0.25;
        gl_FragColor = vec4(p, 0.0, 0.0, 1.0);
      }
    `;

    // Gradient Subtraction: Enforces zero-divergence incompressibility on the velocity field
    const gradSubFS = `
      precision highp float;
      varying vec2 vUV;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;

      void main() {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        vec2 vel = texture2D(uVelocity, vUV).xy;
        vel -= 0.5 * vec2(R - L, T - B);
        gl_FragColor = vec4(vel, 0.0, 1.0);
      }
    `;

    // Advection: Advects velocity and density back through velocity characteristics with dissipation & linear decay
    const advectFS = `
      precision highp float;
      varying vec2 vUV;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 uTexelSize;
      uniform float uDt;
      uniform float uDissipation;
      uniform float uLinearDecay;

      void main() {
        vec2 vel = texture2D(uVelocity, vUV).xy;
        vec2 coord = vUV - uDt * vel * uTexelSize;
        vec4 res = uDissipation * texture2D(uSource, coord);
        gl_FragColor = max(vec4(0.0), res - vec4(uLinearDecay));
      }
    `;

    // Clear / Decay Pass
    const clearFS = `
      precision highp float;
      varying vec2 vUV;
      uniform sampler2D uTarget;
      uniform float uDecay;

      void main() {
        gl_FragColor = uDecay * texture2D(uTarget, vUV);
      }
    `;

    // Reveal Composite Shader with Chromatic Dispersion, FBM Fluid Dissolve, Fresnel Rim Glow, and Edge Curls
    const compositeFS = `
      precision highp float;
      varying vec2 vUV;
      uniform sampler2D uDensity;
      uniform sampler2D uVelocity;
      uniform sampler2D uLayer1;
      uniform sampler2D uLayer2;
      uniform vec2 uResolution;
      uniform vec2 uImageResolution;
      uniform float uTime;
      uniform float uIntroProgress; // 0.0 = Layer 1 (cybernetic robotme.png), 1.0 = Layer 2 (human engineer me.png)

      // 2D Hash & Value Noise (fbm.ts)
      float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        float res = mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
        return res * res;
      }

      // 4-Octave Fractional Brownian Motion with rotation (fbm.ts)
      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
        for (int i = 0; i < 4; i++) {
          v += a * noise(p);
          p = rot * p * 2.0 + vec2(100.0);
          a *= 0.5;
        }
        return v;
      }

      vec2 getFitUV(vec2 uvCoord, vec2 screenRes, vec2 imgRes) {
        float screenAspect = screenRes.x / screenRes.y;
        float imgAspect = imgRes.x / imgRes.y;

        // Desktop Widescreen: Right-anchor (0.72x, 0.48y) to leave clean negative space for Left Typography Column
        // Mobile / Portrait: Center-aligned (0.50x, 0.44y)
        bool isWidescreen = screenAspect > 1.10;
        float targetCenterX = isWidescreen ? 0.72 : 0.50;
        float targetCenterY = isWidescreen ? 0.48 : 0.44;
        float scale = isWidescreen ? 0.90 : 0.95;

        vec2 centered = uvCoord - vec2(targetCenterX, targetCenterY);

        if (screenAspect > imgAspect) {
          centered.x *= (screenAspect / imgAspect);
        } else {
          centered.y *= (imgAspect / screenAspect);
        }

        return (centered / scale) + 0.5;
      }

      void main() {
        vec2 fitUV = getFitUV(vUV, uResolution, uImageResolution);

        // Interactive Fluid density & velocity
        float fluidDensity = texture2D(uDensity, vUV).r;
        vec2 vel = texture2D(uVelocity, vUV).xy;

        // Density gradient for refractive displacement and edge curl highlights
        vec2 eps = vec2(1.0 / uResolution.x, 1.0 / uResolution.y) * 2.5;
        float fluidR = texture2D(uDensity, vUV + vec2(eps.x, 0.0)).r;
        float fluidL = texture2D(uDensity, vUV - vec2(eps.x, 0.0)).r;
        float fluidT = texture2D(uDensity, vUV + vec2(0.0, eps.y)).r;
        float fluidB = texture2D(uDensity, vUV - vec2(0.0, eps.y)).r;
        vec2 fluidGrad = vec2(fluidR - fluidL, fluidT - fluidB);

        // Smooth liquid reveal mask for interactive pointer reveal
        float revealAmount = smoothstep(0.05, 0.70, fluidDensity);
        float transitionBoundary = revealAmount * (1.0 - revealAmount) * 4.0;

        // Confine fluid optical distortion and chromatic shift strictly to the tearing perimeter
        vec2 rawDistort = clamp(vel * 0.002, vec2(-0.02), vec2(0.02)) + clamp(fluidGrad * 0.015, vec2(-0.02), vec2(0.02));
        vec2 edgeDistort = rawDistort * transitionBoundary;

        // --- FBM Fluid Intro Transformation (Layer 1 cybernetic -> Layer 2 human engineer) ---
        // Domain-warped FBM noise pattern moving organically across portrait (fbm.ts + FluidSim.ts)
        vec2 fbmUV = fitUV * 4.5 + vec2(uTime * 0.18, -uTime * 0.12);
        float noiseVal = fbm(fbmUV);
        float noiseVal2 = fbm(fbmUV + noiseVal * 1.8 + vec2(2.1, 7.4));

        // Spatial progression sweep across portrait (0.0 = 100% Layer 1 robotme.png, 1.0 = 100% Layer 2 me.png)
        float spatialDist = (fitUV.y * 0.55 + fitUV.x * 0.35) + (noiseVal2 - 0.5) * 0.40;
        float sweepMin = -0.35;
        float sweepMax = 1.35;
        float currentCutoff = mix(sweepMin, sweepMax, uIntroProgress);
        float introTear = smoothstep(spatialDist - 0.14, spatialDist + 0.14, currentCutoff);
        if (uIntroProgress <= 0.001) introTear = 0.0;
        if (uIntroProgress >= 0.999) introTear = 1.0;

        // Intro wave edge boundary & Fresnel-style energy glow calculation (fresnelMaterial.ts)
        float introEdge = introTear * (1.0 - introTear) * 4.0;
        float introActive = step(0.001, uIntroProgress) * (1.0 - step(0.999, uIntroProgress));
        float introEdgeIntensity = introEdge * introActive;

        // Multi-tap fluid displacement ripple along the intro dissolve front (FluidSim.ts)
        vec2 introWarp = vec2(
          fbm(fitUV * 8.0 + vec2(uTime * 0.30, 0.0)) - 0.5,
          fbm(fitUV * 8.0 + vec2(0.0, uTime * 0.30)) - 0.5
        ) * 0.055 * introEdgeIntensity;

        // Sample Layer 1: Human engineer portrait (me.png)
        vec2 uv1 = fitUV + introWarp * 0.5;
        bool inBounds1 = (uv1.x >= 0.0 && uv1.x <= 1.0 && uv1.y >= 0.0 && uv1.y <= 1.0);
        vec4 col1 = vec4(0.0);
        if (inBounds1) {
          // Chromatic dispersion at intro wavefront
          vec2 cOffset1 = introWarp * 0.4;
          float r = texture2D(uLayer1, clamp(uv1 + cOffset1, vec2(0.0), vec2(1.0))).r;
          float g = texture2D(uLayer1, uv1).g;
          float b = texture2D(uLayer1, clamp(uv1 - cOffset1, vec2(0.0), vec2(1.0))).b;
          float a = texture2D(uLayer1, uv1).a;
          col1 = vec4(r, g, b, a);
        }

        // Sample Layer 2: Cybernetic portrait (robotme.png)
        vec2 uv2 = fitUV + edgeDistort - introWarp * 0.5;
        bool inBounds2 = (uv2.x >= 0.0 && uv2.x <= 1.0 && uv2.y >= 0.0 && uv2.y <= 1.0);
        vec4 col2 = vec4(0.0);
        if (inBounds2) {
          vec2 cOffset2 = clamp(edgeDistort * 0.35 + introWarp * 0.4, vec2(-0.01), vec2(0.01));
          float r = texture2D(uLayer2, clamp(uv2 + cOffset2, vec2(0.0), vec2(1.0))).r;
          float g = texture2D(uLayer2, uv2).g;
          float b = texture2D(uLayer2, clamp(uv2 - cOffset2, vec2(0.0), vec2(1.0))).b;
          float a = texture2D(uLayer2, uv2).a;
          col2 = vec4(r, g, b, a);
        }

        // Base resting state: starts at Layer 1 (human me.png), then organically transforms into Layer 2 (cybernetic robotme.png)
        vec4 basePortrait = mix(col1, col2, introTear);

        // Electric cyan/gold Fresnel edge glow along the intro wave front (fresnelMaterial.ts)
        vec3 fresnelCyan = vec3(0.18, 0.68, 1.0);
        vec3 fresnelAmber = vec3(1.0, 0.85, 0.45);
        vec3 introGlowColor = mix(fresnelCyan, fresnelAmber, noiseVal);
        float heightFade = smoothstep(0.1, 0.9, fitUV.y);
        vec3 introRimGlow = introGlowColor * (introEdgeIntensity * 1.5) * (0.8 + 0.4 * heightFade);

        // Fluid reveal layer: hovering / dragging on top of cybernetic portrait dissolves it to reveal human engineer Layer 1
        vec4 subject = mix(basePortrait, col1, revealAmount);

        // Refined ink / drafting bleed at interactive transition boundaries
        float edgeStrength = smoothstep(0.01, 0.18, length(fluidGrad)) * transitionBoundary;
        vec3 edgeGlow = vec3(0.72, 0.68, 0.60) * edgeStrength * 0.25;
        subject.rgb += (edgeGlow + introRimGlow) * subject.a;

        // Archival deep slate backdrop (#16181d) matching the 3D bookshelf scene
        vec3 bg = vec3(0.086, 0.094, 0.114);
        float spotX = (uResolution.x / uResolution.y > 1.05) ? 0.72 : 0.50;
        float centerDist = length(vUV - vec2(spotX, 0.48));
        float spotGlow = exp(-centerDist * 2.2) * 0.06;
        bg += vec3(0.04, 0.04, 0.045) * spotGlow;

        vec3 finalRGB = mix(bg, subject.rgb, subject.a);
        gl_FragColor = vec4(finalRGB, 1.0);
      }
    `;

    // 4. Compile Shader Programs
    const progSplat = createProgram(simpleVS, splatFS);
    const progCurl = createProgram(baseVS, curlFS);
    const progVorticity = createProgram(baseVS, vorticityFS);
    const progDivergence = createProgram(baseVS, divergenceFS);
    const progPressure = createProgram(baseVS, pressureFS);
    const progGradSub = createProgram(baseVS, gradSubFS);
    const progAdvect = createProgram(simpleVS, advectFS);
    const progClear = createProgram(simpleVS, clearFS);
    const progComposite = createProgram(simpleVS, compositeFS);

    if (
      !progSplat ||
      !progCurl ||
      !progVorticity ||
      !progDivergence ||
      !progPressure ||
      !progGradSub ||
      !progAdvect ||
      !progClear ||
      !progComposite
    ) {
      console.error('Failed to initialize fluid simulation programs');
      return;
    }

    // 5. Ping-Pong FBO Render Targets
    const simRes = 256;
    const filterMode = supportLinear ? gl.LINEAR : gl.NEAREST;

    const createFBO = (w: number, h: number) => {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filterMode);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filterMode);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);

      return { fbo, tex, width: w, height: h };
    };

    const createDoubleFBO = (w: number, h: number) => {
      let fbo1 = createFBO(w, h);
      let fbo2 = createFBO(w, h);
      return {
        get read() {
          return fbo1;
        },
        get write() {
          return fbo2;
        },
        swap() {
          const tmp = fbo1;
          fbo1 = fbo2;
          fbo2 = tmp;
        }
      };
    };

    let velocity = createDoubleFBO(simRes, simRes);
    let density = createDoubleFBO(simRes, simRes);
    let pressure = createDoubleFBO(simRes, simRes);
    let divergence = createFBO(simRes, simRes);
    let curl = createFBO(simRes, simRes);

    // 6. Texture Loader
    const baseUrl = import.meta.env.BASE_URL.endsWith('/')
      ? import.meta.env.BASE_URL
      : `${import.meta.env.BASE_URL}/`;

    const loadTexture = (url: string, onLoad?: (img: HTMLImageElement) => void) => {
      const tex = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      // 1x1 transparent placeholder
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        1,
        1,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        new Uint8Array([0, 0, 0, 0])
      );

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;

      img.decode()
        .then(() => {
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, tex);
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
          motionFrames = Math.max(motionFrames, 120);
          if (onLoad) onLoad(img);
        })
        .catch(() => {
          img.onload = () => {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            motionFrames = Math.max(motionFrames, 120);
            if (onLoad) onLoad(img);
          };
        });

      return tex;
    };

    let imageDimensions = { width: 1952, height: 2150 };
    let loadedCount = 0;

    // 7. Mouse Physics & Splat Queue
    interface SplatItem {
      x: number;
      y: number;
      dx: number;
      dy: number;
      color: [number, number, number];
      radiusMultiplier?: number;
    }

    const splats: SplatItem[] = [];
    let lastX = 0;
    let lastY = 0;
    let lastMoveTime = performance.now();
    let hasMoved = false;
    let motionFrames = 0; // Starts rendering only when textures finish loading
    let isRendering = false;
    let isInView = true;

    const wake = (frames = 90) => {
      motionFrames = Math.max(motionFrames, frames);
      if (!isRendering && isRunning && isInView) {
        isRendering = true;
        animationFrameId = requestAnimationFrame(render);
      }
    };

    const addSplat = (
      x: number,
      y: number,
      dx: number,
      dy: number,
      customColor?: [number, number, number],
      multiplier = 4200,
      radiusMultiplier = 1.0,
      frames = 360
    ) => {
      const rect = canvas.getBoundingClientRect();
      const nx = (x - rect.left) / rect.width;
      const ny = 1.0 - (y - rect.top) / rect.height;

      splats.push({
        x: nx,
        y: ny,
        dx: dx * multiplier,
        dy: -dy * multiplier,
        color: customColor || [1.4, 1.4, 1.4],
        radiusMultiplier
      });

      wake(frames);
    };

    // Intro state: starts displaying cybernetic Layer 1, then organically transforms into human Layer 2
    let introStartTime: number | null = null;
    let introProgress = 0.0;
    const INTRO_DELAY_MS = 800; // Snappy 350ms hold on Layer 1 so user registers initial state
    const INTRO_DURATION_MS = 1500; // 1.4s fluid energy wave transition transforming Layer 1 to Layer 2

    // Interaction Hint & Caption Orchestration
    let hasPlayedHint = false;
    let isCaptionDismissed = false;
    let idleTimer: number | null = null;
    let captionTimer: number | null = null;
    const hintTimeouts: number[] = [];

    const dismissCaption = () => {
      if (isCaptionDismissed) return;
      isCaptionDismissed = true;
      if (captionTimer !== null) {
        clearTimeout(captionTimer);
        captionTimer = null;
      }
      if (captionRef.current) {
        captionRef.current.classList.add('hero-touch-hint--hidden');
      }
    };

    const playPhantomSplatSequence = () => {
      if (hasPlayedHint || !isRunning) return;
      hasPlayedHint = true;

      const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
      if (prefersReducedMotion) return;

      const rect = canvas.getBoundingClientRect();
      const screenAspect = rect.width / rect.height;
      const isWidescreen = screenAspect > 1.10;

      // Diagonal stroke coordinates replicating natural cursor motion
      const startU = isWidescreen ? 0.245 : 0.22;
      const startV = isWidescreen ? 0.915 : 0.82;
      const endU = isWidescreen ? 0.505 : 0.62;
      const endV = isWidescreen ? 0.215 : 0.28;

      const steps = 25;
      const stepIntervalMs = 1;

      for (let i = 0; i < steps; i++) {
        const t = i / (steps - 1);
        const u = startU + (endU - startU) * t + (isWidescreen ? 0.012 : 0.008) * Math.sin(Math.PI * t);
        const v = startV + (endV - startV) * t - (isWidescreen ? 0.015 : 0.010) * Math.sin(Math.PI * t);

        const tangentU = (endU - startU) / (steps - 1) + (isWidescreen ? 0.012 : 0.008) * Math.PI * Math.cos(Math.PI * t) / (steps - 1);
        const tangentV = (endV - startV) / (steps - 1) - (isWidescreen ? 0.015 : 0.010) * Math.PI * Math.cos(Math.PI * t) / (steps - 1);

        const clientX = rect.left + u * rect.width;
        const clientY = rect.top + (1.0 - v) * rect.height;
        const deltaX = tangentU;
        const deltaY = -tangentV;

        const tid = window.setTimeout(() => {
          if (!isRunning) return;
          addSplat(
            clientX,
            clientY,
            deltaX,
            deltaY,
            [1.45, 1.45, 1.45],
            10200,
            1.15,
            360
          );
        }, i * stepIntervalMs);

        hintTimeouts.push(tid);
      }
    };

    const scheduleIdleHint = () => {
      if (hasPlayedHint || idleTimer !== null) return;
      const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
      if (prefersReducedMotion) {
        hasPlayedHint = true;
        return;
      }

      // Idle delay before triggering hint (only after 8 seconds of complete user inactivity)
      idleTimer = window.setTimeout(() => {
        idleTimer = null;
        playPhantomSplatSequence();
      }, 2500);
    };

    let currentProgress = 0;
    let progressTimer: number | null = null;
    let texturesReady = false;

    const updateProgress = () => {
      if (!isRunning) return;

      if (!texturesReady) {
        if (currentProgress < 85) {
          currentProgress += 3;
          setProgress(currentProgress);
          progressTimer = window.setTimeout(updateProgress, 20);
        } else {
          progressTimer = window.setTimeout(updateProgress, 30);
        }
      } else {
        // Accelerate to 100% and seamlessly start intro transition
        if (currentProgress < 100) {
          currentProgress = Math.min(100, currentProgress + 8);
          setProgress(currentProgress);
          progressTimer = window.setTimeout(updateProgress, 16);
        } else {
          setProgress(100);
          setIsLoaded(true);
          window.setTimeout(() => {
            if (!isRunning) return;
            introStartTime = performance.now();
            wake(360);
          }, 350);

          if (!isCaptionDismissed && captionTimer === null) {
            captionTimer = window.setTimeout(dismissCaption, 4500);
          }
        }
      }
    };

    progressTimer = window.setTimeout(updateProgress, 30);

    const checkLoaded = () => {
      loadedCount++;
      if (loadedCount >= 2) {
        texturesReady = true;
      }
    };

    // Layer 1: me.webp (human engineer portrait at initial load)
    const layer1Texture = loadTexture(`${baseUrl}me.webp`, (img) => {
      imageDimensions = { width: img.naturalWidth || img.width || 1952, height: img.naturalHeight || img.height || 2150 };
      checkLoaded();
    });

    // Layer 2: robotme.webp (cybernetic portrait transformed via fluid/FBM wave)
    const layer2Texture = loadTexture(`${baseUrl}robotme.webp`, () => {
      checkLoaded();
    });

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      dismissCaption();

      let clientX = 0;
      let clientY = 0;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }

      const now = performance.now();
      const dt = Math.max((now - lastMoveTime) / 1000, 0.001);
      lastMoveTime = now;

      if (!hasMoved) {
        lastX = clientX;
        lastY = clientY;
        hasMoved = true;
        return;
      }

      const rawDx = clientX - lastX;
      const rawDy = clientY - lastY;
      lastX = clientX;
      lastY = clientY;

      // Normalize pixel deltas into the same 0-1 UV space positions use, so a
      // given mouse speed produces an equal-feeling push in x and y regardless
      // of the canvas's aspect ratio (the sim grid itself is square).
      const rect = canvas.getBoundingClientRect();

      let deltaX = rawDx / rect.width;
      let deltaY = rawDy / rect.height;



      // Dynamic flick momentum boost for real cursor hover
      const flickBoost = Math.min(Math.hypot(rawDx, rawDy) / (dt * 1200), 2.2);
      if (Math.abs(rawDx) > 0.3 || Math.abs(rawDy) > 0.3) {
        addSplat(clientX, clientY, deltaX * (1.0 + flickBoost), deltaY * (1.0 + flickBoost));
      }
    };

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      dismissCaption();
      let clientX = 0;
      let clientY = 0;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      } else {
        return;
      }
      lastX = clientX;
      lastY = clientY;
      hasMoved = true;
      // Immediate tactile fluid ripple on direct touch / click
      addSplat(clientX, clientY, 0.001, 0.001, [1.0, 1.0, 1.0], 3200, 0.95, 180);
    };

    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('touchstart', onPointerDown, { passive: true });

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      gl.viewport(0, 0, width, height);
      wake(60);
    };

    window.addEventListener('resize', onResize);

    // 8. Simulation Loop
    let animationFrameId: number;
    let lastTime = performance.now();
    let isRunning = true;

    const render = () => {
      if (!isRunning || !isInView) {
        isRendering = false;
        return;
      }

      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.032);
      lastTime = now;

      // Compute smooth intro transition from Layer 2 (human) to Layer 1 (cybernetic)
      if (introStartTime !== null) {
        const elapsed = now - introStartTime;
        if (elapsed < INTRO_DELAY_MS) {
          introProgress = 0.0;
          motionFrames = Math.max(motionFrames, 60);
        } else if (elapsed < INTRO_DELAY_MS + INTRO_DURATION_MS) {
          const t = Math.min(Math.max((elapsed - INTRO_DELAY_MS) / INTRO_DURATION_MS, 0.0), 1.0);
          // Smooth cubic ease-in-out
          introProgress = t * t * (3.0 - 2.0 * t);
          motionFrames = Math.max(motionFrames, 60);
        } else {
          if (introProgress < 1.0) {
            introProgress = 1.0;
            scheduleIdleHint();
          }
        }
      }

      // Only simulate while active motion or active fluid remains (Zero-load idle: 0 FPS / 0% GPU)
      if (motionFrames > 0 || splats.length > 0 || introProgress < 1.0) {
        if (motionFrames > 0) motionFrames--;

        const texelSize = [1.0 / simRes, 1.0 / simRes];
        const aspect = width / height;

        // --- Step 1: Ingest mouse impulses / splats into Velocity and Dye Density ---
        while (splats.length > 0) {
          const s = splats.pop()!;
          const radMul = s.radiusMultiplier || 1.0;

          // Velocity Splat
          gl.viewport(0, 0, simRes, simRes);
          bindQuad(progSplat);
          gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.write.fbo);
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
          gl.uniform1i(gl.getUniformLocation(progSplat, 'uTarget'), 0);
          gl.uniform1f(gl.getUniformLocation(progSplat, 'uAspectRatio'), aspect);
          gl.uniform2f(gl.getUniformLocation(progSplat, 'uPoint'), s.x, s.y);
          gl.uniform3f(gl.getUniformLocation(progSplat, 'uColor'), s.dx, s.dy, 0.0);
          gl.uniform1f(gl.getUniformLocation(progSplat, 'uRadius'), 0.015 * radMul);
          gl.drawArrays(gl.TRIANGLES, 0, 6);
          velocity.swap();

          // Density Splat
          gl.bindFramebuffer(gl.FRAMEBUFFER, density.write.fbo);
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, density.read.tex);
          gl.uniform1i(gl.getUniformLocation(progSplat, 'uTarget'), 0);
          gl.uniform1f(gl.getUniformLocation(progSplat, 'uAspectRatio'), aspect);
          gl.uniform2f(gl.getUniformLocation(progSplat, 'uPoint'), s.x, s.y);
          gl.uniform3f(gl.getUniformLocation(progSplat, 'uColor'), s.color[0], s.color[1], s.color[2]);
          gl.uniform1f(gl.getUniformLocation(progSplat, 'uRadius'), 0.019 * radMul);
          gl.drawArrays(gl.TRIANGLES, 0, 6);
          density.swap();
        }

        // --- Step 2: Curl / Vorticity Computation ---
        gl.viewport(0, 0, simRes, simRes);
        bindQuad(progCurl);
        gl.bindFramebuffer(gl.FRAMEBUFFER, curl.fbo);
        gl.uniform2f(gl.getUniformLocation(progCurl, 'uTexelSize'), texelSize[0], texelSize[1]);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
        gl.uniform1i(gl.getUniformLocation(progCurl, 'uVelocity'), 0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        // --- Step 3: Vorticity Confinement (Restores Micro-Turbulence & Curls) ---
        bindQuad(progVorticity);
        gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.write.fbo);
        gl.uniform2f(gl.getUniformLocation(progVorticity, 'uTexelSize'), texelSize[0], texelSize[1]);
        gl.uniform1f(gl.getUniformLocation(progVorticity, 'uCurlStrength'), 32.0);
        gl.uniform1f(gl.getUniformLocation(progVorticity, 'uDt'), dt);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
        gl.uniform1i(gl.getUniformLocation(progVorticity, 'uVelocity'), 0);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, curl.tex);
        gl.uniform1i(gl.getUniformLocation(progVorticity, 'uCurl'), 1);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        velocity.swap();

        // --- Step 4: Calculate Divergence ---
        bindQuad(progDivergence);
        gl.bindFramebuffer(gl.FRAMEBUFFER, divergence.fbo);
        gl.uniform2f(gl.getUniformLocation(progDivergence, 'uTexelSize'), texelSize[0], texelSize[1]);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
        gl.uniform1i(gl.getUniformLocation(progDivergence, 'uVelocity'), 0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        // --- Step 5: Clear / Decay Pressure ---
        bindQuad(progClear);
        gl.bindFramebuffer(gl.FRAMEBUFFER, pressure.write.fbo);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, pressure.read.tex);
        gl.uniform1i(gl.getUniformLocation(progClear, 'uTarget'), 0);
        gl.uniform1f(gl.getUniformLocation(progClear, 'uDecay'), 0.8);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        pressure.swap();

        // --- Step 6: Pressure Poisson Solver (Jacobi Iterations) ---
        bindQuad(progPressure);
        gl.uniform2f(gl.getUniformLocation(progPressure, 'uTexelSize'), texelSize[0], texelSize[1]);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, divergence.tex);
        gl.uniform1i(gl.getUniformLocation(progPressure, 'uDivergence'), 1);

        for (let i = 0; i < 20; i++) {
          gl.bindFramebuffer(gl.FRAMEBUFFER, pressure.write.fbo);
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, pressure.read.tex);
          gl.uniform1i(gl.getUniformLocation(progPressure, 'uPressure'), 0);
          gl.drawArrays(gl.TRIANGLES, 0, 6);
          pressure.swap();
        }

        // --- Step 7: Gradient Subtraction (Divergence-Free Projection) ---
        bindQuad(progGradSub);
        gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.write.fbo);
        gl.uniform2f(gl.getUniformLocation(progGradSub, 'uTexelSize'), texelSize[0], texelSize[1]);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, pressure.read.tex);
        gl.uniform1i(gl.getUniformLocation(progGradSub, 'uPressure'), 0);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
        gl.uniform1i(gl.getUniformLocation(progGradSub, 'uVelocity'), 1);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        velocity.swap();

        // --- Step 8: Advect Velocity (Viscosity / Velocity Dissipation) ---
        bindQuad(progAdvect);
        gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.write.fbo);
        gl.uniform2f(gl.getUniformLocation(progAdvect, 'uTexelSize'), texelSize[0], texelSize[1]);
        gl.uniform1f(gl.getUniformLocation(progAdvect, 'uDt'), dt);
        gl.uniform1f(gl.getUniformLocation(progAdvect, 'uDissipation'), 0.985); // Smooth rolling vortices
        gl.uniform1f(gl.getUniformLocation(progAdvect, 'uLinearDecay'), 0.0);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
        gl.uniform1i(gl.getUniformLocation(progAdvect, 'uVelocity'), 0);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
        gl.uniform1i(gl.getUniformLocation(progAdvect, 'uSource'), 1);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        velocity.swap();

        // --- Step 9: Advect Dye Density (Smooth Evaporation without Asymptotic Lingering) ---
        gl.bindFramebuffer(gl.FRAMEBUFFER, density.write.fbo);
        gl.uniform1f(gl.getUniformLocation(progAdvect, 'uDissipation'), 0.985); // Smooth continuous evaporation
        gl.uniform1f(gl.getUniformLocation(progAdvect, 'uLinearDecay'), 0.0016); // Reaches true 0 seamlessly
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
        gl.uniform1i(gl.getUniformLocation(progAdvect, 'uVelocity'), 0);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, density.read.tex);
        gl.uniform1i(gl.getUniformLocation(progAdvect, 'uSource'), 1);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        density.swap();

        // --- Step 10: Final Reveal Composite Pass ---
        gl.viewport(0, 0, width, height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        bindQuad(progComposite);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, density.read.tex);
        gl.uniform1i(gl.getUniformLocation(progComposite, 'uDensity'), 0);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
        gl.uniform1i(gl.getUniformLocation(progComposite, 'uVelocity'), 1);

        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, layer1Texture);
        gl.uniform1i(gl.getUniformLocation(progComposite, 'uLayer1'), 2);

        gl.activeTexture(gl.TEXTURE3);
        gl.bindTexture(gl.TEXTURE_2D, layer2Texture);
        gl.uniform1i(gl.getUniformLocation(progComposite, 'uLayer2'), 3);

        gl.uniform2f(gl.getUniformLocation(progComposite, 'uResolution'), width, height);
        gl.uniform2f(
          gl.getUniformLocation(progComposite, 'uImageResolution'),
          imageDimensions.width,
          imageDimensions.height
        );
        gl.uniform1f(gl.getUniformLocation(progComposite, 'uTime'), now * 0.001);
        gl.uniform1f(gl.getUniformLocation(progComposite, 'uIntroProgress'), introProgress);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
        animationFrameId = requestAnimationFrame(render);
      } else {
        isRendering = false;
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInView = entry.isIntersecting;
        if (isInView) {
          wake(90);
        } else {
          isRendering = false;
          cancelAnimationFrame(animationFrameId);
        }
      },
      { threshold: 0.05 }
    );

    if (canvas) {
      observer.observe(canvas);
    }

    return () => {
      isRunning = false;
      isRendering = false;
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
      if (idleTimer !== null) clearTimeout(idleTimer);
      if (captionTimer !== null) clearTimeout(captionTimer);
      if (progressTimer !== null) clearTimeout(progressTimer);
      for (const tid of hintTimeouts) {
        clearTimeout(tid);
      }
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className="hero-fluid-container">
      {/* Background WebGL Navier-Stokes Fluid Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.6s ease'
        }}
        className="hero-fluid-canvas"
      />

      {/* Progress Loader (Shows 0-100% until textures are ready) */}
      <div
        className={`hero-loader-overlay ${isLoaded ? 'hero-loader-overlay--hidden' : ''}`}
        aria-hidden={isLoaded}
      >
        <div className="hero-progress-spinner-wrap">
          <svg className="hero-progress-svg" viewBox="0 0 44 44">
            <circle
              className="hero-progress-bg"
              cx="22"
              cy="22"
              r="19"
            />
            <circle
              className="hero-progress-bar"
              cx="22"
              cy="22"
              r="19"
              strokeDasharray="119.38"
              style={{
                strokeDashoffset: 119.38 - (119.38 * progress) / 100
              }}
            />
          </svg>
          <span className="hero-progress-text">{progress}%</span>
        </div>
      </div>

      {/* Mobile/Touch Interaction Micro-Copy Caption */}
      <div ref={captionRef} className="hero-touch-hint" aria-hidden="true">
        <span className="hero-touch-hint-pulse" />
        <span>Touch &amp; drag to reveal</span>
      </div>

      {/* Foreground Accessibility & Portfolio Typography Overlay */}
      <div className="hero-overlay-wrapper">

        <header className="hero-top-nav" style={{ justifyContent: 'space-between' }}>
          <div className="hero-top-left">
          </div>

          <div className="hero-social-links">
            <a
              href="https://github.com/kaschefi"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-icon-btn"
              aria-label="GitHub Profile"
            >
              <svg className="hero-svg-icon" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/mkashefirad/"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-icon-btn"
              aria-label="LinkedIn Profile"
            >
              <svg className="hero-svg-icon" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
            </a>
            <button
              onClick={onOpenEmail || (() => window.location.href = "mailto:mohammad.kashefirad@stud.hcw.ac.at")}
              className="hero-icon-btn"
              aria-label="Contact via Email"
              type="button"
            >
              <Mail className="hero-lucide-icon" />
            </button>
          </div>
        </header>


        {/* Center / Lower Hero Headline & Narrative */}
        <div className="hero-center-content">
          <div className="hero-eyebrow">
            <span>FOLIO // 2026</span>
          </div>

          <h1 className="hero-title hero-title--serif">
            Mohammad <br />
            <span className="hero-title-name">
              Kashefirad
            </span>
          </h1>

          <div className="hero-subhead">
            <span>Student at Hochschule Campus Wien</span>
          </div>

          <p className="hero-description">
            I'm an engineer working at the intersection of autonomous agents, robotics kinematics, backend infrastructure and website development.
          </p>

          <div className="hero-cta-row">
            <button
              onClick={onExploreBookshelf}
              className="hero-outline-btn hero-outline-btn--primary"
            >
              <span>Explore Projects</span>
              <ArrowDown className="hero-btn-arrow" />
            </button>


            <a
              href="https://github.com/kaschefi"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-outline-btn"
            >
              <TerminalIcon className="hero-btn-terminal" />
              <span>Repositories</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
