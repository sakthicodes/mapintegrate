<?php include 'dbConnect.php';
if (isset($_GET["state"])) {
    $y = $_GET["state"];
    $sql = "SELECT * FROM `selector` WHERE country =  '$y' ";
    $result = mysqli_query($conn, $sql);
    $numrows = mysqli_num_rows($result);
    for ($i = 0; $i < $numrows; $i++) {
        $row = mysqli_fetch_assoc($result);
        $r = $row['department'];
        if ($i == 0) {
            $arrm[$i] = $row['department'];
        } else {
            $exist = false;
            $sql1 = "SELECT * FROM `selector` WHERE country =  '$y' ";
            $result1 = mysqli_query($conn, $sql);
            for ($x = 0; $x < $i; $x++) {
                $row1 = mysqli_fetch_assoc($result1);
                $ra = $row1['department'];
                if ($ra == $r) {
                    $exist = true;
                    break;
                }
            }
            if ($exist == false) {
                $arrm[$i] = $row['department'];
            }
        }
    }
}
$arrm1 = array_values($arrm);
$output = '<option selected disabled>Department</option>';
$i = 0;
while ($i < count($arrm1)) {
    $output .= '<option value="' . $arrm1[$i] . '">' . $arrm1[$i] . '</option>';
    $i++;
}
echo $output;
?>