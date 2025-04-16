let allLI = document.querySelectorAll("li");
let iframe = document.querySelector("iframe");

allLI.forEach((li) => {
  li.addEventListener("click", (e) => {
    let className = e.target.className;
    iframe.src = `./${className}/`;
  });
});
