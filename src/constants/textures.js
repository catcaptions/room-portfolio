// Texture map paths for day/night room variants
// Each key corresponds to a mesh name in the GLB model
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

// Skybox cubemap paths
export const skybox = {
  path: "textures/skybox/",
  faces: ['px.webp', 'nx.webp', 'py.webp', 'ny.webp', 'pz.webp', 'nz.webp']
};

// Video texture source
export const video = {
  src: "/textures/video/Screen.mp4",
  loop: true,
  muted: true,
  autoplay: true
};
