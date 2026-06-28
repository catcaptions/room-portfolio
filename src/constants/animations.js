// Animation parameters for hover effects and transitions

export const hoverAnimation = {
  // Scale multiplier when hovering over an object
  scaleMultiplier: 1.2,

  // Rotation offset (radians) on Y-axis when hovering
  rotationOffset: Math.PI / 8,

  // Durations in seconds
  duration: {
    hoverIn: 0.5,
    hoverOut: 0.3,
  },

  // GSAP easing functions
  ease: "bounce.out(1.8)",
};

// Fan rotation speeds (radians per frame)
export const fanRotation = {
  speed: 0.01,
  // Object name patterns that rotate on X-axis vs Y-axis
  xAxisPattern: ["Fan_4", "Fan_5"],
};

// Modal transition settings
export const modalTransition = {
  fadeInDuration: 0.5,
  fadeOutDuration: 0.5,
};
