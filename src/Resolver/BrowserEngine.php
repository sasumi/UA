<?php

namespace LFPhp\UA\Resolver;

use LFPhp\UA\ResolverInterface;
use LFPhp\UA\UAHelper;

/**
 * 解析浏览器引擎
 */
class BrowserEngine implements ResolverInterface {
	private static $rules = [
        ['/windows.+\sedge\/([\w\.]+)/i', 'Edge', '$1'], //EdgeHTML
        [[
            '/(presto)\/([\w\.]+)/i',
			'/(webkit|trident|netfront|netsurf|amaya|lynx|w3m)\/([\w\.]+)/i',
			'/(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i',
			'/(icab)[\/\s]([23]\.[\d\.]+)/i',
        ], '$1', '$2'],
		['/rv\:([\w\.]+).*(gecko)/i', '$2', '$1'],
	];

	/**
	 * @param $ua
	 * @return array [core, version]
	 */
	public static function resolve($ua){
		return UAHelper::matches(self::$rules, $ua);
	}
}