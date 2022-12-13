import {countMap, emptyObj, fetchNCache, numberFormat, percentText, SORT_DESC, sortMap, uuid} from "./base.js";

const createBlock = title=>{
	let div = document.createElement('div');
	div.className = 'blocks';
	div.innerHTML = `<h2>${title}</h2>`;
	document.body.appendChild(div);
	return div;
}

const createModule = (block, title)=>{
	let div = document.createElement('div');
	div.className=  'block';
	div.innerHTML = `
	<div class="chart"></div>
    <dl>
        <dt>明细</dt>
        <dd></dd>
    </dl>`;
	block.appendChild(div);
	return [div.querySelector('div'), div.querySelector('dd'), div];
}

export const renderBlock = (block_title, cgi)=>{
	let block = createBlock(block_title);
	renderBrowser(cgi, block);
	renderDevice(cgi, block);
}

const renderBrowser = (cgi, block)=>{
	fetchNCache(cgi).then(json=>{
		let [series, browser_counts, ver_counts] = count_by_browser(json);
		let [chart_ctn, desc_ctn, container] = createModule(block, '浏览器占比');

		let html = '<ul>';
		let browser_total = countMap(browser_counts);
		for(let browser in browser_counts){
			let percent = percentText(browser_counts[browser]/browser_total);
			let cls = !emptyObj(ver_counts[browser]) ? 'has-children' : '';
			let browser_title = browser !== 'null' ? browser : 'Unknown';
			html += `<li class="${cls}"><label>${browser_title}</label> <span>${percent}</span> <var>${numberFormat(browser_counts[browser],0)}</var></label>`;
			if(!emptyObj(ver_counts[browser])){
				ver_counts[browser] = sortMap(ver_counts[browser], SORT_DESC);
				html += '<ul>';
				for(let version in ver_counts[browser]){
					let ver_percent = percentText(ver_counts[browser][version]/browser_counts[browser]);
					html += `<li><label>${version}</label> <span>${ver_percent}</span> <var>${numberFormat(ver_counts[browser][version], 0)}</var>`;
				}
				html += '</ul>';
			}
		}
		html += '</ul>';
		desc_ctn.innerHTML = html;

		desc_ctn.querySelectorAll('.has-children>label').forEach(lbl=>{
			lbl.addEventListener('click', e=>{
				lbl.parentNode.classList.toggle('expand');
			})
		})
		Highcharts.chart(chart_ctn, {
			title: {text: '浏览器占比'},
			series: [{
				type: "sunburst",
				data: series,
				allowDrillToNode: true,
				cursor: 'pointer',
				dataLabels: {
					formatter: function () {
						let shape = this.point.node.shapeArgs;
						let innerArcFraction = (shape.end - shape.start) / (2 * Math.PI);
						let perimeter = 2 * Math.PI * shape.innerR;
						let innerArcPixels = innerArcFraction * perimeter;
						if (innerArcPixels > 16) {
							return this.point.name;
						}
					}
				},
				levels: [{
					level: 2,
					colorByPoint: true,
					dataLabels: {
						rotationMode: 'parallel'
					}
				},
					{
						level: 3,
						colorVariation: {
							key: 'brightness',
							to: -0.5
						}
					}, {
						level: 4,
						colorVariation: {
							key: 'brightness',
							to: 0.5
						}
					}]
			}],
			tooltip: {
				headerFormat: "",
				pointFormat: '<b>{point.name}</b>访问数量：<b>{point.value}</b>'
			}
		});
	});
}

const renderDevice = (cgi, block)=>{
	fetchNCache(cgi).then(json=>{
		let [series, device_type_counts, brand_counts] = count_by_device(json);
		device_type_counts = sortMap(device_type_counts, SORT_DESC);
		let [chart_ctn, desc_ctn, container] = createModule(block, '设备类型占比');

		let html = '<ul>';
		let type_total = countMap(device_type_counts);
		for(let type in device_type_counts){
			let percent = percentText(device_type_counts[type]/type_total);
			let cls = !emptyObj(brand_counts[type]) ? 'has-children' : '';
			let device_title = type !== 'null' ? type : 'Unknown';
			html += `<li class="${cls}"><label>${device_title}</label> <span>${percent}</span> <var>${numberFormat(device_type_counts[type],0)}</var></label>`;
			if(!emptyObj(brand_counts[type])){
				brand_counts[type] = sortMap(brand_counts[type], SORT_DESC);
				html += '<ul>';
				for(let version in brand_counts[type]){
					let ver_percent = percentText(brand_counts[type][version]/device_type_counts[type]);
					html += `<li><label>${version}</label> <span>${ver_percent}</span> <var>${numberFormat(brand_counts[type][version])}</var>`;
				}
				html += '</ul>';
			}
		}
		html += '</ul>';
		desc_ctn.innerHTML = html;
		desc_ctn.querySelectorAll('.has-children>label').forEach(lbl=>{
			lbl.addEventListener('click', e=>{
				lbl.parentNode.classList.toggle('expand');
			})
		})

		Highcharts.chart(chart_ctn, {
			title: {text: '设备类型占比'},
			series: [{
				type: "sunburst",
				data: series,
				allowDrillToNode: true,
				cursor: 'pointer',
				dataLabels: {
					formatter: function () {
						let shape = this.point.node.shapeArgs;
						let innerArcFraction = (shape.end - shape.start) / (2 * Math.PI);
						let perimeter = 2 * Math.PI * shape.innerR;
						let innerArcPixels = innerArcFraction * perimeter;
						if (innerArcPixels > 16) {
							return this.point.name;
						}
					}
				},
				levels: [{
					level: 2,
					colorByPoint: true,
					dataLabels: {
						rotationMode: 'parallel'
					}
				},
					{
						level: 3,
						colorVariation: {
							key: 'brightness',
							to: -0.5
						}
					}, {
						level: 4,
						colorVariation: {
							key: 'brightness',
							to: 0.5
						}
					}]
			}],
			tooltip: {
				headerFormat: "",
				pointFormat: '<b>{point.name}</b>访问数量：<b>{point.value}</b>'
			}
		});
	});
}

function count_by_device(data_list){
	let device_type_counts = {};
	data_list.forEach(item=>{
		if(!device_type_counts[item['type']]){
			device_type_counts[item['type']] = 0;
		}
		device_type_counts[item['type']] += parseInt(item['count']);
	});

	let series = [{'id': '0.0', 'parent': '', 'name': '设备类型分布'}];
	let brand_counts = {};
	for(let device_type in device_type_counts){
		let item_id = uuid();
		series.push({
			'id': item_id,
			'parent': '0.0',
			'name': device_type,
		});
		//version
		let brand_tmp = {};
		data_list.forEach(item=>{
			if(item['type'] === device_type){
				if(!brand_tmp[item['device']]){
					brand_tmp[item['device']] = 0;
				}
				brand_tmp[item['device']] += parseInt(item['count']);
			}
		});
		brand_counts[device_type] = brand_tmp;

		for(let version in brand_tmp){
			series.push({
				'id': uuid(),
				'parent': item_id,
				'name': version,
				'value': brand_tmp[version],
			});
		}
	}
	return [series, device_type_counts, brand_counts];
}

function count_by_browser(data_list){
	let browser_counts = {};
	data_list.forEach(item=>{
		if(!browser_counts[item['browser']]){
			browser_counts[item['browser']] = 0;
		}
		browser_counts[item['browser']] += parseInt(item['count']);
	})

	browser_counts = sortMap(browser_counts, SORT_DESC);

	let series = [{'id': '0.0', 'parent': '', 'name': ''}];

	let vs_counts = {};
	for(let browser in browser_counts){
		let item_id = uuid();
		series.push({
			'id': item_id,
			'parent': '0.0',
			'name': browser,
		});

		//version
		let vs_tmp = {};
		data_list.forEach(item=>{
			if(item['browser'] === browser){
				if(!vs_tmp[item['browser_version']]){
					vs_tmp[item['browser_version']] = 0;
				}
				vs_tmp[item['browser_version']] += parseInt(item['count']);
			}
		});
		vs_counts[browser] = vs_tmp;

		for(let version in vs_tmp){
			series.push({
				'id': uuid(),
				'parent': item_id,
				'name': version,
				'value': vs_tmp[version],
			});
		}
	}
	return [series,browser_counts,vs_counts];
}