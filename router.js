let voxels = document.getElementById("voxels");
let earth = document.getElementById("earth");
let fps = document.getElementById("fps");
let fp = document.getElementById("fp");
let physics = document.getElementById("physics");
let lightbox = document.getElementById("lightbox");
let drop = document.getElementById("drop");

let main = document.getElementById("homeView");
let white_screen = document.getElementsByClassName("white-loader")[0];

let phone_info = document.getElementsByClassName("computer");

//TODO mettre ça dans un listener resize
if (window.innerWidth <= 1100) {
  phone_info[0].classList.remove("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  function fadeAndGo(url) {
    main.classList.add("hidden");
    white_screen.classList.remove("hidden");
    setTimeout(() => {
      white_screen.classList.add("hidden");
    }, 3000);
    setTimeout(() => {
      window.location.href = url;
    }, 1000);
  }

  drop.addEventListener("click", () => {
    fadeAndGo("./projects/drop_water/index.html");
  });
  voxels.addEventListener("click", () => {
    fadeAndGo("./projects/voxels/index.html");
  });
  earth.addEventListener("click", () => {
    fadeAndGo("./projects/earthspin/index.html");
  });
  fps.addEventListener("click", () => {
    fadeAndGo("./projects/firstpersonshooter/index.html");
  });
  fp.addEventListener("click", () => {
    fadeAndGo("./projects/firstperson/index.html");
  });
  physics.addEventListener("click", () => {
    fadeAndGo("./projects/physics/index.html");
  });
  lightbox.addEventListener("click", () => {
    fadeAndGo("./projects/lightBox/index.html");
  });
});
