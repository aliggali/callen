<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
error_reporting(E_ALL);
ini_set('display_errors', 1);

include('dbcon.php');

$android = strpos($_SERVER['HTTP_USER_AGENT'], 'Android');

if (($_SERVER['REQUEST_METHOD'] == 'POST') || $android) {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Check if the email already exists
    $checkEmailQuery = "SELECT COUNT(*) FROM users WHERE email = :email";
    $checkEmailStmt = $con->prepare($checkEmailQuery);
    $checkEmailStmt->bindParam(':email', $email);
    $checkEmailStmt->execute();
    $emailExists = $checkEmailStmt->fetchColumn();

    if ($emailExists) {
        $errMSG = '이미 등록된 이메일 주소입니다.';
        echo $errMSG;
    } else {
        try {
            $stmt = $con->prepare('INSERT INTO users (name, email, password) VALUES (:name, :email, :password)');
            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':password', $password);

            if ($stmt->execute()) {
                $successMSG = '새로운 계정을 추가했습니다.';
                echo $successMSG;
            } else {
                $errMSG = '리뷰 계정 에러';
                echo $errMSG;
            }
        } catch (PDOException $e) {
            die('Database error: ' . $e->getMessage());
        }
    }
}
?>
