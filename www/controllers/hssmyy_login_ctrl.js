angular.module('hssmyyLoginCtrl', ['ionic']).controller('hssmyyLoginCtrl', ["$scope", "ionicToast", "$state", "$loginService", "$ionicPopup", "$ionicLoading", "$meService", "$ionicHistory", "$dictUtilsService", "$rootScope",
	function($scope, ionicToast, $state, $loginService, $ionicPopup, $ionicLoading, $meService, $ionicHistory, $dictUtilsService, $rootScope) {

		$scope.user = {
			loginName: "",
			password: "",
		}

		$scope.goback = function() {
			$ionicHistory.goBack();
		}

		$scope.showAlert = function(m) {
			ionicToast.show(m, 'middle', false, 2000);
		};

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

		$scope.login = function() {
			console.log($scope.user);
			if($scope.user.loginName === null || $scope.user.loginName === "") {
				$scope.showAlert("请输入用户名");
			} else if($scope.user.password === null || $scope.user.password === "") {
				$scope.showAlert("请输入密码");
			} else {
				//显示加载框
				show();
				var password = $scope.encryptByDES($scope.user.password);
				$loginService.login({
						loginName: $scope.user.loginName,
						password: password
					})
					.then(function(res) {
						userData = res;
						$loginService.userdata = res.data;
						//登录成功获取MongoDB个人信息
						$scope.queryPersonInfo();
					}, function(res) {
						hide();
						console.log(res.message);
						$scope.showAlert(res.message);
					});
			}
		};

		//从MongoDB中获取用户信息
		$scope.sendParam = {
			loginName: ""
		};

		$scope.queryPersonInfo = function() {
			$scope.sendParam.loginName = userData.data.loginName;
			$meService.getMongoDbUserInfo($scope.sendParam)
				.then(function(response) {
					var result = angular.copy(response.data);
					//存放到constant中用户信息信息父级别，用来判断是否进行了实名认证
					mongoDbUserInfoFather = result;
					//存放到constant中用户信息
					mongoDbUserInfo = result.userinfo;
					//获取用户权限
					$dictUtilsService.getPermByAreaCode($rootScope, $scope);
					//隐藏加载框
					hide();
					if(mongoDbUserInfo != null) {
						if(mongoDbUserInfoFather != null && mongoDbUserInfoFather.authName != false) {
							$state.go("xzyysx");
						} else {
							$ionicPopup.confirm({
								title: "提示",
								okText: "确定",
								cancelText: "取消",
								content: "您还未进行实名认证，不能进行预约，是否立即前往实名认证？"
							}).then(function(res) {
								if(res) {
									$state.go("mine-certificate");
								} else {
									$scope.showAlert("未实名认证，不能进行预约！");
								}
							});
						}
						/*$meService.FaceVerifyResult({
								"userId": userData.data.id
							})
							.then(function(res) {
								if(res.data == "VERIFY_SUCCESS") {
									$state.go("xzyysx");
								} else {
									$ionicPopup.confirm({
										title: "提示",
										okText: "确定",
										cancelText: "取消",
										content: "您还未进行实名认证，不能进行上门预约，是否立即前往实名认证？"
									}).then(function(res) {
										if(res) {
											$state.go("mine-certificate");
										} else {
											$scope.showAlert("未实名认证，不能进行上门预约！");
										}
									});
								}
							}, function(res) {
								$scope.showAlert("网络通讯失败");
							});*/
					} else {
						$scope.showAlert("请使用个人用户账号登录");
					}
				}, function(error) {
					//隐藏加载框
					hide();
					$scope.showAlert("请求失败");
				});
		};

		show = function() {
			$ionicLoading.show({
				template: '<ion-spinner icon="lines" class="spinner-calm"></ion-spinner><p>加载中……</p>'
			});
		};

		hide = function() {
			$ionicLoading.hide();
		};
	}
]);