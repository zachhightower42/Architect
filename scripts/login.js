/**
 * This file contains functions related to user login functionality.
 * It includes a function to validate user credentials against stored data.
 */

//login
function validateLogin() {
    var enteredUsername = document.querySelector("input[name='username']").value.trim();
    var enteredPassword = document.querySelector("input[name='password']").value.trim();

    fetch('database/login_handler.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `username=${encodeURIComponent(enteredUsername)}&password=${encodeURIComponent(enteredPassword)}&action=Login`
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert("Login successful!");
        window.location.href = "world_selection_and_management_screen.html";
      } else {
        alert("Invalid username or password. Please try again.");
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert("An error occurred during login. Please try again.");
    });

    return false; // Prevent default form submission
}