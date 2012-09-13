<?php


ob_implicit_flush(true);
ob_end_flush();

class cmd {
	
	static function attempt($cmd) {
		echo "\n".'$ '.$cmd."\n";
		
		$spec = array(
			0 => array("pipe", "r"),
			1 => array("pipe", "w"),
			2 => array("pipe", "w")
		);
		flush();
		$process = proc_open($cmd, $spec, $pipes);
		
		if(is_resource($process)) {
			fclose($pipes[0]);
			while($s = fgets($pipes[1])) {
				echo $s; flush();
			}
			$ferr = stream_get_contents($pipes[2]);
			fclose($pipes[2]);
			$err = proc_close($process);
			
			if($err) {
				echo "\n";
				echo $ferr."\n";
				exit(1);
			}
		}
		else {
			exec($cmd, $out, $err);
			echo implode("\n",$out);
			if($err) {
				echo "\n";
				exit(1);
			}
		}
	}
	
	static function exec($cmds) {
		foreach($cmds as $cmdStr) {
			cmd::attempt($cmdStr);
		}
	}
}

?>