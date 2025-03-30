import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const renderer = new THREE.WebGLRenderer({ antialias: true });
const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();
let dayTexture = textureLoader.load("/img/earth_texture.png");
dayTexture.colorSpace = THREE.SRGBColorSpace;
let nightTexture = textureLoader.load("/img/earth_texture_night.png");
nightTexture.colorSpace = THREE.SRGBColorSpace;
let cloudTexture = textureLoader.load("/img/clouds.jpg");
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 0, 30);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.SphereGeometry(15, 500, 500);
const earthMaterial = new THREE.ShaderMaterial({
  uniforms: {
    dayTexture: { value: dayTexture },
    nightTexture: { value: nightTexture },
    sunDirection: { value: new THREE.Vector3(1.0, 0.0, 0.0) }, // Fake "sun" coming from +X direction
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec2 vUv;

    void main() {
      vNormal = normalize(normal); // Get normal of the vertex
      vUv = uv; // Pass UV coordinates to the fragment shader
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D dayTexture;
    uniform sampler2D nightTexture;
    uniform vec3 sunDirection;

    varying vec3 vNormal;
    varying vec2 vUv;

    void main() {
      float lightFactor = dot(vNormal, sunDirection); // Determines brightness (1 = day, -1 = night)
      float mixFactor = smoothstep(-0.2, 0.2, lightFactor); // Soft transition between day & night

      vec4 dayColor = texture2D(dayTexture, vUv);
      vec4 nightColor = texture2D(nightTexture, vUv);

      gl_FragColor = mix(nightColor, dayColor, mixFactor); // Blend based on lightFactor
    }
  `,
});

const sphere = new THREE.Mesh(geometry, earthMaterial);
scene.add(sphere);

sphere.position.set(0, 0, 0);

//DEBUG
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();

let centerButton = document.getElementsByClassName("center")[0];
centerButton.addEventListener("click", () => {
  camera.position.set(0, 0, 30);
  controls.target.set(0, 0, 0);
  controls.update();
});
