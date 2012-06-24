<?php

/********
** table.drop.php
** by: Blake Regalia, blake.regalia@gmail.com
** 
** php table.drop.php TABLE_PATTERN
** drops tables by wildcard
** 
**/

require "database.php";

// reference argument values
$table_pattern = $argv[1];

// initialize a database pointer to the database defined in: database.config.php
$db = new MySQL_Pointer();


// verbose printing
echo "\n";
echo 'dropping tables with prefix: '.$substr."\n";
echo '-----------------------'."\n";

if($table_pattern[strlen($table_pattern)-1] == '*') {
	$substr = substr($table_pattern, 0, -1);
	$substrLen = strlen($substr);
	
	// perform a regex test on all table names and remove any with the given table prefix
	$allTables = $db->getTables();
	foreach($allTables as $aTableName) {
		if(substr($aTableName, 0, $substrLen) == $substr) {
			echo 'dropping table: '.$aTableName."\n";
			$db->dropTable($aTableName);
		}
	}
}

echo '===================================='."\n";
echo "\n";


?>