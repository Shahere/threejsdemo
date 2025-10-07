import * as THREE from "three";

import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";
import { Reflector } from "three/addons/objects/Reflector.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

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
//camera.position.set(50, 50, -50);
camera.lookAt(0, 0, 0);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

console.log(THREE.REVISION);

RectAreaLightUniformsLib.init();

var renderScene = new RenderPass(scene, camera);

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(
  new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.3, // strength
    0.9, // radius
    0.3 // threshold
  )
);

/*--------------------------------------------- LIGHTS -------------------------------------------------*/

//scene.add(new THREE.AmbientLight(0xffffff, 10));

/*--------------------------------------------- LIGHTS -------------------------------------------------*/

//DEBUG
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

let geometry = new THREE.PlaneGeometry(100, 100);
let groundMirror = new Reflector(geometry, {
  clipBias: 0.003,
  color: 0xb5b5b5,
});
groundMirror.position.y = 0.5;
groundMirror.rotateX(-Math.PI / 2);
scene.add(groundMirror);

const loader = new FontLoader();
loader.load("./fonts/Overcome.json", function (font) {
  const geometry = new TextGeometry("Hello \nWorld", {
    font: font,
    size: 8,
    depth: 2,
  });
  const materials = [
    new THREE.MeshStandardMaterial({
      color: 0xff0000, // cyan clair
      emissive: 0xff0000, // même teinte que la couleur
      emissiveIntensity: 4,
    }),
    new THREE.MeshStandardMaterial({
      color: 0xff0000, // bords plus sombres
      emissive: 0x220000, // un peu de lumière sur les côtés aussi
      emissiveIntensity: 1,
    }),
  ];
  const textMesh = new THREE.Mesh(geometry, materials);
  textMesh.rotation.x = -Math.PI / 2;
  textMesh.rotation.z = Math.PI / 2;
  textMesh.position.set(-10, 2, 25);
  scene.add(textMesh);
  textMesh.layers.enable(1);
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

  // c'est l'effet Overshoot
  const forceY = (targetRotationY - scene.rotation.y) * stiffness;
  velocityY = velocityY * damping + forceY;
  scene.rotation.y += velocityY;

  const forceZ = (targetRotationZ - scene.rotation.z) * stiffness;
  velocityZ = velocityZ * damping + forceZ;
  scene.rotation.z += velocityZ;

  //renderer.render(scene, camera);
  composer.render();
}

animate();
