angular.module('dynamic_app', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services', 'starter.utils', 'validation.rule', 'pdf'])
	.run(function($ionicPlatform, $ionicHistory, $ionicPopup, $location) {
		$ionicPlatform.ready(function() {
			if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true)
				cordova.plugins.Keyboard.disableScroll(true)
			}
			if (window.StatusBar) {
				StatusBar.styleDefault()
			}
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
			.state('zcfg-details', {
				url: '/search/zcfg/zcfg-details',
				params: {
					"id": null
				},
				templateUrl: 'views/zcfg-details.html',
				controller: 'zcfgDetailCtrl'
			})
			.state('dynamic', {
				url: '/dynamic',
				templateUrl: 'views/tab-dynamic.html',
				controller: 'dynamicCtrl'
			});
		//		$urlRouterProvider.otherwise('/tab/home')
		$urlRouterProvider.otherwise('/dynamic')
	})