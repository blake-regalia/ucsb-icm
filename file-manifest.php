<?php


class File_manifest {
	
	private static $file_pattern_replacements = array(
		'/\\./' => '\\\\.',
		'/\\-/' => '\\\\-',
		'/\\*/' => '(.*)',
	);
	
	public static function read($manifest_filename) {
		
		// prepare an array of all files to include from the manifest
		$manifest_files = array();
		
		// split the manifest file by newlines
		$manifest = preg_split('/\r?\n/', file_get_contents($manifest_filename), -1, PREG_SPLIT_NO_EMPTY);
		
		// get the pathinfo for the manifest file
		$pathinfo_dirname = pathinfo($manifest_filename, PATHINFO_DIRNAME);
		
		// reference the directory where this file resides
		$parent_dir = realpath($pathinfo_dirname);
		
		// reference the current working directory to change back to later
		$previous_working_dir = getcwd();
		
		// change directory to the manifest file's directory
		chdir($parent_dir);
		
		// prepare to reference all and any files in any directory
		$candidate_files = array();
		
		
		// iterate over every manifest line
		foreach($manifest as $file_pattern) {
			
			// first check if the pattern points to another directory
			$file_path_split = preg_split('/\\//', $file_pattern);
			
			// if another directory is referenced
			if(sizeof($file_path_split) != 1) {
				
				// follow the path
				chdir(
					implode('/',
						array_slice($file_path_split,0,-1)
					)
				);
				
				// only wildcard on the filename portion
				$file_pattern = end($file_path_split);
			}
			
			// reference the current working directory now
			$cwd = getcwd();
			
			// if an array of all files in the cwd doesn't exist yet
			if(!isset($candidate_files[$cwd])) {
				
				// scan all the files in this directory
				$candidate_files[$cwd] = scandir('.');
			}
			
			// translate the wildcard-pattern into regex
			$regex_pattern = '/^'.preg_replace(
				array_keys(self::$file_pattern_replacements),
				array_values(self::$file_pattern_replacements),
				$file_pattern
			).'$/i';
			
			// iterate over every file in this directory
			foreach($candidate_files[$cwd] as $filename) {
				
				// add this file to the 
				if(preg_match($regex_pattern, $filename)) {
					
					// reference the entire path of the matching filename
					$filepath = $cwd.'/'.$filename;
					
					// check if this path hasn't already been added to our manifest list
					if(!in_array($filepath, $manifest_files)) {
						
						// add this path to the manifest list
						$manifest_files []= getcwd().'/'.$filename;
					}
				}
			}
			
			// change back to parent directory in case another path was followed
			chdir($parent_dir);
		}
		
		
		// change back to the original working directory
		chdir($previous_working_dir);
		
		
		// return all this information
		return array(
			'parent_dir' => $parent_dir,
			'manifest_files' => $manifest_files,
		);
	}
	
	
	public static function merge($manifest_filename, $header_format) {
		
		$info = self::read($manifest_filename);
		
		// reference the manifest files
		$manifest_files = $info['manifest_files'];
		
		// get the string length of the parent directory realpath
		$parent_dir_strlen = strlen($info['parent_dir']) + 1;
		
		// prepare an array to merge all the file contents
		$merge = array();
		
		// iterate over every manifest file
		foreach($manifest_files as $filepath) {
			
			// show the start of a file
			$merge []= preg_replace('/%PATH%/', substr($filepath, $parent_dir_strlen), $header_format);
			
			// add the contents to the array
			$merge []= file_get_contents($filepath);
		}
		
		
		// concatenate all the files (merge) into one string
		return implode("\n", $merge);
	}
	
	
	public static function gen($manifest_filename, $echo_format, $glue="\n") {
		
		$info = self::read($manifest_filename);
		
		// reference the manifest files
		$manifest_files = $info['manifest_files'];
		
		// get the string length of the parent directory realpath
		$parent_dir_strlen = strlen($info['parent_dir']) + 1;
		
		// prepare an array to merge all the echo strings
		$echo = array();
		
		// iterate over every manifest file
		foreach($manifest_files as $filepath) {
			
			// show the start of a file
			$echo []= preg_replace('/%PATH%/', substr($filepath, $parent_dir_strlen), $echo_format);
		}
		
		return implode($glue, $echo);
	}
	
}