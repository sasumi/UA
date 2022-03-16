module.exports = (function(){
	var STRINGS_SAMSUNG = 'Samsung',
		STRINGS_SHARP = 'Sharp',
		STRINGS_SONY_ERICSSON = 'Sony Ericsson',
		STRINGS_MOTOROLA = 'Motorola',
		STRINGS_LG = 'LG',
		STRINGS_HUAWEI = 'Huawei',
		STRINGS_HTC = 'HTC',
		STRINGS_COOLPAD = 'Coolpad',
		STRINGS_ASUS = 'Asus',
		STRINGS_ACER = 'Acer';
	var STRINGS_BASED = ' based device';

	var TOUCHWIZ_MODELS = {
		'SAMSUNG': {
			'GT-B7722': [STRINGS_SAMSUNG, 'Star Duos'],
			'GT-C6712': [STRINGS_SAMSUNG, 'Star II Duos']
		}
	}

	var BADA_MODELS = {
		'SAMSUNG': {
			'GT-S8600': [STRINGS_SAMSUNG, 'Wave 3'],
			'SHW-M410': [STRINGS_SAMSUNG, 'Wave 3']
		}
	}

	var TIZEN_MODELS = {
		'SAMSUNG': {
			'GT-I9500': [STRINGS_SAMSUNG, 'GT-I9500']
		}
	}

	var BREW_MODELS = {
		'Coolpad D508': [STRINGS_COOLPAD, 'D508'],
		'Coolpad E600': [STRINGS_COOLPAD, 'E600'],
		'SCH-F839': [STRINGS_SAMSUNG, 'SCH-F839']
	}

	var WINDOWS_MOBILE_MODELS = {
		'GT-I8000U': [STRINGS_SAMSUNG, 'Omnia 2'],
		'M1i': [STRINGS_SONY_ERICSSON, 'M1i Aspen']
	}

	var WINDOWS_PHONE_MODELS = {
		'Acer': {
			'Allegro': [STRINGS_ACER, 'Allegro'],
			'M310': [STRINGS_ACER, 'Allegro']
		},

		'Asus': {
			'Galaxy6': [STRINGS_ASUS, 'Galaxy 6']
		},
	};

	var ANDROID_MODELS = {
		'Android': [null, null],
		'google sdk': [null, null],
		'ZTE-U V960': ['ZTE', 'Skate'],
		'ZTE Racer': ['ZTE', 'Racer'],
		'ZTE-RACER': ['ZTE', 'Racer'],
		'OPPO R813T': ['Oppo', 'R813'],
		'SCH-I879': ['Samsung', 'Galaxy Note'],
		'GT-S6102E': ['Samsung', 'Galaxy Y Duos']
	}

	var BLACKBERRY_MODELS = {
		'9600': 'Bold',
		'9650': 'Bold',
	};


	var Version = function(){
		this.initialize.apply(this, Array.prototype.slice.call(arguments))
	};
	Version.prototype = {
		initialize: function(v){
			this.original = v.value || null;
			this.alias = v.alias || null;

		}
	}

	var Detected = function(){
		this.initialize.apply(this, arguments)
	};
	Detected.prototype = {
		initialize: function(ua, options){
			this.options = {
				useFeatures: options && options.useFeatures || false,
				detectCamouflage: options && options.detectCamouflage || true
			}

			this.browser = {
				'stock': true,
				'hidden': false,
				'channel': ''
			};
			this.engine = {};
			this.os = {};
			this.device = {
				'type': 'desktop',
				'identified': false
			};

			this.camouflage = false;
			this.features = [];
			this.detect(ua);
		},

		detect: function(ua){


			/****************************************************
			 *      MacOS X

			/****************************************************
			 *      Windows
			 */

			/****************************************************
			 *      Android
			 */
			if(ua.match('Android')){
				this.os.name = 'Android';
				this.os.version = null;

				if(match = /Android(?: )?(?:AllPhone_|CyanogenMod_)?(?:\/)?v?([0-9.]+)/.exec(ua.replace('-update', '.'))){
					this.os.version = new Version({
						value: match[1],
						details: 3
					})
				}

				if(ua.match('Android Eclair')){
					this.os.version = new Version({
						value: '2.0',
						details: 3
					});
				}

				this.device.type = 'mobile';
				if(this.os.version >= 3) this.device.type = 'tablet';
				if(this.os.version >= 4 && ua.match('Mobile')) this.device.type = 'mobile';

				if(match = /Eclair; (?:[a-zA-Z][a-zA-Z](?:[-_][a-zA-Z][a-zA-Z])?) Build\/([^\/]*)\//.exec(ua)){
					this.device.model = match[1];
				}else if(match = /; ([^;]*[^;\s])\s+Build/.exec(ua)){
					this.device.model = match[1];
				}else if(match = /[a-zA-Z][a-zA-Z](?:[-_][a-zA-Z][a-zA-Z])?; ([^;]*[^;\s]);\s+Build/.exec(ua)){
					this.device.model = match[1];
				}else if(match = /\(([^;]+);U;Android\/[^;]+;[0-9]+\*[0-9]+;CTC\/2.0\)/.exec(ua)){
					this.device.model = match[1];
				}else if(match = /;\s?([^;]+);\s?[0-9]+\*[0-9]+;\s?CTC\/2.0/.exec(ua)){
					this.device.model = match[1];
				}else if(match = /zh-cn;\s*(.*?)(\/|build)/i.exec(ua)){
					this.device.model = match[1];
				}else if(match = /Android [^;]+; (?:[a-zA-Z][a-zA-Z](?:[-_][a-zA-Z][a-zA-Z])?; )?([^)]+)\)/.exec(ua)){
					if(!ua.match(/[a-zA-Z][a-zA-Z](?:[-_][a-zA-Z][a-zA-Z])?/)){
						this.device.model = match[1];
					}
				}else if(match = /^(.+?)\/\S+/i.exec(ua)){
					this.device.model = match[1];
				}


				/* Sometimes we get a model name that starts with Android, in that case it is a mismatch and we should ignore it */
				if(this.device.model && this.device.model.substring(0, 7) === 'Android'){
					this.device.model = null;
				}

				if(this.device.model){
					var model = cleanupModel(this.device.model);

					if(typeof ANDROID_MODELS[model] !== 'undefined'){
						this.device.manufacturer = ANDROID_MODELS[model][0];
						this.device.model = ANDROID_MODELS[model][1];
						if(typeof ANDROID_MODELS[model][2] !== 'undefined') this.device.type = ANDROID_MODELS[model][2];
						this.device.identified = true;
					}

					if(model === 'Emulator' || model === 'x86 Emulator' || model === 'x86 VirtualBox' || model === 'vm'){
						this.device.manufacturer = null;
						this.device.model = null;
						this.device.type = 'emulator';
						this.device.identified = true;
					}
				}

				if(ua.match('HP eStation')){
					this.device.manufacturer = 'HP';
					this.device.model = 'eStation';
					this.device.type = 'tablet';
					this.device.identified = true;
				}
				if(ua.match('Pre\/1.0')){
					this.device.manufacturer = 'Palm';
					this.device.model = 'Pre';
					this.device.identified = true;
				}
				if(ua.match('Pre\/1.1')){
					this.device.manufacturer = 'Palm';
					this.device.model = 'Pre Plus';
					this.device.identified = true;
				}
				if(ua.match('Pre\/1.2')){
					this.device.manufacturer = 'Palm';
					this.device.model = 'Pre 2';
					this.device.identified = true;
				}
				if(ua.match('Pre\/3.0')){
					this.device.manufacturer = 'HP';
					this.device.model = 'Pre 3';
					this.device.identified = true;
				}
				if(ua.match('Pixi\/1.0')){
					this.device.manufacturer = 'Palm';
					this.device.model = 'Pixi';
					this.device.identified = true;
				}
				if(ua.match('Pixi\/1.1')){
					this.device.manufacturer = 'Palm';
					this.device.model = 'Pixi Plus';
					this.device.identified = true;
				}
				if(ua.match('P160UN?A?\/1.0')){
					this.device.manufacturer = 'HP';
					this.device.model = 'Veer';
					this.device.identified = true;
				}
			}

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
						if(match = /^GIONEE-([^\s]+)/.exec(candidates[i])){
							this.device.manufacturer = 'Gionee';
							this.device.model = cleanupModel(match[1]);
							this.device.type = 'mobile';
							this.device.identified = true;
						}

						if(match = /^HTC_?([^\/_]+)(?:\/|_|$)/.exec(candidates[i])){
							this.device.manufacturer = STRINGS_HTC;
							this.device.model = cleanupModel(match[1]);
							this.device.type = 'mobile';
							this.device.identified = true;
						}

						if(match = /^HUAWEI-([^\/]*)/.exec(candidates[i])){
							this.device.manufacturer = STRINGS_HUAWEI;
							this.device.model = cleanupModel(match[1]);
							this.device.type = 'mobile';
							this.device.identified = true;
						}

						if(match = /(?:^|\()LGE?(?:\/|-|_|\s)([^\s]*)/.exec(candidates[i])){
							this.device.manufacturer = STRINGS_LG;
							this.device.model = cleanupModel(match[1]);
							this.device.type = 'mobile';
							this.device.identified = true;
						}

						if(match = /^MOT-([^\/_]+)(?:\/|_|$)/.exec(candidates[i])){
							this.device.manufacturer = STRINGS_MOTOROLA;
							this.device.model = cleanupModel(match[1]);
							this.device.type = 'mobile';
							this.device.identified = true;
						}

						if(match = /^Motorola_([^\/_]+)(?:\/|_|$)/.exec(candidates[i])){
							this.device.manufacturer = STRINGS_MOTOROLA;
							this.device.model = cleanupModel(match[1]);
							this.device.type = 'mobile';
							this.device.identified = true;
						}

						if(match = /^Nokia([^\/]+)(?:\/|$)/.exec(candidates[i])){
							this.device.manufacturer = 'Nokia';
							this.device.model = cleanupModel(match[1]);
							this.device.type = 'mobile';
							this.device.identified = true;

							if(!this.os.name){
								this.os.name = 'Series40';
							}
						}

						if(match = /^SonyEricsson([^\/_]+)(?:\/|_|$)/.exec(candidates[i])){
							this.device.manufacturer = STRINGS_SONY_ERICSSON;
							this.device.model = cleanupModel(match[1]);
							this.device.type = 'mobile';
							this.device.identified = true;
						}

						if(match = /^SAMSUNG-([^\/_]+)(?:\/|_|$)/.exec(candidates[i])){
							this.device.manufacturer = STRINGS_SAMSUNG;
							this.device.model = cleanupModel(match[1]);
							this.device.type = 'mobile';

							if(this.os.name === 'Bada'){
								var manufacturer = 'SAMSUNG';
								var model = cleanupModel(this.device.model);

								if(typeof BADA_MODELS[manufacturer] !== 'undefined' && typeof BADA_MODELS[manufacturer][model] !== 'undefined'){
									this.device.manufacturer = BADA_MODELS[manufacturer][model][0];
									this.device.model = BADA_MODELS[manufacturer][model][1];
									this.device.identified = true;
								}
							}else if(match = /Jasmine\/([0-9.]*)/.exec(ua)){
								var version = match[1];
								var manufacturer = 'SAMSUNG';
								var model = cleanupModel(this.device.model);

								if(typeof TOUCHWIZ_MODELS[manufacturer] !== 'undefined' && typeof TOUCHWIZ_MODELS[manufacturer][model] !== 'undefined'){
									this.device.manufacturer = TOUCHWIZ_MODELS[manufacturer][model][0];
									this.device.model = TOUCHWIZ_MODELS[manufacturer][model][1];
									this.device.identified = true;

									this.os.name = 'Touchwiz';
									this.os.version = new Version({
										value: '2.0'
									});
								}
							}else if(match = /Dolfin\/([0-9.]*)/.exec(ua)){
								var version = match[1];
								var manufacturer = 'SAMSUNG';
								var model = cleanupModel(this.device.model);

								if(typeof BADA_MODELS[manufacturer] !== 'undefined' && typeof BADA_MODELS[manufacturer][model] !== 'undefined'){
									this.device.manufacturer = BADA_MODELS[manufacturer][model][0];
									this.device.model = BADA_MODELS[manufacturer][model][1];
									this.device.identified = true;

									this.os.name = 'Bada';

									switch(version){
										case '2.0':
											this.os.version = new Version({
												value: '1.0'
											});
											break;
										case '2.2':
											this.os.version = new Version({
												value: '1.2'
											});
											break;
										case '3.0':
											this.os.version = new Version({
												value: '2.0'
											});
											break;
									}
								}

								if(typeof TOUCHWIZ_MODELS[manufacturer] !== 'undefined' && typeof TOUCHWIZ_MODELS[manufacturer][model] !== 'undefined'){
									this.device.manufacturer = TOUCHWIZ_MODELS[manufacturer][model][0];
									this.device.model = TOUCHWIZ_MODELS[manufacturer][model][1];
									this.device.identified = true;

									this.os.name = 'Touchwiz';

									switch(version){
										case '1.0':
											this.os.version = new Version({
												value: '1.0'
											});
											break;
										case '1.5':
											this.os.version = new Version({
												value: '2.0'
											});
											break;
										case '2.0':
											this.os.version = new Version({
												value: '3.0'
											});
											break;
									}
								}
							}
						}
					}
				}
			}


			if(match = /\((?:LG[-|\/])(.*) (?:Browser\/)?AppleWebkit/.exec(ua)){
				this.device.manufacturer = STRINGS_LG;
				this.device.model = match[1];
				this.device.type = 'mobile';
				this.device.identified = true;
			}

			if(match = /^Mozilla\/5.0 \((?:Nokia|NOKIA)(?:\s?)([^\)]+)\)UC AppleWebkit\(like Gecko\) Safari\/530$/.exec(ua)){
				this.device.manufacturer = 'Nokia';
				this.device.model = match[1];
				this.device.type = 'mobile';
				this.device.identified = true;

				this.os.name = 'Series60';
			}


			/****************************************************
			 *      Safari
			 */

			if(ua.match('Safari')){
				if(this.os.name === 'iOS'){
					this.browser.stock = true;
					this.browser.hidden = true;
					this.browser.name = 'Safari';
					this.browser.version = null;
				}


				if(this.os.name === 'Mac OS X' || this.os.name === 'Windows'){
					this.browser.name = 'Safari';
					this.browser.stock = this.os.name === 'Mac OS X';

					if(match = /Version\/([0-9\.]+)/.exec(ua)){
						this.browser.version = new Version({
							value: match[1]
						});
					}

					if(ua.match(/AppleWebKit\/[0-9\.]+\+/)){
						this.browser.name = 'WebKit Nightly Build';
						this.browser.version = null;
					}
				}
			}

			/****************************************************
			 *      Internet Explorer
			 */

			if(ua.match('MSIE')){
				this.browser.name = 'Internet Explorer';

				if(ua.match('IEMobile') || ua.match('Windows CE') || ua.match('Windows Phone') || ua.match('WP7')){
					this.browser.name = 'Mobile Internet Explorer';
				}

				if(match = /MSIE ([0-9.]*)/.exec(ua)){
					this.browser.version = new Version({
						value: match[1]
					});
				}
			}

			/****************************************************
			 *      Opera
			 */

			if(ua.match(/Opera/i)){
				this.browser.stock = false;
				this.browser.name = 'Opera';

				if(match = /Opera[\/| ]([0-9.]*)/.exec(ua)){
					this.browser.version = new Version({
						value: match[1]
					});
				}

				if(match = /Version\/([0-9.]*)/.exec(ua)){
					if(parseFloat(match[1]) >= 10){
						this.browser.version = new Version({
							value: match[1]
						});
					}else{
						this.browser.version = null;
					}
				}

				if(this.browser.version && ua.match('Edition Labs')){
					this.browser.version.type = 'alpha';
					this.browser.channel = 'Labs';
				}

				if(this.browser.version && ua.match('Edition Next')){
					this.browser.version.type = 'alpha';
					this.browser.channel = 'Next';
				}

				if(ua.match('Opera Tablet')){
					this.browser.name = 'Opera Mobile';
					this.device.type = 'tablet';
				}

				if(ua.match('Opera Mobi')){
					this.browser.name = 'Opera Mobile';
					this.device.type = 'mobile';
				}

				if(match = /Opera Mini;/.exec(ua)){
					this.browser.name = 'Opera Mini';
					this.browser.version = null;
					this.browser.mode = 'proxy';
					this.device.type = 'mobile';
				}

				if(match = /Opera Mini\/(?:att\/)?([0-9.]*)/.exec(ua)){
					this.browser.name = 'Opera Mini';
					this.browser.version = new Version({
						value: match[1],
						details: -1
					});
					this.browser.mode = 'proxy';
					this.device.type = 'mobile';
				}

				if(this.browser.name === 'Opera' && this.device.type === 'mobile'){
					this.browser.name = 'Opera Mobile';

					if(ua.match(/BER/)){
						this.browser.name = 'Opera Mini';
						this.browser.version = null;
					}
				}

				if(ua.match('InettvBrowser')){
					this.device.type = 'television';
				}

				if(ua.match('Opera TV') || ua.match('Opera-TV')){
					this.browser.name = 'Opera';
					this.device.type = 'television';
				}

				if(ua.match('Linux zbov')){
					this.browser.name = 'Opera Mobile';
					this.browser.mode = 'desktop';

					this.device.type = 'mobile';

					this.os.name = null;
					this.os.version = null;
				}

				if(ua.match('Linux zvav')){
					this.browser.name = 'Opera Mini';
					this.browser.version = null;
					this.browser.mode = 'desktop';

					this.device.type = 'mobile';

					this.os.name = null;
					this.os.version = null;
				}
			}

			/****************************************************
			 *      Firefox
			 */

			if(ua.match('Firefox')){
				this.browser.stock = false;
				this.browser.name = 'Firefox';

				if(match = /Firefox\/([0-9ab.]*)/.exec(ua)){
					this.browser.version = new Version({
						value: match[1]
					});
				}

				if(this.browser.version.type === 'alpha'){
					this.browser.channel = 'Aurora';
				}

				if(this.browser.version.type === 'beta'){
					this.browser.channel = 'Beta';
				}

				if(ua.match('Fennec')){
					this.device.type = 'mobile';
				}

				if(ua.match('Mobile; rv')){
					this.device.type = 'mobile';
				}

				if(ua.match('Tablet; rv')){
					this.device.type = 'tablet';
				}

				if(this.device.type === 'mobile' || this.device.type === 'tablet'){
					this.browser.name = 'Firefox Mobile';
				}
			}

			if(ua.match('Namoroka')){
				this.browser.stock = false;
				this.browser.name = 'Firefox';

				if(match = /Namoroka\/([0-9ab.]*)/.exec(ua)){
					this.browser.version = new Version({
						value: match[1]
					});
				}

				this.browser.channel = 'Namoroka';
			}

			if(ua.match('Shiretoko')){
				this.browser.stock = false;
				this.browser.name = 'Firefox';

				if(match = /Shiretoko\/([0-9ab.]*)/.exec(ua)){
					this.browser.version = new Version({
						value: match[1]
					});
				}

				this.browser.channel = 'Shiretoko';
			}

			if(ua.match('Minefield')){
				this.browser.stock = false;
				this.browser.name = 'Firefox';

				if(match = /Minefield\/([0-9ab.]*)/.exec(ua)){
					this.browser.version = new Version({
						value: match[1]
					});
				}

				this.browser.channel = 'Minefield';
			}

			if(ua.match('Firebird')){
				this.browser.stock = false;
				this.browser.name = 'Firebird';

				if(match = /Firebird\/([0-9ab.]*)/.exec(ua)){
					this.browser.version = new Version({
						value: match[1]
					});
				}
			}

			/****************************************************
			 *      SeaMonkey
			 */

			if(ua.match('SeaMonkey')){
				this.browser.stock = false;
				this.browser.name = 'SeaMonkey';

				if(match = /SeaMonkey\/([0-9.]*)/.exec(ua)){
					this.browser.version = new Version({
						value: match[1]
					});
				}
			}

			/****************************************************
			 *      Netscape
			 */

			if(ua.match('Netscape')){
				this.browser.stock = false;
				this.browser.name = 'Netscape';

				if(match = /Netscape[0-9]?\/([0-9.]*)/.exec(ua)){
					this.browser.version = new Version({
						value: match[1]
					});
				}
			}

			/****************************************************
			 *      Konqueror
			 */

			if(ua.match('[k|K]onqueror/')){
				this.browser.name = 'Konqueror';

				if(match = /[k|K]onqueror\/([0-9.]*)/.exec(ua)){
					this.browser.version = new Version({
						value: match[1]
					});
				}
			}

			/****************************************************
			 *      Chrome
			 */

			if(match = /(?:Chrome|CrMo|CriOS)\/([0-9.]*)/.exec(ua)){
				this.browser.stock = false;
				this.browser.name = 'Chrome';
				this.browser.version = new Version({
					value: match[1]
				});

				if(this.os.name === 'Android'){
					switch(match[1].split('.', 3).join('.')){
						case '16.0.912':
							this.browser.channel = 'Beta';
							break;
						case '18.0.1025':
							this.browser.version.details = 1;
							break;
						default:
							this.browser.channel = 'Nightly';
							break;
					}
				}else{
					switch(match[1].split('.', 3).join('.')){
						case '0.2.149':
						case '0.3.154':
						case '0.4.154':
						case '1.0.154':
						case '2.0.172':
						case '3.0.195':
						case '4.0.249':
						case '4.1.249':
						case '5.0.375':
						case '6.0.472':
						case '7.0.517':
						case '8.0.552':
						case '9.0.597':
						case '10.0.648':
						case '11.0.696':
						case '12.0.742':
						case '13.0.782':
						case '14.0.835':
						case '15.0.874':
						case '16.0.912':
						case '17.0.963':
						case '18.0.1025':
						case '19.0.1084':
						case '20.0.1132':
						case '21.0.1180':
							if(this.browser.version.minor === 0) this.browser.version.details = 1;
							else this.browser.version.details = 2;

							break;
						default:
							this.browser.channel = 'Nightly';
							break;
					}
				}
			}

			/****************************************************
			 *      Chrome Frame
			 */

			if(ua.match('chromeframe')){
				this.browser.stock = false;
				this.browser.name = 'Chrome Frame';

				if(match = /chromeframe\/([0-9.]*)/.exec(ua)){
					this.browser.version = new Version({
						value: match[1]
					});
				}
			}

			/****************************************************
			 *      Chromium
			 */

			if(ua.match('Chromium')){
				this.browser.stock = false;
				this.browser.channel = '';
				this.browser.name = 'Chromium';

				if(match = /Chromium\/([0-9.]*)/.exec(ua)){
					this.browser.version = new Version({
						value: match[1]
					});
				}
			}

			/****************************************************
			 *      BrowserNG
			 */

			if(ua.match('BrowserNG')){
				this.browser.name = 'Nokia Browser';

				if(match = /BrowserNG\/([0-9.]*)/.exec(ua)){
					this.browser.version = new Version({
						value: match[1],
						details: 3,
						builds: false
					});
				}
			}

			/****************************************************
			 *      Nokia Browser
			 */

			if(ua.match('NokiaBrowser')){
				this.browser.name = 'Nokia Browser';

				if(match = /NokiaBrowser\/([0-9.]*)/.exec(ua)){
					this.browser.version = new Version({
						value: match[1],
						details: 3
					});
				}
			}

			/****************************************************
			 *      MicroB
			 */

			if(ua.match('Maemo[ |_]Browser')){
				this.browser.name = 'MicroB';

				if(match = /Maemo[ |_]Browser[ |_]([0-9.]*)/.exec(ua)){
					this.browser.version = new Version({
						value: match[1],
						details: 3
					});
				}
			}


			/****************************************************
			 *      NetFront
			 */

			if(ua.match('NetFront')){
				this.browser.name = 'NetFront';
				this.device.type = 'mobile';

				if(match = /NetFront\/([0-9.]*)/.exec(ua)){
					this.browser.version = new Version({
						value: match[1]
					});
				}

				if(ua.match('InettvBrowser')){
					this.device.type = 'television';
				}
			}

			/****************************************************
			 *      Silk
			 */

			if(ua.match('Silk')){
				if(ua.match('Silk-Accelerated')){
					this.browser.name = 'Silk';

					if(match = /Silk\/([0-9.]*)/.exec(ua)){
						this.browser.version = new Version({
							value: match[1],
							details: 2
						});
					}

					this.device.manufacturer = 'Amazon';
					this.device.model = 'Kindle Fire';
					this.device.type = 'tablet';
					this.device.identified = true;

					if(this.os.name !== 'Android'){
						this.os.name = 'Android';
						this.os.version = null;
					}
				}
			}

			/****************************************************
			 *      Dolfin
			 */

			if(ua.match('Dolfin')){
				this.browser.name = 'Dolfin';

				if(match = /Dolfin\/([0-9.]*)/.exec(ua)){
					this.browser.version = new Version({
						value: match[1]
					});
				}
			}


			/****************************************************
			 *      Iris
			 */

			if(ua.match('Iris')){
				this.browser.name = 'Iris';

				this.device.type = 'mobile';
				this.device.model = null;
				this.device.manufacturer = null;

				this.os.name = 'Windows Mobile';
				this.os.version = null;

				if(match = /Iris\/([0-9.]*)/.exec(ua)){
					this.browser.version = new Version({
						value: match[1]
					});
				}

				if(match = / WM([0-9]) /.exec(ua)){
					this.os.version = new Version({
						value: match[1] + '.0'
					});
				}else{
					this.browser.mode = 'desktop';
				}
			}

			/****************************************************
			 *      Jasmine
			 */

			if(ua.match('Jasmine')){
				this.browser.name = 'Jasmine';

				if(match = /Jasmine\/([0-9.]*)/.exec(ua)){
					this.browser.version = new Version({
						value: match[1]
					});
				}
			}

			/****************************************************
			 *      Boxee
			 */

			if(ua.match('Boxee')){
				this.browser.name = 'Boxee';
				this.device.type = 'television';

				if(match = /Boxee\/([0-9.]*)/.exec(ua)){
					this.browser.version = new Version({
						value: match[1]
					});
				}
			}

			/****************************************************
			 *      Espial
			 */

			if(ua.match('Espial')){
				this.browser.name = 'Espial';

				this.os.name = '';
				this.os.version = null;

				if(this.device.type !== 'television'){
					this.device.type = 'television';
					this.device.model = null;
					this.device.manufacturer = null;
				}

				if(match = /Espial\/([0-9.]*)/.exec(ua)){
					this.browser.version = new Version({
						value: match[1]
					});
				}
			}

			/****************************************************
			 *      ANT Galio
			 */
			if(match = /ANTGalio\/([0-9.]*)/.exec(ua)){
				this.browser.name = 'ANT Galio';
				this.browser.version = new Version({
					value: match[1],
					details: 3
				});
				this.device.type = 'television';
			}

			/****************************************************
			 *      NetFront NX
			 */
			if(match = /NX\/([0-9.]*)/.exec(ua)){
				this.browser.name = 'NetFront NX';
				this.browser.version = new Version({
					value: match[1],
					details: 2
				});
				if(match = /DTV/i.exec(ua)){
					this.device.type = 'television';
				}else if(match = /mobile/i.exec(ua)){
					this.device.type = 'mobile';
				}else{
					this.device.type = 'desktop';
				}

				this.os.name = null;
				this.os.version = null;
			}

			/****************************************************
			 *      Obigo
			 */

			if(ua.match(/Obigo/i)){
				this.browser.name = 'Obigo';

				if(match = /Obigo\/([0-9.]*)/i.exec(ua)){
					this.browser.version = new Version({
						value: match[1]
					});
				}

				if(match = /Obigo\/([A-Z])([0-9.]*)/i.exec(ua)){
					this.browser.name = 'Obigo ' + match[1];
					this.browser.version = new Version({
						value: match[2]
					});
				}

				if(match = /Obigo-([A-Z])([0-9.]*)\//i.exec(ua)){
					this.browser.name = 'Obigo ' + match[1];
					this.browser.version = new Version({
						value: match[2]
					});
				}
			}

			/****************************************************
			 *      UC Web
			 */

			if(ua.match('UCWEB')){
				this.browser.stock = false;
				this.browser.name = 'UC Browser';

				if(match = /UCWEB([0-9]*[.][0-9]*)/.exec(ua)){
					this.browser.version = new Version({
						value: match[1],
						details: 3
					});
				}

				if(this.os.name === 'Linux'){
					this.os.name = '';
				}

				this.device.type = 'mobile';

				if(match = /^IUC \(U;\s?iOS ([0-9\.]+);/.exec(ua)){
					this.os.name = 'iOS';
					this.os.version = new Version({
						value: match[1]
					});
				}

				if(match = /^JUC \(Linux; U; ([0-9\.]+)[^;]*; [^;]+; ([^;]*[^\s])\s*; [0-9]+\*[0-9]+\)/.exec(ua)){
					var model = cleanupModel(match[2]);

					this.os.name = 'Android';
					this.os.version = new Version({
						value: match[1]
					});

					if(typeof ANDROID_MODELS[model] !== 'undefined'){
						this.device.manufacturer = ANDROID_MODELS[model][0];
						this.device.model = ANDROID_MODELS[model][1];
						if(typeof ANDROID_MODELS[model][2] !== 'undefined') this.device.type = ANDROID_MODELS[model][2];
						this.device.identified = true;
					}
				}
			}

			if(ua.match(/\) UC /)){
				this.browser.stock = false;
				this.browser.name = 'UC Browser';
			}

			if(match = /UCBrowser\/([0-9.]*)/.exec(ua)){
				this.browser.stock = false;
				this.browser.name = 'UC Browser';
				this.browser.version = new Version({
					value: match[1],
					details: 2
				});
			}

			/****************************************************
			 *      NineSky
			 */

			if(match = /Ninesky(?:-android-mobile(?:-cn)?)?\/([0-9.]*)/.exec(ua)){
				this.browser.name = 'NineSky';
				this.browser.version = new Version({
					value: match[1]
				});

				if(this.os.name !== 'Android'){
					this.os.name = 'Android';
					this.os.version = null;

					this.device.manufacturer = null;
					this.device.model = null;
				}
			}

			/****************************************************
			 *      Skyfire
			 */

			if(match = /Skyfire\/([0-9.]*)/.exec(ua)){
				this.browser.name = 'Skyfire';
				this.browser.version = new Version({
					value: match[1]
				});

				this.device.type = 'mobile';

				this.os.name = 'Android';
				this.os.version = null;
			}

			/****************************************************
			 *      Dolphin HD
			 */

			if(match = /DolphinHDCN\/([0-9.]*)/.exec(ua)){
				this.browser.name = 'Dolphin';
				this.browser.version = new Version({
					value: match[1]
				});

				this.device.type = 'mobile';

				if(this.os.name !== 'Android'){
					this.os.name = 'Android';
					this.os.version = null;
				}
			}

			if(match = /Dolphin\/INT/.exec(ua)){
				this.browser.name = 'Dolphin';
				this.device.type = 'mobile';
			}

			/****************************************************
			 *      QQ Browser
			 */

			if(match = /(M?QQBrowser)\/([0-9.]*)/.exec(ua)){
				this.browser.name = 'QQ Browser';

				var version = match[2];
				if(version.match(/^[0-9][0-9]$/)) version = version[0] + '.' + version[1];

				this.browser.version = new Version({
					value: version,
					details: 2
				});
				this.browser.channel = ''

				if(!this.os.name && match[1] === 'QQBrowser'){
					this.os.name = 'Windows';
				}
			}

			/****************************************************
			 *      iBrowser
			 */

			if(match = /(iBrowser)\/([0-9.]*)/.exec(ua)){
				this.browser.name = 'iBrowser';

				var version = match[2];
				if(version.match(/[0-9][0-9]/)) version = version[0] + '.' + version[1];

				this.browser.version = new Version({
					value: version,
					details: 2
				});
				this.browser.channel = ''
			}

			/****************************************************
			 *      Puffin
			 */

			if(match = /Puffin\/([0-9.]*)/.exec(ua)){
				this.browser.name = 'Puffin';
				this.browser.version = new Version({
					value: match[1],
					details: 2
				});

				this.device.type = 'mobile';

				if(this.os.name === 'Linux'){
					this.os.name = null;
					this.os.version = null;
				}
			}

			/****************************************************
			 *      360 Extreme Explorer
			 */

			if(ua.match('360EE')){
				this.browser.stock = false;
				this.browser.name = '360 Extreme Explorer';
				this.browser.version = null;
			}

			/****************************************************
			 *      Midori
			 */

			if(match = /Midori\/([0-9.]*)/.exec(ua)){
				this.browser.name = 'Midori';
				this.browser.version = new Version({
					value: match[1]
				});

				if(this.os.name !== 'Linux'){
					this.os.name = 'Linux';
					this.os.version = null;
				}

				this.device.manufacturer = null;
				this.device.model = null;
				this.device.type = 'desktop';
			}

			/****************************************************
			 *      Others
			 */

			var browsers = [{
				name: 'AdobeAIR',
				regexp: /AdobeAIR\/([0-9.]*)/
			}, {
				name: 'Awesomium',
				regexp: /Awesomium\/([0-9.]*)/
			}, {
				name: 'Canvace',
				regexp: /Canvace Standalone\/([0-9.]*)/
			}, {
				name: 'Ekioh',
				regexp: /Ekioh\/([0-9.]*)/
			}, {
				name: 'JavaFX',
				regexp: /JavaFX\/([0-9.]*)/
			}, {
				name: 'GFXe',
				regexp: /GFXe\/([0-9.]*)/
			}, {
				name: 'LuaKit',
				regexp: /luakit/
			}, {
				name: 'Titanium',
				regexp: /Titanium\/([0-9.]*)/
			}, {
				name: 'OpenWebKitSharp',
				regexp: /OpenWebKitSharp/
			}, {
				name: 'Prism',
				regexp: /Prism\/([0-9.]*)/
			}, {
				name: 'Qt',
				regexp: /Qt\/([0-9.]*)/
			}, {
				name: 'QtEmbedded',
				regexp: /QtEmbedded/
			}, {
				name: 'QtEmbedded',
				regexp: /QtEmbedded.*Qt\/([0-9.]*)/
			}, {
				name: 'RhoSimulator',
				regexp: /RhoSimulator/
			}, {
				name: 'UWebKit',
				regexp: /UWebKit\/([0-9.]*)/
			},

				{
					name: 'PhantomJS',
					regexp: /PhantomJS\/([0-9.]*)/
				}, {
					name: 'Google Web Preview',
					regexp: /Google Web Preview/
				},

				{
					name: 'Google Earth',
					regexp: /Google Earth\/([0-9.]*)/
				}, {
					name: 'EA Origin',
					regexp: /Origin\/([0-9.]*)/
				}, {
					name: 'SecondLife',
					regexp: /SecondLife\/([0-9.]*)/
				}, {
					name: 'Valve Steam',
					regexp: /Valve Steam/
				},

				{
					name: 'Songbird',
					regexp: /Songbird\/([0-9.]*)/
				}, {
					name: 'Thunderbird',
					regexp: /Thunderbird\/([0-9.]*)/
				},

				{
					name: 'Abrowser',
					regexp: /Abrowser\/([0-9.]*)/
				}, {
					name: 'arora',
					regexp: /[Aa]rora\/([0-9.]*)/
				}, {
					name: 'Baidu Browser',
					regexp: /M?BaiduBrowser\/([0-9.]*)/i
				}, {
					name: 'Camino',
					regexp: /Camino\/([0-9.]*)/
				}, {
					name: 'Canure',
					regexp: /Canure\/([0-9.]*)/,
					details: 3
				}, {
					name: 'CometBird',
					regexp: /CometBird\/([0-9.]*)/
				}, {
					name: 'Comodo Dragon',
					regexp: /Comodo_Dragon\/([0-9.]*)/,
					details: 2
				}, {
					name: 'Conkeror',
					regexp: /[Cc]onkeror\/([0-9.]*)/
				}, {
					name: 'CoolNovo',
					regexp: /(?:CoolNovo|CoolNovoChromePlus)\/([0-9.]*)/,
					details: 3
				}, {
					name: 'ChromePlus',
					regexp: /ChromePlus(?:\/([0-9.]*))?$/,
					details: 3
				}, {
					name: 'Daedalus',
					regexp: /Daedalus ([0-9.]*)/,
					details: 2
				}, {
					name: 'Demobrowser',
					regexp: /demobrowser\/([0-9.]*)/
				}, {
					name: 'Dooble',
					regexp: /Dooble(?:\/([0-9.]*))?/
				}, {
					name: 'DWB',
					regexp: /dwb(?:-hg)?(?:\/([0-9.]*))?/
				}, {
					name: 'Epiphany',
					regexp: /Epiphany\/([0-9.]*)/
				}, {
					name: 'FireWeb',
					regexp: /FireWeb\/([0-9.]*)/
				}, {
					name: 'Flock',
					regexp: /Flock\/([0-9.]*)/,
					details: 3
				}, {
					name: 'Galeon',
					regexp: /Galeon\/([0-9.]*)/,
					details: 3
				}, {
					name: 'Helium',
					regexp: /HeliumMobileBrowser\/([0-9.]*)/
				}, {
					name: 'iCab',
					regexp: /iCab\/([0-9.]*)/
				}, {
					name: 'Iceape',
					regexp: /Iceape\/([0-9.]*)/
				}, {
					name: 'IceCat',
					regexp: /IceCat ([0-9.]*)/
				}, {
					name: 'Iceweasel',
					regexp: /Iceweasel\/([0-9.]*)/
				}, {
					name: 'InternetSurfboard',
					regexp: /InternetSurfboard\/([0-9.]*)/
				}, {
					name: 'Iron',
					regexp: /Iron\/([0-9.]*)/,
					details: 2
				}, {
					name: 'Isis',
					regexp: /BrowserServer/
				}, {
					name: 'Jumanji',
					regexp: /jumanji/
				}, {
					name: 'Kazehakase',
					regexp: /Kazehakase\/([0-9.]*)/
				}, {
					name: 'KChrome',
					regexp: /KChrome\/([0-9.]*)/,
					details: 3
				}, {
					name: 'K-Meleon',
					regexp: /K-Meleon\/([0-9.]*)/
				}, {
					name: 'Leechcraft',
					regexp: /Leechcraft(?:\/([0-9.]*))?/,
					details: 2
				}, {
					name: 'Lightning',
					regexp: /Lightning\/([0-9.]*)/
				}, {
					name: 'Lunascape',
					regexp: /Lunascape[\/| ]([0-9.]*)/,
					details: 3
				}, {
					name: 'iLunascape',
					regexp: /iLunascape\/([0-9.]*)/,
					details: 3
				}, {
					name: 'Maxthon',
					regexp: /Maxthon[\/ ]([0-9.]*)/,
					details: 3
				}, {
					name: 'MiniBrowser',
					regexp: /MiniBr?owserM\/([0-9.]*)/
				}, {
					name: 'MiniBrowser',
					regexp: /MiniBrowserMobile\/([0-9.]*)/
				}, {
					name: 'MixShark',
					regexp: /MixShark\/([0-9.]*)/
				}, {
					name: 'Motorola WebKit',
					regexp: /MotorolaWebKit\/([0-9.]*)/,
					details: 3
				}, {
					name: 'NetFront LifeBrowser',
					regexp: /NetFrontLifeBrowser\/([0-9.]*)/
				}, {
					name: 'Netscape Navigator',
					regexp: /Navigator\/([0-9.]*)/,
					details: 3
				}, {
					name: 'Odyssey',
					regexp: /OWB\/([0-9.]*)/
				}, {
					name: 'OmniWeb',
					regexp: /OmniWeb/
				}, {
					name: 'Orca',
					regexp: /Orca\/([0-9.]*)/
				}, {
					name: 'Origyn',
					regexp: /Origyn Web Browser/
				}, {
					name: 'Palemoon',
					regexp: /Pale[mM]oon\/([0-9.]*)/
				}, {
					name: 'Phantom',
					regexp: /Phantom\/V([0-9.]*)/
				}, {
					name: 'Polaris',
					regexp: /Polaris\/v?([0-9.]*)/i,
					details: 2
				}, {
					name: 'QtCreator',
					regexp: /QtCreator\/([0-9.]*)/
				}, {
					name: 'QtQmlViewer',
					regexp: /QtQmlViewer/
				}, {
					name: 'QtTestBrowser',
					regexp: /QtTestBrowser\/([0-9.]*)/
				}, {
					name: 'QtWeb',
					regexp: /QtWeb Internet Browser\/([0-9.]*)/
				}, {
					name: 'QupZilla',
					regexp: /QupZilla\/([0-9.]*)/
				}, {
					name: 'Roccat',
					regexp: /Roccat\/([0-9]\.[0-9.]*)/
				}, {
					name: 'Raven for Mac',
					regexp: /Raven for Mac\/([0-9.]*)/
				}, {
					name: 'rekonq',
					regexp: /rekonq/
				}, {
					name: 'RockMelt',
					regexp: /RockMelt\/([0-9.]*)/,
					details: 2
				}, {
					name: 'Sleipnir',
					regexp: /Sleipnir\/([0-9.]*)/,
					details: 3
				}, {
					name: 'SMBrowser',
					regexp: /SMBrowser/
				}, {
					name: 'Sogou Explorer',
					regexp: /SE 2.X MetaSr/
				}, {
					name: 'Snowshoe',
					regexp: /Snowshoe\/([0-9.]*)/,
					details: 2
				}, {
					name: 'Sputnik',
					regexp: /Sputnik\/([0-9.]*)/i,
					details: 3
				}, {
					name: 'Stainless',
					regexp: /Stainless\/([0-9.]*)/
				}, {
					name: 'SunChrome',
					regexp: /SunChrome\/([0-9.]*)/
				}, {
					name: 'Surf',
					regexp: /Surf\/([0-9.]*)/
				}, {
					name: 'TaoBrowser',
					regexp: /TaoBrowser\/([0-9.]*)/,
					details: 2
				}, {
					name: 'TaomeeBrowser',
					regexp: /TaomeeBrowser\/([0-9.]*)/,
					details: 2
				}, {
					name: 'TazWeb',
					regexp: /TazWeb/
				}, {
					name: 'Viera',
					regexp: /Viera\/([0-9.]*)/
				}, {
					name: 'Villanova',
					regexp: /Villanova\/([0-9.]*)/,
					details: 3
				}, {
					name: 'Wavelink Velocity',
					regexp: /Wavelink Velocity Browser\/([0-9.]*)/,
					details: 2
				}, {
					name: 'WebPositive',
					regexp: /WebPositive/
				}, {
					name: 'WebRender',
					regexp: /WebRender/
				}, {
					name: 'Wyzo',
					regexp: /Wyzo\/([0-9.]*)/,
					details: 3
				}, {
					name: 'Zetakey',
					regexp: /Zetakey Webkit\/([0-9.]*)/
				}, {
					name: 'Zetakey',
					regexp: /Zetakey\/([0-9.]*)/
				}]

			for(var b = 0; b < browsers.length; b++){
				if(match = browsers[b].regexp.exec(ua)){
					this.browser.name = browsers[b].name;
					this.browser.channel = '';
					this.browser.stock = false;

					if(match[1]){
						this.browser.version = new Version({
							value: match[1],
							details: browsers[b].details || null
						});
					}else{
						this.browser.version = null;
					}
				}
			}


			/****************************************************
			 *      WebKit
			 */

			if(match = /WebKit\/([0-9.]*)/i.exec(ua)){
				this.engine.name = 'Webkit';
				this.engine.version = new Version({
					value: match[1]
				});
			}

			if(match = /Browser\/AppleWebKit([0-9.]*)/i.exec(ua)){
				this.engine.name = 'Webkit';
				this.engine.version = new Version({
					value: match[1]
				});
			}

			/****************************************************
			 *      KHTML
			 */

			if(match = /KHTML\/([0-9.]*)/.exec(ua)){
				this.engine.name = 'KHTML';
				this.engine.version = new Version({
					value: match[1]
				});
			}

			/****************************************************
			 *      Gecko
			 */

			if(/Gecko/.exec(ua) && !/like Gecko/i.exec(ua)){
				this.engine.name = 'Gecko';

				if(match = /; rv:([^\)]+)\)/.exec(ua)){
					this.engine.version = new Version({
						value: match[1]
					});
				}
			}

			/****************************************************
			 *      Presto
			 */

			if(match = /Presto\/([0-9.]*)/.exec(ua)){
				this.engine.name = 'Presto';
				this.engine.version = new Version({
					value: match[1]
				});
			}

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

	function cleanupModel(s){
		s = typeof s === 'undefined' ? '' : s;

		s = s.replace(/_TD$/, '');
		s = s.replace(/_CMCC$/, '');

		s = s.replace(/_/g, ' ');
		s = s.replace(/^\s+|\s+$/g, '');
		s = s.replace(/\/[^/]+$/, '');
		s = s.replace(/\/[^/]+ Android\/.*/, '');

		s = s.replace(/^tita on /, '');
		s = s.replace(/^Android on /, '');
		s = s.replace(/^Android for /, '');
		s = s.replace(/^ICS AOSP on /, '');
		s = s.replace(/^Full AOSP on /, '');
		s = s.replace(/^Full Android on /, '');
		s = s.replace(/^Full Cappuccino on /, '');
		s = s.replace(/^Full MIPS Android on /, '');
		s = s.replace(/^Full Android/, '');

		s = s.replace(/^Acer ?/i, '');
		s = s.replace(/^Iconia /, '');
		s = s.replace(/^Ainol /, '');
		s = s.replace(/^Coolpad ?/i, 'Coolpad ');
		s = s.replace(/^ALCATEL /, '');
		s = s.replace(/^Alcatel OT-(.*)/, 'one touch $1');
		s = s.replace(/^YL-/, '');
		s = s.replace(/^Novo7 ?/i, 'Novo7 ');
		s = s.replace(/^GIONEE /, '');
		s = s.replace(/^HW-/, '');
		s = s.replace(/^Huawei[ -]/i, 'Huawei ');
		s = s.replace(/^SAMSUNG[ -]/i, '');
		s = s.replace(/^SonyEricsson/, '');
		s = s.replace(/^Lenovo Lenovo/, 'Lenovo');
		s = s.replace(/^LNV-Lenovo/, 'Lenovo');
		s = s.replace(/^Lenovo-/, 'Lenovo ');
		s = s.replace(/^(LG)[ _\/]/, '$1-');
		s = s.replace(/^(HTC.*)\s(?:v|V)?[0-9.]+$/, '$1');
		s = s.replace(/^(HTC)[-\/]/, '$1 ');
		s = s.replace(/^(HTC)([A-Z][0-9][0-9][0-9])/, '$1 $2');
		s = s.replace(/^(Motorola[\s|-])/, '')
		s = s.replace(/^(Moto|MOT-)/, '')

		s = s.replace(/-?(orange(-ls)?|vodafone|bouygues)$/i, '');
		s = s.replace(/http:\/\/.+$/i, '');

		s = s.replace(/^\s+|\s+$/g, '');

		return s;
	}

	function parseVersion(version){
		version = version.toString();
		var components = version.split('.');
		var major = components.shift();
		return parseFloat(major + '.' + components.join(''));
	}

	return Detected;

})();