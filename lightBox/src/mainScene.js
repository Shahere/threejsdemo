import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import scene2 from "./scene2";
import scene1 from "./scene1";

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xaaaaaa);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(5, 5, 10);
const controls = new OrbitControls(camera, renderer.domElement);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let [groupSCENE, sl11, sl12, sl13] = scene1();
let slHelper11 = new THREE.SpotLightHelper(sl11);
let slHelper12 = new THREE.SpotLightHelper(sl12);
let slHelper13 = new THREE.SpotLightHelper(sl13);
scene.add(slHelper11);
scene.add(slHelper12);
scene.add(slHelper13);
groupSCENE.position.set(0, 0, 0);
scene.add(groupSCENE);

let [groupSCENE2, sl, sl2, sl3] = scene2();
let slHelper = new THREE.SpotLightHelper(sl);
let slHelper2 = new THREE.SpotLightHelper(sl2);
let slHelper3 = new THREE.SpotLightHelper(sl3);
scene.add(slHelper);
scene.add(slHelper2);
scene.add(slHelper3);
groupSCENE2.position.set(25, 0, 0);
scene.add(groupSCENE2);

let targetPosition = null;
let targetLookAt = null;
let isAnimating = false;
let currentLookAt = new THREE.Vector3(0, 0, 0);

animate();
function animate() {
  requestAnimationFrame(animate);
  controls.update();

  if (isAnimating && targetPosition && targetLookAt) {
    camera.position.lerp(targetPosition, 0.05);
    currentLookAt.lerp(targetLookAt, 0.05);
    camera.lookAt(currentLookAt);

    // Synchronize OrbitControls target
    controls.target.copy(currentLookAt);

    // Check if the camera is close enough to the target position
    if (
      camera.position.distanceTo(targetPosition) < 0.01 &&
      currentLookAt.distanceTo(targetLookAt) < 0.01
    ) {
      isAnimating = false;
      console.log(currentLookAt);
    }
  } else if (!isAnimating && targetLookAt) {
    camera.lookAt(targetLookAt);
    controls.target.copy(targetLookAt);
    controls.enabled = true;
  }

  renderer.render(scene, camera);
}

let state = 0; // 0 = scene1, 1 = scene2
let additiveButton = document.getElementsByClassName("additive")[0];
let soustractiveButton = document.getElementsByClassName("soustractive")[0];

additiveButton.addEventListener("click", function () {
  if (state == 0) return;
  controls.enabled = false;
  targetPosition = new THREE.Vector3(16, 17, 36);
  targetLookAt = new THREE.Vector3(25, 0, 0);
  isAnimating = true;
  setTimeout(() => {
    targetPosition = new THREE.Vector3(5, 5, 10);
    targetLookAt = new THREE.Vector3(0, 0, 0);
    isAnimating = true;
    state = 0;
  }, 1000);
});

soustractiveButton.addEventListener("click", function () {
  if (state == 1) return;
  controls.enabled = false;
  targetPosition = new THREE.Vector3(16, 17, 36);
  targetLookAt = new THREE.Vector3(0, 0, 0);
  isAnimating = true;
  setTimeout(() => {
    targetPosition = new THREE.Vector3(17, 5, 10);
    targetLookAt = new THREE.Vector3(25, 0, 0);
    isAnimating = true;
    state = 1;
  }, 1000);
});
