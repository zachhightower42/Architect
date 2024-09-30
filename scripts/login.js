    //login
    function validateLogin() {
        var enteredUsername = document.querySelector("input[name='username']").value.trim();
        var enteredPassword = document.querySelector("input[name='password']").value.trim();
      
        // Retrieve stored credentials from sessionStorage
        var storedUsername = sessionStorage.getItem("username");
        var storedPassword = sessionStorage.getItem("password");
      
        // Debugging output
        console.log("Login - Username entered:", enteredUsername);
        console.log("Login - Password entered:", enteredPassword);
        console.log("Login - Username stored:", storedUsername);
        console.log("Login - Password stored:", storedPassword);    


        // Check if credentials are stored
        if (!storedUsername || !storedPassword) {
          alert("No account found. Please sign up first.");
          return false; // Prevent form submission
        }
      
        // Check if entered username and password match stored credentials
        if (enteredUsername === storedUsername && enteredPassword === storedPassword) {
          alert("Login successful!");
          setTimeout(function() {
            window.location.href = 'world_selection_and_management_screen.html';
          }, 0);
          return true;
        } else {
          alert("Invalid username or password. Please try again.");
          return false; // Prevent form submission
        }
      }
      