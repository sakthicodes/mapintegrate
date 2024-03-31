<?php
include 'dbConnect.php';
if (isset($_GET["rajya"] , $_GET["district"])) {
$y = $_GET["rajya"];
$dist = $_GET["district"];
$sql = "SELECT * FROM `selector` WHERE rajya =  '$y' AND district = '$dist' ";
$result = mysqli_query($conn, $sql);
$numrows = mysqli_num_rows($result);
for ($i = 0; $i < $numrows; $i++) {
    $row = mysqli_fetch_assoc($result);
    $r = $row['prakhand'];
    if ($i == 0) {
        $arrs[$i] = $row['prakhand'];
    } else {
        $exist = false;
        $sql1 = "SELECT * FROM `selector` WHERE rajya =  '$y' AND district = '$dist' ";
        $result1 = mysqli_query($conn, $sql1);
        for ($x = 0; $x < $i; $x++) {
            $row1 = mysqli_fetch_assoc($result1);
            $ra = $row1['prakhand'];
            if ($ra == $r) {
                $exist = true;
                break;
            }
        }
        if ($exist == false) {
            $arrs[$i] = $row['prakhand'];
        }
    }
}

$arrs1 = array_values($arrs);
$output = '<option selected disabled>BLOCK</option>';
$i = 0;
while ($i < count($arrs1)) {
    $output .= '<option value="' . $arrs1[$i] . '">'. $arrs1[$i] .'</option>';
    $i++;
}
echo $output;
}
?>