<?php
header('Content-Type: application/json');
require('connec_scrip.php');

ini_set('display_errors', 0); // Change to 0 for production
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve form data
    $action = $_POST['action'];
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Fetch the user from the database
    $stmt = $dbConn->prepare("SELECT user_id, user_name, password FROM `user` WHERE user_name = :username");
    $stmt->bindParam(':username', $username);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Verify the user's credentials
    if ($user && password_verify($password, $user['password'])) {
        if ($action == 'Login') {
            // Handle Login
            session_start();
            $_SESSION['user_id'] = $user['user_id'];
            $_SESSION['username'] = $user['user_name'];
            echo json_encode(['success' => true, 'message' => 'Login successful']);
        } elseif ($action == 'Delete User') {
            // Handle Delete User
            // Delete the user from the database
            $deleteStmt = $dbConn->prepare("DELETE FROM `user` WHERE user_id = :user_id");
            $deleteStmt->bindParam(':user_id', $user['user_id']);
            $deleteStmt->execute();

            // Destroy the session if any
            session_start();
            session_unset();
            session_destroy();

            echo json_encode(['success' => true, 'message' => 'User deleted successfully']);
        } else {
            // Invalid action
            echo json_encode(['success' => false, 'message' => 'Invalid action']);
        }
    } else {
        // Invalid credentials
        echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
    }
}
?>
