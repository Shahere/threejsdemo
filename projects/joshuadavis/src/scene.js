import * as THREE from "three";
console.log(THREE.REVISION);
import { OrbitControls } from "three/examples/jsm/Addons.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  10,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(50, 0, 0);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const boxGroup = new THREE.Group();
scene.add(boxGroup);

const startPos = {
  y: -2,
  z: -2,
};
const boxGeometry = new THREE.BoxGeometry();

function getBox({ size = 1, x = 0, y = 0, z = 0, color = 0xff0000 }) {
  const standardMaterial = new THREE.MeshStandardMaterial(color);
  const cube = new THREE.Mesh(boxGeometry, standardMaterial);
  cube.position.y = startPos.y + y;
  cube.position.z = startPos.z + z;
  cube.position.x = x;
  cube.rotation.x = Math.PI * 0.25;
  cube.scale.setScalar(size);
  return cube;
}

function getLayers(x = 0) {
  const gridSize = 5;
  for (let y = 0; y < gridSize; y++) {
    for (let z = 0; z < gridSize; z++) {
      const hex = Math.random() * 0xffffff;
      const box = getBox({ size: 0.5, x, y, z, hex });
      boxGroup.add(box);
    }
  }
}

getLayers(0);
getLayers(1);

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

  renderer.render(scene, camera);
}

function render() {
  renderer.render(scene, camera);
}

animate();
