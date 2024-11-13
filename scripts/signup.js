/**
 * This file contains the signup functionality for the application.
 * It now only validates using the database REMEMBER THIS
 * 
 * @module signup
 */

//signup
function validateForm() {
  var username = document.querySelector("input[name='username']").value.trim();
  var email = document.querySelector("input[name='email']").value.trim();
  var password = document.getElementById("password").value.trim();
  var confirmPassword = document.getElementById("password_confirm").value.trim();

  if (password !== confirmPassword) {
    alert("Passwords do not match. Please try again.");
    return false;
  }

  return true;
}