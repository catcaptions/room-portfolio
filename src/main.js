import './style.scss'
import * as THREE from 'three';
import { OrbitControls } from './utils/OrbitControl.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import gsap from "gsap"
import { OBJExporter } from 'three/examples/jsm/Addons.js';
import { playPianoNote, playClick, startMusic, toggleMute } from './audio.js';

// Expose for UI buttons
window.toggleMute = toggleMute;
window.startMusic = startMusic;

// Constants
import {
  textureMap, skybox, video,
  glassMaterialConfig, whiteMaterialConfig, waterMaterialConfig, meshPatterns,
  hoverAnimation, fanRotation, modalTransition,
  socialLinks, modalSelectors, modalButtonPatterns,
  cameraConfig, controlsConfig, rendererConfig,
} from './constants/config.js';

import { setupIntroObject, playIntroAnimation } from './introAnimations.js';


const canvas = document.querySelector("#experience-canvas")
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

const modals = Object.fromEntries(
  Object.entries(modalSelectors).map(([key, selector]) => [key, document.querySelector(selector)])
);

let touchHappened = false;

let isModalOpen = false;
const overlay = document.querySelector(".overlay");

// Overlay click to close modal
overlay.addEventListener("touchend", (e) => {
  touchHappened = true;
  e.preventDefault();
  const modal = document.querySelector('.modal[style*="display: block"]');
  if (modal) hideModal(modal);
}, {passive: false});

overlay.addEventListener("click", (e) => {
  if (touchHappened) return;
  e.preventDefault();
  const modal = document.querySelector('.modal[style*="display: block"]');
  if (modal) hideModal(modal);
}, {passive: false});

document.querySelectorAll(".modal-exit-button").forEach((button)=>{
  button.addEventListener("touchend",(e)=>{
    touchHappened = true
    const modal = e.target.closest(".modal");
    hideModal(modal)
  },{passive: false})

  button.addEventListener("click",(e)=>{
    if(touchHappened) return;
    const modal = e.target.closest(".modal");
    hideModal(modal)
  },{passive: false})
})

const showModal = (modal)=>{
  modal.style.display = "block"
  overlay.style.display = "block"
  isModalOpen = true;
  playClick();
  controls.enabled = false;

  if(currentHoveredObject){
    playHoverAnimation(currentHoveredObject, false);
    currentHoveredObject = null;
  }
  document.body.style.cursor = "default";
  currentIntersects = [];

  gsap.set(modal, {opacity: 0, scale: 0});
  gsap.set(overlay, {opacity: 0});
  gsap.to(overlay, {opacity: 1, duration: 0.5});
  gsap.to(modal, {opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)"});
}
const hideModal = (modal)=>{
  isModalOpen = false;
  playClick();
  controls.enabled = true;
  gsap.to(overlay, {opacity: 0, duration: 0.5});
  gsap.to(modal, {opacity: 0, scale: 0, duration: 0.5, ease: "back.in(2)", onComplete: ()=>{
    modal.style.display = "none"
    overlay.style.display = "none"
  }});
}

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();



const xAxisFans = [];
const yAxisFans = [];
const raycasterObjects = [];
let currentIntersects = [];
let currentHoveredObject = null;


// ––––––––––Loaders–––––––––– //

// Texture Loader
const textureLoader = new THREE.TextureLoader();

  // Skybox
const cubeTextureLoader = new THREE.CubeTextureLoader().setPath(skybox.path);
const environmentMap = cubeTextureLoader.load(skybox.faces);

// Model Loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath( '/draco/' );

// ponytail: LoadingManager tracks when all assets finish loading
const loadingManager = new THREE.LoadingManager();
const loader = new GLTFLoader(loadingManager);
loader.setDRACOLoader( dracoLoader );

// Intro animation objects map (prefix → mesh[])
const introObjects = new Map();


const loadedTextures = {
  day:{},
  night:{},
};
Object.entries(textureMap).forEach(([key,paths])=>{
  const dayTexture = textureLoader.load(paths.day);
  dayTexture.flipY = false;
  dayTexture.colorSpace = THREE.SRGBColorSpace;
  loadedTextures.day[key] = dayTexture;

  const nightTexture = textureLoader.load(paths.night);
  nightTexture.flipY = false;
  nightTexture.colorSpace = THREE.SRGBColorSpace;
  loadedTextures.night[key] = nightTexture;
});

const videoElement = document.createElement("video")
videoElement.src = video.src;
videoElement.loop = video.loop;
videoElement.muted = video.muted;
videoElement.autoplay = video.autoplay;
videoElement.play();

const videoTexture = new THREE.VideoTexture(videoElement);
videoTexture.colorSpace = THREE.SRGBColorSpace;
videoTexture.flipY = false;

const glassMaterial = new THREE.MeshPhysicalMaterial({
  ...glassMaterialConfig,
  envMap: environmentMap,
});
const whiteMaterial = new THREE.MeshBasicMaterial(whiteMaterialConfig);
const screenMaterial = new THREE.MeshBasicMaterial({ map: videoTexture });
const waterMaterial = new THREE.MeshBasicMaterial(waterMaterialConfig);

loader.load("/models/Room_Portfolio-v1.glb", (glb) => {
  glb.scene.traverse(child=>{
    if(child.isMesh){
      // Capture hover data BEFORE intro setup (which zeros scale)
      if(child.name.includes(meshPatterns.hover)){
        child.userData.initialScale = new THREE.Vector3().copy(child.scale)
        child.userData.initialPosition = new THREE.Vector3().copy(child.position)
        child.userData.initialRotation = new THREE.Euler().copy(child.rotation)
      }

      // Set up intro animation objects (scale to 0, store position)
      const introPrefix = setupIntroObject(child);
      if(introPrefix){
        if (!introObjects.has(introPrefix)) introObjects.set(introPrefix, []);
        introObjects.get(introPrefix).push(child);
      }

      if(child.name.includes(meshPatterns.raycaster) || child.name.includes("_Key_")){
          raycasterObjects.push(child)
      }

      if(child.name.includes(meshPatterns.glass)){
        child.material = glassMaterial;
      }
      else if(child.name.includes(meshPatterns.bubble)){
        child.material = whiteMaterial;
      }
      else if(child.name.includes(meshPatterns.screen)){
        child.material = screenMaterial;
      }
      else if(child.name.includes(meshPatterns.water)){
        child.material = waterMaterial;
      }
      else{
        Object.keys(textureMap).forEach((key)=>{
          if(child.name.includes(key)){
            child.material = new THREE.MeshBasicMaterial({
              map: loadedTextures.day[key]
            });
          }
          if(child.material.map){
            child.material.map.minFilter = THREE.LinearFilter;
          }

          if(child.name.includes("Fan")){
            if(fanRotation.xAxisPattern.some(pattern => child.name.includes(pattern))){
              xAxisFans.push(child);
            }
            else{
              yAxisFans.push(child)
            }
          }
        })
      }
    }
  });

  scene.add(glb.scene);
});

// ––––––––––Loading Screen & Intro –––––––––– //

const loadingScreen = document.querySelector(".loading-screen");
const loadingScreenButton = document.querySelector(".loading-screen-button");
const noSoundButton = document.querySelector(".no-sound-button");

let introPlayed = false;

loadingManager.onLoad = function () {
  loadingScreenButton.textContent = "Enter!";
  loadingScreenButton.style.cursor = "pointer";

  noSoundButton.textContent = "Enter without Sound";

  function handleEnter(withSound = true) {
    if (introPlayed) return;
    introPlayed = true;

    loadingScreenButton.style.cursor = "default";
    loadingScreenButton.textContent = "~ Loading ~";

    if (!withSound) {
      window.toggleMute?.();
    } else {
      window.startMusic?.();
    }

    playReveal();
  }

  loadingScreenButton.addEventListener("click", () => handleEnter(true));
  noSoundButton.addEventListener("click", () => handleEnter(false));
};

function playReveal() {
  const tl = gsap.timeline();

  tl.to(loadingScreen, {
    scale: 0.5,
    duration: 1.2,
    delay: 0.25,
    ease: "back.in(1.8)",
  }).to(loadingScreen, {
    y: "200vh",
    transform: "perspective(1000px) rotateX(45deg) rotateY(-35deg)",
    duration: 1.2,
    ease: "back.in(1.8)",
    onComplete: () => {
      isModalOpen = false;
      playIntroAnimation(introObjects);
      loadingScreen.remove();
    },
  }, "-=0.1");
}

// ––––––––––Scene–––––––––– //
const scene = new THREE.Scene();
scene.background = environmentMap;

const camera = new THREE.PerspectiveCamera( cameraConfig.fov, sizes.width / sizes.height, cameraConfig.near, cameraConfig.far );
camera.position.set(cameraConfig.position.x, cameraConfig.position.y, cameraConfig.position.z);

const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: rendererConfig.antialias});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, rendererConfig.maxPixelRatio));
renderer.setSize( sizes.width , sizes.height );

// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );


const controls = new OrbitControls( camera, renderer.domElement );

// controls.update() must be called after any manual changes to the camera's transform
controls.enableDamping = controlsConfig.enableDamping;
controls.dampingFactor = controlsConfig.dampingFactor;
controls.minPolarAngle = controlsConfig.minPolarAngle;
controls.maxPolarAngle = controlsConfig.maxPolarAngle;
controls.minAzimuthAngle = controlsConfig.minAzimuthAngle;
controls.maxAzimuthAngle = controlsConfig.maxAzimuthAngle;
controls.minDistance = controlsConfig.minDistance;
controls.maxDistance = controlsConfig.maxDistance;
controls.update();
controls.target.set(controlsConfig.target.x, controlsConfig.target.y, controlsConfig.target.z);

// ––––––––––UI Toggle Buttons–––––––––– //

const themeToggleButton = document.querySelector(".theme-toggle-button");
const muteToggleButton = document.querySelector(".mute-toggle-button");
const sunSvg = document.querySelector(".sun-svg");
const moonSvg = document.querySelector(".moon-svg");
const soundOffSvg = document.querySelector(".sound-off-svg");
const soundOnSvg = document.querySelector(".sound-on-svg");

let isNightMode = false;

themeToggleButton.addEventListener("click", (e) => {
  if (touchHappened) return;
  e.preventDefault();
  isNightMode = !isNightMode;
  playClick();

  gsap.to(themeToggleButton, {
    rotate: 45,
    scale: 5,
    duration: 0.5,
    ease: "back.out(2)",
    onStart: () => {
      if (isNightMode) {
        sunSvg.style.display = "none";
        moonSvg.style.display = "block";
        document.body.classList.remove("light-theme");
        document.body.classList.add("dark-theme");
      } else {
        moonSvg.style.display = "none";
        sunSvg.style.display = "block";
        document.body.classList.remove("dark-theme");
        document.body.classList.add("light-theme");
      }
      gsap.to(themeToggleButton, {
        rotate: 0,
        scale: 1,
        duration: 0.5,
        ease: "back.out(2)",
        onComplete: () => {
          gsap.set(themeToggleButton, { clearProps: "all" });
        },
      });
    },
  });
});

muteToggleButton.addEventListener("click", (e) => {
  if (touchHappened) return;
  e.preventDefault();
  const muted = toggleMute();
  playClick();

  gsap.to(muteToggleButton, {
    rotate: -45,
    scale: 5,
    duration: 0.5,
    ease: "back.out(2)",
    onStart: () => {
      if (muted) {
        soundOnSvg.style.display = "none";
        soundOffSvg.style.display = "block";
      } else {
        soundOffSvg.style.display = "none";
        soundOnSvg.style.display = "block";
      }
      gsap.to(muteToggleButton, {
        rotate: 0,
        scale: 1,
        duration: 0.5,
        ease: "back.out(2)",
        onComplete: () => {
          gsap.set(muteToggleButton, { clearProps: "all" });
        },
      });
    },
  });
});

muteToggleButton.addEventListener("touchend", (e) => {
  touchHappened = true;
  e.preventDefault();
  const muted = toggleMute();
  playClick();

  gsap.to(muteToggleButton, {
    rotate: -45,
    scale: 5,
    duration: 0.5,
    ease: "back.out(2)",
    onStart: () => {
      if (muted) {
        soundOnSvg.style.display = "none";
        soundOffSvg.style.display = "block";
      } else {
        soundOffSvg.style.display = "none";
        soundOnSvg.style.display = "block";
      }
      gsap.to(muteToggleButton, {
        rotate: 0,
        scale: 1,
        duration: 0.5,
        ease: "back.out(2)",
        onComplete: () => {
          gsap.set(muteToggleButton, { clearProps: "all" });
        },
      });
    },
  });
}, {passive: false});

themeToggleButton.addEventListener("touchend", (e) => {
  touchHappened = true;
  e.preventDefault();
  isNightMode = !isNightMode;
  playClick();

  gsap.to(themeToggleButton, {
    rotate: 45,
    scale: 5,
    duration: 0.5,
    ease: "back.out(2)",
    onStart: () => {
      if (isNightMode) {
        sunSvg.style.display = "none";
        moonSvg.style.display = "block";
        document.body.classList.remove("light-theme");
        document.body.classList.add("dark-theme");
      } else {
        moonSvg.style.display = "none";
        sunSvg.style.display = "block";
        document.body.classList.remove("dark-theme");
        document.body.classList.add("light-theme");
      }
      gsap.to(themeToggleButton, {
        rotate: 0,
        scale: 1,
        duration: 0.5,
        ease: "back.out(2)",
        onComplete: () => {
          gsap.set(themeToggleButton, { clearProps: "all" });
        },
      });
    },
  });
}, {passive: false});





// ––––––––––Event Listeners–––––––––– //
window.addEventListener("resize", ()=>{
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update Camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update Renderer
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, rendererConfig.maxPixelRatio));
  renderer.setSize( sizes.width , sizes.height );
})

window.addEventListener("mousemove", (e)=>{
  touchHappened = false;
  pointer.x = (e.clientX / window.innerWidth ) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight ) * 2 + 1;
})



window.addEventListener("touchstart", (e)=>{
  if(isModalOpen) return;
  e.preventDefault()
  pointer.x = (e.touches[0].clientX / window.innerWidth ) * 2 - 1;
  pointer.y = -(e.touches[0].clientY / window.innerHeight ) * 2 + 1;
},{passive: false})

window.addEventListener("touchend", (e)=>{
  if(isModalOpen) return;
  e.preventDefault()
  handleRaycasterInteraction()
},{passive: false})

function handleRaycasterInteraction(){
  if(currentIntersects.length>0){
    const object = currentIntersects[0].object;

    // Piano key detection
    if(object.name.includes("_Key_")){
      playPianoNote(object.name);
      return;
    }
    Object.entries(socialLinks).forEach(([key, url])=>{
      if(object.name.includes(key)){
        const newWindow = window.open();
        newWindow.opener = null;
        newWindow.location = url;
        newWindow.target = "_blank";
        newWindow.rel = "noopener noreferrer"
      }
    });

    modalButtonPatterns.forEach(pattern => {
      if(object.name.includes(pattern)){
        const modalKey = pattern.split("_")[0].toLowerCase();
        showModal(modals[modalKey]);
      }
    });
  }
}

window.addEventListener("click", handleRaycasterInteraction);




// ––––––––––Animation––––––––––//

function playHoverAnimation(object, isHovering){
  gsap.killTweensOf(object.scale)
  gsap.killTweensOf(object.rotation)
  gsap.killTweensOf(object.position)

  const { scaleMultiplier, rotationOffset, duration, ease } = hoverAnimation;

  if(isHovering){
    gsap.to(object.scale, {
      x: object.userData.initialScale.x * scaleMultiplier,
      y: object.userData.initialScale.y * scaleMultiplier,
      z: object.userData.initialScale.z * scaleMultiplier,
      duration: duration.hoverIn,
      ease,
    })
    gsap.to(object.rotation, {
      x: object.userData.initialRotation.x + rotationOffset,
      duration: duration.hoverIn,
      ease,
    })
  }
  else{
    gsap.to(object.scale, {
      y: object.userData.initialScale.y,
      x: object.userData.initialScale.x,
      z: object.userData.initialScale.z,
      duration: duration.hoverOut,
      ease,
    })
    gsap.to(object.rotation, {
      x: object.userData.initialRotation.x,
      duration: duration.hoverOut,
      ease,
    })
  }
}

const animate = (time) =>{
  // console.log(camera.position)
  // console.log("______")
  // console.log(controls.target)

  // Animate Fans
  xAxisFans.forEach(fan=>{
    fan.rotation.x += fanRotation.speed
  })
  yAxisFans.forEach(fan=>{
    fan.rotation.y += fanRotation.speed
  })

  // Raycasting
  if(!isModalOpen){

    // update the picking ray with the camera and pointer position
    raycaster.setFromCamera( pointer, camera );
    // calculate objects intersecting the picking ray
    currentIntersects = raycaster.intersectObjects( raycasterObjects );
    for (let i = 0; i < currentIntersects.length; i++){
      // currentIntersects[ i ].object.material.color.set( 0xff0000 );
    }
    if(currentIntersects.length>0){
      const currentIntersectObject = currentIntersects[0].object

      if(currentIntersectObject.name.includes(meshPatterns.hover)){
        if(currentIntersectObject !== currentHoveredObject){

          if(currentHoveredObject){
            playHoverAnimation(currentHoveredObject, false)
          }

          playHoverAnimation(currentIntersectObject, true)
          currentHoveredObject = currentIntersectObject;
        }
      }

      if(currentIntersectObject.name.includes(meshPatterns.pointer)){
        document.body.style.cursor = "pointer"
      }
      else{
        document.body.style.cursor = "default"
      }
    }
    else{
      if(currentHoveredObject){
        playHoverAnimation(currentHoveredObject, false);
        currentHoveredObject = null;
      }
      document.body.style.cursor = "default"
    }
  }
  controls.update();

  renderer.render( scene, camera );
  window.requestAnimationFrame(animate)
}
animate();