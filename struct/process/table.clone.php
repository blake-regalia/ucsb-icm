<?php

/********
** table.clone.php
** by: Blake Regalia, blake.regalia@gmail.com
** 
** php table.clone.php ARGUMENT=VALUE
** clones a table from another database, replacing the current one
** see usage for more info
** 
**/

require "database.php";

$dest_table   = false;
$source_db    = false;
$source_table = false;

// parse the args
foreach($argv as $argi => $arg) {
	
	// skip the script name
	if($argi == 0) continue;
	
	// extract the key/value pair of each arg
	if(preg_match('/^\-\-([a-z\_\-]+)=(.*)$/i', $arg, $matches)) {
		
		// fetch the key of the arg
		$key = $matches[1];
		
		// fetch the value of the given arg
		$value = $matches[2];
		
		switch($key) {
			
		case 'dest-table':
			$dest_table = $value;
			break;
			
		case 'source-db':
			$source_db = $value;
			break;
			
		case 'source-table':
			$source_table = $value;
			break;
			
		default:
			echo 'WARNING: no such option `'.$key.'`'."\n";
			break;
		}
		
	}
	else {
		usage();
		die('ERROR: argument not recognized `'.$arg.'`'."\n");
	}
}

// check the args
if(!$dest_table)   noarg_error('dest_table');
if(!$source_table) noarg_error('source_table');
if(!$source_db) {
	$source_db = $DATABASE['db_name'];
}



$db = new MySQL_Pointer();
$xt = new MySQL_Pointer($source_db);

// verbose printing
echo "\n";
$vSrcTable = '"'.$source_db.'"."'.$source_table.'"';
$vDstTable = '"'.$DATABASE['db_name'].'"."'.$dest_table.'"';
echo 'cloning table:'."\n".$vSrcTable."\n".' => '.$vDstTable."\n";
echo '-----------------------'."\n";

echo 'dropping table '.$vDstTable."\n";
$db->dropTable($dest_table);

echo 'copying table structure from '.$vSrcTable."\n";
$db->createTableLike($source_db, $source_table, $dest_table);

echo 'inserting rows to '.$vDstTable."\n";
$db->selectTable($dest_table);
if(!$db->cloneFrom($source_db, $source_table)) {
	echo 'ERROR: failed to insert data from source table to destination table.';
	exit(1);
}


echo '===================================='."\n";

echo "\n";



function usage() {
	echo 'usage:
php '.$_SERVER['SCRIPT_FILENAME'].' ARGUMENT=VALUE

ARGUMENT:
  --dest-table     table to replace, belonging to the configured database
  --source-table   table to clone
  --source-db      database that source_table belongs to

eg:
php '.$_SERVER['SCRIPT_FILENAME'].' --dest-table="registrar.undergrad" --source-db="autoupdate.registrar" --source-table="2012.summer.undergrad"
  --- copies `autoupdate.registrar`.`2012.summer.undergrad` => `[CURRENT DATABASE]`.`registrar.undergrad`
'."\n";
}

function noarg_error($arg) {
	usage();
	die('ERROR: missing argument `'.$arg.'`'."\n");
}

?>