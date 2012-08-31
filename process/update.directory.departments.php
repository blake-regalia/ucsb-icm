<?php

$JOIN_CHAR = '_';
$AUTOUPDATE_DATABASE = "source".$JOIN_CHAR."autoupdate";

// establish this structure's namespace
$namespace = "directory.departments";

// prepare table name for both databases
$table = preg_replace('/\\./', '_', $namespace);


$cmds = array(
	
	// mine for data
	'php download.directory.departments.php',
	
	// clone the combined table over to ucsb database
	'php table.clone.php --source-db="'.$AUTOUPDATE_DATABASE.'" --source-table="'.$table.'" --dest-table="'.$table.'"',
	
	// reorder registrar by field "courseTitle"
	'php table.order.php "'.$table.'" "departmentName"',
	
	'php cache.clear.php "'.$namespace.'"',
);


foreach($cmds as $cmdStr) {
	attempt($cmdStr);
}

function attempt($cmd) {
	echo "\n".'$ '.$cmd."\n";
	exec($cmd, $out, $err);
	echo implode("\n",$out);
	if($err) {
		echo "\n";
		exit(1);
	}
}


?>