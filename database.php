<?php

if(!isset($DATABASE)) {
	require("database.config.php");
}


class MySQL_Pointer {
	
	static private $link = NULL;
	static private $user = 'root';
	static private $pass = '';
	
	protected $database = FALSE;
	protected $table = FALSE;
	
	
	protected function query($sql) {
		$resource = mysql_query($sql, self::$link) or die(mysql_error());
		return $resource;
	}
	
	protected function attempt($sql) {
		if($this->database !== FALSE) {
			$select = mysql_select_db($this->database, self::$link);
			if($select !== TRUE) {
				$this->error('could not select database '.$this->database);
			}
		}
		
		$attempt = $this->query($sql);
		
		if($attempt === TRUE) {
			return TRUE;
		}
		else if($attempt === FALSE) {
			return FALSE;
		}
		else {
			$this->error('incorrect usage of function: attempt(); result not boolean');
		}
	}
	
	function __construct($database) {
		if($this->attempt("CREATE DATABASE IF NOT EXISTS `".$database."`") === FALSE) {
			$this->error('failed to create database: '.$sql.'; ');
			exit;
		}
		$this->database = $database;
	}
	
	function truncate($table) {
		$sql = "TRUNCATE TABLE `".$this->database."`.`".$table."`";
		return $this->attempt($sql);
	}
	
	function dropTable($table) {
		$sql = "DROP TABLE `".$this->database."`.`".$table."`";
		return $this->attempt($sql);
	}
	
	function fetchAssocWhere($whereSql) {
		$sql = "SELECT * FROM ".$this->path." WHERE ".$whereSql.";";
		$res = $this->query($sql);
		while(($resultArray[] = mysql_fetch_assoc($res)) || array_pop($resultArray));
		return $resultArray;
	}
	
	function fetchAssoc($clauseSql='') {
		$sql = "SELECT * FROM ".$this->path." ".$clauseSql.";";
		$res = $this->query($sql);
		while(($resultArray[] = mysql_fetch_assoc($res)) || array_pop($resultArray));
		return $resultArray;
	}
	
	function fetchAssocOf($field) {
		$sql = "SELECT * FROM ".$this->path.";";
		$res = $this->query($sql);
		
		while(true) {
			$result = mysql_fetch_assoc($res);
			if(!$result) break;
			$resultArray[] = $result[$field];
		}
		return $resultArray;
	}
	
	function fetchSizeWhereEquals($field, $value) {
		$sql = "SELECT COUNT(*) FROM ".$this->path." WHERE `".$field."`='".$value."';";
		return mysql_result($this->query($sql), 0);
	}
	
	function fetchRowWhere($whereSql) {
		$sql = "SELECT * FROM ".$this->path." WHERE ".$whereSql.";";
		$res = $this->query($sql);
		return mysql_fetch_assoc($res);
	}
	
	function fetchRowWhereEquals($field, $value) {
		$sql = "SELECT * FROM ".$this->path." WHERE `".$field."` = '".$value."';";
		$res = $this->query($sql);
		return mysql_fetch_assoc($res);
	}
	
	function fetchAssocWhereEquals($field, $value) {
		$sql = "SELECT * FROM ".$this->path." WHERE `".$field."` = '".$value."';";
		$res = $this->query($sql);
		while(($resultArray[] = mysql_fetch_assoc($res)) || array_pop($resultArray));
		return $resultArray;
	}
	
	function insert($array) {
		$fields = implode('`,`', array_keys($array));
		$values = implode("','", array_values($array));
		$sql = "INSERT INTO ".$this->path." (`".$fields."`) VALUES('".$values."');";
		return $this->query($sql);
	}
	
	function selectTable($table) {
		$this->table = $table;
		$this->path = "`".$this->database."`.`".$table."`";
	}
	
	function table($tableName, $fieldArray) {
		$fields = array();
		foreach($fieldArray as $name => $type) {
			$fields []= '`'.$name.'` '.$type;
		}
		$sql = "CREATE TABLE IF NOT EXISTS `".$tableName."` (".implode(',', $fields).");";
		return $this->attempt($sql);
	}
	
	protected function error($say) {
		echo $say;
		echo "\n".mysql_error();
		exit;
	}
	
	static function init($server, $user, $pass, $new, $flags) {
		self::$user = $user;
		self::$pass = $pass;
		
		$link = mysql_connect($server, $user, $pass, $new, $flags);
		
		if($link === FALSE) {
			die('failed to connect to MySQL server');
			exit;
		}
		else {
			self::$link = $link;
		}
	}
	
}

MySQL_Pointer::init(
	// server host name
	$DATABASE['HOST'],
	
	// user name
	$DATABASE['USER'],
	
	// password
	$DATABASE['PASS'],
	
	// new link
	false,
	
	// client flags
	0
);


?>