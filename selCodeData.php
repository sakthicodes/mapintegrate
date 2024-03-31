<?php
include 'dbConnect.php';

if (isset($_GET["tableName"], $_GET["item_no"])) {
    $tableName = $_GET["tableName"];
    $item_no = $_GET["item_no"];
    $sql = "SELECT * FROM $tableName WHERE item_no =  $item_no";
    $result = mysqli_query($conn, $sql);
}

echo json_encode(mysqli_fetch_row($result));
?>
