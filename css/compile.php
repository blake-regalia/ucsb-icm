<?php


include('evalmath.class.php');
$math = new EvalMath();


$global_file = file_get_contents('global.csx');
$glob = parse_global_file($global_file);

$get_json = $_GET['json'];
if($get_json) {
	switch($get_json) {
		case 'globals':
			header('Content-type: text/javascript');
			echo 'window.CSS='.json_encode($glob).';';
			exit;
	}
}


$sb = new StringBuilder();

$fl = scandir('.');
foreach($fl as $file_name) {
	
	// skip the file if it is not CSS
	if(!preg_match('/\.css$/i', $file_name)) continue;
	
	$internal = 0;

	$css_file = file_get_contents($file_name);
	
	$sb->append(macro_substitution($css_file, $glob)."\n");
	
	
	
//	while(preg_match('/\$\((.*)\)[^\)]*/U', $css_file, $matches, PREG_OFFSET_CAPTURE, $internal)) {
/*		
		$offset = $matches[0][1];
		
		$sb->append(substr($css_file, $internal, $offset-$internal));
		
		$xprsn = $matches[1][0];
		$terms = preg_split('/\s+([^\w]*)\s*|([^\w]*)\s+|([^\w]+)/', $xprsn, -1, PREG_SPLIT_DELIM_CAPTURE);
		
		$unit = '';
		$t = array();
		foreach($terms as $term) {
			// number
			if(preg_match('/^\d+$/', $term)) {
				$t[] = $term;
			}
			// variable
			else if(preg_match('/^\w+$/', $term)) {
				$t[] = $glob[$term]['value'];
				if(!strlen($unit)) $unit = $glob[$term]['unit'];
			}
			// operator
			else {
				$op = $term;
			}
		}
		
		$result = $t[0];
		if(sizeof($t) == 2) {
			switch($op) {
				case '-':
					$result = $t[0] - $t[1];
					break;
				case '+':
					$result = $t[0] + $t[1];
					break;
				case '*':
					$result = $t[0] * $t[1];
					break;
				case '/':
					$result = $t[0] / $t[1];
					break;
			}
		}
		
		$sb->append($result.$unit);
		
		$internal = $offset + strlen($matches[0][0]);
	}
	
	$sb->append(substr($css_file, $internal)."\n");
*/
}

header('Content-type: text/css');
echo $sb->getString();


class StringBuilder {
	private $string;
	
	public function __construct() {
		$this->string = '';
	}
	
	public function append($str) {
		$this->string .= $str;
	}
	
	public function getString() {
		return $this->string;
	}
}


function macro_substitution($str, $macro_defs) {
	global $math;
	
	$sb = new StringBuilder();
	
	$pointer = 0;
	
	
//	while(preg_match('/\$\((.*)\).*(?:\r\n?|$)/U', $str, $matches, PREG_OFFSET_CAPTURE, $pointer)) {
	while(preg_match('/\${([^}]*)}/', $str, $matches, PREG_OFFSET_CAPTURE, $pointer)) {
		
		$meta = array();
		
		$offset = $matches[0][1];
		
		$sb->append(substr($str, $pointer, $offset-$pointer));
		
		$evs = $matches[1][0];
		$internal = 0;
		$sba = new StringBuilder();
		
		$unit = '';
		
		while(preg_match('/(?:^|[^\d])([a-z_$]\w+)/', $evs, $subs, PREG_OFFSET_CAPTURE, $internal)) {
			$offset_a = $subs[1][1];
			
			$sba->append(substr($evs, $internal, $offset_a-$internal));
			$word = $subs[1][0];
			
			$tmp_value = $macro_defs[$word]['value'];
			if(preg_match('/^\d+\.\d+$/', $tmp_value)) {
				$tmp_value = floatval($tmp_value);
			}
			$sba->append($tmp_value);
			
//			echo 'SUBSTITUTING '.$word."\n";
//			echo($word.'='.print_r($macro_defs[$word],true)."\n".$str);

//			echo('macro_def['.$word.'] => '.gettype($macro_defs[$word]).'('.sizeof($macro_defs[$word]).')'."\n");
			
			if(sizeof($macro_defs[$word]) == 0) {
				die('error: no definition of "'.$word.'"');
			}
			
			foreach($macro_defs[$word] as $key => $thing) {
				if($key != 'value') {
					$meta[$key] = $thing;
				}
			}
			
			$internal = $offset_a + strlen($subs[0][0]);
		}
		
		$sba->append(substr($evs, $internal));
		
		$eval = $sba->getString();
		
		//echo 'evaluating: '.$eval."\n";
		
		if(!preg_match('/[^\d\s\.\-\*\/+\(\)]/', $eval)) {
			$eval = $math->evaluate($eval);
		}
		
//		echo '   => '.$eval."\n";
		
//		echo 'left: '.substr($str,strlen($matches[1][0])+3).';'."\n";
		//echo 'just matched on: '.$str.'{'.$evs.'} => '.$eval.'; unit='.$unit.';'."\n";
//		print_r($meta);
//		print_r($matches);
		
		$sb->append($eval);
		
		$offset += strlen($matches[1][0])+3;
		
//		echo "\n``".substr($str,$offset)."``\n";
		
		if(preg_match('/^&([a-z_\$]\w+)/', substr($str,$offset), $extra)) {
//			echo "\n".'FIDING: '.$extra[1]."\n";
//			print_r($extra);
			$offset += strlen($extra[0]);
			$sb->append($meta[$extra[1]]);
		}
		
//		echo 'ADVANCED pointer to: '.substr($str,$offset,10);
		
		$pointer = $offset;
	}
	
	
//	echo '*{*'.$sb->getString().substr($str,$pointer,1).'**}**'."\n";
	
	$sb->append(substr($str, $pointer));
	
	return $sb->getString();
}

function parse_global_file($file) {
	global $math;
	
	$file = preg_replace('/\/\*(?>(?:(?>[^*]+)|\*(?!\/))*)\*\//','',$file);
	
	preg_match_all('/\s*(&?)([a-z_\$]\w*)\s*=\s*([^\r\n]*)(?:\r?\n|$)/', $file, $matches, PREG_SET_ORDER);
	
	$last = false;
	$assoc = array();
	foreach($matches as $match) {
		if(strlen($match[1]) && $last) {
			$assoc[$last][$match[2]] = $match[3];
		}
		else {
			$value = $match[3];
			
			$value = macro_substitution($value, $assoc);
//			echo($match[3].'<>'.$value."\n");
			
			if(preg_match('/^\d+(\.\d+)?$/',$value)) $value = floatval($value);
			
			$assoc[$match[2]] = array(
				'value' => $value,
			);
		}
		$last = $match[2];
	}
	unset($matches);
	
	return $assoc;
}


/*
class Tokenizer {
	
	private $string;
	
	
	
	public function __construct($input) {
		$string = $input;
		
		
	}
	
	private function err($msg) {
		die($msg);
	}
	
	public function parse() {
		
		
		$$     = 0;
		$BEGIN = 1;
		$ = 0;
		
		$start = -1;
		
		$len = strlen($str);
		for($i=0; $i<$len; $i++) {
			
			$c = $str[$i];
			
			$b = '';
			
			switch($m) {
				case $$:
					if($c == "$") {
						$start = $i;
						$m = $BEGIN;
					}
					break;
				case $BEGIN:
					if($c == "(") {
						$m = $ANY;
					}
					else {
						$start = -1;
						$m = $BEGIN;
					}
					break;
				case $ANY:
					if(preg_match('/[a-z_\$]/i', $c)) {
						$b = $c;
						$m = $VAR;
					}
					else if(preg_match('/[\.0-9]/', $c)) {
						$b = $c;
						$m = $NUM;
					}
					else if(preg_match('/[\+\-\*\/\^]/', $c)) {
						$this->token($c, 'num');
					}
					else if($c == '(') {
						
					}
					break;
				case $VAR:
					if(preg_match('/[a-z_\$0-9]/i', $c)) {
						$b .= $c;
					}
					else {
						$i -= 1;
						$this->token($b, 'var');
						$m = $ANY;
					}
					break;
			}
		}

	}
}

*/


?>