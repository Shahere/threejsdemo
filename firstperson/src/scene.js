import { Project, Scene3D, PhysicsLoader, THREE } from "enable3d";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

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
    this.keyCode = null;
    this.y = 2;
    // Resize window.
    const resize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      this.renderer.setSize(newWidth, newHeight);
      //@ts-ignore
      this.camera.aspect = newWidth / newHeight;
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

    // enable physics debug
    this.physics.debug?.enable();
    this.camera.position.set(0, this.y, 0);

    this.setupCameraFPS();
    this.setupKeyBinding();
  }

  update() {
    switch (this.keyCode) {
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
    this.camera.position.y = this.y;
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
      this.keyCode = e.code;
    });
    document.addEventListener("keyup", (e) => {
      this.keyCode = null;
    });
  }
}

let project;

PhysicsLoader("lib/ammo/kripken", () => {
  project = new Project({ scenes: [MainScene], antialias: true });
});
