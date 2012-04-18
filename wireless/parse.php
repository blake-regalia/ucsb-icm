<?php

$wv = fopen('wireless.csv','r');
$p = array();
while(($line = fgets($wv)) !== false) {
	$d = preg_split('/","/', $line);
	$p[$d[1]] = true;
}
fclose($wv);
$f = array();
foreach($p as $w => $t) {
	$b = preg_split('/-/',$w);
	if(!array_key_exists($b[0], $f)) {
		$f[$b[0]][$b[1]] = 1; //array($b[1].'-'.$b[2]);
	}
	else {
		$f[$b[0]][$b[1]] += 1;//$b[1].'-'.$b[2];
	}
}

echo json_encode($f);


?>