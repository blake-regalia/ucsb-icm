<?php


$SERVER = 'http://ags2.geog.ucsb.edu/ArcGIS/rest/services/icmBasemap20120413/MapServer/';

if(!preg_match('/\\/server\\/([^\\/]+)\\/([^\\/]*)$/', $_SERVER['REQUEST_URI'], $match)) {
	header("HTTP/1.0 404 Not Found");
	die('<h2>404</h2>File Not Found.');
	exit;
}

$uri = $match[1].'/'.$match[2];


// initialize a curl object
$handle = curl_init();

// default curl opts
$curlOpts = array(
	CURLOPT_CONNECTTIMEOUT => 15,
	CURLOPT_RETURNTRANSFER => 1,
);


$url = $SERVER.$uri;

// extend any additional curl options to the default ones
$opts = $curlOpts + array(
	CURLOPT_URL => $url,
);

curl_setopt_array($handle, $opts);


// perform get request
$response = curl_exec($handle);

curl_close($handle);

die($response);

?>