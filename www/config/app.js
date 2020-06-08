require('../controllers/ctrl-vendor.js');
require('../services/service-vendor.js');
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services', 'starter.utils', 'pdf', 'ionic-toast'])
	.run(["$ionicPlatform", "$ionicHistory", "$ionicPopup", "$location", function ($ionicPlatform, $ionicHistory, $ionicPopup, $location) {
		$ionicPlatform.ready(function () {
			if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true)
				cordova.plugins.Keyboard.disableScroll(true)
			}
			if (window.StatusBar) {
				StatusBar.styleDefault()
			}
		});

		$ionicPlatform.registerBackButtonAction(function (e) {
			//阻止默认的处理方法
			e.preventDefault();
			//声明退出提示函数
			function showConfirm() {
				var confirmPopup = $ionicPopup.confirm({
					template: '你确定要退出应用吗?',
					okText: '退出',
					cancelText: '取消'
				});
				confirmPopup.then(function (res) {
					if (res) {
						ionic.Platform.exitApp();
					} else {
						// Don't close
					}
				});
			}
			// Is there a page to go back to?
			if ($location.path() == '/tab/home') {
				showConfirm();
			} else if ($ionicHistory.backView()) {
				$ionicHistory.goBack();
			} else {
				// This is the last page: Show confirmation popup
				showConfirm();
			}
			return false;
		}, 101);
	}])
	.config(["$ionicConfigProvider", function ($ionicConfigProvider) {

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
	}])
	.config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('tab', {
				url: '/tab',
				abstract: true,
				template: require('../views/tabs.html')
			})
			// //登录(首先填入手机号)
			// .state('login', {
			// 	url: '/login',
			// 	params: {
			// 		"fromPosition": "tab.home"
			// 	},
			// 	cache: false,
			// 	template: require('../views/login-new.html'),
			// 	controller: 'loginCtrl'
			// })
			// //登录（填完手机号下一步）
			// .state('login-second', {
			// 	url: '/login-second',
			// 	params: {
			// 		"phone": "",
			// 		"fromPosition": "tab.home"
			// 	},
			// 	cache: false,
			// 	template: require('../views/login-second.html'),
			// 	controller: 'loginSecondCtrl'
			// })
			// //注册
			// .state('register', {
			// 	url: '/register',
			// 	params: {
			// 		"phone": ""
			// 	},
			// 	template: require('../views/register-new.html'),
			// 	controller: 'registerCtrl'
			// })
			//点击咨询专题中的更多按钮跳转到咨询页面
			.state('news', {
				url: '/news',
				template: require('../views/news.html'),
				controller: 'newsMoreCtrl'
			})
			//点击登录页面中的忘记密码跳转到忘记密码页面
			.state('forget', {
				url: '/forget',
				template: require('../views/forget.html'),
				controller: 'forgetCtrl'
			})
			.state('map', {
				url: '/map',
				params: {
					"data": null
				},
				template: require('../views/map.html'),
				controller: 'mapCtrl'
			})
			.state('bsdt', {
				url: '/bsdt',
				template: require('../views/bsdt.html'),
				controller: 'mCtrl'
			})
			.state('bsdtxq', {
				url: '/bsdtxq',
				params: {
					"data": null
				},
				template: require('../views/bsdtxq.html'),
				controller: 'mapCtrl'
			})
			//投诉建议
			.state('suggest', {
				url: '/suggest',
				cache: false,
				template: require('../views/suggest.html'),
				controller: 'suggestCtrl'
			})
			//添加建议
			.state('addSuggestion', {
				url: '/addSuggestion',
				template: require('../views/addSuggestion.html'),
				controller: 'addsuggestCtrl'
			})
			//建议详情
			.state('suggestionDetail', {
				url: '/suggestionDetail',
				params: {
					"id": null
				},
				template: require('../views/suggestionDetail.html'),
				controller: 'suggestionDetailCtrl'
			})
			//
			.state('level1menu', {
				url: '/level1menu',
				template: require('../views/level_1_menu.html'),
				cache: false,
				controller: 'level1MenuCtrl'
			})
			//房产买卖
			.state('fcmm', {
				url: '/fcmm',
				template: require('../views/fcmm.html'),
				controller: 'fcmmCtrl'
			})
			//二级菜单
			.state('level2Menu', {
				url: '/level2Menu',
				template: require('../views/level_2_menu.html'),
				controller: 'level2MenuCtrl'
			})
			// 依申请更正-
			.state('ysqgz', {
				url: '/ysqgz',
				template: require('../views/ysqgz.html'),
				controller: 'ysqgzCtrl'
			})
			// 面积变换
			.state('mjbh', {
				url: '/mjbh',
				template: require('../views/mjbh.html'),
				controller: 'mjbhCtrl'
			})
			//上门预约
			.state('smyy', {
				url: '/smyy',
				template: require('../views/smyy.html'),
				controller: 'smyyCtrl'
			})
			//上门预约协议
			.state('smyyxy', {
				url: '/smyyxy',
				template: require('../views/smyyxy.html'),
				controller: 'smyyxyCtrl'
			})
			//上门预约信息
			.state('smyyxx', {
				url: '/smyyxx',
				cache: false,
				template: require('../views/smyyxx.html'),
				controller: 'smyyxxCtrl'
			})
			//上门预约结果
			.state('smyyjg', {
				url: '/smyyjg',
				template: require('../views/smyyjg.html'),
				controller: 'smyyjgCtrl'
			})
			//上门预约列表
			.state('smyylist', {
				url: '/smyylist',
				template: require('../views/smyylist.html'),
				cache: false,
				controller: 'smyylistCtrl'
			})
			//上门预约详情
			.state('smyy-detail', {
				url: 'smyy-detail',
				params: {
					"jsonObj": null
				},
				cache: false,
				template: require('../views/smyy_detail.html'),
				controller: 'smyyDetailCtrl'
			})
			.state('news-details', {
				url: '/news-details',
				params: {
					"id": null
				},
				template: require('../views/news-details.html'),
				controller: 'newsDetailCtrl'
			})
			.state('zfy-details', {
				url: '/zfy-details',
				template: require('../views/zfy-details.html'),
				cache: false,
				controller: 'zfyCtrl'
			})
			//我的预约列表
			.state('djyy', {
				url: '/djyy',
				cache: false,
				template: require('../views/djyy.html'),
				controller: 'djyyCtrl'
			})
			//一条预约详细详细信息
			.state('djyy-detail', {
				url: 'djyy-detail',
				params: {
					"yybh": null
				},
				template: require('../views/djyy_detail.html'),
				controller: 'djyyDetailCtrl'
			})
			//预约须知（预约协议）
			.state('yyxz', {
				url: '/yyxz',
				params: {
					"type": 1
				},
				template: require('../views/yyxz.html'),
				cache: false,
				controller: 'yyxzCtrl'
			})
			//填写预约信息
			.state('yysx', {
				url: '/yysx',
				template: require('../views/yysx.html'),
				cache: true,
				controller: 'yysxCtrl'
			})
			//在填写预约信息里面选择预约   事项
			.state('xzyysx', {
				url: '/xzyysx',
				template: require('../views/xzyysx.html'),
				cache: false,
				controller: 'xzyysxCtrl'
			})
			//在填写预约信息里面选择预约   时间
			.state('xzyysj', {
				url: '/xzyysj',
				template: require('../views/xzyysj.html'),
				cache: false,
				controller: 'xzyysjCtrl'
			})
			//预约成功后跳转的预约结果
			.state('yyjg', {
				url: '/yyjg',
				template: require('../views/yyjg.html'),
				cache: false,
				controller: 'yyjgCtrl'
			})
			.state('djsq', {
				url: '/djsq',
				template: require('../views/djsq-new.html'),
				cache: false,
				controller: 'djsqCtrl'
			})
			.state('djsq-details', {
				url: '/djsq-details/:chatId',
				template: require('../views/djsq-details.html'),
				cache: false,
				controller: 'djsqDetailCtrl'
			})
			.state('djsqxz', {
				url: '/djsq/djsqxz',
				params: {
					'jsonObj': null
				},
				template: require('../views/djsqxz.html'),
				cache: false,
				controller: 'djsqxzCtrl'
			})
			.state('qyxz', {
				url: '/qyxz',
				template: require('../views/qyxz-meituan.html'),
				params: {
					"id": null
				},
				cache: false,
				controller: 'qyxzCtrl'
			})
			//登记事项选择
			.state('djsxxz', {
				url: '/djsxxz',
				template: require('../views/djsxxz.html'),
				params: {
					"bsdt": null
				},
				cache: false,
				controller: 'djsxxzCtrl'
			})
			//登记结果展示
			.state('djjg', {
				url: '/djjg',
				template: require('../views/djjg.html'),
				cache: false,
				//				params:{"bsdt":null},
				controller: 'djjgCtrl'
			})
			.state('ocr', {
				url: '/ocr',
				template: require('../views/ocr.html'),
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
				url: '/sqrxx',
				template: require('../controllers/sqlc-common/sqrxx-list.html'),
				params: {
					"blzt": null
				},
				cache: false,
				controller: 'sqrxxCtrl'
			})
			.state('sqrxxQlrxxEdit', {
				url: '/sqrxxQlrxxEdit',
				template: require('../views/sqrxx-qlrxx-edit.html'),
				//编辑权利人信息OCR返回参数：index:一个页面中调用地点索引，name:省份证姓名，num:身份证件号码
				params: {
					"id": null,
					"index": null
				},
				controller: 'sqrxxQlrxxCtrl'
			})
			.state('sqrxxQlrxxAdd', {
				url: '/sqrxxQlrxxAdd',
				template: require('../views/sqrxx-qlrxx-add.html'),
				//添加权利人信息OCR返回参数：index:一个页面中调用地点索引，name:省份证姓名，num:身份证件号码
				params: {
					"id": null,
					"index": null
				},
				controller: 'sqrxxQlrxxCtrl'
			})
			.state('sqrxxYwrxxEdit', {
				url: '/sqrxxYwrxxEdit',
				template: require('../views/sqrxx-ywrxx-edit.html'),
				//编辑义务人信息OCR返回参数：index:一个页面中调用地点索引，name:省份证姓名，num:身份证件号码
				params: {
					"id": null,
					"index": null
				},
				controller: 'sqrxxYwrxxCtrl'
			})
			.state('sqrxxYwrxxAdd', {
				url: '/sqrxxYwrxxAdd',
				template: require('../views/sqrxx-ywrxx-add.html'),
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
				// cache: false,
				params: {
					"ywh": null,
					"blzt": null,
					"address": null
				},
				template: require('../controllers/sqlc-common/bdcxx.html'),
				controller: 'bdcxxCtrl'
			})

			//不动产信息-房屋-抵押权登记-首次登记
			.state('bdcxx_dyqdj_scdj', {
				url: '/bdcxx_dyqdj_scdj',
				// cache: false,
				params: {
					"ywh": null,
					"blzt": null
				},
				template: require('../controllers/sqlc-dyqsc/bdcxx_dyqdj_scdj.html'),
				controller: 'bdcxxDyqscCtrl'
			})
			//房屋_预告登记_预售商品房买卖预告登记
			.state('bdcxx_ygdj', {
				url: '/bdcxx_ygdj',
				// cache: false,
				params: {
					"ywh": null,
					"blzt": null
				},
				template: require('../controllers/sqlc-common/bdcxx_ygdj_ysspfmmygdj.html'),
				controller: 'bdcxxCtrl'
			})

			// .state('fjxz', {
			// 	url: '/fjxz',
			// 	template: require('../views/fjxz-new.html'),
			// 	cache: false,
			// 	params: {
			// 		subFlowcode: null,
			// 		id: null
			// 	},
			// 	controller: 'fjxzCtrl'
			// })
			.state('fjxz', {
				url: '/fjxz',
				template: require('../controllers/fjsc/fjsc.html'),
				cache: false,
				params: {
				  subFlowcode: null,
				  id: null
				},
				controller: 'fjscCtrl'
			  })
			.state('fjxzsm', {
				url: '/fjxzsm',
				template: require('../views/fjxznewsm.html'),
				cache: false,
				controller: 'fjxzsmCtrl'
			})
			.state('jdcx', {
				url: '/jdcx',
				cache: false,
				template: require('../views/jdcx.html'),
				controller: 'jdcxCtrl'
			})
			.state('zfy', {
				url: '/zfy',
				template: require('../views/zfy.html'),
				controller: 'zfyCtrl'
			})
			.state('zsyz', {
				url: '/zsyz',
				template: require('../views/zsyz.html'),
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
				template: require('../views/qszm.html'),
				controller: 'qszmCtrl'
			})
			//权属证明列表
			.state('qszmxxlist', {
				url: '/qszmxxlist',
				cache: false,
				template: require('../views/qszmxxlist.html'),
				controller: 'qszmCtrl'
			})
			//证书验证列表
			.state('zsyzlist', {
				url: '/zsyzlist',
				cache: false,
				template: require('../views/zsyz-list.html'),
				controller: 'zsyzListCtrl'
			})
			//申请证书验证
			.state('sqzsyz', {
				url: '/sqzsyz',
				template: require('../views/sqzsyz.html'),
				//证明查验OCR返回参数：index:一个页面中调用地点索引，name:省份证姓名，num:身份证件号码
				params: {
					"id": null,
					"index": null,
					"name": null,
					"num": null
				},
				//				cache: false,
				controller: 'sqzsyzCtrl'
			})
			.state('sqxz', {
				url: '/qszm/zxcx/sqxz',
				template: require('../modal/sqxz.html'),
				controller: 'qszmCtrl'
			})
			//权属证明办理网点信息
			.state('blwdxx', {
				url: '/qszm/zxcx/sqxz/blwdxx',
				template: require('../views/blwdxx.html'),
				controller: 'qszmBlwdxxCtrl'
			})
			//权属证明申请人信息
			.state('wd-sqrxx', {
				url: '/qszm/zxcx/sqxz/blwdxx/wd-sqrxx',
				template: require('../views/wd-sqrxx.html'),
				controller: 'qszmSqrxxCtrl'
			})
			//权属真伪
			.state('zwcx', {
				url: '/qszm/zwcx',
				template: require('../views/zwcx.html'),
				controller: 'zwcxCtrl'
			})
			.state('cxzn', {
				url: '/qszm/cxzn',
				template: require('../views/cxzn.html'),
				controller: 'qszmCtrl'
			})
			.state('tab.home', {
				url: '/home',
				views: {
					'tab-home': {
						template: require('../views/tab-home.html'),
						controller: 'homeCtrl'
					}
				},
				cache: false
			})
			//动态页面
			.state('tab.dynamic', {
				url: '/dynamic',
				views: {
					'tab-dynamic': {
						template: require('../views/tab-dynamic.html'),
						controller: 'dynamicCtrl'
					}
				}
			})
			//动态搜索界面
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
						template: require('../views/zcfg.html'),
						controller: 'zcfgCtrl'
					}
				}
			})
			.state('zcfg-details', {
				url: '/search/zcfg/zcfg-details',
				params: {
					"id": null
				},
				template: require('../views/zcfg-details.html'),
				controller: 'zcfgDetailCtrl'
			})
			.state('clsls', {
				url: '/clsls',
				cache: false,
				template: require('../views/bszn-clsls.html'),
				controller: 'bsznclslsCtrl'
			})
			//办事指南
			.state('tab.bszn', {
				url: '/bszn',
				cache: true,
				views: {
					'tab-bszn': {
						template: require('../views/tab-bszn.html'),
						controller: 'bsznCtrl'
					}
				}
			})
			//我的
			.state('tab.me', {
				url: '/mine',
				cache: false,
				views: {
					'tab-me': {
						template: require('../views/tab-me.html'),
						controller: 'meCtrl'
					}
				}
			})
			//个人信息
			.state('mine-person-info', {
				url: '/mine/person-info',
				cache: false,
				template: require('../views/mine-person-info.html'),
				controller: 'personalInfoCtrl'
			})
			//修改密码
			.state('mine-password-modify', {
				url: '/mine/password-modify',
				template: require('../views/mine-password-modify.html'),
				controller: 'passwordModifyCtrl'
			})
			//修改手机号
			.state('mine-tel-modify', {
				url: '/mine/tel-modify',
				template: require('../views/mine-tel-modify.html'),
				controller: 'telModifyCtrl'
			})
			//输入手机号验证码
			.state('mine-verify-code', {
				url: '/mine/tverify-code',
				params: {
					loginName: '', //登录名
					tel: '', //手机号码
					authCode: '', //验证码
				},
				template: require('../views/mine-verify-code.html'),
				controller: 'verifyCodeCtrl'
			})
			.state('mine-certificate', {
				url: '/faceSdsesTakePhoto',
				params: {
					'jsonObj': null
				},
				template: require('../views/wx-face-verify-police-take-photo.html'),
				controller: 'faceSdsesTakePhotoCtrl'
			})
			.state('tab.gzdt', {
				url: '/mine/gzdt',
				views: {
					'tab-me': {
						template: require('../views/gzdt.html'),
						controller: 'gzdtCtrl'
					}
				}
			})
			.state('tab.gzdt-details', {
				url: '/mine/gzdt/gzdt-details',
				views: {
					'tab-me': {
						template: require('../views/gzdt-details.html'),
						controller: ''
					}
				}
			})
			.state('about-us', {
				url: '/about-us',
				template: require('../views/about-us.html'),
				controller: 'aboutHtmlCtrl'
			})

			.state('ysxx', {
				url: '/ysxx',
				cache: false,
				params: {
					"ywh": null
				},
				template: require('../views/ysxx.html'),
				controller: 'ysxxCtrl'
			})
			.state('pdfShow', {
				url: '/docShow',
				cache: false,
				params: {
					"jsonObj": null
				},
				template: require('../views/pdf-show.html'),
				controller: 'pdfShowCtrl'
			})
			/*.state('tab.grxx', {
				url: '/mine/grxx',
				views: {
					'tab-me': {
						template: require('../views/grxx.html'),
						controller: 'grxxCtrl'
					}
				}
			})*/
			.state('sjdt_nav', {
				url: '/sjdt_nav',
				template: require('../views/sjdt_nav.html'),
				cache: false,
				controller: 'sjdtCtrl'
			})
			.state('wdbdc', {
				url: '/wdbdc',
				template: require('../views/wdbdc.html'),
				controller: 'wdbdcCtrl'
			})
			//淘房网
			.state('tab.tfw', {
				url: '/tfw',
				views: {
					'tab-tfw': {
						template: require('../views/tfw.html'),
						controller: 'wdbdcCtrl'
					}
				}
			})
			//二手房
			.state('esf', {
				url: '/esf',
				template: require('../views/esf.html'),
				controller: 'wdbdcCtrl'
			})
			//行情报告
			.state('hqbg', {
				url: '/hqbg',
				template: require('../views/hqbg.html'),
				controller: 'wdbdcCtrl'
			})

			.state('tjbdc', {
				url: '/tjbdc',
				cache: false,
				template: require('../views/tjbdc.html'),
				controller: 'tjbdcCtrl'
			})
			.state('xqmc', {
				url: '/xqmc',
				template: require('../views/xqmc.html'),
				controller: 'xqmcCtrl'
			})
			.state('xzld', {
				url: '/xzld',
				template: require('../views/xzld.html'),
				controller: 'xzldCtrl'
			})
			.state('bdcxq', {
				url: '/bdcxq',
				template: require('../views/bdcxq.html'),
				controller: 'bdcxqCtrl'
			})
			.state('slide-splash', {
				url: '/slide-splash',
				template: require('../views/slide-splash.html'),
				controller: 'slideSplashCtrl'
			})
			.state('more', {
				url: '/more',
				params: {
					"flag": 1
				},
				template: require('../views/more.html'),
				controller: 'moreCtrl'
			})
			//pdf显示页面用于二维码扫描显示web端PDF申请书
			.state('pdf', {
				url: '/pdf',
				cache: false,
				params: {
					"jsonObj": null
				},
				template: require('../views/pdf.html'),
				controller: 'pdfCtrl'
			})
			//扫描二维码解析证书内容
			.state('read-certificate', {
				url: '/read-certificate',
				params: {
					"jsonObj": null
				},
				cache: false,
				template: require('../views/read-certificate.html'),
				controller: 'readCertificateCtrl'
			})
			//神思OCR证件识别
			.state('faceSdsesOcr', {
				url: '/faceSdsesOcr',
				template: require('../views/wx-face-verify-police-ocr.html'),
				//index:跳转索引，stateGo:将要回跳页面
				params: {
					"id": null,
					"index": null,
					"jsonObj": null
				},
				cache: false,
				controller: 'faceSdsesOcrCtrl'
			})
			.state('selectBsdt', {
				url: '/select-bsdt',
				cache: false,
				template: require('../views/select_bsdt.html'),
				controller: 'selectBsdtCtrl'
			})
			.state('fwwd', {
				url: '/fwwd',
				template: require('../views/fwwd.html'),
				controller: 'fwwdCtrl',
				cache: false
			})
			.state('fwwdmap', {
				url: '/fwwdmap',
				template: require('../views/fwwdmap.html'),
				params: {
					'jsonObj': null
				},
				controller: 'fwwdmapCtrl'
			})
			.state('bsznDetail', {
				url: '/bszn-detail',
				template: require('../views/bszn_detail.html'),
				controller: 'bsznDetailCtrl'
			})
			.state('faceSdsesVideoSpecification', {
				url: '/faceSdsesVideoSpecification',
				params: {
					'jsonObj': null
				},
				cache: false,
				template: require('../views/wx-face-verify-sdses-video-specification.html'),
				controller: 'faceSdsesVideoSpecificationCtrl'
			})
			.state('faceSdsesFaceRecognition', {
				url: '/faceSdsesFaceRecognition',
				params: {
					'jsonObj': null
				},
				cache: false,
				template: require('../views/wx-face-verify-sdses-face-recognition.html'),
				controller: 'faceSdsesFaceRecognitionCtrl'
			})
			.state('faceSdsesTakePhoto', {
				url: '/faceSdsesTakePhoto',
				params: {
					'jsonObj': null
				},
				template: require('../views/wx-face-verify-police-take-photo.html'),
				controller: 'faceSdsesTakePhotoCtrl'
			})
			//申请材料
			.state('sqcl', {
				url: '/sqcl',
				cache: false,
				template: require('../views/sqcl.html'),
				controller: 'sqclCtrl'

			})
			//EMS查询
			.state('logistics-search', {
				url: '/logistics-search',
				template: require('../views/logistics_search.html'),
				controller: 'logisticsSearchCtrl',
				cache: false
			})
			//评价
			.state('evaluation', {
				url: '/evaluation',
				params: {
					"ywbh": null,
					"orgCode": null,
					"orgName": null
				},
				cache: false,
				template: require('../views/evaluation.html'),
				controller: 'evaluationCtrl'
			})
			.state('zlxz', {
				url: '/zlxz',
				template: require('../views/zlxz.html'),
				controller: 'zlxzCtrl',
				cache: false
			})
			.state('bdcqzVerify', {
				url: '/bdcqzVerify',
				params: {
					'jsonObj': null
				},
				template: require('../views/bdcqz_verify.html'),
				controller: 'bdcqzVerifyCtrl',
				cache: true
			})
			//预告+抵押
			.state('sqrxx-list-ygdy', {
				url: '/sqrxx-list-ygdy',
				params: { 'jsonObj': null },
				template: require('../controllers/sqlc-ygdy/sqrxx_list_ygdy.html'),
				controller: 'sqrxxListYgdyCtrl',
				cache: false
			})
			.state('qlrxxYgdy', {
				url: '/qlrxxYgdy',
				params: {
					'category': null,
					'id': null,
					'action': null
				},
				template: require('../controllers/sqlc-ygdy/qlrxx_ygdy.html'),
				controller: 'qlrxxYgdyCtrl',
				cache: false
			})
			.state('ywrxxYgdy', {
				url: '/ywrxxYgdy',
				params: {
					'category': null,
					'id': null,
					'action': null
				},
				template: require('../controllers/sqlc-ygdy/ywrxx_ygdy.html'),
				controller: 'ywrxxYgdyCtrl',
				cache: false
			})
			.state('bdcxxYgdy', {
				url: '/bdcxxYgdy',
				params: { 'ywh': null },
				template: require('../controllers/sqlc-ygdy/bdcxx_ygdy.html'),
				controller: 'bdcxxYgdyCtrl',
				cache: true
			})
			//转移+抵押
			.state('sqrxx-list-zydy', {
				url: '/sqrxx-list-zydy',
				params: { 'jsonObj': null },
				template: require('../controllers/sqlc-zydy/sqrxx_list_zydy.html'),
				controller: 'sqrxxListZydyCtrl',
				cache: false
			})
			.state('qlrxxZydy', {
				url: '/qlrxxZydy',
				params: {
					'category': null,
					'id': null,
					'action': null
				},
				template: require('../controllers/sqlc-zydy/qlrxx_zydy.html'),
				controller: 'qlrxxZydyCtrl',
				cache: false
			})
			.state('ywrxxZydy', {
				url: '/ywrxxZydy',
				params: {
					'category': null,
					'id': null,
					'action': null
				},
				template: require('../controllers/sqlc-zydy/ywrxx_zydy.html'),
				controller: 'ywrxxZydyCtrl',
				cache: false
			})
			.state('bdcxxZydy', {
				url: '/bdcxxZydy',
				params: { 'ywh': null },
				template: require('../controllers/sqlc-zydy/bdcxx_zydy.html'),
				controller: 'bdcxxZydyCtrl',
				cache: true
			})
			//变更+转移
			.state('sqrxx-list-bgzy', {
				url: '/sqrxx-list-bgzy',
				params: { 'jsonObj': null },
				template: require('../controllers/sqlc-bgzy/sqrxx_list_bgzy.html'),
				controller: 'sqrxxListBgzyCtrl',
				cache: false
			})
			.state('qlrxxBgzy', {
				url: '/qlrxxBgzy',
				params: {
					'category': null,
					'id': null,
					'action': null
				},
				template: require('../controllers/sqlc-bgzy/qlrxx_bgzy.html'),
				controller: 'qlrxxBgzyCtrl',
				cache: false
			})
			.state('ywrxxBgzy', {
				url: '/ywrxxBgzy',
				params: {
					'category': null,
					'id': null,
					'action': null
				},
				template: require('../controllers/sqlc-bgzy/ywrxx_bgzy.html'),
				controller: 'ywrxxBgzyCtrl',
				cache: false
			})
			.state('bdcxxBgzy', {
				url: '/bdcxxBgzy',
				params: { 'ywh': null },
				template: require('../controllers/sqlc-bgzy/bdcxx_bgzy.html'),
				controller: 'bdcxxBgzyCtrl',
				cache: true
			})
			//预售商品房买卖预告
			.state('sqrxx-list-mmyg', {
				url: '/sqrxx-list-mmyg',
				params: { 'jsonObj': null },
				template: require('../controllers/sqlc-mmyg/sqrxx_list_mmyg.html'),
				controller: 'sqrxxListMmygCtrl',
				cache: false
			})
			.state('qlrxxMmyg', {
				url: '/qlrxxMmyg',
				params: {
					'category': null,
					'id': null,
					'action': null
				},
				template: require('../controllers/sqlc-mmyg/qlrxx_mmyg.html'),
				controller: 'qlrxxMmygCtrl',
				cache: false
			})
			.state('ywrxxMmyg', {
				url: '/ywrxxMmyg',
				params: {
					'category': null,
					'id': null,
					'action': null
				},
				template: require('../controllers/sqlc-mmyg/ywrxx_mmyg.html'),
				controller: 'ywrxxMmygCtrl',
				cache: false
			})
			.state('bdcxxMmyg', {
				url: '/bdcxxMmyg',
				params: { 'ywh': null },
				template: require('../controllers/sqlc-mmyg/bdcxx_mmyg.html'),
				controller: 'bdcxxMmygCtrl',
				cache: true
			})
			//换证补证
			.state('sqrxx-list-hzbz', {
				url: '/sqrxx-list-hzbz',
				params: { 'jsonObj': null },
				template: require('../controllers/sqlc-hzbz/sqrxx_list_hzbz.html'),
				controller: 'sqrxxListHzbzCtrl',
				cache: false
			})
			.state('qlrxxHzbz', {
				url: '/qlrxxHzbz',
				params: {
					'category': null,
					'id': null,
					'action': null
				},
				template: require('../controllers/sqlc-hzbz/qlrxx_hzbz.html'),
				controller: 'qlrxxHzbzCtrl',
				cache: false
			})

			.state('bdcxxHzbz', {
				url: '/bdcxxHzbz',
				params: { 'ywh': null },
				template: require('../controllers/sqlc-hzbz/bdcxx_hzbz.html'),
				controller: 'bdcxxHzbzCtrl',
				cache: true
			})
			//预抵押注销
			.state('sqrxxYdyzx', {
				url: '/sqrxxYdyzx',
				params: { 'jsonObj': null },
				template: require('../controllers/sqlc-ydyzx/sqrxx-ydyzx.html'),
				// params: {
				// 	"blzt": null
				// },
				cache: false,
				controller: 'sqrxxYdyzxCtrl'
			})
			.state('sqrxxYmmygzx', {
				url: '/sqrxxYmmygzx',
				params: {
					'jsonObj': null,
				},
				template: require('../controllers/sqlc-ymmygzx/sqrxx-ymmygzx.html'),
				// params: {
				// 	"blzt": null
				// },
				cache: false,
				controller: 'sqrxxYmmygzxCtrl'  //sqrxxYmmygzxCtrl
			})
			.state('bdcxx_ydyzx', {
				url: '/bdcxx_ydyzx',
				cache: true,
				params: {
					"jsonObj": null,
					"ywh": null
				},
				template: require('../controllers/sqlc-ydyzx/bdcxx_ydyzx.html'),
				controller: 'bdcxxYdyzxCtrl'
			})
			//预买卖预告注销
			.state('bdcxx_ymmygzx', {
				url: '/bdcxx_ymmygzx',
				cache: true,
				params: {
					"jsonObj": null,
					"ywh": null
				},
				template: require('../controllers/sqlc-ymmygzx/bdcxx_ymmygzx.html'),
				controller: 'bdcxxYmmygzxCtrl'
			})
			// 收货地址
			.state('address', {
				url: '/address',
				template: require('../controllers/address/address.html'),
				params: {

				},
				cache: false,
				controller: 'addressCtrl'
			})
			.state('myAddress', {
				url: '/myAddress',
				template: require('../controllers/address/myAddress.html'),
				params: {
				},
				cache: false,
				controller: 'myAddressCtrl'
			})
			.state('editAddress', {
				url: '/editAddress',
				template: require('../controllers/address/editAddress.html'),
				params: {
					"item": null
				},
				cache: false,
				controller: 'editAddressCtrl'
			})
			// 询问笔录
			.state('xwbl', {
				url: '/xwbl',
				template: require('../controllers/xwbl/xwbl.html'),
				cache: true,
				controller: 'xwblCtrl'
			})
			// 询问笔录协议
			.state('xwblxy', {
				url: '/xwblxy',
				template: require('../controllers/xwbl/xwblxy.html'),
				params: {
					'xwblData': null,
				},
				cache: false,
				controller: 'xwblxyCtrl'
			})
			// 询问笔录签名
			.state('xwblqm', {
				url: '/xwblqm',
				template: require('../controllers/xwbl/xwblqm.html'),
				params: {
					'xwblData': null,
				},
				cache: false,
				controller: 'xwblqmCtrl'
			})
			//视频录制-微信
			.state('recordVideo', {
				url: '/recordVideo',
				cache: false,
				template: require('../views/record-video.html'),
				controller: 'recordVideoCtrl'

			})
			//视频录制-app
			.state('recordVideoApp', {
				url: '/recordVideoApp',
				cache: false,
				template: require('../views/record-video-app.html'),
				controller: 'recordVideoAppCtrl'

			})
			//人脸识别
			.state('face-verification', {
				url: '/face-verification',
				cache: true,
				params: {
					"jsonObj": null,
					"ywh": null
				},
				template: require('../views/face-verification.html'),
				controller: 'faceVerificationCtrl'
			})
			// 家庭成员信息
			.state('jtcyxx', {
				url: '/jtcyxx',
				template: require('../controllers/jtcyxx/jtcyxx.html'),
				params: {
					'familyMemberList': null,
					'pdym': null
				},
				cache: false,
				controller: 'jtcyxxCtrl'
			})
			// 提取申请人信息和不动产信息
			.state('extractSqxx', {
				url: '/extractSqxx',
				template: require('../controllers/extract-sqxx/extract-sqxx.html'),
				params: {
					'jsonObj': null
				},
				cache: true,
				controller: 'extractSqxxCtrl'
			})
			// 扫码进行权属证明查询
			.state('/', {
				url: '/',
				template: require('../views/read-certificate.html'),
				params: {
					'jsonObj': null
				},
				controller: 'readCertificateCtrl'
			})
			$urlRouterProvider.otherwise('/read-certificate')
			// $urlRouterProvider.otherwise('/read-certificate')
			//		$urlRouterProvider.otherwise('slide-splash')
	}])
