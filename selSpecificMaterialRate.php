<?php
include 'dbConnect.php';

if (isset($_GET["tableName"], $_GET["code"])) {
    $tableName = $_GET["tableName"];
    $code = $_GET["code"];
    $sql = "SELECT * FROM $tableName WHERE code =  '$code'";
    $result = mysqli_query($conn, $sql);
}

echo json_encode(mysqli_fetch_row($result));
?>
