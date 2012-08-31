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
$namespace = "directory.departments";

$trim_ws = array(
	'/^\s*/' => '',
	'/\s*$/' => '',
);

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


// download directory from the catalog site
$directory = download_catalog_department_directory();

// keep track of how many records get inserted
$total = 0;
$inserted = 0;

// iterate over directory items
foreach($directory as $url => $title) {
	
	// right trim whitespace
	$title = preg_replace('/\s+$/', '', $title);
	
	// download and interpret relevant directory information from directory's department webpage
	$info = download_catalog_department_directory_info($url);
	
	// insert the department-name into the array
	$info['departmentName'] = $title;
	
	// attempt to insert this row into the databse
	$res = $db->insert($info);
	
	// keep track of how many records get inserted
	if($res) $inserted += 1;
	$total += 1;
}

// verbose output
echo $inserted.' inserted / '.$total.' total'."\n";

// done
echo "\n";
exit;



function download_catalog_department_directory() {
	
	// store all the department options
	$array = array();
	
	// setup curl params
	$url = "http://my.sa.ucsb.edu/Catalog/Current/CollegesDepartments/AcademicDepartmentDirectory.aspx";
	
	$opts = array(
		CURLOPT_URL => $url,
		CURLOPT_CONNECTTIMEOUT => 15,
		CURLOPT_RETURNTRANSFER => 1,
	);
	
	// initialize a curl object
	$curl = curl_init();
	
	// extend any additional curl options to the default ones
	curl_setopt_array($curl, $opts);
	
	// perform get request
	$response = curl_exec($curl);
	curl_close($curl);
	unset($curl);
	
	$html = substr($response, strpos($response, '<!DOCTYPE'));
	
	// parse the document
	$doc = phpQuery::newDocument($html);
	phpQuery::selectDocument($doc);
	
	// store every department option
	$record = function($elmt) use(&$array) {
		$href = preg_replace('/^[.]{2}\\/[^\\/]+\\/([^\\/]+\\/.*)$/', '\1', pq($elmt)->attr('href'));
		$array[$href] = pq($elmt)->text();
	};
	
	// fetch all 
	pq('#content div>ul')->eq(0)->find('a')->each($record, new CallbackParam);
	
	return $array;
}



function download_catalog_department_directory_info($dptUrl) {
	
	global $trim_ws;
	
	// store relevant information
	$array = array();
	
	// interpret college from url
	if(!preg_match('/^([^\\/]+)\\//', $dptUrl, $match)) {
		return array(
			'not_department' => 1,
		);
	}
	$array['college'] = $match[1];
	
	// setup curl params
	$url = "http://my.sa.ucsb.edu/Catalog/Current/CollegesDepartments";
	$url .= "/".$dptUrl;
	
	$opts = array(
		CURLOPT_URL => $url,
		CURLOPT_CONNECTTIMEOUT => 15,
		CURLOPT_RETURNTRANSFER => 1,
	);
	
	// initialize a curl object
	$curl = curl_init();
	
	// extend any additional curl options to the default ones
	curl_setopt_array($curl, $opts);
	
	// perform get request
	$response = curl_exec($curl);
	curl_close($curl);
	unset($curl);
	
	$html = substr($response, strpos($response, '<!DOCTYPE'));
	
	// parse the document
	$doc = phpQuery::newDocument($html);
	phpQuery::selectDocument($doc);
	
	// fetch paragraph string
	if(pq('#content div>strong>p')->length() != 0) {
		$p = pq('#content div>strong>p')->eq(0)->text();
	}
	// work with inconsistent format
	else {
		$p = pq('#content div>p>strong')->eq(0)->text();
	}
	
	$lines = preg_split('/\n/', $p);
	
	// line number
	$i = 0;
	$msi = false; // more specific information
	$mpl = ''; // most probable location
	
	foreach($lines as $line) {
		
		// eg: Department of Anthropology, South Hall 3631
		if($i == 0) {
			if(preg_match('/^([^,]+)(?:,\s+(.*))?$/', $line, $m)) {
				$array['departmentName'] = $m[1];
				if(strlen($m[2])) {
					$array['location'] = $m[2];
				}
			}
		}
		
		// eg: Telephone: (805) 893-2257
		else if(preg_match('/^(?:tele)?phone:?\s*(.+)\s*$/i', $line, $m)) {
			$array['phone'] = $m[1];
			$msi = true;
		}
		
		// eg: Website: www.anth.ucsb.edu
		else if(preg_match('/^(?:website):?\s*([^ ]+).*/i', $line, $m)) {
			$array['website'] = $m[1];
			$msi = true;
		}
		
		// eg: Department Chair: Stuart Tyson Smith
		else if(preg_match('/^(department|program|vice|associate|)[ \-]?chairs?:\s*(.+)\s*$/i', $line, $m)) {
			$key = strlen($m[1])? strtolower($m[1]).'Chair': 'chair';
			$array[$key] = $m[2];
			$msi = true;
		}
		
		// eg: Program Director: Dick Head
		else if(preg_match('/^(?:program|executive|associate|)[ \-]?directors?:?\s*(.*)$/i', $line, $m)) {
			if(!$array['director']) $array['director'] = $m[1];
			$msi = true;
		}
		
		//
		else if(preg_match('/e\\-?mail/i', $line)) {
			//dont care
			$msi = true;
		}
		
		// if more specific information hasn't been found yet...
		else if($msi == false) {
			$mpl = $line;
		}
		
		// eg: Ellison Hall, Room 2830
		else if(preg_match('/([^,]*),\s*room\s+([0-9][0-9a-z_\\-]*)/', $line, $m)) {
			if(!$array['location']) {
				$array['location'] = $m[1].' '.$m[2];
			}
			$msi = true;
		}
		
		else {
			// ignore
		}
		
		// increment line number
		$i += 1;
	}
	
	if(!$array['location'] && strlen($mpl)) {
		$array['location'] = preg_replace(array_keys($trim_ws),array_values($trim_ws),$mpl);
	}
	
	// results
	return $array;
}


?>