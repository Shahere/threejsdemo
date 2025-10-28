import * as THREE from "three";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise.js";

const loader = new FontLoader();
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);

const light = new THREE.PointLight(0xffffff, 1000);
light.position.set(10, 10, 10);
scene.add(light);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0.01, 21, 0);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const icosahedronGeometry = new THREE.IcosahedronGeometry(1, 50);

const material = new THREE.MeshPhysicalMaterial({});
material.reflectivity = 0;
material.transmission = 1.0;
material.roughness = 0.1;
material.metalness = 0;
material.clearcoat = 0.1;
material.clearcoatRoughness = 1;
material.color = new THREE.Color(0xffffff);
material.ior = 1.2; // The loop effect 1 = nothing
material.thickness = 0.7;

const icosahedron = new THREE.Mesh(icosahedronGeometry, material);
icosahedron.position.set(0, 17, 0);
scene.add(icosahedron);

let text_geometry;
loader.load("../assets/fonts/Overcome.json", function (font) {
  text_geometry = new TextGeometry("web graphic experiments", {
    font: font,
    size: 2,
    depth: 2,
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
    const color = new THREE.Color(0xff0000)
      .clone()
      .lerp(new THREE.Color(0x00ff00), t);
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
  textMesh.position.set(0, 0, 17);
  scene.add(textMesh);
  textMesh.layers.enable(1);
});

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

const noise = new ImprovedNoise();
const base = icosahedronGeometry.attributes.position.array.slice();

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  const pos = icosahedronGeometry.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const ix = i * 3;
    const x = base[ix];
    const y = base[ix + 1];
    const z = base[ix + 2];

    const n = noise.noise(x * 1.2 + t * 0.5, y * 1.2 + t * 0.5, z * 1.2);
    const factor = 1 + n * 0.1;

    pos.array[ix] = x * factor;
    pos.array[ix + 1] = y * factor;
    pos.array[ix + 2] = z * factor;
  }

  pos.needsUpdate = true;
  icosahedronGeometry.computeVertexNormals();

  icosahedron.rotation.y += 0.005;
  icosahedron.rotation.x += 0.002;
  renderer.render(scene, camera);
}

function render() {
  renderer.render(scene, camera);
}

animate();
