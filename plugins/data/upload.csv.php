<?php

require "../database.php";

$db = new MySQL_Pointer('edu.ucsb.geog.blake');
$namespace = 'salaries.2011';
$table = preg_replace('/\\./', '_', $namespace);

$overwrite = true;
if($db->tableExists($table)) {
	if($overwrite !== TRUE) {
		echo 'table already exists. overwrite must be set to 1';
		exit(1);
	}
	$db->dropTable($table);
}

$struct = array();
$line = 1;

if(($handle = fopen("edu.ucsb.geog.blake/salaries/sacbee.2011.csv", "r")) !== FALSE) {
	$cols = array();
	$data = fgetcsv($handle, 1000, ",");
	if($data === FALSE) {
		echo 'empty CSV file';
		exit(1);
	}
	$cols = $data;
	$width = count($data);
	$line += 1;
	
	$fields = array();
	foreach($cols as $c) {
		$fields[$c] = 'varchar(255) NOT NULL';
	}
	$db->createTable($table, $fields);
	$db->selectTable($table);
	
	while(($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
		$row = array();
		$num = count($data);
		if($num < $width) {
			echo 'WARNING: row width less than column width. Skipping row @line '.$line."\n";
			$line += 1;
			continue;
		}
		for($c=0; $c<$width; $c++) {
			$row[$cols[$c]] = $data[$c];
		}
		$db->insert($row);
		$line += 1;
	}
	fclose($handle);
}


/*
exit;
$csv = preg_split('/\r?\n/', file_get_contents('edu.ucsb.geog.blake/salaries/sacbee.2011.csv'));

$cols = $csv[0];

$size = count($csv);
for($i=1; $i<$size; $i++) {
	preg$cols[$i]
}
*/
?>