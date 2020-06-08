angular.module('loginSecondCtrl', ['ionic']).controller('loginSecondCtrl', ["$scope", "ionicToast", "$ionicHistory", "$rootScope", "$stateParams", "$loginService", "$dictUtilsService", "$meService", "$state", "$addressService",
	function($scope, ionicToast, $ionicHistory, $rootScope, $stateParams, $loginService, $dictUtilsService, $meService, $state, $addressService) {
		//返回
		$scope.goback = function() {
			$ionicHistory.goBack();
		}
		var fromPosition = $stateParams.fromPosition;
		//登录信息
		$scope.user = {
			account: "",
			passWord: ""
		};

		if($stateParams.phone != "") {
			$scope.user.account = $stateParams.phone;
			$scope.phoneLogin = true;
		} else {
			$scope.phoneLogin = false;
		}

		//下一步
		$scope.next = function() {
			if($scope.user.account == "" || $scope.user.passWord == "") {
				showAlert("请输入完整信息");
				return;
			}

			//先判断用户是否存在
			$loginService.getRegisterStatusByNameOrPhone({
					keyWord: $scope.user.account
				})
				.then(function(res) {
					if(res.data) {
						$scope.login(false,false);
					} else {
						showAlert("您输入的账号不存在！");
					}
				}, function(res) {
					showAlert(res.message);
				});

		}
		$scope.login = function(isSecondLogin,isThirdLogin) {
			//登录
			var password = $scope.encryptByDES($scope.user.passWord);
			$loginService.login({
					loginName: $scope.user.account,
					password: password
				})
				.then(function(res) {
					console.log(res.data);
					if(res.success) {
            if(isSecondLogin || isThirdLogin){
              $scope.forgetPassword();
              showAlert("非当前系统注册的账号,请修改密码后再登录!");
              return;
            }
						localStorage.setItem("account", $scope.user.account);
						localStorage.setItem("passWord", $scope.user.passWord);
						userData = res;
						$loginService.userdata = res.data;
						console.log(userData);
						//登录成功获取MongoDB个人信息
						queryPersonInfo();
					} else {
						showAlert("密码错误，请重新输入！");
						$scope.user.passWord = '';
					}
				}, function(res) {
					console.log(res.data);
          if(!isSecondLogin){
             $scope.user.passWord = passwordOld[0];
             $scope.login(true,false);
             return;
          }else{
            if(!isThirdLogin){
              $scope.user.passWord = passwordOld[1];
              $scope.login(true,true);
              return;
            }
            showAlert("密码错误，请重新输入！");
            $scope.user.passWord = '';
          }
				});
		}
		var sendParam = {
			loginName: ""
		};

		queryPersonInfo = function() {
			sendParam.loginName = userData.data.loginName;
			$meService.getMongoDbUserInfo(sendParam)
				.then(function(response) {
					var result = angular.copy(response.data);
					//存放到constant中用户信息信息父级别，用来判断是否进行了实名认证
					mongoDbUserInfoFather = result;
					//存放到constant中用户信息
					mongoDbUserInfo = result.userinfo;
					//获取数据字典
					queryDataDict();
					//获取全国区域树
					queryAreaTree();

					//获取用户权限
					$dictUtilsService.getPermByAreaCode($rootScope, $scope);
					//隐藏加载框
					if(mongoDbUserInfo != null) {
						//获取人脸识别
						queryFaceVerify();
						if($loginService.flag == 1) {
							$state.go("tab.me");
						} else if($loginService.flag == 2) {
							$state.go('tab.home');
						} else {
							$ionicHistory.goBack(-2);
							//						$state.go(fromPosition);
						}
					} else {
						showAlert("请使用个人用户账号登录");
					}
				}, function(error) {
					//隐藏加载框
					showAlert("请求失败");
				});
		};
		//获取字典
		queryDataDict = function() {
			$loginService.getDict(dictParam)
				.then(function(res) {
					dictInfos = res.data;
					console.log(dictInfos);
				}, function(res) {
					//隐藏加载框
					showAlert('获取数据字典失败', res.message);
				});
		}
		//获取全国区域树
		queryAreaTree = function() {
			$addressService.getTree({
					"currentId": ""
				})
				.then(function(res) {
					areaTree = res.data;
				}, function(res) {
					//隐藏加载框
					showAlert('获取区域失败', res.message);
				});
		}
		//获取人脸识别
		queryFaceVerify = function() {
			$meService.FaceVerifyResult({
					"userId": mongoDbUserInfo.id
				})
				.then(function(res) {
					if(res.success) {
						var result = res.data;
						faceVerify = result;
					} else {
						showAlert("获取人脸识别结果失败");
					}
				}, function(res) {
					console.log("请求失败！");
				});
		}
		//使用手机号登录
		$scope.usePhone = function() {
			$ionicHistory.goBack();
		}

		//忘记密码
		$scope.forgetPassword = function() {
			$state.go('forget');
		}

		//注册
		$scope.register = function() {
			$state.go('register');
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
