import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const renderer = new THREE.WebGLRenderer({ antialias: true });
const scene = new THREE.Scene();
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

let centerButton = document.getElementsByClassName("center")[0];
centerButton.addEventListener("click", () => {
  camera.position.set(0, 0, 30);
  controls.target.set(0, 0, 0);
  controls.update();
});
