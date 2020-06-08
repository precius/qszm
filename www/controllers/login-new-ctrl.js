angular.module('loginCtrl', []).controller('loginCtrl', ["$scope", "ionicToast", "$ionicHistory", "$rootScope", "$loginService", "$dictUtilsService", "$state", "$stateParams",
	function($scope, ionicToast, $ionicHistory, $rootScope, $loginService, $dictUtilsService, $state, $stateParams) {
		//返回
		$scope.goback = function() {
			$ionicHistory.goBack();
		}
		var fromPosition = $stateParams.fromPosition;
		//电话号码
		$scope.user = {
			phone: ""
		};

		//下一步
		$scope.next = function() {
			var isPhone = $dictUtilsService.phone($scope.user.phone);
			if($scope.user.phone == "" || !isPhone) {
				showAlert("请输入正确的手机号码");
			} else {
				$loginService.getRegisterStatusByNameOrPhone({
					keyWord: $scope.user.phone
				}).then(function(res) {
					if(res.success) {
						if(res.data) {
							$state.go('login-second', {
								"phone": $scope.user.phone,
								"fromPosition": fromPosition
							});
						} else {
							$state.go('register', {
								"phone": $scope.user.phone
							});
						}
					} else {
						showAlert(res.message);
					}
				}, function(res) {
					showAlert(res.message);
				});
			}
		}

		//使用账号登录
		$scope.useAccount = function() {
			$state.go('login-second');
		}

		$rootScope.$on('loginSuccess', function(event, args) {
			$ionicHistory.goBack();
		});

		showAlert = function(msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		};
	}
]);