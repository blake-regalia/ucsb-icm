<?php

require "cmd.exec.php";

$JOIN_CHAR = '_';

$quarter = 'summer';
$year = date('Y');

$current_registrar_table_undergrad = 'registrar'.$JOIN_CHAR.$year.$JOIN_CHAR.$quarter.$JOIN_CHAR.'undergrad';
$current_registrar_table_graduate  = 'registrar'.$JOIN_CHAR.$year.$JOIN_CHAR.$quarter.$JOIN_CHAR.'graduate';


$cmds = array(

	// replace time-dependent tables with most recent sources
	'php table.clone.php --source_table="'.$current_registrar_table_undergrad.'" --source_db="autoupdate" --dest_table="registrar'.$JOIN_CHAR.'undergrad"',
	'php table.clone.php --source_table="'.$current_registrar_table_graduate .'" --source_db="autoupdate" --dest_table="registrar'.$JOIN_CHAR.'graduate"',

	
	// split tables
	'php table.split.php "directory" "branch"',
	'php table.split.php "registrar'.$JOIN_CHAR.'undergrad" "courseType"',
	
);


cmd::exec($cmds);


?>