<?php

require "file-manifest.php";
require "csx-compiler.php";

header('Content-Type:text/html; charset=UTF-8');
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">
<html>
<head>
<?php

readfile('page.head.html');

$js_merge = isset($_GET['jsm'])? true: false;
$js_min   = isset($_GET['min'])? true: false;

$merge_files = array(
	'js' => $js_merge,
	'css' => true,
);

/***************
**    css
***************/
$csx_manifest_params = File_manifest::read('css/manifest.txt');
$csx_compiler = new CsxCompiler($csx_manifest_params);
if($merge_files['css']) {
	echo '<style>',"\n\n";
	echo $csx_compiler->output();
	echo "\n",'</style>',"\n";
}


/***************
** javascript
***************/
if($js_min) {
	echo "\t",'<script type="text/javascript">',"\n";
	echo File_manifest::merge('js/no-min.manifest.txt', "/************************\n** %PATH%\n************************/\n");
	echo file_get_contents('min.master.js');
	echo "\n",'</script>'."\n";
}
else {
	if($merge_files['js']) {
		echo "\t",'<script type="text/javascript">',"\n";
		echo File_manifest::merge('js/manifest.txt', "/************************\n** %PATH%\n************************/\nBenchmark.start('%PATH%');", "Benchmark.stop('%PATH%','load');");
		echo "\n",'</script>'."\n";
	}
	else {
		echo File_manifest::gen('js/manifest.txt', '<script type="text/javascript" src="js/%PATH%"></script>')."\n";
	}

	// commit all the CSS values into the javascript CSS object
	echo '<script type="text/javascript">',"\n";
	echo "Benchmark.stop('all scripts','load');\n";
	echo '$.extend(window.CSS,',$csx_compiler->get_json(),');',"\n",'</script>',"\n";
}


echo '
</head>
';

readfile('page.body.html');

?>
</html>