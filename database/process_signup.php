<?php
require_once 'database/connec scrip.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    
    // Generate a unique user_id
    $user_id = mt_rand(1000, 999999);
    
    try {
        $stmt = $dbConn->prepare("INSERT INTO user (user_name, email, password, user_id) VALUES (:username, :email, :password, :user_id)");
        
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $password);
        $stmt->bindParam(':user_id', $user_id);
        
        $stmt->execute();
        
        header("Location: login_page.html");
        exit();
    } catch(PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
}
?>
