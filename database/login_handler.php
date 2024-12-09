<?php
/**
 * Login Handler Script
 * 
 * This script handles user authentication by validating credentials against the database.
 * It processes POST requests for user login and manages session creation upon successful authentication.
 * 
 */
// Set response header to JSON
header('Content-Type: application/json');

// Include database connection script
require('connec_scrip.php');

// Error reporting configuration
ini_set('display_errors', 0); // Change to 0 for production
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Process only POST requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve form data from POST request
    $action = $_POST['action'];
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Prepare and execute database query to fetch user data
    // Using prepared statements to prevent SQL injection
    $stmt = $dbConn->prepare("SELECT user_id, user_name, password FROM `user` WHERE user_name = :username");
    $stmt->bindParam(':username', $username);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Verify user credentials using secure password verification
    if ($user && password_verify($password, $user['password'])) {
        // Define allowed actions for authentication
        $allowedActions = ['Login'];
        
        // Validate requested action
        if (!in_array($action, $allowedActions)) {
            echo json_encode(['success' => false, 'message' => 'Invalid action']);
            exit();
        }
        
        // Process login action
        if ($action == 'Login') {
            // Initialize session and store user data
            session_start();
            $_SESSION['user_id'] = $user['user_id'];
            $_SESSION['username'] = $user['user_name'];
            echo json_encode(['success' => true, 'message' => 'Login successful']);
        } else {
            // Handle invalid action request
            echo json_encode(['success' => false, 'message' => 'Invalid action']);
        }
    } else {
        // Return error for invalid credentials
        echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
    }
}