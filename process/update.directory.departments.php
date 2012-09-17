<?php

require "cmd.exec.php";

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


cmd::exec($cmds);


?>