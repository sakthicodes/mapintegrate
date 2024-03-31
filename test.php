<script>
  let x = 3;

</script>
<?php 
$x =  "<script>document.writeln(x);</script>"; 
echo $x;
$y = $_POST['y'];
echo $y;

$sql1= "INSERT INTO `selector` (`sno`, `country`, `department`, `sor`, `labourRate`, `materialRate`) VALUES (NULL, 'BIHAR', 'RWD', '2022', '2023-01-01', '2023-01-01')";
$sql1= "UPDATE `selector` SET `department` = 'RCD' WHERE `selector`.`sno` = 18";
$sql1= "DELETE FROM `selector` WHERE `selector`.`sno` = 19";
?>