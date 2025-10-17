document.addEventListener("DOMContentLoaded", () => {
  const homeView = document.getElementById("homeView");
  const aboutView = document.getElementById("aboutView");
  const aboutLink = document.getElementById("aboutLink");
  const backHome = document.getElementById("backHome");

  aboutLink.addEventListener("click", (e) => {
    e.preventDefault();
    homeView.classList.add("hidden");
    aboutView.classList.remove("hidden");
  });

  backHome.addEventListener("click", (e) => {
    e.preventDefault();
    aboutView.classList.add("hidden");
    homeView.classList.remove("hidden");
  });
});
