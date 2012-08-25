<?php

/****
** NOTE: "allow_url_fopen" must be enabled in php.ini
****/

require "../../database.php";

$db = new MySQL_Pointer();
$db->selectTable('directory');
$directory = $db->fetchAssoc();

$hostAddr = $_SERVER['HTTP_HOST'];
$hostAddr = '128.111.41.45';

$remoteAddr = $_SERVER['REMOTE_ADDR'];
$remoteAddr = '128.111.41.42';

foreach($directory as $row) {
	
	$lastName = $row['lastName'];
	$firstName = $row['firstName'];
	
	$urlData = http_build_query(array(
		'v' => '1.0',
		'q' => $firstName.' '.$lastName,
		'as_sitesearch' => 'ucsb.edu',
		'imgtype' => 'face',
		'userip' => $remoteAddr,
	));
	
	$url = "https://ajax.googleapis.com/ajax/services/search/images?".$urlData;
	
	$ch = curl_init();
	curl_setopt_array($ch, array(
		CURLOPT_URL => $url,
		CURLOPT_RETURNTRANSFER => 1,
		CURLOPT_REFERER => $hostAddr,
	));
	$response = curl_exec($ch);
	curl_close($ch);
	
	var_dump($response);
	
	echo $url."<br>".$body."!\n";
	
//	var_dump(json_decode($body));
	
	exit;
	
	/*
	$photo_url = 
	imagecreatefromjpeg($photo_url);
	*/
}

?>