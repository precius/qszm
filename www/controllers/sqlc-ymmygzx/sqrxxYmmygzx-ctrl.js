// 预售商品房买卖预告注销登记
angular.module('sqrxxYmmygzxCtrl', []).controller('sqrxxYmmygzxCtrl', ["$scope", "ionicToast", "$state", "$ionicHistory", "$wysqService", "$ionicPopup", "$ionicLoading", "$dictUtilsService", "$menuService", "$ionicActionSheet", "$stateParams","$djsqService",
	function ($scope, ionicToast, $state, $ionicHistory, $wysqService, $ionicPopup, $ionicLoading, $dictUtilsService, $menuService, $ionicActionSheet, $stateParams,$djsqService ) {
		$scope.showEditInfo = function () {
			if ($wysqService.djsqItemData.step == "NETAPPLYING" || $wysqService.djsqItemData.step == "NETNOPASS") {
				$scope.isShow = true;
			} else {
				$scope.isShow = false;
			}
		}
		$scope.showEditInfo();
		$scope.qlxx = {};
		$scope.ygqlrlist = [];
		$scope.ygywrlist = [];
		// $scope.params = {};
		// $scope.params = $stateParams.jsonObj;
		// 9.20   9.21接着做   给这里添加数据
		//通过业务号获取业务信息，只需要接收wwywh即可
		// $scope.getqlxx = function (getParams) {
		// 	if ($wysqService.djsqItemData.wwywh != null) {
		// 		$wysqService.queryApplyByYwh({
		// 			wwywh: $wysqService.djsqItemData.wwywh
		// 		})
		// 			.then(function (res) {
		// 				if (res.success) {
		// 					//获取权利信息
		// 					$scope.qlxx = res.data;
		// 					console.log("$scope.qlxx is " + JSON.stringify($scope.qlxx));
		// 					$wysqService.djsqItemData = res.data;
		// 					//获取权利人列表
		// 					$scope.ygqlrlist = getParams.participants;
		// 					$scope.ygywrList = getParams.participants;
		// 					$scope.tzrList = getParams.participants;
		// 					//初始化tab信息
		// 					$scope.showEditInfo();
		// 					//获取办事大厅
		// 					$scope.bsdtmc = res.data.bsdtmc;
		// 				} else {
		// 					$scope.showAlert('获取申请信息失败');
		// 				}
		// 			}, function (res) {
		// 				$scope.showAlert('获取申请信息失败');
		// 			});
		// 	}
		// }

		$scope.getqlxx = function (getParams) {
			// $djsqService.getEstateInfoByMortgageCertificateNumber({
			// 	mortgageCertificateNumber: "123131",   //到时候需要把bdcqzmh传过来
			// 	unitCode: "150105005014GB00009F00180118,150105005014GB00009F00180119",
			// 	areaCode: "31313"
			// }).then(function (res) {
				$wysqService.queryApplyByYwh({
					wwywh: $wysqService.djsqItemData.wwywh
				})
					.then(function (res) {
				if (res.success) {
					//获取权利信息
					// $scope.qlxx = res.data;
					$scope.params = {};
					$scope.params = res;
					//进来时个人信息
					// 预告权利人
					$scope.ygqlrlist = $scope.params.data.children[0].qlrs[0];
					// 预告义务人
					$scope.ygywrList = $scope.params.data.children[0].ywrs[0];
					// $scope.tzrList = getParams.participants;
					$scope.ygqlrxx = {};
					$scope.ygqlrxx = {
						ywh: $wysqService.djsqItemData.wwywh,
						bdcqzh: $scope.params.data.bdcqzh,
						zl: $scope.params.data.zl,
						utime: $scope.params.data.zwlxzzsj,
						categroy: $scope.ygqlrlist.categroy,
						dh: $scope.ygqlrlist.phone,
						qlrmc: $scope.ygqlrlist.name,
						zjzl: $scope.ygqlrlist.zjzl,
						zjh: $scope.ygqlrlist.zjh
					};
					$scope.ygywrxx = {};
					$scope.ygywrxx = {
						ywh: $wysqService.djsqItemData.wwywh,
						bdcqzh: $scope.params.data.bdcqzh,
						zl: $scope.params.data.zl,
						utime: $scope.params.data.zwlxzzsj,
						categroy: $scope.ygywrList.categroy,
						dh: $scope.ygywrList.phone,
						qlrmc: $scope.ygywrList.name,
						zjzl: $scope.ygywrList.zjzl,
						zjh: $scope.ygywrList.zjh
					};
					//初始化tab信息
					// $scope.initInfo();
					$scope.showEditInfo();
					//获取办事大厅
					$scope.bsdtmc = res.data.bsdtmc;
				} else {
					$scope.showAlert('获取申请信息失败');
				}
			}, function (res) {
				$scope.showAlert('获取申请信息失败');
			});
			// }

		}
		$scope.saveMessage = function () {
			//  保存预告权力人信息
			$wysqService.addqlr($scope.ygqlrxx).then(function (res) {
				if (res.success) {
					$wysqService.queryApplyByYwh({
						wwywh: $wysqService.djsqItemData.wwywh
					}).then(function (res) {
						$scope.bsdtmc = res.data.bsdtmc;
					})
				} else {
					showAlert(res.message);
				}
			}, function (res) {
				showAlert(res.message);
			});
			//  保存预告义务人信息
			$wysqService.addywr($scope.ygywrxx).then(function (res) {
				if (res.success) {
				} else {
					showAlert(res.message);
				}
			}, function (res) {
				showAlert(res.message);
			});
		}

		$scope.getqlxx($menuService.jsonobj);
		$scope.saveMessage();

		//返回上一个页面
		$scope.goback = function () {
			$ionicHistory.goBack();
		};

		//提示框
		$scope.showAlert = function (msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		};
		//加载框
		show = function () {
			$ionicLoading.show({
				template: '加载中...'
			});
		};
		//隐藏加载框
		hide = function () {
			$ionicLoading.hide();
		};
	
		//下一步跳转不动产信息
		$scope.nextStep = function () {
			$scope.goBdcxxPage();
			$state.go("bdcxx_ymmygzx", {
				jsonObj: $scope.params,
				ywh: $wysqService.djsqItemData.ywh,
			}, {
				reload: true
			});
		};
		//跳转到不动产信息需要设置参数值
		$scope.goBdcxxPage = function () {
			//清空列表编辑信息
			$wysqService.bdcxxData = {};
			//显示下一步按钮
			$wysqService.bdcxxNext = true;
			//编辑按钮不显示
			$wysqService.bdcxxMod = false;
		};
	}
]);