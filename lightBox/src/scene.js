import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xaaaaaa);
/* SET THE LIGHT */
//scene.add(new THREE.AmbientLight(0xffffff, 0.4));

// VERT
const sl = new THREE.SpotLight(0x00ff00, 1000000, 30, Math.PI / 8, 0);
sl.position.set(0, 10, 6);
sl.target.position.set(0, 4, 0);
const slHelper = new THREE.SpotLightHelper(sl);
sl.castShadow = true;
scene.add(sl, slHelper);

// BLEU
const sl2 = new THREE.SpotLight(0x0000ff, 1000000, 30, Math.PI / 8, 0);
sl2.position.set(-4, 10, 6);
sl2.target.position.set(0, 4, 2);
const slHelper2 = new THREE.SpotLightHelper(sl2);
sl2.castShadow = true;
scene.add(sl2, slHelper2);

// ROUGE
const sl3 = new THREE.SpotLight(0xff0000, 1000000, 30, Math.PI / 8, 0);
sl3.position.set(4, 10, 6);
sl3.target.position.set(0, 4, 2);
const slHelper3 = new THREE.SpotLightHelper(sl3);
sl3.castShadow = true;
scene.add(sl3, slHelper3);

/* END SET THE LIGHT */

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

/* Floor */
const groundGeometry = new THREE.BoxGeometry(20, 1, 20);
const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xfafafa });
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.receiveShadow = true;
groundMesh.position.y = -0.5;
scene.add(groundMesh);

// set up red box mesh
const bg1 = new THREE.BoxGeometry(1, 1, 1);
const bm1 = new THREE.MeshPhongMaterial({ color: 0xff0000 });
const boxMesh1 = new THREE.Mesh(bg1, bm1);
boxMesh1.castShadow = true;
boxMesh1.position.x = -5;
boxMesh1.position.y = 2;
scene.add(boxMesh1);

// set up green box mesh
const bg2 = new THREE.BoxGeometry(1, 1, 1);
const bm2 = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
const boxMesh2 = new THREE.Mesh(bg2, bm2);
boxMesh2.castShadow = true;
boxMesh2.position.x = 0;
boxMesh2.position.y = 2;
scene.add(boxMesh2);

// set up blue box mesh
const bg3 = new THREE.BoxGeometry(1, 1, 1);
const bm3 = new THREE.MeshPhongMaterial({ color: 0x0000ff });
const boxMesh3 = new THREE.Mesh(bg3, bm3);
boxMesh3.castShadow = true;
boxMesh3.position.x = 5;
boxMesh3.position.y = 2;
scene.add(boxMesh3);

// set up blue box mesh
const bg4 = new THREE.BoxGeometry(1, 1, 1);
const bm4 = new THREE.MeshPhongMaterial({ color: 0xffffff });
const boxMesh4 = new THREE.Mesh(bg4, bm4);
boxMesh4.castShadow = true;
boxMesh4.position.x = 3;
boxMesh4.position.y = 2;
boxMesh4.position.z = -3;
scene.add(boxMesh4);

// set up blue box mesh
const bg5 = new THREE.BoxGeometry(1, 1, 1);
const bm5 = new THREE.MeshPhongMaterial({ color: 0xffffff });
const boxMesh5 = new THREE.Mesh(bg5, bm5);
boxMesh5.castShadow = true;
boxMesh5.position.x = -3;
boxMesh5.position.y = 2;
boxMesh5.position.z = -3;
scene.add(boxMesh5);

// set up blue box mesh
const bg6 = new THREE.BoxGeometry(1, 1, 1);
const bm6 = new THREE.MeshPhongMaterial({ color: 0xffffff });
const boxMesh6 = new THREE.Mesh(bg6, bm6);
boxMesh6.castShadow = true;
boxMesh6.position.x = 0;
boxMesh6.position.y = 1;
boxMesh6.position.z = 3;
scene.add(boxMesh6);

/************************************basic setup***********************************/
const divisions = 20;
const size = 20;
const gridHelper = new THREE.GridHelper(size, divisions);
gridHelper.position.set(0, 0, 0);
scene.add(gridHelper);
gridHelper.isVisible = true;

/* -------------------------------- RAYCASTER METHOD -------------------------------------- */

animate();
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
