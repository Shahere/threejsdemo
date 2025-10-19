import * as THREE from "three";

import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";

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

window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

console.log(THREE.REVISION);

RectAreaLightUniformsLib.init();

/*--------------------------------------------- LIGHTS -------------------------------------------------*/

scene.add(new THREE.AmbientLight(0xffffff, 1000));

/*--------------------------------------------- LIGHTS -------------------------------------------------*/

//DEBUG
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const loader = new FontLoader();
loader.load("./assets/fonts/Overcome.json", function (font) {
  const geometry = new TextGeometry("web graphic \nexperiments", {
    font: font,
    size: 8,
    depth: 5,
  });
  // 2. Calcul des bornes min/max en Y (hauteur du texte)
  geometry.computeBoundingBox();
  const minZ = geometry.boundingBox.min.z;
  const maxZ = geometry.boundingBox.max.z;

  const colors = [];
  const colorTop = new THREE.Color(0xbbbbbb);
  const colorBottom = new THREE.Color(0x000000);

  const position = geometry.attributes.position;
  for (let i = 0; i < position.count; i++) {
    const z = position.getZ(i);
    let t = (z - minZ) / (maxZ - minZ) - 0.4;
    t = t * 0.5;
    const color = colorBottom.clone().lerp(colorTop, t);
    colors.push(color.r, color.g, color.b);
  }

  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

  const material = new THREE.MeshBasicMaterial({
    vertexColors: true,
    side: THREE.DoubleSide,
  });
  const textMesh = new THREE.Mesh(geometry, material);
  textMesh.rotation.x = -Math.PI / 2;
  textMesh.rotation.z = Math.PI / 2;
  textMesh.position.set(-10, 0, 25);
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

  targetRotationY = x * 0.00025;
  targetRotationZ = y * -0.0001;
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
