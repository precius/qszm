//我的控制器
angular.module('aboutHtmlCtrl', []).controller('aboutHtmlCtrl', ["$scope", "ionicToast", "$ionicHistory",
	function($scope, ionicToast, $ionicHistory) {
		$scope.goback = function() {
			$ionicHistory.goBack(); //返回上一个页面
		};
		$scope.city = '宁夏回族自治区';
		$scope.website = 'http://www.gsbdcdj.com';
		$scope.phone = '';
		if(projectName == 'lingbao') {
			$scope.city = '灵宝市';
			$scope.website = 'www.lbbdcdj.com';
			$scope.phone = '0931-8762802';
		}

		$scope.tempVersionName = "";
		//获取版本号
		if("undefined" == typeof versioninterface) {
			//		 console.log("变量versioninterface未定义！");
		} else {
			versioninterface.getAppVersion("",
				function(message) {
					$scope.tempVersionName = message;
				},
				function(message) {
					$scope.showAlert(message);

					ionicToast.show(message, 'middle', false, 2000);
				});
		}
	}
]);