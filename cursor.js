const cursor = document.querySelector(".cursor");

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
