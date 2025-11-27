import * as THREE from "three";
console.log(THREE.REVISION);
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const loader = new FontLoader();
const scene = new THREE.Scene();
//scene.background = new THREE.Color(0xcccccc);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 21, 0);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);

const principalLight = new THREE.PointLight(0xffffff, 15);
const principalLightHelper = new THREE.PointLightHelper(principalLight);
principalLight.position.set(0, 0, 0);
scene.add(principalLight);
//scene.add(principalLightHelper);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.03);
scene.add(ambientLight);

const material = new THREE.MeshStandardMaterial();
material.color = new THREE.Color(0x00ff00);
const geometry = new THREE.BoxGeometry();

function getCube() {
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

const numBoxes = 50;
const radius = 15;
for (let i = 0; i < numBoxes; i++) {
  const box = getCube();
  box.position.x = Math.random() * radius - radius * 0.5;
  box.position.y = Math.random() * radius - radius * 0.5;
  box.position.z = Math.random() * radius - radius * 0.5;
  scene.add(box);
}

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

function render() {
  renderer.render(scene, camera);
}

animate();
