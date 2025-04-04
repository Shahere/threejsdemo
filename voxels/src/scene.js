import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const renderer = new THREE.WebGLRenderer(/*{ antialias: true }*/);
const scene = new THREE.Scene();
scene.add(new THREE.AmbientLight(0xffffff, 1));
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(5, 5, 10);
camera.lookAt(0, 0, 0);
const controls = new OrbitControls(camera, renderer.domElement);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/************************************basic setup***********************************/
const size = 20;
const divisions = 20;
const gridHelper = new THREE.GridHelper(size, divisions);
gridHelper.position.set(0, 0, 0);
scene.add(gridHelper);

for (let x = -10; x < size / 2; x++) {
  for (let y = 0; y < size; y++) {
    for (let z = -10; z < size / 2; z++) {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
      });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(x + 0.5, y + 0.5, z + 0.5);
      scene.add(cube);
    }
  }
}

/************************************basic setup***********************************/

animate();
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
