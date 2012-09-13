<?php


$SERVER = 'http://map.geog.ucsb.edu:8080/arcgis/rest/services/icm/basemap/MapServer/';

/*
if(!preg_match('/\\/server\\/([^\\/]+)\\/([^\\/]*)$/', $_SERVER['REQUEST_URI'], $match)) {
	header("HTTP/1.0 404 Not Found");
	die('<h2>404</h2>File Not Found.');
	exit;
}


$uri = $match[1].'/'.$match[2];
**/

preg_match('/\\/server\\/(.*)$/', $_SERVER['REQUEST_URI'], $match);
$uri = $match[1];

// initialize a curl object
$handle = curl_init();

// default curl opts
$curlOpts = array(
	CURLOPT_CONNECTTIMEOUT => 15,
	CURLOPT_RETURNTRANSFER => 1,
	CURLOPT_BINARYTRANSFER => 1,
);


$url = $SERVER.$uri;

// extend any additional curl options to the default ones
$opts = $curlOpts + array(
	CURLOPT_URL => $url,
	CURLOPT_HEADER => 1,
);

curl_setopt_array($handle, $opts);


// perform get request
$response = curl_exec($handle);

curl_close($handle);


$response_headers = preg_split('/\\r\\n/', $response);
foreach($response_headers as $i => $header_line) {
	if($header_line == '') break;
	header($header_line);
}

echo implode("\r\n", array_splice($response_headers, $i+1));

?>