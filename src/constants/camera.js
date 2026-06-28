// Camera and OrbitControls configuration

export const cameraConfig = {
  fov: 45,
  near: 0.1,
  far: 1000,
  position: { x: 6.096062189226614, y: 4.904207965983131, z: 5.921979211737337 },
};

export const controlsConfig = {
  enableDamping: true,
  dampingFactor: 0.05,
  target: { x: -0.4157927443992023, y: 1.0391870673201113, z: -0.37819867418043385 },

  // Uncomment to enable movement limits:
  // minDistance: 3,
  // maxDistance: 20,
  // minPolarAngle: Math.PI / 18,
  // maxPolarAngle: Math.PI / 2,
  // minAzimuthAngle: 0,
  // maxAzimuthAngle: Math.PI / 2.3,
};

// Renderer settings
export const rendererConfig = {
  antialias: true,
  maxPixelRatio: 2,
};
