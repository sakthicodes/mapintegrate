<?php
include 'dbConnect.php';

if (isset($_GET["tableName"])) {
    $tableName = $_GET["tableName"];
    $itemNumber = $_GET["itemNumber"];
    $sql = "SELECT * FROM $tableName";
    $result = mysqli_query($conn, $sql);
    $numrows = mysqli_num_rows($result);
    $arry = array();

    for ($i = 0; $i < $numrows; $i++) {
        $row = mysqli_fetch_assoc($result);
        $arry[] = $row;
    }
}
echo json_encode($arry);
