<?php

namespace LFPhp\UA\Resolver;

use LFPhp\UA\ResolverInterface;

/**
 * 浏览器
 */
class Browser implements ResolverInterface {
	const BROWSER_CHROME = 'BROWSER_CHROME';
	const BROWSER_EDGE = 'BROWSER_EDGE';
	const BROWSER_IE = 'BROWSER_IE';
	const BROWSER_SAFARI = 'BROWSER_SAFARI';
	const BROWSER_FIREFOX = 'BROWSER_FIREFOX';
	const BROWSER_UC = 'BROWSER_UC';
	const BROWSER_UNKNOWN = 'BROWSER_UNKNOWN';
	const BROWSER_XE_APP = 'BROWSER_XE_APP';
	const BROWSER_WX_BUILD_IN = 'BROWSER_WX_BUILD_IN';
	const BROWSER_DY_BUILD_IN = 'BROWSER_DY_BUILD_IN';
	const BROWSER_WEIBO_BUILD_IN = 'BROWSER_WB_BUILD_IN';
	const BROWSER_VERSION = 'BROWSER_VERSION';
	const BROWSER_MAP = [
		self::BROWSER_CHROME         => 'Chrome',
		self::BROWSER_EDGE           => 'Edge',
		self::BROWSER_IE             => 'IE',
		self::BROWSER_SAFARI         => 'Safari',
		self::BROWSER_FIREFOX        => 'Firefox',
		self::BROWSER_UC             => 'UC',
		self::BROWSER_XE_APP         => 'xe_app',
		self::BROWSER_WX_BUILD_IN    => 'wx_build_in',
		self::BROWSER_DY_BUILD_IN    => 'dy_build_in',
		self::BROWSER_WEIBO_BUILD_IN => 'weibo_build_in',
		self::BROWSER_UNKNOWN        => 'Unknown',
	];

	public static function resolve($ua){
		// TODO: Implement resolve() method.
	}
}