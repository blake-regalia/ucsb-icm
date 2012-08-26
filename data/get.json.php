<?php


// IMPORTANT SECURITY TEST: single quotes not properly escaped

require "database.php";
require "sql-shorthand.php";

$db_name = $_GET['d'];
$query   = $_GET['q'];
$format  = $_GET['f'];
$bang    = $_GET['b'];

$databases = MySQL_Pointer::getDatabasesAsKeys();

$do_not_cache = ($bang === '!');
$query = preg_replace('/:/',';', $query);
$query = preg_replace('/</',',', $query);
$query = preg_replace('/>/','.', $query);


// if this query has already been cached, return the file
if(!$do_not_cache && file_exists($db_name.'/'.$query.'.json')) {
	json_headers();
	readfile($db_name.'/'.$query.'.json');
	exit;
}


if(preg_match('/^([a-z_-][a-z_-]*(?:\\.[a-z_-][a-z_-]*)*)(.*)$/i', $query, $uri)) {
	
	$table_name = $uri[1];
	$query_str  = $uri[2];
	
	$db = new MySQL_Pointer($db_name);
	
	// if a database was found
	if($db !== false) {
	
		// if the database isn't a directory yet
		if(!is_dir($db_name)) {
			@mkdir($db_name);
		}
		
		// if the table exists
		if($db->tableExists($table_name)) {
			
			// use it for consequent operations
			$db->selectTable($table_name);
			
			$json = array();
			$items = array();
			
			$ss = new sql_shorthand($query_str);
			if($ss->failed()) {
				if($format == 'json') {
					$json['error'] = $ss->error();
					die_json_encode($json);
				}
				else {
					die_monospace(preg_replace('/\n/',"<br/>\n",$ss->error()));
				}
			}
			else {
				$sql_part = $ss->sql();
				
				if($format == 'sql') {
					die("SELECT ".$sql_part['select']." FROM `<table>` ".$sql_part['how']);
				}
				
				$result = $db->execAssoc($sql_part['select'],$sql_part['how']);
				
				if($format == 'html') {
					$str = "sql: ".$result['sql']."\n\n";
					$str .= "result: ".print_r($result['data'],true);
					die_monospace($str);
				}
				
				$json['sql'] = $result['sql'];
				$json['data'] = $result['data'];
				$json['path'] = $db_name.'/'.$query.'.json';
				
				if(strlen($sql_part['array'])) {
					$repstr = $sql_part['array'];
					
					if($sql_part['distinct']) {
						foreach($json['data'] as $index => $row) {
							$tmpstr = $repstr;
							foreach($row as $key => $value) {
								$tmpstr = preg_replace('/`'.$key.'`/',$value,$tmpstr);
							}
							$data[$tmpstr] = true;
						}
						$json['data'] = array();
						foreach($data as $key => $true) {
							$json['data'] []= $key;
						}
					}
					else {
						foreach($json['data'] as $index => $row) {
							$tmpstr = $repstr;
							foreach($row as $key => $value) {
								$tmpstr = preg_replace('/`'.$key.'`/',$value,$tmpstr);
							}
							$json['data'][$index] = $tmpstr;
						}
					}
				}
				
				if(strlen($sql_part['json'])) {
					$fields = preg_split('/;/',$sql_part['json'], 2);
					$data = array();
					
					$column = substr($fields[0],1,-1);
					
					if(preg_match('/^`([^`]+)`$/', $fields[1], $word)) {
						foreach($json['data'] as $row) {
							$rac = $row[$column];
							$raw = $row[$word[1]];
							$data[$rac] = $raw;
						}
					}
					else if(preg_match('/^\{`([^`]+)`;`([^`]+)`\}$/', $fields[1], $word)) {
						foreach($json['data'] as $row) {
							$rac = $row[$column];
							$raw = $row[$word[1]];
							if(!is_array($data[$rac])) $data[$rac] = array();
							$data[$rac][$raw] = $row[$word[2]];
						}
					}
					else if(preg_match('/^\[(~?`[^`]+`(?:,~?`[^`]+`)*)\]$/', $fields[1], $word)) {
						$objs = preg_split('/,/',$word[1]);
						foreach($json['data'] as $row) {
							$rac = $row[$column];
							$data[$rac] = array();
							foreach($objs as $cname) {
								if($cname[0] == '~') {
									$data[$rac] []= floatval($row[substr($cname,2,-1)]);
								}
								else {
									$data[$rac] []= $row[substr($cname,1,-1)];
								}
							}
						}
					}
					else if(preg_match('/^\{`([^`]+)`;\[(~?`[^`]+`(?:,~?`[^`]+`)*)\]\}$/', $fields[1], $word)) {
						$objs = preg_split('/,/',$word[2]);
						foreach($json['data'] as $row) {
							$rac = $row[$column];
							$raw = $row[$word[1]];
							if(!is_array($data[$rac])) $data[$rac] = array();
							
							foreach($objs as $cname) {
								if($cname[0] == '~') {
									$data[$rac][$raw] []= floatval($row[substr($cname,2,-1)]);
								}
								else {
									$data[$rac][$raw] []= $row[substr($cname,1,-1)];
								}
							}
						}
					}
					else {
						$json['error'] = $sql_part['json']."\n---?\n".'syntax error: not valid json-format';
					}
					
					//$json['error'] = print_r($data,true);
					$json['data'] = $data;
				}
				
				$json_str = json_encode($json);
				
				// save the query results to a file
				if(!$do_not_cache) {
					file_put_contents($db_name.'/'.$query.'.json', $json_str);
				}
				
				die_json($json_str);
			}
			
			exit;
			
			/*
			else {
				$items = $db->fetchAssoc();
			}
			exit;
			
			$json['a'] = $items;
				
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
*/
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

function die_json_encode($json) {
	die_json(json_encode($json));
}

function die_json($json_str) {
	json_headers();
	echo $json_str;
	exit;
}

function die_monospace($echo) {
	echo '<div style="font-family:monospace;">'."\n";
	echo preg_replace('/  /', "&nbsp;&nbsp;", preg_replace('/\n/',"<br/>\n",htmlentities($echo)));
	echo "\n</div>";
	exit;
}

function json_headers() {
	header('Cache-Control: no-cache, must-revalidate');
	header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
	header('Content-type: application/json');
}

?>