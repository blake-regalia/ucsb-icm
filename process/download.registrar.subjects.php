<?php

/**
 * Downloads subjects from UCSB's GOLD web service and inserts rows into database
 *
 *
 * PHP version 5
 *
 * @author     Blake Regalia <blake.regalia@gmail.com>
 * @version    2012/08/30
 */
 
require "phpQuery.php";
require "database.php";


// establish this structure's namespace
$namespace = "registrar.subjects";

// initialize database/table parameters
$db = new MySQL_Pointer("source_autoupdate");
$table_name = preg_replace('/\\./', '_', $namespace);

// drop any existing tables
$db->dropTable($table_name);

// recreate the table
if(!$db->execute("create-table.".$namespace.".sql")) {
	$db->error('ERROR: Could not create table');
}

// select the table for consequent function calls
$db->selectTable($table_name);


// download the subject list from GOLD
$list = download_gold_subject_list();

// keep track of how many records get inserted
$total = 0;
$inserted = 0;

// iterate over every item
foreach($list as $abrv => $title) {
	
	// right trim whitespace: title
	$title = preg_replace('/\s+$/', '', $title);
	
	// right trim whitespace: abrv
	$abrv = preg_replace('/\s+$/', '', $abrv);
	
	// insert into table
	$res = $db->insert(
		array(
			'subjectName' => $title,
			'subjectAbrv' => $abrv,
		)
	);
	
	// keep track of how many records get inserted
	if($res) $inserted += 1;
	$total += 1;
}

// verbose output
echo $inserted.' inserted / '.$total.' total'."\n";

// done
echo "\n";
exit;


// downloads all subjects from GOLD
function download_gold_subject_list() {
	
	// store everything to an array
	$array = array();
	
	// setup curl params
	$url = "http://my.sa.ucsb.edu/public/curriculum/coursesearch.aspx";
	
	$opts = array(
		CURLOPT_URL => $url,
		CURLOPT_CONNECTTIMEOUT => 15,
		CURLOPT_RETURNTRANSFER => 1,
	);
	
	// initialize a curl object
	$curl = curl_init();
	
	// extend any additional curl options to the default ones
	curl_setopt_array($curl, $opts);
	
	// perform get request & cleanup
	$response = curl_exec($curl);
	curl_close($curl);
	unset($curl);
	
	// parse the document
	$html = substr($response, strpos($response, '<!DOCTYPE'));
	$doc = phpQuery::newDocument($html);
	phpQuery::selectDocument($doc);
	
	// anonymous function: store every hit to the array
	$record = function($elmt) use(&$array) {
		$array[pq($elmt)->val()] = preg_replace('/^(.+) - [A-Z0-9 \\-]{2,16}$/', '\1', pq($elmt)->text());
	};
	
	// fetch all of the course list option values
	pq('select[id$="courseList"]')->find('option')->each($record, new CallbackParam);
	
	// results
	return $array;
}



?>