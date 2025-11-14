import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const renderer = new THREE.WebGLRenderer({ antialias: true });
const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();
let dayTexture = textureLoader.load("./img/earth_texture.png");
dayTexture.colorSpace = THREE.SRGBColorSpace;
let nightTexture = textureLoader.load("./img/earth_texture_night.png");
nightTexture.colorSpace = THREE.SRGBColorSpace;
let cloudTexture = textureLoader.load("./img/clouds.png");
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

/*--------------------------------------------- LIGHTS -------------------------------------------------*/
var light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(100000, 0, 0);
scene.add(light);

scene.add(new THREE.AmbientLight(0xbbbbbb, 0.2));
/*--------------------------------------------- LIGHTS -------------------------------------------------*/

const geometry = new THREE.SphereGeometry(15, 100, 100);
const earthMaterial = new THREE.ShaderMaterial({
  uniforms: {
    dayTexture: { value: dayTexture },
    nightTexture: { value: nightTexture },
    cloudTexture: { value: cloudTexture },
    sunDirection: { value: light.position.normalize() },
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec2 vUv;

    void main() {
      vNormal = normalize(normal); // Get normal of the vertex
      vUv = uv; // Pass UV coordinates to the fragment shader
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
  fragmentShader: `
    uniform sampler2D dayTexture;
    uniform sampler2D nightTexture;
    uniform sampler2D cloudTexture;
    uniform vec3 sunDirection;

    varying vec3 vNormal;
    varying vec2 vUv;

    void main() {
      float lightFactor = dot(vNormal, sunDirection);
      float mixFactor = smoothstep(-0.0001, 0.8, lightFactor);

      vec4 dayColor = texture2D(dayTexture, vUv);
      vec4 nightColor = texture2D(nightTexture, vUv) * 5.9;
      vec4 cloudColor = texture2D(cloudTexture, vUv) *0.5;

      vec4 earthColor = mix(nightColor, dayColor, mixFactor);

      float mixFactor2 = smoothstep(-0.99999, 0.5, lightFactor);
      gl_FragColor = mix(earthColor, earthColor+cloudColor, mixFactor2);
    }`,
});

const sphere = new THREE.Mesh(geometry, earthMaterial);
sphere.rotateY(-90 * (Math.PI / 180));
sphere.rotateZ(-35 * (Math.PI / 180));
scene.add(sphere);

/**************************************** GLOW ************************************************ */
const glowMaterial = new THREE.ShaderMaterial({
  uniforms: {
    sunDirection: { value: light.position.clone().normalize() },
  },
  //side: THREE.BackSide, // Rend la face interne visible
  transparent: true,
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`,
  fragmentShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform vec3 sunDirection;

    void main() {
      // Calcul du Fresnel 
      vec3 viewDir = normalize(cameraPosition - vPosition);
      float fresnel = 1.0-abs(dot(viewDir, vNormal));

      // Simulation de la lumière du soleil
      float lightFactor = max(dot(normalize(sunDirection), abs(vNormal)), 0.0);
      //on prend ABS de vNormal pour les 2 cotés de la planete

      // Intensité du glow, ajustable
      float intensity = pow(fresnel, 2.5) * lightFactor * 1.5;

      // Couleur du glow
      vec3 glowColor = vec3(0.3, 0.6, 1.0); 

      gl_FragColor = vec4(glowColor * intensity, intensity);
    }
`,
});

const cloudGeometry = new THREE.SphereGeometry(15.2, 64, 64);
const glow = new THREE.Mesh(cloudGeometry, glowMaterial);
scene.add(glow);
//glow.position.y = 30; //REMOVE THIS LINE WHEN OK
/**************************************** GLOW ************************************************ */

sphere.position.set(0, 0, 0);

//DEBUG
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// -- space background ------------------------------------------------------
var stars = new Array(0);
for (var i = 0; i < 10000; i++) {
  let x = THREE.MathUtils.randFloatSpread(2000);
  let y = THREE.MathUtils.randFloatSpread(2000);
  let z = THREE.MathUtils.randFloatSpread(2000);
  stars.push(x, y, z);
}
var starsGeometry = new THREE.BufferGeometry();
starsGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(stars, 3)
);
var starsMaterial = new THREE.PointsMaterial({ color: 0x888888 });
var starField = new THREE.Points(starsGeometry, starsMaterial);
scene.add(starField);

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
