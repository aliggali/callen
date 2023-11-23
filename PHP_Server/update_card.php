<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
error_reporting(E_ALL);
ini_set('display_errors', 1);

include('dbcon.php');

$data = json_decode(file_get_contents("php://input"));
$id = isset($data->cid) ? $data->cid : null;
$user_id = isset($data->userId) ? $data->userId : null;
$kanban_id = isset($data->bid) ? $data->bid : null;

try {

    $query = "UPDATE kanbanevents SET kanban_id = :kanban_id WHERE id = :id AND user_id = :user_id";
    
    $stmt = $con->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':user_id', $user_id);
    $stmt->bindParam(':kanban_id', $kanban_id);

    $response = array();

    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = "Event updated successfully";
    } else {
        $response['success'] = false;
        $response['message'] = "Failed to update event";
        // Log database error
        error_log("Database error: " . implode(" ", $stmt->errorInfo()));
    }

    echo json_encode($response);
} catch (PDOException $e) {
    // Log PDOException
    error_log("PDOException: " . $e->getMessage());
    $response['success'] = false;
    $response['message'] = json_encode($data);
    echo json_encode($response);
    error_log("Received data in PHP: " . json_encode($data));
}
?>
