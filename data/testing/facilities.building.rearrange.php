<?php

require "../database.php";

// initialize the object to connect to a database
$db = new MySQL_Pointer('source.origin');

// select a table for subsequent commands to be executed on
$db->selectTable('table 4');


$dba = new MySQL_Pointer('source.origin');

$dba->selectTable('table 5');

// fetch all the records as a large array
$bids = $dba->fetchAssoc();

foreach($bids as $bld) {
	$select = array('buildingName'=>$bld['COL 3']);
	if($db->fetchSize($select) != 0) {
		$db->update($select, array(
			'buildingId' => $bld['COL 2']
		));
	}
}


?>