//验证码输入控制器
angular.module('verifyCodeCtrl', []).controller('verifyCodeCtrl', ["$scope", "ionicToast", "$stateParams", "$ionicHistory", "$meService", "$state",
	function($scope, ionicToast, $stateParams, $ionicHistory, $meService, $state) {
		$scope.goback = function() {
			$ionicHistory.goBack(); //返回上一个页面
		};
		/**
		 * 修改手机号码
		 */
		$scope.userModifyTel = {
			loginName: '', //登录名
			newPhone: '', //手机号码
			authCode: '', //验证码
			oriPhone: '' //原手机号
		};
		$scope.userModifyTel.loginName = $stateParams.loginName;
		$scope.userModifyTel.newPhone = $stateParams.tel;
		$scope.userModifyTel.authCode = $stateParams.authCode;
		$scope.userModifyTel.oriPhone = mongoDbUserInfo.tel;
		$scope.submit = function() {
			if($scope.userModifyTel.authCode === null || $scope.userModifyTel.authCode === "") {
				$scope.showAlert("请输入验证码");
			} else {
				//保存更新数据
				$meService.phoneModify($scope.userModifyTel).then(function(response) {
					var result = angular.copy(response);
					$scope.showAlert("修改成功");
					$state.go('mine-person-info');
					$scope.userModifyTel = {};
				}, function(error) {
					$scope.showAlert("请输入正确的验证码");
				});
			}
		}
		//个人认证信息验证对话框
		$scope.showAlert = function(msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		};
	}
]);