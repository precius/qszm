//投诉建议控制器
angular.module('addsuggestCtrl', []).controller('addsuggestCtrl', ["$scope", "ionicToast", "$state", "$ionicHistory", "$dictUtilsService", "$menuService",
	function ($scope, ionicToast, $state, $ionicHistory, $dictUtilsService, $menuService) {
		$scope.suggest = {
			username: userData.data.realName,
			lyry: userData.data.realName,
			lyrylxfs: userData.data.userInfo.phone,
			content: '',
			category: 2,
			lyjg: county.code
		}

		$scope.suggest2 = {
			email: ""
		}

		//验证数据保存信息
		$scope.verifyYwData = function () {
			var canSave = false;
			if ($scope.suggest.lyry === "") {
				$scope.showAlert("请输入姓名");
			} else if ($scope.suggest.lyrylxfs == "" || !$dictUtilsService.phone($scope.suggest.lyrylxfs)) {
				$scope.showAlert("请输入正确的联系电话");
			} else if ($scope.suggest.content === "") {
				$scope.showAlert("请输入建议");
			} else if (!($scope.suggest2.email == "" || $scope.suggest2.email == undefined || $scope.suggest2.email == null)) {
				if (!$scope.checkEmail($scope.suggest2.email)) {
					$scope.showAlert("请输入正确的邮箱");
				} else {
					canSave = true;
				}
			}
			else {
				canSave = true;
			}
			return canSave;
		}
		// 验证邮箱格式
		$scope.checkEmail = function (value) {
			let email2 = value;
			var reg = new RegExp("^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$");
			if (reg.test(email2)) {
				return true;
			} else {
				return false;
			}
		}

		$scope.goback = function () {
			$ionicHistory.goBack(); //返回上一个页面
		};
		$scope.submit = function () {
			if ($scope.verifyYwData()) {
				$menuService.suggest($scope.suggest)
					.then(function (res) {
						$state.go('suggest');
					}, function (res) {
						$scope.showAlert(res.message);
					});
			}
		};
		//提示框
		$scope.showAlert = function (msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		};
	}
]);