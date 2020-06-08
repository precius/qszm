//权属证明办理网点信息控制器
angular.module('qszmBlwdxxCtrl', ['ionic']).controller('qszmBlwdxxCtrl', ["$scope", "ionicToast", "$state", "$ionicHistory", "$qszmService", "$dictUtilsService", "$ionicLoading",
	function($scope, ionicToast, $state, $ionicHistory, $qszmService, $dictUtilsService, $ionicLoading) {
		$scope.goback = function() {
			$ionicHistory.goBack(); //返回上一个页面
		};
		$scope.gobacktohome = function() {
			$state.go('tab.home');
		};
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
		//办理网点信息Data
		$scope.blwd = {};
		$scope.blwd.loginName = mongoDbUserInfo.id;
		$scope.blwd.sfdy = "true";
		$scope.blwd.sfcf = "true";
		$scope.blwd.cxyt = "161";

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
		//查档用途
		var cdytStr = "查档用途";
		$scope.cdyt = {};
		$scope.cdytData = $dictUtilsService.getDictinaryByType(cdytStr).childrens;
		//初始化查档用途
		$scope.initCdyt = function() {
			if($scope.cdytData != null && $scope.cdytData.length > 0) {
				$scope.cdyt = $scope.cdytData[0];
				$scope.blwd.cxyt = $scope.cdyt.value;
				for(var i = 0; i < $scope.cdytData.length; i++) {
					var cdytTemp = $scope.cdytData[i];
					if(cdytTemp.value == $scope.blwd.cxyt) {
						$scope.cdyt = cdytTemp;
					}
				}
			}
		}

		//查档用途
		$scope.checkCdyt = function(value) {
			for(var i = 0; i < $scope.cdytData.length; i++) {
				if(value === $scope.cdytData[i].value) {
					$scope.cdyt = $scope.cdytData[i];
					$scope.blwd.cxyt = $scope.cdyt.value;
					console.log("查档用途：");
					console.log($scope.cdyt);
				}
			}
		}
		$scope.initCdyt();
		//是否抵押
		$scope.sfdyData = [{
			"label": '是',
			"value": true
		}, {
			"label": '否',
			"value": false
		}];
		$scope.sfdyClass = $scope.sfdyData[0];
		$scope.checkSfdy = function(value) {
			for(var i = 0; i < $scope.sfdyData.length; i++) {
				if(value === $scope.sfdyData[i].value) {
					$scope.sfdyClass = $scope.sfdyData[i];
					$scope.blwd.sfdy = $scope.sfdyClass.value;
					console.log("是否查封：");
					console.log($scope.sfdyClass);
				}
			}
		}
		//是否查封
		$scope.sfcfData = [{
			"label": '是',
			"value": true
		}, {
			"label": '否',
			"value": false
		}];
		$scope.sfcfClass = $scope.sfcfData[0];
		$scope.checkSfcf = function(value) {
			for(var i = 0; i < $scope.sfcfData.length; i++) {
				if(value === $scope.sfcfData[i].value) {
					$scope.sfcfClass = $scope.sfcfData[i];
					$scope.blwd.sfcf = $scope.sfcfClass.value;
					console.log("是否查封：");
					console.log($scope.sfcfClass);
				}
			}
		}
		//点击选择办理网点
		$scope.checkBlwd = function(item) {
			$scope.blwdTemp = item;
		}
		//下一步按钮
		$scope.goSqrxx = function() {
			//网点信息数据保存至服务
			//到申请人信息页面
			$scope.blwd.loginName = userData.data.loginName;
			$scope.blwd.cxjg = $scope.blwdTemp.jgmc;
			$scope.blwd.cxwddh = $scope.blwdTemp.dh;
			$scope.blwd.cxdz = $scope.blwdTemp.address;
			$scope.blwd.cxjgCode = $scope.blwdTemp.djjg;
			$qszmService.wdxxData = $scope.blwd;
			console.log($qszmService.wdxxData);
			if($scope.verifyData()) {
				$state.go('wd-sqrxx');
			}
		}
		//验证数据保存信息
		$scope.verifyData = function() {
			var canSave = false;
			if($scope.blwd.cxjg == undefined || $scope.blwd.cxjg === null || $scope.blwd.cxjg === "") {
				$scope.showAlert("请选择办理网点");
			} else if($scope.blwd.cxyt == undefined || $scope.blwd.cxyt === null || $scope.blwd.cxyt === "" || $scope.blwd.cxyt == undefined) {
				$scope.showAlert("查档用途");
			} else if($scope.blwd.sfdy == undefined || $scope.blwd.sfdy === null || $scope.blwd.sfdy === "") {
				$scope.showAlert("请选择是否抵押");
			} else if($scope.blwd.sfcf == undefined || $scope.blwd.sfcf === null || $scope.blwd.sfcf === "") {
				$scope.showAlert("请选择是否查封");
			} else {
				canSave = true;
			}
			return canSave;
		}
		$scope.showAlert = function(msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		};
	}
]);