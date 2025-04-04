import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const renderer = new THREE.WebGLRenderer(/*{ antialias: true }*/);
// no antialias its too laggy otherwise
const scene = new THREE.Scene();
scene.background = 0xff0000;
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 0, 0.00001);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let loader = new THREE.TextureLoader();

const south = loader.load("/img/clouds1_south.png");
const north = loader.load("/img/clouds1_north.png");
const up = loader.load("/img/clouds1_up.png");
const down = loader.load("/img/clouds1_down.png");
const east = loader.load("/img/clouds1_east.png");
const west = loader.load("/img/clouds1_west.png");
// side: THREE.BackSide,
const materials = [
  new THREE.MeshBasicMaterial({ map: east, side: THREE.BackSide }), // Right
  new THREE.MeshBasicMaterial({ map: west, side: THREE.BackSide }), // Left
  new THREE.MeshBasicMaterial({ map: up, side: THREE.BackSide }), // Top
  new THREE.MeshBasicMaterial({ map: down, side: THREE.BackSide }), // Bottom
  new THREE.MeshBasicMaterial({ map: north, side: THREE.BackSide }), // Front
  new THREE.MeshBasicMaterial({ map: south, side: THREE.BackSide }), // Back
];

let skyboxGeo = new THREE.BoxGeometry(1000, 1000, 1000);
let skybox = new THREE.Mesh(skyboxGeo, materials);
scene.add(skybox);

let nbItems = 10000;
for (let index = 0; index < nbItems; index++) {
  let geometry = new THREE.BoxGeometry(
    Math.random() * 50,
    Math.random() * 50,
    Math.random() * 50
  );
  const material = new THREE.MeshBasicMaterial({ color: getRandomColor() });
  const box = new THREE.Mesh(geometry, material);
  scene.add(box);
  box.position.x = getRandomPosition() * 1000;
  box.position.y = getRandomPosition() * 1000;
  box.position.z = getRandomPosition() * 1000;
}

/*--------------------------------------------- LIGHTS -------------------------------------------------*/
scene.add(new THREE.AmbientLight(0xffffff, 1));
/*--------------------------------------------- LIGHTS -------------------------------------------------*/

//DEBUG
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/**
 *
 * @returns Number between -1 and 1
 */
function getRandomPosition() {
  var ranNum = Math.random() * (Math.round(Math.random()) ? 1 : -1);
  return ranNum;
}

/**
 * Brighter HEX colors
 * @param {*} hex
 * @param {*} lum
 * @returns
 */
function colorLuminance(hex, lum) {
  // validate hex string
  hex = String(hex).replace(/[^0-9a-f]/gi, "");
  if (hex.length < 6) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  lum = lum || 0;

  // convert to decimal and change luminosity
  var rgb = "#",
    c,
    i;
  for (i = 0; i < 3; i++) {
    c = parseInt(hex.substr(i * 2, 2), 16);
    c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
    rgb += ("00" + c).substr(c.length);
  }

  return rgb;
}

/* -------------------------------- RAYCASTER METHOD -------------------------------------- */

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
window.addEventListener("pointermove", onPointerMove);
function onPointerMove(event) {
  // calculate pointer position in normalized device coordinates
  // (-1 to +1) for both components

  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

/* -------------------------------- RAYCASTER METHOD -------------------------------------- */

let previousInterserts = [];

animate();
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  // update the picking ray with the camera and pointer position
  raycaster.setFromCamera(pointer, camera);

  // calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(scene.children);
  for (let i = 0; i < intersects.length; i++) {
    if (intersects[i].object.material.color) {
      intersects[i].object.material.color.baseColor =
        intersects[i].object.material.color.getHex();
      intersects[i].object.material.color.set(
        colorLuminance(intersects[i].object.material.color.getHexString(), 0.8)
      );
    }
  }
  renderer.render(scene, camera);
  previousInterserts = intersects;
  for (let i = 0; i < previousInterserts.length; i++) {
    if (previousInterserts[i].object.material.color) {
      previousInterserts[i].object.material.color.set(
        previousInterserts[i].object.material.color.baseColor
      );
    }
  }
}

window.addEventListener(
  "wheel",
  (e) => {
    if (e.deltaY < 0) {
      camera.fov = camera.fov + 3;
    } else {
      camera.fov = camera.fov - 3;
    }
    camera.updateProjectionMatrix();
  },
  false
);
