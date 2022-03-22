export const SORT_ASC = 1;
export const SORT_DESC = -1;

let _cache = {};
export const fetchNCache = cgi => new Promise((resolve) => {
	if(_cache[cgi]){
		resolve(_cache[cgi]);
	}else{
		fetch(cgi).then(rsp => rsp.json()).then(data => {
			_cache[cgi] = data;
			resolve(data);
		});
	}
});

export const uuid = () => 'id_' + Math.random();

export const emptyObj = obj => JSON.stringify(obj) === '{}';

export const numberFormat = (number, decimals, dec_point, thousands_sep) => {
	number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
	let n = !isFinite(+number) ? 0 : +number,
		prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
		sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
		dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
		s = '',
		toFixedFix = function(n, prec){
			let k = Math.pow(10, prec);
			return '' + Math.round(n * k) / k;
		};
	// Fix for IE parseFloat(0.55).toFixed(0) = 0;
	s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
	if(s[0].length > 3){
		s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
	}
	if((s[1] || '').length < prec){
		s[1] = s[1] || '';
		s[1] += new Array(prec - s[1].length + 1).join('0');
	}
	return s.join(dec);
};

export const percentText = (num)=>{
	return round(num*100, 2)+'%';
}

export const round = (num, digits)=>{
	digits = digits === undefined ? 2 : digits;
	let multiple = Math.pow(10, digits);
	return Math.round(num * multiple) / multiple;
};

export const countMap = obj => {
	let c = 0;
	for(let key in obj){
		c += obj[key];
	}
	return c;
};

export const sortMap = (obj, dir) => {
	let tmp = [];
	for(let key in obj){
		tmp.push({k:key, v:obj[key]});
	}
	tmp = tmp.sort((item1, item2)=> {
		if(item1.v > item2.v){
			return dir === SORT_ASC ? 1:-1;
		}else if(item1.v < item2.v){
			return dir === SORT_ASC ? -1 : 1;
		}
		return 0;
	});
	let ret = {};
	tmp.forEach(item=>{
		ret[item.k] = item.v;
	});
	return ret;
};
