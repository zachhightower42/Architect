<?php
require 'connec_scrip.php';

$action = $_GET['action'];

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
  $conn->begin_transaction();

  try {
    // Delete entries associated with the world
    $stmt = $conn->prepare("DELETE FROM entry WHERE world_id = ?");
    $stmt->bind_param('i', $world_id);
    $stmt->execute();
    $stmt->close();

    // Delete locations associated with the world
    $stmt = $conn->prepare("DELETE FROM location WHERE world_id = ?");
    $stmt->bind_param('i', $world_id);
    $stmt->execute();
    $stmt->close();

    // Delete the world
    $stmt = $conn->prepare("DELETE FROM world WHERE world_id = ?");
    $stmt->bind_param('i', $world_id);
    $stmt->execute();
    $stmt->close();

    // Commit transaction
    $conn->commit();
    echo json_encode(['success' => true]);
  } catch (Exception $e) {
    // Rollback transaction on error
    $conn->rollback();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
  }
}?>