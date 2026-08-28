import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import * as THREE from 'three';

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
loader.setDRACOLoader(dracoLoader);

export default class ImportGltf {
  public ready: Promise<THREE.Group>;

  constructor(url: string, { onLoad }: { onLoad?: (scene: THREE.Group) => void } = {}) {
    this.ready = new Promise((resolve, reject) => {
      loader.load(
        url,
        (gltf) => {
          onLoad?.(gltf.scene);
          resolve(gltf.scene);
        },
        undefined,
        (error) => {
          console.error('GLTF load error for url:', url, error);
          reject(error);
        },
      );
    });
  }
}
