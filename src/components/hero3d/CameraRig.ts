import * as THREE from 'three';
import { easing } from 'maath';

export class CameraRig {
  public camera: THREE.PerspectiveCamera;
  public basePos: THREE.Vector3;
  public lookAt: THREE.Vector3;
  public mouseNormalized: { x: number; y: number };
  public pointer: { x: number; y: number };
  public smoothTime: number;
  public touchTime: number;
  public isTouch: boolean;
  public isMobile: boolean;
  public scrollProgress: number = 0;
  private _targetPos: [number, number, number] = [0, 0, 0];
  private _targetLookAt: THREE.Vector3 = new THREE.Vector3();

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera;

    this.basePos = new THREE.Vector3(1.5, 1.5, 0.55);
    this.lookAt = new THREE.Vector3(-0.52, 0.45, -0.45);
    this._targetLookAt.copy(this.lookAt);

    this.camera.position.copy(this.basePos);
    this.camera.lookAt(this.lookAt);

    // Normalized mouse (0-1), exposed for MouseTrail
    this.mouseNormalized = { x: 0.5, y: 0.5 };
    // Pointer for camera (-1..1)
    this.pointer = { x: 0, y: 0 };

    this.smoothTime = 0.25;
    this.touchTime = 0;

    this.isTouch =
      typeof window !== 'undefined' &&
      (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window);
    this.isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  }

  setPointer(clientX: number, clientY: number, width: number, height: number) {
    this.mouseNormalized.x = clientX / width;
    this.mouseNormalized.y = 1 - clientY / height;
    this.pointer.x = (clientX / width) * 2 - 1;
    this.pointer.y = -(clientY / height) * 2 + 1;
  }

  setScrollProgress(progress: number) {
    this.scrollProgress = Math.max(0, Math.min(1, progress));
  }

  update(delta: number, elapsed: number, scrollProgress?: number) {
    if (typeof scrollProgress === 'number') {
      this.scrollProgress = Math.max(0, Math.min(1, scrollProgress));
    }

    let pointerX: number;
    let pointerY: number;

    if (this.isTouch) {
      // Figure-8 animation for mobile/touch
      this.touchTime += delta * 0.5;
      pointerX = Math.sin(this.touchTime);
      pointerY = Math.sin(this.touchTime * 0.7) * 0.5;

      // Figure-8 for trail
      const trailT = elapsed * 1.3;
      const tx = Math.sin(trailT);
      const ty = Math.sin(trailT * 2.0);
      this.mouseNormalized.x = 0.5 + tx * 0.4;
      this.mouseNormalized.y = 0.5 + ty * 0.4;
    } else {
      pointerX = this.pointer.x;
      pointerY = this.pointer.y;
    }

    const zoom = this.isMobile ? 1.2 : 1;

    // Scroll-driven camera parallax:
    // As user scrolls through the hero section (0 -> 1), dolly camera closer and tilt down slightly
    const scrollDollyZ = this.scrollProgress * -0.35;
    const scrollOffsetY = this.scrollProgress * -0.22;
    const scrollOffsetX = this.scrollProgress * 0.15;

    this._targetPos[0] =
      this.lookAt.x + (this.basePos.x - this.lookAt.x) * zoom + pointerX * 0.125 + scrollOffsetX;
    this._targetPos[1] =
      this.lookAt.y + (this.basePos.y - this.lookAt.y) * zoom + pointerY * 0.075 + scrollOffsetY;
    this._targetPos[2] =
      this.lookAt.z + (this.basePos.z - this.lookAt.z) * zoom + scrollDollyZ;

    easing.damp3(this.camera.position, this._targetPos, this.smoothTime, delta);

    // Look at interpolation
    this._targetLookAt.set(
      this.lookAt.x + scrollOffsetX * 0.5,
      this.lookAt.y + scrollOffsetY * 0.5,
      this.lookAt.z,
    );
    this.camera.lookAt(this._targetLookAt);
  }
}
