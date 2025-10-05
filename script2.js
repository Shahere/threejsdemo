let allLI = document.querySelectorAll("li");
let iframe = document.querySelector("iframe");

allLI.forEach((li) => {
  li.addEventListener("click", (e) => {
    let className = e.target.className;
    iframe.src = `./${className}/`;
    hamMenu.classList.toggle("active");
    offScreenMenu.classList.toggle("active");
  });
});

const hamMenu = document.getElementsByClassName("ham-menu")[0];
const offScreenMenu = document.getElementsByClassName("list")[0];

hamMenu.addEventListener("click", () => {
  hamMenu.classList.toggle("active");
  offScreenMenu.classList.toggle("active");
});
