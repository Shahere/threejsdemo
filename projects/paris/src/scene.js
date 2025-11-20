import * as THREE from "three";
console.log(THREE.REVISION);
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const renderer = new THREE.WebGLRenderer({ antialias: true });

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcccccc);
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 0, 30);

const loader = new GLTFLoader();

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const pmremGenerator = new THREE.PMREMGenerator(renderer);
const envTexture = pmremGenerator.fromScene(
  new RoomEnvironment(),
  0.04
).texture;
scene.environment = envTexture;

/*--------------------------------------------- LIGHTS -------------------------------------------------*/
// Lumière ambiante douce

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xefefff, 1.5);
dirLight.position.set(10, 10, 10);
scene.add(dirLight);

/*const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight
);
directionalLight.position.set(0, 20, 0);
scene.add(directionalLight);
scene.add(directionalLightHelper);

const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
fillLight.position.set(-5, 0, -5);
scene.add(fillLight);*/
/*--------------------------------------------- LIGHTS -------------------------------------------------*/

//DEBUG
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
loader.load(
  new URL("./scene.gltf", import.meta.url).href,
  (gltf) => {
    console.log("Model loaded successfully");
    let model = gltf.scene;

    scene.add(model);
    model.scale.set(0.1, 0.1, 0.1);
    model.position.set(0, 0, 0);
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  (error) => {
    console.error("Error loading model:", error);
  }
);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();
