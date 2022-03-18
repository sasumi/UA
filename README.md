# PHP 解析浏览器UA库
> 由于浏览器、系统、设备等不断更新，使用该库解析最新浏览器用户标识可能会出现错误识别等情况
> 如果有相关的问题，欢迎到 https://github.com/sasumi/ua 提issue，作者会尽快核实修复您
> 提到的问题。

## 快速入门
[安装]
```shell script
composer require lfphp/ua
```

[使用]
```php
use LFPhp\UA\Resolver\Browser;
use LFPhp\UA\Resolver\Device;

$ua = $_SERVER['HTTP_USER_AGENT'];
list($device, $vendor, $version, $type) = Device::resolve($ua);
var_dump($device, $vendor, $version, $type);
list($browser, $version) = Browser::resolve($ua);
var_dump($browser, $version);
```