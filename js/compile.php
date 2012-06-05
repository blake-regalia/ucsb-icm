<?php

$PRIORITY = array(
    'arcgis.preload.js',
    'benchmark.js',
    'arcgis.js',
	'unra.js',
	'download.js',
	
	'threads.js',
	'omnibox.js',
	'building.js',
	'search.items.js',
	'esri.map.js',
	'dojo.init.js',
	'card.js',
	'card.deck.js',
	'tools.js',
);

$js_files = array();
$files = scandir('.');
foreach($files as $f) {
	if($f[0] === '.') continue;
	$pi = pathinfo($f);
	if($pi['extension'] == 'js') {
		$js_files []= $f;
	}
}

function priority($a, $b) {
	global $PRIORITY;
	$key_a = array_search($a, $PRIORITY);
	$key_b = array_search($b, $PRIORITY);
	if     ($key_b === false) return  1;
	else if($key_a === false) return -1;
	else                      return ($key_a > $key_b)? -1: 1;
}

usort($js_files, 'priority');

$i = sizeof($js_files);
while($i--) {
	$src = $js_files[$i];
	if($DEBUG) {
		echo '<script type="text/javascript" src="js/'.$src.'"></script>'."\n";
	}
	else {
		readfile($src);
	}
}

?>