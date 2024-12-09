<?php
/**
 * Map View Handler
 * This file handles all AJAX requests for the interactive map functionality
 * including location management, entries, and connections between locations.
 */

// Initialize session and set up response headers
session_start();
header('Content-Type: application/json');
header('Cache-Control: no-cache, must-revalidate');
ob_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Clear any previous output
ob_clean();

require 'connec_scrip.php';

$action = $_GET['action'];

/**
 * Location Retrieval
 * Fetches all locations for a specific world
 */
if ($action == 'get_locations') {
    $world_id = $_GET['world_id'];
    
    $stmt = $dbConn->prepare("SELECT location_id, location_name, icon_path_location, position_X, position_Y FROM location WHERE world_id = :world_id");
    $stmt->bindParam(':world_id', $world_id, PDO::PARAM_INT);
    
    if ($stmt->execute()) {
        $locations = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'data' => $locations]);
    } else {
        echo json_encode(['success' => false, 'error' => $stmt->errorInfo()]);
    }
    exit;
}

/**
 * Location Creation
 * Creates a new location with specified parameters
 */
if ($action == 'create_location') {
                         $data = json_decode(file_get_contents('php://input'), true);
    
                         try {
                             $stmt = $dbConn->prepare("INSERT INTO location (location_name, icon_path_location, world_id, position_X, position_Y) 
                                                      VALUES (:name, :icon, :world_id, :pos_x, :pos_y)");
        
                             $stmt->bindParam(':name', $data['location_name'], PDO::PARAM_STR);
                             $stmt->bindParam(':icon', $data['icon_path_location'], PDO::PARAM_STR);
                             $stmt->bindParam(':world_id', $data['world_id'], PDO::PARAM_INT);
                             $stmt->bindParam(':pos_x', $data['position_X'], PDO::PARAM_STR);
                             $stmt->bindParam(':pos_y', $data['position_Y'], PDO::PARAM_STR);
        
                             $result = $stmt->execute();
        
                             echo json_encode([
                                 'success' => $result,
                                 'location_id' => $result ? $dbConn->lastInsertId() : null
                             ]);
                         } catch (PDOException $e) {
                             echo json_encode([
                                 'success' => false,
                                 'message' => $e->getMessage()
                             ]);
                         }
}

/**
 * Location Update
 * Updates an existing location's details
 */
if ($action == 'update_location') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $stmt = $dbConn->prepare("UPDATE location 
                             SET location_name = :name, 
                                 icon_path_location = :icon, 
                                 position_X = :pos_x, 
                                 position_Y = :pos_y 
                             WHERE location_id = :id");
    
    $stmt->bindParam(':name', $data['location_name'], PDO::PARAM_STR);
    $stmt->bindParam(':icon', $data['icon_path_location'], PDO::PARAM_STR);
    $stmt->bindParam(':pos_x', $data['position_X'], PDO::PARAM_STR);
    $stmt->bindParam(':pos_y', $data['position_Y'], PDO::PARAM_STR);
    $stmt->bindParam(':id', $data['location_id'], PDO::PARAM_INT);
    
    echo json_encode(['success' => $stmt->execute()]);
}

/**
 * Location Deletion
 * Deletes a location and all its associated connections and entries
 */
if ($action == 'delete_location') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $dbConn->beginTransaction();
    
    try {
        // First delete all connections associated with this location
        $stmt = $dbConn->prepare("DELETE FROM connection WHERE location_id = :id");
        $stmt->bindParam(':id', $data['location_id'], PDO::PARAM_INT);
        $stmt->execute();
        
        // Then delete all entries associated with this location
        $stmt = $dbConn->prepare("DELETE FROM entry WHERE location_id = :id");
        $stmt->bindParam(':id', $data['location_id'], PDO::PARAM_INT);
        $stmt->execute();
        
        // Finally delete the location itself
        $stmt = $dbConn->prepare("DELETE FROM location WHERE location_id = :id");
        $stmt->bindParam(':id', $data['location_id'], PDO::PARAM_INT);
        $stmt->execute();
        
        $dbConn->commit();
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        $dbConn->rollBack();
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}

/**
 * Entry Management
 * Retrieves all entries for a specific location
 */
if ($action == 'get_entries') {
    $location_id = $_GET['location_id'];
    
    $stmt = $dbConn->prepare("SELECT entry_id, entry_name as header, entry_body as body FROM entry WHERE location_id = :location_id");
    $stmt->bindParam(':location_id', $location_id, PDO::PARAM_INT);
    
    if ($stmt->execute()) {
        $entries = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($entries);
    } else {
        echo json_encode([]);
    }
    exit;
}

/**
 * Entry Creation
 * Creates a new entry for a location
 */
if ($action == 'create_entry') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $stmt = $dbConn->prepare("INSERT INTO entry (entry_name, entry_body, location_id, icon_path_entry) 
                             VALUES (:name, :body, :location_id, :icon)");
    
    $stmt->bindParam(':name', $data['entry_name'], PDO::PARAM_STR);
    $stmt->bindParam(':body', $data['entry_body'], PDO::PARAM_STR);
    $stmt->bindParam(':location_id', $data['location_id'], PDO::PARAM_INT);
    $stmt->bindParam(':icon', $data['icon_path_entry'], PDO::PARAM_STR);
    
    echo json_encode(['success' => $stmt->execute()]);
}

/**
 * Connection Management
 * Creates a new connection between locations
 */
if ($action == 'create_connection') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    try {
        $stmt = $dbConn->prepare("INSERT INTO connection 
            (connection_start_X, connection_start_Y, connection_end_X, connection_end_Y, location_id) 
            VALUES (:start_x, :start_y, :end_x, :end_y, :location_id)");
        
        $stmt->bindParam(':start_x', $data['start_x'], PDO::PARAM_STR);
        $stmt->bindParam(':start_y', $data['start_y'], PDO::PARAM_STR);
        $stmt->bindParam(':end_x', $data['end_x'], PDO::PARAM_STR);
        $stmt->bindParam(':end_y', $data['end_y'], PDO::PARAM_STR);
        $stmt->bindParam(':location_id', $data['location_id'], PDO::PARAM_INT);
        
        $result = $stmt->execute();
        
        echo json_encode([
            'success' => $result,
            'connection_id' => $result ? $dbConn->lastInsertId() : null
        ]);
    } catch (PDOException $e) {
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage()
        ]);
    }
}

/**
 * Connection Retrieval
 * Fetches all connections for a specific world
 */
if ($action == 'get_connections') {
    try {
        $stmt = $dbConn->prepare("SELECT * FROM connection WHERE location_id IN 
            (SELECT location_id FROM location WHERE world_id = :world_id)");
        $stmt->bindParam(':world_id', $_GET['world_id'], PDO::PARAM_INT);
        $stmt->execute();
        
        echo json_encode([
            'success' => true,
            'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)
        ]);
    } catch (PDOException $e) {
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage()
        ]);
    }
}

/**
 * Location Position Update
 * Updates the X,Y coordinates of a location
 */
if ($action == 'update_location_position') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $stmt = $dbConn->prepare("UPDATE location 
                             SET position_X = :pos_x, 
                                 position_Y = :pos_y 
                             WHERE location_id = :id");
    
    $stmt->bindParam(':pos_x', $data['position_X'], PDO::PARAM_STR);
    $stmt->bindParam(':pos_y', $data['position_Y'], PDO::PARAM_STR);
    $stmt->bindParam(':id', $data['location_id'], PDO::PARAM_INT);
    
    echo json_encode(['success' => $stmt->execute()]);
}

/**
 * Connection Update
 * Updates the coordinates of an existing connection
 */
if ($action == 'update_connections') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    try {
        $stmt = $dbConn->prepare("UPDATE connection 
                                 SET connection_start_X = :start_x,
                                     connection_start_Y = :start_y,
                                     connection_end_X = :end_x,
                                     connection_end_Y = :end_y
                                 WHERE connection_id = :connection_id");
        
        $stmt->bindParam(':start_x', $data['start_x'], PDO::PARAM_STR);
        $stmt->bindParam(':start_y', $data['start_y'], PDO::PARAM_STR);
        $stmt->bindParam(':end_x', $data['end_x'], PDO::PARAM_STR);
        $stmt->bindParam(':end_y', $data['end_y'], PDO::PARAM_STR);
        $stmt->bindParam(':connection_id', $data['connection_id'], PDO::PARAM_INT);
        
        $result = $stmt->execute();
        
        echo json_encode([
            'success' => $result,
            'connection_id' => $data['connection_id']
        ]);
    } catch (PDOException $e) {
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage()
        ]);
    }
}

/**
 * Location Name Update
 * Updates the name of a location
 */
if ($action == 'update_location_name') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $stmt = $dbConn->prepare("UPDATE location 
                             SET location_name = :name 
                             WHERE location_id = :id");
    
    $stmt->bindParam(':name', $data['location_name'], PDO::PARAM_STR);
    $stmt->bindParam(':id', $data['location_id'], PDO::PARAM_INT);
    
    echo json_encode(['success' => $stmt->execute()]);
}

/**
 * Entry Synchronization
 * Synchronizes all entries for a location by replacing existing entries with new ones
 */
if ($action == 'sync_entries') {
    $data = json_decode(file_get_contents('php://input'), true);
    $locationId = $data['location_id'];
    $entries = $data['entries'];
    
    try {
        $dbConn->beginTransaction();
        
        // Delete existing entries
        $stmt = $dbConn->prepare("DELETE FROM entry WHERE location_id = :location_id");
        $stmt->bindParam(':location_id', $locationId, PDO::PARAM_INT);
        $stmt->execute();
        
        // Insert updated entries
        $stmt = $dbConn->prepare("INSERT INTO entry (entry_name, entry_body, location_id, icon_path_entry) 
                                 VALUES (:name, :body, :location_id, :icon)");
        
        foreach ($entries as $entry) {
            $stmt->bindParam(':name', $entry['header'], PDO::PARAM_STR);
            $stmt->bindParam(':body', $entry['body'], PDO::PARAM_STR);
            $stmt->bindParam(':location_id', $locationId, PDO::PARAM_INT);
            $stmt->bindValue(':icon', 'default_entry_icon.png', PDO::PARAM_STR);
            $stmt->execute();
        }
        
        $dbConn->commit();
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        $dbConn->rollBack();
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}

/**
 * Location Icon Update
 * Updates the icon path for a location
 */
if ($action == 'update_location_icon') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $stmt = $dbConn->prepare("UPDATE location 
                             SET icon_path_location = :icon 
                             WHERE location_id = :id");
    
    $stmt->bindParam(':icon', $data['icon_path'], PDO::PARAM_STR);
    $stmt->bindParam(':id', $data['location_id'], PDO::PARAM_INT);
    
    echo json_encode(['success' => $stmt->execute()]);
}