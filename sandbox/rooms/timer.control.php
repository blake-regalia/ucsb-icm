<?php
function now() {
	$mtime = microtime();
	$mtime = explode(" ",$mtime); 
	return $mtime[1] + $mtime[0]; 
}

$starttime = now();


$endtime = now(); 
$totaltime = ($endtime - $starttime); 
echo "Setup & take-down cost of timer: ";
printf("%.4f", $totaltime*1000);
echo " ms";

?>