/* ============================================================================================

  * Project: ROOMM8 (Room and Roommate Finder for College Students & Professionals)
  * Class: CSC-648-02 Software Engineering Final Project 
  * Fall 2021
  * TEAM 5 MEMBERS
    > Edward Yun, 
    > Jeffrey Fullmer Gradner, 
    > Adele Wu, 
    > Jeff Friedrich,
    > Kris Byington, 
    > Jose Quinteros
  
  * File: about_me.hbs
  * Description: contains...
  
  ================================================================================================= */

let checkError = true;
const minAge = document.getElementById("minAgeRange");
const maxAge = document.getElementById("maxAgeRange");
// const ageRange = document.getElementById("ageRange");
const filterButton = document.getElementById("filterButton");

function setErrorFor(input, message) {
  const label_for_age = ageRange.parentElement;
  const form_control = label_for_age.parentElement;

  const small = form_control.querySelector("small");
  form_control.className = "form-validation error";
  small.innerText = message;
}
function setSuccessFor(input) {
  const label_for_age = ageRange.parentElement;
  const form_control = label_for_age.parentElement;

  form_control.className = "form-validation success";
}

// ageRange.addEventListener("input", (e) => {
//     if (parseInt(maxAge.value) < parseInt(minAge.value)) {
//         setErrorFor(minAge, "min value can't be larger than max");

//         filterButton.disabled = true;
//     } else {
//         setSuccessFor(maxAge);
//         filterButton.disabled = false;
//     }
// });
