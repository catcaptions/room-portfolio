// ── Textures ──────────────────────────────────────────────

export const textureMap = {
  First: {
    day: "/textures/room/day/First_Bake1_CyclesBake_COMBINED.webp",
    night: "/textures/room/night/First_Bake1_CyclesBake_COMBINED.webp"
  },
  Second: {
    day: "/textures/room/day/Second_Bake1_CyclesBake_COMBINED.webp",
    night: "/textures/room/night/Second_Bake1_CyclesBake_COMBINED.webp"
  },
  Third: {
    day: "/textures/room/day/Third_Bake1_CyclesBake_COMBINED.webp",
    night: "/textures/room/night/Third_Bake1_CyclesBake_COMBINED.webp"
  },
  Fourth: {
    day: "/textures/room/day/Fourth_Bake1_CyclesBake_COMBINED.webp",
    night: "/textures/room/night/Fourth_Bake1_CyclesBake_COMBINED.webp"
  },
  Fifth: {
    day: "/textures/room/day/Fifth_Bake1_CyclesBake_COMBINED.webp",
    night: "/textures/room/night/Fifth_Bake1_CyclesBake_COMBINED.webp"
  }
};

export const skybox = {
  path: "textures/skybox/",
  faces: ['px.webp', 'nx.webp', 'py.webp', 'ny.webp', 'pz.webp', 'nz.webp']
};

export const video = {
  src: "/textures/video/Screen.mp4",
  loop: true,
  muted: true,
  autoplay: true
};

// ── Materials ─────────────────────────────────────────────

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

export const whiteMaterialConfig = { color: 0xffffff };

export const waterMaterialConfig = {
  color: 0x558BC8,
  transparent: true,
  opacity: 0.6,
  depthWrite: false,
};

// ── Animations ────────────────────────────────────────────

export const hoverAnimation = {
  scaleMultiplier: 1.2,
  rotationOffset: Math.PI / 8,
  duration: { hoverIn: 0.5, hoverOut: 0.3 },
  ease: "bounce.out(1.8)",
};

export const fanRotation = {
  speed: 0.01,
  xAxisPattern: ["Fan_4", "Fan_5"],
};

export const modalTransition = {
  fadeInDuration: 0.5,
  fadeOutDuration: 0.5,
};

// ── Interactions ──────────────────────────────────────────

export const socialLinks = {
  GitHub: "https://github.com/catcaptions",
  LinkedIn: "https://linkedin.com/in/akinoluwa-lasisi-808b6b3a4",
  Instagram: "https://instagram.com/catcaptions",
};

export const modalSelectors = {
  work: ".work.modal",
  about: ".about.modal",
  contact: ".contact.modal",
};

export const modalButtonPatterns = ["Work_Button", "About_Button", "Contact_Button"];

// ── Mesh name patterns ────────────────────────────────────
// ponytail: these are just strings, but grouping them avoids typos
// and makes renaming Blender objects a one-line fix

export const meshPatterns = {
  glass: "Glass",
  bubble: "Bubble",
  screen: "Screen",
  water: "Water",
  raycaster: "Raycaster",
  hover: "Hover",
  pointer: "Pointer",
};

// ── Camera ────────────────────────────────────────────────
// ponytail: used once each, but naming position/target beats
// squinting at 6.096062189226614

export const cameraConfig = {
  fov: 45,
  near: 0.1,
  far: 1000,
  position: { x: 6.096062189226614, y: 4.904207965983131, z: 5.921979211737337 },
};

export const controlsConfig = {
  enableDamping: true,
  dampingFactor: 0.05,
  enablePan: false,
  target: { x: -1.253, y: 0.6312, z: -1.253 },
  // Rotation limits — prevents seeing the back of the scene
  minPolarAngle: Math.PI / 18,      // ~10° from top
  maxPolarAngle: Math.PI / 2,       // 90° — don't go below floor
  minAzimuthAngle: 0,               // don't rotate left past front
  maxAzimuthAngle: Math.PI / 2,   // ~78° — don't rotate right past side
  minDistance: 5,
  maxDistance: 14,
};

export const rendererConfig = {
  antialias: true,
  maxPixelRatio: 2,
};
