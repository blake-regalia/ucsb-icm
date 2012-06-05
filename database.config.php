<?php

$MACHINE = 'basus';

/*** database ***/
	
$databases = array(
	'blurcast' => array(
		'HOST' => 'localhost',
		'USER' => 'blake_root',
		'PASS' => 'F(hp-8KgHkeW',
	),
	'anteater' => array(
		'HOST' => 'localhost',
		'USER' => 'root',
		'PASS' => 'bluemarble',
	),
	'basus' => array(
		'HOST' => 'localhost',
		'USER' => 'root',
		'PASS' => '',
	),
);

if($databases[$MACHINE]) {
	$DATABASE = $databases[$MACHINE];
}
else {
	$DATABASE = array(
		'HOST' => ini_get("mysql.default_host"),
		'USER' => ini_get("mysql.default_user"),
		'PASS' => ini_get("mysql.default_password"),
		'db_name' => 'registrar',
	);
}

?>