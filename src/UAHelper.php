<?php
namespace LFPhp\UA;

class UAHelper {
	/**
	 * 字符串或正则表达式匹配
	 * @param string|array $patterns 字符串或正则表达式
	 * @param string $str
	 * @param bool $case_sensitive 是否大小写敏感，缺省为不敏感
	 * @return string 第一个匹配字符串，如果没有指定，返回匹配字符
	 */
	public static function matched($patterns, $str, $case_sensitive = false){
		if(is_string($patterns)){
			$patterns = [$patterns];
		}
		foreach($patterns as $pt){
			if(preg_match('/^\/.*\/\w$/', $pt)){ //regex
				if(preg_match($pt, $str, $matches)){
					return $matches[1] ?: $matches[0];
				}
			}else{
				if(($case_sensitive && strpos($str, $pt) === false) || stripos($str, $pt) !== false){
					return $pt;
				}
			}
		}
		return null;
	}

	public static function cleanupModel($s){
		$s = preg_replace('/_TD$/','', $s);
		$s = preg_replace('/_CMCC$/','', $s);
		$s = preg_replace('/_/g', ' ', $s);
		$s = preg_replace('/^\s+|\s+$/g','', $s);
		$s = preg_replace('/\/[^/]+$/','', $s);
		$s = preg_replace('/\/[^/]+ Android\/.*/','', $s);

		$s = preg_replace('/^tita on /','', $s);
		$s = preg_replace('/^Android on /','', $s);
		$s = preg_replace('/^Android for /','', $s);
		$s = preg_replace('/^ICS AOSP on /','', $s);
		$s = preg_replace('/^Full AOSP on /','', $s);
		$s = preg_replace('/^Full Android on /','', $s);
		$s = preg_replace('/^Full Cappuccino on /','', $s);
		$s = preg_replace('/^Full MIPS Android on /','', $s);
		$s = preg_replace('/^Full Android/','', $s);
		$s = preg_replace('/^Acer ?/i','', $s);
		$s = preg_replace('/^Iconia /','', $s);
		$s = preg_replace('/^Ainol /','', $s);
		$s = preg_replace('/^Coolpad ?/i', 'Coolpad ', $s);
		$s = preg_replace('/^ALCATEL /','', $s);
		$s = preg_replace('/^Alcatel OT-(.*)/', 'one touch $1', $s);
		$s = preg_replace('/^YL-/','', $s);
		$s = preg_replace('/^Novo7 ?/i', 'Novo7 ', $s);
		$s = preg_replace('/^GIONEE /','', $s);
		$s = preg_replace('/^HW-/','', $s);
		$s = preg_replace('/^Huawei[ -]/i', 'Huawei ', $s);
		$s = preg_replace('/^SAMSUNG[ -]/i','', $s);
		$s = preg_replace('/^SonyEricsson/','', $s);
		$s = preg_replace('/^Lenovo Lenovo/', 'Lenovo', $s);
		$s = preg_replace('/^LNV-Lenovo/', 'Lenovo', $s);
		$s = preg_replace('/^Lenovo-/', 'Lenovo ', $s);
		$s = preg_replace('/^(LG)[ _\/]/', '$1-', $s);
		$s = preg_replace('/^(HTC.*)\s(?:v|V)?[0-9.]+$/', '$1', $s);
		$s = preg_replace('/^(HTC)[-\/]/', '$1 ', $s);
		$s = preg_replace('/^(HTC)([A-Z][0-9][0-9][0-9])/', '$1 $2', $s);
		$s = preg_replace('/^(Motorola[\s|-])/', '', $s);
		$s = preg_replace('/^(Moto|MOT-)/', '', $s);
		$s = preg_replace('/-?(orange(-ls)?|vodafone|bouygues)$/i','', $s);
		$s = preg_replace('/http:\/\/.+$/i','', $s);
		$s = preg_replace('/^\s+|\s+$/g','', $s);
		return $s;
	}
	
	public static function parseVersion($version){
		$components = explode('.', $version);
		$major = array_shift($components);
		return (float)($major.'.'.join('', $components));
	}
}