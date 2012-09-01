<?php

ob_implicit_flush(true);
ob_end_flush();

class cmd {
	
	static function attempt($cmd) {
		echo "\n".'$ '.$cmd."\n";
		exec($cmd, $out, $err);
		echo implode("\n",$out);
		if($err) {
			echo "\n";
			exit(1);
		}
	}
	
	static function exec($cmds) {
		foreach($cmds as $cmdStr) {
			cmd::attempt($cmdStr);
		}
	}
}

?>