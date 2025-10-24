import * as THREE from "three";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

const loader = new FontLoader();
const scene = new THREE.Scene();

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

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const sphereGeometry = new THREE.SphereGeometry();
const icosahedronGeometry = new THREE.IcosahedronGeometry(1, 0);

const material = new THREE.MeshPhysicalMaterial({});
material.reflectivity = 0.23;
material.transmission = 1.0;
material.roughness = 0.08;
material.metalness = 0;
material.clearcoat = 0.18;
material.clearcoatRoughness = 0.25;
material.color = new THREE.Color(0xffffff);
material.ior = 1.2;
material.thickness = 0.7;

const sphere = new THREE.Mesh(sphereGeometry, material);
sphere.position.set(0, 17, 0);
scene.add(sphere);

const icosahedron = new THREE.Mesh(icosahedronGeometry, material);
icosahedron.position.x = 3;
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

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function render() {
  renderer.render(scene, camera);
}

animate();
