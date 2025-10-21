let voxels = document.getElementById("voxels");
let earth = document.getElementById("earth");
let fps = document.getElementById("fps");
let fp = document.getElementById("fp");
let physics = document.getElementById("physics");
let lightbox = document.getElementById("lightbox");

let main = document.getElementById("homeView");

let phone_info = document.getElementsByClassName("computer");
if (window.innerWidth <= 1100) {
  phone_info[0].classList.remove("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  function fadeAndGo(url) {
    main.classList.add("hidden");
    setTimeout(() => {
      window.location.href = url;
    }, 500);
  }

  voxels.addEventListener("click", () => {
    fadeAndGo("./voxels/index.html");
  });
  earth.addEventListener("click", () => {
    fadeAndGo("./earthspin/index.html");
  });
  fps.addEventListener("click", () => {
    fadeAndGo("./firstpersonshooter/index.html");
  });
  fp.addEventListener("click", () => {
    fadeAndGo("./firstperson/index.html");
  });
  physics.addEventListener("click", () => {
    fadeAndGo("./physics/index.html");
  });
  lightbox.addEventListener("click", () => {
    fadeAndGo("./lightBox/index.html");
  });
});
