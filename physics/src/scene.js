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
    //console.log("create");
    this.move = null;
    this.ySpeed = 2;
    this.xSpeed = 2;
    // Resize window.
    const resize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      this.renderer.setSize(newWidth, newHeight);
      //@ts-ignore
      this.camera.aspect = newWidth / newHeight;
      this.camera.updateProjectionMatrix();

      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    };

    window.onresize = resize;
    resize();

    // set up scene (light, grid, sky, orbitControls)
    const { camera, ground, lights, orbitControls } = await this.warpSpeed(
      "-ground",
      "-orbitControls"
    );
    // enable physics debug
    this.physics.debug?.enable();

    // blue box
    this.box = this.physics.add.box(
      { y: 5 },
      { lambert: { color: "deepskyblue" } }
    );

    // pink box
    this.physics.add.box({ y: 3 }, { lambert: { color: "hotpink" } });

    // green sphere
    this.sphere = createSphere();
    this.scene.add(this.sphere);
    this.physics.add.existing(this.sphere);

    this.physics.add.sphere({ radius: 0.8, x: 3, z: -1 });

    this.physics.add.sphere({ radius: 2, x: -1, z: 6 });

    this.physics.add.sphere({ radius: 1.4, x: 3, z: 8 });

    this.physics.add.ground({ width: 50, height: 50, depth: 1 });

    // black box
    this.movebox = this.physics.add.box(
      { y: 1, x: 10 },
      { lambert: { color: "black" } }
    );
    let lookat = new THREE.Vector3(10, 1, 0);
    this.controls.target = lookat;
    this.controls.update();

    // Set listeners

    document.addEventListener(
      "keydown",
      (e) => {
        this.move = onDocumentKeyDown(e);
      },
      false
    );
    function onDocumentKeyDown(event) {
      var keyCode = event.which;
      let move = keyCode;
      return move;
    }

    document.addEventListener(
      "keyup",
      (e) => {
        this.move = onDocumentKeyUp(e);
      },
      false
    );
    function onDocumentKeyUp(event) {
      return null;
    }
  }

  update() {
    //this.sphere.rotation.x += 0.01;
    //this.sphere.rotation.y += 0.01;

    if (this.move == 38) {
      this.movebox.body.setVelocity(+this.ySpeed, 0, 0);
    } else if (this.move == 40) {
      this.movebox.body.setVelocity(-this.ySpeed, 0, 0);
    } else if (this.move == 39) {
      this.movebox.body.setVelocity(0, 0, +this.xSpeed);
    } else if (this.move == 37) {
      this.movebox.body.setVelocity(0, 0, -this.xSpeed);
    } else if (this.move == 32) {
      if (this.movebox.position.y <= 1) {
        this.movebox.body.setVelocity(0, 5, 0);
      }
    }
    this.controls.update();
    let newBoxpos = this.movebox.position;
    this.camera.lookAt(newBoxpos);
  }
}

let project;

PhysicsLoader("./public/lib/ammo/kripken", () => {
  project = new Project({ scenes: [MainScene], antialias: true });
});

function createSphere() {
  const geometry = new THREE.SphereGeometry(0.8, 16, 16);
  const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
  let sphere = new THREE.Mesh(geometry, material);
  return sphere;
}
