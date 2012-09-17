<?php

require "database.php";

$db = new MySQL_Pointer("ucsb");
$db->selectTable("facility_buildings");

$src = new MySQL_Pointer("source.origin");
$src->selectTable("facilities.building");

$abrvs = $src->fetchAssoc();
foreach($abrvs as $abrv) {
	$building = $db->fetchAssoc(array(
		'buildingName' => $abrv['buildingName']
	));
	if(count($building) !== 0) {
		$db->update(
			array(
				'buildingName' => $building[0]['buildingName']
			),
			array(
				'buildingAbrv' => $abrv['buildingAbrv']
			)
		);
	}
}

?>