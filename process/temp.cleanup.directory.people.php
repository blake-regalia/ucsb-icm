<?php

require "database.php";

$db = new MySQL_Pointer("source_autoupdate");

$db->selectTable("directory_people");

$people = $db->fetchAssoc();

$trim = array(
	'/^\s+/' => '',
	'/\s+$/' => '',
);

foreach($people as $row) {
	$db->update($row, array(
		'firstName' => preg_replace(array_keys($trim),array_values($trim), $row)
	));
}

?>