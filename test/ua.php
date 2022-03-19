<?php

use LFPhp\UA\UAHelper;

include __DIR__.'/../vendor/autoload.php';
//$rst = UAHelper::resolveAll('Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.25 Safari/537.36 Core/1.70.3861.400 QQBrowser/10.7.4313.400,2');
//var_dump($rst);

$str = file_get_contents(__DIR__.'/1.json');
$data = json_decode($str, true);
$ret = [];

foreach($data as $k=> $row){
	$tmp = UAHelper::resolveAll($row['ua']);
	echo $row['ua'], PHP_EOL;
	var_dump($tmp);
	echo "=================", PHP_EOL;
	$tmp['ua'] = $row['ua'];
	$tmp['count'] = $row['count'];
	$ret[] = $tmp;
}

file_put_contents(__DIR__.'/2.ret.json', json_encode($data, JSON_UNESCAPED_UNICODE));
echo 'done';