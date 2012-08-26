<?php

require "database.php";

$db = new MySQL_Pointer();
$be = new MySQL_Pointer();

$db->selectTable('facilities.building');
$be->selectTable('buildingextents');

$extents = $be->fetchAssoc();
foreach($extents as $ext) {
	$db->update(
		array(
			'buildingId' => $ext['buildingId'],
		),
		$ext
	);
}

?>