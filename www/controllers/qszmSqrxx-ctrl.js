//权属证明控制器
angular.module('qszmSqrxxCtrl', ['ionic']).controller('qszmSqrxxCtrl', ["$scope", "ionicToast", "$state", "$ionicHistory", "$ionicPopup", "$qszmService",
	"$dictUtilsService", "$registerService",
	function($scope, ionicToast, $state, $ionicHistory, $ionicPopup, $qszmService, $dictUtilsService, $registerService) {
		$scope.goback = function() {
			$ionicHistory.goBack(); //返回上一个页面
		};
		$scope.gobacktohome = function() {
			$state.go('tab.home');
		};
		//在线查询
		//初始值
		$scope.blwd = $qszmService.wdxxData;
		$scope.blwd.familyMemberList = [];
		$scope.blwd.checkCertifyTypeEnum = "QSZM";
		//默认信息第一条为当前申请人信息
		$scope.blwd.familyMemberList.push({
			index: '$scope.blwd.familyMemberList.length',
			name: mongoDbUserInfo.name,
			zjzl: '',
			zjh: mongoDbUserInfo.zjh,
			familyRelationshipEnum: 'SELF',
			phone: mongoDbUserInfo.tel
		});
		//添加未成年子女信息
		$scope.addPeople = function() {
			$scope.blwd.familyMemberList.push({
				index: '$scope.blwd.familyMemberList.length',
				name: '',
				zjh: '',
				familyRelationshipEnum: 'SON'
			});
			console.log($scope.blwd.familyMemberList);
			console.log($qszmService.wdxxData);
		}
		//证件种类
		var zjzlStr = "证件种类";
		$scope.zjzl = {};
		$scope.zjzlData = $dictUtilsService.getDictinaryByType(zjzlStr).childrens;
		//初始化证件种类
		$scope.initZjlx = function() {
			if($scope.zjzlData != null && $scope.zjzlData.length > 0) {
				$scope.zjzl = $scope.zjzlData[0];
				$scope.blwd.familyMemberList[0].zjzl = $scope.zjzl.value;
				for(var i = 0; i < $scope.zjzlData.length; i++) {
					var zjzlTemp = $scope.zjzlData[i];
					if(zjzlTemp.value == $scope.blwd.familyMemberList[0].zjzl) {
						$scope.zjzl = zjzlTemp;
						$scope.blwd.familyMemberList[0].zjzl = $scope.zjzl.value;
					}
				}
			}
		}
		//选择证件种类
		$scope.checkZjlx = function(value) {
			for(var i = 0; i < $scope.zjzlData.length; i++) {
				if(value === $scope.zjzlData[i].value) {
					$scope.zjzl = $scope.zjzlData[i];
					$scope.blwd.familyMemberList[0].zjzl = $scope.zjzl.value;
					console.log("证件类型：");
					console.log($scope.zjzl);
				}
			}
		}
		$scope.initZjlx();
		//删除未成年子女信息
		$scope.showConfirm = function(i) {
			var confirmPopup = $ionicPopup.confirm({
				title: '您确定要删除吗?',
				template: '删除未成年子女信息',
				cancelText: '取消',
				okText: '确认',
				cssClass: 'dialog'
			});
			confirmPopup.then(function(res) {
				if(res) {
					$scope.blwd.familyMemberList.splice(i, 1);
				} else {
					console.log(res);
				}
			});
		}
		//验证数据保存信息
		$scope.verifyData = function() {
			var canSave = false;
			if($scope.blwd.familyMemberList[0].name == undefined || $scope.blwd.familyMemberList[0].name === null || $scope.blwd.familyMemberList[0].name === "") {
				$scope.showAlert("请输入申请人姓名");
			} else if($scope.blwd.familyMemberList[0].zjzl == undefined || $scope.blwd.familyMemberList[0].zjzl === null || $scope.blwd.familyMemberList[0].zjzl === "") {
				$scope.showAlert("请选择证件种类");
			} else if($scope.blwd.familyMemberList[0].zjh == undefined || $scope.blwd.familyMemberList[0].zjh === null || $scope.blwd.familyMemberList[0].zjh === "") {
				$scope.showAlert("请输入证件号码");
			} else if($scope.blwd.familyMemberList[0].zjh == undefined || $scope.blwd.familyMemberList[0].zjh === null || $scope.blwd.familyMemberList[0].zjh === "" || !$dictUtilsService.idcard($scope.blwd.familyMemberList[0].zjh) && $scope.blwd.familyMemberList[0].zjzl == 1) {
				$scope.showAlert("请输入正确的证件号码");
			} else if($scope.blwd.familyMemberList[0].phone == undefined || !$dictUtilsService.phone($scope.blwd.familyMemberList[0].phone) || $scope.blwd.familyMemberList[0].phone === "") {
				$scope.showAlert("请输入正确的联系电话");
			} else if(!$scope.verifySonData()) {

			} else {
				canSave = true;
			}
			return canSave;
		}
		//验证子女数据
		$scope.verifySonData = function() {
			var canSave = true;
			if($scope.blwd.familyMemberList.length > 0) {
				for(var i = 0; i < $scope.blwd.familyMemberList.length; i++) {
					var tempData = $scope.blwd.familyMemberList[i];
					if(tempData.name == undefined || tempData.name === null || tempData.name === "") {
						$scope.showAlert("请输入未成年子女姓名");
						canSave = false;
						break;
					} else if(tempData.zjh == undefined || tempData.zjh === null || tempData.zjh === "") {
						$scope.showAlert("请输入未成年子女证件号码");
						canSave = false;
						break;
					}
				}
				return canSave;
			}
		}
		//权属证明查询
		$scope.checkQszm = function() {
			if(!$scope.verifyData()) {
				return;
			}
			if($scope.cret.yzCode == null || $scope.cret.yzCode == '' || $scope.cret.yzCode == "") {
				$scope.showAlert("请输入验证码");
				return;
			}
			$qszmService.queryQszm({
				loginName: $scope.blwd.loginName,
				checkCertifyTypeEnum: $scope.blwd.checkCertifyTypeEnum,
				cxdz: $scope.blwd.cxdz,
				cxjg: $scope.blwd.cxjgCode,
				cxwddh: $scope.blwd.cxwddh,
				cxyt: $scope.blwd.cxyt,
				sfdy: $scope.blwd.sfdy,
				sfcf: $scope.blwd.sfcf,
				phone: $scope.userTel,
				authCode: $scope.cret.yzCode,
				familyMemberList: $scope.blwd.familyMemberList
			}).then(function(response) {
				if(response.success) {
					$state.go('qszmxxlist', {}, {
						reload: true
					});
				} else {
					$scope.showAlert(response.message);
				}
			}, function(error) {
				$scope.showAlert(error.message);

			});
		}
		//	查询指南
		$scope.cxznTitle = [{
			name: '受理条件',
			addClass: 'on',
			value: '0',
			show: true
		}, {
			name: '收费情况',
			addClass: '',
			value: '1',
			show: false
		}, {
			name: '常见问题',
			addClass: '',
			value: '2',
			show: false
		}]
		$scope.checkType = function(index) {
			for(var i = 0; i < 3; i++) {
				$scope.cxznTitle[i].addClass = '';
				$scope.cxznTitle[i].show = false;
			}
			for(var i = 0; i < 3; i++) {
				if(index === $scope.cxznTitle[i].value) {
					$scope.cxznTitle[i].addClass = 'on';
					$scope.cxznTitle[i].show = true;
				}
			}
		}
		$scope.showAlert = function(msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		};

		$scope.cret = {};
		if($dictUtilsService.isLogin()) {
			//获取用户信息（电话号码）
			$scope.userTel = userData.data.userInfo.phone;
		}
		//获取验证码按钮文字
		$scope.code = "获取验证码";
		$scope.bGetCodeDisabled = false;

		$scope.getTelCode = function() {

			if($scope.bGetCodeDisabled) {
				$scope.showAlert("60秒内请勿重复获取!");
				return;
			}
			$registerService.getPhoneCode({
				phone: $scope.userTel,
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
	}
]);
