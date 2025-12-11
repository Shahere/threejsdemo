import * as THREE from "three";
console.log(THREE.REVISION);
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  10,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(100, 0, 0);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const composer = new EffectComposer(renderer);
const ssaopass = new SSAOPass(
  scene,
  camera,
  window.innerWidth,
  window.innerHeight
);
ssaopass.kernelRadius = 0.25;
ssaopass.minDistance = 0.00001;
ssaopass.maxDistance = 0.01;
ssaopass.output = SSAOPass.OUTPUT.Default;
composer.addPass(ssaopass);

const boxGroup = new THREE.Group();
scene.add(boxGroup);

const startPos = {
  y: -2,
  z: -2,
};
const boxGeometry = new THREE.BoxGeometry();
const palette = [0x2b2b42, 0x8d99ae, 0xedf2f4, 0xef233c, 0xd90426];

function getBox({ size = 1, x = 0, y = 0, z = 0, hex = 0xff0000 }) {
  const color = new THREE.Color(hex);
  const standardMaterial = new THREE.MeshBasicMaterial({ color });
  const cube = new THREE.Mesh(boxGeometry, standardMaterial);
  cube.position.y = startPos.y + y;
  cube.position.z = startPos.z + z;
  cube.position.x = x;
  cube.rotation.x = Math.PI * 0.25;
  cube.scale.setScalar(size);
  return cube;
}

function getLayers({ x = 0, useRandomSize = false }) {
  const gridSize = 5;
  for (let y = 0; y < gridSize; y++) {
    for (let z = 0; z < gridSize; z++) {
      const randomIndex = Math.floor(Math.random() * palette.length);
      const hex = palette[randomIndex];
      let size = 1.5;
      if (useRandomSize) {
        size = Math.random() * 1.5 + 0.25;
      }
      const box = getBox({ size, x, y, z, hex });
      boxGroup.add(box);
    }
  }
}

getLayers({ x: 0 });
getLayers({ x: 1, useRandomSize: true });

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

function animate(time) {
  requestAnimationFrame(animate);
  controls.update();

  composer.render(scene, camera);
}

function render() {
  renderer.render(scene, camera);
}

animate();
