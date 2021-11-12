/**************************************************************
 * Class: CSC-648-02 Fall 2021
 * Name: Edward Yun, Jeffrey Fullmer Gradner, Adele Wu, Jeff Friedrich,
 *  Kris Byington, Jose Quinteros
 * Project: 648 Final Project
 *
 * File: hamburger-menu.js
 *
 * Description: Small front end function that allows for hamburger menu 
 * to be displayed on 768px screens or smaller upon screen resizing
 **************************************************************/
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
