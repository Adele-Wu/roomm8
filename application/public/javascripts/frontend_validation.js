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

const registration_form = document.getElementById("registration_form");
const first_name = document.getElementById("first_name");
const last_name = document.getElementById("last_name");
const address = document.getElementById("address");
const email = document.getElementById("email");
const username = document.getElementById("username");
const password = document.getElementById("password");
const confirm_password = document.getElementById("confirm_password");
const registration_submit = document.getElementById("registration_submit");

var final_test_before_sql_query = new Array(7).fill(false);

first_name.addEventListener("input", (e) => {
  if (first_name.value === "") {
    setErrorFor(first_name, "First name can't be blank.");
  } else if (!isCapital(first_name.value)) {
    setErrorFor(first_name, "First name must be capitalized.");
  } else if (first_name.value.length < 2) {
    setErrorFor(first_name, "First name must be longer than two letters.");
  } else if (first_name.value.match(/[0-9]/)) {
    setErrorFor(first_name, "First name cannot have numbers.");
  } else {
    setSuccessFor(first_name);
    final_test_before_sql_query[0] = true;
  }
});

last_name.addEventListener("input", (e) => {
  if (last_name.value === "") {
    setErrorFor(last_name, "Last name can't be blank.");
  } else if (!isCapital(last_name.value)) {
    setErrorFor(last_name, "Last name must be capitalized.");
  } else if (last_name.value.length < 2) {
    setErrorFor(last_name, "Last name must be longer than two letters.");
  } else if (last_name.value.match(/[0-9]/)) {
    setErrorFor(last_name, "Last name cannot have numbers.");
  } else {
    setSuccessFor(last_name);
    final_test_before_sql_query[1] = true;
  }
});

address.addEventListener("input", (e) => {
  if (address.value === "") {
    setErrorFor(address, "Address can't be blank.");
  } else {
    setSuccessFor(address);
    final_test_before_sql_query[2] = true;
  }
});

email.addEventListener("input", (e) => {
  if (email.value === "") {
    setErrorFor(email, "Email can't be blank.");
  } else if (!isEmail(email.value)) {
    setErrorFor(email, "Not a valid email");
  } else {
    setSuccessFor(email);
    final_test_before_sql_query[3] = true;
  }
});

username.addEventListener("input", (e) => {
  if (username.value === "") {
    setErrorFor(username, "Username can't be blank.");
  } else if (username.value.length < 3 || username.value.length > 12) {
    setErrorFor(
      username,
      "Username must be between 3 to 12 letters or numbers."
    );
  } else if (hasWhiteSpace(username.value)) {
    setErrorFor(username, "Username can't have white spaces.");
  } else {
    setSuccessFor(username);
    final_test_before_sql_query[4] = true;
  }
});

password.addEventListener("input", (e) => {
  if (password.value === "") {
    setErrorFor(password, "Password can't be blank.");
  } else if (password.value.length < 8 || password.value.length > 16) {
    setErrorFor(password, "Password must be between 8 to 16 characters long.");
  } else if (!password.value.match(/[A-Z]/)) {
    setErrorFor(password, "Password must have a capital letter.");
  } else if (!password.value.match(/[0-9]/)) {
    setErrorFor(password, "Password must have a number.");
  } else if (!password.value.match(/[$&+,:;=?@#|'<>.^*()%!-]/)) {
    setErrorFor(password, "Password must have a special character.");
  } else {
    setSuccessFor(password);
    final_test_before_sql_query[5] = true;
  }
});

confirm_password.addEventListener("input", (e) => {
  if (confirm_password === "") {
    setErrorFor(confirm_password, "Confirm password can't be blank.");
  } else if (password.value !== confirm_password.value) {
    setErrorFor(confirm_password, "Passwords don't match.");
  } else {
    setSuccessFor(confirm_password);
    final_test_before_sql_query[6] = true;
  }
});

// click handles both enter and click
// TODO ITS BUGGY WE NEED TO CHECK WHY BEFORE DEPLOYMENT IF YOU DONT WANT THIS TO RUN
// COMMENT OUT SCRIPT IN THE registration.hbs at the bottom to disable!!!
registration_submit.addEventListener("click", (e) => {
  // will prevent anything from happening if it reaches here.
  // if anything in the array is false then prevent anything from happening.
  // if every element in final_test_before_sql_query is true then else stop
  if (final_test_before_sql_query.every((e) => e === true)) {
    e.preventDefault();
  }

  // e.preventDefault();
  // checkInputs();
});

// TODO come back with back-end lead to fix bug
// Issue: doesn't redirect to homepage after success.
function checkInputs() {
  // .trim remove any white space from the left.
  const first_name_value = first_name.value.trim();
  const last_name_value = last_name.value.trim();
  const address_value = address.value.trim();
  const email_value = email.value.trim();
  const username_value = username.value.trim();
  const password_value = password.value.trim();
  const confirm_password_value = confirm_password.value.trim();

  if (first_name.value === "") {
    setErrorFor(first_name, "First name can't be blank.");
  } else if (!isCapital(first_name.value)) {
    setErrorFor(first_name, "First name must be capitalized.");
  } else if (first_name.value.length < 2) {
    setErrorFor(first_name, "First name must be longer than two letters.");
  } else if (first_name.value.match(/[0-9]/)) {
    setErrorFor(first_name, "First name cannot have numbers.");
  } else {
    setSuccessFor(first_name);
    final_test_before_sql_query[0] = true;
  }

  if (last_name.value === "") {
    setErrorFor(last_name, "Last name can't be blank.");
  } else if (!isCapital(last_name.value)) {
    setErrorFor(last_name, "Last name must be capitalized.");
  } else if (last_name.value.length < 2) {
    setErrorFor(last_name, "Last name must be longer than two letters.");
  } else if (last_name.value.match(/[0-9]/)) {
    setErrorFor(last_name, "Last name cannot have numbers.");
  } else {
    setSuccessFor(last_name);
    final_test_before_sql_query[1] = true;
  }

  if (address.value === "") {
    setErrorFor(address, "Address can't be blank.");
  } else {
    setSuccessFor(address);
    final_test_before_sql_query[2] = true;
  }

  // TODO figure out address validation...
  // if(address_value === ''){
  //     setErrorFor(address, "Address can't be blank.");
  // } else if (!isAddress(address_value)) {
  //     setErrorFor(address, "Not a valid address.")
  // } else {
  //     setSuccessFor(address);
  // }

  if (email.value === "") {
    setErrorFor(email, "Email can't be blank.");
  } else if (!isEmail(email.value)) {
    setErrorFor(email, "Not a valid email");
  } else {
    setSuccessFor(email);
    final_test_before_sql_query[3] = true;
  }

  if (username.value === "") {
    setErrorFor(username, "Username can't be blank.");
  } else if (username.value.length < 3 || username.value.length > 12) {
    setErrorFor(
      username,
      "Username must be between 3 to 12 letters or numbers."
    );
  } else if (hasWhiteSpace(username.value)) {
    setErrorFor(username, "Username can't have white spaces.");
  } else {
    setSuccessFor(username);
    final_test_before_sql_query[4] = true;
  }

  if (password.value === "") {
    setErrorFor(password, "Password can't be blank.");
  } else if (password.value.length < 8 || password.value.length > 16) {
    setErrorFor(password, "Password must be between 8 to 16 characters long.");
  } else if (!password.value.match(/[A-Z]/)) {
    setErrorFor(password, "Password must have a capital letter.");
  } else if (!password.value.match(/[0-9]/)) {
    setErrorFor(password, "Password must have a number.");
  } else if (!password.value.match(/[$&+,:;=?@#|'<>.^*()%!-]/)) {
    setErrorFor(password, "Password must have a special character.");
  } else {
    setSuccessFor(password);
    final_test_before_sql_query[5] = true;
  }

  if (confirm_password === "") {
    setErrorFor(confirm_password, "Confirm password can't be blank.");
  } else if (password.value !== confirm_password.value) {
    setErrorFor(confirm_password, "Passwords don't match.");
  } else {
    setSuccessFor(confirm_password);
    final_test_before_sql_query[6] = true;
  }
}

// display error
function setErrorFor(input, message) {
  const form_control = input.parentElement;
  const small = form_control.querySelector("small");
  form_control.className = "form-validation error";
  small.innerText = message;
}

// display success
function setSuccessFor(input) {
  const form_control = input.parentElement;
  form_control.className = "form-validation success";
}

function isEmail(email) {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );
}

function isCapital(name) {
  return name.charAt(0) === name.charAt(0).toUpperCase();
}

function hasWhiteSpace(str) {
  return str.indexOf(" ") >= 0;
}