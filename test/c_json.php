<?php

use LFPhp\Logger\Logger;
use LFPhp\Logger\LoggerLevel;
use LFPhp\Logger\Output\ConsoleOutput;
use LFPhp\Logger\Output\FileOutput;

include __DIR__.'/vendor/autoload.php';
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
			}  else {
				$ua_map[$matches[1]] += 1;
			}
		} else {
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

$result_fp = fopen(__DIR__.'/1.result', 'w+');
foreacH($ua_map as $ua=>$count){
	fwrite($result_fp, $ua.','.$count.PHP_EOL);
}
fclose($result_fp);