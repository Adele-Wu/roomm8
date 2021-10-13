const menu = document.getElementById("menu");
function menuToggle() {
  menu.classList.toggle("h-full");
} // browser resize listener
window.addEventListener("resize", menuResize); // responsive resize menu
function menuResize() {
  const window_size = window.innerWidth || document.body.clientWidth;
  if (window_size > 640) {
    menu.classList.remove("h-32");
  }
}
