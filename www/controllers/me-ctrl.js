//我的控制器
angular.module('meCtrl', []).controller('meCtrl', ["$scope", "ionicToast", "$rootScope", "$loginService", "djsq","$wysqService", "$ionicHistory", "$ionicPopup", "$state", "$meService", "$dictUtilsService", "$rootScope", "$addressService",
	function($scope, ionicToast, $rootScope, $loginService, djsq,$wysqService, $ionicHistory, $ionicPopup, $state, $meService, $dictUtilsService, $rootScope, $addressService) {
		$scope.goback = function() {
			$ionicHistory.goBack(); //返回上一个页面
		};
		$rootScope.hideTabs = false; //显示下边导航栏
		//跳转登录对话框
		$scope.showConfirmFour = function(titel, okText, cancelText, contentText) {
			var confirmPopup = $ionicPopup.confirm({
				title: titel,
				okText: okText,
				cancelText: cancelText,
				content: contentText
			});
			confirmPopup.then(function(res) {
				if(res) {
					$loginService.flag = 1;
					$state.go('login', {
						'fromPosition': 'tab.me'
					});
				} else {

				}
			});
		};
		$scope.status = $dictUtilsService.getCertificationStatus();
		if(platform == "weixin") {
			$scope.showUpdate = false;
		} else {
			$scope.showUpdate = true;
		}

		$scope.tempVersionName = "";
		if("undefined" == typeof versioninterface) {
			console.log("变量versioninterface未定义！");
		} else {
			versioninterface.getAppVersion("",
				function(message) {
					$scope.tempVersionName = message;
				},
				function(message) {
					$scope.showAlert(message);
				});
		}

		var downloadUrl = "";
		$scope.hasNewVersion = false;

		//判断是否是最新版本
		function getServerVersion() {
			$meService.getVersionInfo({})
				.then(function(response) {
					var result = angular.copy(response.data);
					downloadUrl = result.appDownloadUrl;
					var tempServerVersionName = result.versionName;
					var serverVersionName = parseInt(tempServerVersionName.split(".").join(""));
					var versionName = parseInt($scope.tempVersionName.split(".").join(""));
					if(versionName < serverVersionName) {
						$scope.hasNewVersion = true;
					} else {
						$scope.hasNewVersion = false;
					}
				}, function(error) {
					//				$scope.showAlert("请求失败");
					console.log("请求失败!");
				});
		}
		getServerVersion();

		//版本更新
		$scope.update = function() {
			if($scope.hasNewVersion) {
				versioninterface.requestPermission(downloadUrl, function(message) {},
					function(message) {
						$scope.showAlert(message);
					});
			} else {
				$scope.showAlert("您的版本已是最新版本");
			}
			/*var versionName = parseInt($scope.tempVersionName.split(".").join(""));

			var tempServerVersionName;
			var serverVersionName;
			$meService.getVersionInfo({})
				.then(function(response) {
					var result = angular.copy(response.data);
					var downloadUrl = result.appDownloadUrl;
					tempServerVersionName = result.versionName;
					var s = tempServerVersionName.split(".");
					serverVersionName = parseInt(s.join(""));
					if(versionName < serverVersionName) {
						versioninterface.requestPermission(downloadUrl, function(message) {},
							function(message) {
								$scope.showAlert(message);
							});
					} else {
						$scope.showAlert("您的版本已是最新版本");
					}
				}, function(error) {
					$scope.showAlert("请求失败");
				});*/
		}

		//判断是否已经登录了
		if($dictUtilsService.isLogin()) {

		} else {
			//		$scope.showConfirm ('提示','确认','取消',"请先登录再查看个人信息");
		}
		$scope.isLogin = false;
		//判断是否进行登录
		$scope.isLoginMethod = function() {
			$scope.isLogin = false;
			if($dictUtilsService.isLogin()) {
				$scope.isLogin = true;
			} else {
				$scope.isLogin = false;
			}
		};
		$scope.isLoginMethod();
		//判断是否进行了实名认证
		$scope.isCertification = false;
		$scope.isCertificationMethod = function() {
			$scope.isCertification = false;
			if($dictUtilsService.isCertification()){
				$scope.isCertification = true;
			}else {
				$scope.isCertification = false;
			}
		};
		$scope.isCertificationMethod();
		//获取个人信息
		$scope.mongoDbUserInfo = {};
		$scope.sendParam = {
			loginName: ""
		};
		//获取人脸识别
		queryFaceVerify = function() {
			$meService.FaceVerifyResult({
					"userId": mongoDbUserInfo.id
				})
				.then(function(res) {
					if(res.success) {
						var result = res.data;
						faceVerify = result;
						$scope.status = $dictUtilsService.getCertificationStatus();
					} else {
						showAlert("获取人脸识别结果失败");
					}
				}, function(res) {
					console.log("请求失败！");
				});
		}
		//	$scope.sendParam = {id:""};
		$scope.queryPersonInfo = function() {
			$scope.sendParam.loginName = userData.data.loginName;
			//		$scope.sendParam.id = '5add94ffd4b3d672e0ffdce4';
			$meService.getMongoDbUserInfo($scope.sendParam)
				.then(function(response) {
					var result = angular.copy(response.data);
					//存放到constant中用户信息信息父级别，用来判断是否进行了实名认证
					mongoDbUserInfoFather = result;
					$scope.mongoDbUserInfo = result.userinfo;
					//存放到constant中用户信息
					mongoDbUserInfo = result.userinfo;
					queryFaceVerify();
					$scope.isLoginMethod();
				}, function(error) {
					$scope.showAlert("请求失败");
				});
		};
		if($scope.isLogin) {
			$scope.queryPersonInfo();
		}
		$scope.toPersonInfo = function() {
			if($scope.isLogin) {
				$state.go('mine-person-info', {}, {
					reload: true
				}); //返回me页面
			} else {
				//			$scope.showConfirmFour('提示','确认','取消',"请先登录再查看个人信息");
				$loginService.flag = 1;
				$state.go('login', {
					'fromPosition': 'tab.me'
				});
			}

		}
		//跳转到个人实名验证界面
		$scope.certification = function() {
			if($scope.isLogin) {

				if(!$dictUtilsService.isCertification()) {
					$state.go('mine-certificate', {}, {
						reload: true
					});
					$rootScope.$broadcast('to-mine-certificate', {});
				} else {

					var roles = userData.data.roles;
					if(roles!=null){
						for(var i=0;i<roles.length;i++){
							var role = roles[i];
							if(role.name == 'iebdc:ysyh'){
								$state.go('mine-certificate', {}, {
									reload: true
								});
								$rootScope.$broadcast('to-mine-certificate', {});
								return;
							}
						}
					}

					$scope.showAlert("您已经进行了实名认证");
				}

			} else {
				$scope.showConfirmFour('提示', '确认', '取消', "请先登录再查看个人信息");
			}
		};
		$scope.goback = function() {
			$ionicHistory.goBack(); //返回上一个页面
		};
		$scope.logout = function() {
			$scope.showConfirm('确定退出登录?', '确定', '取消');
		};
		//我的申请
		$scope.gotodjsqlist = function(type) {
			if(!$addressService.isOnline) {
				showAlert("该区域暂未开通!");
				return;
			}
			if($scope.isLogin) {
		    if(!$dictUtilsService.isCertification()){
		      showAlert("请先进行实名认证!");
		      return;
		    }
		    if(type == 'mine'){
		      $wysqService.isMainApplicant = true;//是主申请人,去查看自己发起的申请
		    }else{
		      $wysqService.isMainApplicant = false;//非主申请人,去查看别人发起的申请
		    }
		    $wysqService.stepByStep = false;//在申请人信息  不动产信息 附件上传信息不显示下一步
				$state.go('djsq', {}, {
					reload: true
				});
			} else {
				$scope.showConfirmFour('提示', '确认', '取消', "请先登录再查看个人信息!");
			}
		}

		//我的预约
		$scope.gotodjyylist = function() {
			if(!$addressService.isOnline) {
				showAlert("该区域暂未开通");
				return;
			}
			if($scope.isLogin) {
        if(!$dictUtilsService.isCertification()){
          showAlert("请先进行实名认证!");
          return;
        }
				$state.go('djyy', {}, {
					reload: true
				});
			} else {
				$scope.showConfirmFour('提示', '确认', '取消', "请先登录再查看个人信息");
			}
		}
		//我的上门预约
		$scope.gotosmyylist = function() {
//			showAlert("该功能暂未开通");
			if(!$addressService.isOnline){
				showAlert("该区域暂未开通");
				return;
			}
			if($scope.isLogin) {
				if(!$dictUtilsService.isCertification()){
				  showAlert("请先进行实名认证!");
				  return;
				}
				$state.go('smyylist', {}, { reload: true });
			} else {
				$scope.showConfirmFour('提示', '确认', '取消', "请先登录再查看个人信息");
			}
		}
		//我的不动产
		$scope.gotowdbdc = function() {
			if(!$addressService.isOnline) {
				showAlert("该区域暂未开通");
				return;
			}
			if($scope.isLogin) {
				$state.go('wdbdc');
			} else {
				$scope.showConfirmFour('提示', '确认', '取消', "请先登录再查看个人信息");
			}
		}
		//淘房网
		$scope.gototfw = function() {
			$state.go('tab.tfw');
		}

		//退出登录对话框
		$scope.showConfirm = function(titel, okText, cancelText) {
			var confirmPopup = $ionicPopup.confirm({
				title: titel,
				okText: okText,
				cancelText: cancelText
			});
			confirmPopup.then(function(res) {
				if(res) {
					localStorage.setItem("account", "");
					localStorage.setItem("passWord", "");
					$loginService.flag = 1;
					$state.go('login', {
						'fromPosition': 'tab.me'
					});
					userData = {};
					mongoDbUserInfoFather = {};
					mongoDbUserInfo = {};
					//获取用户权限
					$dictUtilsService.getPermByAreaCode($rootScope, $scope);
				}
			});
		};
		//提示对话框
		$scope.showAlert = function(m) {
			ionicToast.show(m, 'middle', false, 2000);
		};
		//测试神思身份核验接口
		$scope.test = function() {
			$state.go('faceSdsesOcr');
		}
		//打印对象
		function alertObj(obj) {
			var output = "";
			for(var i in obj) {
				var property = obj[i];
				output += i + " = " + property + "\n";
			}
			alert(output);
		};
	}
]);
