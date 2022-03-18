<?php

namespace LFPhp\UA\Resolver;

use LFPhp\UA\ResolverInterface;
use LFPhp\UA\UAHelper;

/**
 * 设备类型
 */
class CPU implements ResolverInterface {
	private static $rules = [
		['/(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i', 'amd64'],
		['/(ia32(?=;))/i', 'IA32'],
		[['/((?:i[346]|x)86)[;\)]/i', '/((?:i[346]|x)86)[;\)]/i'], 'IA32'],
		['/windows\s(ce|mobile);\sppc;/i', 'ARM'],
		['/((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i', 'PowerPC'],
		['/(sun4\w)[;\)]/i', 'SPARC'],
		['/((?:avr32|ia64(?=;))|68k(?=\))|arm(?:64|(?=v\d+;))|(?=atmel\s)avr|(?:irix|mips|sparc)(?:64)?(?=;)|pa-risc)/i', '$1']
	];

	public static function resolve($ua){
		list($arch) = UAHelper::matches(self::$rules, $ua);
		return $arch;
	}
}