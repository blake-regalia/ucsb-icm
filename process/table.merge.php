<?php

/********
** table.merge.php
** by: Blake Regalia, blake.regalia@gmail.com
** 
** php table.merge.php TABLE_1 [TABLE_N...] DESTINATION_TABLE
** creates a new table by merging existing tables
** 
**/

require "database.php";

$dest_table   = false;
$source_table = array();


// assert minimum number of args
if($argc < 4) {
	usage();
	die('ERROR: expecting at least 3 arguments');
}

// parse the args
foreach($argv as $argi => $arg) {
	
	// skip the script name
	if($argi == 0) continue;
	
	if($argi == ($argc - 1)) {
		$dest_table = $arg;
	}
	else {
		$source_table[] = $arg;
	}
}


$db = new MySQL_Pointer();

// verbose printing
echo "\n";
$vSrcTable = '"'.$source_table[0].'"';
$vDstTable = '"'.$dest_table.'"';
echo 'merging tables into:'.$vDstTable."\n";
echo '-----------------------'."\n";

echo 'dropping table '.$vDstTable."\n";
$db->dropTable($vDstTable);

echo 'copying table structure from '.$vSrcTable."\n";
if(!$db->createTableLike(false, $source_table[0], $dest_table)) {
	$db->error('ERROR: could not create new table.');
	exit(1);
}

$db->selectTable($dest_table);

foreach($source_table as $src_table_n) {
	echo 'inserting rows from "'.$src_table_n.'"'."\n";
	if(!$db->cloneFrom(false, $src_table_n)) {
		$db->error('ERROR: could not copy data from table.');
		exit(1);
	}
}

echo '===================================='."\n";

echo "\n";



function usage() {
	echo 'usage:
php '.$_SERVER['SCRIPT_FILENAME'].' TABLE_1 [TABLE_N...] DESTINATION_TABLE

eg:
php '.$_SERVER['SCRIPT_FILENAME'].' "registrar.undergrad" "registrar.graduate" "registrar"
  --- merges `registrar.undergrad` and `registrar.graduate` => `registrar`
    NOTE: all tables must have identical structures
'."\n";
}

?>