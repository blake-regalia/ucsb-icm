<?php

$server_hash = substr(md5($_SERVER['SCRIPT_NAME'].$_SERVER['PATH']), 2, 12);
$client_hash = substr(md5($_SERVER['REMOTE_ADDR'].$_SERVER['HTTP_HOST'].$_SERVER['HTTP_USER_AGENT']), 2, 12);

$server_vars = array(
	'PHPRC'=>'',
	'HTTP_HOST'=>'',
	'HTTP_REFERER'=>'',
	'PATH'=>'',
	'SERVER_SIGNATURE'=>'',
	'SERVER_NAME'=>'',
	'SERVER_ADDR'=>'',
	'SERVER_PORT'=>'',
	'DOCUMENT_ROOT'=>'',
	'SERVER_ADMIN'=>'',
	'SCRIPT_FILENAME'=>'',
	'SERVER_PROTOCOL'=>'',
	'PHP_SELF'=>'',
	'SystemRoot'=>''
);

if(isset($_GET['save'])) {
	
	if(!is_dir('logs')) {
		mkdir('logs');
	}
	chdir('logs');
	
	if(!is_dir($server_hash)) {
		mkdir($server_hash);
		file_put_contents($server_hash.'/server.txt',
			preg_replace('/\n/',"\r\n",
				print_r(
					array_intersect_key($_SERVER, $server_vars),
					true
				)
			)
		);
	}
	chdir($server_hash);
	
	$client_file = $client_hash.'.txt';
	if(!is_file($client_file)) {
		file_put_contents($client_file, $_SERVER['HTTP_USER_AGENT']."\r\n");
	}
	
	$log = $_GET['log'];
	$log_file = fopen($client_file,'a');
	if(!$log_file) {
		die('could not open log file');
	}
	fwrite($log_file, preg_replace('/\n/',"\r\n","\n".$_GET['save'].': '.$log."\n"));
	fclose($log_file);
	die('success');
}


?>