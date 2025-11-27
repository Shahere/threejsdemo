import * as THREE from "three";
console.log(THREE.REVISION);
import { OrbitControls } from "three/examples/jsm/Addons.js";

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.02);
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

const principalLight = new THREE.PointLight(0x00ff00, 50);
const principalLightHelper = new THREE.PointLightHelper(principalLight);
principalLight.position.set(0, 0, 0);
scene.add(principalLight);
scene.add(principalLightHelper);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

const material = new THREE.MeshStandardMaterial();
material.color = new THREE.Color(0xffffff);
const geometry = new THREE.BoxGeometry();

function getCube() {
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

function getRandomSpherePoint({ radius = 10 }) {
  const minRadius = 3;
  const maxRadius = radius - minRadius;
  const range = Math.random() * maxRadius + minRadius;
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  return {
    x: range * Math.sin(phi) * Math.cos(theta),
    y: range * Math.sin(phi) * Math.sin(theta),
    z: range * Math.cos(phi),
  };
}

function getLayout(numBoxes = 500, radius = 100) {
  for (let i = 0; i < numBoxes; i++) {
    const box = getCube();
    //Reste bien pour de la position random sous forme de cube
    /*
    box.position.x = Math.random() * radius - radius * 0.5;
    box.position.y = Math.random() * radius - radius * 0.5;
    box.position.z = Math.random() * radius - radius * 0.5;
    */

    //Position en forme de sphere
    const { x, y, z } = getRandomSpherePoint({ radius });
    box.position.set(x, y, z);
    scene.add(box);
  }
}
getLayout();

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
