<?php
include __DIR__.'/../vendor/autoload.php';

$ua = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36 NetType/WIFI MicroMessenger/7.0.20.1781(0x6700143B) WindowsWechat(0x63040026)';
var_dump(\LFPhp\UA\UAHelper::resolveAll($ua));
