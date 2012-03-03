<?php

if(isset($_GET['save'])) {
	$log = $_GET['log'];
	if(!is_dir('logs')) {
		mkdir('logs');
	}
	$log_file = fopen('logs/.txt','a');
	fwrite($log_file, $log);
	fclose($log_file);
}


?>