import * as THREE from 'three/webgpu';
import ImportGltf from './ImportGltf';
import { createFresnelMaterial } from './fresnelMaterial';

export interface InstancedModelOptions {
  url: string;
  meshName?: string;
  heightMax?: number;
  roughness?: number;
  color?: any;
  emissiveIntensity?: number;
  count?: number;
  spacing?: number;
}

export default class InstancedModel {
  public scene: THREE.Scene;
  public count: number;
  public spacing: number;
  public mesh: THREE.InstancedMesh | null = null;
  public ready: Promise<THREE.Group>;

  constructor(
    scene: THREE.Scene,
    {
      url,
      meshName: _meshName,
      heightMax = 1.0,
      roughness = 1.0,
      color,
      emissiveIntensity,
      count = 12,
      spacing = 0.65,
    }: InstancedModelOptions,
  ) {
    this.scene = scene;
    this.count = count;
    this.spacing = spacing;

    const gltf = new ImportGltf(url, {
      onLoad: (model) => {
        let geometry: THREE.BufferGeometry | null = null;
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            if (!geometry) {
              geometry = (child as THREE.Mesh).geometry;
            }
          }
        });

        if (geometry) {
          const material = createFresnelMaterial({
            heightMax,
            roughness,
            color,
            emissiveIntensity,
          });
          const mesh = new THREE.InstancedMesh(geometry, material, this.count);
          this.#setPositions(mesh);
          this.scene.add(mesh);
          this.mesh = mesh;
        }
      },
    });
    this.ready = gltf.ready;
  }

  #setPositions(mesh: THREE.InstancedMesh) {
    const { count, spacing } = this;
    const gridSize = Math.ceil(Math.sqrt(count));
    const halfSize = ((gridSize - 1) * spacing) / 2;
    const spacingZ = spacing * 0.65;
    const halfSizeZ = ((gridSize - 1) * spacingZ) / 2;
    const dummy = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
      const x = i % gridSize;
      const z = Math.floor(i / gridSize);
      const xOffset = z % 2 === 1 ? spacing / 2 : 0;

      dummy.position.set(
        x * spacing - halfSize + xOffset,
        0,
        z * spacingZ - halfSizeZ,
      );
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }

  dispose() {
    if (this.mesh) {
      this.scene.remove(this.mesh);
      this.mesh.geometry.dispose();
      if (Array.isArray(this.mesh.material)) {
        this.mesh.material.forEach((m: THREE.Material) => m.dispose());
      } else {
        (this.mesh.material as THREE.Material).dispose();
      }
      this.mesh = null;
    }
  }
}
