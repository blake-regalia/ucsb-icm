<?php

require "phpQuery.php";

$regUrl = "http://my.sa.ucsb.edu/public/curriculum/coursesearch.aspx";

// setup an array for any cookies we will need for requests
$regCookie = array();

$curlOpts = array(
	CURLOPT_URL => $regUrl,
	CURLOPT_CONNECTTIMEOUT => 15,
	CURLOPT_RETURNTRANSFER => 1,
);



/* before we make requests, fetch any server-side token values (cookies & keys) */

// initialize a curl object
$initHandle = curl_init();

// extend any additional curl options to the default ones
$initOpts = $curlOpts + array(
	CURLOPT_HEADER => 1,
);
curl_setopt_array($initHandle, $initOpts);

// perform get request
$initResponse = curl_exec($initHandle);
curl_close($initHandle);
unset($initHandle);

// extract the cookies from the header for subsequent calls
if(!preg_match('/Set\-Cookie: ([^;]+)/', $initResponse, $matches)) {
	die('Could not resolve ASP.NET_SessionId cookie by regex');
}
$regCookie[] = $matches[1];

$initHtml = substr($initResponse, strpos($initResponse, '<!DOCTYPE'));

// parse the document
$doc = phpQuery::newDocument($initHtml);
phpQuery::selectDocument($doc);

// steal microsoft's stupid ASP token keys
$ASP_Tokens = array(
	'__VIEWSTATE'       => pq('#__VIEWSTATE')->val(),
	'__EVENTVALIDATION' => pq('#__EVENTVALIDATION')->val(),
);

// cleanup
unset($initPage);




/* perform a departmental request */

// initialize a curl object
$regHandle = curl_init();

// prepare the post field data
$regPostFieldsArray = $ASP_Tokens + array(
	'ctl00$pageContent$courseList'           => 'ANTH    ',
	'ctl00$pageContent$quarterList'          => '20122',
	'ctl00$pageContent$dropDownCourseLevels' => 'Undergraduate',
	'ctl00$pageContent$searchButton.x'       => '22',
	'ctl00$pageContent$searchButton.y'       => '8'
);

// encode the post fields as a url component
$regPostFieldsArrayEncoded = array();
foreach($regPostFieldsArray as $key => $value) {
	$regPostFieldsArrayEncoded[] = urlencode($key).'='.urlencode($value);
}
$regPostFieldsString = implode('&', $regPostFieldsArrayEncoded);

// extend any additional curl options to the default ones
$regOpts = $curlOpts + array(
	CURLOPT_POST => true,
	CURLOPT_POSTFIELDS => $regPostFieldsString,
	
	CURLOPT_COOKIE => implode(';', $regCookie),
);
curl_setopt_array($regHandle, $regOpts);

// perform get request
$regHtml = curl_exec($regHandle);
curl_close($regHandle);
unset($regHandle);

// parse the document
$doc = phpQuery::newDocument($regHtml);
phpQuery::selectDocument($doc);

function error($msg) {
	die($msg);
}

$records = array();


function format($str) {
	return preg_replace(array('/^\s+/','/\s+$/'),array('',''),$str);
}

/** function responsible for extracting fields from each row **/
function extractRow($row) {
	global $records;
	$array = &$records;
	
	// setup a reference to the child TD elements
	$tds = pq($row)->children('td');
	
	// course title [eg: GEOG 176C]
	$firstSetHtml = pq($row)->find('#CourseTitle')->html();
	if(!preg_match('/^\s*([a-z][^<]+)</i', $firstSetHtml, $match)) {
		error('failed to interpret course title regex');
	}
	$courseTitle = preg_replace('/ +/',' ',format($match[1]));
	
	/* deatiled information box */
	$masterCourseTable = pq($row)->find('.MasterCourseTable');
	$fullTitle   = $masterCourseTable->find('span[id$="labelTitle"]')->text();
	$description = $masterCourseTable->find('span[id$="labelDescription"]')->text();
	$preReq      = $masterCourseTable->find('span[id$="labelPreReqComment"]')->text();
	$college     = $masterCourseTable->find('span[id$="labelCollege"]')->text();
	$units       = $masterCourseTable->find('span[id$="labelUnits"]')->text();
	$grading     = $masterCourseTable->find('span[id$="labelQuarter"]')->text();
	
	// primary title, indicates that it is a lecture
	$primaryTitle = pq($row)->find('span[id$="HyperLinkPrimaryCourse"]')->text();
	
	// status: Closed, Full, Cancelled, or a blank string
	$status = preg_replace('/\s+/','', pq($row)->find('td.Status')->text());
	
	// encroll code
	$enrollCode = pq($row)->find('a.EnrollCodeLink')->text();
	
	/* restrictions information box */
	$restrictionsTable = pq($row)->find('.RestrictionsTable');
	$levelLimit     = $restrictionsTable->find('[id$="label2"]')->text();
	$majorLimitPass = $restrictionsTable->find('[id$="label4"]')->text();
	$majorLimit     = $restrictionsTable->find('[id$="label3"]')->text();
	$messages       = $restrictionsTable->find('[id$="lblMessages"]')->text();
	
	// instructor name
	$instructor = format($tds->eq(5)->text());
	
	// day codes
	$days = format($tds->eq(6)->text());
	
	// time of day codes
	$time = format($tds->eq(7)->text());
	
	// location
	$location = format($tds->eq(8)->text());
	
	// time of day codes
	$enrolled = format($tds->eq(9)->text());
	
	$array[] = array(
		'courseTitle'    => $courseTitle,
		'fullTitle'      => $fullTitle,
		'description'    => $description,
		'preReq'         => $preReq,
		'college'        => $college,
		'units'          => $units,
		'grading'        => $grading,
		'primaryTitle'   => $primaryTitle,
		'status'         => $status,
		'enrollCode'     => $enrollCode,
		'levelLimit'     => $levelLimit,
		'majorLimitPass' => $majorLimitPass,
		'majorLimit'     => $majorLimit,
		'messages'       => $messages,
		'instructor'     => $instructor,
		'days'           => $days,
		'time'           => $time,
		'location'       => $location,
		'enrolled'       => $enrolled,
	);
}

pq('.CourseInfoRow')->each('extractRow',new CallbackParam);

// cleanup
unset($regPage);


print_r($records);



?>