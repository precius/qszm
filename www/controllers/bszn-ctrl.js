//办事指南控制器
angular.module('bsznCtrl', []).controller('bsznCtrl', ['$scope', '$ionicHistory', '$bsznService', '$state', '$dictUtilsService', '$menuService', '$rootScope', 'ionicToast',
	function($scope, $ionicHistory, $bsznService, $state, $dictUtilsService, $menuService, $rootScope, ionicToast) {
		$scope.goback = function() {
			$ionicHistory.goBack(); //返回上一个页面
		};
		//切换页面显示标题
		$scope.viewTitle = "办事指南";
		//默认显示办事指南列表
		$scope.showList = true;
		//显示详细页初始值
		$rootScope.hideTabs = false; //显示下边导航栏
		$scope.showItem = false;
		//显示返回按钮
		$scope.showBack = false;
		//获取办事指南列表
		$scope.bszn = [];
		//过滤办事指南信息，没有的办事子项不显示
		filterBszn = function() {
			if($scope.bszn != null && $scope.bszn.length > 0) {
				for(var i = $scope.bszn.length - 1; i >= 0; i--) {
					var needShow = true;
					var bsznItem = $scope.bszn[i];
					var flowDefConfigs = bsznItem.flowDefConfigs;
					for(var j = flowDefConfigs.length - 1; j >= 0; j--) {
						var flowDefConfig = flowDefConfigs[j];
						var flowSubDefConfigs = flowDefConfig.flowSubDefConfigs;
						console.log(JSON.stringify(flowSubDefConfigs));
						if(flowSubDefConfigs == null) {
							flowDefConfigs.splice(j, 1);
							continue;
						}
					}
					if(flowDefConfigs == null || flowDefConfigs.length == 0) {
						$scope.bszn.splice(i, 1);
						continue;
					}
				}
			}
		}
		$scope.queryBsznData = function() {
			$bsznService.queryBszn({
					djjg: county.code
				})
				.then(function(response) {
					$scope.bszn = angular.copy(response.data);
					for(var i = 0; i < $scope.bszn.length; i++) {
						$scope.bszn[i].show = false;
						$scope.bszn[i].showNum = i;
					}
					filterBszn();
					console.log($scope.bszn);
				}, function(error) {
					$scope.showAlert("请求失败");
				});
		};
		$scope.queryBsznData();
		//办事指南详细
		$scope.bsznDetails = {};
		//申请材料列表
		$scope.uploadFile = [];
		//是否显示办事指南
		$scope.showbszn = true;
		//是否显示申报材料列表
		$scope.showcllb = true;
		//1表示从流程树跳转到改页面
		$scope.flag = 0;
		//从流程树跳转到改页面
		if($menuService.flag === 0 || $menuService.flag === 1) {

			$bsznService.getBsznDetail({
					subcfgId: $menuService.id
				})
				.then(function(response) {
					$scope.bsznDetails = angular.copy(response.data);
				}, function(error) {
					$scope.showAlert("请求失败");
				});
			$bsznService.getUploadFile({
					subcfgId: $menuService.id
				})
				.then(function(response) {
					$scope.uploadFile = angular.copy(response.data);
					console.log($scope.uploadFile);
				}, function(error) {
					$scope.showAlert("请求失败");
				});

			if($menuService.flag === 0) {
				$scope.showbszn = true;
				$scope.showcllb = false;
				//设置第三层标题
				$scope.viewTitle = '办事指南详情';
			} else {
				$scope.showbszn = false;
				$scope.showcllb = true;
				$scope.viewTitle = "申请材料";
			}
			$scope.flag = 1;
			//隐藏第一层显示第二层
			$scope.showList = false;
			$scope.showItem = true;
			$scope.showBack = true;
			$rootScope.hideTabs = true; //隐藏底部tab
		}
		//标题显示初始值
		$scope.title1 = true;
		$scope.title2 = false;
		$scope.isSelected = false;
		//第一层点击切换
		$scope.checkType = function(item) {
			console.log(item);
			if(!$dictUtilsService.isDistrict()) {
				$state.go('qyxz', {
					"id": 2
				});
			} else {
				//隐藏第一层，显示第二层页面
				$scope.title1 = false;
				$scope.title2 = true;
				$scope.showBack = true;
				$rootScope.hideTabs = true; //隐藏底部tab
				//第二层标题
				$scope.viewTitle = item.name;
				$bsznService.title2 = item.name;
				//第二层数据
				$scope.text2 = item.flowDefConfigs;
				//对第三层数据进行处理
				if($scope.text2 != null && $scope.text2.length > 0) {
					for(var i = 0; i < $scope.text2.length; i++) {
						var temp = $scope.text2[i];
						var flowSubDefConfigsNew = [];
						if(temp.flowSubDefConfigs != null && temp.flowSubDefConfigs.length > 0) {
							for(var j = temp.flowSubDefConfigs.length - 1; j >= 0; j--) {
								var tempSub = temp.flowSubDefConfigs[j];
								if(tempSub.parentId == temp.id) {
									flowSubDefConfigsNew.push(tempSub);
								}
							}
						}
						temp.flowSubDefConfigs = flowSubDefConfigsNew;
					}
				}
			}
		}

		//第三层 详细办事指南信息 点击切换
		$scope.checkBszn = function(items) {
			$rootScope.hideTabs = true; //隐藏底部tab
			//设置第三层标题
			$scope.viewTitle = '办事指南详情';
			//隐藏第一层显示第二层
			$scope.showList = false;
			$scope.showItem = true;
			$scope.showBack = true;
			//获取第三层信息
			$scope.getDetail(items.id);
			//			$scope.bsznDetails = items.flowGuidance;
			//			$scope.uploadFile = items.uploadFileConfigs;
		}

		$scope.getDetail = function(id) {
			$bsznService.getBsznDetail({
					subcfgId: id
				})
				.then(function(response) {
					$scope.bsznDetails = angular.copy(response.data);
				}, function(error) {
					$scope.showAlert("请求失败");
				});
			$bsznService.getUploadFile({
					subcfgId: id
				})
				.then(function(response) {
					$scope.uploadFile = angular.copy(response.data);
					console.log($scope.uploadFile);
				}, function(error) {
					$scope.showAlert("请求失败");
				});
		}
		//跳转到示例详情页
		$scope.gotoclsls = function(i) {
			$bsznService.clsls = $scope.uploadFile[i].clsls;
			console.log($bsznService.clsls);
			$state.go('clsls');
		}
		//页面返回
		$scope.goback1 = function() {
			//当前页为办事指南一级列表
			if($scope.showList === true && $scope.viewTitle === '办事指南') {
				$state.go('tab.search');
			}
			//当前页为办事指南二级列表
			if($scope.title2 === true) {
				$rootScope.hideTabs = false; //隐藏底部tab
				//隐藏二级列表，显示一级列表
				$scope.title2 = false;
				$scope.title1 = true;
				$scope.showBack = false;
				//设置一级列表标题
				$scope.viewTitle = '办事指南';
			}
			//当前页为详细信息
			if($scope.showItem === true) {
				$rootScope.hideTabs = true; //隐藏底部tab
				//隐藏详情页
				$scope.showList = !$scope.showList;
				$scope.showItem = !$scope.showItem;
				$scope.showBack = true;
				//显示list 2级页面
				$scope.title1 = false;
				$scope.title2 = true;
				//获取list 2级页面标题
				$scope.viewTitle = $bsznService.title2;
			}
			if($scope.flag === 1) {
				$scope.flag = -1;
				$menuService.flag = -1;
				//切换页面显示标题
				$scope.viewTitle = "办事指南";
				//默认显示办事指南列表
				$scope.showList = true;
				//显示详细页初始值
				$scope.showItem = false;
				//显示返回按钮
				$scope.showBack = false;
				//显示底部tab
				$rootScope.hideTabs = false;
				$ionicHistory.goBack();
			}
		}
		//提示对话框
		$scope.showAlert = function(msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		};
	}
]);