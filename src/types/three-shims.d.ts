declare module 'three/webgpu' {
  import * as THREE from 'three';
  export * from 'three';
  export const WebGPURenderer: any;
  export type WebGPURenderer = any;
  export const MeshBasicNodeMaterial: any;
  export type MeshBasicNodeMaterial = any;
  export const MeshStandardNodeMaterial: any;
  export type MeshStandardNodeMaterial = any;
  export const RenderPipeline: any;
  export type RenderPipeline = any;
}

declare module 'three/tsl' {
  export const vec2: any;
  export const vec3: any;
  export const vec4: any;
  export const float: any;
  export const sub: any;
  export const mul: any;
  export const add: any;
  export const min: any;
  export const max: any;
  export const uv: any;
  export const screenUV: any;
  export const texture: any;
  export const Fn: any;
  export const fract: any;
  export const floor: any;
  export const sin: any;
  export const cos: any;
  export const mix: any;
  export const dot: any;
  export const clamp: any;
  export const pow: any;
  export const smoothstep: any;
  export const time: any;
  export const pass: any;
  export const positionLocal: any;
  export const normalView: any;
  export const positionViewDirection: any;
  export const mx_noise_float: any;
}

declare module 'three/addons/tsl/display/BloomNode.js' {
  export const bloom: any;
}
