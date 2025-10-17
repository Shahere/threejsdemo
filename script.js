import * as THREE from "three";

import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";
import { Reflector } from "three/addons/objects/Reflector.js";

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

/*--------------------------------------------- LIGHTS -------------------------------------------------*/

//scene.add(new THREE.AmbientLight(0xffffff, 10));

/*--------------------------------------------- LIGHTS -------------------------------------------------*/

//DEBUG
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

scene.fog = null;

const material = new THREE.MeshStandardMaterial({ color: 0x6699ff });
material.onBeforeCompile = (shader) => {
  // Add a varying to pass world position from vertex to fragment
  shader.vertexShader = shader.vertexShader.replace(
    "void main() {",
    `
    varying vec3 vWorldPosition;
    void main() {
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
    `
  );

  // Inject varying at the top of the fragment shader
  shader.fragmentShader = shader.fragmentShader.replace(
    "void main() {",
    `
    varying vec3 vWorldPosition;
    void main() {
    `
  );

  // Replace fog fragment include with fog logic only
  shader.fragmentShader = shader.fragmentShader.replace(
    "#include <fog_fragment>",
    `
    float fogStartY = 2.0;
    float fogEndY = -5.0; // How deep you want fog
    float fogDensity = 0.75; // Strength

    //float fogFactor = smoothstep(fogStartY, fogEndY, vWorldPosition.y);
    float fogFactor = smoothstep(fogEndY, fogStartY, vWorldPosition.y);
    fogFactor *= fogDensity;

    gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.7, 0.7, 0.7), fogFactor); // Fog color
    `
  );
};
const loader = new FontLoader();
loader.load("./fonts/Overcome.json", function (font) {
  const geometry = new TextGeometry("web graphic \nexperiments", {
    font: font,
    size: 8,
    depth: 200,
  });
  const materials = [
    new THREE.MeshStandardMaterial({
      color: 0x5a5a5a,
      emissive: 0x5a5a5a,
      emissiveIntensity: 3,
    }),
    new THREE.MeshStandardMaterial({
      color: 0x5a5a5a,
      emissive: 0x5a5a5a,
      emissiveIntensity: 3,
    }),
  ];
  const textMesh = new THREE.Mesh(geometry, material);
  textMesh.rotation.x = -Math.PI / 2;
  textMesh.rotation.z = Math.PI / 2;
  textMesh.position.set(-10, -200, 25);
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

//document.documentElement.style.cursor = "none";
var cursor = document.getElementById("cursor");
document.body.addEventListener("mousemove", function (e) {
  (cursor.style.left = e.clientX + "px"), (cursor.style.top = e.clientY + "px");
});
