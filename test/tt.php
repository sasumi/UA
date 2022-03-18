<?php

use LFPhp\Logger\Logger;
use LFPhp\Logger\LoggerLevel;
use LFPhp\Logger\Output\ConsoleOutput;
use function LFPhp\Func\dump;

include __DIR__.'/../vendor/autoload.php';
Logger::registerGlobal(new ConsoleOutput(), LoggerLevel::DEBUG);
$tmp = file_get_contents(__DIR__.'/1.ret.json');
$obj = json_decode($tmp, true);

$ua = $obj[0]['ua'];

list($os, $ver) = \LFPhp\UA\Resolver\OS::resolve($ua);
dump($os, $ver, 1);

$rst = \LFPhp\UA\UAHelper::resolveAll($ua);
$arr = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS);
dump($ua, $rst, 1);