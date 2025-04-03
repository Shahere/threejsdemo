import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const renderer = new THREE.WebGLRenderer({ antialias: true });
const scene = new THREE.Scene();
scene.background = 0xff0000;
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 0, 30);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let loader = new THREE.TextureLoader();

const south = loader.load("/img/clouds1_south.png");
const north = loader.load("/img/clouds1_north.png");
const up = loader.load("/img/clouds1_up.png");
const down = loader.load("/img/clouds1_down.png");
const east = loader.load("/img/clouds1_east.png");
const west = loader.load("/img/clouds1_west.png");
// side: THREE.BackSide,
const materials = [
  new THREE.MeshBasicMaterial({ map: east, side: THREE.BackSide }), // Right
  new THREE.MeshBasicMaterial({ map: west, side: THREE.BackSide }), // Left
  new THREE.MeshBasicMaterial({ map: up, side: THREE.BackSide }), // Top
  new THREE.MeshBasicMaterial({ map: down, side: THREE.BackSide }), // Bottom
  new THREE.MeshBasicMaterial({ map: north, side: THREE.BackSide }), // Front
  new THREE.MeshBasicMaterial({ map: south, side: THREE.BackSide }), // Back
];

let skyboxGeo = new THREE.BoxGeometry(1000, 1000, 1000);
let skybox = new THREE.Mesh(skyboxGeo, materials);
scene.add(skybox);

/*--------------------------------------------- LIGHTS -------------------------------------------------*/
scene.add(new THREE.AmbientLight(0xffffff, 1));
/*--------------------------------------------- LIGHTS -------------------------------------------------*/

//DEBUG
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();
