<?php
session_start();
require 'connec_scrip.php';
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT); 
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
if (!isset($_SESSION['user_id'])) {
  error_log('Session user_id not set. Session data: ' . print_r($_SESSION, true));
  echo json_encode(['success' => false, 'message' => 'User not logged in.']);
  exit;
}
$action = $_GET['action'];

if ($action == 'get_worlds') {
  $user_id = $_SESSION['user_id'];

  $stmt = $dbConn->prepare("SELECT world_id, world_name, world_desc FROM world WHERE user_id = :user_id");
  $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
  $stmt->execute();
  $worlds = $stmt->fetchAll(PDO::FETCH_ASSOC);

  // Ensure we're sending a proper array response
  echo json_encode(['success' => true, 'worlds' => $worlds]);
}if ($action == 'create_world') {
    // Log incoming data
    error_log("Creating world with data: " . print_r($_POST, true));
    error_log("User ID from session: " . $_SESSION['user_id']);

    if (!isset($_POST['world_name']) || !isset($_POST['description'])) {
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        exit;
    }

    $world_name = trim($_POST['world_name']);
    $description = trim($_POST['description']);
    $user_id = $_SESSION['user_id'];
    $default_icon = 'default_world_icon.png';

    try {
        // Log the SQL query we're about to execute
        $query = "INSERT INTO world (world_name, user_id, world_desc, icon_path_world) VALUES (:name, :user_id, :desc, :icon)";
        error_log("Executing query: " . $query);
        
        $stmt = $dbConn->prepare($query);
        
        $params = [
            ':name' => $world_name,
            ':user_id' => $user_id,
            ':desc' => $description,
            ':icon' => $default_icon
        ];
        
        // Log bound parameters
        error_log("Parameters: " . print_r($params, true));
        
        $stmt->execute($params);
        $world_id = $dbConn->lastInsertId();
        
        error_log("World created successfully with ID: " . $world_id);
        echo json_encode(['success' => true, 'world_id' => $world_id]);
    } catch (PDOException $e) {
        error_log("Database error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
    exit;
  }
if ($action == 'delete_world') {
    $world_id = $_POST['world_id'];

    try {
        $dbConn->beginTransaction();

        // First delete all connections associated with locations in this world
        $stmt = $dbConn->prepare("DELETE c FROM connection c 
            INNER JOIN location l ON c.location_id = l.location_id 
            WHERE l.world_id = :world_id");
        $stmt->execute(['world_id' => $world_id]);

        // Then delete entries
        $stmt = $dbConn->prepare("DELETE e FROM entry e 
            INNER JOIN location l ON e.location_id = l.location_id 
            WHERE l.world_id = :world_id");
        $stmt->execute(['world_id' => $world_id]);

        // Delete locations
        $stmt = $dbConn->prepare("DELETE FROM location WHERE world_id = :world_id");
        $stmt->execute(['world_id' => $world_id]);

        // Finally delete the world
        $stmt = $dbConn->prepare("DELETE FROM world WHERE world_id = :world_id");
        $stmt->execute(['world_id' => $world_id]);

        $dbConn->commit();
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        $dbConn->rollBack();
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}if ($action == 'delete_account') {
    $data = json_decode(file_get_contents('php://input'), true);
    $user_id = $data['user_id'];

    try {
        $dbConn->beginTransaction();

        // Delete all entries associated with user's worlds
        $stmt = $dbConn->prepare("DELETE e FROM entry e
            INNER JOIN location l ON e.location_id = l.location_id
            INNER JOIN world w ON l.world_id = w.world_id
            WHERE w.user_id = :user_id");
        $stmt->execute(['user_id' => $user_id]);

        // Delete all locations associated with user's worlds
        $stmt = $dbConn->prepare("DELETE l FROM location l 
            INNER JOIN world w ON l.world_id = w.world_id 
            WHERE w.user_id = :user_id");
        $stmt->execute(['user_id' => $user_id]);

        // Delete all worlds associated with the user
        $stmt = $dbConn->prepare("DELETE FROM world WHERE user_id = :user_id");
        $stmt->execute(['user_id' => $user_id]);

        // Finally, delete the user
        $stmt = $dbConn->prepare("DELETE FROM user WHERE user_id = :user_id");
        $stmt->execute(['user_id' => $user_id]);

        $dbConn->commit();
        
        // Clear the session
        session_destroy();
        
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        $dbConn->rollBack();
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
    exit;
}