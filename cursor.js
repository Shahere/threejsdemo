const cursor = document.querySelector(".cursor");
document.documentElement.style.cursor = "none";

document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});

// Agrandissement sur les liens et boutons
const hoverTargets = document.querySelectorAll("a, button, [data-hover]");
hoverTargets.forEach((el) => {
  el.addEventListener("mouseenter", () =>
    cursor.classList.add("cursor--hover")
  );
  el.addEventListener("mouseleave", () =>
    cursor.classList.remove("cursor--hover")
  );
});

const colorTarget = document.getElementsByClassName("color");
var arr = [].slice.call(colorTarget);
arr.forEach((color) => {
  color.addEventListener("mouseenter", () => {
    //console.log(color.id);
    cursor.classList.add("cursor--color");
  });
  color.addEventListener("mouseleave", () => {
    cursor.classList.remove("cursor--color");
  });
});

let colors = document.getElementsByClassName("color");
var arr = [].slice.call(colors);
// This is for the border effet
arr.forEach((color) => {
  color.addEventListener("mouseenter", () => {
    let divToChange = color.children[1];
    divToChange.style.border = "1.8em solid rgba(255, 255, 255, 0.5)";
  });

  color.addEventListener("mouseleave", () => {
    let divToChange = color.children[1];
    divToChange.style.border = "none";
  });
});

arr.forEach((color) => {
  const children = Array.from(color.children);

  color.addEventListener("mousemove", (e) => {
    // récupère la taille et la position de l'élément parent
    const rect = color.getBoundingClientRect();

    // calcul la position de la souris par rapport au centre de la div
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Crée un effet de mouvement léger (plus la valeur est grande, plus ça bouge)
    const moveX = x * 0.3;
    const moveY = y * 0.1;

    // Applique la translation à chaque div enfant
    children.forEach((child) => {
      child.style.transform = `translate(${moveX}px, ${moveY}px)`;
      child.style.transition = "transform 0.05s ease-out";
    });
  });

  // Quand la souris quitte : remet en place
  color.addEventListener("mouseleave", () => {
    children.forEach((child) => {
      child.style.transform = "translate(0, 0)";
      child.style.transition = "transform 0.3s ease-out";
    });
  });
});
