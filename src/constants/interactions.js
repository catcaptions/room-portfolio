// User interaction mappings — links, modals, and button patterns

export const socialLinks = {
  GitHub: "https://www.github.com/",
  LinkedIn: "https://www.linkedin.com/",
  YouTube: "https://www.youtube.com/",
};

// Modal name → DOM selector mapping
// Keys must match the button pattern names in the GLB model
export const modalSelectors = {
  work: ".modal",
  about: ".modal",
  contact: ".modal",
};

// Button patterns in the GLB model that trigger modals
// The suffix after "_" maps to the modalSelectors key
export const modalButtonPatterns = ["Work_Button", "About_Button", "Contact_Button"];
