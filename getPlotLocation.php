<?php
include 'dbConnect.php';

if (isset($_GET['plot'])) {
    if (
        isset($_GET['rajya']) &&
        isset($_GET['district']) &&
        isset($_GET['prakhand']) &&
        isset($_GET['mouza'])
    ) {
        $plotValue = mysqli_real_escape_string($conn, $_GET['plot']);
        $rajyaValue = mysqli_real_escape_string($conn, $_GET['rajya']);
        $districtValue = mysqli_real_escape_string($conn, $_GET['district']);
        $prakhandValue = mysqli_real_escape_string($conn, $_GET['prakhand']);
        $mouzaValue = mysqli_real_escape_string($conn, $_GET['mouza']);
        $tableName = $rajyaValue . $districtValue . $prakhandValue . $mouzaValue;

        $query = "SELECT 
            `corner1latitude`, `corner1longitude`,
            `corner2latitude`, `corner2longitude`,
            `corner3latitude`, `corner3longitude`,
            `corner4latitude`, `corner4longitude`,
            `corner5latitude`, `corner5longitude`,
            `corner6latitude`, `corner6longitude`
            FROM `$tableName` WHERE `plotno` = '$plotValue'";
        $result = mysqli_query($conn, $query);

        if ($result) {
            $data = mysqli_fetch_assoc($result);

            echo json_encode($data);
        } else {
           
            echo json_encode(array());
        }
    } else {
       
        echo json_encode(array());
    }
} else {
   
    echo json_encode(array());
}

mysqli_close($conn);
?>
