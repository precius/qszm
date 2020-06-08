// 预售商品房买卖抵押权预告注销登记
angular.module('sqrxxYdyzxCtrl', []).controller('sqrxxYdyzxCtrl', ["$scope", "ionicToast", "$state", "$ionicHistory", "$wysqService", "$ionicPopup", "$ionicLoading", "$dictUtilsService", "$menuService", "$ionicActionSheet", "$stateParams","$djsqService",
	function ($scope, ionicToast, $state, $ionicHistory, $wysqService, $ionicPopup, $ionicLoading, $dictUtilsService, $menuService, $ionicActionSheet, $stateParams,$djsqService) {
		$scope.showEditInfo = function () {
			if ($wysqService.djsqItemData.step == "NETAPPLYING" || $wysqService.djsqItemData.step == "NETNOPASS") {
				$scope.isShow = true;
			} else {
				$scope.isShow = false;
			}
		}
		$scope.qlrlist = [];
		$scope.ywrlist = [];
		// $scope.tzrList = [];
		$scope.zwrList = [];
		// $scope.params = {};
		// $scope.params = $stateParams.jsonObj;
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
		// 					$wysqService.djsqItemData = res.data;
		// 					//进来时个人信息
		// 					// 保存抵押权人  category = 4  调用权利人接口
		// 					$scope.dyqrObj = $scope.params.data.participants[0];
		// 					// 保存抵押人  category = 5  调用义务人接口
		// 					$scope.dyrObj = $scope.params.data.participants[1];
		// 					// 保存义务人  category = 6  调用义务人接口
		// 					$scope.zwrObj = $scope.params.data.participants[2];
		// 					$scope.dyqrxx = {};
		// 					$scope.dyqrxx = {
		// 						ywh:$wysqService.djsqItemData.wwywh,
		// 						bdcqzh:$scope.params.data.bdcxx[0].bdcqzh,
		// 						zl:$scope.params.data.bdcxx[0].zl,
		// 						utime:$scope.params.data.bdcxx[0].zwlxzzsj,
		// 						categroy: $scope.dyqrObj.categroy,
		// 						dh: $scope.dyqrObj.phone,
		// 						qlrmc: $scope.dyqrObj.name,
		// 						zjzl: $scope.dyqrObj.zjzl,
		// 						zjh: $scope.dyqrObj.zjh
		// 					};
		// 					$scope.dyrxx = {};
		// 					$scope.dyrxx = {
		// 						ywh:$wysqService.djsqItemData.wwywh,
		// 						bdcqzh:$scope.params.data.bdcxx[0].bdcqzh,
		// 						zl:$scope.params.data.bdcxx[0].zl,
		// 						utime:$scope.params.data.bdcxx[0].zwlxzzsj,
		// 						categroy: $scope.dyrObj.categroy,
		// 						dh: $scope.dyrObj.phone,
		// 						qlrmc: $scope.dyrObj.name,
		// 						zjzl: $scope.dyrObj.zjzl,
		// 						zjh: $scope.dyrObj.zjh
		// 					};
		// 					$scope.zwrxx = {};
		// 					$scope.zwrxx = {
		// 						ywh:$wysqService.djsqItemData.wwywh,
		// 						bdcqzh:$scope.params.data.bdcxx[0].bdcqzh,
		// 						zl:$scope.params.data.bdcxx[0].zl,
		// 						utime:$scope.params.data.bdcxx[0].zwlxzzsj,
		// 						categroy: $scope.zwrObj.categroy,
		// 						dh: $scope.zwrObj.phone,
		// 						qlrmc: $scope.zwrObj.name,
		// 						zjzl: $scope.zwrObj.zjzl,
		// 						zjh: $scope.zwrObj.zjh
		// 					};

		// 					$scope.tzrList = getParams.participants;
		// 					//初始化tab信息
		// 					// $scope.initInfo();
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

		$scope.getqlxx = function () {
				$wysqService.queryApplyByYwh({
					wwywh: $wysqService.djsqItemData.wwywh
				})
					.then(function (res) {
				if (res.success) {
					//获取权利信息
					// $scope.params = {};
					$scope.params = res;
					console.log("$scope.params is " + JSON.stringify($scope.params));
					//进来时个人信息
					// 保存抵押权人  category = 4  调用权利人接口
					// $scope.dyqrObj = $scope.params.data.participants[0];
					$scope.dyqrObj = $scope.params.data.children[0].qlrs[0];
					// 保存抵押人  category = 5  调用义务人接口
					$scope.dyrObj = $scope.params.data.children[0].ywrs[0];
					// 保存义务人  category = 6  调用义务人接口
					$scope.zwrObj = $scope.params.data.children[0].ywrs[1];
					// $scope.tzrList = $scope.params.data.children[0].tzrxxes;
					// $scope.tzrmc = $scope.tzrList[0].tzrmc;
					// $scope.tzdh = $scope.tzrList[0].tzdh;
					// console.log("$scope.tzrmc is " + $scope.tzrmc);
					$scope.dyqrxx = {};
					$scope.dyqrxx = {
						ywh: $wysqService.djsqItemData.wwywh,
						bdcqzh: $scope.params.data.bdcqzh,
						zl: $scope.params.data.zl,
						utime: $scope.params.data.zwlxzzsj,
						categroy: $scope.dyqrObj.categroy,
						dh: $scope.dyqrObj.phone,
						qlrmc: $scope.dyqrObj.name,
						zjzl: $scope.dyqrObj.zjzl,
						zjh: $scope.dyqrObj.zjh
					};
					$scope.dyrxx = {};
					$scope.dyrxx = {
						ywh: $wysqService.djsqItemData.wwywh,
						bdcqzh: $scope.params.data.bdcqzh,
						zl: $scope.params.data.zl,
						utime: $scope.params.data.zwlxzzsj,
						categroy: $scope.dyrObj.categroy,
						dh: $scope.dyrObj.phone,
						qlrmc: $scope.dyrObj.name,
						zjzl: $scope.dyrObj.zjzl,
						zjh: $scope.dyrObj.zjh
					};
					$scope.zwrxx = {};
					$scope.zwrxx = {
						ywh: $wysqService.djsqItemData.wwywh,
						bdcqzh: $scope.params.data.bdcqzh,
						zl: $scope.params.data.zl,
						utime: $scope.params.data.zwlxzzsj,
						categroy: $scope.zwrObj.categroy,
						dh: $scope.zwrObj.phone,
						qlrmc: $scope.zwrObj.name,
						zjzl: $scope.zwrObj.zjzl,
						zjh: $scope.zwrObj.zjh
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
			//  保存抵押权人信息
			$wysqService.addqlr($scope.dyqrxx).then(function (res) {
				if (res.success) {
				} else {
					showAlert(res.message);
				}
			}, function (res) {
				showAlert(res.message);
			});
			//  保存抵押人信息
			$wysqService.addywr($scope.dyrxx).then(function (res) {
				if (res.success) {
				} else {
					showAlert(res.message);
				}
			}, function (res) {
				showAlert(res.message);
			});
			//  保存债务人信息
			$wysqService.addywr($scope.zwrxx).then(function (res) {
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
		//保存通知人信息
		// var param = {
		// 	qlxxChildDtoList: [{
		// 		  "tzrxxes": [
		// 			{
		// 			  "tzdh": $scope.tzdh,
		// 			  "tzrmc": $scope.tzrmc
		// 			}
		// 		  ],
		// 		ywh: $wysqService.djsqItemData.ywh[0],

		// 	}],
		// 	wwywh: $wysqService.djsqItemData.wwywh
		// }
		// $wysqService.addbdcxx(param)
		// 	.then(function(res) {
		// 	   console.log("保存通知人成功");
		// 	})
		}

        

		$scope.getqlxx($menuService.jsonobj);
		$scope.saveMessage();

		$scope.hide = function () {
			$ionicLoading.hide();
		};

		//返回上一个页面
		$scope.goback = function () {
			$ionicHistory.goBack();
		};


		//下一步跳转不动产信息
		$scope.nextStep = function () {
			$scope.gobdcxxPage();
			if(dyqdj_zxdj_flowCode == $wysqService.djsqItemData.netFlowdefCode){
				$state.go("bdcxx_dyqdj_scdj", {
					"ywh": $wysqService.djsqItemData.wwywh
				  }, {
					reload: true
				  });
				}
			else{
			$state.go("bdcxx_ydyzx", {
				jsonObj: $scope.params,
				ywh: $wysqService.djsqItemData.ywh,
			}, {
				reload: true
			});
		}
		};

		$scope.gobdcxxPage = function () {
			//清空列表编辑信息
			$wysqService.bdcxxData = {};
			//显示下一步按钮
			$wysqService.bdcxxNext = true;
			//编辑按钮不显示
			$wysqService.bdcxxMod = false;
		};
	}
]);