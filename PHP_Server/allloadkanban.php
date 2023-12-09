<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
error_reporting(0); // Disable error reporting on the page

include "dbcon.php";
$android = strpos($_SERVER['HTTP_USER_AGENT'], 'Android');

if ($_SERVER['REQUEST_METHOD'] == 'POST' || $android) {
    $response = array();

    // Check if the required parameters are set
    $boardId = $_POST['boardId'];
    $userId = $_POST['userId'];

    try {
        $query = "SELECT 
        k.id as kanban_id, 
        k.status as kanban_title, 
        ke.id as card_id, 
        ke.title as card_title, 
        ke.end as card_date, 
        ke.description as card_desc, 
        l.id as label_id, 
        l.text as label_text, 
        l.color as label_color, 
        t.id as task_id, 
        t.text as task_text, 
        t.completed as task_completed 
        FROM kanban k 
        LEFT JOIN kanbanevents ke ON k.id = ke.kanban_id
        LEFT JOIN labels l ON ke.id = l.card_id 
        LEFT JOIN tasks t ON ke.id = t.card_id WHERE k.user_id = :userId";

        $stmt = $con->prepare($query);

        $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
        $stmt->execute();

        $events = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $response['success'] = true;
        $response['events'] = $events;
        $response['message'] = "Events loaded successfully";
    } catch (PDOException $e) {
        // Log the error or handle it appropriately
        error_log("Database error: " . $e->getMessage());
        $response['success'] = false;
        $response['message'] = 'Internal Server Error';
    }

    // Set the content type to JSON
    header('Content-Type: application/json');

    // Output the JSON response
    echo json_encode($response);
}
?>
