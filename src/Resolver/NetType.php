<?php

namespace LFPhp\UA\Resolver;

use LFPhp\UA\ResolverInterface;
use LFPhp\UA\UAHelper;

class NetType implements ResolverInterface{
	public static function resolve($ua){
		return UAHelper::matches([
			['/NetType\/(.*?)\s/', '$1']
		], $ua);
	}
}