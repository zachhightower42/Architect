<?php
/**
 * User Registration Processing Script
 * 
 * This script handles the user registration process by:
 * 1. Validating the submitted form data
 * 2. Checking for duplicate usernames
 * 3. Securely hashing passwords
 * 4. Inserting new user records into the database
 */

require_once 'connec_scrip.php';

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Process the registration form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect and sanitize user input
    $username = $_POST['username'];
    $email = $_POST['email'];
    // Hash the password for secure storage
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

    try {
        // Check for duplicate usernames in the database
        $checkStmt = $dbConn->prepare("SELECT user_name FROM `user` WHERE user_name = :username");
        $checkStmt->bindParam(':username', $username);
        $checkStmt->execute();

        // If username exists, throw an exception
        if($checkStmt->rowCount() > 0) {
            throw new Exception("Username already exists");
        }

        // Prepare and execute the SQL query to insert new user
        // Backticks are used to prevent conflicts with SQL reserved keywords
        $stmt = $dbConn->prepare("INSERT INTO `user` (user_name, email, password) VALUES (:username, :email, :password)");
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $password);
        $stmt->execute();

        // Redirect user to login page after successful registration
        header("Location: ../login_page.html");
        exit();
    } catch(PDOException $e) {
        // Handle database-related errors
        echo "Error: " . $e->getMessage();
    }
}