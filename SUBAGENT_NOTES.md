# Subagent Reference Notes

## Project Overview
- **Your repo**: room-portfolio (Three.js 3D room portfolio)
- **Reference repo**: https://github.com/andrewwoan/sooahs-room-folio
- **Goal**: Match reference functionality while keeping clean code structure

## CRITICAL: Mesh Name Convention
- User replaced `#` with `hash` in all mesh names due to baking issues
- Example: `C#1_Key` → `Chash1_Key`, `F#1_Key` → `Fhash1_Key`
- Use `hash` instead of `#` when referencing piano keys

## CRITICAL: Do NOT modify
- Camera positions/rotations
- OrbitControls clamping
- User is intentionally leaving these out for now

## Current File Structure
```
src/
  main.js          - Main Three.js scene (373 lines)
  style.scss       - Basic styling (54 lines)
  constants/
    config.js      - All constants (textures, materials, animations, etc.)
  styles/
    fonts.scss
    reset.scss
    variables.scss
  utils/
    OrbitControl.js
```

## What EXISTS in your repo
- Basic modal structure (minimal HTML, no content)
- Basic hover animations (scale + rotation)
- Fan rotation
- Texture loading (day/night)
- Raycaster interaction
- Basic camera setup
- Constants organized in config.js

## What's MISSING (features to implement)

### 1. Loading Screen
- Full-screen loading overlay with "Loading..." text
- "Enter!" button appears when assets loaded
- "Enter without Sound" option
- Animated exit (scale down + rotate + slide away)
- CSS: Deep purple background, "Motley Forces" font, centered

### 2. Intro Animations
- Objects start at scale(0,0,0) and animate in with GSAP
- Multiple timelines running in sequence/parallel
- Objects: planks, buttons, social links, flowers, boxes, lamp, slippers, eggs, fish, frames, piano keys, name letters
- Each group has its own timeline with staggered animations

### 3. Audio System (Howler.js)
- Background music: `/audio/music/cosmic_candy.ogg` (loop, volume 1)
- Piano sounds: 24 keys (`/audio/sfx/piano/Key_XX.ogg`)
- Button click sound: `/audio/sfx/click/bubble.ogg`
- Music fades when piano plays, fades back after 2s timeout
- Mute toggle button

### 4. Theme System (Day/Night)
- Toggle button (sun/moon icons)
- Shader-based texture transitions (GLSL shaders)
- Smooth interpolation between day/night textures
- Body class toggling (light-theme/dark-theme)

### 5. Better Modal Styling
- Overlay backdrop with blur
- Scrollable content area
- Styled exit button (rotated X, animated)
- Themed colors (purple/pink palette)
- Responsive design

### 6. UI Elements
- Mute toggle button (top-right)
- Theme toggle button (top-right)
- Desktop/mobile instruction text
- SVG icons for all buttons

### 7. Additional Features
- Real-time clock hands
- Fish bobbing animation
- Chair rocking animation
- Smoke effect (shader-based)

## Reference Repo Key Patterns

### Loading Manager
```javascript
const manager = new THREE.LoadingManager();
manager.onLoad = function() { /* enable enter button */ };
const loader = new GLTFLoader(manager);
```

### Modal with Overlay
```javascript
const overlay = document.querySelector(".overlay");
// Show: overlay.style.display = "block"
// Hide: overlay.style.display = "none"
```

### Audio with Howler
```javascript
import { Howl } from "howler";
const sound = new Howl({ src: ["/path.ogg"], preload: true, volume: 0.5 });
```

### Intro Animation Pattern
```javascript
child.scale.set(0, 0, 0); // Start hidden
// Then animate in with GSAP timeline
gsap.to(child.scale, { x: 1, y: 1, z: 1, duration: 0.8, ease: "back.out(1.8)" });
```

## Dependencies to Install
```bash
npm install howler
```

## Assets to Copy from Reference
- `/public/audio/` (music + sfx)
- `/public/images/` (modal images)
- `/public/shaders/` (perlin.png for smoke)
- Theme shaders (themeVertexShader, themeFragmentShader)
- Smoke shaders (smokeVertexShader, smokeFragmentShader)

## SCSS Theme Variables (from reference)
```scss
$themes: (
  light: (
    base: #fff,
    base-light: #f7f0f5,
    base-purple: #ead7ef,
    deep-purple: #2a0f4e,
    text: #2a0f4e,
    svg: #2a0f4e,
  ),
  dark: (
    base: #181225,
    base-light: #1e1535,
    base-purple: #401d49,
    deep-purple: #ead7ef,
    text: #ead7ef,
    svg: #ead7ef,
  )
);
```
