<?php
include 'dbConnect.php';

if (isset($_GET["tableName"])) {
    $tableName = $_GET["tableName"];
    $itemNumber = $_GET["itemNumber"];
    $sql = "SELECT * FROM $tableName where item_no =  '$itemNumber'";
    $result = mysqli_query($conn, $sql);
    $arry = array();
    $row = mysqli_fetch_assoc($result);
    $rowIndex = $row['index1'];
    for ($i = $rowIndex ; $i < $rowIndex + 500; $i++) {
        $sql1 = "SELECT * FROM $tableName where index1 =  '$i'";
        $result1 = mysqli_query($conn, $sql1);
        $row1 = mysqli_fetch_assoc($result1);
        $itemNo = $row1['item_no'];
        if ($i == $rowIndex) {
            $arry[] = $row1;
        }
        else {
        if ($itemNo == null || $itemNo == ' ' || $itemNo == '  ' || $itemNo == '   ' || $itemNo == '     ') {
            $arry[] = $row1;
        } else {
            $arry[] = $row1;
            break;
        }
    }
    }
}
echo json_encode($arry);
?>


