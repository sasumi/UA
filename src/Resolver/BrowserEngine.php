<?php

namespace LFPhp\UA\Resolver;

use LFPhp\UA\ResolverInterface;
use LFPhp\UA\UAHelper;

/**
 * 浏览器
 */
class BrowserEngine implements ResolverInterface {
	const BROWSER_ENGINE_WEBKIT = 'BROWSER_ENGINE_WebKit';
	const BROWSER_ENGINE_KHTML = 'BROWSER_ENGINE_KHTML';
	const BROWSER_ENGINE_GECKO = 'BROWSER_ENGINE_GECKO';
	const BROWSER_ENGINE_PRESTO = 'BROWSER_ENGINE_PRESTO';
	const BROWSER_ENGINE_TRIDENT = 'BROWSER_ENGINE_TRIDENT';

	public static function resolve($ua, &$version = ''){
		if($version = UAHelper::matched(['/Browser\/AppleWebKit([0-9.]*)/i', '/WebKit\/([0-9.]*)/i'], $ua)){
			return self::BROWSER_ENGINE_WEBKIT;
		}
		if($version = UAHelper::matched('/KHTML\/([0-9.]*)/', $ua)){
			return self::BROWSER_ENGINE_KHTML;
		}
		if(UAHelper::matched('/Gecko/', $ua) && !UAHelper::matched('/like Gecko/i', $ua)){
			$version = UAHelper::matched('/; rv:([^\)]+)\)/', $ua);
			return self::BROWSER_ENGINE_GECKO;
		}
		if($version = UAHelper::matched('/Presto\/([0-9.]*)/', $ua)){
			return self::BROWSER_ENGINE_PRESTO;
		}
		if($version = UAHelper::matched('/Trident\/([0-9.]*)/', $ua)){
			return self::BROWSER_ENGINE_TRIDENT;
		}
	}
}