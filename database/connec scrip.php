<?php
define('DB_HOST', 'localhost');
define('DB_PORT', '5432');       
define('DB_NAME', 'zphighto');       
define('DB_USER', 'zphighto');   
define('DB_PASS', 'Melancholia42!');       
try {
   $dbConn = new PDO('mysql:host=' . DB_HOST . ';'
                     . 'port=' . DB_PORT . ';'
                     . 'dbname=' . DB_NAME . ';'
                     . 'user=' . DB_USER . ';'
                     . 'password=' . DB_PASS);
   $dbConn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // Set error mode to exception
 echo "Connected";
} catch (PDOException $e) {
   $fileName = basename($e->getFile(), ".php"); // File that triggers the exception
   $lineNumber = $e->getLine();          // Line number that triggers the exception
   die("[$fileName][$lineNumber] Database connect failed: " . $e->getMessage() . '<br />');
}
