<?php

$data = file_get_contents('winter.2012.txt');

echo preg_replace('~%([0-9a-f]{2})~ei', 'chr(hexdec("\\1"))', $data);
?>