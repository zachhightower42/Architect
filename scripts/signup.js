/**
 * Signup Form Validation Script
 * 
 * This JavaScript file handles the client-side validation for the signup form.
 * It performs the following validations:
 * - Ensures all fields are properly trimmed of whitespace
 * - Validates that passwords match before form submission
 * 
 * @module signup
 * @author Sourcegraph
 */

/**
 * Validates the signup form before submission
 * @returns {boolean} Returns true if validation passes, false otherwise
 */
function validateForm() {
  // Get and sanitize form input values
  var username = document.querySelector("input[name='username']").value.trim();
  var email = document.querySelector("input[name='email']").value.trim();
  var password = document.getElementById("password").value.trim();
  var confirmPassword = document.getElementById("password_confirm").value.trim();

  // Validate that passwords match
  if (password !== confirmPassword) {
    alert("Passwords do not match. Please try again.");
    return false;
  }

  // If all validations pass, allow form submission
  return true;
}