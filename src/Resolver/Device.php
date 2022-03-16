<?php

namespace LFPhp\UA\Resolver;

use LFPhp\UA\ResolverInterface;
use LFPhp\UA\UAHelper;

/**
 * 设备类型
 */
class Device implements ResolverInterface {
	const DEVICE_PC = 'DEV_PC';
	const DEVICE_MOBILE = 'DEV_MOBILE';
	const DEVICE_TABLET = 'DEV_TABLET';
	const DEVICE_TV = 'DEV_TV';
	const DEVICE_WATCH = 'DEV_WATCH';
	const DEVICE_EXT = 'DEV_EXT';

	const DEVICE_MAP = [
		self::DEVICE_PC     => 'PC',
		self::DEVICE_MOBILE => 'Mobile',
		self::DEVICE_TABLET => 'Tablet',
		self::DEVICE_TV     => 'TV',
		self::DEVICE_WATCH  => 'Watch',
		self::DEVICE_EXT    => 'Ext',
	];

	public static function resolve($ua, &$model = ''){
		if(OS::resolve($ua) === OS::OS_ANDROID && UAHelper::matched('GoogleTV', $ua)){
			return self::DEVICE_TV;
		}

		if(UAHelper::matched([
			'WoPhone',
			'BlackBerry',
			'MIDP',
			'IEMobile',
			'Windows CE',
			'Windows Phone',
			'WP7',
			'Opera Mobi',
			'Opera Mini;',
			'UCWEB',
			'/^Mozilla\/5.0 \((?:Nokia|NOKIA)(?:\s?)([^\)]+)\)UC AppleWebkit\(like Gecko\) Safari\/530$/',
			'/\((?:LG[-|\/])(.*) (?:Browser\/)?AppleWebkit/'
		], $ua)){
			return self::DEVICE_MOBILE;
		}

		if(UAHelper::matched(['RIM Tablet OS', 'PlayBook', 'Grid OS', 'Opera Tablet'], $ua)){
			return self::DEVICE_TABLET;
		}

		if(UAHelper::matched('(?:web|hpw)OS', $ua)){
			if(UAHelper::matched(['Emulator\/', 'Desktop\/'], $ua)){
				return self::DEVICE_EXT; //simulator
			}
			return self::DEVICE_MOBILE;
		}

		if(UAHelper::matched([
			'/Series[ ]?60/',
			'Symbian',
			'Series40',
			'S60',
			'MeeGo',
			'Maemo',
			'Tizen',
			'/BREW/',
			'BMP; U',
			'/[b|B]ada/',
			'/\(MTK;/',   //MTK
			'QNX',
		], $ua)){
			return self::DEVICE_MOBILE;
		}
		if(UAHelper::matched(['CrOS', 'OS\/2; Warp', 'AmigaOS', 'MorphOS', 'Joli OS', 'Haiku'], $ua)){
			return self::DEVICE_PC;
		}
		if(UAHelper::matched('Kindle', $ua) && !UAHelper::matched('Fire', $ua)){
			return self::DEVICE_EXT; //kindle
		}
		if(UAHelper::matched([
			'SMART-TV',
			'/SonyDTV|SonyBDP|SonyCEBrowser/',
			'NETTV',
			'/LG NetCast\.(?:TV|Media)-([0-9]*)/',
			'LGSmartTV',
			'mbxtWebKit',
			'InettvBrowser',
			'Opera TV',
			'Opera-TV'
		], $ua)){
			return self::DEVICE_TV;
		}

		return self::DEVICE_EXT;
	}
}