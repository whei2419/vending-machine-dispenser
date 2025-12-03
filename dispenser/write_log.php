<?php
// PHP script to write to ActionLog.txt

header('Content-Type: text/plain');

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

function logError($message) {
    $errorFile = __DIR__ . '/ErrorLog.txt';
    $timestamp = date('Y-m-d H:i:s');
    $logEntry = "[{$timestamp}] {$message}\n";
    file_put_contents($errorFile, $logEntry, FILE_APPEND | LOCK_EX);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action'])) {
        $action = $_POST['action'];
        $logFile = __DIR__ . '/ActionLog.txt';
        
        // Append to the log file without newline
        $result = file_put_contents($logFile, $action, FILE_APPEND | LOCK_EX);
        
        if ($result !== false) {
            echo "Success: Log entry written";
        } else {
            $error = "Failed to write to ActionLog.txt";
            logError($error);
            http_response_code(500);
            echo "Error: Failed to write to log file";
        }
    } else {
        $error = "No action provided in POST request";
        logError($error);
        http_response_code(400);
        echo "Error: No action provided";
    }
} else {
    $error = "Invalid request method: " . $_SERVER['REQUEST_METHOD'];
    logError($error);
    http_response_code(405);
    echo "Error: Method not allowed";
}
?>
