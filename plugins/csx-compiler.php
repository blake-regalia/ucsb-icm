<?php namespace csx;

require "csx.php";

class Compiler {
	
	var $magic = null;
	var $parser = null;
	
	// prepare an array to build the csx string
	var $csx   = array();
	
	// prepare an array to build the css string
	var $css = array();
	

	// creates a new Compiler object
	function __construct($csx_params) {
		
		// store the current working directory before changing it
		$previous_working_dir = getcwd();
		
		// change to the given working directory
		chdir($csx_params['parent_dir']);
		
		// reference the manifest files
		$manifest_files = $csx_params['manifest_files'];
		
		// regex for finding header csx in css files
		$regex_csx_header = '/^\\s*\\/+\\*+\\s*<csx>\\s*\\*+\\/+\\s*(.*)\\/\\*+\\s*<\\/csx>\\s*\\*+\\/+\\s*(.*)$/sm';
		
		// iterate over the manifest files
		foreach($manifest_files as $filename) {
			
			// insert the file name of css file
			$this->css []= "\n\n/************************\n** ".pathinfo($filename,PATHINFO_FILENAME)."\n************************/\n";
			
			// append entire contents of csx files to csx string
			if(preg_match('/\\.csx$/', $filename)) {
				$this->csx []= file_get_contents($filename);
			}
			// append only csx headers of css files to csx string
			else if(preg_match('/\\.css$/', $filename)) {
				$css_contents = file_get_contents($filename);
				if(preg_match($regex_csx_header, $css_contents, $match)) {
					$this->csx []= $match[1];
					$this->css []= $match[2];
				}
				else {
					$this->css []= $css_contents;
				}
			}
		}
		
		// let the magic happen
		$scanner      = new Scanner(implode("\n",$this->csx));
		$lexer        = new Lexer($scanner);
		$this->parser = new Parser($lexer);
		$this->magic  = new Lookup($this->parser);
		
		// change back to the original working dir
		chdir($previous_working_dir);
	}
	
	
	// get the entire structure as a json object
	function get_json() {
		return json_encode($this->parser->getValues());
	}
	
	// generate css
	function output() {
		foreach($this->css as $key => $css_string) {
			$this->css[$key] = $this->magic->replaceRules($css_string);
		}
		return implode("\n", $this->css);
	}
}

?>