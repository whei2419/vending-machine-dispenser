<?php
// PHP script to clear ActionLog.txt

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
    $logFile = __DIR__ . '/ActionLog.txt';
    
    // Clear the log file (write empty string)
    $result = file_put_contents($logFile, '', LOCK_EX);
    
    if ($result !== false) {
        echo "Success: Log cleared";
    } else {
        $error = "Failed to clear ActionLog.txt";
        logError($error);
        http_response_code(500);
        echo "Error: Failed to clear log file";
    }
} else {
    $error = "Invalid request method: " . $_SERVER['REQUEST_METHOD'];
    logError($error);
    http_response_code(405);
    echo "Error: Method not allowed";
}
?>
