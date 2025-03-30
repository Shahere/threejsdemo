import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const renderer = new THREE.WebGLRenderer({ antialias: true });
const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();
let earth_texture = textureLoader.load("/img/earth_texture.png");
let earth_texture_night = textureLoader.load("/img/earth_texture_night.png");
let earth_texture_cloud = textureLoader.load("/img/clouds.jpg");
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

const geometry = new THREE.SphereGeometry(15, 32, 16);
const material = new THREE.MeshBasicMaterial({
  map: earth_texture,
});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);
sphere.position.set(0, 0, 0);

//DEBUG
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
  console.log(camera.position);
}

animate();

let centerButton = document.getElementsByClassName("center")[0];
centerButton.addEventListener("click", () => {
  camera.position.set(0, 0, 30);
  controls.target.set(0, 0, 0);
  controls.update();
});
