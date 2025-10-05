import * as THREE from "three";

import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

const renderer = new THREE.WebGLRenderer({ antialias: true });
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(12, 25, 5);
//camera.position.set(30, 30, 30);
//camera.position.set(50, 30, 50);
camera.lookAt(0, 0, 0);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/*--------------------------------------------- LIGHTS -------------------------------------------------*/

scene.add(new THREE.AmbientLight(0xffffff, 10));

/*const sl = new THREE.SpotLight(0xffffff, 1000000, 100000, Math.PI, 0);
sl.position.set(30, 30, 30);
sl.target.position.set(0, 0, 0);
const slHelper = new THREE.SpotLightHelper(sl);
sl.castShadow = true;
scene.add(sl);
scene.add(slHelper);
scene.add(sl.target);*/

/*--------------------------------------------- LIGHTS -------------------------------------------------*/

//DEBUG
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const geometry = new THREE.PlaneGeometry(10, 10, 1, 1);
const material = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
  roughness: 0.1,
  metalness: 0,
  envMap: 1,
  envMapIntensity: 1,
});

for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 10; j++) {
    let plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = Math.PI / 2;
    scene.add(plane);
    plane.position.x = i * 10;
    plane.position.z = j * 10;

    plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = Math.PI / 2;
    scene.add(plane);
    plane.position.x = i * 10 * -1;
    plane.position.z = j * 10 * -1;

    plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = Math.PI / 2;
    scene.add(plane);
    plane.position.x = i * 10 * -1;
    plane.position.z = j * 10;

    plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = Math.PI / 2;
    scene.add(plane);
    plane.position.x = i * 10;
    plane.position.z = j * 10 * -1;
  }
}

const loader = new FontLoader();

loader.load("./fonts/Farenheight.json", function (font) {
  const geometry = new TextGeometry("Savinien \nBarbotaud", {
    font: font,
    size: 8,
    depth: 5,
    curveSegments: 12,
  });

  const textMesh = new THREE.Mesh(geometry, [
    new THREE.MeshBasicMaterial({ color: 0xffffff }),
    new THREE.MeshBasicMaterial({ color: 0x999999 }),
  ]);
  textMesh.rotation.x = -Math.PI / 2;
  textMesh.rotation.z = Math.PI / 2;
  textMesh.position.z = 25;
  textMesh.position.x = -10;
  scene.add(textMesh);
});

let targetRotationY = 0;
let targetRotationZ = 0;

let velocityY = 0;
let velocityZ = 0;

const stiffness = 0.03; // force du ressort
const damping = 0.8; // amortissement (0-1), plus petit = plus de rebond

document.addEventListener("mousemove", (event) => {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  const x = event.clientX - centerX;
  const y = event.clientY - centerY;

  targetRotationY = x * 0.00035;
  targetRotationZ = y * -0.00035;
});

function animate() {
  requestAnimationFrame(animate);

  // Calcul type "ressort"
  const forceY = (targetRotationY - scene.rotation.y) * stiffness;
  velocityY = velocityY * damping + forceY;
  scene.rotation.y += velocityY;

  const forceZ = (targetRotationZ - scene.rotation.z) * stiffness;
  velocityZ = velocityZ * damping + forceZ;
  scene.rotation.z += velocityZ;

  renderer.render(scene, camera);
}

animate();
