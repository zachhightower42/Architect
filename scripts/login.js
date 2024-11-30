/**
 * User Authentication Module
 * 
 * This JavaScript file handles user login functionality by validating credentials
 * against the server-side database through a PHP endpoint. It manages form submission,
 * server communication, and user redirection upon successful authentication.
 */

/**
 * Validates user login credentials and handles authentication process
 * @returns {boolean} Returns false to prevent default form submission
 */
function validateLogin() {
    // Get and sanitize user input from form fields
    var enteredUsername = document.querySelector("input[name='username']").value.trim();
    var enteredPassword = document.querySelector("input[name='password']").value.trim();

    // Configure and send authentication request to server
    fetch('database/login_handler.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `username=${encodeURIComponent(enteredUsername)}&password=${encodeURIComponent(enteredPassword)}&action=Login`
    })
    .then(response => response.json())
    .then(data => {
      // Handle server response and redirect on successful login
      if (data.success) {
        alert("Login successful!");
        window.location.href = "world_selection_and_management_screen.html";
      } else {
        alert("Invalid username or password. Please try again.");
      }
    })
    .catch(error => {
      // Handle any errors that occur during the login process
      console.error('Error:', error);
      alert("An error occurred during login. Please try again.");
    });

    return false; // Prevent default form submission
}