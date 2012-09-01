<?php

require "database.php";


// establish this structure's namespace
$namespace = "directory.people";

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



// setup configuration for LDAP
$config = array(
	'binddn' => 'uid=intermap,o=UCSB',
	'bindpw' => 'KKVEotpo6H',
	'host'   => 'directory.ucsb.edu',
);

// verbose output
echo 'contacting '.$config['host'].'...'."\n"; flush(); ob_flush();

// open socket to the server
$ds = ldap_connect($config['host']);
if(!$ds) {
	echo "unable to connect to ldap server";
	exit(1);
}

// verbose output
echo 'connecting to LDAP server on: '.$config['host'].'...'."\n";

// attempt to establish connection with LDAP server
$r = ldap_bind($ds,$config['binddn'], $config['bindpw']);
if(!$r) {
	echo 'ldap_bind failed';
	exit(1);
}

// verbose output
echo 'downloading ldap data...'."\n";


// establish interested LDAP fields 
$interested = array(

	'cn',
	'displayname',
	'ucsbmiddlename',
	
	'title',
	'ucsbtitle',
	'ucsbtitle2',
	
	'departmentnumber',
	'ucsbhomedepartment',
	
	'ucsbemptype',
	'ucsbempstatus',
	'ucsbaffiliation',
	
	'ucsbstutype',
	'ucsbsturegstat',
//	'ucsbstuperm',
	
	'ucsbreleasestudent',
	'ucsbreleasestuemail',
	
	'telephonenumber',
	'mail',
	'ucsbemailbusiness1',
	
	'street',
//	'l',
//	'st',
//	'postalcode',
	
	'ucsblastupdate',
);


// hit the ldap server with a query for all people
$r = ldap_search($ds, 'o=UCSB', '(cn=*)', $interested,0,0,75);

// if the query timed out, exit with status code 1
if(!$r) {
	echo 'Aborting download';
	exit(1);
}

// verbose output
echo 'download complete. parsing results....'."\n";

// fetch the results to php array
$info = ldap_get_entries($ds, $r);

// we're done with the ldap server, close the connection
ldap_close($ds);



// prepare the database by dropping the old table
$db->dropTable($table);

// remove the `count` field from the result array
unset($info['count']);

// setup an array to store all the rows
$people = array();


// iterate over the results
foreach($info as &$row) {
	
	// setup temp array for selecting only interested fields
	$arr = array();
	foreach($interested as $k) {
		
		// ignore `count`
		if(!is_array($row[$k])) continue;
		
		// for string results, store the exact string
		if($row[$k]['count'] == '1') {
			$arr[$k] = $row[$k][0];
		}
		
		// for array results, implode the items by delimeter
		else {
			unset($row[$k]['count']);
			$arr[$k] = implode(';',$row[$k]);
		}
	}
	// append the selective row results to an array and free other memory
	$people []= $arr;
	unset($row);
}


// iterate over every record and format appropriate fields
foreach($people as &$row) {
	
	// type
	$affiliations = preg_split('/\\;/', $row['ucsbaffiliation']);
	if(in_array('student', $affiliations)) {
		// skip the record if they have opted out of being found
		if($row['ucsbreleasestudent'] == 'N') {
			unset($row);
			continue;
		}
		switch($row['ucsbstutype']) {
			
			case 'U':
				$row['type'] = 'undergrad student';
				break;
				
			case 'G':
				$row['type'] = 'graduate student';
				break;
				
			default:
				// this person is not important
				unset($row);
				continue;
				break;
		}
	}
	else if(in_array('employee', $affiliations)) {
		// inactive employee
		if($row['ucsbempstatus'] != 'A') {
			unset($row);
			continue;
		}
		switch($row['ucsbemptype']) {
			case '5':
				$row['type'] = 'faculty';
				break;
			case '3':
			case '2':
				$row['type'] = 'staff';
				break;
			default:
				$row['type'] = 'employee';
				break;
		}
	}
	// ignore this person if they are not a student or employee
	else {
		unset($row);
		continue;
	}
	unset($row['ucsbstutype']);
	unset($row['ucsbsturegstat']);
	unset($row['ucsbemptype']);
	unset($row['ucsbempstatus']);
	unset($row['ucsbreleasestudent']);
	
	// affiliation
	$row['affiliation'] = $row['ucsbaffiliation'];
	unset($row['ucsbaffiliation']);
	
	
	// fullName
	$row['fullName'] = $row['cn'];
	unset($row['cn']);
	
	// firstName / lastName
	$names = preg_split('/,/', $row['displayname']);
	switch(count($names)) {
		case 0:
			$row['firstName'] = $names[0];
			break;
		case 1:
			$row['firstName'] = $names[1];
			$row['lastName'] = $names[0];
			break;
		default:
			$row['firstName'] = $names[1].' '.$names[2];
			$row['lastName'] = $names[0];
			break;
	}
	unset($row['displayname']);
	
	// middleName
	$row['middleName'] = $row['ucsbmiddlename'];
	unset($row['ucsbmiddlename']);
	
	
	// departments
	$row['departments'] = $row['departmentnumber'];
	if(empty($row['departments'])) {
		$row['departments'] = $row['ucsbhomedepartment'];
	}
	unset($row['departmentnumber']);
	unset($row['ucsbhomedepartment']);
	
	
	// phone
	$row['phone'] = $row['telephonenumber'];
	unset($row['telephonenumber']);
	
	// email
	$row['email'] = $row['ucsbemailbusiness1'];
	if(empty($row['email'])) {
		$row['email'] = $row['mail'];
	}
		// don't store this person's email address if they opted out
	if($row['ucsbreleasestuemail'] == 'N') {
		$row['email'] = '';
	}
	unset($row['mail']);
	unset($row['ucsbemailstudent']);
	unset($row['ucsbemailbusiness1']);
	unset($row['ucsbreleasestuemail']);	
	
	// location
	$row['location'] = $row['street'];
	unset($row['street']);
	
	
	// title
	if(empty($row['title'])) {
		if(!empty($row['ucsbtitle'])) {
			$row['title'] = ucwords(strtolower($row['ucsbtitle']));
		}
		else {
			$row['title'] = ucwords($row['type']);
		}
	}
	if(!empty($row['ucsbtitle2'])) {
		$row['title'] .= ';'.$row['ucsbtitle2'];
	}
	unset($row['ucsbtitle']);
	unset($row['ucsbtitle1']);
	unset($row['ucsbtitle2']);
	
	
	// lastUpdated
	$row['lastUpdated'] = $row['ucsblastupdate'];
	unset($row['ucsblastupdate']);
	
	
	
	// commit this row to the database
	$attempt = $db->insert($row);
	
	// something goes wrong...
	if(!$attempt) {
		echo $db->error('problem inserting to database');
		exit(1);
	}
}


// verbose output
echo 'writing results to disk...'."\n";

// save the contents to the disk for future reference
file_put_contents('ldap-person.txt', print_r($info, true));

// verbose output
echo 'done'."\n";

?>