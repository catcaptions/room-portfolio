import './style.scss'
import * as THREE from 'three';
import { OrbitControls } from './utils/OrbitControl.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import gsap from "gsap"
import { OBJExporter } from 'three/examples/jsm/Addons.js';


const canvas = document.querySelector("#experience-canvas")
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

const modals = {
  work: document.querySelector(".modal"),
  about: document.querySelector(".modal"),
  contact: document.querySelector(".modal"),
}

let touchHappened = false;
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

let isModalOpen = false; 
const showModal = (modal)=>{
  modal.style.display = "block"
  isModalOpen = true;
  controls.enabled = false;

  if(currentHoveredObject){
    playHoverAnimation(currentHoveredObject, false);
    currentHoveredObject = null;
  }
  document.body.style.cursor = "default";
  currentIntersectObject = [];

  gsap.set(modal, {opacity: 0});
  gsap.to(modal, {opacity: 1, duration: 0.5,});
}
const hideModal = (modal)=>{
  modal.style.display = "block"
  isModalOpen = false;
  controls.enabled = true;
  gsap.to(modal, {opacity: 0, duration: 0.5, onComplete: ()=>{
    modal.style.display = "none"
  }});
}

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();



const xAxisFans = [];
const yAxisFans = [];
const raycasterObjects = [];
let currentIntersects = [];
let currentHoveredObject = null;

const socialLinks = {
  "GitHub": "https://www.github.com/",
  "LinkedIn": "https://www.linkedin.com/",
  "YouTube": "https://www.youtube.com/",
}


// ––––––––––Loaders–––––––––– //

// Texture Loader
const textureLoader = new THREE.TextureLoader();

  // Skybox
const cubeTextureLoader = new THREE.CubeTextureLoader().setPath( 'textures/skybox/' );
const environmentMap = cubeTextureLoader.load( [
	'px.webp', 'nx.webp', 'py.webp', 'ny.webp', 'pz.webp', 'nz.webp'
] );

// Model Loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath( '/draco/' );

const loader = new GLTFLoader();
loader.setDRACOLoader( dracoLoader );

const textureMap = {
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
    night: "/textures/room/day/Third_Bake1_CyclesBake_COMBINED.webp"
  },
  Fourth: {
    day: "/textures/room/day/Fourth_Bake1_CyclesBake_COMBINED.webp",
    night: "/textures/room/day/Fourth_Bake1_CyclesBake_COMBINED.webp"
  },
  Fifth: {
    day: "/textures/room/day/Fifth_Bake1_CyclesBake_COMBINED.webp",
    night: "/textures/room/day/Fifth_Bake1_CyclesBake_COMBINED.webp"
  }
}


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
videoElement.src = "/textures/video/Screen.mp4"
videoElement.loop = true;
videoElement.muted = true;
videoElement.autoplay = true;
videoElement.play();

const videoTexture = new THREE.VideoTexture(videoElement);
videoTexture.colorSpace = THREE.SRGBColorSpace;
videoTexture.flipY = false;

const glassMaterial = new THREE.MeshPhysicalMaterial({
  transmission: 1,
  opacity: 1,
  metalness: 0,
  roughness: 0,
  ior: 1.5,
  thickness: 0.01,
  specularIntensity: 1,
  envMap: environmentMap,
  envMapIntensity: 1,
  depthWrite:false,
});
const whiteMaterial = new THREE.MeshBasicMaterial({
  color:0xffffff,
});
const screenMaterial = new THREE.MeshBasicMaterial({
  map: videoTexture,
});
const waterMaterial = new THREE.MeshBasicMaterial({
  color:0x558BC8,
  transparent:true,
  opacity:0.6,
  depthWrite:false,
});

loader.load("/models/Room_Portfolio-v1.glb", (glb) => {
  glb.scene.traverse(child=>{
    if(child.isMesh){
      if(child.name.includes("Raycaster")){
          raycasterObjects.push(child)
      }
      if(child.name.includes("Hover")){
        child.userData.initialScale = new THREE.Vector3().copy(child.scale)
        child.userData.initialPosition = new THREE.Vector3().copy(child.position)
        child.userData.initialRotation = new THREE.Euler().copy(child.rotation)

      }
      
      if(child.name.includes("Glass")){
        child.material = glassMaterial;
      }
      else if(child.name.includes("Bubble")){
        child.material = whiteMaterial;
      }
      else if(child.name.includes("Screen")){
        child.material = screenMaterial;
      }
      else if(child.name.includes("Water")){
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
            if(child.name.includes("Fan_4") || child.name.includes("Fan_5")){
              xAxisFans.push(child);
            }
            else{
              yAxisFans.push(child)
            }
          }
        })
      }
    }

    scene.add(glb.scene);
  });
});

// ––––––––––Scene–––––––––– //
const scene = new THREE.Scene();
scene.background = environmentMap;

const camera = new THREE.PerspectiveCamera( 45, sizes.width / sizes.height, 0.1, 1000 );
camera.position.set(6.096062189226614,4.904207965983131,5.921979211737337)

const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
renderer.setSize( sizes.width , sizes.height );

// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );


const controls = new OrbitControls( camera, renderer.domElement );

// controls.minDistance = 3;
// controls.maxDistance = 20;
// controls.minPolarAngle = Math.PI/18;
// controls.maxPolarAngle = Math.PI/2;
// controls.minAzimuthAngle = 0;
// controls.maxAzimuthAngle = Math.PI/2.3;

// controls.update() must be called after any manual changes to the camera's transform
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.update();
controls.target.set(-0.4157927443992023,1.0391870673201113,-0.37819867418043385)





// ––––––––––Event Listeners–––––––––– //
window.addEventListener("resize", ()=>{
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update Camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix

  // Update Renderer
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
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
    Object.entries(socialLinks).forEach(([key, url])=>{
      if(object.name.includes(key)){
        const newWindow = window.open();
        newWindow.opener = null;
        newWindow.location = url;
        newWindow.target = "_blank";
        newWindow.rel = "noopener noreferrer"
      }
    });

    if(object.name.includes("Work_Button")){
      showModal(modals.work)
    }
    else if(object.name.includes("About_Button")){
      showModal(modals.about)
    }
    else if(object.name.includes("Contact_Button")){
      showModal(modals.contact)
    }


  }
}

window.addEventListener("click", handleRaycasterInteraction);




// ––––––––––Animation––––––––––//

function playHoverAnimation(object, isHovering){
  gsap.killTweensOf(object.scale)
  gsap.killTweensOf(object.rotation)
  gsap.killTweensOf(object.position)

  if(isHovering){
    gsap.to(object.scale, {
      x: object.userData.initialScale.x *1.2,
      y: object.userData.initialScale.y *1.2,
      z: object.userData.initialScale.z *1.2,
      duration: 0.5,
      ease:"bounce.out(1.8)",
    })
    gsap.to(object.rotation, {
      x: object.userData.initialRotation.x +Math.PI/8,
      duration: 0.5,
      ease:"bounce.out(1.8)",
    })
  }
  else{
    gsap.to(object.scale, {
      y: object.userData.initialScale.y,
      x: object.userData.initialScale.x,
      z: object.userData.initialScale.z,
      duration: 0.3,
      ease:"bounce.out(1.8)",
    })
    gsap.to(object.rotation, {
      x: object.userData.initialRotation.x,
      duration: 0.3,
      ease:"bounce.out(1.8)",
    })
  }
}

const animate = (time) =>{
  // console.log(camera.position)
  // console.log("______")
  // console.log(controls.target)

  // Animate Fans
  xAxisFans.forEach(fan=>{
    fan.rotation.x += 0.01
  })
  yAxisFans.forEach(fan=>{
    fan.rotation.y += 0.01
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
      
      if(currentIntersectObject.name.includes("Hover")){
        if(currentIntersectObject !== currentHoveredObject){
          
          if(currentHoveredObject){
            playHoverAnimation(currentHoveredObject, false)
          }
          
          playHoverAnimation(currentIntersectObject, true)
          currentHoveredObject = currentIntersectObject;
        }
      }
      
      if(currentIntersectObject.name.includes("Pointer")){
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