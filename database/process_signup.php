<?php
require_once 'connec_scrip.php';

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

    try {
        // Check if username already exists
        $checkStmt = $dbConn->prepare("SELECT user_name FROM `user` WHERE user_name = :username");
        $checkStmt->bindParam(':username', $username);
        $checkStmt->execute();

        if($checkStmt->rowCount() > 0) {
            throw new Exception("Username already exists");
        }

        // Insert new user without specifying user_id, added backticks to prevent possible issues that came from
        // the word user being detected as an already in use variable by the database system. 
        $stmt = $dbConn->prepare("INSERT INTO `user` (user_name, email, password) VALUES (:username, :email, :password)");
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $password);
        $stmt->execute();

        // Redirect to login page
        header("Location: ../login_page.html");
        exit();
    } catch(PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
}
?>
