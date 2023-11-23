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
    $id = isset($data->id) ? $data->id : null; // Assuming id is provided in the JSON data
    $user_id = isset($data->userId) ? $data->userId : null;
    $status =  isset($data->status) ? $data->status : null;

    try {
        $query = "INSERT INTO kanban (id, user_id, status) VALUES (:id, :user_id, :status)";
        $stmt = $con->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':status', $status);

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
    }
}
?>
