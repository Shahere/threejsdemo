import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

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
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let controls = new OrbitControls(camera, renderer.domElement);

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
material.thickness = 1.0;

var loader = new THREE.TextureLoader();
loader.load(
  "./img/panorama.jpg",
  function (texture) {
    var sphereGeometry = new THREE.SphereGeometry(500, 60, 40);
    var sphereMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    sphereGeometry.scale(-1, 1, 1);
    var mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(mesh);
    mesh.position.set(0, 0, 0);
  },
  (progress) => {
    console.log(progress);
  },
  (error) => {
    console.log("Error while loading env");
    console.log(error);
  }
);

const sphere = new THREE.Mesh(sphereGeometry, material);
sphere.position.x = 0;
scene.add(sphere);

const icosahedron = new THREE.Mesh(icosahedronGeometry, material);
icosahedron.position.x = 3;
scene.add(icosahedron);

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

function render() {
  renderer.render(scene, camera);
}

animate();
