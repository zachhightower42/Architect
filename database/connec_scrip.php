<?php
define('DB_HOST', 'localhost');
define('DB_PORT', '3306');       
define('DB_NAME', 'zphighto');       
define('DB_USER', 'zphighto');   
define('DB_PASS', 'Melancholia42!');       

try {
   $dbConn = new PDO('mysql:host=' . DB_HOST . ';'
                     . 'port=' . DB_PORT . ';'
                     . 'dbname=' . DB_NAME,
                     DB_USER,
                     DB_PASS);
   $dbConn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
   // echo "Connected";
} catch (PDOException $e) {
   $fileName = basename($e->getFile(), ".php");
   $lineNumber = $e->getLine();         
   die("[$fileName][$lineNumber] Database connect failed: " . $e->getMessage() . '<br />');
}
