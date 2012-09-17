<?php

require "cmd.exec.php";

$JOIN_CHAR = '_';
$AUTOUPDATE_DATABASE = "source".$JOIN_CHAR."autoupdate";

$code = $argv[1];

// decode the quarter
switch($code[0]) {
	case 'f':
		$quarter = 'fall';
		break;
		
	case 'w':
		$quarter = 'winter';
		break;
		
	case 's':
		$quarter = 'spring';
		break;
		
	case 'm':
		$quarter = 'summer';
		break;
}

// decode the year
$year = (int) ('20'.substr($code, 1));

// prepare the table names for other database 
$current_registrar_table = 'registrar'.$JOIN_CHAR.$year.$JOIN_CHAR.$quarter;

// prepare table names for local database
$base_table = 'registrar';
$base_table_lecture = $base_table.$JOIN_CHAR.'lectures';
$base_table_section = $base_table.$JOIN_CHAR.'sections';


$cmds = array(

/**
	// drop the old table
	'php table.drop.php --source-db="'.$AUTOUPDATE_DATABASE.'" '.$current_registrar_table.'*',

	// mine for data
	'php download.registrar.php -u -'.$code.' "'.$current_registrar_table.'"',
	'php download.registrar.php -g -'.$code.' "'.$current_registrar_table.'"',
	
	// clone the combined table over to ucsb database
	'php table.clone.php --source-db="'.$AUTOUPDATE_DATABASE.'" --source-table="'.$current_registrar_table.'" --dest-table="'.$base_table.'"',
	
	// reorder registrar by field "courseTitle"
	'php table.order.php "'.$base_table.'" "courseTitle"',
/**/
	// split tables by field "courseType"
	'php table.split.php "'.$base_table.'" "courseType"',
	
	// split the lecture table by "courseLevel"
	'php table.split.php "'.$base_table_lecture.'" "courseLevel"',
	
);


cmd::exec($cmds);


?>