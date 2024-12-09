<?php
// Database connection constants
define('DB_HOST', 'localhost');    // Database host
define('DB_PORT', '3306');        // MySQL port number
define('DB_NAME', 'zphighto');    // Database name
define('DB_USER', 'zphighto');    // Database username
define('DB_PASS', 'Melancholia42!'); // Database password

try {
    // Create new PDO connection
    $dbConn = new PDO('mysql:host=' . DB_HOST . ';'
                      . 'port=' . DB_PORT . ';'
                      . 'dbname=' . DB_NAME,
                      DB_USER,
                      DB_PASS);
    
    // Set PDO to throw exceptions on error
    $dbConn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // echo "Connected";
} catch (PDOException $e) {
    // Get error details
    $fileName = basename($e->getFile(), ".php");
    $lineNumber = $e->getLine();         
    // Display error message with file and line information
    die("[$fileName][$lineNumber] Database connect failed: " . $e->getMessage() . '<br />');
}
