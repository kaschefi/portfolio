import * as THREE from 'three';

export interface SplatImpulse {
  x: number;
  y: number;
  radius: number;
  opacity: number;
}

export default class MouseTrail {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D | null;
  public texture: THREE.CanvasTexture;
  public lineWidth: number = 100;
  public currentX: number | null = null;
  public currentY: number | null = null;
  public lastX: number | null = null;
  public lastY: number | null = null;
  public opacity: number = 0;
  public lerpSpeed: number = 0.085;
  public fadeInSpeed: number = 0.12;
  public fadeOutSpeed: number = 0.05;
  public moveThreshold: number = 0.4;
  private _bursts: Array<{ x: number; y: number; radius: number; opacity: number; decay: number }> = [];

  constructor(width: number, height: number) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = Math.max(1, width);
    this.canvas.height = Math.max(1, height);
    this.ctx = this.canvas.getContext('2d');
    this.lineWidth = Math.max(width * 0.18, 90);

    if (this.ctx) {
      this.ctx.fillStyle = 'white';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.LinearFilter;
    this.texture.generateMipmaps = false;
  }

  update(mouseX: number, mouseY: number) {
    const targetX = mouseX * this.canvas.width;
    const targetY = (1 - mouseY) * this.canvas.height;

    if (this.currentX === null || this.currentY === null || this.lastX === null || this.lastY === null) {
      this.currentX = targetX;
      this.currentY = targetY;
      this.lastX = targetX;
      this.lastY = targetY;
      return;
    }

    this.#lerp(targetX, targetY);
    this.#updateOpacity();
    this.#draw();

    this.lastX = this.currentX;
    this.lastY = this.currentY;
    this.texture.needsUpdate = true;
  }

  /**
   * Scroll animation impulse: injects fluid waves / swirls across the canvas when user scrolls
   */
  triggerScrollImpulse(deltaY: number, scrollProgress: number) {
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Generate fluid splat positioned based on scroll progress and normalized speed
    const normalizedSpeed = Math.min(Math.abs(deltaY) / 100, 1.5);
    const radius = Math.max(w * 0.15, 80) * (0.8 + normalizedSpeed * 0.4);

    // Dynamic wave positioning
    const x = w * (0.3 + 0.4 * Math.sin(scrollProgress * Math.PI * 3 + Date.now() * 0.002));
    const y = h * (0.2 + 0.6 * scrollProgress);

    this._bursts.push({
      x,
      y,
      radius,
      opacity: Math.min(1.0, 0.45 + normalizedSpeed * 0.5),
      decay: 0.035,
    });

    // Also wake up current trail point
    this.opacity = Math.min(1, this.opacity + 0.4);
    this.texture.needsUpdate = true;
  }

  triggerRandomBurst() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    this._bursts.push({
      x: w * (0.35 + Math.random() * 0.3),
      y: h * (0.35 + Math.random() * 0.3),
      radius: Math.max(w * 0.22, 120),
      opacity: 0.85,
      decay: 0.025,
    });
    this.texture.needsUpdate = true;
  }

  hasActiveMotion(): boolean {
    return this.opacity > 0.005 || this._bursts.length > 0;
  }

  #lerp(targetX: number, targetY: number) {
    if (this.currentX !== null && this.currentY !== null) {
      this.currentX += (targetX - this.currentX) * this.lerpSpeed;
      this.currentY += (targetY - this.currentY) * this.lerpSpeed;
    }
  }

  #updateOpacity() {
    if (this.currentX === null || this.lastX === null || this.currentY === null || this.lastY === null) return;
    const dx = this.currentX - this.lastX;
    const dy = this.currentY - this.lastY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > this.moveThreshold) {
      this.opacity = Math.min(1, this.opacity + this.fadeInSpeed);
    } else {
      this.opacity = Math.max(0, this.opacity - this.fadeOutSpeed);
    }
  }

  #draw() {
    const { canvas, ctx, lineWidth } = this;
    if (!ctx) return;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 1. Draw pointer stroke
    if (this.opacity > 0.01 && this.lastX !== null && this.lastY !== null && this.currentX !== null && this.currentY !== null) {
      ctx.beginPath();
      ctx.moveTo(this.lastX, this.lastY);
      ctx.lineTo(this.currentX, this.currentY);
      ctx.lineCap = 'round';
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = `rgba(0, 0, 0, ${this.opacity})`;
      ctx.stroke();
    }

    // 2. Draw active scroll / introductory bursts
    for (let i = this._bursts.length - 1; i >= 0; i--) {
      const b = this._bursts[i];
      if (b.opacity > 0.01) {
        const gradient = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
        gradient.addColorStop(0, `rgba(0, 0, 0, ${b.opacity})`);
        gradient.addColorStop(0.7, `rgba(0, 0, 0, ${b.opacity * 0.6})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();

        b.opacity -= b.decay;
        b.radius += 1.2;
      } else {
        this._bursts.splice(i, 1);
      }
    }
  }

  onResize(width: number, height: number) {
    this.canvas.width = Math.max(1, width);
    this.canvas.height = Math.max(1, height);
    this.lineWidth = Math.max(width * 0.18, 90);
    this.currentX = null;
    this.currentY = null;
    this.lastX = null;
    this.lastY = null;
    if (this.ctx) {
      this.ctx.fillStyle = 'white';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    this.texture.needsUpdate = true;
  }

  dispose() {
    this.texture.dispose();
    this._bursts = [];
  }
}
