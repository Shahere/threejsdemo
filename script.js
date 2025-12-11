import * as THREE from "three";

import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";

let red_button = document.getElementById("red");
let blue_button = document.getElementById("blue");
let grey_button = document.getElementById("grey");
let black_button = document.getElementById("black");
let scroll_container = document.getElementById("scrollContainer");

red_button.addEventListener("click", function () {
  change_color(0xff0000, 0x000000);
});
blue_button.addEventListener("click", function () {
  change_color(0x0000ff, 0xffffff);
});
grey_button.addEventListener("click", function () {
  change_color(0xffffff, 0x000000);
});
black_button.addEventListener("click", function () {
  change_color(0x000000, 0xbbbbbb);
});

const Projects = [
  "./assets/img/projects/joshuadavis.png",
  "./assets/img/projects/spacecube.png",
  "./assets/img/projects/drop.png",
  "./assets/img/projects/voxels.png",
  "./assets/img/projects/lightbox.png",
  "./assets/img/projects/earth.png",
  "./assets/img/projects/physics.png",
  "./assets/img/projects/fps.png",
  "./assets/img/projects/fp.png",
];

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
const scene = new THREE.Scene();
let currentBgColor = new THREE.Color(0x000000);
scene.background = currentBgColor;

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

if (window.screen.width <= 600) {
  camera.position.set(20, 30, 5);
}

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

scene.add(new THREE.AmbientLight(0xffffff, 5));

/*--------------------------------------------- LIGHTS -------------------------------------------------*/

//DEBUG
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

let currentTextColor = new THREE.Color(0xbbbbbb);
let colorTop = currentTextColor;
let colorBottom = currentBgColor;

const loader = new FontLoader();
let text_geometry;
loader.load("./assets/fonts/Overcome.json", function (font) {
  text_geometry = new TextGeometry("web graphic \nexperiments", {
    font: font,
    size: 8,
    depth: 5,
  });
  // 2. Calcul des bornes min/max en Y (hauteur du texte)
  text_geometry.computeBoundingBox();
  const minZ = text_geometry.boundingBox.min.z;
  const maxZ = text_geometry.boundingBox.max.z;

  const colors = [];

  const position = text_geometry.attributes.position;
  for (let i = 0; i < position.count; i++) {
    const z = position.getZ(i);
    let t = (z - minZ) / (maxZ - minZ) - 0.4;
    t = t * 0.5;
    const color = colorBottom.clone().lerp(colorTop, t);
    colors.push(color.r, color.g, color.b);
  }

  text_geometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(colors, 3)
  );

  const material = new THREE.MeshBasicMaterial({
    vertexColors: true,
    side: THREE.DoubleSide,
  });
  const textMesh = new THREE.Mesh(text_geometry, material);
  textMesh.rotation.x = -Math.PI / 2;
  textMesh.rotation.z = Math.PI / 2;
  textMesh.position.set(-10, 0, 25);
  scene.add(textMesh);
  textMesh.layers.enable(1);

  //This thing take sooo much time to load
  document.getElementById("page-loader").classList.add("hidden");
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

const group_flag = new THREE.Group();
let nbflags = 9;
for (let i = 0; i < nbflags; i++) {
  let flag = createFlag(0, 7, i * -25, i);
  group_flag.add(flag);
}
scene.add(group_flag);

const box = new THREE.Box3().setFromObject(group_flag);
const size = new THREE.Vector3();
box.getSize(size);

function animate() {
  requestAnimationFrame(animate);

  // c'est l'effet Overshoot
  const forceY = (targetRotationY - scene.rotation.y) * stiffness;
  velocityY = velocityY * damping + forceY;
  scene.rotation.y += velocityY;

  const forceZ = (targetRotationZ - scene.rotation.z) * stiffness;
  velocityZ = velocityZ * damping + forceZ;
  scene.rotation.z += velocityZ;

  group_flag.children.forEach((flag) => {
    const h = 0; // Fréquence horizontale
    const v = 0.3; // Fréquence verticale
    const w = 0.2; // Amplitude
    const s = 0.12; // Vitesse

    const position = flag.geometry.attributes.position;
    const count = position.count;

    const time = (Date.now() * s) / 50;

    for (let i = 0; i < count; i++) {
      const x = position.getX(i);
      const y = position.getY(i);

      const z = (Math.sin(h * x + v * y - time) * w * x) / 4;
      position.setZ(i, z);
    }

    position.needsUpdate = true;
  });

  const style = getComputedStyle(scroll_container);
  const matrix = new DOMMatrixReadOnly(style.transform);
  let MIN_VAL = -1805;
  let curr_val = matrix.m42;
  //console.log(curr_val); // Il faut decommenter cette ligne pour avoir la min_val
  group_flag.position.z = (curr_val * (size.z - 20)) / MIN_VAL;

  renderer.render(scene, camera);

  let time;
  if (window.innerWidth < 1100) {
    time = Date.now() * 0.0003;
    scene.rotation.y = 0.05 * (1 + Math.sin(time));
    camera.position.set(
      20 + Math.sin(time) * 2,
      30,
      5 + 5 * Math.cos(time) * 5
    );
  }
}

animate();

function change_color(targetBg, targetText, duration = 500) {
  const startTime = performance.now();
  const startBg = currentBgColor.clone();
  const startText = currentTextColor.clone();

  const endBg = new THREE.Color(targetBg);
  const endText = new THREE.Color(targetText);

  function animate() {
    const now = performance.now();
    const t = Math.min((now - startTime) / duration, 1);

    // Interpolation
    currentBgColor = startBg.clone().lerp(endBg, t);
    currentTextColor = startText.clone().lerp(endText, t);

    // Applique la couleur de fond
    scene.background = currentBgColor.clone();

    // Recalcule les couleurs du texte avec interpolation
    text_geometry.computeBoundingBox();
    const minZ = text_geometry.boundingBox.min.z;
    const maxZ = text_geometry.boundingBox.max.z;
    const colors = [];
    const position = text_geometry.attributes.position;

    for (let i = 0; i < position.count; i++) {
      const z = position.getZ(i);
      let tt = (z - minZ) / (maxZ - minZ) - 0.2;
      tt *= 0.5;
      const color = currentBgColor.clone().lerp(currentTextColor, tt);
      colors.push(color.r, color.g, color.b);
    }

    text_geometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3)
    );

    // Continue jusqu'à la fin de la transition
    if (t < 1) requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

let flagTexture = null;
function createFlag(x, y, z, loop_indice) {
  let flag_geometry = new THREE.PlaneGeometry(10, 20, 10, 20);
  let flag_material = new THREE.MeshLambertMaterial({
    color: 0x777777,
    side: THREE.DoubleSide,
  });
  let flag = new THREE.Mesh(flag_geometry, flag_material);
  flag.rotation.x = -Math.PI / 2;
  flag.position.set(x, y, z);

  const url = Projects[loop_indice];
  const loader = new THREE.TextureLoader();
  loader.load(url, (texture) => {
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearFilter;

    texture.center.set(0.5, 0.5);
    texture.rotation = Math.PI / 2;

    flag.material = new THREE.MeshLambertMaterial({
      color: 0x777777,
      map: texture,
      side: THREE.DoubleSide,
    });
  });

  return flag;
}
