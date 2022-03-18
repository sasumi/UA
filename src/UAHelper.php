<?php
namespace LFPhp\UA;

use LFPhp\UA\Resolver\Browser;
use LFPhp\UA\Resolver\BrowserEngine;
use LFPhp\UA\Resolver\Device;
use LFPhp\UA\Resolver\OS;

class UAHelper {
	public static $DEBUG_ON = false;

	/**
	 * UA按照规则匹配
	 * @param array $rules 规则列表 [[patterns], $m1, $m2,...]
	 * @param string $ua
	 * @return array $m1, $m2,...
	 */
	public static function matches(array $rules, $ua){
		$ret = [];
		foreach($rules as $rule){
			$regs = array_shift($rule);
			$regs = is_string($regs) ? [$regs] : $regs;
			foreach($regs as $reg){
				if(preg_match($reg, $ua, $ms)){
					self::$DEBUG_ON && self::debug($reg, $ua, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 2));
					foreach($rule as $replacement){
						if(strpos($replacement, '$') !== false){
							$replacement = preg_replace_callback('/\$(\d+)/', function($match)use($ms){
								return $ms[$match[1]];
							}, $replacement);
						}
						$ret[] = $replacement;
					}
					return $ret;
				}
			}
		}
		return [];
	}

	/**
	 * 版本匹配
	 * @param string $version_str
	 * @param array $version_map [版本 => 匹配字符串, 版本 => [匹配2, 匹配3]]
	 * @return string
	 */
	public static function versionMap($version_str, $version_map){
		foreach($version_map as $version=>$vs){
			if(!is_array($vs)){
				$vs = [$vs];
			}
			foreach($vs as $v){
				if(strcasecmp($v, $version_str) === 0){
					return $version;
				}
			}
		}
		return $version_str;
	}

	/**
	 * 解析所有信息
	 * @param string $ua
	 * @return array
	 */
	public static function resolveAll($ua){
		list($browser, $browser_version) = Browser::resolve($ua);
		list($engine, $engine_version) = BrowserEngine::resolve($ua);
		list($device, $vendor, $type) = Device::resolve($ua);
		list($os, $os_version) = OS::resolve($ua);
		return [
			'browser'         => $browser,
			'browser_version' => $browser_version,
			'engine'          => $engine,
			'engine_version'  => $engine_version,
			'device'          => $device,
			'vendor'          => $vendor,
			'type'            => $type,
			'os'              => $os,
			'os_version'      => $os_version,
		];
	}

	private static function debug($pt, $str, array $debug_backtrace){
		static $ua_flush_flag;
		if(!$ua_flush_flag){
			echo 'Start parser UA', $str, PHP_EOL;
			$ua_flush_flag = true;
		}
		array_pop($debug_backtrace);
		$trace = array_pop($debug_backtrace);
		echo "Pattern: [$pt]\tFile: {$trace['file']} #{$trace['line']}";
	}
}