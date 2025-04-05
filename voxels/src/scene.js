import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const renderer = new THREE.WebGLRenderer(/*{ antialias: true }*/);
const scene = new THREE.Scene();
scene.add(new THREE.AmbientLight(0xffffff, 1));
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

/************************************basic setup***********************************/
const size = 20;
const divisions = 20;
const gridHelper = new THREE.GridHelper(size, divisions);
gridHelper.position.set(0, 0, 0);
scene.add(gridHelper);
gridHelper.isVisible = true;

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
      cube.isVisible = false;
    }
  }
}

/************************************basic setup***********************************/

/* -------------------------------- RAYCASTER METHOD -------------------------------------- */

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let previousHighlightedCube = null;
window.addEventListener("pointermove", onPointerMove);
function onPointerMove(event) {
  if (previousHighlightedCube) {
    previousHighlightedCube.material.opacity = 0;
  }
  // calculate pointer position in normalized device coordinates
  // (-1 to +1) for both components

  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    let i = 1;
    let clickedCube = intersects[intersects.length - 1].object;
    /*if (clickedCube.isVisible == true) {
      while (1) {
        clickedCube = intersects[intersects.length - i].object;
        i++;
        if (clickedCube.isVisible == false) break;
      }

      clickedCube.material.opacity = 1;
      clickedCube.material.color.set(0xffffff);
      previousHighlightedCube = clickedCube;
    }*/
  }
}

/* -------------------------------- RAYCASTER METHOD -------------------------------------- */

animate();
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

window.addEventListener("pointermove", onPointerMove);
