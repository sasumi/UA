<?php
namespace LFPhp\UA;

class UAHelper {
	/**
	 * 字符串或正则表达式匹配
	 * @param string|array $patterns 字符串或正则表达式
	 * @param string $str
	 * @param bool $case_sensitive 是否大小写敏感，缺省为不敏感
	 * @return bool
	 */
	public static function matched($patterns, $str, $case_sensitive = false){
		if(is_string($patterns)){
			$patterns = [$patterns];
		}
		foreach($patterns as $pt){
			if(preg_match('/^\/.*\/\w$/', $pt)){
				if(preg_match($pt, $str)){
					return true;
				}
			} else {
				if(($case_sensitive && strpos($str, $pt) === false) || stripos($str, $pt) !== false){
					return true;
				}
			}
		}
		return false;
	}
}