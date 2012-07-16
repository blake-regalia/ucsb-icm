<?php


// IMPORTANT SECURITY TEST: single quotes not properly escaped

require "database.php";

$query = $_GET['q'];

$databases = MySQL_Pointer::getDatabasesAsKeys();

$query = preg_replace('/:/', ';', $query);


if(preg_match('/^([a-z_]+(?:\\.[a-z_]+)*)(?:([#@])(.+))?$/', $query, $uri)) {
	
	// if this query has already been computed, return the file
	if(file_exists($query.'.json')) {
		json_headers();
		readfile($query.'.json');
		exit;
	}
	
	$namespace_str = $uri[1];
	$operator = $uri[2];
	$format_str = $uri[3];
	
	$names = preg_split('/\./', $namespace_str);
	
	// prepare to search the namespace
	$space_index = 0;
	$names_len = sizeof($names);
	
	$db = false;
	
	// find a matching database name if one exists
	$db_name = $names[0];
	while($space_index < $names_len) {
		if($databases[$db_name] == 1) {
			$db = new MySQL_Pointer($db_name);
			break;
		}
		$db_name .= '.'.$names[++$space_index];
	}
	
	// if a database was found
	if($db !== false) {
		$table_name = implode('.', array_slice($names, $space_index+1));
		
		// if the table exists
		if($db->tableExists($table_name)) {
			
			// use it for consequent operations
			$db->selectTable($table_name);
			
				
			// string concatenation of values
			if(preg_match('/^\\(([^\\)]+)\\)(?:(=|like |regexp )(.+))?$/', $format_str, $format_inner)) {
				
				$format_f            = $format_inner[1];
				$format_opt_operator = strtoUpper($format_inner[2]);
				$format_opt_value    = $format_inner[3];
				
				// check that the format follows conventions
				$format = array('');
				$format_len = strlen($format_f);
				$f = 0;
				for($i=0; $i<$format_len; $i++) {
					$chr = $format_f[$i];
					if($chr === '`') {
						$format[++$f] = '';
					}
					else {
						$format[$f] .= $chr;
					}
				}
				
				// check all the columns exist
				$format_size = sizeof($format);
				for($index=1; $index<$format_size; $index+=2) {
					$column_name = $format[$index];
					if(!$db->columnExists($column_name)) {
						echo '{"error":"No such column: `'.$column_name.'`"}';
						exit;
					}
				}
				
				switch($operator) {
					
					case '@':
					
						$records = $db->selectConcat($format, $format_opt_operator, $format_opt_value);
						break;
						
				
					case '#':
						
						// TODO: use buffering and MySQL "LIMIT" to process N rows at a time
						$directory = $db->fetchAssoc();
						
						$records = array();
						
						// construct the strings
						foreach($directory as $row) {
							$build = '';
							foreach($format as $index => $str) {
								if($index%2 === 0) {
									$build .= $str;
								}
								else {
									$build .= $row[$str];
								}
							}
							$records[] = $build;
						}
						break;
					
				}
					
				// generate json for the results
				$json = json_encode($records);
				
				// save the query to a file
				file_put_contents($query.'.json', $json);
				
				// output json to client
				json_headers();
				echo $json;	
			}
			
			// 
			else if(preg_match('/^\\[([^\\]]+)\\]$/', $format_str, $format_inner)) {
				
				if(preg_match_all("/`([^`]+)`='([^']+)',?/", $format_inner[1], $arg_param, PREG_SET_ORDER)) {
					
					$select = array();
					
					foreach($arg_param as $arg) {
						$select[$arg[1]] = $arg[2];
					}
					
					$row = $db->fetchAssoc($select);
					
					$json = json_encode($row);
					
					// save the query to a file
					file_put_contents($query.'.json', $json);
					
					json_headers();
					echo $json;
				}
			}
			
			else if(preg_match('/^\\{([^\\}]+)\\}$/', $format_str, $format_inner)) {
				if(preg_match('/^`([^`]+)`(?:(;|=>)`([^`]+)`)?$/', $format_inner[1], $arg_param)) {
					
					list(,$key,$operator,$value) = $arg_param;
					
					$json = '{}';
					
					switch($operator) {
						
						case ';':
							$records = $db->fetchAssocSelect(
								array($key, $value)
							);
							
							$unique = array();
							foreach($records as $row) {
								$unique[$row[$key]] = $row[$value];
							}
							
							$json = json_encode($unique);
							break;
							
						default:
							$records = $db->fetchAssocSelect(
								array($key)
							);
							
							$json = json_encode($records);
							break;
					}
					
					if($json != '{}') {
						// save the query to a file
						//file_put_contents($query.'.json', $json);
					}
					
					json_headers();
					echo $json;
					
					exit;
					
				}
			}
			
			exit;
		}
		else {
			echo '{"error":"No such table: `'.$table_name.'`"}';
			exit;
		}
		
	}
	else {
		echo '{"error":"No database was found in: `'.$db_name.'`"}';
		exit;
	}
	exit;
	
}
else {
	header("HTTP/1.0 404 Not Found");
	die('<h2>404</h2>File Not Found.');
	exit;
}

function json_headers() {
	header('Cache-Control: no-cache, must-revalidate');
	header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
	header('Content-type: application/json');
}

?>