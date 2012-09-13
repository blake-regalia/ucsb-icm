<?php

$json = file_get_contents('edu.ucsb.geog.blake/salaries/sacbee.2011.json');

$root = json_decode($json, true);

$csv = array();
$line = array();
foreach($root['cols'] as $col) {
	$line []= $col['id'];
}
$csv []= implode('","', $line);

foreach($root['rows'] as $i => $arr) {
	$line = array();
	foreach($arr['c'] as $dsv) {
		$line []= $dsv['v'];
	}
	$csv []= implode('","', $line);
}

$csv = '"'.implode("\"\n\"", $csv).'"';

file_put_contents('edu.ucsb.geog.blake/salaries/sacbee.2011.csv', $csv);

?>