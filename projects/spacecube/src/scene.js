import * as THREE from "three";
console.log(THREE.REVISION);
import { OrbitControls } from "three/examples/jsm/Addons.js";

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.02);
//scene.background = new THREE.Color(0xcccccc);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 25, 0);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);

const principalLight = new THREE.PointLight(0x00ff00, 100);
const principalLightHelper = new THREE.PointLightHelper(principalLight);
principalLight.position.set(0, 0, 0);
scene.add(principalLight);
//scene.add(principalLightHelper);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.02);
scene.add(ambientLight);

const standardMaterial = new THREE.MeshStandardMaterial();
standardMaterial.color = new THREE.Color(0xffffff);
const basicMaterial = new THREE.MeshBasicMaterial();
const boxGeometry = new THREE.BoxGeometry(0.7, 0.7, 0.7);
const edgeGeometry = new THREE.EdgesGeometry(boxGeometry);

function getCube() {
  const mesh = new THREE.Mesh(boxGeometry, standardMaterial);
  return mesh;
}

function getGlowCube() {
  const mesh = new THREE.LineSegments(edgeGeometry, basicMaterial);
  return mesh;
}

function getRandomSpherePoint({ radius = 10 }) {
  const minRadius = 11;
  const maxRadius = radius - minRadius;
  const range = Math.random() * maxRadius + minRadius;
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  return {
    x: range * Math.sin(phi) * Math.cos(theta),
    y: range * Math.sin(phi) * Math.sin(theta),
    z: range * Math.cos(phi),
  };
}
const cubeGroup = new THREE.Group();
const rotationSpeeds = [];
function getLayout(numBoxes = 5000, radius = 100) {
  for (let i = 0; i < numBoxes; i++) {
    const box = getCube();
    cubeGroup.add(box);
    //Reste bien pour de la position random sous forme de cube
    /*
    box.position.x = Math.random() * radius - radius * 0.5;
    box.position.y = Math.random() * radius - radius * 0.5;
    box.position.z = Math.random() * radius - radius * 0.5;
    */

    //Position en forme de sphere
    const { x, y, z } = getRandomSpherePoint({ radius });
    box.position.set(x, y, z);

    const rotate1 = Math.random() * 0.02 - 0.01;
    const rotate2 = Math.random() * 0.02 - 0.01;
    const rotate3 = Math.random() * 0.02 - 0.01;
    rotationSpeeds.push(new THREE.Vector3(rotate1, rotate2, rotate3));

    box.rotation.x = Math.random();
    box.rotation.y = Math.random();
    box.rotation.z = Math.random();
  }
  scene.add(cubeGroup);
}
getLayout();

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

  var h = (time * 0.0002) % 1;
  var s = 0.5;
  var l = 0.5;
  principalLight.color.setHSL(h, s, l);

  cubeGroup.rotateX(Math.PI * 0.0001);
  cubeGroup.rotateZ(-Math.PI * 0.0003);

  cubeGroup.children.forEach((cube, i) => {
    cube.rotation.x += rotationSpeeds[i].x;
    cube.rotation.y += rotationSpeeds[i].y;
    cube.rotation.z += rotationSpeeds[i].z;
  });

  renderer.render(scene, camera);
}

function render() {
  renderer.render(scene, camera);
}

animate();
