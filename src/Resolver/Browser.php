<?php

namespace LFPhp\UA\Resolver;

use LFPhp\UA\ResolverInterface;
use LFPhp\UA\UAHelper;

/**
 * 浏览器
 */
class Browser implements ResolverInterface {
	const BROWSER_CHROME = 'BROWSER_CHROME';
	const BROWSER_CHROMIUM = 'BROWSER_CHROMIUM';
	const BROWSER_EDGE = 'BROWSER_EDGE';
	const BROWSER_IE = 'BROWSER_IE';
	const BROWSER_SAFARI = 'BROWSER_SAFARI';
	const BROWSER_FIREFOX = 'BROWSER_FIREFOX';
	const BROWSER_UC = 'BROWSER_UC';
	const BROWSER_OPERA = 'BROWSER_OPERA';
	const BROWSER_360_EXTREME = 'BROWSER_360_EXTREME';
	const BROWSER_UNKNOWN = 'BROWSER_UNKNOWN';
	const BROWSER_XE_APP = 'BROWSER_XE_APP';
	const BROWSER_WX_BUILD_IN = 'BROWSER_WX_BUILD_IN';
	const BROWSER_DY_BUILD_IN = 'BROWSER_DY_BUILD_IN';
	const BROWSER_WEIBO_BUILD_IN = 'BROWSER_WB_BUILD_IN';

	public static function resolve($ua, &$version = ''){
		if(UAHelper::matched('Safari', $ua)){
			$version = UAHelper::matched("/Version\/([0-9\.]+)/", $ua);
			$version = $version ?: UAHelper::matched("/AppleWebKit\/[0-9\.]+\+/", $ua);
			return self::BROWSER_SAFARI;
		}

		if(UAHelper::matched('MSIE', $ua)){
			$version = UAHelper::matched('/MSIE ([0-9.]*)/', $ua);
			return self::BROWSER_IE;
		}

		if(UAHelper::matched('(/Opera/i', $ua)){
			$version = UAHelper::matched('/Opera[\/| ]([0-9.]*)/', $ua);
			$version = $version ?: UAHelper::matched('/Version\/([0-9.]*)/', $ua);
			return self::BROWSER_OPERA;
		}

		if(UAHelper::matched(['Firefox', 'Namoroka', 'Shiretoko', 'Minefield'], $ua)){
			$version = UAHelper::matched('/Firefox\/([0-9ab.]*)/', $ua);
			$version = $version ?: UAHelper::matched('/Namoroka\/([0-9ab.]*)/', $ua);
			$version = $version ?: UAHelper::matched('/Shiretoko\/([0-9ab.]*)/', $ua);
			$version = $version ?: UAHelper::matched('/Minefield\/([0-9ab.]*)/', $ua);
			return self::BROWSER_FIREFOX;
		}

		if($version = UAHelper::matched('/(?:Chrome|CrMo|CriOS)\/([0-9.]*)/', $ua)){
			return self::BROWSER_CHROME;
		}

		if(UAHelper::matched('chromeframe', $ua)){
			//chrome frame
			$version = UAHelper::matched('/chromeframe\/([0-9.]*)/', $ua);
			return self::BROWSER_CHROME;
		}

		if(UAHelper::matched('Chromium', $ua)){
			$version = UAHelper::matched('/Chromium\/([0-9.]*)/', $ua);
			return self::BROWSER_CHROMIUM;
		}

		if(UAHelper::matched(['UCWEB', '/\) UC /'], $ua)){
			$version = UAHelper::matched('/UCWEB([0-9]*[.][0-9]*)/', $ua);
			return self::BROWSER_UC;
		}
		if($version = UAHelper::matched('/UCBrowser\/([0-9.]*)/', $ua)){
			return self::BROWSER_UC;
		}
		if(UAHelper::matched('/(M?QQBrowser)\/([0-9.]*)/', $ua)){
			preg_match('/(M?QQBrowser)\/([0-9.]*)/', $ua, $ms);
			$version = $ms[2];
			if(preg_match('/^[0-9][0-9]$/', $ms[2])){
				$version = $ms[0].'.'.$ms[1];
			}
		}
		if(UAHelper::matched('360EE', $ua)){
			return self::BROWSER_360_EXTREME;
		}

		if($version = UAHelper::matched('/Trident\/([0-9.]*)/', $ua)){
			return self::BROWSER_IE;
		}

		return self::BROWSER_UNKNOWN;
	}
}