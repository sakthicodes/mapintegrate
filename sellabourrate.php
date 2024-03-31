<?php
include 'dbConnect.php';
if (isset($_GET["state1"] , $_GET["department1"])) {
$y = $_GET["state1"];
$dept = $_GET["department1"];
$sql = "SELECT * FROM `labourrateselector` WHERE country =  '$y' AND department = '$dept' ";
$result = mysqli_query($conn, $sql);
$numrows = mysqli_num_rows($result);
for ($i = 0; $i < $numrows; $i++) {
    $row = mysqli_fetch_assoc($result);
    $r = $row['monthyear'];
    if ($i == 0) {
        $arrs[$i] = $row['monthyear'];
    } else {
        $exist = false;
        $sql1 = "SELECT * FROM `labourrateselector` WHERE country =  '$y' AND department = '$dept' ";
        $result1 = mysqli_query($conn, $sql1);
        for ($x = 0; $x < $i; $x++) {
            $row1 = mysqli_fetch_assoc($result1);
            $ra = $row1['monthyear'];
            if ($ra == $r) {
                $exist = true;
                break;
            }
        }
        if ($exist == false) {
            $arrs[$i] = $row['monthyear'];
        }
    }
}

$arrs1 = array_values($arrs);
$output = '<option selected disabled>Labour Rate</option>';
$i = 0;
while ($i < count($arrs1)) {
    $output .= '<option value="' . $arrs1[$i] . '">'. $arrs1[$i] .'</option>';
    $i++;
}
echo $output;
}
?>