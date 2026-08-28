import * as THREE from 'three/webgpu';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { CameraRig } from './CameraRig';
import InstancedModel from './InstancedModel';
import MouseTrail from './MouseTrail';
import FluidSim from './FluidSim';
import PostProcessing from './PostProcessing';

export interface HeroThreeSceneOptions {
  canvas: HTMLCanvasElement;
  onLoaded?: () => void;
}

export class HeroThreeScene {
  public canvas: HTMLCanvasElement;
  public renderer!: THREE.WebGPURenderer;
  public clock: THREE.Clock;
  public solidScene!: THREE.Scene;
  public wireScene!: THREE.Scene;
  public camera!: THREE.PerspectiveCamera;
  public cameraRig!: CameraRig;
  public mouseTrail!: MouseTrail;
  public fluidSim!: FluidSim;
  public postProcessing!: PostProcessing;
  public solidModel!: InstancedModel;
  public wireModel!: InstancedModel;
  public envMap!: THREE.Texture;

  private _isDisposed: boolean = false;
  private _isRendering: boolean = false;
  private _motionFrames: number = 180; // Start with intro animation frames
  private _rafId: number | null = null;
  private _width: number = 1;
  private _height: number = 1;
  private _pixelRatio: number = 1;
  public ready!: Promise<void>;

  constructor({ canvas, onLoaded }: HeroThreeSceneOptions) {
    this.canvas = canvas;
    this.clock = new THREE.Clock();

    this._pixelRatio = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.0);

    this.ready = this.#init().then(() => {
      onLoaded?.();
    });
  }

  async #init() {
    // 1. Initialize WebGPU Renderer
    this.renderer = new THREE.WebGPURenderer({
      canvas: this.canvas,
      antialias: false,
      powerPreference: 'default',
    });

    await this.renderer.init();

    if (this._isDisposed) return;

    this._width = this.canvas.parentElement?.clientWidth || window.innerWidth;
    this._height = this.canvas.parentElement?.clientHeight || window.innerHeight;

    this.renderer.setSize(this._width, this._height);
    this.renderer.setPixelRatio(this._pixelRatio);
    this.renderer.shadowMap.enabled = false;
    this.renderer.autoClear = false;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;

    // 2. Environment & Lighting
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.envMap = pmremGenerator.fromScene(new RoomEnvironment()).texture;
    pmremGenerator.dispose();

    this.solidScene = this.#createScene();
    this.wireScene = this.#createScene();

    // 3. Camera & CameraRig
    this.camera = new THREE.PerspectiveCamera(17, this._width / this._height, 0.1, 100);
    this.cameraRig = new CameraRig(this.camera);

    // 4. Instanced Models
    const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
    const manUrl = `${base}models/man_comp-transformed.glb`;
    const skeletonUrl = `${base}models/skeleton_comp-transformed.glb`;

    this.solidModel = new InstancedModel(this.solidScene, {
      url: manUrl,
      meshName: 'body',
      heightMax: 1.0,
      roughness: 1.0,
      color: new THREE.Color(0.2, 0.6, 1.0),
      emissiveIntensity: 0.75,
      count: 12,
      spacing: 0.65,
    });

    this.wireModel = new InstancedModel(this.wireScene, {
      url: skeletonUrl,
      meshName: 'skeleton',
      heightMax: 0.9,
      roughness: 0.9,
      color: new THREE.Color(0.2, 0.6, 1.0),
      emissiveIntensity: 0.75,
      count: 12,
      spacing: 0.65,
    });

    // 5. Mouse Trail & Fluid Sim
    const simW = Math.round(this._width * this._pixelRatio);
    const simH = Math.round(this._height * this._pixelRatio);
    this.mouseTrail = new MouseTrail(simW, simH);
    this.fluidSim = new FluidSim(simW, simH);

    // 6. Post Processing Pipeline
    this.postProcessing = new PostProcessing(
      this.renderer,
      this.solidScene,
      this.wireScene,
      this.camera,
      this.fluidSim.texture,
    );

    // Wait for GLTFs to complete loading
    await Promise.all([this.solidModel.ready, this.wireModel.ready]);

    // Initial wake-up for initial render
    this.wakeUp(60);

    // Start loop
    this.#startLoop();
  }

  #createScene(): THREE.Scene {
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0d14, 1.2, 3.2);
    scene.background = new THREE.Color(0x0a0d14);
    scene.environment = this.envMap;
    scene.environmentIntensity = 0.12;

    const light = new THREE.PointLight(0x3884ff, 0.85, 10);
    light.position.set(1.2, 2.2, 1.2);
    scene.add(light);

    const ambient = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambient);

    return scene;
  }

  public wakeUp(frames: number = 60) {
    this._motionFrames = Math.max(this._motionFrames, frames);
    if (!this._isRendering && !this._isDisposed) {
      this.#startLoop();
    }
  }

  public onPointerMove(clientX: number, clientY: number) {
    if (!this.cameraRig) return;
    this.cameraRig.setPointer(clientX, clientY, this._width, this._height);
    this.wakeUp(45);
  }

  public onScroll(deltaY: number, progress: number) {
    if (!this.cameraRig || !this.mouseTrail) return;
    this.cameraRig.setScrollProgress(progress);
    this.mouseTrail.triggerScrollImpulse(deltaY, progress);
    this.wakeUp(75);
  }

  public onResize(width: number, height: number) {
    if (!this.renderer || !this.camera) return;
    this._width = Math.max(1, width);
    this._height = Math.max(1, height);
    this._pixelRatio = Math.min(window.devicePixelRatio || 1, 1.0);

    this.renderer.setSize(this._width, this._height);
    this.renderer.setPixelRatio(this._pixelRatio);

    this.camera.aspect = this._width / this._height;
    this.camera.updateProjectionMatrix();

    const simW = Math.round(this._width * this._pixelRatio);
    const simH = Math.round(this._height * this._pixelRatio);
    this.mouseTrail?.onResize(simW, simH);
    this.fluidSim?.onResize(simW, simH);

    this.wakeUp(40);
  }

  #startLoop() {
    if (this._isRendering || this._isDisposed) return;
    this._isRendering = true;

    const loop = () => {
      if (this._isDisposed) return;

      const hasTrail = this.mouseTrail ? this.mouseTrail.hasActiveMotion() : false;

      if (this._motionFrames > 0 || hasTrail) {
        if (this._motionFrames > 0) this._motionFrames--;

        const delta = Math.min(this.clock.getDelta(), 0.05);
        const elapsed = this.clock.elapsedTime;

        // 1. Camera rig
        this.cameraRig?.update(delta, elapsed);

        // 2. Mouse trail & fluid sim
        if (this.mouseTrail && this.cameraRig && this.fluidSim) {
          this.mouseTrail.update(
            this.cameraRig.mouseNormalized.x,
            this.cameraRig.mouseNormalized.y,
          );
          this.fluidSim.update(this.renderer, this.mouseTrail.texture);
        }

        // 3. Render Post-Processing
        this.postProcessing?.render();

        this._rafId = requestAnimationFrame(loop);
      } else {
        // Sleep WebGL render loop (Zero idle load: 0 FPS / 0% GPU)
        this._isRendering = false;
        this._rafId = null;
      }
    };

    this._rafId = requestAnimationFrame(loop);
  }

  public dispose() {
    this._isDisposed = true;
    if (this._rafId !== null) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
    this._isRendering = false;

    this.solidModel?.dispose();
    this.wireModel?.dispose();
    this.mouseTrail?.dispose();
    this.fluidSim?.dispose();
    this.postProcessing?.dispose();
    this.envMap?.dispose();
    this.renderer?.dispose();
  }
}
