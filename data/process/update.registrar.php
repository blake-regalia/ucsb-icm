<?php

$AUTOUPDATE_DATABASE = "source.autoupdate";

$code = 'm12';

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
$current_registrar_table = 'registrar.'.$year.'.'.$quarter;

// prepare table names for local database
$base_table = 'registrar';
$base_table_lecture = $base_table.'.lecture';
$base_table_section = $base_table.'.section';


$cmds = array(

	// drop the old table
	'php table.drop.php --source-db="'.$AUTOUPDATE_DATABASE.'" '.$current_registrar_table.'.*',

	// mine for data
	'php download.registrar.php -u -'.$code.' "'.$current_registrar_table.'"',
	'php download.registrar.php -g -'.$code.' "'.$current_registrar_table.'"',
	
	/* the following code was for mining undergrad and graduate into separate tables **
	// merge the two independently mined tables into one
	'php table.merge.php --source-db="'.$AUTOUPDATE_DATABASE.'" "'.$base_table_undergrad.'" "'.$base_table_graduate.'" "'.$base_table.'"',
	
	// clone the tables that were most recently mined and update the current database (moves tables from other databases)
	'php table.clone.php --source-db="'.$AUTOUPDATE_DATABASE.'" --source-table="'.$current_registrar_table_undergrad.'" --dest-table="'.$base_table_undergrad.'"',
	'php table.clone.php --source-db="'.$AUTOUPDATE_DATABASE.'" --source-table="'.$current_registrar_table_graduate .'" --dest-table="'.$base_table_graduate.'"',
	**/
	
	// clone the combined table over to ucsb database
	'php table.clone.php --source-db="'.$AUTOUPDATE_DATABASE.'" --source-table="'.$current_registrar_table.'" --dest-table="'.$base_table.'"',
	
	// reorder registrar by field "courseTitle"
	'php table.order.php "'.$base_table.'" "courseTitle"',

	// split tables by field "courseType"
	'php table.split.php "'.$base_table.'" "courseType"',
	
	// split the lecture table by "courseLevel"
	'php table.split.php "'.$base_table_lecture.'" "courseLevel"',
	
	/**
	// split subtables by field "department"
	'php table.split.php "'.$base_table_undergrad.'.lecture" "department"',
	'php table.split.php "'.$base_table_undergrad.'.section" "department"',
	
	'php table.split.php "'.$base_table_graduate.'.lecture" "department"',
	/***/
	
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