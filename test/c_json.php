<?php

use LFPhp\Logger\Logger;
use LFPhp\Logger\LoggerLevel;
use LFPhp\Logger\Output\ConsoleOutput;
use LFPhp\Logger\Output\FileOutput;
use LFPhp\UA\Resolver\Browser;
use LFPhp\UA\Resolver\BrowserEngine;
use LFPhp\UA\Resolver\Device;
use LFPhp\UA\Resolver\OS;

include __DIR__.'/../vendor/autoload.php';
Logger::registerGlobal(new ConsoleOutput(), LoggerLevel::DEBUG);
Logger::registerGlobal(new FileOutput(__DIR__.'/1.error.log'), LoggerLevel::WARNING);

$fp = fopen(__DIR__.'/1.json', 'r');
$line = 0;
$ua_map = [];
while($row_str = fgets($fp)){
	$line++;
	$row_str = trim($row_str);
	if(!strlen($row_str)){
		Logger::info('empty row: #'.$line);
		continue;
	}
	$tmp = json_decode($row_str, true);
	if(json_last_error()){
		Logger::warning('json parser fail #'.$line, $row_str);
		continue;
	}

	if(isset($tmp['LogParseFailure']) && $tmp['LogParseFailure']){
		if(preg_match('/\s+"(Mozilla[^\"]+)"/', $tmp['LogParseFailure'], $matches)){
			if(!isset($ua_map[$matches[1]])){
				$ua_map[$matches[1]] = 1;
			}else{
				$ua_map[$matches[1]] += 1;
			}
		}else{
			Logger::error('String parse faild', $tmp['LogParseFailure']);
		}
		continue;
	}

	if(isset($tmp['http_user_agent']) && $tmp['http_user_agent']){
		if(!isset($ua_map[$tmp['http_user_agent']])){
			$ua_map[$tmp['http_user_agent']] = 1;
		}else{
			$ua_map[$tmp['http_user_agent']] += 1;
		}
	}
}

$ua_map = [];

$p2 = file_get_contents(__DIR__.'/2.csv');
$tmp = explode("\n", $p2);
foreach($tmp as $row){
	if(preg_match("/^(.*),([^,]+)$/", $row, $m)){
		$ua_map[trim($m[1], '"')] = (int)$m[2];
	} else {
		Logger::error('Row ERR.'.$row);
	}
}

$ret = [];
foreach($ua_map as $ua => $count){
	$ret[] = [
		'ua'      => $ua,
		'os'      => OS::resolve($ua, $os_v),
		'os_version' => $os_v,
		'browser' => Browser::resolve($ua, $b_v),
		'browser_version'=>$b_v,
		'engine'  => BrowserEngine::resolve($ua, $e_v),
		'engine_version' => $e_v,
		'device'  => Device::resolve($ua),
		'count'   => $count,
	];
}

file_put_contents(__DIR__.'/1.ret.json', json_encode($ret, JSON_UNESCAPED_UNICODE));