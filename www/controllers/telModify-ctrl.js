angular.module('telModifyCtrl', []).controller('telModifyCtrl', ["$scope", "ionicToast", "$ionicHistory", "$dictUtilsService", "$registerService", "$meService",
	function($scope, ionicToast, $ionicHistory, $dictUtilsService, $registerService, $meService) {
		$scope.goback = function() {
			$ionicHistory.goBack();
		}

		$scope.code = "获取验证码";

		$scope.userModifyTel = {
			loginName: mongoDbUserInfo.loginName, //登录名
			newPhone: '', //手机号码
			authCode: '', //验证码
			oriPhone: mongoDbUserInfo.tel //原手机号
		};

		//获取验证码
		$scope.getCode = function(tel) {
			if(tel == "") {
				showAlert("请输入新手机号码");
			} else if(tel == mongoDbUserInfo.tel) {
				showAlert("您填写的新手机号与原有手机号一致");
			} else {
				var isPhone = $dictUtilsService.phone(tel);
				if(!isPhone) {
					showAlert("请输入正确的手机号码");
				} else {
					$registerService.getPhoneCode({
						phone: tel,
						areaCode: 640000
					}).then(function(res) {
						if(res.success) {
							$dictUtilsService.addCodeInteral($scope);
							showAlert("获取验证码成功！");
						} else {
							showAlert("获取验证码失败");
						}
					}, function(res) {
						if(res.message == null || res.message == "" || res.message == "null") {
							showAlert("获取验证码失败");
						} else {
							showAlert(res.message);
						}
					});
				}
			}
		}

		$scope.submit = function() {
			if($scope.userModifyTel.newPhone == "" || $scope.userModifyTel.authCode == "") {
				showAlert("请填写完整信息");
			} else {
				//保存更新数据
				$meService.phoneModify($scope.userModifyTel).then(function(response) {
					if(response.success) {
						showAlert("修改手机号成功");
						mongoDbUserInfo.tel = $scope.userModifyTel.newPhone;
						$ionicHistory.goBack();
					} else {
						showAlert(response.message);
					}
				}, function(error) {
					showAlert(error.message);
				});
			}
		}

		showAlert = function(msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		};
	}
]);