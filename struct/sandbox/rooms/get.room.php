<?php

function now() {
	$mtime = microtime();
	$mtime = explode(" ",$mtime); 
	return $mtime[1] + $mtime[0]; 
}
function print_time($prefix, $time) {
	printf($prefix."%.4f ms\n", $time*1000);
}

$echo_time = $_GET['t'];



// start timing
$starttime = now();




// retrieve the parameters from the GET request
$buildingName = $_GET['b'];
$roomNumber = $_GET['r'];

// setup a mysql connection
$con = mysql_connect('localhost','root','');

// time for connection to be established
$connection_time = now();



mysql_select_db('ucsb-geog-icm', $con);

$sql = "SELECT * FROM `rooms` WHERE `roomNumber` = '".$roomNumber."' AND `buildingName` = '".$buildingName."';";

$result = mysql_query($sql);

// time for query to complete
$query_time = now();



$room = mysql_fetch_assoc($result);
echo json_encode($room);

// time for formatting & printing to complete
$format_time = now();



// total time
$endtime = now();




if($echo_time) {
	echo "\n\n";
	
	print_time('connection time: ', $connection_time - $starttime);
	print_time('query time: ', $query_time - $connection_time);
	print_time('format time: ', $format_time - $query_time);
	print_time('total time: ', $endtime - $starttime);
}


?>