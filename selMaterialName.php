<?php
include 'dbConnect.php';

if (isset($_GET["tableName"], $_GET["material"])) {
    $tableName = $_GET["tableName"];
    $material = $_GET["material"];
    $sql = "SELECT * FROM $tableName WHERE code =  '$material'";
    $result = mysqli_query($conn, $sql);
    $row = mysqli_fetch_assoc($result);
    $ra = $row['description'];
}

echo json_encode(mysqli_fetch_row($ra));
