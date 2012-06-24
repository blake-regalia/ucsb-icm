<?php

/********
** table.order.php
** by: Blake Regalia, blake.regalia@gmail.com
** 
** php table.order.php TABLE FIELD [-a]
** reorders a table by the given field
** 
**/

require "database.php";

$table = false;
$field = false;
$ASC   = true;

// assert number of args
if($argc < 3) {
	usage();
	die('ERROR: expecting at least 2 arguments');
}
if($argc > 4) {
	usage();
	die('ERROR: expecting at most 3 arguments');
}

// check args
if($argc == 4) {
	if($argv[3] == '-d') {
		$ASC = false;
	}
	else {
		echo 'ERROR: expecting "-d" as last arg.';
		exit(1);
	}
}

$table = $argv[1];
$field = $argv[2];

$db = new MySQL_Pointer();

// verbose printing
echo "\n";
$vTable = '"'.$table.'"';
$vField = '"'.$field.'"';
echo 'reordering table:'.$vTable.' by field '.$vField."\n";
echo '-----------------------'."\n";

$db->selectTable($table);
if(!$db->reorderBy($field, $ASC)) {
	$db->error('ERROR: could not alter table.');
	exit(1);
}
echo 'success.'."\n";

echo '===================================='."\n";

echo "\n";



function usage() {
	echo 'usage:
php '.$_SERVER['SCRIPT_FILENAME'].'  TABLE FIELD [-d]

-d   use descending order, [ascending is the default]

eg:
php '.$_SERVER['SCRIPT_FILENAME'].' "registrar" "courseTitle"
  --- reorders `registrar` rows by sorting the values given in field "courseTitle", ascending order
'."\n";
}

?>