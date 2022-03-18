<?php

namespace LFPhp\UA\Resolver;

use LFPhp\UA\ResolverInterface;
use LFPhp\UA\UAHelper;

/**
 * 浏览器
 */
class Browser implements ResolverInterface {
	private static $rules = [
		[[
			'/(opera\smini)\/([\w\.-]+)/i', //Opera Mini
			'/(opera\s[mobiletab]+).+version\/([\w\.-]+)/i', //Opera Mobile/Tablet
			'/(opera).+version\/([\w\.]+)/i', //Opera > 9.80
			'/(opera)[\/\s]+([\w\.]+)/i', //Opera < 9.80
		], '$1', '$2'],

		//Opera mini on iphone >= 8.0
		['/(opios)[\/\s]+([\w\.]+)/i', 'Opera Mini', '$2'],

		//Opera Webkit
		['/\s(opr)\/([\w\.]+)/i', 'Opera', '$2'],

		//Kindle
		['/(Kindle)\/([\w\.]+)/i', '$1', '$2'],

		//Lunascape/Maxthon/Netfront/Jasmine/Blazer
		['/(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]+)*/i', '$1', '$2'],

		//Avant/IEMobile/SlimBrowser/Baidu
		['/(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?([\w\.]*)/i', '$1', '$2'],

		//Internet Explorer
		['/(?:ms|\()(ie)\s([\w\.]+)/i', 'IE', '$2'],

		//Rekonq
		['/(Rekonq)\/([\w\.]+)*/i', '$1', '$2'],

		//Chromium/Flock/RockMelt/Midori/Epiphany/Silk/Skyfire/Bolt/Iron/Iridium/PhantomJS
		['/(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs)\/([\w\.-]+)/i', '$1', '$2'],

		//IE11
		['/(trident).+rv[:\s]([\w\.]+).+like\sgecko/i', 'IE', '11'],

		//Edge
		['/(Edge)\/((\d+)?[\w\.]+)/i', '$1', '$2'],

		//Yandex
		['/(yabrowser)\/([\w\.]+)/i', 'Yandex', '$2'],

		//Comodo Dragon
		['/(comodo_dragon)\/([\w\.]+)/i', 'Comodo Dragon', '$2'],

		//WeChat
		['/(micromessenger)\/([\w\.]+)/i', 'WeChat', '$2'],

		//MIUI Browser
		['/xiaomi\/miuibrowser\/([\w\.]+)/i', 'MIUI Browser', '$1'],

		//Chrome WebView
		['/\swv\).+(chrome)\/([\w\.]+)/i', 'Chrome WebView', '$2'],

		//Android Browser
		[[
			'/android.+samsungbrowser\/([\w\.]+)/i',
			'/android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)*/i'
		], 'Android Browser', '$1'],

		[[
			'/(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i', //Chrome/OmniWeb/Arora/Tizen/Nokia
			'/(qqbrowser)[\/\s]?([\w\.]+)/i', //QQBrowser
		], '$1', '$2'],

		[[
			'/(uc\s?browser)[\/\s]?([\w\.]+)/i',
			'/ucweb.+(ucbrowser)[\/\s]?([\w\.]+)/i',
			'/juc.+(ucweb)[\/\s]?([\w\.]+)/i',
		], 'UCBrowser', '$2'],

		['/(dolfin)\/([\w\.]+)/i', 'Dolphin', '$2'], //Dolphin

		['/((?:android.+)crmo|crios)\/([\w\.]+)/i', 'Chrome', '$2'], //Chrome for Android/iOS

		['/;fbav\/([\w\.]+);/i', 'Facebook','$1'], //Facebook App for iOS

		['/fxios\/([\w\.-]+)/i', 'Firefox', '$1'], //Firefox for iOS

		['/version\/([\w\.]+).+?mobile\/\w+\s(safari)/i', 'Mobile Safari', '$1'], //Mobile Safari

		['/version\/([\w\.]+).+?(mobile\s?safari|safari)/i', '$2', '$1'],  //Safari & Safari Mobile

		['/webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i', '$1', '$2' ], //Safari < 3.0 //todo version convention

		[[
			'/(konqueror)\/([\w\.]+)/i',
			'/(webkit|khtml)\/([\w\.]+)/i',
		], 'Konqueror', '$2'],

		//Gecko based
		['/(navigator|netscape)\/([\w\.-]+)/i', 'Netscape', '$2'],

		[[
			'/(Swiftfox)/i', //Swiftfox
			'/(Icedragon|Iceweasel|Camino|Chimera|Fennec|Maemo\sbrowser|Minimo|Conkeror)[\/\s]?([\w\.\+]+)/i', //IceDragon/Iceweasel/Camino/Chimera/Fennec/Maemo/Minimo/Conkeror
			'/(Firefox|SeaMonkey|K-Meleon|Icecat|Iceape|Firebird|Phoenix)\/([\w\.-]+)/i', //Firefox/SeaMonkey/K-Meleon/IceCat/IceApe/Firebird/Phoenix
			'/(Mozilla)\/([\w\.]+).+rv\:.+gecko\/\d+/i', //Mozilla
			'/(Polaris|Lynx|Dillo|Icab|Doris|Amaya|w3m|Netsurf|Sleipnir)[\/\s]?([\w\.]+)/i', //Polaris/Lynx/Dillo/iCab/Doris/Amaya/w3m/NetSurf/Sleipnir
			'/(Links)\s\(([\w\.]+)/i',//Links
			'/(GoBrowser)\/?([\w\.]+)*/i',//GoBrowser
			'/(ICE\s?Browser)\/v?([\w\._]+)/i',//ICE Browser
			'/(Mosaic)[\/\s]([\w\.]+)/i', //Mosaic
		], '$1', '$2'],
	];

	/**
	 * @param string $ua
	 * @return array [浏览器，版本]
	 */
	public static function resolve($ua){
		return UAHelper::matches(self::$rules, $ua);
	}
}