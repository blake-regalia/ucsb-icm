<?

$MACHINE = 'basus';
$DEFAULT_DATABSE = 'blurcore';

/*** database ***/
	
$databases = array(
	'blurcast' => array(
		'HOST' => 'localhost',
		'USER' => 'blake_root',
		'PASS' => 'F(hp-8KgHkeW',
		'db_name' => 'blake_'.$DEFAULT_DATABSE,
	),
	'anteater' => array(
		'HOST' => 'localhost',
		'USER' => 'root',
		'PASS' => 'bluemarble',
		'db_name' => $DEFAULT_DATABSE,
	),
	'basus' => array(
		'HOST' => 'localhost',
		'USER' => 'root',
		'PASS' => '',
		'db_name' => $DEFAULT_DATABSE,
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
		'db_name' => $DEFAULT_DATABSE,
	);
}

?>