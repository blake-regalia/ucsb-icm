<?php


/**

@(`lastName`='regalia' or `firstName`='blake')

**/

class sql_shorthand {

	private $shorthand_str = '';

	private $failed = false;
	private $error = '';
	private $errsrc = 0;
	
	private $select = '*';
	private $sql = '';
	
	private function err($pos, $type, $say='') {
	
		switch($type) {
		
			case 'fn':
				$this->error = 'no function was given';
				break;
				
			case 'fnf':
				$this->error = 'function not found: '.$say;
				break;
				
			case 'se':
				$this->error = 'syntax error: '.$say;
				break;
				
			case 'ecn':
				$this->error = 'field name cannot be empty: ``';
				break;
			
			case 'onf':
				$this->error = 'operator not found: '.$say;
				break;
				
			case 'ue':
				$this->error = 'unimplemented: '.$say;
				break;
		}
		
		$this->errsrc = $pos;
		$this->failed = true;
	}
	
	function failed() {
		return $this->failed;
	}
	
	function error() {
		$out = $this->shorthand_str."\n";
		for($i=0; $i<$this->errsrc; $i++) {
			$out .= '-';
		}
		$out .= '^'."\n";
		return $out.$this->error;
	}
	
	function sql() {
		return array(
			'select' => $this->select,
			'how' => $this->sql,
		);
	}
	
	function __construct($str) {
		$this->shorthand_str = $str;
		
		$mode = 'func';
		$strlen = strlen($str);
		
		$vars = array();
		$expr = array();
		$stmt = array();
		$selw = array();
		
		$escape = false;
		$fname = '';
		$cname = '';
		$oper  = '';
		$value = '';
		$wrap  = '';
		
		for($i=0; $i<$strlen; $i++) {
			$chr = $str[$i];
			
			switch($mode) {
			
				case 'func':
					switch($chr) {
						case '@':
							$fname = 'WHERE'; break;
						case '+':
							$fname = 'SUM'; break;
						case '#':
							$fname = 'RETURN'; break;
						case '(':
							switch($fname) {
								case 'WHERE':
								case 'SUM':
								case 'RETURN':
									$mode = 'body-pre-column';
									break;
								default:
									if(!strlen($fname))	$this->err($i,'nfg');
									else				$this->err($i,'fnf',$fname);
									return;
							}
							break;
							
						case '{':
							switch($fname) {
								case 'RETURN':
									$mode = 'json-format';
									break;
							}
							break;
							
						case '[':
							$fname = 'C';
							break;
							
						default:
							$fname .= $chr;
							break;
					}
					break;
				
				case 'body-pre-column':
					switch($chr) {
						case ' ': continue;
						
						case '_':
							if($fname != 'WHERE') return $this->err($i,'se','cannot use LENGTH function (_) inside '.$fname.' clause');
							if(strlen($wrap)) return $this->err($i,'se','repetition of LENGTH function character (_)');
							$wrap = 'LENGTH';
							break;
							
						case '`':
							if(strlen($rltv)) {
								$expr [] = $rltv;
							}
							$mode = 'body-column';
							break;
							
						case ')':
							if(strlen($rltv)) {
								return $this->err($i,'se','cannot have relational operator ('.$rltv.') at end of function body');
							}
							switch($fname) {
							
								case 'WHERE':
									$stmt []= 'WHERE ('.implode('', $expr).')';
									break;
									
								case 'RETURN':
									break;
									
								default:
									return $this->err($i,'ue','no handler for '.$fname.' function');
							}
							
							$mode = 'func';
							// ****
							// TODO
							// ****
							break;
							
						default:
							return $this->err($i,'se','expecting backtick operator(`) after open parenthesis; found ('.$chr.')');
					}
					
						$rltv = '';
						$cname = '';
						$oper  = '';
						$value = '';
					break;
				
				case 'body-column':
					switch($chr) {
						case '`':
							if(!strlen($cname)) return $this->err($i,'ecn');
							$mode = 'body-operator';
							break;
							
						default: 
							$cname .= $chr;
							break;
					}
					break;
					
				case 'body-operator':
					switch($chr) {
						case ' ': continue;
						
						case '\'':
							switch(strtolower($oper)) {
								case '=':
								case '!=':
								case '>':
								case '<':
								case 'like':
								case 'regexp':
								case 'not-like':
								case 'not-regexp':
									$mode = 'body-value';
									break;
									
								default:
									return $this->err($i,'onf',$oper);
							}
							break;
							
						case ',':
						case ';':
						case '&':
						case '^':
							$mode = 'body-post-value';
							$i -= 1;
							break;
							
						case ')':
							if(strlen($oper)) {
								return $this->err($i,'se','expecting value after relational operator. if you are using numbers, they need to be in single-quotes (\'); found('.$oper.')');
							}
							else {
								$mode = 'body-post-value';
								$i -= 1;
							}
							break;
							
						default:
							$oper .= $chr;
							break;
					}
					break;
				
				case 'body-value':
					if($escape) {
						$value .= $chr;
						$escape = false;
						continue;
					}
					switch($chr) {
					
						case '\\':
							$escape = true;
							break;
							
						case '\'':
							$mode = 'body-post-value';
							break;
							
						default:
							$value .= $chr;
							break;
					}
					break;
					
				case 'body-post-value':
					switch($fname) {
					
						case 'WHERE':
							if(strlen($oper)) {
								if(strlen($wrap)) {
									$expr []= $wrap.'(`'.$cname.'`) '.$oper.' \''.$value.'\'';
								}
								else {
									$expr []= '`'.$cname.'` '.$oper.' \''.$value.'\'';
								}
							}
							else {
								if(strlen($wrap)) {
									$expr []= $wrap.'(`'.$cname.'`) != \'\'';
								}
								else {
									$expr []= '`'.$cname.'` != \'\'';
								}
							}
							$wrap = '';
							switch($chr) {
								case ',': $rltv = ' AND '; break;
								case '&': $rltv = ') AND ('; break;
								case '.': $rltv = ' OR '; break;
								case ';': $rltv = ') OR ('; break;		
								case ')': $i -= 1; break;
								default: return $this->err($i,'se','field/value pairs must terminate with a comma(,), semi-colon(;), ampercand(&) or close-parenthesis()). symbol found: ('.$chr.')');
							}
							$mode = 'body-pre-column';
							break;
							
						case 'RETURN':
							if($chr !== ')' && $chr !== ',') return $this->err($i,'se',$fname.' function only allows comma delimeters. ('.$chr.') not allowed');
							if(strlen($oper)) return $this->err($i,'se',$fname.' function does not accept values, only a comma separated list of column names');
							$selw []= '`'.$cname.'`';
							$mode = 'body-pre-column';
							break;
							
						default:
							return $this->err($i,'ue','nothing to do yet for that function');
					}
					break;
			
				case 'json-format':
					return $this->err($i-1,'ue','json-format');
					break;
			}
		}
		
		$this->sql = implode(' AND ',$stmt);
		$this->select = count($selw)? implode(',',$selw): '*';
	}
}

?>