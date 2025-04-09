import * as THREE from "three";

export default function scene2(lightCamera, renderTarget) {
  let groupSCENE2 = new THREE.Group();

  // Lumière blanche
  const light = new THREE.SpotLight(0xffffff, 1000000, 30, Math.PI / 8, 0);
  light.position.set(0, 0, 15);
  light.target.position.set(0, 0, 0);
  light.castShadow = true;
  groupSCENE2.add(light);
  groupSCENE2.add(light.target);

  // Écran blanc
  const screenGeo = new THREE.PlaneGeometry(15, 15);
  const screenMat = new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color(0xffffff) },
      lightPosition: { value: light.position },
      lightDepthTexture: { value: renderTarget.depthTexture },
      depthTexture: { value: renderTarget.depthTexture },
      cameraNear: { value: lightCamera.near },
      cameraFar: { value: lightCamera.far },
    },
    side: THREE.DoubleSide,
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
    uniform sampler2D lightDepthTexture;
    uniform float cameraNear;
    uniform float cameraFar;
    varying vec2 vUv;

    float readLightDepth(sampler2D depthTex, vec2 coord) {
      float fragCoordZ = texture2D(depthTex, coord).r;
      float z = fragCoordZ * (cameraFar - cameraNear) + cameraNear;
      return z;
    }

    void main() {
      float lightDepth = readLightDepth(lightDepthTexture, vUv);

      // Visualisation de la profondeur relative à la lumière
      gl_FragColor = vec4(vec3(lightDepth / cameraFar), 1.0);
    }
  `,
  });
  const screen = new THREE.Mesh(screenGeo, screenMat);
  screen.receiveShadow = true;
  screen.position.set(0, 0, -2);
  groupSCENE2.add(screen);

  // Fonction pour créer un filtre coloré
  function createFilter(color, position) {
    const mat = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.8,
      blending: THREE.SubtractiveBlending,
      side: THREE.DoubleSide,
    });

    let geo = new THREE.PlaneGeometry(2.5, 3.5);
    //geo = new THREE.BoxGeometry(2.5, 3.5, 1); // Just for test i wasnt sure
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    groupSCENE2.add(mesh);
    return mesh;
  }

  // Création des 3 filtres CMJ
  const cyan = createFilter(0x00ffff, new THREE.Vector3(-3, 0, 1));
  const magenta = createFilter(0xff00ff, new THREE.Vector3(0, 0, 1));
  const yellow = createFilter(0xffff00, new THREE.Vector3(3, 0, 1));

  return [groupSCENE2, light];
}
