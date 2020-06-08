angular.module('passwordModifyCtrl', []).controller('passwordModifyCtrl', ["$scope", "ionicToast", "$ionicHistory", "$meService", "$registerService", "$dictUtilsService",
	function($scope, ionicToast, $ionicHistory, $meService, $registerService, $dictUtilsService) {
		$scope.goback = function() {
			$ionicHistory.goBack();
		}

		// 		$scope.userModifyPassword = {
		// 			loginName: mongoDbUserInfo.loginName, //登录名
		// 			tel: mongoDbUserInfo.tel, //手机号码
		// 			authCode: '', //验证码
		// 			passWord: '', //新密码
		// 			passWord1: '' //确认新密码
		// 		}
		$scope.userModifyPassword = {
			areaCode: province.code, //机构码
			keyWord: mongoDbUserInfo.tel, //手机号码
			loginName: mongoDbUserInfo.loginName, //登录名
			oriPassword: '', //原密码
			newPassword: '', //新密码
		}


		$scope.inputText = {
			oriPassword: '',
			inputPassword: '',
			inputPasswordAgain: ''
		}

		$scope.code = "获取验证码";

		//获取验证码
		$scope.getCode = function(tel) {
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
					showAlert("获取验证码失败，后台返回数据为空，请联系系统管理员");
				} else {
					showAlert(res.message);
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

		//提交修改
		$scope.passwordModify = function() {
			// $scope.userModifyPassword.loginName = userData.data.loginName;
			if($scope.userModifyPassword.keyWord === null || $scope.userModifyPassword.keyWord === "") {
				showAlert("请输入手机号码");
			} else if($scope.inputText.oriPassword === null || $scope.inputText.oriPassword === "") {
				showAlert("请输入原密码");
			} else if($scope.inputText.inputPassword === null || $scope.inputText.inputPassword === "") {
				showAlert("请输入新密码");
			} else if(!$dictUtilsService.password($scope.inputText.inputPassword)) {
				showAlert("请输入6-20位字母,数字组成的密码");
			} else if($scope.inputText.inputPasswordAgain === null || $scope.inputText.inputPasswordAgain === "") {
				showAlert("请输入确认新密码");
			} else if($scope.inputText.inputPassword != $scope.inputText.inputPasswordAgain) {
				showAlert("两次输入的密码不一致");
			} else {
				//保存更新数据
				$scope.userModifyPassword.oriPassword = $scope.encryptByDES($scope.inputText.oriPassword);
				$scope.userModifyPassword.newPassword = $scope.encryptByDES($scope.inputText.inputPassword);
				$meService.passwordModify($scope.userModifyPassword).then(function(response) {
					console.log(response)
					if(response.success) {
						showAlert("修改成功");
						localStorage.setItem("passWord", $scope.inputText.inputPassword);
						$ionicHistory.goBack();
					} else {
						showAlert(response.message);
					}
				}, function(error) {
					console.log(error)
					showAlert(error.message);
				});
			}
		};

		showAlert = function(msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		};
	}
]);