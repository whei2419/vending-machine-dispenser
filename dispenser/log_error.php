<?php
// PHP script to log errors from JavaScript

header('Content-Type: text/plain');

function logError($functionName, $errorMessage) {
    $errorFile = __DIR__ . '/ErrorLog.txt';
    $timestamp = date('Y-m-d H:i:s');
    $logEntry = "[{$timestamp}] JS Error in {$functionName}: {$errorMessage}\n";
    file_put_contents($errorFile, $logEntry, FILE_APPEND | LOCK_EX);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['function']) && isset($_POST['error'])) {
        $functionName = $_POST['function'];
        $errorMessage = $_POST['error'];
        
        logError($functionName, $errorMessage);
        echo "Error logged";
    } else {
        http_response_code(400);
        echo "Missing parameters";
    }
} else {
    http_response_code(405);
    echo "Method not allowed";
}
?>
