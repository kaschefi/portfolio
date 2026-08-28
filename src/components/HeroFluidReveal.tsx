import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, Mail, Sparkles, Terminal as TerminalIcon } from 'lucide-react';

interface HeroFluidRevealProps {
  onExploreBookshelf?: () => void;
}

export const HeroFluidReveal: React.FC<HeroFluidRevealProps> = ({ onExploreBookshelf }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', { alpha: false, depth: false, antialias: false }) ||
      canvas.getContext('webgl', { alpha: false, depth: false, antialias: false });

    if (!gl) {
      console.warn('WebGL is not available for fluid simulation');
      return;
    }

    // Shader compiler helper
    const createShader = (type: number, source: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, source);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error('Shader error:', gl.getShaderInfoLog(s));
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

    // Full-screen Quad
    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
        -1,  1,
         1, -1,
         1,  1
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

    const baseVS = `
      attribute vec2 aPosition;
      varying vec2 vUV;
      void main() {
        vUV = (aPosition + 1.0) * 0.5;
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    // 1. Advect
    const advectFS = `
      precision highp float;
      varying vec2 vUV;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 uTexelSize;
      uniform float uDt;
      uniform float uDissipation;

      void main() {
        vec2 coord = vUV - uDt * texture2D(uVelocity, vUV).xy * uTexelSize;
        gl_FragColor = uDissipation * texture2D(uSource, coord);
      }
    `;

    // 2. Splat
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

    // 3. Divergence
    const divergenceFS = `
      precision highp float;
      varying vec2 vUV;
      uniform sampler2D uVelocity;
      uniform vec2 uTexelSize;

      void main() {
        float L = texture2D(uVelocity, vUV - vec2(uTexelSize.x, 0.0)).x;
        float R = texture2D(uVelocity, vUV + vec2(uTexelSize.x, 0.0)).x;
        float T = texture2D(uVelocity, vUV + vec2(0.0, uTexelSize.y)).y;
        float B = texture2D(uVelocity, vUV - vec2(0.0, uTexelSize.y)).y;
        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `;

    // 4. Pressure Solver
    const pressureFS = `
      precision highp float;
      varying vec2 vUV;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;
      uniform vec2 uTexelSize;

      void main() {
        float L = texture2D(uPressure, vUV - vec2(uTexelSize.x, 0.0)).x;
        float R = texture2D(uPressure, vUV + vec2(uTexelSize.x, 0.0)).x;
        float T = texture2D(uPressure, vUV + vec2(0.0, uTexelSize.y)).x;
        float B = texture2D(uPressure, vUV - vec2(0.0, uTexelSize.y)).x;
        float div = texture2D(uDivergence, vUV).x;
        float p = (L + R + T + B - div) * 0.25;
        gl_FragColor = vec4(p, 0.0, 0.0, 1.0);
      }
    `;

    // 5. Gradient Subtraction
    const gradSubFS = `
      precision highp float;
      varying vec2 vUV;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;
      uniform vec2 uTexelSize;

      void main() {
        float L = texture2D(uPressure, vUV - vec2(uTexelSize.x, 0.0)).x;
        float R = texture2D(uPressure, vUV + vec2(uTexelSize.x, 0.0)).x;
        float T = texture2D(uPressure, vUV + vec2(0.0, uTexelSize.y)).x;
        float B = texture2D(uPressure, vUV - vec2(0.0, uTexelSize.y)).x;
        vec2 vel = texture2D(uVelocity, vUV).xy;
        vel -= 0.5 * vec2(R - L, T - B);
        gl_FragColor = vec4(vel, 0.0, 1.0);
      }
    `;

    // 6. Final Composite Shader
    const compositeFS = `
      precision highp float;
      varying vec2 vUV;
      uniform sampler2D uDensity;
      uniform sampler2D uFrontTexture;
      uniform sampler2D uBackTexture;
      uniform vec2 uResolution;
      uniform vec2 uImageResolution;
      uniform float uTime;

      vec2 getFitUV(vec2 uv, vec2 screenRes, vec2 imgRes) {
        float screenAspect = screenRes.x / screenRes.y;
        float imgAspect = imgRes.x / imgRes.y;
        
        // Scale factor: maintain good vertical dominance while staying contained
        float scale = 0.92;
        vec2 centered = uv - 0.5;
        
        if (screenAspect > imgAspect) {
          centered.x *= (screenAspect / imgAspect);
        } else {
          centered.y *= (imgAspect / screenAspect);
        }
        
        return (centered / scale) + 0.5;
      }

      void main() {
        vec2 fitUV = getFitUV(vUV, uResolution, uImageResolution);
        
        // Sample fluid density
        float fluidVal = texture2D(uDensity, vUV).r;
        
        // Calculate fluid gradient for refractive chromatic aberration
        vec2 eps = vec2(1.0 / uResolution.x, 1.0 / uResolution.y) * 2.5;
        float fluidR = texture2D(uDensity, vUV + vec2(eps.x, 0.0)).r;
        float fluidL = texture2D(uDensity, vUV - vec2(eps.x, 0.0)).r;
        float fluidT = texture2D(uDensity, vUV + vec2(0.0, eps.y)).r;
        float fluidB = texture2D(uDensity, vUV - vec2(0.0, eps.y)).r;
        vec2 fluidGrad = vec2(fluidR - fluidL, fluidT - fluidB);
        
        vec2 distort = fluidGrad * 0.04;
        
        bool inBounds = (fitUV.x >= 0.0 && fitUV.x <= 1.0 && fitUV.y >= 0.0 && fitUV.y <= 1.0);
        
        // Sample Layer 1: Front (robotme.png)
        vec4 frontCol = inBounds ? texture2D(uFrontTexture, fitUV) : vec4(0.0);
        
        // Sample Layer 2: Back (me.png) with chromatic aberration
        vec2 backUV = fitUV + distort;
        bool inBoundsBack = (backUV.x >= 0.0 && backUV.x <= 1.0 && backUV.y >= 0.0 && backUV.y <= 1.0);
        
        vec4 backCol = vec4(0.0);
        if (inBoundsBack) {
          float r = texture2D(uBackTexture, backUV + distort * 0.4).r;
          float g = texture2D(uBackTexture, backUV).g;
          float b = texture2D(uBackTexture, backUV - distort * 0.4).b;
          float a = texture2D(uBackTexture, backUV).a;
          backCol = vec4(r, g, b, a);
        }
        
        float revealAmount = smoothstep(0.04, 0.82, fluidVal);
        
        // Fluid edge glow
        float edgeGlow = smoothstep(0.01, 0.18, length(fluidGrad)) * (1.0 - revealAmount) * 0.75;
        vec3 glowColor = vec3(0.35, 0.7, 1.0) * edgeGlow * fluidVal;
        
        vec4 compositeSubject = mix(frontCol, backCol, revealAmount);
        compositeSubject.rgb += glowColor;
        
        // Dark atmosphere backdrop
        vec3 bg = vec3(0.039, 0.051, 0.078);
        
        // Subtle ambient spotlight
        float centerDist = length(vUV - vec2(0.5, 0.5));
        float spotGlow = exp(-centerDist * 2.0) * 0.08;
        bg += vec3(0.12, 0.18, 0.28) * spotGlow;
        
        // Fluid vapor in ambient background
        bg += vec3(0.04, 0.08, 0.16) * fluidVal * 0.35;
        
        vec3 finalRGB = mix(bg, compositeSubject.rgb, compositeSubject.a);
        
        gl_FragColor = vec4(finalRGB, 1.0);
      }
    `;

    const progAdvect = createProgram(baseVS, advectFS);
    const progSplat = createProgram(baseVS, splatFS);
    const progDivergence = createProgram(baseVS, divergenceFS);
    const progPressure = createProgram(baseVS, pressureFS);
    const progGradSub = createProgram(baseVS, gradSubFS);
    const progComposite = createProgram(baseVS, compositeFS);

    if (!progAdvect || !progSplat || !progDivergence || !progPressure || !progGradSub || !progComposite) {
      return;
    }

    const simRes = 256;
    const createFBO = (w: number, h: number) => {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);

      return { fbo, tex, width: w, height: h };
    };

    const createDoubleFBO = (w: number, h: number) => {
      let fbo1 = createFBO(w, h);
      let fbo2 = createFBO(w, h);
      return {
        get read() { return fbo1; },
        get write() { return fbo2; },
        swap() { const tmp = fbo1; fbo1 = fbo2; fbo2 = tmp; }
      };
    };

    let density = createDoubleFBO(simRes, simRes);
    let velocity = createDoubleFBO(simRes, simRes);
    let divergence = createFBO(simRes, simRes);
    let pressure = createDoubleFBO(simRes, simRes);

    const loadTexture = (url: string, onLoad?: (img: HTMLImageElement) => void) => {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([10, 13, 20, 255]));

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;
      img.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        if (onLoad) onLoad(img);
      };

      return tex;
    };

    let imageDimensions = { width: 1952, height: 2150 };
    let loadedCount = 0;
    const checkLoaded = () => {
      loadedCount++;
      if (loadedCount >= 2) {
        setIsLoaded(true);
      }
    };

    const frontTexture = loadTexture('/robotme.png', (img) => {
      imageDimensions = { width: img.naturalWidth || 1952, height: img.naturalHeight || 2150 };
      checkLoaded();
    });

    const backTexture = loadTexture('/me.png', () => {
      checkLoaded();
    });

    const splats: Array<{ x: number; y: number; dx: number; dy: number; color: [number, number, number] }> = [];
    let lastX = 0;
    let lastY = 0;
    let hasMoved = false;

    const addSplat = (x: number, y: number, dx: number, dy: number) => {
      const rect = canvas.getBoundingClientRect();
      const nx = (x - rect.left) / rect.width;
      const ny = 1.0 - (y - rect.top) / rect.height;

      splats.push({
        x: nx,
        y: ny,
        dx: dx * 3.2,
        dy: -dy * 3.2,
        color: [1.3, 1.3, 1.3]
      });
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }

      if (!hasMoved) {
        lastX = clientX;
        lastY = clientY;
        hasMoved = true;
        return;
      }

      const dx = clientX - lastX;
      const dy = clientY - lastY;
      lastX = clientX;
      lastY = clientY;

      if (Math.abs(dx) > 0.4 || Math.abs(dy) > 0.4) {
        addSplat(clientX, clientY, dx, dy);
      }
    };

    const addRandomImpulse = () => {
      const rx = 0.38 + Math.random() * 0.24;
      const ry = 0.42 + Math.random() * 0.24;
      const angle = Math.random() * Math.PI * 2;
      splats.push({
        x: rx,
        y: ry,
        dx: Math.cos(angle) * 7.5,
        dy: Math.sin(angle) * 7.5,
        color: [1.1, 1.1, 1.1]
      });
    };

    setTimeout(() => addRandomImpulse(), 300);
    setTimeout(() => addRandomImpulse(), 750);

    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      gl.viewport(0, 0, width, height);
    };

    window.addEventListener('resize', onResize);

    let animationFrameId: number;
    let lastTime = performance.now();

    const render = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.032);
      lastTime = now;

      // 1. Splats
      while (splats.length > 0) {
        const s = splats.pop()!;

        // Splat into Velocity
        gl.viewport(0, 0, simRes, simRes);
        bindQuad(progSplat);
        gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.write.fbo);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
        gl.uniform1i(gl.getUniformLocation(progSplat, 'uTarget'), 0);
        gl.uniform1f(gl.getUniformLocation(progSplat, 'uAspectRatio'), width / height);
        gl.uniform2f(gl.getUniformLocation(progSplat, 'uPoint'), s.x, s.y);
        gl.uniform3f(gl.getUniformLocation(progSplat, 'uColor'), s.dx, s.dy, 0.0);
        gl.uniform1f(gl.getUniformLocation(progSplat, 'uRadius'), 0.0035);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        velocity.swap();

        // Splat into Density
        gl.bindFramebuffer(gl.FRAMEBUFFER, density.write.fbo);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, density.read.tex);
        gl.uniform1i(gl.getUniformLocation(progSplat, 'uTarget'), 0);
        gl.uniform3f(gl.getUniformLocation(progSplat, 'uColor'), s.color[0], s.color[1], s.color[2]);
        gl.uniform1f(gl.getUniformLocation(progSplat, 'uRadius'), 0.0045);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        density.swap();
      }

      // 2. Advect Velocity
      gl.viewport(0, 0, simRes, simRes);
      bindQuad(progAdvect);
      gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.write.fbo);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
      gl.uniform1i(gl.getUniformLocation(progAdvect, 'uVelocity'), 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
      gl.uniform1i(gl.getUniformLocation(progAdvect, 'uSource'), 1);
      gl.uniform2f(gl.getUniformLocation(progAdvect, 'uTexelSize'), 1.0 / simRes, 1.0 / simRes);
      gl.uniform1f(gl.getUniformLocation(progAdvect, 'uDt'), dt);
      gl.uniform1f(gl.getUniformLocation(progAdvect, 'uDissipation'), 0.985);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      velocity.swap();

      // 3. Advect Density
      gl.bindFramebuffer(gl.FRAMEBUFFER, density.write.fbo);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
      gl.uniform1i(gl.getUniformLocation(progAdvect, 'uVelocity'), 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, density.read.tex);
      gl.uniform1i(gl.getUniformLocation(progAdvect, 'uSource'), 1);
      gl.uniform1f(gl.getUniformLocation(progAdvect, 'uDissipation'), 0.978);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      density.swap();

      // 4. Calculate Divergence
      bindQuad(progDivergence);
      gl.bindFramebuffer(gl.FRAMEBUFFER, divergence.fbo);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
      gl.uniform1i(gl.getUniformLocation(progDivergence, 'uVelocity'), 0);
      gl.uniform2f(gl.getUniformLocation(progDivergence, 'uTexelSize'), 1.0 / simRes, 1.0 / simRes);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      // 5. Pressure Poisson Solver
      bindQuad(progPressure);
      gl.uniform2f(gl.getUniformLocation(progPressure, 'uTexelSize'), 1.0 / simRes, 1.0 / simRes);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, divergence.tex);
      gl.uniform1i(gl.getUniformLocation(progPressure, 'uDivergence'), 1);

      for (let i = 0; i < 16; i++) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, pressure.write.fbo);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, pressure.read.tex);
        gl.uniform1i(gl.getUniformLocation(progPressure, 'uPressure'), 0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        pressure.swap();
      }

      // 6. Gradient Subtraction
      bindQuad(progGradSub);
      gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.write.fbo);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, pressure.read.tex);
      gl.uniform1i(gl.getUniformLocation(progGradSub, 'uPressure'), 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
      gl.uniform1i(gl.getUniformLocation(progGradSub, 'uVelocity'), 1);
      gl.uniform2f(gl.getUniformLocation(progGradSub, 'uTexelSize'), 1.0 / simRes, 1.0 / simRes);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      velocity.swap();

      // 7. Composite Pass
      gl.viewport(0, 0, width, height);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      bindQuad(progComposite);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, density.read.tex);
      gl.uniform1i(gl.getUniformLocation(progComposite, 'uDensity'), 0);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, frontTexture);
      gl.uniform1i(gl.getUniformLocation(progComposite, 'uFrontTexture'), 1);

      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, backTexture);
      gl.uniform1i(gl.getUniformLocation(progComposite, 'uBackTexture'), 2);

      gl.uniform2f(gl.getUniformLocation(progComposite, 'uResolution'), width, height);
      gl.uniform2f(gl.getUniformLocation(progComposite, 'uImageResolution'), imageDimensions.width, imageDimensions.height);
      gl.uniform1f(gl.getUniformLocation(progComposite, 'uTime'), now * 0.001);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className="hero-fluid-container">
      {/* Background WebGL Fluid Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.6s ease'
        }}
        className="hero-fluid-canvas"
      />

      {/* Foreground Accessibility & Portfolio Typography Overlay */}
      <div className="hero-overlay-wrapper">
        {/* Top Navigation Bar */}
        <header className="hero-top-nav">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            <span className="hero-badge-text">
              Autonomous Systems & ML Engineer
            </span>
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
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-icon-btn"
              aria-label="LinkedIn Profile"
            >
              <svg className="hero-svg-icon" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
            </a>
            <a
              href="mailto:contact@kaschefi.dev"
              className="hero-icon-btn"
              aria-label="Email Contact"
            >
              <Mail className="hero-lucide-icon" />
            </a>
          </div>
        </header>

        {/* Center / Lower Hero Headline & Narrative */}
        <div className="hero-center-content">
          <div className="hero-kicker">
            <Sparkles className="hero-kicker-icon" />
            <span>Interactive Navier-Stokes Fluid Reveal</span>
          </div>

          <h1 className="hero-title">
            Mohammad <br />
            <span className="hero-title-gradient">
              Kashefirad
            </span>
          </h1>

          <p className="hero-description">
            Pioneering autonomous AI agents, robotics kinematics, and fine-grained vision models. Move your cursor to dissolve the cybernetic layer and reveal the engineer behind the code.
          </p>

          <div className="hero-cta-row">
            <button
              onClick={onExploreBookshelf}
              className="hero-primary-btn"
            >
              <span>Explore 3D Bookshelf</span>
              <ArrowDown className="hero-btn-arrow" />
            </button>

            <a
              href="https://github.com/kaschefi"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-secondary-btn"
            >
              <TerminalIcon className="hero-btn-terminal" />
              <span>Repositories</span>
            </a>
          </div>
        </div>

        {/* Bottom Hint */}
        <footer className="hero-footer">
          <div className="hero-footer-left">
            <span className="hero-ping-dot" />
            <span>Interactive Cursor: Hover over portrait to reveal human layer</span>
          </div>
          <button
            onClick={onExploreBookshelf}
            className="hero-footer-right"
          >
            <span>Scroll for Case Studies</span>
            <ArrowDown className="hero-footer-arrow" />
          </button>
        </footer>
      </div>
    </div>
  );
};
