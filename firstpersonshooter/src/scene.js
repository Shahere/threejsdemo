import { Project, Scene3D, PhysicsLoader, THREE } from "enable3d";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

class MainScene extends Scene3D {
  box;
  constructor() {
    //@ts-ignore
    super("MainScene");
  }

  init() {
    //console.log("Init");
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  preload() {
    //console.log("Preload");
  }

  async create() {
    //setup vars
    this.scale = 0.3;
    this.userKey = new Array();
    this.y = 2;
    this.loader = new GLTFLoader();
    this.model = null;
    this.moveGun = 0;
    this.fire = false;
    this.fireTimeout = null;
    this.projectile = { shape: "sphere", radius: 0.05 };

    await this.loadGun();

    // Resize window.
    const resize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      this.renderer.setSize(newWidth, newHeight);
      //@ts-ignore
      this.camera.aspect = newWidth / newHeight;
      this.camera.near = 0.001; // near clipping distance
      this.camera.updateProjectionMatrix();
    };

    window.onresize = resize;
    resize();

    // set up scene (light, grid, sky, orbitControls)
    const { camera, ground, lights, orbitControls } = await this.warpSpeed(
      "-ground",
      "-orbitControls"
    );
    this.physics.add.ground({ width: 20, height: 20, depth: 1 });

    this.physics.add.sphere(
      { radius: 0.5, x: 3, z: -1, y: 3 },
      { lambert: { color: "hotpink" } }
    );
    this.physics.add.sphere(
      { radius: 0.2, x: 5, z: 4, y: 3 },
      { lambert: { color: "hotpink" } }
    );
    this.physics.add.sphere(
      { radius: 0.5, x: 3, z: -3, y: 3 },
      { lambert: { color: "hotpink" } }
    );
    this.physics.add.sphere(
      { radius: 0.3, x: 3, z: 2, y: 3 },
      { lambert: { color: "hotpink" } }
    );

    // enable physics debug
    this.physics.debug?.enable();
    this.camera.position.set(0, this.y, 0);

    this.setupCameraFPS();
    this.setupKeyBinding();
  }

  setupCameraFPS() {
    this.camera.rotation.order = "YXZ"; // this is not the default

    let xrotation, yrotation;
    document.addEventListener(
      "mousemove",
      (e) => {
        [xrotation, yrotation] = mouseMove(e, this.renderer, this.scale);
        this.camera.rotation.x = xrotation;
        this.camera.rotation.y = yrotation;
      },
      false
    );

    function mouseMove(event, renderer, scale) {
      let mouseX = -(event.clientX / renderer.domElement.clientWidth) * 2 + 1;
      let mouseY = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

      let x = mouseY / scale;
      let y = mouseX / scale;
      return [x, y];
    }
  }

  setupKeyBinding() {
    document.addEventListener("keydown", (e) => {
      if (this.userKey.indexOf(e.code) == -1) {
        this.userKey.push(e.code);
      }
    });
    document.addEventListener("keyup", (e) => {
      const index = this.userKey.indexOf(e.code);
      this.userKey.splice(index, 1);
    });
    document.addEventListener("mousedown", (e) => {
      if (e.buttons != 1) return;
      this.fire = true;
    });
    document.addEventListener("mouseup", (e) => {
      if (e.buttons != 0) return;
      this.fire = false;
    });
  }

  async loadGun() {
    this.loader.load(
      "/model/M4A1.glb",
      (gltf) => {
        this.model = gltf.scene;
        this.model.scale.set(0.05, 0.05, 0.05);
        this.camera.add(this.model);

        this.model.position.set(0.4, -0.4, -1.2);
        console.log("Model loaded successfully");
        this.scene.add(this.camera);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded"); // Progress
      },
      (error) => {
        console.error("Error loading GLB model:", error);
      }
    );
  }

  getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }

  update() {
    this.userKey.forEach((code) => {
      switch (code) {
        case "KeyD":
          this.camera.translateX(this.scale * 0.5);
          break;
        case "KeyA":
          this.camera.translateX(-this.scale * 0.5);
          break;
        case "KeyS":
          this.camera.translateZ(this.scale * 0.5);
          break;
        case "KeyW":
          this.camera.translateZ(-this.scale * 0.5);
          break;

        default:
          break;
      }
    });
    this.camera.position.y = this.y;

    if (this.model && !this.fire) {
      //on applique pas le mouvement quand on tire
      this.moveGun += 0.02;
      this.model.position.x = 0.4 + Math.sin(this.moveGun) * 0.02; // Side to side
      this.model.position.y = -0.4 + Math.sin(this.moveGun * 2) * 0.01; // Up and down
      //0.4 and not this.model.position.y because the margin get worse and worse if wr move
    }

    if (this.fire) {
      this.model.position.z = this.model.position.z + 0.05;
      this.fireTimeout = setTimeout(() => {
        this.model.position.z = this.model.position.z - 0.05;
        this.fireTimeout = null;
      }, 100);

      //get the pointer direction
      const direction = new THREE.Vector3();
      this.camera.getWorldDirection(direction);
      direction.normalize();

      //Add and move a projectile
      const bullet = this.physics.add.sphere(
        {
          radius: 0.01,
          x: this.camera.position.x,
          z: this.camera.position.z,
          y: this.camera.position.y,
        },
        { lambert: { color: "black" }, mass: 0.001 }
      );

      const force = 50;
      bullet.body.applyImpulse(
        {
          x: direction.x * force,
          y: direction.y * force,
          z: direction.z * force,
        },
        { x: 0, y: 0, z: 0 }
      );
    }
  }
}

let project;

PhysicsLoader("lib/ammo/kripken", () => {
  project = new Project({ scenes: [MainScene], antialias: true });
});
