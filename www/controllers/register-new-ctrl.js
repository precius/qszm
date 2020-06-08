angular.module('registerCtrl', []).controller('registerCtrl', ["$scope", "ionicToast", "$ionicHistory", "$stateParams", "$dictUtilsService", "$registerService", "$loginService",
	function($scope, ionicToast, $ionicHistory,$stateParams, $dictUtilsService, $registerService, $loginService) {
		//登录信息
		$scope.user = {
			loginName: "",
			phone: "",
			passWord: "",
			passWordConfirm: "",
			verifyCode: ""
		};

		$scope.user.phone = $stateParams.phone;

		$scope.goback = function() {
			$ionicHistory.goBack();
		}

		$scope.code = "获取验证码";
		$scope.bGetCodeDisabled = false;
		//注册
		$scope.register = function() {
			console.log($scope.user);
			console.log($scope.userConfirm);
			if(!$dictUtilsService.phone($scope.user.phone)) {
				showAlert("请输入正确的手机号码");
			} else if($scope.user.passWord === null || $scope.user.passWord === "" || !$dictUtilsService.password($scope.user.passWord)) {
				showAlert("请输入6-20位字母,数字组成的密码");
			} else if($scope.user.passWordConfirm === null || $scope.user.passWordConfirm === "" || $scope.user.passWord != $scope.user.passWordConfirm) {
				showAlert("请输入正确的确认密码");
			} else if($scope.user.verifyCode === null || $scope.user.verifyCode === "") {
				showAlert("请输入验证码");
			} else {
				$loginService.getRegisterStatusByNameOrPhone({
					keyWord: $scope.user.phone
				}).then(function(res) {
					if(res.success) {
						if(res.data) {
							showAlert("该手机号已存在");
						} else {
							var psw = $scope.encryptByDES($scope.user.passWord);
							$registerService.register({
									// loginname: $scope.user.loginName,
									areaCode: 640000,
									tel: $scope.user.phone,
									authCode: $scope.user.verifyCode,
									password: psw
								})
								.then(function(res) {
									console.log("请求成功");
									if(res.success) {
										console.log("注册成功！");
										console.log(res);
										showAlert('注册成功');
										$ionicHistory.goBack();
										
									}
								}, function(res) {
									console.log(res.message);
									showAlert(res.message);
								});
						}
					} else {
						showAlert(res.message);
					}
				}, function(err) {
					showAlert(err.message);
				});
			}
		}

		$scope.getCode = function() {
			if(!$scope.bGetCodeDisabled) {
			var isPhone = $dictUtilsService.phone($scope.user.phone);
			if(!isPhone) {
				showAlert("请输入正确的手机号码");
			} else {
				getTelCode($scope.user.phone);
			}
		}
		}

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
					showAlert("获取验证码失败");
				} else {
					showAlert(res.message);
					console.log(JSON.stringify(res))
				}
			});
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

		showAlert = function(msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		};
	}
]);