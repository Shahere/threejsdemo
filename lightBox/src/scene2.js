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
      lightColorTexture: { value: renderTarget.texture },
      lightViewMatrix: { value: lightCamera.matrixWorldInverse },
      lightProjectionMatrix: { value: lightCamera.projectionMatrix },
    },
    side: THREE.DoubleSide,
    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPos.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
    uniform sampler2D lightColorTexture;
    uniform mat4 lightViewMatrix;
    uniform mat4 lightProjectionMatrix;
    varying vec3 vWorldPosition;
    

    vec2 projectToLight(vec3 worldPos) {
      vec4 lightSpace = lightProjectionMatrix * lightViewMatrix * vec4(worldPos, 1.0);
      // LightviewMatrix = Comment la lumière voit la scène
      // LightprojectionMatrix = Comment la lumière projette la scène en 2d

      vec3 ndc = lightSpace.xyz / lightSpace.w;
      return ndc.xy * 0.5 + 0.5; // pour mettre au format [-1,1] => [0,1] et au milieu
    }

    vec3 applyColorFilter(vec3 color, vec3 filterColor) {
      vec3 interMediateColor = vec3(1) - filterColor;       // Inverse of the filter color, 0xffffff - 0x00ffff = 0xff0000
      return color - interMediateColor;                     // Get final color,             0xffffff - 0xff0000 = 0x00ffff
    }

    void main() {
      vec2 uv = projectToLight(vWorldPosition);

      if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
        discard;
      }
      // Si les coordonnées UV sont hors du carré [0,1] (donc en dehors de la "vue" de la lumière), on discard ce fragment (= on ne l'affiche pas).

      vec3 lightColor = texture2D(lightColorTexture, uv).rgb;
      vec3 finalColor = applyColorFilter(vec3(1), lightColor); 

      gl_FragColor = vec4(finalColor, 1.0);
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
      //blending: THREE.SubtractiveBlending,
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
  const cyan = createFilter(0x00ffff, new THREE.Vector3(-0.7, 1, 1));
  const magenta = createFilter(0xff00ff, new THREE.Vector3(0, 0, 1.2));
  const yellow = createFilter(0xffff00, new THREE.Vector3(0.7, 2, 1.4));

  return [groupSCENE2, light];
}
