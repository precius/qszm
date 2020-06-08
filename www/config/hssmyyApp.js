angular.module('hssmyy_app', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services', 'starter.utils', 'validation.rule', 'pdf', 'ionic-toast'])
	.run(function($ionicPlatform, $ionicHistory, $ionicPopup, $location) {
		$ionicPlatform.ready(function() {
			if(window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true)
				cordova.plugins.Keyboard.disableScroll(true)
			}
			if(window.StatusBar) {
				StatusBar.styleDefault()
			}
		});

		document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
			WeixinJSBridge.call('hideToolbar');
			WeixinJSBridge.call('hideOptionMenu');
		});

		$ionicPlatform.registerBackButtonAction(function(e) {
			//阻止默认的处理方法
			e.preventDefault();
			//声明退出提示函数
			function showConfirm() {
				var confirmPopup = $ionicPopup.confirm({
					template: '你确定要退出应用吗?',
					okText: '退出',
					cancelText: '取消'
				});

				confirmPopup.then(function(res) {
					if(res) {
						ionic.Platform.exitApp();
					} else {
						// Don't close
					}
				});
			}
			// Is there a page to go back to?
			if($location.path() == '/tab/home') {
				showConfirm();
			} else if($ionicHistory.backView()) {
				$ionicHistory.goBack();
			} else {
				// This is the last page: Show confirmation popup
				showConfirm();
			}

			return false;
		}, 101);

	})

	.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

		//设置设备样式
		$ionicConfigProvider.platform.ios.tabs.style('standard');
		$ionicConfigProvider.platform.ios.tabs.position('bottom');
		$ionicConfigProvider.platform.android.tabs.style('standard');
		$ionicConfigProvider.platform.android.tabs.position('standard');

		//center:标题居中，left:标题居左，right:标题居右
		$ionicConfigProvider.platform.ios.navBar.alignTitle('center');
		$ionicConfigProvider.platform.android.navBar.alignTitle('center');

		//设置返回按钮属性
		$ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
		$ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

		//设置设备控件
		$ionicConfigProvider.platform.ios.views.transition('ios');
		$ionicConfigProvider.platform.android.views.transition('android');
	})
	.config(function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('tab', {
				url: '/tab',
				abstract: true,
				templateUrl: 'views/tabs.html'
			})
			.state('login', {
				url: '/login',
				params: {
					"fromPosition": "smyyxy"
				},
				cache: false,
				templateUrl: 'views/login-new.html',
				controller: 'loginCtrl'
			})
			.state('login-second', {
				url: '/login-second',
				params: {
					"phone": "","fromPosition": "smyyxy"
				},
				cache: false,
				templateUrl: 'views/login-second.html',
				controller: 'loginSecondCtrl'
			})			
			.state('register', {
				url: '/register',
				templateUrl: 'views/register-new.html',
				controller: 'registerCtrl'
			})
			.state('forget', {
				url: '/forget',
				templateUrl: 'views/forget.html',
				controller: 'forgetCtrl'
			})
			.state('map', {
				url: '/map',
				params: {
					"data": null
				},
				templateUrl: 'views/map.html',
				controller: 'mapCtrl'
			})
			.state('bsdt', {
				url: '/bsdt',
				templateUrl: 'views/bsdt.html',
				controller: 'mCtrl'
			})
			.state('bsdtxq', {
				url: '/bsdtxq',
				params: {
					"data": null
				},
				templateUrl: 'views/bsdtxq.html',
				controller: 'mapCtrl'
			})
			.state('tab.home', {
				url: '/home',
				views: {
					'tab-home': {
						templateUrl: 'views/tab-home.html',
						controller: 'homeCtrl'
					}
				}
			})
			//房产操作
			.state('level2Menu', {
				url: '/level2Menu',
				templateUrl: 'views/level_2_menu.html',
				controller: 'level2MenuCtrl'
			})
			//上门预约
			.state('smyy', {
				url: '/smyy',
				templateUrl: 'views/smyy.html',
				controller: 'smyyCtrl'
			})
			//上门预约协议
			.state('smyyxy', {
				url: '/smyyxy',
				templateUrl: 'views/smyyxy.html',
				controller: 'smyyxyCtrl'
			})
			//上门预约信息
			.state('smyyxx', {
				url: '/smyyxx',
				templateUrl: 'views/smyyxx.html',
				controller: 'smyyxxCtrl'
			})
			//上门预约结果
			.state('smyyjg', {
				url: '/smyyjg',
				templateUrl: 'views/smyyjg.html',
				controller: 'smyyjgCtrl'
			})
			//上门预约列表
			.state('smyylist', {
				url: '/smyylist',
				templateUrl: 'views/smyylist.html',
				cache: false,
				controller: 'smyylistCtrl'
			})
			// 依申请更正
			.state('ysqgz', {
				url: '/ysqgz',
				templateUrl: 'views/ysqgz.html',
				controller: 'ysqgzCtrl'
			})
			// 面积变化
			.state('mjbh', {
				url: '/mjbh',
				templateUrl: 'views/mjbh.html',
				controller: 'mjbhCtrl'
			})
			.state('news-details', {
				url: '/news-details',
				params: {
					"id": null
				},
				templateUrl: 'views/news-details.html',
				controller: 'newsDetailCtrl'
			})
			.state('zfy-details', {
				url: '/zfy-details',
				templateUrl: 'views/zfy-details.html',
				cache: false,
				controller: 'zfyCtrl'
			})
			.state('djyy', {
				url: '/djyy',
				templateUrl: 'views/djyy.html',
				cache: false,
				controller: 'djyyCtrl'
			})
			.state('yyxz', {
				url: '/yyxz',
				templateUrl: 'views/yyxz.html',
				cache: false,
				controller: 'yyxzCtrl'
			})
			.state('yysx', {
				url: '/yysx',
				templateUrl: 'views/yysx.html',
				cache: false,
				controller: 'yyxzCtrl'
			})
			.state('xzyysx', {
				url: '/xzyysx',
				templateUrl: 'views/xzyysx.html',
				cache: false,
				controller: 'xzyysxCtrl'
			})
			//选择预约事项
			.state('xzyysj', {
				url: '/xzyysj',
				templateUrl: 'views/xzyysj.html',
				cache: false,
				controller: 'xzyysjCtrl'
			})
			.state('yyjg', {
				url: '/yyjg',
				templateUrl: 'views/yyjg.html',
				cache: false,
				controller: 'yyjgCtrl'
			})
			.state('djsq', {
				url: '/djsq',
				templateUrl: 'views/djsq-new.html',
				cache: false,
				controller: 'djsqCtrl'
			})
			.state('djsq-details', {
				url: '/djsq-details/:chatId',
				templateUrl: 'views/djsq-details.html',
				cache: false,
				controller: 'djsqDetailCtrl'
			})
			.state('djsqxz', {
				url: '/djsq/djsqxz',
				templateUrl: 'views/djsqxz.html',
				cache: false,
				controller: 'djsqxzCtrl'
			})
			.state('qyxz', {
				url: '/qyxz',
				templateUrl: 'views/qyxz-new.html',
				params: {
					"id": null
				},
				cache: false,
				controller: 'qyxzCtrl'
			})
			//登记事项选择
			.state('djsxxz', {
				url: '/djsxxz',
				templateUrl: 'views/djsxxz.html',
				params: {
					"bsdt": null
				},
				cache: false,
				controller: 'djsxxzCtrl'
			})
			//登记结果展示
			.state('djjg', {
				url: '/djjg',
				templateUrl: 'views/djjg.html',
				//				params:{"bsdt":null},
				//				cache: false,
				controller: 'djjgCtrl'
			})
			.state('ocr', {
				url: '/ocr',
				templateUrl: 'views/ocr.html',
				//index:跳转索引，stateGo:将要回跳页面
				params: {
					"id": null,
					"index": null,
					"jsonObj": null
				},
				cache: false,
				controller: 'ocrCtrl'
			})
			.state('sqrxx', {
				url: '/sqrxxList',
				templateUrl: 'views/sqrxx-list.html',
				params: {
					"blzt": null
				},
				cache: false,
				controller: 'sqrxxListCtrl'
			})
			.state('sqrxxQlrxxEdit', {
				url: '/sqrxxQlrxxEdit',
				templateUrl: 'views/sqrxx-qlrxx-edit.html',
				//编辑权利人信息OCR返回参数：index:一个页面中调用地点索引，name:省份证姓名，num:身份证件号码
				params: {
					"id": null,
					"index": null
				},
				controller: 'sqrxxQlrxxCtrl'
			})
			.state('sqrxxQlrxxAdd', {
				url: '/sqrxxQlrxxAdd',
				templateUrl: 'views/sqrxx-qlrxx-add.html',
				//添加权利人信息OCR返回参数：index:一个页面中调用地点索引，name:省份证姓名，num:身份证件号码
				params: {
					"id": null,
					"index": null
				},
				controller: 'sqrxxQlrxxCtrl'
			})
			.state('sqrxxYwrxxEdit', {
				url: '/sqrxxYwrxxEdit',
				templateUrl: 'views/sqrxx-ywrxx-edit.html',
				//编辑义务人信息OCR返回参数：index:一个页面中调用地点索引，name:省份证姓名，num:身份证件号码
				params: {
					"id": null,
					"index": null
				},
				controller: 'sqrxxYwrxxCtrl'
			})
			.state('sqrxxYwrxxAdd', {
				url: '/sqrxxYwrxxAdd',
				templateUrl: 'views/sqrxx-ywrxx-add.html',
				//添加义务人信息OCR返回参数：index:一个页面中调用地点索引，name:省份证姓名，num:身份证件号码
				params: {
					"id": null,
					"index": null
				},
				controller: 'sqrxxYwrxxCtrl'
			})
			//不动产信息
			//房屋_国有建设用地使用权及房屋所有权_变更登记
			//房屋_国有建设用地使用权及房屋所有权_转移登记
			//房屋_国有建设用地使用权及房屋所有权_更正登记
			.state('bdcxx', {
				url: '/bdcxx',
				cache: false,
				params: {
					"ywh": null,
					"blzt": null
				},
				templateUrl: 'views/bdcxx.html',
				controller: 'bdcxxCtrl'
			})
			//土地_国有建设用地使用权_转移登记
			.state('bdcxx_td_gyjsydsyq_zydj', {
				url: '/bdcxx_td_gyjsydsyq_zydj',
				cache: false,
				params: {
					"ywh": null,
					"blzt": null
				},
				templateUrl: 'views/bdcxx_td_gyjsydsyq_zydj.html',
				controller: 'bdcxxTdGyjsydsyqZydjCtrl'
			})
			//土地_国有建设用地使用权_变更登记
			.state('bdcxx_td_gyjsydsyq_bgdj', {
				url: '/bdcxx_td_gyjsydsyq_bgdj',
				cache: false,
				params: {
					"ywh": null,
					"blzt": null
				},
				templateUrl: 'views/bdcxx_td_gyjsydsyq_bgdj.html',
				controller: 'bdcxxTdGyjsydsyqBgdjCtrl'
			})
			//不动产信息-房屋-抵押权登记-首次登记
			.state('bdcxx_dyqdj_scdj', {
				url: '/bdcxx_dyqdj_scdj',
				cache: false,
				params: {
					"ywh": null,
					"blzt": null
				},
				templateUrl: 'views/bdcxx_dyqdj_scdj.html',
				controller: 'bdcxxDyqdjscdjCtrl'
			})
			//不动产信息-房屋-预告登记-预售商品房买卖预告登记
			.state('bdcxx_ygdj_ysspfmmygdj', {
				url: '/bdcxx_ygdj_ysspfmmygdj',
				cache: false,
				params: {
					"ywh": null,
					"blzt": null
				},
				templateUrl: 'views/bdcxx_ygdj_ysspfmmygdj.html',
				controller: 'bdcxxYgdjysspfmmCtrl'
			})
			//不动产信息-房屋-预告登记-预售商品房抵押权预告登记
			.state('bdcxx_ygdj_ysspfdyqygdj', {
				url: '/bdcxx_ygdj_ysspfdyqygdj',
				cache: false,
				params: {
					"ywh": null,
					"blzt": null
				},
				templateUrl: 'views/bdcxx_ygdj_ysspfdyqygdj.html',
				controller: 'bdcxxYgdjysspfdyqCtrl'
			})
			//林地_林权_林权首次登记
			.state('bdcxx_ld_lqdj_scdj', {
				url: '/bdcxx_ld_lqdj_scdj',
				cache: false,
				params: {
					"ywh": null,
					"blzt": null
				},
				templateUrl: 'views/bdcxx_ld_lqdj_scdj.html',
				controller: 'bdcxxLdLqLqscdjCtrl'
			})
			.state('fjxz', {
				url: '/fjxz',
				templateUrl: 'views/fjxz-new.html',
				cache: false,
				params: {
					subFlowcode: null,
					id: null
				},
				controller: 'fjxzCtrl'
			})
			.state('fjxzsm', {
				url: '/fjxzsm',
				templateUrl: 'views/fjxznewsm.html',
				cache: false,
				controller: 'fjxzsmCtrl'
			})
			.state('jdcx', {
				url: '/jdcx',
				templateUrl: 'views/jdcx.html',
				controller: 'jdcxCtrl'
			})
			.state('zfy', {
				url: '/zfy',
				templateUrl: 'views/zfy.html',
				controller: 'zfyCtrl'
			})
			.state('zsyz', {
				url: '/zsyz',
				templateUrl: 'views/zsyz.html',
				//证明查验OCR返回参数：index:一个页面中调用地点索引，name:省份证姓名，num:身份证件号码
				params: {
					"id": null,
					"index": null,
					"name": null,
					"num": null
				},
				//				cache: false,
				controller: 'newsCtrl'
			})
			.state('qszm', {
				url: '/qszm',
				templateUrl: 'views/qszm.html',
				controller: 'qszmCtrl'
			})
			.state('qszmxxlist', {
				url: '/qszmxxlist',
				cache: false,
				templateUrl: 'views/qszmxxlist.html',
				controller: 'qszmCtrl'
			})
			.state('sqxz', {
				url: '/qszm/zxcx/sqxz',
				templateUrl: 'modal/sqxz.html',
				controller: 'qszmCtrl'
			})
			//权属证明办理网点信息
			.state('blwdxx', {
				url: '/qszm/zxcx/sqxz/blwdxx',
				templateUrl: 'views/blwdxx.html',
				controller: 'qszmBlwdxxCtrl'
			})
			//权属证明申请人信息
			.state('wd-sqrxx', {
				url: '/qszm/zxcx/sqxz/blwdxx/wd-sqrxx',
				templateUrl: 'views/wd-sqrxx.html',
				controller: 'qszmSqrxxCtrl'
			})
			//权属真伪
			.state('zwcx', {
				url: '/qszm/zwcx',
				templateUrl: 'views/zwcx.html',
				controller: 'zwcxCtrl'
			})
			.state('cxzn', {
				url: '/qszm/cxzn',
				templateUrl: 'views/cxzn.html',
				controller: 'qszmCtrl'
			})
			.state('tab.search', {
				url: '/search',
				views: {
					'tab-search': {
						templateUrl: 'views/tab-dynamic.html',
						controller: 'dynamicCtrl'
					}
				}
			})
			.state('tab.zcfg', {
				url: '/search/zcfg',
				params: {
					"id": null,
					"index": null,
					"jsonObj": null
				},
				cache: false,
				views: {
					'tab-search': {
						templateUrl: 'views/zcfg.html',
						controller: 'zcfgCtrl'
					}
				}
			})
			.state('zcfg-details', {
				url: '/search/zcfg/zcfg-details',
				params: {
					"id": null
				},
				templateUrl: 'views/zcfg-details.html',
				controller: 'zcfgDetailCtrl'
			})
			.state('tab.service', {
				url: '/service',
				cache: false,
				views: {
					'tab-service': {
						templateUrl: 'views/bszn.html',
						controller: 'bsznCtrl'
					}
				}
			})
			.state('clsls', {
				url: '/clsls',
				cache: false,
				templateUrl: 'views/bszn-clsls.html',
				controller: 'bsznclslsCtrl'
			})
			.state('tab.me', {
				url: '/mine',
				cache: false,
				views: {
					'tab-me': {
						templateUrl: 'views/tab-me.html',
						controller: 'meCtrl'
					}
				}
			})
			//输入手机号验证码
			.state('mine-verify-code', {
				url: '/mine/tverify-code',
				params: {
					loginName: '', //登录名
					tel: '', //手机号码
					authCode: '', //验证码
				},
				templateUrl: 'views/mine-verify-code.html',
				controller: 'verifyCodeCtrl'
			})
			.state('tab.gzdt', {
				url: '/mine/gzdt',
				views: {
					'tab-me': {
						templateUrl: 'views/gzdt.html',
						controller: 'gzdtCtrl'
					}
				}
			})
			.state('tab.gzdt-details', {
				url: '/mine/gzdt/gzdt-details',
				views: {
					'tab-me': {
						templateUrl: 'views/gzdt-details.html',
						controller: ''
					}
				}
			})
			.state('about-us', {
				url: '/about-us',
				templateUrl: 'views/about-us.html',
				controller: 'aboutHtmlCtrl'
			})
			.state('register-protocol', {
				url: '/register-protocol',
				templateUrl: 'views/register-protocol.html',
				controller: 'aboutusCtrl'
			})
			.state('ysxx', {
				url: '/ysxx',
				cache: false,
				params: {
					"ywh": null
				},
				templateUrl: 'views/ysxx.html',
				controller: 'aboutusCtrl'
			})
			.state('pdfShow', {
				url: '/docShow',
				cache: false,
				params: {
					"jsonObj": null
				},
				templateUrl: 'views/pdf-show.html',
				controller: 'pdfShowCtrl'
			})
			.state('tab.grxx', {
				url: '/mine/grxx',
				views: {
					'tab-me': {
						templateUrl: 'views/grxx.html',
						controller: 'grxxCtrl'
					}
				}
			})
			.state('sjdt_nav', {
				url: '/sjdt_nav',
				templateUrl: 'views/sjdt_nav.html',
				controller: 'sjdtCtrl'
			})
			.state('wdbdc', {
				url: '/wdbdc',
				templateUrl: 'views/wdbdc.html',
				controller: 'wdbdcCtrl'
			})
			.state('tjbdc', {
				url: '/tjbdc',
				cache: false,
				templateUrl: 'views/tjbdc.html',
				controller: 'tjbdcCtrl'
			})
			.state('xqmc', {
				url: '/xqmc',
				templateUrl: 'views/xqmc.html',
				controller: 'xqmcCtrl'
			})
			.state('xzld', {
				url: '/xzld',
				templateUrl: 'views/xzld.html',
				controller: 'xzldCtrl'
			})
			.state('bdcxq', {
				url: '/bdcxq',
				templateUrl: 'views/bdcxq.html',
				controller: 'bdcxqCtrl'
			})
			.state('slide-splash', {
				url: '/slide-splash',
				templateUrl: 'views/slide-splash.html',
				controller: 'slideSplashCtrl'
			}).state('hssmyy-login', {
				url: '/hssmyy-login',
				cache: false,
				templateUrl: 'views/hsyy_login.html',
				controller: 'hssmyyLoginCtrl'
			});
		//		$urlRouterProvider.otherwise('/tab/home')
		$urlRouterProvider.otherwise('login')
	})