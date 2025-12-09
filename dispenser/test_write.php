<?php
// Test write permissions
$logFile = __DIR__ . '/ActionLog.txt';

echo "Log file path: " . $logFile . "\n";
echo "File exists: " . (file_exists($logFile) ? 'Yes' : 'No') . "\n";
echo "Directory writable: " . (is_writable(__DIR__) ? 'Yes' : 'No') . "\n";
echo "File writable: " . (is_writable($logFile) ? 'Yes' : 'No') . "\n\n";

// Try to write test data
$testData = "TEST;20251202120000\n";
$result = file_put_contents($logFile, $testData, LOCK_EX);

if ($result !== false) {
    echo "SUCCESS: Wrote " . $result . " bytes\n";
    echo "File contents:\n" . file_get_contents($logFile);
} else {
    echo "ERROR: Failed to write to file\n";
}
?>
