<?php

use LFPhp\UA\UAHelper;

include __DIR__.'/../vendor/autoload.php';
$rst = UAHelper::resolveAll('Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.25 Safari/537.36 Core/1.70.3861.400 QQBrowser/10.7.4313.400,2');
var_dump($rst);