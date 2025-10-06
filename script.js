import * as THREE from "three";

import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(12, 25, 5);
//camera.position.set(30, 30, 30);
camera.position.set(50, 50, -50);
camera.lookAt(0, 0, 0);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

console.log(THREE.REVISION);

RectAreaLightUniformsLib.init();

/*--------------------------------------------- LIGHTS -------------------------------------------------*/

//scene.add(new THREE.AmbientLight(0xffffff, 10));

/*--------------------------------------------- LIGHTS -------------------------------------------------*/

//DEBUG
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const geoFloor = new THREE.BoxGeometry(2000, 0.1, 2000);
const matStdFloor = new THREE.MeshStandardMaterial({
  color: 0xbcbcbc,
  roughness: 0.1,
  metalness: 0,
});
const mshStdFloor = new THREE.Mesh(geoFloor, matStdFloor);
scene.add(mshStdFloor);

const loader = new FontLoader();
loader.load("./fonts/Overcome.json", function (font) {
  const geometry = new TextGeometry("Hello \nWorld", {
    font: font,
    size: 8,
    depth: 2,
    curveSegments: 12,
  });
  const materials = [
    new THREE.MeshStandardMaterial({
      color: 0x00ffff, // cyan clair
      emissive: 0x00ffff, // même teinte que la couleur
      emissiveIntensity: 4,
      metalness: 0.2,
      roughness: 0.3,
    }),
    new THREE.MeshStandardMaterial({
      color: 0x00ffff, // bords plus sombres
      emissive: 0x006666, // un peu de lumière sur les côtés aussi
      emissiveIntensity: 2,
      metalness: 0.2,
      roughness: 0.3,
    }),
  ];
  const textMesh = new THREE.Mesh(geometry, materials);
  textMesh.rotation.x = -Math.PI / 2;
  textMesh.rotation.z = Math.PI / 2;
  textMesh.position.set(-10, 2, 25);
  scene.add(textMesh);
});

const rectLight1 = new THREE.RectAreaLight(0xff0000, 5, 4, 10);
rectLight1.position.set(20, 5, 5);
scene.add(rectLight1);

const rectLight2 = new THREE.RectAreaLight(0x00ff00, 5, 4, 10);
rectLight2.position.set(25, 5, 5);
scene.add(rectLight2);

const rectLight3 = new THREE.RectAreaLight(0x0000ff, 5, 4, 10);
rectLight3.position.set(30, 5, 5);
scene.add(rectLight3);

scene.add(new RectAreaLightHelper(rectLight1));
scene.add(new RectAreaLightHelper(rectLight2));
scene.add(new RectAreaLightHelper(rectLight3));

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

  // c'est l'effet Overshoot
  const forceY = (targetRotationY - scene.rotation.y) * stiffness;
  velocityY = velocityY * damping + forceY;
  scene.rotation.y += velocityY;

  const forceZ = (targetRotationZ - scene.rotation.z) * stiffness;
  velocityZ = velocityZ * damping + forceZ;
  scene.rotation.z += velocityZ;

  renderer.render(scene, camera);
}

animate();
