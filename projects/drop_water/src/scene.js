import * as THREE from "three";
console.log(THREE.REVISION);
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise.js";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass.js";

const loader = new FontLoader();
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcccccc);

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
loader.load("../../assets/fonts/Overcome.json", function (font) {
  text_geometry = new TextGeometry("web graphic experiments", {
    font: font,
    size: 2,
    depth: 0.1,
  });

  const main = new THREE.Mesh(
    text_geometry,
    new THREE.MeshBasicMaterial({ color: 0xff8c00 })
  );
  const red = new THREE.Mesh(
    text_geometry,
    new THREE.MeshBasicMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 0.6,
    })
  );
  const blue = new THREE.Mesh(
    text_geometry,
    new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.6,
    })
  );

  main.rotation.x = -Math.PI / 2;
  main.rotation.z = Math.PI / 2;
  main.position.set(0, 5, 17);
  scene.add(main);
});

// Post processing setup :
/*const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const glitchPass = new GlitchPass();
composer.addPass(glitchPass);*/

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
    const factor = 1 + n * 0.2;

    pos.array[ix] = x * factor;
    pos.array[ix + 1] = y * factor;
    pos.array[ix + 2] = z * factor;
  }

  pos.needsUpdate = true;
  icosahedronGeometry.computeVertexNormals();

  icosahedron.rotation.y += 0.005;
  icosahedron.rotation.x += 0.002;
  renderer.render(scene, camera);
  //composer.render();
}

function render() {
  renderer.render(scene, camera);
}

animate();
