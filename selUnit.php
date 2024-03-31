<?php
include 'dbConnect.php';

if (isset($_GET["tableName"], $_GET["itemNo"])) {
    $tableName = $_GET["tableName"];
    $itemNo = $_GET["itemNo"];
    $sql = "SELECT * FROM $tableName WHERE item_no =  '$itemNo'";
    $result = mysqli_query($conn, $sql);
    $row = mysqli_fetch_assoc($result);
    $ra = $row['unit'];
}

echo json_encode(mysqli_fetch_row($ra));
?>