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
$text = isset($data->text) ? $data->text : null;
$color = isset($data->color) ? $data->color : null;
$user_id = isset($data->userId) ? $data->userId : null;
$card_id = isset($data->cardId) ? $data->cardId: null;


try {
    $query = "INSERT INTO labels (card_id,user_id,text,color) VALUES (:card_id,:user_id,:text,:color)";
    $stmt = $con->prepare($query);
    $stmt->bindParam(':card_id', $card_id);
    $stmt->bindParam(':user_id', $user_id);
    $stmt->bindParam(':text', $text);
    $stmt->bindParam(':color', $color);

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
