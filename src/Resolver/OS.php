<?php

namespace LFPhp\UA\Resolver;

use LFPhp\UA\ResolverInterface;
use LFPhp\UA\UAHelper;

/**
 * 操作系统
 */
class OS implements ResolverInterface {
	private static $windows_version_map = [
		'ME'      => '4.90',
		'NT 3.11' => 'NT3.51',
		'NT 4.0'  => 'NT4.0',
		'2000'    => 'NT 5.0',
		'XP'      => ['NT 5.1', 'NT 5.2'],
		'Vista'   => 'NT 6.0',
		'7'       => 'NT 6.1',
		'8'       => 'NT 6.2',
		'8.1'     => 'NT 6.3',
		'10'      => ['NT 6.4', 'NT 10.0'],
		'RT'      => 'ARM',
	];

	private static $rules = [
		['/microsoft\s(windows)\s(vista|xp)/i', '$1', '$2'],
		[[
			'/(windows)\snt\s6\.2;\s(arm)/i',//Windows RT
			'/(windows\sphone(?:\sos)*)[\s\/]?([\d\.\s]+\w)*/i',//Windows Phone
			'/(windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i',
		], 'Windows', '$2'], //todo

		[' /(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i', 'Windows', '$2'],//todo

		['/\((bb)(10);/i ','BlackBerry','$2'],//BlackBerry 10

		[[
			'/(blackberry)\w*\/?([\w\.]+)*/i',
			'/(tizen)[\/\s]([\w\.]+)/i',
			'/(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|contiki)[\/\s-]?([\w\.]+)*/i',
			'/linux;.+(sailfish);/i',
		], '$1', '$2'],

		['/(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]+)*/i', 'Symbian', '$2'],
		['/\((series40);/i', 'Symbian', 's40'],
		['/mozilla.+\(mobile;.+gecko.+firefox/i', 'FirefoxOS', '$2'],
		[[
			'/(nintendo|playstation)\s([wids34portablevu]+)/i',
			'/(mint)[\/\s\(]?(\w+)*/i',
			'/(mageia|vectorlinux)[;\s]/i',
			'/(joli|[kxln]?ubuntu|debian|[open]*suse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?(?!chrom)([\w\.-]+)*/i',
			'/(hurd|linux)\s?([\w\.]+)*/i',
			'/(gnu)\s?([\w\.]+)*/i',
			'/\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]+)*/i',
			'/(haiku)\s(\w+)/i',
		], '$1', '$2'],

		['/(cros)\s[\w]+\s([\w\.]+\w)/i','Chromium OS', '$2'],
		['/(sunos)\s?([\w\.]+\d)*/i', 'Solaris', '$2'],

		['/(ip[honead]+)(?:.*os\s([\w]+)*\slike\smac|;\sopera)/i', 'iOS', '$2'], //todo

		[[
			'/(mac\sos\sx)\s?([\w\s\.]+\w)*/i',
			'/(macintosh|mac(?=_powerpc)\s)/i',
		], 'MacOS', '$2'],

		[[
			'/((?:open)?solaris)[\/\s-]?([\w\.]+)*/i',
			'/(aix)\s((\d)(?=\.|\)|\s)[\w\.]*)*/i',
			'/(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms)/i',
			'/(unix)\s?([\w\.]+)*/i'
		], '$1', '$2']
	];

	public static function resolve($ua){
		list($os, $ver) = UAHelper::matches(self::$rules, $ua);
		if(strcasecmp($os, 'windows') === 0){
			$ver = UAHelper::versionMap($ver, self::$windows_version_map);
		}
		if(strcasecmp($os,'iOS') === 0 || strcasecmp($os, 'MacOS') === 0){
			$ver = str_replace('_', '.', $ver);
		}
		return [$os, $ver];
	}
}