<?php
// PHP script to read ActionLog.txt

header('Content-Type: text/plain');

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

$logFile = __DIR__ . '/ActionLog.txt';

if (file_exists($logFile)) {
    $content = file_get_contents($logFile);
    echo $content;
} else {
    http_response_code(404);
    echo '';
}
?>
