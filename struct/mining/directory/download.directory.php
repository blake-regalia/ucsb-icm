<?php

require "../../process/database.php";
require "phpQuery.php";


$AUTOUPDATE_DATABASE = "source.autoupdate";
$ORIGIN_DATABASE     = "source.origin";

$alias_table = "directory.department-aliases";

$department_source_db    = $ORIGIN_DATABASE;
$department_source_table = "directory.department";

$department_table        = "directory.department";
$people_table            = "directory.people";


// global references to a serially altered variables
$serial_subgroup = false;
$misfit_names = array();


// default curl opts
$curlOpts = array(
	CURLOPT_CONNECTTIMEOUT => 15,
	CURLOPT_RETURNTRANSFER => 1,
);



/** people database **/
$pdb = new MySQL_Pointer($AUTOUPDATE_DATABASE);

$pdb->dropTable($people_table);

//$pdb->execute('structure.create.directory.people.sql');
$pdb->createTable($people_table, array(
	'lastName'       => 'varchar(255) NOT NULL',
	'firstName'      => 'varchar(255) NOT NULL',
	'department'     => 'varchar(255)',
	'branch'         => 'varchar(255)',
	'role'           => 'varchar(255)',
	'title'          => 'varchar(255)',
	'abrv'           => 'varchar(255)',
	'email'          => 'varchar(255)',
	'phone'          => 'varchar(255)',
	'location'       => 'varchar(255)',
	'website'        => 'varchar(255)',
	'mailcode'       => 'varchar(255)',
	'photo'          => 'varchar(255)',
	'instructs'       => 'varchar(255)',
	'mined'          => 'varchar(64)',
), 'INDEX `name` (`lastName`, `firstName`)');

$pdb->selectTable($people_table);



/** department database **/
$ddb = new MySQL_Pointer($AUTOUPDATE_DATABASE);

$ddb->dropTable($department_table);

if(!$ddb->createTableLike($department_source_db, $department_source_table, $department_table)) {
	$ddb->error('ERROR: failed to copy table structure');
}

$ddb->selectTable($department_table);
if(!$ddb->cloneFrom($department_source_db, $department_source_table)) {
	$ddb->error('ERROR: failed to insert data from source table to destination table.');
	exit(1);
}



/** department-alias database **/
$alias = new MySQL_Pointer($ORIGIN_DATABASE);
$alias->selectTable($alias_table);

$aliases = $alias->fetchAssoc();


/*
$ddb->dropTable($department_table);

$ddb->createTable($department_table, array(
	'departmentName'    => 'varchar(255) NOT NULL',
	'building'          => 'varchar(255)',
	'location'          => 'varchar(255)',
	'category'          => 'varchar(255)',
	'description'       => 'varchar(255)',
	'website'           => 'varchar(255)',
	'abrv'              => 'varchar(255)',
));

$ddb->selectTable($department_table);
*/


// iterate through the comm serv list
download_department_list();

foreach($misfit_names as $misfit) {
	find_person($misfit);
}


// for every entry in the list, search the department finder for the department name
function download_department_list() {
	global $curlOpts;
	
	// initialize a curl object
	$handle = curl_init();
	
	// url for people finder
	$dptUrl = "http://www.commserv.ucsb.edu/directories/departments/bluepages_deptlist.asp";
	
	
	// extend any additional curl options to the default ones
	$opts = $curlOpts + array(
		CURLOPT_URL => $dptUrl,
	);
	curl_setopt_array($handle, $opts);
	
	// perform get request
	$response = curl_exec($handle);
	
	// handle the response
	handle_department_list($response);
	
	curl_close($handle);
}

function handle_department_list($str) {
	// parse the document
	$doc = phpQuery::newDocument($str);
	phpQuery::selectDocument($doc);
	
	$links = pq('a.text_plain');
	$links->each('investigateDepartment', new CallbackParam);
}

function investigateDepartment($elem) {
	global $curlOpts;
	
	$url = "http://www.commserv.ucsb.edu/directories/departments/".pq($elem)->attr('href');
	
	// initialize a curl object
	$handle = curl_init();
	
	// extend any additional curl options to the default ones
	$opts = $curlOpts + array(
		CURLOPT_URL => $url,
	);
	curl_setopt_array($handle, $opts);
	
	// perform get request
	$response = curl_exec($handle);
	
	// reference the department name
	$department = pq($elem)->text();
	
	// attempt to search for people within that department via directory service
	download_people($department);
	
	// handle the response
	handle_department_page($response, $department);
	
	curl_close($handle);
}

function handle_department_page($str, $dept) {
	global $serial_subgroup;
	
	// parse the document
	$str = preg_replace('/&nbsp;/','',$str);
	$doc = phpQuery::newDocument($str);
	phpQuery::selectDocument($doc);
	
	echo $dept."\n";
	
	$serial_subgroup = $dept;
	$serial_index = 0;
	
	$fullTitle = pq('td.text:first-child')->slice(1)->each('handle_department_page_row', new CallbackParam, $dept);
}

function handle_department_page_row($row, $dept) {
	global $pdb, $ddb, $serial_subgroup, $serial_index, $misfit_names, $aliases;
	
	$dom = pq($row);
	
	// if we come across a header
	$rowIsHeader = $dom->filter(':has(b)')->length;
	if($rowIsHeader) {
		echo "   ==".$dom->text()."==\n";
		
		// remember that this is now a group
		$serial_subgroup = $dom->text();
		$serial_index = 0;
		
		// update the child to be a group
		$select = array(
			'departmentName' => $serial_subgroup
		);
		if($ddb->fetchSize($select) == 0) {
			$ddb->insert($select);
		}
		$ddb->update($select, array(
			'category' => 'group'
		));
		
		return;
	}
	
	
	// reference the text in the node
	$phrase = $dom->text();
	
	// if this is the first row after a header
	if($serial_index == 0) {
		// and the row text is a location
		if(preg_match('/^ *(\d+\w*) +([\w ]+) *$/', $phrase, $matchLoc)) {
			
			$select = array(
				'departmentName' => $serial_subgroup
			);
			if($ddb->fetchSize($select) == 0) {
				$ddb->insert($select);
			}
			$ddb->update($select, array(
				'location' => $matchLoc[1].' '.$matchLoc[2],
			));
		}
	}
	$serial_index += 1;
	
	// person's name
	if(preg_match('/^ *(.+), +(.+)$/', $phrase, $matchStr)) {
		$title = $matchStr[1];
		$fullName = $matchStr[2];
		if(preg_match('/^([A-Z].*) ([A-Z].*)(?: \(.*\))?$/', $fullName, $matchName)) {
			
			// verbose printing
			echo "\t".$fullName;
			
			$contact = array(
				'firstName' => $matchName[1],
				'lastName' => $matchName[2],
			);
			
			// if that person was found in said department..
			if($pdb->fetchSize($contact) != 0) {
				$update = array(
					'title' => $title,
					'branch' => $serial_subgroup,
					'mined' => 'commserv',
				);
				$pdb->update($contact, $update);
				echo "\t\t*";
			}
			else {
				$misfit_names[]= $fullName;
			}
			
			echo "\n";
		}
	}
	
	else if(preg_match('/^ *Web *$/', $phrase)) {
		
		/***
		$resolve = $serial_subgroup;
	
		foreach($aliases as $row) {
			if($row['alias'] == $serial_subgroup) {
				
			}
		}
		/****/
		
		$select = array(
			'departmentName' => $serial_subgroup
		);
		
		if($ddb->fetchSize($select) == 0) {
			$ddb->insert($select);
		}
		
		$ddb->update($select, array(
			'website' => $dom->next()->text(),
		));
	}
	
	// location
	else if(preg_match('/^(?:(\d+\w*) (.+)|(\w+) (\d+\w*))$/', $phrase, $matchStr)) {
		// maybe location
	}
	
}

/** people finder **/
function download_people($dept) {
	global $curlOpts;
	
	// initialize a curl object
	$handle = curl_init();
	
	// url for people finder
	$pplUrl = "http://www.identity.ucsb.edu/people_finder/";
	
	// setup the post field data
	$postFieldsArray = array(
		'rs'    => 'submit_search',
		'rst'   => '',
		'rsrnd' => time().'000',
		'rsargs' => array('dept', $dept),
	);
	
	// encode the post fields as a url component
	$postFieldsString = encodePostField($postFieldsArray);
	
	// extend any additional curl options to the default ones
	$opts = $curlOpts + array(
		CURLOPT_URL => $pplUrl,
		CURLOPT_POST   => 1,
		CURLOPT_POSTFIELDS => $postFieldsString,
	);
	curl_setopt_array($handle, $opts);
	
	// verbose printing
	echo $dept.':';
	
	// perform post request
	$response = curl_exec($handle);
	
	// handle the response
	handle_people($response);
	
	curl_close($handle);
}


/** people finder **/
function find_person($fullName) {
	global $curlOpts;
	
	// initialize a curl object
	$handle = curl_init();
	
	// url for people finder
	$pplUrl = "http://www.identity.ucsb.edu/people_finder/";
	
	// setup the post field data
	$postFieldsArray = array(
		'rs'    => 'submit_search',
		'rst'   => '',
		'rsrnd' => time().'000',
		'rsargs' => array('person', $fullName),
	);
	
	// encode the post fields as a url component
	$postFieldsString = encodePostField($postFieldsArray);
	
	// extend any additional curl options to the default ones
	$opts = $curlOpts + array(
		CURLOPT_URL => $pplUrl,
		CURLOPT_POST   => 1,
		CURLOPT_POSTFIELDS => $postFieldsString,
	);
	curl_setopt_array($handle, $opts);
	
	// verbose printing
	echo $fullName.':';
	
	// perform post request
	$response = curl_exec($handle);
	
	// handle the response
	handle_people($response, $fullName);
	
	curl_close($handle);
}


function handle_people($str, $singlePerson=false) {
	global $pdb;
	
	if(strpos($str, '{') === FALSE) {
		echo "0\n";
		return;
	}
	
	$count = 0;
	
	// format the string so it can be decoded
	if(preg_match("/^\\+:var res = ' *(\d+)/", $str, $match)) {
		$count = (int) ($match[1]);
	}
	$str = substr($str, strpos($str,'{'));
	$str = substr($str, 0, strrpos($str,'}')+1);
	$str = preg_replace('/\\\\"/','"',$str);
	$str = preg_replace("/\\\\'/","'",$str);
	
	// decode the string with JSON
	$decode = json_decode($str, true);
	
	if($decode == null) {
		echo 'error parsing string: '.$str."\n";
		return;
	}
	
	if($singlePerson) {
		$decode = array($decode);
	}
	
	// iterate over the department groups
	foreach($decode as $dept => $array) {
		
		// verbose printing
		if(!$singlePerson) {
			echo sizeof($array).';'."\n";
		}
		
		// for every person in that department/group
		foreach($array as $person) {
			
			// only accept single person if the name matches
			if($singlePerson) {
				// only accept exact matches
				if($count != 1 && $person['name'] != $singlePerson) {
					continue;
				}
				// if there is only one match, it might be a nickname so don't require exact matching
				else {
					echo "1\n";
				}
			}
			
			// get their first/last name
			if(preg_match('/^([^,]+), (.+)$/', $person['lname'], $match)) {
				
				// initialize their info
				$contact = array(
					'lastName' => $match[1],
					'firstName' => $match[2],
				);
				
				// if the contact doesn't exist yet in the table
				if($pdb->fetchSize($contact) == 0) {
					
					// insert a new record
					$pdb->insert($contact);
				}
				
				// update the record
				$pdb->update($contact, array(
					'department' => $person['ldept'],
					'title'      => $person['ltitle'],
					'phone'      => $person['lphone'],
					'email'      => $person['lemail'],
					'location'   => $person['street1'],
					'website'    => $person['url'],
					'mailcode'   => $person['mailcode'],
					'mined'      => 'peoplefinder',
				));
				
			}
			else {
				echo 'WARNING: could not parse name "'.$person['lname'].'".'."\n";
			}
		}
	}
}


function encodePostField($postFieldsArray) {
	$postFieldsArrayEncoded = array();
	foreach($postFieldsArray as $key => $value) {
		if(is_array($value)) {
			foreach($value as $val) {
				$postFieldsArrayEncoded[] = urlencode($key).'[]='.urlencode($val);
			}
		}
		else {
			$postFieldsArrayEncoded[] = urlencode($key).'='.urlencode($value);
		}
	}
	return implode('&', $postFieldsArrayEncoded);
}


class MySQL_DistinctRowController {
	
	private $mDB = false;
	private $mFields = array();
	
	function __construct($db, $fields) {
		$this->mDB = $db;
		$this->mFields = $fields;
	}
	
	function summon() {
		
		// make sure correct number of arguments is present
		if($this->mFields != func_num_args()) {
			die('ERROR: incorrect # arguments to call summon');
		}
		
		// build the array to perform database selects
		$select = array();
		foreach($this->mFields as $index => $field) {
			$select[$field] = func_get_arg($index);
		}
		
		// if the record does not exist in the table
		if($this->mDB->fetchSize($select) == 0) {
			// insert it as a new row into the table
			$this->mDB->insert($select);
		}
		
		return $this->mDB;
	}
}


?>
