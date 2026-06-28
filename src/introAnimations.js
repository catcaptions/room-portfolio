import * as THREE from "three";
import gsap from "gsap";

// ── Intro object prefixes ──────────────────────────────────
// Matched via startsWith + word boundary to avoid false positives
// (e.g. "Flower_4" must NOT match "Flower_4_Raycaster_Fourth_Baked")
const introPrefixes = [
  "Hanging_Plank_1",
  "Hanging_Plank_2",
  "My_Work_Button",
  "About_Button",
  "Contact_Button",
  "Booba",
  "GitHub",
  "YouTube",
  "LinkedIn",
  "Frame_1",
  "Frame_2",
  "Frame_3",
  "Flower_1",
  "Flower_2",
  "Flower_3",
  "Flower_4_Hover",   // avoid matching "Flower_4_Raycaster" (non-hover, no intro)
  "Flower_5",
  "Box_1",
  "Box_2",
  "Box_3",
  "Lamp",
  "Slipper_1",
  "Slipper_2",
  "Fish_Hover",       // user's mesh: "Fish_Hover_Raycaster_Fourth_Baked"
  "Egg_1",
  "Egg_2",
  "Egg_3",
  ...Array.from({ length: 15 }, (_, i) => `Name_Letter_${i + 1}`),
];

const allIntroPrefixes = introPrefixes;

// ── Matching ───────────────────────────────────────────────
// Check mesh name starts with prefix and next char is '_' or end of string
function matchesIntro(meshName, prefix) {
  if (!meshName.startsWith(prefix)) return false;
  const rest = meshName.slice(prefix.length);
  return rest.length === 0 || rest[0] === "_";
}

export function hasIntroAnimation(objectName) {
  return allIntroPrefixes.some((p) => matchesIntro(objectName, p));
}

// ── Setup ──────────────────────────────────────────────────
// Returns the prefix that matched (or null), so caller can group by prefix
export function setupIntroObject(child) {
  const matched = allIntroPrefixes.find((p) => matchesIntro(child.name, p));
  if (!matched) return null;

  child.userData.initialScale = new THREE.Vector3().copy(child.scale);
  child.scale.set(0, 0, 0);
  child.userData.initialPosition = new THREE.Vector3().copy(child.position);

  return matched;
}

// ── Play intro ─────────────────────────────────────────────
// objects: Map<prefix, mesh[]> built during traversal
export function playIntroAnimation(objects) {
  const get = (key) => objects.get(key)?.[0]; // first match for single-object groups
  const getAll = (key) => objects.get(key) || [];

  // ── Group 1: Planks + Buttons ──
  const t1 = gsap.timeline({
    defaults: { duration: 0.8, ease: "back.out(1.8)" },
  });
  t1.timeScale(0.8);

  const plank1 = get("Hanging_Plank_1");
  const plank2 = get("Hanging_Plank_2");
  if (plank1) {
    const s = plank1.userData.initialScale;
    t1.to(plank1.scale, { x: s.x, y: s.y, z: s.z });
  }
  if (plank2) {
    const s = plank2.userData.initialScale;
    t1.to(plank2.scale, { x: s.x, y: s.y, z: s.z }, "-=0.5");
  }

  for (const key of ["My_Work_Button", "About_Button", "Contact_Button"]) {
    const mesh = get(key);
    if (mesh) t1.to(mesh.scale, { x: 1, y: 1, z: 1 }, "-=0.6");
  }

  // ── Group 2: Frames ──
  const tFrames = gsap.timeline({
    defaults: { duration: 0.8, ease: "back.out(1.8)" },
  });
  tFrames.timeScale(0.8);

  for (const key of ["Frame_1", "Frame_2", "Frame_3"]) {
    const mesh = get(key);
    if (mesh) {
      const pos = tFrames.getChildren().length === 0 ? undefined : "-=0.5";
      tFrames.to(mesh.scale, { x: 1, y: 1, z: 1 }, pos);
    }
  }

  // ── Group 3: Social Links ──
  const t2 = gsap.timeline({
    defaults: { duration: 0.8, ease: "back.out(1.8)" },
  });
  t2.timeScale(0.8);

  const booba = get("Booba");
  if (booba) t2.to(booba.scale, { x: 1, y: 1, z: 1, delay: 0.4 });
  for (const key of ["GitHub", "YouTube", "LinkedIn"]) {
    const mesh = get(key);
    if (mesh) t2.to(mesh.scale, { x: 1, y: 1, z: 1 }, "-=0.5");
  }

  // ── Group 4: Flowers (reverse) ──
  const tFlowers = gsap.timeline({
    defaults: { duration: 0.8, ease: "back.out(1.8)" },
  });
  tFlowers.timeScale(0.8);

  for (let i = 5; i >= 1; i--) {
    const key = i === 4 ? "Flower_4_Hover" : `Flower_${i}`;
    const mesh = get(key);
    if (mesh) {
      const pos = tFlowers.getChildren().length === 0 ? undefined : "-=0.5";
      tFlowers.to(mesh.scale, { x: 1, y: 1, z: 1 }, pos);
    }
  }

  // ── Group 5: Boxes ──
  const tBoxes = gsap.timeline({
    defaults: { duration: 0.8, ease: "back.out(1.8)" },
  });
  tBoxes.timeScale(0.8);

  for (const key of ["Box_1", "Box_2", "Box_3"]) {
    const mesh = get(key);
    if (mesh) {
      const pos = tBoxes.getChildren().length === 0 ? undefined : "-=0.5";
      tBoxes.to(mesh.scale, { x: 1, y: 1, z: 1 }, pos);
    }
  }

  // ── Group 6: Lamp ──
  const tLamp = gsap.timeline({
    defaults: { duration: 0.8, delay: 0.2, ease: "back.out(1.8)" },
  });
  tLamp.timeScale(0.8);
  const lamp = get("Lamp");
  if (lamp) tLamp.to(lamp.scale, { x: 1, y: 1, z: 1 });

  // ── Group 7: Slippers ──
  const tSlippers = gsap.timeline({
    defaults: { duration: 0.8, ease: "back.out(1.8)" },
  });
  tSlippers.timeScale(0.8);

  const slipper1 = get("Slipper_1");
  const slipper2 = get("Slipper_2");
  if (slipper1) tSlippers.to(slipper1.scale, { x: 1, y: 1, z: 1, delay: 0.5 });
  if (slipper2) tSlippers.to(slipper2.scale, { x: 1, y: 1, z: 1 }, "-=0.5");

  // ── Group 8: Eggs ──
  const tEggs = gsap.timeline({
    defaults: { duration: 0.8, ease: "back.out(1.8)" },
  });
  tEggs.timeScale(0.8);

  for (const key of ["Egg_1", "Egg_2", "Egg_3"]) {
    const mesh = get(key);
    if (mesh) {
      const pos = tEggs.getChildren().length === 0 ? undefined : "-=0.5";
      tEggs.to(mesh.scale, { x: 1, y: 1, z: 1 }, pos);
    }
  }

  // ── Group 9: Fish ──
  const tFish = gsap.timeline({
    defaults: { delay: 0.8, duration: 0.8, ease: "back.out(1.8)" },
  });
  tFish.timeScale(0.8);
  const fish = get("Fish_Hover");
  if (fish) tFish.to(fish.scale, { x: 1, y: 1, z: 1 });

  // ── Group 10: Name Letters (bounce, all 15) ──
  const lettersTl = gsap.timeline({
    defaults: { duration: 0.8, ease: "back.out(1.7)" },
  });
  lettersTl.timeScale(0.8);

  for (let i = 1; i <= 15; i++) {
    const mesh = get(`Name_Letter_${i}`);
    if (!mesh) continue;

    const pos = mesh.userData.initialPosition;
    const delay = i === 1 ? 0.25 : "-=0.5";

    lettersTl.to(mesh.position, {
      y: pos.y + 0.3, duration: 0.4, ease: "back.out(1.8)",
      delay: i === 1 ? 0.25 : 0,
    }, i === 1 ? undefined : delay);

    lettersTl.to(mesh.scale, {
      x: 1, y: 1, z: 1, duration: 0.4, ease: "back.out(1.8)",
    }, "<");

    lettersTl.to(mesh.position, {
      y: pos.y, duration: 0.4, ease: "back.out(1.8)",
    }, ">-0.2");
  }

  return { t1, tFrames, t2, tFlowers, tBoxes, tLamp, tSlippers, tEggs, tFish, lettersTl };
}
