<?php

/********
** table.drop.php
** by: Blake Regalia, blake.regalia@gmail.com
** 
** php table.drop.php [--source-db=SOURCE_DATABASE] TABLE_PATTERN
** drops tables by wildcard
** 
**/

require "database.php";

$source_db = false;

foreach($argv as $arg) {
	
	echo $arg."\n";
	
	// extract the key/value pair of each arg
	if(preg_match('/^\-\-([a-z\_\-]+)=(.*)$/i', $arg, $matches)) {
		
		// fetch the key of the arg
		$key = $matches[1];
		
		// fetch the value of the given arg
		$value = $matches[2];
		
		switch($key) {
			
		case 'source-db':
			$source_db = $value;
		}
	}
	else {
		// reference argument values
		$table_pattern = $arg;
	}
}


// initialize a database pointer to the database defined in: database.config.php
$db = new MySQL_Pointer($source_db);


if($table_pattern[strlen($table_pattern)-1] == '*') {
	$substr = substr($table_pattern, 0, -1);
	$substrLen = strlen($substr);
	
	// verbose printing
	echo "\n";
	echo 'dropping tables with prefix: '.$substr."\n";
	echo '-----------------------'."\n";
	
	// perform a regex test on all table names and remove any with the given table prefix
	$allTables = $db->getTables();
	foreach($allTables as $aTableName) {
		if(substr($aTableName, 0, $substrLen) == $substr) {
			echo 'dropping table: '.$aTableName."\n";
			$db->dropTable($aTableName);
		}
	}
	
	echo '===================================='."\n";
	echo "\n";
}


?>