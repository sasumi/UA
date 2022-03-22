<?php

use LFPhp\UA\UAHelper;
use function LFPhp\Func\dump;

include __DIR__.'/../vendor/autoload.php';

//H5
$str = file_get_contents(__DIR__.'/h5.csv');
$str = str_replace("\r", "", $str);
$vs_tmp = explode("\n", trim($str));

$h5_ret = [];
foreach($vs_tmp as $row){
	if(preg_match('/^(.*?),(\d+)$/', $row, $matches)){
		$ua = $matches[1];
		$count = $matches[2];
		$t = UAHelper::resolveAll($ua);
		$t['ua'] = $ua;
		$t['count'] = $count;
		$h5_ret[] = $t;
	} else {
		dump($row);
	}
}
echo 'Writing h5 result', PHP_EOL;
file_put_contents(__DIR__.'/h5.result.json', json_encode($h5_ret, JSON_UNESCAPED_UNICODE));

//PC
$str = file_get_contents(__DIR__.'/pc_server.json');
$vs_tmp = explode("\n", $str);
$b_ret = [];
$ua_maps = [];
foreach($vs_tmp as $row){
	$obj = @json_decode($row, true) ?: [];
	foreach($obj as $item){
		if(!isset($obj['http_user_agent'])){
			if(preg_match('/"(Mozilla[^"]+)"/', $obj['LogParseFailure'], $ms)){
				$ua = $ms[1];
				$obj['http_user_agent'] = $ua;
			} else {
				$obj['http_user_agent'] = '';
			}
		}
		$ua_maps[$obj['http_user_agent']] += 1;
	}
}
foreach($ua_maps as $ua=>$count){
	$item = UAHelper::resolveAll($ua);
	$item['ua'] = $ua;
	$item['count'] = $count;
	$b_ret[] = $item;
}

echo 'Writing pc result', PHP_EOL;
file_put_contents(__DIR__.'/pc.result.json', json_encode($b_ret, JSON_UNESCAPED_UNICODE));


//B-Admin
$str = file_get_contents(__DIR__.'/b.json');
$vs_tmp = explode("\n", $str);
$b_ret = [];
$ua_maps = [];
foreach($vs_tmp as $row){
	$obj = @json_decode($row, true) ?: [];
	foreach($obj as $item){
		if(!isset($obj['http_user_agent'])){
			if(preg_match('/"(Mozilla[^"]+)"/', $obj['LogParseFailure'], $ms)){
				$ua = $ms[1];
				$obj['http_user_agent'] = $ua;
			} else {
				$obj['http_user_agent'] = '';
			}
		}
		$ua_maps[$obj['http_user_agent']] += 1;
	}
}
foreach($ua_maps as $ua=>$count){
	$item = UAHelper::resolveAll($ua);
	$item['ua'] = $ua;
	$item['count'] = $count;
	$b_ret[] = $item;
}

echo 'Writing B result', PHP_EOL;
file_put_contents(__DIR__.'/admin.result.json', json_encode($b_ret, JSON_UNESCAPED_UNICODE));