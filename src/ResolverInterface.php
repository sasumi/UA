<?php

namespace LFPhp\UA;

interface ResolverInterface {
	public static function resolve($ua, &$extend_info = '');
}