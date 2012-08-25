<?php

require "database.php";
$db_name = 'ucsb-geog-icm';
$db = new MySQL_Pointer($db_name);

$db->selectTable('rooms');

if(isset($_GET['room'])) { 
	$building_id = $_GET['bid'];
	$room_number = $_GET['room'];
	
	$room = $db->fetchRowWhere("`buildingId` = '".$building_id."' AND `roomNumber` = '".$room_number."'");
	
	echo json_encode($room);
}
else {
	$all = $db->fetchAssoc();
	$json = array();
	
	$identifier = 'buildingId';
	$alternative = 'buildingName';
	if(isset($_GET['by'])) {
		if($_GET['by'] == 'id') {
			$identifier = 'buildingId';
			$alternative = 'buildingName';
		}
		else if($_GET['by'] == 'name') {
			$identifier = 'buildingName';
			$alternative = 'buildingId';
		}
	}
	
	
	if(isset($_GET['only'])) {
		foreach($all as $row) {
			$bid = $row[$identifier];
			$otr = ($alternative=='buildingId')? (int) $row[$alternative]: $row[$alternative];
			$json[$bid] = $otr;
			$json[$otr] = $bid;
		}
		
		echo json_encode($json);
		exit;
	}
	else {
		foreach($all as $row) {
			$bid = $row[$identifier];
			if(!is_array($json[$bid])) {
				$json[$bid] = array();
			}
			$json[$bid][$row['roomNumber']] = array(
				(float) $row['ymin'],
				(float) $row['xmin'],
				(float) $row['ymax'],
				(float) $row['xmax'],
			);
		}
		echo json_encode($json);
		exit;
	}
	
}

?>