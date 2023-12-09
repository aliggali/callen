<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
error_reporting(E_ALL);
ini_set('display_errors', 1);

include('dbcon.php');

$data = json_decode(file_get_contents("php://input"));
$id = isset($data->cardId) ? $data->cardId : null;
$user_id = isset($data->user_id) ? $data->user_id : null;
$title = isset($data->title) ? $data->title : null;


try {
    $query = "UPDATE kanbanevents SET title = :title WHERE id = :id and user_id = :user_id";
    $stmt = $con->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':user_id', $user_id);
    $stmt->bindParam(':title', $title);

    $response = array();

    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = "Event updated successfully";
    } else {
        $response['success'] = false;
        $response['message'] = "Failed to update event";
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
