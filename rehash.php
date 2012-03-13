<?php

$tests = array();
$table = array();

for($a=ord('a'); $a<=ord('z'); $a++) {
	$av = chr($a);
	$tests[$av] = array(
		'a' => '/^'.$av.'/i',
		'b' => '/[ \\.\\-_]('.$av.')/i',
	);
	
	for($b=ord('a'); $b<=ord('z'); $b++) {
		$bv = chr($b);
		$tests[$av.$bv] = array(
			'a' => '/^'.$av.$bv.'/i',
			'b' => '/[ \\.\\-_]('.$av.$bv.')/i',
		);
	}
}


function hash_search($subject, $major, $minor) {
	global $tests, $table;
	foreach($tests as $key => $set) {
		foreach($set as $pattern) {
			if(!$table[$key]) $table[$key] = array();
			if(preg_match($pattern, $subject, $match, PREG_OFFSET_CAPTURE)) {
//				echo 'preg_match('.$pattern.', '.$subject.");\n";
				$offset = ((int) $match[1][1]).'';
				if(!$table[$key][$offset]) $table[$key][$offset] = array();
				$table[$key][$offset][] = $minor;
//				echo 'table['.$key.']['.$offset.'][] = '.$subject."\n";
			}
			if(sizeof($table[$key]) === 0) {
				unset($table[$key]);
			}
		}
	}
}

chdir('data');
$files = scandir('.');

foreach($files as $file) {
	if(preg_match('/\.json$/i', $file)) {
		$json = file_get_contents($file);
		preg_match_all('/"([^\"]+)",?/', $json, $matches, PREG_PATTERN_ORDER);
		$elements = $matches[1];
		foreach($elements as $index => $node) {
			hash_search($node, 0, $index);
		}
	}
}

foreach($table as $u => $hash) {
	$max = 0;
	foreach($hash as $key => $result) {
		$max = max($max, $key);
	}
	$table[$u]['max'] = $max;
}

file_put_contents('building.names.hash.json', json_encode($table));
