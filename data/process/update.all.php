<?php

$quarter = 'summer';
$year = date('Y');

$current_registrar_table_undergrad = 'registrar.'.$year.'.'.$quarter.'.undergrad';
$current_registrar_table_graduate  = 'registrar.'.$year.'.'.$quarter.'.graduate';


$cmds = array(

	// replace time-dependent tables with most recent sources
	'php table.clone.php --source_table="'.$current_registrar_table_undergrad.'" --source_db="autoupdate" --dest_table="registrar.undergrad"',
	'php table.clone.php --source_table="'.$current_registrar_table_graduate .'" --source_db="autoupdate" --dest_table="registrar.graduate"',

	
	// split tables
	'php table.split.php "directory" "branch"',
	'php table.split.php "registrar.undergrad" "courseType"',
	
);



foreach($cmds as $cmdStr) {
	attempt($cmdStr);
}

function attempt($cmd) {
	exec($cmd, $out, $err);
	echo implode("\n",$out);
	if($err) {
		echo "\n";
		exit(1);
	}
}


?>