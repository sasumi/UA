<?php

namespace LFPhp\UA\Resolver;

use LFPhp\UA\ResolverInterface;
use LFPhp\UA\UAHelper;

/**
 * 操作系统
 */
class OS implements ResolverInterface {
	const OS_UNIX = 'OS_UNIX';
	const OS_WINDOWS = 'OS_WINDOWS';
	const OS_ANDROID = 'OS_ANDROID';
	const OS_IOS = 'OS_IOS';
	const OS_MAC_OS = 'OS_MAC_OS';
	const OS_UNKNOWN = 'OS_UNKNOWN';

	const OS_MAP = [
		self::OS_UNIX    => 'OS_*NIX',
		self::OS_WINDOWS => 'Windows',
		self::OS_ANDROID => 'Android',
		self::OS_IOS     => 'iOS',
		self::OS_MAC_OS  => 'MacOS',
		self::OS_UNKNOWN => 'Unknown',
	];

	public static function resolve($ua, &$version = ''){
		if(UAHelper::matched([
			'Linux',
			'Unix',
			'FreeBSD',
			'OpenBSD',
			'NetBSD',
			'SunOS',
		], $ua)){
			return self::OS_UNIX;
		}
		if(UAHelper::matched([
			"'iPhone( Simulator)?;'",
			'iPad;',
			'iPod;',
			'Safari',
			'/iPhone\s*\d*s?[cp]?;/i',
		], $ua)){
			return self::OS_IOS;
		}

		if($version = UAHelper::matched('/^IUC \(U;\s?iOS ([0-9\.]+);/', $ua)){
			return self::OS_IOS;
		}

		if(UAHelper::matched('Mac OS X', $ua)){
			return self::OS_MAC_OS;
		}
		if(UAHelper::matched('Windows', $ua)){
			return self::OS_WINDOWS;
		}
		if(UAHelper::matched([
			'Android',
			'nook browser',
		], $ua)){
			return self::OS_ANDROID;
		}
		if(UAHelper::matched('/(M?QQBrowser)\/([0-9.]*)/', $ua) && preg_match('/(M?QQBrowser)\/([0-9.]*)/', $ua, $ms)){
			return self::OS_WINDOWS;
		}

		if($version = UAHelper::matched('/^JUC \(Linux; U; ([0-9\.]+)[^;]*; [^;]+; ([^;]*[^\s])\s*; [0-9]+\*[0-9]+\)/', $ua)){
			return self::OS_ANDROID;
		}

		if(UAHelper::matched('BlackBerry', $ua)){
			return self::OS_UNKNOWN;
		}
		if(UAHelper::matched(['/Series[ ]?60/', 'Symbian', 'S60'], $ua)){
			return self::OS_UNKNOWN; //塞班
		}

		return self::OS_UNKNOWN;
	}
}