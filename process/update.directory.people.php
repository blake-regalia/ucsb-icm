<?php


require "cmd.exec.php";


$JOIN_CHAR = '_';
$AUTOUPDATE_DATABASE = "source".$JOIN_CHAR."autoupdate";

// establish this structure's namespace
$namespace = "directory.people";

// prepare table name for both databases
$table = preg_replace('/\\./', $JOIN_CHAR, $namespace);


$cmds = array(
	
	// mine for data
	'php download.'.$namespace.'.php',
	
	// clone the combined table over to ucsb database
	'php table.clone.php --source-db="'.$AUTOUPDATE_DATABASE.'" --source-table="'.$table.'" --dest-table="'.$table.'"',
	
	// clear out the local cache files
	'php cache.clear.php "'.$namespace.'"',
);


cmd::exec($cmds);


?>