// Material configuration for special mesh types
// These are applied to meshes based on name matching in the GLB model

export const glassMaterialConfig = {
  transmission: 1,
  opacity: 1,
  metalness: 0,
  roughness: 0,
  ior: 1.5,
  thickness: 0.01,
  specularIntensity: 1,
  envMapIntensity: 1,
  depthWrite: false,
};

export const whiteMaterialConfig = {
  color: 0xffffff,
};

export const waterMaterialConfig = {
  color: 0x558BC8,
  transparent: true,
  opacity: 0.6,
  depthWrite: false,
};

// Object name patterns used for material assignment
export const meshPatterns = {
  glass: "Glass",
  bubble: "Bubble",
  screen: "Screen",
  water: "Water",
  raycaster: "Raycaster",
  hover: "Hover",
  pointer: "Pointer",
};
