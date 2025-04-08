import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const renderer = new THREE.WebGLRenderer({ antialias: true });
//renderer.shadowMap.enabled = true;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xaaaaaa);
/* SET THE LIGHT */
scene.add(new THREE.AmbientLight(0xffffff, 1));

/* END SET THE LIGHT */
const axesHelper = new THREE.AxesHelper();
//scene.add(axesHelper);

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

/* Floor */
let size = 20;
const floor = new THREE.Group();
for (let x = -10; x < size / 2; x++) {
  for (let z = -10; z < size / 2; z++) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(x + 0.5, -0.5, z + 0.5);
    cube.receiveShadow = true;
    floor.add(cube);
  }
}
scene.add(floor);

/************************************basic setup***********************************/
const divisions = 20;
const gridHelper = new THREE.GridHelper(size, divisions);
gridHelper.position.set(0, 0, 0);
scene.add(gridHelper);
gridHelper.isVisible = true;

/* -------------------------------- RAYCASTER METHOD -------------------------------------- */

animate();
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
