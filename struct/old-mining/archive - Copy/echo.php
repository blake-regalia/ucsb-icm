<?php

$data = '';

$data .= print_r($_COOKIE, true);
$data .= print_r($_POST,true);

file_put_contents('regPost.fields.txt', $data);


?>