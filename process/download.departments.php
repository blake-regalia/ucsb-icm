<?php

$AUTOUPDATE_DATABASE = "source_autoupdate";

require "phpQuery.php";
require "database.php";

$db_table_name = false;


$base_url = "http://my.sa.ucsb.edu/Catalog/Current/CollegesDepartments";
$url = $base_url."/AcademicDepartmentDirectory.aspx";

$curlOpts = array(
	CURLOPT_URL => $url,
	CURLOPT_CONNECTTIMEOUT => 15,
	CURLOPT_RETURNTRANSFER => 1,
);



// initialize a curl object
$handle = curl_init();

// extend any additional curl options to the default ones
curl_setopt_array($handle, $curlOpts);

// perform get request
$response = curl_exec($handle);
curl_close($handle);
unset($handle);

$html = substr($response, strpos($response, '<!DOCTYPE'));

// parse the document
$doc = phpQuery::newDocument($html);
phpQuery::selectDocument($doc);



// store the department list to an array
$departments = array();

function getDepartment($elmt) {
	// php bug won't allow call by reference in user-defined functions, use global instead
	global $departments;
	$departments[pq($elmt)->text()] = pq($elmt)->attr('href');
}

// fetch all of the course list option values
pq('#content div>ul')->eq(0)->find('a')->each('getDepartment', new CallbackParam);



foreach($departments as $dptName => $dptUrl) {
	
	if(!preg_match('/^[.]{2}\\/[^\\/]+\\/([^\\/]+)\\/(.*)\\.(.*)$/', $dptUrl, $match)) {
		echo "ERROR: Didn't match Regex against '".$dptUrl."'\n";
		continue;
	}
	
	$dptUrl = $match[1].'/'.$match[2].'.'.$match[3];
	
	switch($match[1]) {
		
		case 'ls-intro':
		case 'coe':
			echo $match[2]."\n";
			break;
			
		default:
			echo $dptUrl."\n";
			break;
	}
	
	/*
	// extend any additional curl options to the default ones
	$curlOpts = $curlOpts + array(
//		CURLOPT_URL => $base_url.,
	);
	
	
	curl_setopt_array($handle, $curlOpts);
	*/
}

exit;




?>