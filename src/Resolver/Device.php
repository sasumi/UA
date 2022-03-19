<?php

namespace LFPhp\UA\Resolver;

use LFPhp\UA\ResolverInterface;
use LFPhp\UA\UAHelper;

/**
 * 设备类型
 */
class Device implements ResolverInterface {
	const TYPE_CONSOLE = 'Console';
	const TYPE_MOBILE = 'Mobile';
	const TYPE_TABLET = 'Tablet';
	const TYPE_SMART_TV = 'SmartTv';
	const TYPE_WEARABLE = 'Wearable';
	const TYPE_EMBEDDED = 'Embedded';

	private static $rules = [
		//iPad/PlayBook
		['/\((ipad|playbook);[\w\s\);-]+(rim|apple)/i', '$1', '$2', self::TYPE_TABLET],

		['/applecoremedia\/[\w\.]+ \((ipad)/', 'iPad', 'Apple', self::TYPE_TABLET],

		['/(apple\s{0,1}tv)/i', 'Apple TV', 'Apple', self::TYPE_SMART_TV],
		['/applecoremedia\/[\w\.]+ \((ipad)/', 'iPad', 'Apple', self::TYPE_TABLET],

		[[
			'/(archos)\s(gamepad2?)/i', //Archos
			'/(hp).+(touchpad)/i', //HP TouchPad
			'/(hp).+(tablet)/i', //HP Tablet
			'/(kindle)\/([\w\.]+)/i', //Kindle
			'/\s(nook)[\w\s]+build\/(\w+)/i', //Nook
			'/(dell)\s(strea[kpr\s\d]*[\dko])/i', //Dell Streak
		], '$2', '$1', self::TYPE_TABLET],

		['/(kf[A-z]+)\sbuild\/[\w\.]+.*silk\//i', '$1', 'Amazon', self::TYPE_TABLET],

		['/(sd|kf)[0349hijorstuw]+\sbuild\/[\w\.]+.*silk\//i', 'FirePhone', '$1', self::TYPE_MOBILE], //Fire Phone

		[[
			 '/\((iP[honed|\s\w*]+);.+(apple)/i',
			'/\((iP[honed|\s\w*]+);/i',
		], '$1', 'Apple', self::TYPE_MOBILE],

		[[
			'/(blackberry)[\s-]?(\w+)/i',//BlackBerry
			'/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|huawei|meizu|motorola|polytron)[\s_-]?([\w-]+)*/i', //BenQ/Palm/Sony-Ericsson/Acer/Asus/Dell/Huawei/Meizu/Motorola/Polytron
			'/(hp)\s([\w\s]+\w)/i', //HP iPAQ
			'/(asus)-?(\w+)/i',//Asus
		], '$2', '$1', self::TYPE_MOBILE],

		['/\(bb10;\s(\w+)/i', '$1', 'BlackBerry', self::TYPE_MOBILE],

		['/android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7|padfone)/i', '$1', 'Asus', self::TYPE_TABLET], //Asus Tablets


		[[
			'/(sony)\s(tablet\s[ps])\sbuild\//i',
			'/(sony)?(?:sgp.+)\sbuild\//i',
		], 'Xperia Tablet', 'Sony', self::TYPE_TABLET], //Sony

		['/(?:sony)?(?:(?:(?:c|d)\d{4})|(?:so[-l].+))\sbuild\//i', 'Xperia Phone', 'Sony', self::TYPE_MOBILE],

		[[
			'/\s(Ouya)\s/i',
			'/(Nintendo)\s([wids3u]+)/i',
		], '$1', '$2', self::TYPE_CONSOLE],

		['/android.+;\s(shield)\sbuild/i', '$1', 'Nvidia', self::TYPE_CONSOLE],

		['/(playstation\s[34portablevi]+)/i', '$1', 'Sony', self::TYPE_CONSOLE], //Playstation

		['/(sprint\s(\w+))/i', '$2', '$1', self::TYPE_MOBILE], //todo

		['/(lenovo)\s?(S(?:5000|6000)+(?:[-][\w+]))/i', '$2', '$1', self::TYPE_TABLET],

		[[
			'/(htc)[;_\s-]+([\w\s]+(?=\))|\w+)*/i', //HTC
			'/(zte)-(\w+)*/i', //ZTE
			'/(alcatel|geeksphone|huawei|lenovo|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]+)*/i' //Alcatel/GeeksPhone/Huawei/Lenovo/Nexian/Panasonic/Sony
		], '$2', '$1', self::TYPE_MOBILE], //todo

		['/(nexus\s9)/i', '$1', 'HTC', self::TYPE_TABLET],

		['/(nexus\s6p)/i', '$1', 'Huawei', self::TYPE_TABLET],

		['/(Microsoft);\s(Lumia[\s\w]+)/i', '$2', '$1', self::TYPE_MOBILE],

		['/[\s\(;](xbox(?:\sone)?)[\s\);]/i', '$1', 'Microsoft', self::TYPE_CONSOLE],

		['/(kin\.[onetw]{3})/i', '$1', 'Microsoft', self::TYPE_MOBILE], //todo

		[[
			'/\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?(:?\s4g)?)[\w\s]+build\//i',
            '/mot[\s-]?(\w+)*/i',
			'/(XT\d{3,4}) build\//i',
			'/(nexus\s6)/i',
		], '$1', 'Motorola', self::TYPE_MOBILE],

		['/android.+\s(mz60\d|xoom[\s2]{0,2})\sbuild\//i', '$1', 'Motorola', self::TYPE_TABLET],

		['/hbbtv\/\d+\.\d+\.\d+\s+\([\w\s]*;\s*(\w[^;]*);([^;]*)/i', '$2', '$1', self::TYPE_SMART_TV], //HbbTV devices

		['/hbbtv.+maple;(\d+)/i', 'SmartTV', 'Samsung', self::TYPE_SMART_TV],

		['/\(dtv[\);].+(aquos)/i','$1', 'Sharp', self::TYPE_SMART_TV],

		[[
			'/android.+((sch-i[89]0\d|shw-m380s|gt-p\d{4}|gt-n\d+|sgh-t8[56]9|nexus 10))/i',
			'/((SM-T\w+))/i',
		], '$2', 'Samsung', self::TYPE_TABLET],

		['/smart-tv.+(samsung)/i', 'SmartTv', 'Samsung', self::TYPE_SMART_TV],

		[[
			'/((s[cgp]h-\w+|gt-\w+|galaxy\snexus|sm-\w[\w\d]+))/i',
			'/(sam[sung]*)[\s-]*(\w+-?[\w-]*)*/i',
			'/sec-((sgh\w+))/i'
		], '$2', 'Samsung', self::TYPE_MOBILE],

		[[
			'/android.+(\w+)\s+build\/hm\1/i',
			'/android.+(hm[\s\-_]*note?[\s_]*(?:\d\w)?)\s+build/i',
			'/android.+(mi[\s\-_]*(?:one|one[\s_]plus|note lte)?[\s_]*(?:\d\w)?)\s+build/i'
		], '$1', 'Xiaomi', self::TYPE_MOBILE],

		['/android.+a000(1)\s+build/i', '$1', 'OnePlus', self::TYPE_MOBILE],

		[[
			'/\s(tablet)[;\/]/i',
			'/\s(mobile)(?:[;\/]|\ssafari)/i',
		], '$3','$2', '$1']
	];

	/**
	 * @param $ua
	 * @return array [产品型号，供应商，设备类型]
	 * @throws \Exception
	 */
	public static function resolve($ua){
		return UAHelper::matches(self::$rules, $ua);
	}
}