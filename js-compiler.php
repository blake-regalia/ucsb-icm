<?php

require "csx-compiler.php";
require "file-manifest.php";


$csx_manifest_params = File_manifest::read('css/manifest.txt');
$csx_compiler = new CsxCompiler($csx_manifest_params);

$master_js = File_manifest::merge('js/min.manifest.txt', "/************************\n** %PATH%\n************************/\nBenchmark.start('%PATH%');", "Benchmark.stop('%PATH%','load');");
$master_js .= 'Benchmark.stop("all scripts","load");';
$master_js .= '$.extend(window["CSS"],'.$csx_compiler->get_json().');';

file_put_contents('master.js', $master_js);

$optimization_level = 'SIMPLE'; // or ADVANCED

$cmds = array(

	// run google's closure compiler on the master js file
	'java -jar D:/HTTP/closure/compiler.jar --compilation_level='.$optimization_level.'_OPTIMIZATIONS --language_in=ECMASCRIPT5 --js_output_file=min.master.js --js=master.js > out.txt 2>&1',
	
);



foreach($cmds as $cmdStr) {
	attempt($cmdStr);
}

function attempt($cmd) {
	exec($cmd, $out, $err);
	echo implode("\n",$out);
	if($err) {
		echo "\n";
		exit(1);
	}
}

?>