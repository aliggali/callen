<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
error_reporting(E_ALL);
ini_set('display_errors', 1);

include('dbcon.php');
$android = strpos($_SERVER['HTTP_USER_AGENT'], 'Android');

if (($_SERVER['REQUEST_METHOD'] == 'POST') || $android) {
$data = json_decode(file_get_contents("php://input"));
$rawData = file_get_contents("php://input");
error_log("Raw Data: " . $rawData);
$data = json_decode($rawData);
$user_id = isset($data->user_id) ? $data->user_id : null;
$title = isset($data->title) ? $data->title : null;
$description = isset($data->description) ? $data->description : null;
$color = isset($data->color) ? $data->color : null;
$start = isset($data->start) ? $data->start : null;
$end = isset($data->end) ? $data->end : null;
$task = isset($data->task) ? $data->task : null;
$special = isset($data->special) ? $data->special : null;


try {
    $query = "INSERT INTO events (user_id,title,description,color, start, end, task, special) VALUES (:user_id, :title, :description, :color, :start, :end, :task, :special)";
    $stmt = $con->prepare($query);
    $stmt->bindParam(':user_id', $user_id);
    $stmt->bindParam(':title', $title);
    $stmt->bindParam(':description', $description);
    $stmt->bindParam(':color', $color);
    $stmt->bindParam(':start', $start);
    $stmt->bindParam(':end', $end);
    $stmt->bindParam(':task', $task);
    $stmt->bindParam(':special', $special);

    $response = array();

    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = "Event created successfully";
    } else {
        $response['success'] = false;
        $response['message'] = "Failed to create event";
        // Log the error or handle it appropriately
        error_log("Database error: " . implode(" ", $stmt->errorInfo()));
    }

    echo json_encode($response);
} catch (PDOException $e) {
    // Log the error with additional information
    error_log("PDOException: " . $e->getMessage() . " in " . $e->getFile() . " on line " . $e->getLine());
    $response['success'] = false;
    $response['message'] = 'Internal Server Error: ' . $e->getMessage();
    echo json_encode($response);
} catch (Exception $e) {
    // Log other types of exceptions
    error_log("Exception: " . $e->getMessage() . " in " . $e->getFile() . " on line " . $e->getLine());
    $response['success'] = false;
    $response['message'] = 'Internal Server Error2: ' . $e->getMessage();
    echo json_encode($response);
}}
?>
