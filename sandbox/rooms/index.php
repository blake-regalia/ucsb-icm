<?php

$cache = ($_GET['cache'] == 'true');
$remote = ($_GET['remote'] == 'true');


?>

<html>
<head>
	<script type="text/javascript" src="../../js/benchmark.js"></script>
	<script type="text/javascript" src="../../js/.jquery.js"></script>
	<script type="text/javascript">
<?php
 echo 'var cache = '.($cache?'true':'false').';';
 echo 'var remote = '.($remote?'true':'false').';';
?>
	</script>
	<script type="text/javascript" src="demo.js"></script>
</head>
<body>
	<input type="text" id="bldLookup"></input>
	<input type="text" id="roomLookup"></input>
</body>
</html>