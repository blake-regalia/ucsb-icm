<?php


if($argc !== 2) {
	die('requires one parameter. '.($argc-1).' given.');
}

$prefix = $argv[1];

$pwd = getcwd();

chdir('../data/ucsb');

$files = scandir('.');

$prefix_len = strlen($prefix);

foreach($files as $f) {
	if(substr($f, 0, $prefix_len) == $prefix) {
		unlink($f);
	}
}

?>