<?php

require "cmd.exec.php";

$JOIN_CHAR = '_';
$AUTOUPDATE_DATABASE = "source".$JOIN_CHAR."autoupdate";

// prepare table name for both databases
$table = 'registrar_subjects';

$cmds = array(

	// mine for data
	'php download.registrar.subjects.php',
	
	// clone the combined table over to ucsb database
	'php table.clone.php --source-db="'.$AUTOUPDATE_DATABASE.'" --source-table="'.$table.'" --dest-table="'.$table.'"',
	
	// reorder registrar by field
	'php table.order.php "'.$table.'" "subjectTitle"',
);

cmd::exec($cmds);


?>