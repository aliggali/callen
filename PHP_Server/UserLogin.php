<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
error_reporting(E_ALL);
ini_set('display_errors', 1);

include('dbcon.php');

$android = strpos($_SERVER['HTTP_USER_AGENT'], 'Android');

if (($_SERVER['REQUEST_METHOD'] == 'POST') || $android) {
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Validate user credentials
    $validateUserQuery = "SELECT * FROM users WHERE email = :email AND password = :password";
    $validateUserStmt = $con->prepare($validateUserQuery);
    $validateUserStmt->bindParam(':email', $email);
    $validateUserStmt->bindParam(':password', $password);
    $validateUserStmt->execute();

    if ($validateUserStmt->rowCount() > 0) {
        $user = $validateUserStmt->fetch(PDO::FETCH_ASSOC); // Fetch the user data
        $successMSG = array('message' => '로그인 성공!', 'userId' => $user['id'], 'userName' => $user['name'], 'password' => $user['password']);
        echo json_encode($successMSG);
        // You can also include additional information or set session variables here.
    } else {
        $errMSG = '이메일 또는 비밀번호가 올바르지 않습니다.';
        $errorResponse = array('message' => $errMSG);
        echo json_encode($errorResponse);
    }
}
?>
