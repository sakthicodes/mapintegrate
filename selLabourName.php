<?php
include 'dbConnect.php';

if (isset($_GET["tableName"], $_GET["labour"])) {
    $tableName = $_GET["tableName"];
    $labour = $_GET["labour"];
    $sql = "SELECT * FROM $tableName WHERE code =  '$labour'";
    $result = mysqli_query($conn, $sql);
    $row = mysqli_fetch_assoc($result);
    $ra = $row['description'];
}

echo json_encode(mysqli_fetch_row($ra));
?>