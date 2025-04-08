import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let colorPicker = document.getElementById("head");
let blockColor = colorPicker.value;
colorPicker.addEventListener("input", updateFirst, true);

function updateFirst(event) {
  event.preventDefault();
  blockColor = event.target.value;
}

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

/************************************basic setup***********************************/
const size = 20;
const divisions = 20;
const gridHelper = new THREE.GridHelper(size, divisions);
gridHelper.position.set(0, 0, 0);
scene.add(gridHelper);
gridHelper.isVisible = true;

const cubeGroup = new THREE.Group();
scene.add(cubeGroup);

for (let x = -10; x < size / 2; x++) {
  for (let y = 0; y < size; y++) {
    for (let z = -10; z < size / 2; z++) {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(x + 0.5, y + 0.5, z + 0.5);
      cubeGroup.add(cube);
      cube.userData.tablex = x;
      cube.userData.tabley = y;
      cube.userData.tablez = z;
    }
  }
}

scene.add(cubeGroup);

/* Floor */
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

/* -------------------------------- RAYCASTER METHOD -------------------------------------- */

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let previousHighlightedCube = null;
window.addEventListener("pointermove", onPointerMove);
function onPointerMove(event) {
  if (previousHighlightedCube) {
    previousHighlightedCube.material.opacity = 0;
  }

  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(cubeGroup.children, true);

  if (intersects.length > 0) {
    let clickedCube = intersects[0].object;
    let i = 1;
    while (!checkNeighbour(clickedCube)) {
      if (i == intersects.length) return;
      //console.log(i, clickedCube.material.opacity);
      clickedCube = intersects[i].object;
      i++;
    }

    clickedCube.material.opacity = 0.4;
    clickedCube.material.depthWrite = true;
    clickedCube.material.color.set(blockColor);
    previousHighlightedCube = clickedCube;
  }
}

function addCube(event) {
  if (previousHighlightedCube == null) return;
  let objectEdges = new THREE.LineSegments(
    new THREE.EdgesGeometry(previousHighlightedCube.geometry),
    new THREE.LineBasicMaterial({
      color: "black",
      //opacity: 0,
      //transparent: true,
    })
  );
  previousHighlightedCube.add(objectEdges);
  previousHighlightedCube.material.opacity = 1;
  previousHighlightedCube.material.depthWrite = true;
  previousHighlightedCube.material.color.set(blockColor);
  previousHighlightedCube = null;
  onPointerMove(event);
}

function deleteCube(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(cubeGroup.children, true);

  if (intersects.length > 0) {
    let clickedCube = intersects[0].object;
    let i = 1;
    while (clickedCube.material.opacity != 1) {
      if (i == intersects.length) return;
      clickedCube = intersects[i].object;
      i++;
    }

    clickedCube.material.opacity = 0.0;
    clickedCube.material.depthWrite = false;
    clickedCube.material.transparent = true;
    clickedCube.material.needsUpdate = true;
    clickedCube.material.blending = THREE.NormalBlending;

    //On regarde aussi le parent
    const parent = clickedCube.parent;

    parent.traverse((child) => {
      if (child.material && child.material.opacity === 1) {
        child.material.transparent = true;
        child.material.opacity = 0.0;
        child.material.depthWrite = false;
        child.material.needsUpdate = true;
      }
    });
  }
  onPointerMove(event);
}

/**
 * return true if the cube can be printed
 * @param {*} cube
 */
function checkNeighbour(cube) {
  const { tablex, tabley, tablez } = cube.userData;

  const directions = [
    [1, 0, 0],
    [-1, 0, 0],
    [0, 1, 0],
    [0, -1, 0],
    [0, 0, 1],
    [0, 0, -1],
  ];

  for (const [dx, dy, dz] of directions) {
    const neighbor = cubeGroup.children.find((c) => {
      const ux = c.userData.tablex;
      const uy = c.userData.tabley;
      const uz = c.userData.tablez;
      return ux === tablex + dx && uy === tabley + dy && uz === tablez + dz;
    });

    if (neighbor && neighbor.material.opacity > 0) {
      return true; // au moins un voisin visible
    }
  }

  if (tabley == 0 && cube.material.opacity != 1) {
    return true; //cube au sol
  }

  return false; // aucun voisin visible
}

/* -------------------------------- RAYCASTER METHOD -------------------------------------- */

animate();
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

window.addEventListener("pointermove", onPointerMove);

/*---------------------------------- control logiq ----------------------------------------*/

let isDown = false;
let startX = 0;
let startY = 0;
let hasMoved = false;
let startTime = 0;

renderer.domElement.addEventListener("mousedown", (e) => {
  isDown = true;
  startX = e.clientX;
  startY = e.clientY;
  hasMoved = false;
  startTime = Date.now();
});

renderer.domElement.addEventListener("mousemove", (e) => {
  if (isDown) {
    const dx = Math.abs(e.clientX - startX);
    const dy = Math.abs(e.clientY - startY);
    if (dx > 5 || dy > 5) {
      hasMoved = true;
    }
  }
});

renderer.domElement.addEventListener("mouseup", (e) => {
  isDown = false;
  const duration = Date.now() - startTime;

  if (hasMoved) {
  } else if (duration > 500) {
    //Click long ou glissement
  } else {
    if (e.button == 0) {
      addCube(e);
    } else if (e.button == 2) {
      deleteCube(e);
    }
  }
});
