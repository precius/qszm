angular.module('qyxzCtrl', []).controller('qyxzCtrl', ["$scope", "ionicToast", "$state", "djsq", "$ionicHistory", "$wysqService", "$ionicLoading",
	function($scope, ionicToast, $state, djsq, $ionicHistory, $wysqService, $ionicLoading) {
		//返回上一个页面
		$scope.goback = function() {
			$ionicHistory.goBack();
		};
		//机构名
		$scope.jgData = [];
		$scope.jg = {};
		//获取机构信息
		$scope.queryJgData = function() {
			$wysqService.queryJgByAreaId({
					id: city.id
				})
				.then(function(response) {
					$scope.jgData = angular.copy(response.data);
					//根据登记机构、不动产类别获取流程信息,初始化信息
					$scope.jg = $scope.jgData[0];
					$scope.queryBsdtData(); //获取办事大厅信息
					$scope.queryFlowData();
				}, function(error) {});
		};
		$scope.queryJgData();
		//当前选择登记机构
		$scope.checkJg = function(djjgName) {
			for(var i = 0; i < $scope.jgData.length; i++) {
				if(djjgName === $scope.jgData[i].NAME) {
					$scope.jg = $scope.jgData[i];
				}
			}
			$scope.queryBsdtData(); //获取办事大厅信息
			$scope.queryFlowData();
		}
		//办事大厅
		//根据登记机构获取办事大厅
		$scope.queryParam = {
			djjg: '',
			nCurrent: 0,
			nSize: 10
		};
		$scope.bsdtData = [];
		$scope.bsdt = {
			officeName: ""
		};
		$scope.queryBsdtData = function() {
			$scope.queryParam.djjg = $scope.jg.code;
			$wysqService.queryBsdt($scope.queryParam)
				.then(function(res) {
					if(res.success) {
						$scope.bsdtData = angular.copy(res.data.page);
						//初始化办事大厅
						if($scope.bsdtData.length > 0) {
							$scope.bsdt = $scope.bsdtData[0];
							$scope.checkBsdt($scope.bsdt.officeName);
						}
					}
				}, function(error) {});
		};
		//当前选择办事大厅
		$scope.checkBsdt = function(bsdtStr) {
			for(var i = 0; i < $scope.bsdtData.length; i++) {
				if(bsdtStr === $scope.bsdtData[i].officeName) {
					$scope.bsdt = $scope.bsdtData[i];
					console.log("办事大厅：");
					console.log($scope.bsdt);
				}
			}
			$scope.queryFlowData();
		}
		//不动产类型
		$scope.bdclb = {};
		$scope.bdclbData = [{
			name: '土地',
			value: 'LAND'
		}, {
			name: '房屋',
			value: 'HOUSE'
		}, {
			name: '林地',
			value: 'WOODLAND'
		}];
		//初始化不动产类型
		$scope.bdclb = $scope.bdclbData[0];
		//当前选择不动产类型
		$scope.checkBdclb = function(bdclbStr) {
			for(var i = 0; i < $scope.bdclbData.length; i++) {
				if(bdclbStr === $scope.bdclbData[i].value) {
					$scope.bdclb = $scope.bdclbData[i];
					console.log("不动产类型：");
					console.log($scope.bdclb);
				}
			}
			$scope.queryFlowData();
		}

		//登记类型
		$scope.djlxData = [];
		$scope.djlx = {};
		//获取登记类型
		$scope.queryFlowData = function() {
			show('正在获取流程数据');
			$wysqService.queryFlow({
				'djjg': $scope.jg.code,
				'bdclb': $scope.bdclb.value
			}).
			then(function(response) {
				$scope.djlxData = angular.copy(response.data);
				//初始化获取登记类型
				if($scope.djlxData.length > 0) {
					$scope.djlx = $scope.djlxData[0];
					$scope.checkDjlx($scope.djlx.name);
				}
				hide();
			}, function(error) {
				hide();
			});
		};
		//登记大类
		$scope.djdlData = [];
		$scope.djdl = {
			flowCode: '',
			name: '',
			djdl: '',
			qllx: ''
		};
		//当前选择的登记类型
		$scope.checkDjlx = function(djlxName) {
			$scope.djdlData = [];
			if(djlxName == undefined) {
				$scope.djlx = {};
			}
			for(var i = 0; i < $scope.djlxData.length; i++) {
				if(djlxName === $scope.djlxData[i].name) {
					$scope.djdlDataAll = $scope.djlxData[i].flowDefConfigs;
					//改变登记类型
					$scope.djlx = $scope.djlxData[i];
					console.log("登记类型：");
					console.log($scope.djlx);
				}
			}
			//过滤登记大类
			for(var j = 0; j < $scope.djdlDataAll.length; j++) {
				var temp = $scope.djdlDataAll[j];
				if(temp.visible == true) {
					$scope.djdlData.push(temp);
				}
			}
			//初始化获取登记大类
			if($scope.djdlData.length > 0) {
				$scope.djdl = $scope.djdlData[0];
				$scope.checkDjdl($scope.djdl.name);
			}
		}
		//登记小类
		$scope.djxlDataAll = [];
		$scope.djxlData = [];
		$scope.djxl = {
			code: '',
			name: ''
		};
		//当前选择的登记大类
		$scope.checkDjdl = function(djdl) {
			$scope.djxlData = [];
			if(djdl == undefined) {
				$scope.djdl = {};
			}
			for(var i = 0; i < $scope.djdlData.length; i++) {
				if(djdl === $scope.djdlData[i].name) {
					$scope.djxlDataAll = $scope.djdlData[i].flowSubDefConfigs;
					for(var j = 0; j < $scope.djxlDataAll.length; j++) {
						if($scope.djxlDataAll[j].parentId == $scope.djdlData[i].id) {
							$scope.djxlData.push($scope.djxlDataAll[j]);
							console.log("所有登记小类：");
							console.log($scope.djxl);
						}
					}
					//改变登记大类
					$scope.djdl = $scope.djdlData[i];
					console.log("登记大类：");
					console.log($scope.djdl);
					//初始化获取登记小类
					if($scope.djxlData != null && $scope.djxlData.length > 0) {
						$scope.djxl = $scope.djxlData[0];
						$wysqService.fjlxlist = $scope.djxl.uploadfileConfigs;
						$scope.checkDjxl($scope.djxl.name);
					}
				}
			}
		}
		//当前选择的登记小类
		$scope.checkDjxl = function(djxl) {
			if(djxl == undefined) {
				$scope.djxl = {};
			}
			for(var i = 0; i < $scope.djxlData.length; i++) {
				if(djxl === $scope.djxlData[i].name) {
					$scope.djxl = $scope.djxlData[i];
					//初始化获取登记小类
					console.log("选择的登记小类：");
					console.log($scope.djxl);
				}
			}
		}
		$scope.saveInfo = function() {
			$scope.sqxx = {
				djjg: $scope.jg.code, //机构代码
				bsdt: $scope.bsdt.officeName, //办事大厅
				bdclb: $scope.bdclb.value, //不动产类别
				netFlowdefCode: $scope.djdl.netFlowdefCode, //网络流程代码
				flowcode: $scope.djdl.flowCode, //流程代码
				flowname: $scope.djdl.name, //流程名称
				subFlowcode: $scope.djxl.code, //子流程代码
				subFlowname: $scope.djxl.name, //子流程名称
				djdl: $scope.djdl.djdl, //登记大类
				qllx: $scope.djdl.qllx, //权利类型
				userId: mongoDbUserInfo.id, //用户ID
				sqrlx: mongoDbUserInfo.userCategory
			};
			console.log($scope.user);
			console.log($scope.sqxx);
			if($scope.sqxx.djjg == undefined || $scope.sqxx.djjg === null || $scope.sqxx.djjg === "") {
				$scope.showAlert("请选择登记机构");
			} else if($scope.sqxx.bsdt == undefined || $scope.sqxx.bsdt === null || $scope.sqxx.bsdt === "" || $scope.sqxx.bsdt == undefined) {
				$scope.showAlert("请选择办事大厅");
			} else if($scope.sqxx.bdclb == undefined || $scope.sqxx.bdclb === null || $scope.sqxx.bdclb === "") {
				$scope.showAlert("请选择不动产类型");
			} else if($scope.sqxx.flowcode == undefined || $scope.sqxx.flowcode === null || $scope.sqxx.flowcode === "" || $scope.sqxx.flowname === null || $scope.sqxx.flowname === "") {
				$scope.showAlert("请选择登记大类");
			} else if($scope.sqxx.subFlowcode == undefined || $scope.sqxx.subFlowcode === null || $scope.sqxx.subFlowcode === "" || $scope.sqxx.subFlowname === null || $scope.sqxx.subFlowname === "") {
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
		$scope.showAlert = function(msg) {
			ionicToast.show(msg, 'middle', false, 2000);
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