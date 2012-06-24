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
		$resource = mysql_query($sql, self::$link);
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
	
	function __construct($database=false) {
		global $DATABASE;
		if($database === false) $database=$DATABASE['db_name'];
		if($this->attempt("CREATE DATABASE IF NOT EXISTS `".$database."`") === FALSE) {
			$this->error('failed to create database: '.$sql.'; ');
			exit;
		}
		$this->database = $database;
		if(!$this->attempt("USE `".$this->database."`;")) {
			$this->error('database could not be used: "'.$database.'"');
		}
	}
	
	function truncate($table) {
		$sql = "TRUNCATE TABLE `".$this->database."`.`".$table."`";
		return $this->attempt($sql);
	}
	
	function dropTable($table) {
		$sql = "DROP TABLE `".$this->database."`.`".$table."`";
		return $this->attempt($sql);
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
	
	function fetchSize($clause) {
		$where = $this->resolveClause($clause);
		$sql = "SELECT COUNT(*) FROM ".$this->path." WHERE ".$where.";";
		$res = $this->query($sql);
		if(is_bool($res)) {
			echo $res.':'.print_r($clause,true)."\n";
		}
		return mysql_result($res, 0);
	}
	
	function fetchRow($clause) {
		$where = $this->resolveClause($clause);
		$sql = "SELECT * FROM ".$this->path." WHERE ".$where.";";
		$res = $this->query($sql);
		return mysql_fetch_assoc($res);
	}
	
	function fetchAssoc($clause=false) {
		if($clause) {
			$where = $this->resolveClause($clause);
			$sql = "SELECT * FROM ".$this->path." WHERE ".$where.";";
		}
		else {
			$sql = "SELECT * FROM ".$this->path.";";
		}
		$res = $this->query($sql);
		while(($resultArray[] = mysql_fetch_assoc($res)) || array_pop($resultArray));
		return $resultArray;
	}
	
	function insert($array) {
		$fields = implode('`,`', $this->escapeField(array_keys($array)));
		$values = implode("','", $this->escapeValue(array_values($array)));
		$sql = "INSERT INTO ".$this->path." (`".$fields."`) VALUES('".$values."');";
		return $this->query($sql);
	}
	
	function update($clause, $data) {
		$where = $this->resolveClause($clause);
		$update = $this->resolveClause($data, ', ');
		$sql = "UPDATE ".$this->path." SET ".$update." WHERE ".$where.";";
		return $this->attempt($sql);
	}
	
	function resolveClause($array, $glue=' AND ') {
		$plode = '';
		foreach($array as $key => $value) {
			$plode[]= "`".$this->escapeField($key)."` = '".$this->escapeValue($value)."'";
		}
		return implode($glue, $plode);
	}
	
	function escapeField($field) {
		return preg_replace("/`/","\\`",$field);
	}
	
	function escapeValue($value) {
		return preg_replace("/'/","\\'",$value);
	}
	
	function getTables() {
		$sql = "SHOW TABLES FROM `".$this->database."`;";
		$result = $this->query($sql);
		if(!$result) {
			$this->error();
		}
		
		$tables = array();
		while($row = mysql_fetch_row($result)) {
			$tables[] = $row[0];
		}
		
		return $tables;
	}
	
	function selectTable($table) {
		$this->table = $table;
		$this->path = "`".$this->database."`.`".$table."`";
	}
	
	function tableExists($table) {
		$sql = "SHOW TABLES LIKE '".$table."';";
		return mysql_fetch_row($this->query($sql));
	}
	
	function createTable($tableName, $fieldArray, $and=false) {
		$fields = array();
		foreach($fieldArray as $name => $type) {
			$fields []= '`'.$name.'` '.$type;
		}
		$sql = "CREATE TABLE IF NOT EXISTS `".$tableName."` (".implode(',', $fields).($and? ", ".$and: "").") ;";
		return $this->attempt($sql);
	}
	
	function createTableLike($sourceDB=false, $sourceTable, $destTable) {
		if($sourceDB == false) $sourceDB = $this->database;
		$sql = "CREATE TABLE IF NOT EXISTS `".$this->database."`.`".$destTable."` LIKE `".$sourceDB."`.`".$sourceTable."`;";
		return $this->attempt($sql);
	}
	
	function cloneFrom($sourceDB=false, $sourceTable) {
		if($sourceDB == false) $sourceDB = $this->database;
		$sql = "INSERT INTO ".$this->path." SELECT * FROM `".$sourceDB."`.`".$sourceTable."`;";
		return $this->attempt($sql);
	}
	
	function reorderBy($fieldName, $asc=true) {
		$sql = "ALTER TABLE ".$this->path." ORDER BY `".$fieldName."` ".($asc? "ASC": "DESC").";";
		return $this->attempt($sql);
	}
	
	function error($say) {
		echo $say;
		echo "\n".mysql_error();
		exit;
	}
	
	function getDatabase() {
		return $this->database;
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