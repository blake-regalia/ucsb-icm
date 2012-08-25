<?php

require "../database.php";

$query = $_GET['q'];

$terms = preg_split('/[^a-z0-9]+/i', $query);

/**
$db = new MySQL_Pointer('ucsb-geog-icm');
$db->selectTable('query-terms');
$terms = $db->fetchAssoc();
/***/

$terms = array(
	'elings',
	'elise',
	'orange',
	'ellison',
	'ellsn',
	'ellisia',
);

$termCandidates = array();
$regex = '/(e?)(l?)(i?)(l?)(s?)(i?)(n?)(o?)/i';

foreach($terms as $term) {
	$mlen = 0;
	
	preg_match($regex, $term, $matches);
	
	print_r($matches);
	
	for($i=sizeof($matches)-1; $i>0; $i--) {
		if(strlen($matches[$i])) {
			$mlen += 1;
		}
	}
	
	if($mlen != 0) {
		if(!$termCandidates[$mlen]) $termCandidates[$mlen] = array();
		$termCandidates[$mlen][] = $term;
	}
}

print_r($termCandidates);
exit;
echo json_encode($termCandidates);



?>