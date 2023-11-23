
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
error_reporting(E_ALL);
ini_set('display_errors', 1);

include "dbcon.php";
$android = strpos($_SERVER['HTTP_USER_AGENT'], 'Android');

if (($_SERVER['REQUEST_METHOD'] == 'POST') || $android) {
  $response = array();
  $user_id = $_POST['userId'];
  try {
    $query = "SELECT title, start FROM events WHERE special = 1 AND user_id = :user_id";
    $stmt = $con->prepare($query);
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->execute();

    $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $response['success'] = true;
    $response['tasks'] = $tasks; // Change 'events' to 'tasks' or vice versa
    $response['message'] = "Events loaded successfully";

  } catch (PDOException $e) {
    // Log the error or handle it appropriately
    error_log("Database error: " . $e->getMessage());
    $response['success'] = false;
    $response['message'] = 'Internal Server Error';
  }

  echo json_encode($response);
}
?>