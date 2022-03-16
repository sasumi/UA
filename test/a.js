module.exports = (function(){
			 *      Android
			 */

			/****************************************************
			 *      Try to detect any devices based on common
			 *      locations of model ids
			 */

			if(!this.device.model && !this.device.manufacturer){
				var candidates = [];

				if(!ua.match(/^(Mozilla|Opera)/)) if(match = /^(?:MQQBrowser\/[0-9\.]+\/)?([^\s]+)/.exec(ua)){
					match[1] = match[1].replace(/_TD$/, '');
					match[1] = match[1].replace(/_CMCC$/, '');
					match[1] = match[1].replace(/[_ ]Mozilla$/, '');
					match[1] = match[1].replace(/ Linux$/, '');
					match[1] = match[1].replace(/ Opera$/, '');
					match[1] = match[1].replace(/\/[0-9].*$/, '');

					candidates.push(match[1]);
				}

				if(match = /[0-9]+x[0-9]+; ([^;]+)/.exec(ua)){
					candidates.push(match[1]);
				}

				if(match = /[0-9]+X[0-9]+ ([^;\/\(\)]+)/.exec(ua)){
					candidates.push(match[1]);
				}

				if(match = /Windows NT 5.1; ([^;]+); Windows Phone/.exec(ua)){
					candidates.push(match[1]);
				}

				if(match = /\) PPC; (?:[0-9]+x[0-9]+; )?([^;\/\(\)]+)/.exec(ua)){
					candidates.push(match[1]);
				}

				if(match = /\(([^;]+); U; Windows Mobile/.exec(ua)){
					candidates.push(match[1]);
				}

				if(match = /Vodafone\/1.0\/([^\/]+)/.exec(ua)){
					candidates.push(match[1]);
				}

				if(match = /\ ([^\s]+)$/.exec(ua)){
					candidates.push(match[1]);
				}

				for(var i = 0; i < candidates.length; i++){

					if(!this.device.model && !this.device.manufacturer){
						var model = cleanupModel(candidates[i]);
						var result = false;

						if(this.os.name === 'Android'){
							if(typeof ANDROID_MODELS[model] !== 'undefined'){
								this.device.manufacturer = ANDROID_MODELS[model][0];
								this.device.model = ANDROID_MODELS[model][1];
								if(typeof ANDROID_MODELS[model][2] !== 'undefined') this.device.type = ANDROID_MODELS[model][2];
								this.device.identified = true;

								result = true;
							}
						}

						if(!this.os.name || this.os.name === 'Windows' || this.os.name === 'Windows Mobile' || this.os.name === 'Windows CE'){
							if(typeof WINDOWS_MOBILE_MODELS[model] !== 'undefined'){
								this.device.manufacturer = WINDOWS_MOBILE_MODELS[model][0];
								this.device.model = WINDOWS_MOBILE_MODELS[model][1];
								this.device.type = 'mobile';
								this.device.identified = true;

								if(this.os.name !== 'Windows Mobile'){
									this.os.name = 'Windows Mobile';
									this.os.version = null;
								}

								result = true;
							}
						}
					}

					if(!result){
			}


			/****************************************************
			 *      Chrome
			 */

			/****************************************************
			 *      Chrome Frame
			 */


			/****************************************************
			 *      Trident
			 */

			if(match = /Trident\/([0-9.]*)/.exec(ua)){
				this.engine.name = 'Trident';
				this.engine.version = new Version({
					value: match[1]
				});

				if(this.browser.name === 'Internet Explorer'){
					if(parseVersion(this.engine.version) === 6 && parseFloat(this.browser.version) < 10){
						this.browser.version = new Version({
							value: '10.0'
						});
						this.browser.mode = 'compat';
					}

					if(parseVersion(this.engine.version) === 5 && parseFloat(this.browser.version) < 9){
						this.browser.version = new Version({
							value: '9.0'
						});
						this.browser.mode = 'compat';
					}

					if(parseVersion(this.engine.version) === 4 && parseFloat(this.browser.version) < 8){
						this.browser.version = new Version({
							value: '8.0'
						});
						this.browser.mode = 'compat';
					}
				}

				if(this.os.name === 'Windows Phone'){
					if(parseVersion(this.engine.version) === 5 && parseFloat(this.os.version) < 7.5){
						this.os.version = new Version({
							value: '7.5'
						});
					}
				}
			}


			/****************************************************
			 *      Corrections
			 */

			if(this.os.name === 'Android' && this.browser.stock){
				this.browser.hidden = true;
			}

			if(this.os.name === 'iOS' && this.browser.name === 'Opera Mini'){
				this.os.version = null;
			}

			if(this.browser.name === 'Midori' && this.engine.name !== 'Webkit'){
				this.engine.name = 'Webkit';
				this.engine.version = null;
			}

			if(this.device.type === 'television' && this.browser.name === 'Opera'){
				this.browser.name = 'Opera Devices';
				switch(true){
					case this.engine.version.is('2.10'):
						this.browser.version = new Version({
							value: 3.2
						});
						break;
					case this.engine.version.is('2.9'):
						this.browser.version = new Version({
							value: 3.1
						});
						break;
					case this.engine.version.is('2.8'):
						this.browser.version = new Version({
							value: 3.0
						});
						break;
					case this.engine.version.is('2.7'):
						this.browser.version = new Version({
							value: 2.9
						});
						break;
					case this.engine.version.is('2.6'):
						this.browser.version = new Version({
							value: 2.8
						});
						break;
					case this.engine.version.is('2.4'):
						this.browser.version = new Version({
							value: 10.3
						});
						break;
					case this.engine.version.is('2.3'):
						this.browser.version = new Version({
							value: 10
						});
						break;
					case this.engine.version.is('2.2'):
						this.browser.version = new Version({
							value: 9.7
						});
						break;
					case this.engine.version.is('2.1'):
						this.browser.version = new Version({
							value: 9.6
						});
						break;
					default:
						this.browser.version = null;
				}

				this.os.name = null;
				this.os.version = null;
			}


			/****************************************************
			 *      Camouflage
			 */

			if(this.options.detectCamouflage){

				if(match = /Mac OS X 10_6_3; ([^;]+); [a-z]{2}-(?:[a-z]{2})?\)/.exec(ua)){
					this.browser.name = '';
					this.browser.version = null;
					this.browser.mode = 'desktop';

					this.os.name = 'Android';
					this.os.version = null;

					this.engine.name = 'Webkit';
					this.engine.version = null;

					this.device.model = match[1];
					this.device.type = 'mobile';

					var model = cleanupModel(this.device.model);
					if(typeof ANDROID_MODELS[model] !== 'undefined'){
						this.device.manufacturer = ANDROID_MODELS[model][0];
						this.device.model = ANDROID_MODELS[model][1];
						if(typeof ANDROID_MODELS[model][2] !== 'undefined') this.device.type = ANDROID_MODELS[model][2];
						this.device.identified = true;
					}

					this.features.push('foundDevice');
				}

				if(match = /Linux Ventana; [a-z]{2}-[a-z]{2}; (.+) Build/.exec(ua)){
					this.browser.name = '';
					this.browser.version = null;
					this.browser.mode = 'desktop';

					this.os.name = 'Android';
					this.os.version = null;

					this.engine.name = 'Webkit';
					this.engine.version = null;

					this.device.model = match[1];
					this.device.type = 'mobile';

					var model = cleanupModel(this.device.model);
					if(typeof ANDROID_MODELS[model] !== 'undefined'){
						this.device.manufacturer = ANDROID_MODELS[model][0];
						this.device.model = ANDROID_MODELS[model][1];
						if(typeof ANDROID_MODELS[model][2] !== 'undefined') this.device.type = ANDROID_MODELS[model][2];
						this.device.identified = true;
					}

					this.features.push('foundDevice');
				}

				if(this.browser.name === 'Safari'){
					if(this.os.name !== 'iOS' && /AppleWebKit\/([0-9]+.[0-9]+)/i.exec(ua)[1] !== /Safari\/([0-9]+.[0-9]+)/i.exec(ua)[1]){
						this.features.push('safariMismatch');
						this.camouflage = true;
					}

					if(this.os.name === 'iOS' && !ua.match(/^Mozilla/)){
						this.features.push('noMozillaPrefix');
						this.camouflage = true;
					}

					if(!/Version\/[0-9\.]+/.exec(ua)){
						this.features.push('noVersion');
						this.camouflage = true;
					}
				}

				if(this.browser.name === 'Chrome'){
					if(!/(?:Chrome|CrMo|CriOS)\/([0-9]{1,2}\.[0-9]\.[0-9]{3,4}\.[0-9]+)/.exec(ua)){
						this.features.push('wrongVersion');
						this.camouflage = true;
					}
				}


				if(this.options.useFeatures){
					/* If it claims not to be Trident, but it is probably Trident running camouflage mode */
					if(window.ActiveXObject){
						this.features.push('trident');

						if(typeof this.engine.name !== 'undefined' && this.engine.name !== 'Trident'){
							this.camouflage = typeof this.browser.name === 'undefined' || this.browser.name !== 'Maxthon';
						}
					}

					/* If it claims not to be Opera, but it is probably Opera running camouflage mode */
					if(window.opera){
						this.features.push('presto');

						if(typeof this.engine.name !== 'undefined' && this.engine.name !== 'Presto'){
							this.camouflage = true;
						}

						if(this.browser.name === 'Internet Explorer'){
							this.camouflage = true;
						}
					}

					/* If it claims not to be Gecko, but it is probably Gecko running camouflage mode */
					if('getBoxObjectFor' in document || 'mozInnerScreenX' in window){
						this.features.push('gecko');

						if(typeof this.engine.name !== 'undefined' && this.engine.name !== 'Gecko'){
							this.camouflage = true;
						}

						if(this.browser.name === 'Internet Explorer'){
							this.camouflage = true;
						}
					}

					/* If it claims not to be Webkit, but it is probably Webkit running camouflage mode */
					if('WebKitCSSMatrix' in window || 'WebKitPoint' in window || 'webkitStorageInfo' in window || 'webkitURL' in window){
						this.features.push('webkit');

						if(typeof this.engine.name !== 'undefined' && this.engine.name !== 'Webkit'){
							this.camouflage = true;
						}

						if(this.browser.name === 'Internet Explorer'){
							this.camouflage = true;
						}
					}


					/* If it claims to be Safari and uses V8, it is probably an Android device running camouflage mode */
					if(this.engine.name === 'Webkit' && ({}.toString).toString().indexOf('\n') === -1){
						this.features.push('v8');

						if(this.browser !== null && this.browser.name === 'Safari'){
							this.camouflage = true;
						}
					}


					/* If we have an iPad that is not 768 x 1024, we have an imposter */
					if(this.device.model === 'iPad'){
						if((screen.width !== 0 && screen.height !== 0) && (screen.width !== 768 && screen.height !== 1024) && (screen.width !== 1024 && screen.height !== 768)){
							this.features.push('sizeMismatch');
							this.camouflage = true;
						}
					}

					/* If we have an iPhone or iPod that is not 320 x 480, we have an imposter */
					if(this.device.model === 'iPhone' || this.device.model === 'iPod'){
						if((screen.width !== 0 && screen.height !== 0) && (screen.width !== 320 && screen.height !== 480) && (screen.width !== 480 && screen.height !== 320)){
							this.features.push('sizeMismatch');
							this.camouflage = true;
						}
					}


					if(this.os.name === 'iOS' && this.os.version){

						if(this.os.version.isOlder('4.0') && 'sandbox' in document.createElement('iframe')){
							this.features.push('foundSandbox');
							this.camouflage = true;
						}

						if(this.os.version.isOlder('4.2') && 'WebSocket' in window){
							this.features.push('foundSockets');
							this.camouflage = true;
						}

						if(this.os.version.isOlder('5.0') && !!window.Worker){
							this.features.push('foundWorker');
							this.camouflage = true;
						}

						if(this.os.version.isNewer('2.1') && !window.applicationCache){
							this.features.push('noAppCache');
							this.camouflage = true;
						}
					}

					if(this.os.name !== 'iOS' && this.browser.name === 'Safari' && this.browser.version){

						if(this.browser.version.isOlder('4.0') && !!window.applicationCache){
							this.features.push('foundAppCache');
							this.camouflage = true;
						}

						if(this.browser.version.isOlder('4.1') && !!(window.history && history.pushState)){
							this.features.push('foundHistory');
							this.camouflage = true;
						}

						if(this.browser.version.isOlder('5.1') && !!document.documentElement.webkitRequestFullScreen){
							this.features.push('foundFullscreen');
							this.camouflage = true;
						}

						if(this.browser.version.isOlder('5.2') && 'FileReader' in window){
							this.features.push('foundFileReader');
							this.camouflage = true;
						}
					}
				}
			}
		}
	};

})();