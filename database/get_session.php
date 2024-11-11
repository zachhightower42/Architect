<?php
session_start();
if (isset($_SESSION['user_id'])) {
    echo json_encode(['user_id' => $_SESSION['user_id']]);
} else {
    header('Location: ../login_page.html');
    exit();
}
?>
