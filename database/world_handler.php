<?php
require 'connec_scrip.php';

$action = $_GET['action'];

if ($action == 'get_worlds') {
  $user_id = $_SESSION['user_id']; // Or retrieve as needed

  $stmt = $dbConn->prepare("SELECT world_id, world_name, world_desc FROM world WHERE user_id = ?");
  $stmt->bind_param('i', $user_id);
  $stmt->execute();
  $result = $stmt->get_result();
  $worlds = $result->fetch_all(MYSQLI_ASSOC);

  echo json_encode($worlds);
  $stmt->close();
}

if ($action == 'create_world') {
  // Get the raw POST data
  $data = json_decode(file_get_contents('php://input'), true);
  $world_name = $data['world_name'];
  $description = $data['description'];
  $user_id = $data['user_id'];

  // Insert the new world into the database
  $stmt = $dbConn->prepare("INSERT INTO world (world_name, user_id, icon_path_world, world_desc) VALUES (?, ?, ?, ?)");
  $icon_path_world = ''; // Set default icon path or handle as needed
  $stmt->bind_param('siss', $world_name, $user_id, $icon_path_world, $description);

  if ($stmt->execute()) {
    echo json_encode(['success' => true]);
  } else {
    echo json_encode(['success' => false, 'message' => $stmt->error]);
  }
  $stmt->close();
}
if ($action == 'delete_world') {
  // Get the raw POST data
  $data = json_decode(file_get_contents('php://input'), true);
  $world_id = $data['world_id'];

  // Start transaction
  $dbConn->begin_transaction();

  try {
      // Delete entries associated with the world
      $stmt = $dbConn->prepare("DELETE e FROM entry e
        JOIN location l ON e.location_id = l.location_id
        WHERE l.world_id = ?");
      $stmt->bind_param('i', $world_id);
      $stmt->execute();
      $stmt->close();

    // Delete locations associated with the world
    $stmt = $dbConn->prepare("DELETE FROM location WHERE world_id = ?");
    $stmt->bind_param('i', $world_id);
    $stmt->execute();
    $stmt->close();

    // Delete the world
    $stmt = $dbConn->prepare("DELETE FROM world WHERE world_id = ?");
    $stmt->bind_param('i', $world_id);
    $stmt->execute();
    $stmt->close();

    // Commit transaction
    $dbConn->commit();
    echo json_encode(['success' => true]);
  } catch (Exception $e) {
    // Rollback transaction on error
    $dbConn->rollback();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
  }
}
// Add new action handler for account deletion
if ($action == 'delete_account') {
    $data = json_decode(file_get_contents('php://input'), true);
    $user_id = $data['user_id'];

    // Start transaction
    $dbConn->beginTransaction();

    try {
          // Delete all entries associated with user's worlds
          $stmt = $dbConn->prepare("DELETE e FROM entry e
            JOIN location l ON e.location_id = l.location_id
            JOIN world w ON l.world_id = w.world_id
            WHERE w.user_id = :user_id");
          $stmt->bindParam(':user_id', $user_id);
          $stmt->execute();

        // Delete all locations associated with user's worlds
        $stmt = $dbConn->prepare("DELETE l FROM location l 
            INNER JOIN world w ON l.world_id = w.world_id 
            WHERE w.user_id = :user_id");
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();

        // Delete all worlds associated with the user
        $stmt = $dbConn->prepare("DELETE FROM world WHERE user_id = :user_id");
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();

        // Finally, delete the user
        $stmt = $dbConn->prepare("DELETE FROM `user` WHERE user_id = :user_id");
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();

        // Commit transaction
        $dbConn->commit();
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        // Rollback transaction on error
        $dbConn->rollback();
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}
?>
