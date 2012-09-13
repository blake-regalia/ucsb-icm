<?php

$arr = json_decode(file_get_contents('edu.ucsb.geog.blake/salaries/sacbee.2011.json'), true);
file_put_contents('sacebee.2011.txt', print_r($arr,true));

?>