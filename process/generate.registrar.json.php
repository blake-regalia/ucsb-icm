<?php

require "../database.php";

$SEPARATOR = ' - ';

$name = $_GET['k'];
$value = isset($_GET['v'])? $_GET['v']: false;


switch($name) {
	case 'registrar.undergrad.lectures':
		$database = 'registrar';
		$table    = 'spring-2012-ugrad';
		$query    = "`primaryTitle` != '' ORDER BY `courseTitle` DESC";
		
		if($value) {
			$courseTitle = substr($value, 0, strpos($value,$SEPARATOR));
			$db = new MySQL_Pointer($database);
			$db->selectTable($table);
			$lecture = $db->fetchRowWhere("`courseTitle` = '".$courseTitle."' AND `primaryTitle` != ''");
			echo json_encode($lecture);
			exit;
		}
		break;
	case 'undergrad.sections':
		$database = 'registrar';
		$table    = 'spring-2012-ugrad';
		break;
	case 'graduate.courses':
		$database = 'registrar';
		$table    = 'spring-2012-grad';
		break;
	default:
		$filename = $name.'.json';
		if(is_file($filename)) {
			readfile($filename);
			exit;
		}
		else {
			header("HTTP/1.0 404 Not Found");
			echo $name.' is neither a json file nor service query';
			exit;
		}
		break;
}

$db = new MySQL_Pointer($database);
$db->selectTable($table);

$json = array();
$results = $db->fetchAssocWhere($query);
foreach($results as $class) {
	$json[] = $class['courseTitle'].$SEPARATOR.$class['fullTitle'];
}

header('Content-type: application/json');
echo json_encode($json);
exit;


?>