//signup
function validateForm() {
  var username = document.querySelector("input[name='username']").value.trim();
  var email = document.querySelector("input[name='email']").value.trim();
  var password = document.getElementById("password").value.trim();
  var confirmPassword = document
    .getElementById("password_confirm")
    .value.trim();

  // Check passwords match
  if (password !== confirmPassword) {
    alert("Passwords do not match. Please try again.");
    return false;
  }

  // Save user data
  sessionStorage.setItem("username", username);
  sessionStorage.setItem("email", email);
  sessionStorage.setItem("password", password);

  console.log("Signup - Username saved:", sessionStorage.getItem("username"));
  console.log("Signup - Password saved:", sessionStorage.getItem("password"));

  alert("Signup successful! Redirecting to login page.");
  setTimeout(function () {
    window.location.href = "login_page.html";
  }, 0);

  return true;
}
