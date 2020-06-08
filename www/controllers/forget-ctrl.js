angular.module('forgetCtrl', []).controller('forgetCtrl', ["$scope", "ionicToast", "$meService", "$ionicHistory", "$dictUtilsService", "$registerService",
	function($scope, ionicToast, $meService, $ionicHistory, $dictUtilsService, $registerService) {
		$scope.goback = function() {
			$ionicHistory.goBack();
		};
		$scope.code = "获取验证码";
		$scope.user = {
			tel: '',
			areaCode: 640000,
			userCategory: 'gr',
			authCode: '',
			passWord: ''
		};
		//存储再次确认密码和是否同意相关条款数据
		$scope.userConfirm = {
			confirmPassword: ''
		}
		$scope.showAlert = function(msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		};
		/**
		 * 
		 * @param {Object} tel 电话号码
		 */
		function getTelCode(tel) {
			$registerService.getPhoneCode({
				phone: tel,
				areaCode: 640000
			}).then(function(res) {
				if(res.success) {
					$dictUtilsService.addCodeInteral($scope);
				}
			}, function(res) {
				if(res.message == null || res.message == "" || res.message == "null") {
					$scope.showAlert("获取验证码失败");
				} else {
					$scope.showAlert(res.message);
				}
			});
		}
		$scope.getCode = function() {
			//验证手机号码
			if(!$scope.bGetCodeDisabled) {
				var isPhone = $dictUtilsService.phone($scope.user.tel);
				if(!isPhone) {
					$scope.showAlert("请输入正确的手机号码");
				} else {
					getTelCode($scope.user.tel);
				}
			}

		}
		$scope.forget = function() {
			if(!$dictUtilsService.phone($scope.user.tel)) {
				$scope.showAlert("请输入正确的手机号码");
			} else if($scope.user.passwordTemp === null || $scope.user.passwordTemp === "" || !$dictUtilsService.password($scope.user.passwordTemp)) {
				$scope.showAlert("请输入6-20位字母,数字组成的密码");
			} else if($scope.userConfirm.confirmPassword === null || $scope.userConfirm.confirmPassword === "" || $scope.user.passwordTemp != $scope.userConfirm.confirmPassword) {
				$scope.showAlert("请输入正确的确认密码");
			} else if($scope.userConfirm.confirmPassword != $scope.user.passwordTemp) {
				$scope.showAlert("前后两次输入的密码不一致");
			} else if($scope.user.authCode === null || $scope.user.authCode === "") {
				$scope.showAlert("请输入验证码");
			} else {
				$scope.user.passWord = $scope.encryptByDES($scope.user.passwordTemp);
				$meService.modifyUserinfoByTel($scope.user)
					.then(function(res) {
						console.log("请求成功");
						if(res.success) {
							console.log("找回密码成功！");
							console.log(res);
							$scope.showAlert('找回密码成功');
							$ionicHistory.goBack();
						}

					}, function(res) {
						console.log(res.message);
						$scope.showAlert('找回密码失败' + res.message);
					});
			}

		}
		//密码加密算法
		$scope.encryptByDES = function(strMessage, key) {
			if(window.CryptoJS && window.CryptoJS.mode) {
				window.CryptoJS.mode.ECB = (function() {
					if(CryptoJS.lib) {
						var ECB = CryptoJS.lib.BlockCipherMode.extend();

						ECB.Encryptor = ECB.extend({
							processBlock: function(words, offset) {
								this._cipher.encryptBlock(words, offset);
							}
						});

						ECB.Decryptor = ECB.extend({
							processBlock: function(words, offset) {
								this._cipher.decryptBlock(words, offset);
							}
						});

						return ECB;
					}
					return null;
				}());
			}

			key = key || '\u0067\u0072\u0065\u0061\u0074\u006d\u0061\u0070';
			var keyHex = CryptoJS.enc.Utf8.parse(key);
			var encrypted = CryptoJS.DES.encrypt(strMessage, keyHex, {
				mode: CryptoJS.mode.ECB,
				padding: CryptoJS.pad.Pkcs7
			});
			return encrypted.toString();
		};
		//从MongoDB中获取用户信息
		$scope.sendParam = {
			loginName: ""
		};
		$scope.queryPersonInfo = function() {
			$scope.sendParam.loginName = $scope.user.loginName;
			$meService.getMongoDbUserInfo($scope.sendParam)
				.then(function(response) {
					var result = angular.copy(response.data);
					//存放到constant中用户信息信息父级别，用来判断是否进行了实名认证
					mongoDbUserInfoFather = result;
					//存放到constant中用户信息
					mongoDbUserInfo = result.userinfo;
					if(mongoDbUserInfo.tel != $scope.user.tel) {
						$scope.showAlert("请输入正确手机号码");
					} else {
						$scope.getCode(); //获取验证码
					}
				}, function(error) {
					$scope.showAlert("请求失败");
				});
		};
	}
]);