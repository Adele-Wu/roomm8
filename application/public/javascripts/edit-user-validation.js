const edit_user_form = document.getElementById("edit_user_form");
const first_name = document.getElementById("first_name");
const last_name = document.getElementById("last_name");
const gender = document.getElementById("gender");
const date_of_birth = document.getElementById("date_of_birth");
const fields = document.getElementById("fields");
const schools = document.getElementById("schools");
const email = document.getElementById("email");
const username = document.getElementById("username");
const password = document.getElementById("password");
const confirm_password = document.getElementById("confirm_password");
const confirm_changes = document.getElementById("confirm_changes");
const edit_user_submit = document.getElementById("edit_user_submit");
const delete_profile = document.getElementById("delete_profile");
const update_first_name = document.getElementById("update_first_name");
const update_last_name = document.getElementById("update_last_name");
const update_gender = document.getElementById("update_gender");
const update_birth_date = document.getElementById("update_birth_date");
const update_field = document.getElementById("update_field");
const update_school = document.getElementById("update_school");
const update_email= document.getElementById("update_email");
const update_username = document.getElementById("update_username");
const update_password = document.getElementById("update_password");


var final_test_before_sql_query = new Array(11).fill(false);

delete_profile.addEventListener("click", (e) => {
    if (delete_profile.checked == true) {
      setSuccessFor(delete_profile);
      final_test_before_sql_query[0] = true;
      return;
    }
    final_test_before_sql_query[0] = false;
  });

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
    final_test_before_sql_query[1] = true;
    return;
  }
  final_test_before_sql_query[1] = false;
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
    final_test_before_sql_query[2] = true;
    return;
  }
  final_test_before_sql_query[2] = false;
});

gender.addEventListener("click", (e) => {
  if (
    document.getElementById("male").checked ||
    document.getElementById("female").checked ||
    document.getElementById("other").checked
  ) {
    setSuccessFor(gender);
    final_test_before_sql_query[3] = true;
  }
});

date_of_birth.addEventListener("click", (e) => {
  console.log("BOOOOM");
  setSuccessFor(date_of_birth);
  final_test_before_sql_query[4] = true;
});

// Come back to for css - For Adele
fields.addEventListener("click", (e) => {
  setSuccessFor(fields);
  final_test_before_sql_query[5] = true;
});

schools.addEventListener("click", (e) => {
  setSuccessFor(schools);
  final_test_before_sql_query[6] = true;
});

email.addEventListener("input", (e) => {
  if (email.value === "") {
    setErrorFor(email, "Email can't be blank.");
  } else if (!isEmail(email.value)) {
    setErrorFor(email, "Not a valid email");
  } else {
    setSuccessFor(email);
    final_test_before_sql_query[7] = true;
    return;
  }
  final_test_before_sql_query[7] = false;
});

username.addEventListener("input", (e) => {
  if (username.value === "") {
    setErrorFor(username, "Username can't be blank.");
  } else if (username.value[0] >= "0" && username.value[0] <= "9") {
    setErrorFor(
      username,
      "Username cannot have a number as the first character."
    );
  } else if (username.value.length < 3 || username.value.length > 12) {
    setErrorFor(
      username,
      "Username must be between 3 to 12 letters or numbers."
    );
  } else if (hasWhiteSpace(username.value)) {
    setErrorFor(username, "Username can't have white spaces.");
  } else {
    setSuccessFor(username);
    final_test_before_sql_query[8] = true;
    return;
  }
  final_test_before_sql_query[8] = false;
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
    final_test_before_sql_query[9] = true;
    return;
  }
  final_test_before_sql_query[9] = false;
});

confirm_password.addEventListener("input", (e) => {
  if (confirm_password === "") {
    setErrorFor(confirm_password, "Confirm password can't be blank.");
  } else if (password.value !== confirm_password.value) {
    setErrorFor(confirm_password, "Passwords don't match.");
  } else {
    setSuccessFor(confirm_password);
    final_test_before_sql_query[10] = true;
    return;
  }
  final_test_before_sql_query[10] = false;
});

edit_user_form.addEventListener("change", (e) => {
  if (readyToSubmit()) {
    // enable button
    edit_user_submit.removeAttribute("disabled");
    // edit_user__submit.disabled = false;
  }
});

// click handles both enter and click
// TODO ITS BUGGY WE NEED TO CHECK WHY BEFORE DEPLOYMENT IF YOU DONT WANT THIS TO RUN
// COMMENT OUT SCRIPT IN THE edit_user_.hbs at the bottom to disable!!!
// edit_user_submit.addEventListener("click", (e) => {
  // will prevent anything from happening if it reaches here.
  // if anything in the array is false then prevent anything from happening.
  // if every element in final_test_before_sql_query is true then else stop

//   if (!final_test_before_sql_query.every((e) => e === true)) {
//     console.log("prevent");
//     e.preventDefault();
//   }
  // e.preventDefault();
  // checkInputs();
// });

// TODO: come back with back-end lead to fix bug
// Issue: doesn't redirect to homepage after success.
// function checkInputs() {
//   // .trim remove any white space from the left.
//   const first_name_value = first_name.value.trim();
//   const last_name_value = last_name.value.trim();
//   const address_value = address.value.trim();
//   const email_value = email.value.trim();
//   const username_value = username.value.trim();
//   const password_value = password.value.trim();
//   const confirm_password_value = confirm_password.value.trim();

//   if (first_name.value === "") {
//     setErrorFor(first_name, "First name can't be blank.");
//   } else if (!isCapital(first_name.value)) {
//     setErrorFor(first_name, "First name must be capitalized.");
//   } else if (first_name.value.length < 2) {
//     setErrorFor(first_name, "First name must be longer than two letters.");
//   } else if (first_name.value.match(/[0-9]/)) {
//     setErrorFor(first_name, "First name cannot have numbers.");
//   } else {
//     setSuccessFor(first_name);
//     final_test_before_sql_query[0] = true;
//   }

//   if (last_name.value === "") {
//     setErrorFor(last_name, "Last name can't be blank.");
//   } else if (!isCapital(last_name.value)) {
//     setErrorFor(last_name, "Last name must be capitalized.");
//   } else if (last_name.value.length < 2) {
//     setErrorFor(last_name, "Last name must be longer than two letters.");
//   } else if (last_name.value.match(/[0-9]/)) {
//     setErrorFor(last_name, "Last name cannot have numbers.");
//   } else {
//     setSuccessFor(last_name);
//     final_test_before_sql_query[1] = true;
//   }

//   if (address.value === "") {
//     setErrorFor(address, "Address can't be blank.");
//   } else {
//     setSuccessFor(address);
//     final_test_before_sql_query[2] = true;
//   }

//   // TODO figure out address validation...
//   // if(address_value === ''){
//   //     setErrorFor(address, "Address can't be blank.");
//   // } else if (!isAddress(address_value)) {
//   //     setErrorFor(address, "Not a valid address.")
//   // } else {
//   //     setSuccessFor(address);
//   // }

//   if (email.value === "") {
//     setErrorFor(email, "Email can't be blank.");
//   } else if (!isEmail(email.value)) {
//     setErrorFor(email, "Not a valid email");
//   } else {
//     setSuccessFor(email);
//     final_test_before_sql_query[3] = true;
//   }

//   if (username.value === "") {
//     setErrorFor(username, "Username can't be blank.");
//   } else if (username.value.length < 3 || username.value.length > 12) {
//     setErrorFor(
//       username,
//       "Username must be between 3 to 12 letters or numbers."
//     );
//   } else if (hasWhiteSpace(username.value)) {
//     setErrorFor(username, "Username can't have white spaces.");
//   } else {
//     setSuccessFor(username);
//     final_test_before_sql_query[4] = true;
//   }

//   if (password.value === "") {
//     setErrorFor(password, "Password can't be blank.");
//   } else if (password.value.length < 8 || password.value.length > 16) {
//     setErrorFor(password, "Password must be between 8 to 16 characters long.");
//   } else if (!password.value.match(/[A-Z]/)) {
//     setErrorFor(password, "Password must have a capital letter.");
//   } else if (!password.value.match(/[0-9]/)) {
//     setErrorFor(password, "Password must have a number.");
//   } else if (!password.value.match(/[$&+,:;=?@#|'<>.^*()%!-]/)) {
//     setErrorFor(password, "Password must have a special character.");
//   } else {
//     setSuccessFor(password);
//     final_test_before_sql_query[5] = true;
//   }

//   if (confirm_password === "") {
//     setErrorFor(confirm_password, "Confirm password can't be blank.");
//   } else if (password.value !== confirm_password.value) {
//     setErrorFor(confirm_password, "Passwords don't match.");
//   } else {
//     setSuccessFor(confirm_password);
//     final_test_before_sql_query[6] = true;
//   }
// }

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

function readyToSubmit()
{
    if( delete_profile.checked && 
        final_test_before_sql_query[0] ) 
    {
        return true;
    }
    if( update_first_name.checked && 
        final_test_before_sql_query[1] )
    {
        return true;
    }
    if( update_last_name.checked && 
        final_test_before_sql_query[2] )
    {
        return true;
    }
    if( update_gender.checked && 
        final_test_before_sql_query[3] )
    {
        return true;
    }
    if( update_birth_date.checked && 
        final_test_before_sql_query[4] )
    {
      console.log("in herrrrr")
        return true;
    }
    if( update_field.checked && 
        final_test_before_sql_query[5] )
    {
        return true;
    }
    if( update_school.checked && 
        final_test_before_sql_query[6] )
    {
        return true;
    }
    if( update_email.checked && 
        final_test_before_sql_query[7] )
    {
        return true;
    }
    if( update_username.checked && 
        final_test_before_sql_query[8] )
    {
        return true;
    }
   // edit-user-validation.js:367 Uncaught TypeError:
   // Cannot read properties of null (reading 'checked')
   // at readyToSubmit (edit-user-validation.js:367)
   // at HTMLFormElement.<anonymous> (edit-user-validation.js:167)
    if( update_password.checked && 
        final_test_before_sql_query[9] )
    {
        return true;
    }
    return false
}