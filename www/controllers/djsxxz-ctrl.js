//登记事项选择
angular.module('djsxxzCtrl', []).controller('djsxxzCtrl', ["$scope", "ionicToast", "$stateParams", "$state", "djsq", "$ionicHistory", "$wysqService", "$ionicLoading", "$dictUtilsService", "$bsznService",
	function($scope, ionicToast, $stateParams, $state, djsq, $ionicHistory, $wysqService, $ionicLoading, $dictUtilsService, $bsznService) {
		//返回上一个页面
		$scope.goback = function() {
			$ionicHistory.goBack();
		};
		$scope.bsdt = $stateParams.bsdt;
		$scope.djsxDatas = [];
		//根据权限过滤数据
		$scope.filterData = function(djsxDatasTemp) {
			var resultData = [];
			if(djsxDatasTemp != undefined && djsxDatasTemp.length > 0 && permissionInfoServers != undefined && permissionInfoServers.length > 0) {
				for(var i = 0; i < djsxDatasTemp.length; i++) {
					var djsxData = djsxDatasTemp[i];
					if(djsxData.bdclb == "LAND") {
						djsxData.vpermValue = "IEBDC:WYSQ:TD:GR";
					} else if(djsxData.bdclb == "HOUSE") {
						djsxData.vpermValue = "IEBDC:WYSQ:FW";
					} else if(djsxData.bdclb == "WOODLAND") {
						djsxData.vpermValue = "IEBDC:WYSQ:LM:GR";
					}
					//服务上获取的权限数据
					for(var j = 0; j < permissionInfoServers.length; j++) {
						var permissionInfoServer = permissionInfoServers[j];
						if(djsxData.vpermValue == permissionInfoServer.permValue) {
							resultData.push(djsxData);
							break;
						}
					}
				}
			}
			return resultData;
		};
		getSubFlowList = function(djjgParam) {
			//根据登记机构获取所有子流程
			$wysqService.getSubFlowList({
				djjg: djjgParam,
				userId: mongoDbUserInfo.id
			}).then(function(res) {
				if(res.success) {
					$scope.djsxDatas = angular.copy(res.data);
					console.log("登记事项");
					console.log($scope.djsxDatas);
					if($scope.djsxDatas.length > 0) {
						for(var i = 0; i < $scope.djsxDatas.length; i++) {
							var djsxData = $scope.djsxDatas[i];
							djsxData.pictureUrl = $dictUtilsService.replacePicUrl(djsxData.pictureUrl);
						}
					}
					$scope.queryResult = $scope.filterData($scope.djsxDatas);
				}
			}, function(error) {});
		}
		getSubFlowList(150101);
		//	getSubFlowList("620101");
		//搜索登记事项
		$scope.queryCondition = {
			queryStr: ""
		};
		$scope.queryResult = [];
		$scope.query = function() {
			if($scope.queryCondition.queryStr != "" && $scope.djsxDatas.length > 0) {
				//正则表达式
				var len = $scope.djsxDatas.length;
				$scope.queryResult = [];
				var reg = new RegExp($scope.queryCondition.queryStr);
				for(var i = 0; i < len; i++) {
					//如果字符串中不包含目标字符会返回-1
					if($scope.djsxDatas[i].name.match(reg)) {
						$scope.queryResult.push($scope.djsxDatas[i]);
					}
				}
				$scope.queryResult = $scope.filterData($scope.queryResult);
			} else if($scope.queryCondition.queryStr == "") {
				$scope.queryResult = $scope.filterData($scope.djsxDatas);
			}
		}
		//点击登记事项
		$scope.clickDjsx = function(djsx) {
			//屏蔽注销功能
			if(gyjsydsyq_zxdj_flowCode == djsx.netFlowCode || gyjsydsyqjfwsyq_zxdj_flowCode == djsx.netFlowCode) {
				$scope.showAlert("当前功能不可用");
			} else {
				$scope.saveInfo(djsx)
			}
			//		$state.go('sqrxx',{"stateGo":'djsq'});
		}

		$scope.saveInfo = function(djsx) {
			console.log(djsx);
			$bsznService.getBsznDetail({
					subcfgId: djsx.id
				})
				.then(function(res) {
					$wysqService.yssx = res.data.yssx;
					console.log($wysqService.yssx);
				}, function(error) {
					console.log("请求失败");
				});
			$scope.sqxx = {
				djjg: $scope.bsdt.djjg, //机构代码
				djjgmc: $scope.bsdt.jgmc, //登记机构名称
				bdclb: djsx.bdclb, //不动产类别
				bsdtCode: $scope.bsdt.officeCode, //办事大厅
				bsdtName: $scope.bsdt.officeName, //办事大厅
				flowCode: djsx.flowCode, //流程代码
				flowName: djsx.flowName, //流程名称
				subFlowCode: djsx.subFlowCode, //子流程代码
				subFlowName: djsx.subFlowName, //子流程名称
				netFlowCode: djsx.netFlowCode, //网络流程代码
				djdl: djsx.djdl, //登记大类
				qllx: djsx.qllx, //权利类型
				sqrlx: mongoDbUserInfo.userCategory, //申请人类型
				userId: mongoDbUserInfo.id //用户ID
			};
			console.log($scope.user);
			console.log($scope.sqxx);
			if($scope.sqxx.djjg == undefined || $scope.sqxx.djjg === null || $scope.sqxx.djjg === "") {
				$scope.showAlert("请选择登记机构");
			} else if($scope.sqxx.bsdtCode == undefined || $scope.sqxx.bsdtCode === null || $scope.sqxx.bsdtCode === "" || $scope.sqxx.bsdtCode == undefined) {
				$scope.showAlert("请选择办事大厅");
			} else if($scope.sqxx.bdclb == undefined || $scope.sqxx.bdclb === null || $scope.sqxx.bdclb === "") {
				$scope.showAlert("请选择不动产类型");
			} else if($scope.sqxx.flowCode == undefined || $scope.sqxx.flowCode === null || $scope.sqxx.flowCode === "" || $scope.sqxx.flowName === null || $scope.sqxx.flowName === "") {
				$scope.showAlert("请选择登记大类");
			} else if($scope.sqxx.subFlowCode == undefined || $scope.sqxx.subFlowCode === null || $scope.sqxx.subFlowCode === "" || $scope.sqxx.subFlowName === null || $scope.sqxx.subFlowName === "") {
				$scope.showAlert("请选择登记小类");
			} else {
				show("正在提交数据");
				//提交区域信息数据
				$wysqService.saveSqxx($scope.sqxx)
					.then(function(res) {
						if(res.success) {
							console.log("保存区域信息成功");
							$wysqService.djsqItemData = res.data;
							console.log($wysqService.djsqItemData);
							$state.go('sqrxx', {
								"stateGo": 'djsq'
							});
						}
						hide();
					}, function(res) {
						console.log(res.message);
						console.log("获取失败");
						hide();
					});
			}
		};
		//提示框
		$scope.showAlert = function(m) {
			ionicToast.show(m, 'middle', false, 2000);
		};
		//	 //加载框
		//	 show = function() {
		//	    $ionicLoading.show({
		//	      template: 'Loading...'
		//	    });
		//	 };
		//	 //隐藏加载框
		//	 hide = function(){
		//	    $ionicLoading.hide();
		//	 };
		show = function(title) {
			$ionicLoading.show({
				//template: '上传中...'
				template: '<ion-spinner icon="lines" class="spinner-calm"></ion-spinner><p>' + title + '</p>'
			});
		};
		hide = function() {
			$ionicLoading.hide();
		};
	}
]);