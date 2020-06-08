angular.module('sqzsyzCtrl', []).controller('sqzsyzCtrl', ["$scope", "ionicToast", "$ionicHistory", "$registerService", "$searchService", "$dictUtilsService", "$ionicLoading", "$state", "$rootScope", "$ionicActionSheet",
	function($scope, ionicToast, $ionicHistory, $registerService, $searchService, $dictUtilsService, $ionicLoading, $state, $rootScope, $ionicActionSheet) {
		//证件种类
		//	var zjzlStr = "证件种类";
		//	$scope.zjzl = {};
		//	$scope.zjzlData = $dictUtilsService.getDictinaryByType(zjzlStr).childrens;
		//	if ($scope.zjzlData != null && $scope.zjzlData.length > 0) {
		//		$scope.zjzl = $scope.zjzlData[0];
		//	}

		$scope.cret = {};
		$scope.familyMemberList = [];
		$scope.familyMemberList[0] = {
			name: $scope.cret.qlrmc,
			zjh: $scope.cret.qlrzjh

		}

		if($dictUtilsService.isLogin()) {
			//获取用户信息（电话号码）
			$scope.userTel = userData.data.userInfo.phone;
		}
		//获取大厅列表加载框
		$scope.show = function(title) {
			$ionicLoading.show({
				//template: '上传中...'
				template: '<ion-spinner icon="lines" class="spinner-stable"></ion-spinner><p>' + title + '</p>'
			});
		};

		$scope.hide = function() {
			$ionicLoading.hide();
		};
		//获取办事大厅
		$scope.blwdDataTemp = [];
		$scope.blwdTemp = {};

		function selectBlwd() {
			$dictUtilsService.getBsdtDataByDjjg($scope, function(res) {
				if(res.success) {
					$scope.hide();
					//console.log(response);
					if(res.success) {
						$scope.blwdDataTemp = angular.copy(res.data);
						$scope.blwdTemp = $scope.blwdDataTemp[0];
					}

				}
			});
		}
		selectBlwd();
		//提交证书核实申请
		$scope.sqzsyz = function() {
			$scope.cret.zszmbh = getbdcqzh();
			if(!verifyData()) {
				return;
			}

			if($scope.cret.yzCode == null || $scope.cret.yzCode == '' || $scope.cret.yzCode == "") {
				$scope.showAlert("请输入验证码");
				return;
			}
			$scope.familyMemberList[0].name = $scope.cret.qlrmc
			$scope.familyMemberList[0].zjh = $scope.cret.qlrzjh
			$searchService.zsyz({
					loginName: userData.data.loginName,
					zszmbh: $scope.cret.zszmbh,
					cxjg: $scope.blwdTemp.djjg,
					checkCertifyTypeEnum: 'ZSZMHS',
					phone: $scope.userTel,
					authCode: $scope.cret.yzCode,
					familyMemberList: $scope.familyMemberList

				})
				.then(function(res) {
					if(res.success) {
						$state.go('zsyzlist', {}, {
							reload: true
						});
					} else {
						$scope.showAlert(res.message);
					}
				}, function(res) {
					$scope.showAlert(res.message);
				});
		}

		//验证数据保存信息
		function verifyData() {
			var canSave = false;
			if(!checkCQZH()) {
				$scope.showAlert("请输入完整的证书(证明)证号");
			} else if($scope.cret.qlrmc == undefined || $scope.cret.qlrmc === null || $scope.cret.qlrmc === "") {
				$scope.showAlert("请输入权利人名称");
			} else if($scope.cret.qlrzjh == undefined || $scope.cret.qlrzjh === null || $scope.cret.qlrzjh === "") {
				$scope.showAlert("请输入权利人证件号");
			} else if(!isCardNo($scope.cret.qlrzjh)) {
				$scope.showAlert("权利人证件号格式有误");
			} else {
				canSave = true;
			}
			return canSave;
		}

		//检验产权证号每个空档是否都输入了
		function checkCQZH() {
			for(var i = 0; i < $scope.bdcqzhMbData.length; i++) {
				if($scope.bdcqzhMbData[i].isSelected) {
					if($scope.bdcqzhMbData[i].name.indexOf('其他') != -1 || $scope.bdcqzhMbData[i].name.indexOf('二维码') != -1) {
						if($scope.bdcqzhMbData[i].inputs[0] == "") {
							return false;
						} else {
							return true;
						}
					} else {
						for(var j = 0; j < $scope.bdcqzhMbData[i].inputs.length; j++) {
							if($scope.bdcqzhMbData[i].inputs[j] == "") {
								return false;
							}
						}
						return true;
					}
				}
			}
			return false;
		}

		function isCardNo(cardNo) {
			//	   身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X 
			  
			var reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;  
			if(reg.test(cardNo))   {    
				return true;  
			} else {
				return false;
			}
		}
		//获取验证码按钮文字
		$scope.code = "获取验证码";
		$scope.bGetCodeDisabled = false;

		$scope.getTelCode = function() {
			//		获取验证码之前检查信息填写是否正确
			if(!verifyData()) {
				return;
			}
			if($scope.bGetCodeDisabled) {
				$scope.showAlert("60秒内请勿重复获取!");
				return;
			}
			$registerService.getPhoneCode({
				phone: $scope.userTel,
				areaCode:640000
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

		$scope.showAlert = function(msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		}

		$scope.goback = function() {
			$ionicHistory.goBack(); //返回上一个页面
		}
		//使用ocr获取证件信息
		$scope.zscytoocr = function() {
			$state.go('ocr', {
				"index": 0
			}, {
				reload: true
			});
		};
		$scope.zmcytoocr = function() {
			$state.go('ocr', {
				"index": 0
			}, {
				reload: true
			});
		};
		//OCR获取信息返回并且刷新
		$rootScope.$on('ocr-back', function(event, args) {
			//从OCR返回
			$scope.familyMemberList[0].name = args.name;
			$scope.familyMemberList[0].zjh = args.num;
		});
		//点击证书证明按钮进入当前页面
		$rootScope.$on('zszmcy', function(event, args) {
			$scope.searchAll();
		});

		//模板图片地址
		$scope.imgData = [{
			src: require('../theme/img_menu/zs3.png')
		}, {
			src: require('../theme/img_menu/zs1.png')
		}, {
			src: require('../theme/img_menu/zs2.png')
		}];

		//不动产信息模板提示框
		$scope.showTips = false;
		$scope.clickTips = function(n) {
			if(n == 0 || n == 1 || n == 2) {
				$scope.src = $scope.imgData[n].src;
				$scope.showTips = true;
			} else {
				$scope.showTips = false;
			}
		}

		$scope.bdcqzhMbData = $dictUtilsService.getBdcqzhMb();
		for(var i = 0; i < $scope.bdcqzhMbData.length; i++) {
			var model = $scope.bdcqzhMbData[i];
			if(model.name.indexOf('其他') != -1 || model.name.indexOf('二维码') != -1) {
				model.inputs.push("");
				continue;
			}
			/*if(model.name.indexOf("***") != -1) {
				var count = model.name.split("***").length - 1;
				for(var j = 0; j < count; j++) {
					model.inputs.push("");
				}
			}*/
			if(model.name.indexOf("***") == 0) {
				//先去掉开头的“***”，再用***分割
				var name = model.name.replace("***", "");
				model.keyWords = name.split("***");
			} else {
				model.keyWords = model.name.split("***");
			}
		}

		//选择产权证书类别
		$scope.checkBdcqzhMb = function() {
			$ionicActionSheet.show({
				cancelOnStateChange: true,
				cssClass: 'action_s',
				titleText: "请选择产权证书类别",
				addCancelButtonWithLabel: '取消',
				androidEnableCancelButton: true,
				buttons: [{
					text: $scope.bdcqzhMbData[0].name
				}, {
					text: $scope.bdcqzhMbData[1].name
				}, {
					text: $scope.bdcqzhMbData[2].name
				}, {
					text: $scope.bdcqzhMbData[3].name
				}],
				cancelText: '取消',
				cancel: function() {
					return true;
				},
				buttonClicked: function(index) {
					setUnSelected();
					$scope.bdcqzhMbData[index].isSelected = true;
					return true;
				}
			});
		}

		//获取不动产权证号
		function getbdcqzh() {
			var result = "";
			if($scope.bdcqzhMbData != undefined && $scope.bdcqzhMbData.length > 0) {
				for(var i = 0; i < $scope.bdcqzhMbData.length; i++) {
					var model = $scope.bdcqzhMbData[i];
					if(model.isSelected) {
						if(model.name.indexOf('其他') != -1 || model.name.indexOf('二维码') != -1) {
							return model.inputs[0];
						} else {
							result = model.name;
							for(var j = 0; j < model.inputs.length; j++) {
								result = result.replace("***", model.inputs[j]);
							}
							return result;
						}
					}
				}
			}
			return result;
		}

		function setUnSelected() {
			if($scope.bdcqzhMbData != undefined && $scope.bdcqzhMbData.length > 0) {
				for(var i = 0; i < $scope.bdcqzhMbData.length; i++) {
					$scope.bdcqzhMbData[i].isSelected = false;
				}
			}
		}
	}
]);