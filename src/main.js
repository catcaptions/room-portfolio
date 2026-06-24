import './style.scss'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


const canvas = document.querySelector("#experience-canvas")
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}
// Loaders
const textureLoader = new THREE.TextureLoader();
// Model Loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath( '/draco/' );

const loader = new GLTFLoader();
loader.setDRACOLoader( dracoLoader );

const textureMap = {
  Bg_Plane_Baked:"/textures/room/Bg_Plane_Bake1_CyclesBake_COMBINED.webp",
  Non_Table_Items_Baked:"/textures/room/Non_Table_Items_Bake1_CyclesBake_COMBINED.webp",
  Pond_Items_Bake:"/textures/room/Pond_Items_Bake1_CyclesBake_COMBINED.webp",
  Table_Items_Bake:"/textures/room/Table_Items_Bake1_CyclesBake_COMBINED.webp",
  Wall_Items_Bake:"/textures/room/Wall_Items_Bake1_CyclesBake_COMBINED.webp"
}

const loadedTextures = {};

Object.entries(textureMap).forEach(([key, path]) => {
  const texture = textureLoader.load(path);
  texture.flipY = false
  texture.colorSpace = THREE.SRGBColorSpace
  loadedTextures[key] = texture;
});

loader.load("/models/Room_Portfolio_w_Materials-v1.glb", (glb)=>{
  glb.scene.traverse(child=>{
    if(child.isMesh && child.material.map){
      child.material.minFilter = THREE.LinearFilter;
    }
  })
  scene.add(glb.scene);
})







const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, sizes.width / sizes.height, 0.1, 1000 );
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
renderer.setSize( sizes.width , sizes.height );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );


const controls = new OrbitControls( camera, renderer.domElement );
// controls.update() must be called after any manual changes to the camera's transform
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.update();





// Event Listeners
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





const animate = (time) =>{
  cube.rotation.x = time / 2000;
  cube.rotation.y = time / 1000;

  controls.update();

  renderer.render( scene, camera );
  window.requestAnimationFrame(animate)
}
animate()