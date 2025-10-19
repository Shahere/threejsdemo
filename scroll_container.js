const container = document.getElementById("scrollContainer");
let posY = 0;

document.querySelector(".right").addEventListener("wheel", (e) => {
  e.preventDefault(); //  scroll par défaut bloqué
  posY -= e.deltaY; // deltaY = mouvement de la molette

  // Limites pour ne pas dépasser le contenu
  const maxScroll = container.scrollHeight - container.clientHeight + 200;
  if (posY > 0) posY = 0;
  if (posY < -maxScroll) posY = -maxScroll;

  container.style.transform = `translateY(${posY}px)`;
});
