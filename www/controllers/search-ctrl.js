angular.module('searchCtrl', []).controller('searchCtrl', ["$scope", "ionicToast", "$state", "$ionicPopup", "$dictUtilsService", "$wyyyService",
	function($scope, ionicToast, $state, $ionicPopup, $dictUtilsService, $wyyyService) {
		//调用微信人脸识别之前进行签名
		var appId = null;
		$dictUtilsService.signature(function(res) {
			appId = res.data.appId;
		});
		$scope.goback = function() {
			$ionicHistory.goBack(); //返回上一个页面
		}
		//我要预约
		$scope.wyyy = function() {
			//		if(!$dictUtilsService.isCertification()){
			//			$scope.showAlert("请在个人中心进行实名认证");
			//		}else if(!$dictUtilsService.isDistrict()){//判断是否选择了具体的区县
			//			$scope.showAlert("请选择区县再办理业务");
			//		}else{
			$wyyyService.yysxChoosable = true;
			$state.go('yyxz');
			//		}
		}
		//我要申请
		$scope.wysq = function() {
			//判断用户是否登录
			if($dictUtilsService.isLogin()) {
				if(!$dictUtilsService.isCertification()) {
					$scope.showAlert("请在个人中心进行实名认证");
				} else {
					//实名认证过了，调用微信人脸识别
					if(needWxFaceVerify) {
						$dictUtilsService.wxface(function(data) {
							$state.go('djsqxz');
						}, appId, mongoDbUserInfo.name, mongoDbUserInfo.zjh);
					} else {
						$state.go('djsqxz');
					}

				}
			} else {
				$scope.showConfirm('提示', '确认', '取消', "请先登录再办理业务");
			}
		}
		//跳转登录对话框
		$scope.showConfirm = function(titel, okText, cancelText, contentText) {
			var confirmPopup = $ionicPopup.confirm({
				title: titel,
				okText: okText,
				cancelText: cancelText,
				content: contentText
			});
			confirmPopup.then(function(res) {
				if(res) {
					$state.go('login');
				} else {

				}
			});
		};
		//证书查验
		$scope.zscy = function() {
			if(!$dictUtilsService.isCertification()) {
				$scope.showAlert("请在个人中心进行实名认证");
			} else {
				//实名认证过了，调用微信人脸识别
				if(needWxFaceVerify) {
					$dictUtilsService.wxface(function(data) {
						$state.go('zscy');
					}, appId, mongoDbUserInfo.name, mongoDbUserInfo.zjh);
				} else {
					$state.go('zscy');
				}

			}
		}
		//证明查验
		$scope.zmcy = function() {
			if(!$dictUtilsService.isCertification()) {
				$scope.showAlert("请在个人中心进行实名认证");
			} else {
				//实名认证过了，调用微信人脸识别
				if(needWxFaceVerify) {
					$dictUtilsService.wxface(function(data) {
						$state.go('zmcy');
					}, appId, mongoDbUserInfo.name, mongoDbUserInfo.zjh);
				} else {
					$state.go('zmcy');
				}

			}
		}
		//权属证明
		$scope.qszm = function() {
			if(!$dictUtilsService.isCertification()) {
				$scope.showAlert("请在个人中心进行实名认证");
			} else {
				//实名认证过了，调用微信人脸识别
				if(needWxFaceVerify) {
					$dictUtilsService.wxface(function(data) {
						$state.go('qszmxxlist');
					}, appId, mongoDbUserInfo.name, mongoDbUserInfo.zjh);
				} else {
					$state.go('qszmxxlist');
				}

			}
		}
		//权属真伪
		$scope.qszw = function() {
			if(!$dictUtilsService.isCertification()) {
				$scope.showAlert("请在个人中心进行实名认证");
			} else {
				//实名认证过了，调用微信人脸识别
				if(needWxFaceVerify) {
					$dictUtilsService.wxface(function(data) {
						$state.go('zwcx');
					}, appId, mongoDbUserInfo.name, mongoDbUserInfo.zjh);
				} else {
					$state.go('zwcx');
				}

			}
		}
		//进度查询
		$scope.jdcx = function() {
			//		if(!$dictUtilsService.isCertification()){
			//			$scope.showAlert("请在个人中心进行实名认证");
			//		}else{
			$state.go('jdcx');
			//		}
		}
		//法律法规
		$scope.flfg = function() {
			var jsonObject = {
				title: "法律法规",
				articleTypeEnum: 'ZCFG',
				category: 'flfg'
			};
			$state.go('tab.zcfg', {
				"jsonObj": jsonObject
			}, {
				reload: true
			});
		}
		//地方法规
		$scope.dffg = function() {
			var jsonObject = {
				title: "地方法规",
				articleTypeEnum: 'ZCFG',
				category: 'dffg'
			};
			$state.go('tab.zcfg', {
				"jsonObj": jsonObject
			}, {
				reload: true
			});
		}
		//政策解读
		$scope.zcjd = function() {
			var jsonObject = {
				title: "政策解读",
				articleTypeEnum: 'ZCFG',
				category: 'zcjd'
			};
			$state.go('tab.zcfg', {
				"jsonObj": jsonObject
			}, {
				reload: true
			});
		}
		//办事指南
		$scope.bszn = function() {
			if(!$dictUtilsService.isDistrict()) {
				$scope.showAlert("请具体区县再进入办事指南");
			} else {
				$state.go('tab.bszn');
			}
		}
		$scope.showAlert = function(msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		};
	}
]);