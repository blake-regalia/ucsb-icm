<?php

/********
** table.split.php
** by: Blake Regalia, blake.regalia@gmail.com
** 
** php table.split.php TABLE_NAME FIELD_NAME
** creates tables by suffixing the given TABLE_NAME with the different values found on that table under the field given by FIELD_NAME
** 
**/

require "database.php";

$JOIN_CHAR = '_';

// assure arguments are correct
$MIN_ARGC = 3;
if($argc < $MIN_ARGC - 1) die_input('missing `TABLE_NAME` parameter');
if($argc < $MIN_ARGC)     die_input('missing `FIELD_NAME` parameter');

// reference argument values
$table = $argv[1];
$field = $argv[2];

// initialize a database pointer to the database defined in: database.config.php
$db = new MySQL_Pointer();

// check that the given table exists
if(!$db->tableExists($table)) {
	die('ERROR: table "'.$table.'" does not exist on database "'.$db->getDatabase().'"'."\n");
}


// verbose printing
echo "\n";
$vSrcTable = '"'.$DATABASE['db_name'].'"."'.$table.'"';
echo 'splitting table:'."\n".$vSrcTable.' based on field "'.$field.'"'."\n";
echo '-----------------------'."\n";


// set up subsequent queries to take place on given table
$db->selectTable($table);

// fetch entire table
$parentTable = $db->fetchAssoc();

// create sub-tables by iterating over entire table
$subtableArray = array();
foreach($parentTable as $entry) {
	
	// suffix current table name with value of given field at this entry
	$index = $table.$JOIN_CHAR.$entry[$field];
	
	// push this row to the new sub-table
	if(!isset($subtableArray[$index])) {
		
		// check that this value does not violate database table naming convention
		if(!preg_match('/^[a-z_][a-z0-9_]*$/i', $entry[$field])) {
			echo 'ERROR: at least 1 row contains an invalid value "'.$entry[$field].'" in field "'.$field.'"'."\n";
			echo "\t".'In order to split a table by a field, all values in that field must match the pattern: [_A-Za-z][_A-Za-z0-9]*'."\n";
			exit(1);
		}
		
		$subtableArray[$index] = array();
	}
	$subtableArray[$index][] = $entry;
}


// replace any regex delimeters found in the table name
$delimeterReplacements = array(
	'/([\\.\\-\\?\\*\\+\\[\\]\\(\\)])/' => '\\\$1',
);
$tableRegex = '/^'.
	preg_replace(
		array_keys($delimeterReplacements),
		array_values($delimeterReplacements),
		$table).'\\'.$JOIN_CHAR.'.+/';

// perform a regex test on all table names and remove any with the given table prefix
$allTables = $db->getTables();

foreach($allTables as $aTableName) {
	if(preg_match($tableRegex, $aTableName)) {
		echo 'dropping table: '.$aTableName."\n";
		$db->dropTable($aTableName);
	}
}

echo '-----------------------'."\n";

echo 'with database: "'.$DATABASE['db_name'].'"...'."\n";

// iterate over sub-tables
foreach($subtableArray as $subtableName => $subtable) {
	
	// create new table, and select it
	echo 'adding table: "'.$subtableName.'"'."\n";
	$db->createTableLike(false, $table, $subtableName);
	$db->selectTable($subtableName);
	
	// copy over all the data that belongs in the sub-table
	foreach($subtable as $entry) {
		$db->insert($entry);
	}
}


echo '===================================='."\n";
echo "\n";




function die_input($remarks=false) {
	echo 'usage:
php '.$_SERVER['SCRIPT_FILENAME'].' TABLE_NAME FIELD_NAME

eg:
php '.$_SERVER['SCRIPT_FILENAME'].' "directory" "branch"
-- creates the necessary sub-tables from the parent table, "directory" by suffixing table name with values at "branch"
-- -- directory => [directory.staff, directory.faculty, directory.student]

';
	if($remarks) echo 'ERROR: '.$remarks;
	exit(1);
}


?>