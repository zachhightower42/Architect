<?php
require 'connec_scrip.php';

$action = $_GET['action'];

if ($action == 'get_locations') {
    $world_id = $_GET['world_id'];
    
    $stmt = $dbConn->prepare("SELECT location_id, location_name, icon_path_location, position_X, position_Y FROM location WHERE world_id = ?");
    $stmt->bind_param('i', $world_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $locations = $result->fetch_all(MYSQLI_ASSOC);
    
    echo json_encode($locations);
}

if ($action == 'create_location') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $stmt = $dbConn->prepare("INSERT INTO location (location_name, icon_path_location, world_id, position_X, position_Y) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param('ssiss', 
        $data['location_name'],
        $data['icon_path_location'],
        $data['world_id'],
        $data['position_X'],
        $data['position_Y']
    );
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'location_id' => $stmt->insert_id]);
    } else {
        echo json_encode(['success' => false, 'message' => $stmt->error]);
    }
}

if ($action == 'update_location') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $stmt = $dbConn->prepare("UPDATE location SET location_name = ?, icon_path_location = ?, position_X = ?, position_Y = ? WHERE location_id = ?");
    $stmt->bind_param('ssssi',
        $data['location_name'],
        $data['icon_path_location'],
        $data['position_X'],
        $data['position_Y'],
        $data['location_id']
    );
    
    echo json_encode(['success' => $stmt->execute()]);
}

if ($action == 'delete_location') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // First delete all entries associated with this location
    $stmt = $dbConn->prepare("DELETE FROM entry WHERE location_id = ?");
    $stmt->bind_param('i', $data['location_id']);
    $stmt->execute();
    
    // Then delete the location
    $stmt = $dbConn->prepare("DELETE FROM location WHERE location_id = ?");
    $stmt->bind_param('i', $data['location_id']);
    
    echo json_encode(['success' => $stmt->execute()]);
}

if ($action == 'get_entries') {
    $location_id = $_GET['location_id'];
    
    $stmt = $dbConn->prepare("SELECT entry_id, entry_name, entry_body FROM entry WHERE location_id = ?");
    $stmt->bind_param('i', $location_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $entries = $result->fetch_all(MYSQLI_ASSOC);
    
    echo json_encode($entries);
}

if ($action == 'create_entry') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $stmt = $dbConn->prepare("INSERT INTO entry (entry_name, entry_body, location_id, icon_path_entry) VALUES (?, ?, ?, ?)");
    $stmt->bind_param('ssis',
        $data['entry_name'],
        $data['entry_body'],
        $data['location_id'],
        $data['icon_path_entry']
    );
    
    echo json_encode(['success' => $stmt->execute()]);
}
