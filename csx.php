<?php namespace csx;

function stringify($set) {
	$str = $set['value'];
	if($set['unit']) $str .= $set['unit'];
	return $str;
}


function shareUnits($p, $s) {
	$unit = '';
	$pu = false;
	$su = false;
	if($p['unit'] && strlen($p['unit'])) {
		$pu = true;
	}
	else if($s['unit'] && strlen($s['unit'])) {
		$su = true;
	}
	
	if($pu) {
		if($su && $p['unit'] != $s['unit']) {
			die('Units differ: '.$p['unit'].' and '.$s['unit'].'.');
		}
		$unit = $p['unit'];
	}
	else if($su) {
		$unit = $s['unit'];
	}
	
	return $unit;
}

function type_string($str) {
	return array(
		'type' => 'string',
		'value' => $str,
	);
}


class GlobalFunctions {
	
	static $has = array(
		'center' => 1,
		'comma'  => 1,
		'linearGradient' => 1,
		'rgb'    => 1,
		'rgba'   => 1,
		'rotate' => 1,
		'round'  => 1,
		'space'  => 1,
		'url'    => 1,
	);
	
	public static function center($args) {
		return array(
			'type' => 'number',
			'value' => $args[0]['value']*0.5 - $args[1]['value']*0.5,
			'unit' => shareUnits($args[0], $args[1]),
		);
	}
	
	public static function comma($args) {
		$str = array();
		foreach($args as $item) {
			$str []= stringify($item);
		}
		return type_string(implode(',', $str));
	}
	
	public static function linearGradient($args) {
		$a0=''; $a1=''; $b0=''; $b1='';
		
		switch(stringify($args[0])) {
			case 'top-down':
				$ab = 'top';
				$a0 = 'top'; $a1 = 'left';
				$b0 = 'bottom'; $b1 = 'left';
				break;
		}
		
		$strs = array();
		for($i=1; $i<count($args); $i++) {
			$strs []= stringify($args[$i]);
		}
		
		$standard = $ab.','.implode(',', $strs);
		$colorStops = array();
		$colorStart = false; $colorEnd = '';
		foreach($strs as $str) {
			$split = preg_split('/\b\s+\b/', $str);
			if(!$colorStart) $colorStart = $split[0];
			$colorEnd = $split[0];
			$colorStops []= 'color-stop('.$split[1].','.$split[0].')';
		}
		
		return array(
			'type' => 'browser-specific',
			'value' => array(
				'-ms-linear-gradient'     => $standard,
				'-moz-linear-gradient'    => $standard,
				'-o-linear-gradient'      => $standard,
				'-webkit-linear-gradient' => $standard,
				'-webkit-gradient' => 'linear, '.$a1.' '.$a0.', '.$b1.' '.$b0.', '.implode(',',$colorStops),
				//'filter' => "progid:DXImageTransform.Microsoft.gradient(startColorstr='".$colorStart."', endColorstr='".$colorEnd."',GradientType=0",
			),
		);
	}
	
	public static function rgb($args) {
		$size = sizeof($args);
		if($size === 1) {
			$anot = $args[0];
			if($anot['r']) {
				return type_string('rgb('.$anot['r']['value'].','.$anot['g']['value'].','.$anot['b']['value'].')');
			}
			$hex = dechex($anot['value']);
			return type_string('#'.strtoupper($hex.$hex.$hex));
		}
		else if($size === 3) {
			return type_string('#'.strtoupper(dechex($args[0]['value']).dechex($args[1]['value']).dechex($args[2]['value'])));
		}
		else {
			die('rgb needs 3 args');
		}
	}
	
	public static function rgba($args) {
		$size = sizeof($args);
		if($size === 1) {
			$rgba = $args[0];
			return type_string('rgba('.$rgba['r']['value'].','.$rgba['g']['value'].','.$rgba['b']['value'].','.$rgba['a']['value'].')');
		}
		if($size === 2) {
			$level= dechex($args[0]['value']);
			$alpha = $args[1]['value'];
			return type_string('rgba('.$level.','.$level.','.$level.','.$alpha.')');
		}
		if($size === 4) {
			return type_string('rgba('.$args[0]['value'].','.$args[1]['value'].','.$args[2]['value'].','.$args[3]['value'].')');
		}
		else {
			die('rgba needs 4 args');
		}
	}
	
	public static function rotate($args) {
		
		if(sizeof($args) == 1) {
			$r = $args[0];
			
			$str = '';
			if(isset($r['x']) && isset($r['y']) && isset($r['z'])) {
				$str = 'rotate('.stringify($r['x']).','.stringify($r['y']).','.stringify($r['z']).')';
			}
			else {
				$str = array();
				if(isset($r['x'])) {
					$str []= 'rotateX('.stringify($r['x']).')';
				}
				if(isset($r['y'])) {
					$str []= 'rotateY('.stringify($r['y']).')';
				}
				if(isset($r['z'])) {
					$str []= 'rotateZ('.stringify($r['z']).')';
				}
				$str = implode(' ',$str);
			}
			
			return array(
				'type' => 'string',
				'value' => $str,
			);
		}
		
		return '';
	}
	
	public static function round($args) {
		$args[0]['value'] = round($args[0]['value']);
		return $args[0];
	}
	
	public static function space($args) {
		$str = array();
		foreach($args as $item) {
			$str []= stringify($item);
		}
		return type_string(implode(' ', $str));
	}
	
	public static function url($args) {
		return type_string("url('".$args[0]['value']."')");
	}
}



class Scanner {
	
	const EOF = 'EOF';
	
	var $TOKENS = array(
		'whitespace' => '\\s+',
		'number'     => '(\\d+(?:\\.\\d+)?|\\.\\d+)',
		'function'   => '([$\\w]+\\()',
		'name'       => '([$\\w]+(?:\\.[a-zA-Z$]\\w*)+)',
		'word'       => '([$\\w]+)',
		'colon'      => ':',
		'semicolon'  => ';',
		'comma'      => ',',
		'dot'        => '\\.',
		'openbrace'  => '[\\{]',
		'closebrace' => '[\\}]',
		'openparen'  => '[\\(]',
		'closeparen' => '[\\)]',
		'openbracket'  => '[\\[]',
		'closebracket' => '[\\]]',
		'sstring'    => "'((?:[^\\\\']|\\\\.)*)'",
		'dstring'    => '"((?:[^\\\\"]|\\\\.)*)"',
		'plus'       => '[+]',
		'minus'      => '[\\-]',
		'times'      => '[*]',
		'divides'    => '\\\\',
		'modulus'    => '%',
	);
	
	var $string = null;
	var $bank   = array();
	var $index  = 0;
	
	var $lineIndex = 0;
	var $charIndex = 0;
	
	function __construct($string) {
		$this->string = $string;
		$this->finalizeTokenConstants();
		$this->scan();
	}
	
	public function nextToken() {
		return $this->bank[$this->index];
	}
	
	public function consume() {
		$this->index += 1;
	}
	
	private function finalizeTokenConstants() {
		foreach($this->TOKENS as $tokenType => $regex) {
			$this->TOKENS[$tokenType] = '/^'.$regex.'/';
		}
	}
	
	private function getLastTokenPatternKey() {
		end($this->TOKENS);
		return key($this->TOKENS);
	}
	
	private function scan() {
		
		$offset = 0;
		
		$lastTokenPatternKey = $this->getLastTokenPatternKey();
		
		while(1) {
			foreach($this->TOKENS as $tokenType => $tokenRegex) {
				
				/**
				echo 'preg_match(\''.$tokenRegex.'\', "'.$this->mString.'");'."\n";
				echo ((int) (preg_match($tokenRegex, substr($this->mString, $offest)))).';'."\n";
				/**/
				
				if(preg_match($tokenRegex, substr($this->string, $offset), $matches)) {
					
					$offset += strlen($matches[0]);
					
					/**
					echo '==> "'.substr($this->string, $offset).'";'."\n\n";
					/**/
					
					if(sizeof($matches) == 1) {
						if($tokenType != 'whitespace') {
							$store = array(
								'type' => $tokenType,
							);
							$this->bank[] = $store;
						}
						continue 2;
					}
					else {
						$this->bank[] = array(
							'type'  => $tokenType,
							'value' => $matches[1],
						);
						continue 2;
					}
				}
				else {
					if($tokenType == $lastTokenPatternKey) {
						if($offset == strlen($this->string)) {
							break 2;
						}
						else {
							$lines = preg_split("/\n/",$this->string, 0, $offset);
							echo 'Error at line `'.count($lines).'`'."\n";
							//echo $this->string;
							die('Symbol not allowed: '.substr($this->string, $offset, 1));
						}
					}
				}
			}
		}
		
		$this->bank[] = array('type' => 'eof');
		
		return true;
	}
}



class Property {
	var $lhs = null;
	var $rhs = null;
	
	function __construct($lhs, $rhs) {
		$this->lhs = $lhs;
		$this->rhs = $rhs;
	}
}


class Lexer {
	
	var $parseTree = array();
	var $scanner = null;
	
	function __construct($scanner) {
		$this->scanner = $scanner;
		$this->analyze();
	}
	
	public function getParseTree() {
		return $this->parseTree;
	}
	
	private function nextToken() {
		$token = $this->scanner->nextToken();
		if($token == Scanner::EOF) {
			die('Was not expecting EOF');
		}
		return $token;
	}
	
	private function getValueAndConsume($type=null) {
		$token = $this->scanner->nextToken();
		$this->consume($type);
		$value = $token['value'];
		return $value;
	}
	
	private function assert($args) {
		$token = $this->scanner->nextToken();
		
		foreach($args as $type) {
			if($token['type'] == $type) {
				$found = true;
				break;
			}
		}
		
		if(!$found) {
			die('Expecting '.implode(' or ',$args).'. Found '.$token['type'].' instead.');
		}
		
		return $token;
	}
	
	private function consume($type1=null) {
		$token = $this->scanner->nextToken();
		if($type1 != null) {
			$args = $type1;
			$found = false;
			if(!is_array($args)) $args = array($args);
			$this->assert($args);
		}
		$this->scanner->consume();
		return $token;
	}
	
	
	var $PRECEDENCE = array(
		'plus'    => 1,
		'minus'   => 1,
		'times'   => 2,
		'divides' => 2,
		'dot'     => 3,
	);
	
	var $RIGHT = array(
		'dot' => true,
		//'times' => true,
	);
	
	var $operators = array(
		'dot','plus','minus','times','divides'
	);
	
	var $values = array(
		'name','word','number','sstring','dstring'
	);
	
	
	private function pexpression($lhs, $minp, $tree=array()) {
		while(1) {
			$token = $this->nextToken();
			
			if($token['type'] == 'comma' || $token['type'] == 'closeparen' || $token['type'] == 'closebracket') {
				break;
			}
			
			$op = $this->assert($this->operators);
			$opPrec = $this->PRECEDENCE[$op['type']];
			
//			echo 'the next token is '.$op['type'].', with precedence '.$opPrec.'.';
			
			if($opPrec >= $minp) {
				
				$this->consume();
				
//				echo 'the while loop is entered.'."\n";
				
				$rhs = $this->consume($this->values);
				
//				echo 'op is '.$op['type'].' (precedence '.$opPrec.')'."\n";
				
//				echo 'rhs is '.$rhs['value']."\n";
				
				while(1) {
					
					$token = $this->nextToken();
					
					if($token['type'] == 'comma' || $token['type'] == 'closeparen') {
//						echo 'breaking on comma';
						break;
					}
					
					
					$lookahead = $this->assert($this->operators);
					$lookaheadType = $lookahead['type'];
					$lookaheadPrec = $this->PRECEDENCE[$lookaheadType];
					
//					echo 'the next token is '.$lookaheadType.', with precedence '.$lookaheadPrec.'.';
					
					if($lookaheadPrec > $opPrec || ($this->RIGHT[$lookaheadType] && $lookaheadPrec == $opPrec)) {
//						echo 'recursive invocation.'."\n";
						$rhs = $this->pexpression($rhs,$lookaheadPrec);
//						echo '--- consuming token: ';
//						var_dump($this->nextToken());
						
					}
					else {
//						echo "no recursive invocation\n";
						break;
					}
				}
				
				$lhs = array(
					$lhs,
					$op,
					$rhs
				);
				
//				echo 'lhs is assigned '.print_r($lhs,true)."\n";
			}
			else {
//				echo 'the while loop is broken'."\n";
				break;
			}
		}
		
//		print_r($lhs);
//		echo 'is returned.'."\n";
		return $lhs;
	}
	
	private function expression($tree=array()) {
		
		$token = $this->nextToken();
		
		$this->consume();
		return $this->pexpression(array($token), 0);
	}
	
	
	
	private function _array($tree=array()) {
		while(1) {
			$token = $this->nextToken();
			
			if($token['type'] == 'closebracket') {
				$this->consume();
				return $tree;
			}
			
			if($token['type'] == 'function') {
				$tree[] = $this->_function();
				$this->consume('comma');
				continue;
			}
			
			$token = $this->assert($this->values);
			$tree[] = $this->expression();
			
			$token = $this->nextToken();
			if($token['type'] == 'closebracket') {
				$this->consume();
				return $tree;
			}
			
			$this->consume('comma');
		}
	}
	
	private function _function() {
		$method = $this->consume('function');
		$method['value'] = substr($method['value'],0,-1);
		
		$args = array();
		
		while(1) {
			$arg = $this->consume();
			if($arg['type'] == 'closeparen') {
				break;
			}
			$args[] = $this->pexpression(array($arg), 0);
			$token = $this->nextToken();
			if($token['type'] == 'comma') {
				$this->consume();
			}
		}
		
		return array(
			'name' => $method,
			'args' => $args,
		);
	}
	
	
	private function object() {
		
		// consume the variable name followed by a colon
		$declarationName = $this->getValueAndConsume('word');
		$this->consume('colon');
		
		// prepare an array for the object's children
		$children = array();
		
		$token = $this->nextToken();
		
		$type = 'object';
		
		switch($token['type']) {
			
			case 'openbrace':
				$this->consume();
				
				while(1) {
					$children[] = $this->object();
					
					$token = $this->nextToken();
					switch($token['type']) {
						
						case 'closebrace':
							$this->consume();
							$this->consume('comma');
							break 2;
							
						case 'word':
							continue 2;
							
						case 'comma':
							$this->consume();
							break 2;
							
						default:
							die('Unexpected '.$token['type'].'.');
					}
				}
				
				break;
			
			case 'name':
			case 'word':
			case 'number':
			case 'sstring':
			case 'dstring':
				$children = $this->expression();
				$this->consume('comma');
				$type = 'variable';
				break;
				
			case 'function':
				$children = $this->_function();
				$this->consume('comma');
				$type = 'call';
				break;
				
			case 'openbracket':
				$this->consume();
				$children = $this->_array();
				$this->consume('comma');
				$type = 'array';
				break;
			
			default:
				die('Unexpected '.$token['type'].'.');
		}
		
		return array(
			'type' => $type,
			'name' => $declarationName,
			'children' => $children,
		);
	}
	
	
	private function analyze() {
		$scanner = $this->scanner;
		
		while(1) {
			$token = $this->nextToken();
			switch($token['type']) {
				
				case 'eof':
					break 2;
					
				default:
					$this->parseTree[] = $this->object();
					break;
			}
		}
	}
}


class Parser {
	
	var $OPERATORS = array(
		'plus','minus',
		'times','divides',
		'dot'
	);
	
	var $parseTree = null;
	
	var $globals = array();
	var $currentGlobal;
	
	function __construct($lexer) {
		$this->parseTree = $lexer->getParseTree();
		$this->parse(0, $this->parseTree, $this->globals);
	}
	
	function getGlobals() {
		return $this->globals;
	}
	
	
	function getValues($values=array(), $scope=null) {
		if($scope == null) $scope = $this->globals;
		foreach($scope as $key=> $node) {
			if(isset($node['type']) && isset($node['value'])) {
				$unit = $node['unit']? $node['unit']: '';
				$values[$key] = $node['value'].$unit;
			}
			else if($key !== ' isObject') {
				$values[$key] = $this->getValues(array(), $node);
			}
		}
		return $values;
	}
	
	
	function parse($level, $tree, &$scope=array()) {
		
		foreach($tree as $object) {
			
			$name     = $object['name'];
			$children = $object['children'];
			
			if($level == 0) {
				$this->currentGlobal = $name;
			}
			
			switch($object['type']) {
				
				case 'object':
					
					if(!isset($scope[$name])) {
						$scope[$name] = array();
					}
					
					$subject = $this->parse($level+1, $children, $scope[$name]);
					
					if(isset($scope[$name])) {
						foreach($subject as $keyName => $subjectItem) {
							$scope[$name][$keyName] = $subjectItem;
						}
					}
					else {
						$scope[$name] = $subject;
					}
					
					$scope[$name][' isObject'] = true;
					
					break;
					
					
				case 'variable':
					$variable = $this->compute($children, $scope);
					$scope[$name] = $variable;
					break;
				
					
				case 'array':
					$string = '';
					foreach($children as $child) {
						$string .= $this->stringify(
							$this->compute($child, $scope)
						);
					}
					$scope[$name] = array(
						'type' => 'string',
						'value' => $string,
					);
					break;
					
				case 'call':
					$scope[$name] = $this->call($children, $scope);
					break;
				
			}
			
		}
		
		return $scope;
	}
	
	function call($func, $scope) {
		$method = $func['name']['value'];
		if(!isset(GlobalFunctions::$has[$method])) {
			die('Method '.$method.' is not defined.');
		}
		$params = array();
		foreach($func['args'] as $arg) {
			$params []= $this->compute($arg, $scope);
		}
		$value = GlobalFunctions::$method($params);
		return $value;
	}
	
	function stringify($set) {
		$string = $set['value'];
		if($set['unit']) $string .= $set['unit'];
		return $string;
	}
	
	function resolve($set, $scope) {
		$metric = '/^(\\d+(?:\\.\\d+)?|\\.\\d+)(%|\w*)$/';
		
		$value = $set['value'];
		
		switch($set['type']) {
				
			case 'number':
				return $set;
				
				
			case 'name':
			case 'word':
				$names = preg_split('/\\./', $value);
				
				$first = 0;
				if($names[0] == 'this') {
					$first = 1;
					//$scope = $this->globals[$this->currentGlobal];
//					echo 'global["'.$this->currentGlobal.'"]='; print_R($scope); echo "\n";
				}
				else {
					$scope = $this->globals;
				}
				
				for($i=$first; $i<sizeof($names); $i++) {
					$ref = $scope[$names[$i]];
					if(!isset($ref)) {
						echo "^^^^^^^^^^^^";
						var_dump($scope);
						echo '"'.implode('.',array_slice($names,0,$i+1)).'" is not declared before it is used.';
						exit;
					}
					$scope = $ref;
				}
				
				return $scope;
				
				
			case 'sstring':
			case 'dstring':
				if(preg_match($metric, $value, $match)) {
					return array(
						'type' => 'number',
						'value' => $match[1],
						'unit' => $match[2],
					);
				}
				else {
					$set['type'] = 'string';
					return $set;
				}
				
			case 'call':
				var_dump($set);
				exit;
				break;
			
			default:
				die('type not supported: '.$set['type']);
				break;
		}
	}
	
	function compute($list, &$scope) {
		
		if(sizeof($list) == 3) {
			
			$op = $list[1];
			
			
			$lhs = $list[0];
			if(!isset($lhs['type'])) {
				$lhs = $this->compute($lhs, $scope);
			}
			
			$lhs = $this->resolve($lhs, $scope);
			if($lhs['type'] != 'number') {
				die('Operator '.$op['type'].' cannot be applied to '.$lhs['type'].'.');
			}
			
			
			$rhs = $list[2];
			if(!isset($rhs['type'])) {
				$rhs = $this->compute($rhs, $scope);
			}
			
			$rhs = $this->resolve($rhs, $scope);
			if($rhs['type'] != 'number') {
				die('Operator '.$op['type'].' cannot be applied to '.$rhs['type'].'.');
			}
			
			
			switch($op['type']) {
				case 'plus':
					$value = $lhs['value'] + $rhs['value'];
					break;
				case 'minus':
					$value = $lhs['value'] - $rhs['value'];
					break;
				case 'times':
					$value = $lhs['value'] * $rhs['value'];
					break;
				case 'divides':
					$value = $lhs['value'] / $rhs['value'];
					break;
				default:
					die('Expecting arithmetic operator. Found '.$op['type'].' instead');
					break;
			}
		
			return array(
				'type' => 'number',
				'value' => $value,
				'unit' => shareUnits($lhs, $rhs),
			);
			
		}
		else if($list['name'] && $list['args']) {
			return $this->call($list, $scope);
		}
		else if(sizeof($list) == 1) {
			return $this->resolve($list[0], $scope);
		}
		
	}
}



class Lookup {
	
	var $defs = array(
		'fontSize' => 'font-size',
		'fontSize' => 'font-size',
	);
	
	var $globals;
	
	var $namespace_regex = array(
		'/\\./' => '\\\\.',
		'/\\$/' => '\\\\$',
	);
	
	function __construct($parser) {
		$this->globals = $parser->getGlobals();
	}
	
	private function fix_regex($name) {
		return preg_replace(
			array_keys($this->namespace_regex),
			array_values($this->namespace_regex),
			$name
		);
	}
	
	function has($name) {
		$names = preg_split('/\\./',$name);
		
		$node = $this->globals;
		foreach($names as $word) {
			if(!isset($node[$word])) {
				return false;
			}
			$node = $node[$word];
		}
		return true;
	}
	
	function gen($name) {
		$names = preg_split('/\\./',$name);
		
		$node = $this->globals;
		foreach($names as $word) {
			if(!isset($node[$word])) {
				die('Cannot generate rules for non-existing property '.$name.'.');
			}
			$node = $node[$word];
		}
		
		if($node['type']) {
			$unit = $node['unit']? $node['unit']: '';
			return $node['value'].$unit.';';
		}
		
		$str = array();
		foreach($node as $key => $rule) {
			
			if($rule[' isObject'] == true) continue;
			if($key == ' isObject') continue;
			if(preg_match('/^\\$/', $key)) continue;
			
			$key = preg_replace('/^([a-z\\-]+)([A-Z])/e', "'\\1'.'-'.strtolower('\\2')", $key);
			$unit = $rule['unit']? $rule['unit']: '';
			
			switch($key) {
				case 'user-select':
				case 'transition':
				case 'box-shadow':
					$str []= $key.': '           .$rule['value'].$unit.';';
					$str []= '-moz-'.$key.': '   .$rule['value'].$unit.';';
					$str []= '-webkit-'.$key.': '.$rule['value'].$unit.';';
					$str []= '-o-'.$key.': '     .$rule['value'].$unit.';';
					$str []= '-ms-'.$key.': '   .$rule['value'].$unit.';';
					break;
				default:
					if($rule['type'] === 'browser-specific') {
						foreach($rule['value'] as $rkey => $rval) {
							$str []= $key.': '.$rkey.'('.$rval.');';
						}
					}
					else {
						$str []= $key.': '.$rule['value'].$unit.';';
					}
					break;
			}
			
		}
		
		return implode("\n\t",$str);
	}
	
	function replaceRules($css) {
			
		while((preg_match('/{[^@]*@(\\w+(?:\\.[a-z_$]+)*);/i', $css, $match, PREG_OFFSET_CAPTURE)) != null) {
			
			$name = $match[1][0];
			
			if($this->has($name)) {
				$css = preg_replace('/@'.$this->fix_regex($name).';/', $this->gen($name), $css, 1);
			}
			else {
				die($name.' was not declared.');
			}
		}
		
		return $css;
		
	}
}
?>