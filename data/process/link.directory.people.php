<?php

require "../database.php";

// initialize the object to connect to a database
$rgdb = new MySQL_Pointer('ucsb');

// select a table for subsequent commands to be executed on
$rgdb->selectTable('registrar');

// fetch all the records as a large array
$courses = $rgdb->fetchAssoc();

// prepare an array to store the instructor's name as a key
$instructor = array();

// load the array with only distinct values of `instructor` field
foreach($courses as $row) {
	$instructor[$row['instructor']] = $row;
}


$ddb = new MySQL_Pointer('source.autoupdate');

// select a table for subsequent commands to be executed on
$ddb->selectTable('directory.people');

// fetch all the records as a large array
$people = $ddb->fetchAssoc();


$ddb->selectTable('directory.department');
$resolved = 0;


$teaches = array();

// for every distinct instructor name, attempt to identify the people
foreach($instructor as $abrv => $course) {
	
	// split the string up to get last name(s) and first initial(s)
	preg_match_all('/ *(\w{2,}) +(\w)(?: +(\w))? */', $abrv, $instructorNames, PREG_SET_ORDER);
	
	// prepare an array to hold a list of candidate people
	$candidateSet = array();
	
	// iterate over every record in the people table
	foreach($people as $row) {
		
		// reference the interested values
		$lastName = $row['lastName'];
		$firstName = $row['firstName'];
		
		// for every instructor of the class
		foreach($instructorNames as $instructorIndex => $set) {
			
			// reference the interested matches
			list(,$lastNameAbrv) = $set;
			
			// compare the instructor to the directory record...
			// if the abbreviation is a substring of the record's `lastName` field
			if(strtoupper($lastName) == $lastNameAbrv) {
			// if(strtoupper(substr($lastName, 0, strlen($lastNameAbrv))) == $lastNameAbrv) {
				
				// add this record to a list of candidates
				if(!is_array($candidateSet[$instructorIndex])) {
					$candidateSet[$instructorIndex] = array();
				}
				$candidateSet[$instructorIndex][] = $row;
			}
		}
	}
	
	$instructorsResolved = array();
	
	foreach($candidateSet as $instructorIndex => $candidates) {
		
		// reference the interested matches
		list(,$lastNameAbrv,$firstInitial,$middleInitial) = $instructorNames[$instructorIndex];
		
		echo $abrv.' => {'.sizeof($candidates).'}';
		// check the candidates for the instructor set
		$candidateSize = sizeof($candidates);
		
		// if there were no conflicts with the last name
		if($candidateSize == 1) {
			$person = $candidates[0];
			echo $person['lastName'].', '.$person['firstName'];
			$instructorsResolved[] = $person;
			$resolved += 1;
		}
		
		// else there are last name conflicts
		else if($candidateSize > 1) {
			
			// attempt to perform better matching
			$betterMatches = array();
			$okayMatches = array();
			$otherFaculty = false;
			
			foreach($candidates as $row) {
				if($firstInitial == $row['firstName'][0]) {
					$betterMatches[] = $row;
				}
				else if($middleInitial == $row['firstName'][0]) {
					$okayMatches[] = $row;
				}
				if($row['role'] == 'faculty') {
					$otherFaculty = true;
				}
			}
			
			if(sizeof($betterMatches) == 0) {
				if(sizeof($okayMatches) == 1) {
					$person = $okayMatches[0];
					echo '****'.$person['lastName'].', '.$person['firstName'].';';
					$instructorsResolved[] = $person;
					$resolved += 1;
				}
				else if(sizeof($okayMatches) > 1) {
					echo '*****COULD NOT RESOLVE OKAY MATCHES*****';
					print_r($okayMatches);
				}
				else {
					echo '*****COULD NOT RESOLVE ANY MATCHES*****';
				}
			}
			else if(sizeof($betterMatches) == 1) {
				$candidate = $betterMatches[0];
				
				if($candidate['role'] == 'faculty') {
					echo '*'.$candidate['lastName'].', '.$candidate['firstName'].';';
					$instructorsResolved[] = $candidate;
					$resolved += 1;
				}
				else {
					if(false && $otherFaculty) {
						echo '******COULD NOT RESOLVE CANDIDATES*****';
						print_r($candidates);
					}
					else {
						echo '**'.$candidate['lastName'].', '.$candidate['firstName'].';';
						$instructorsResolved[] = $candidate;
						$resolved += 1;
					}
				}
			}
			else {
				$before = $betterMatches;
				foreach($betterMatches as $key => $row) {
					if($row['role'] != 'faculty') {
						unset($betterMatches[$key]);
					}
				}
				
				if(sizeof($betterMatches) == 1) {
					$person = $betterMatches[0];
					echo '***'.$person['lastName'].', '.$person['firstName'].';';
					$instructorsResolved[] = $person;
					$resolved += 1;
				}
				else {
					$deptName = strtoupper($course['department']);
					$dept = $ddb->fetchAssoc(
						array('abrv'=>$deptName)
					);
					
					if(sizeof($dept)==1) {
						$solved = false;
						foreach($before as $person) {
							$dpn = $dept[0]['departmentName'];
							if(preg_match('/'.$dpn.'/', $person['department'])
								|| $deptName=='FLMST' && $person['department'] == 'Film and Media Studies'
								|| $deptName=='MCDB' && $person['department'] == 'Molecular, Cellular & Developmental Biology') {
							//if($dept[0]['departmentName'] == $person['department']) {
								echo '***'.$person['lastName'].', '.$person['firstName'].';';
								$instructorsResolved[] = $person;
								$resolved += 1;
								$solved = true;
							}
						}
						if(!$solved) {
							echo '******COULD NOT RESOLVE BETTER MATCHES*****';
							echo $deptName;
							print_r($dept);
							print_r($before);
						}
					}
					else {
						echo '******COULD NOT RESOLVE BETTER MATCHES*****';
						echo $deptName;
						print_r($dept);
						print_r($before);
					}
				}
			}
		}
		else {
			echo '*****NO INSTRUCTOR FOUND*****';
		}
		echo "\n";
	}
	
	$plode = array();
	foreach($instructorsResolved as $inst) {
		$properName = $inst['lastName'].','.$inst['firstName'];
		if(!isset($teaches[$properName])) {
			$teaches[$properName] = array();
		}
		$teaches[$properName] []= $course['courseTitle'];
		
		$plode []= $inst['firstName'].' '.$inst['lastName'];
	}
	
	$rgdb->update(
		array(
			'instructor' => $abrv,
		),
		array(
			'people' => implode(';',$plode)
		)
	);
}

echo "\n\n\n";
echo (($resolved / sizeof($instructor))*100).'% resolved';


$ddb->selectTable('directory.people');

foreach($teaches as $teacher => $courseArray) {
	$courses = implode(';', $courseArray);
	
	$name = preg_split('/,/',$teacher);
	
	print_r($name);
	echo ' => '.$courses;
	echo "\n\n";
	
	
	$ddb->update(
		array(
			'lastName' => $name[0],
			'firstName' => $name[1],
		),
		array(
			'instructs' => $courses,
		)
	);
}




$base_table = 'registrar';
$base_table_lecture = 'registrar.lecture';
$base_table_section = 'registrar.section';

$cmds = array(

	// split tables by field "courseType"
	'php table.split.php "'.$base_table.'" "courseType"',
	
	// split lecture table by field "courseLevel"
	'php table.split.php "'.$base_table_lecture.'" "courseLevel"',
);

foreach($cmds as $cmdStr) {
	attempt($cmdStr);
}

function attempt($cmd) {
	echo "\n".'$ '.$cmd."\n";
	exec($cmd, $out, $err);
	echo implode("\n",$out);
	if($err) {
		echo "\n";
		exit(1);
	}
}

?>