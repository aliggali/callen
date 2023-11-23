<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
error_reporting(E_ALL);
ini_set('display_errors', 1);

include('dbcon.php');

$data = json_decode(file_get_contents("php://input"));
$id = isset($data->boardId) ? $data->boardId : null;
$user_id = isset($data->userId) ? $data->userId : null;

try {
    $query = "DELETE FROM kanban where id = :id and user_id = :user_id";
    $stmt = $con->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':user_id', $user_id);

    $response = array();

    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = "Event deleted successfully";
    } else {
        $response['success'] = false;
        $response['message'] = "Failed to delete event";
        // Log the error or handle it appropriately
        error_log("Database error: " . implode(" ", $stmt->errorInfo()));
    }

    echo json_encode($response);
} catch (PDOException $e) {
    // Log the error or handle it appropriately
    error_log("Database error: " . $e->getMessage());
    $response['success'] = false;
    $response['message'] = 'Internal Server Error';
    echo json_encode($response);
}
?>
