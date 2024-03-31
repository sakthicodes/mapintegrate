<?php
include 'dbConnect.php';

if (isset($_GET["tableName"], $_GET["itemNumber"])) {
    $tableName = $_GET["tableName"];
    $itemNumber = $_GET["itemNumber"];
    $sql = "SELECT * FROM $tableName WHERE item_no =  '$itemNumber'";
    $result = mysqli_query($conn, $sql);
    $arry = array(); 

    while ($row = mysqli_fetch_assoc($result)) {
        $arry[] = $row; 
    }
}

echo json_encode($arry);
?>
