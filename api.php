<?php
$filename = 'tasks.txt';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get tasks
    if (file_exists($filename)) {
        $tasks = file($filename, FILE_IGNORE_NEW_LINES);
        echo json_encode($tasks);
    } else {
        echo json_encode([]); // Return empty array if no tasks
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Add task
    $task = $_POST['task'];
    if (!empty($task)) {
        file_put_contents($filename, $task . PHP_EOL, FILE_APPEND);
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Delete task
    parse_str(file_get_contents("php://input"), $_DELETE);
    if (isset($_DELETE['taskIndex'])) {
        $index = $_DELETE['taskIndex'];
        if (file_exists($filename)) {
            $tasks = file($filename, FILE_IGNORE_NEW_LINES);
            if (isset($tasks[$index])) {
                unset($tasks[$index]);
                file_put_contents($filename, implode(PHP_EOL, $tasks));
                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Task index not found.']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Tasks file not found.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Task index not provided.']);
    }
}
?>