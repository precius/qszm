angular.module('dynamicCtrl', []).controller('dynamicCtrl', ["$scope", "$state", "$ionicLoading", "$dictUtilsService", "$zcfgService", "$rootScope",
	function($scope, $state, $ionicLoading, $dictUtilsService, $zcfgService, $rootScope) {
		$scope.isshow = true;
		$rootScope.hideTabs = false; //显示下边导航栏
		$scope.zcfgTitle = [{
			name: '法律法规',
			addClass: 'on',
			value: '0',
			show: true, //显示法律法规
			articleTypeEnum: 'ZCFG',
			category: 'flfg'
		}, {
			name: '地方法规',
			addClass: '',
			value: '1',
			show: false,
			articleTypeEnum: 'ZCFG',
			category: 'dffg'
		}, {
			name: '政策解读',
			addClass: '',
			value: '2',
			show: false,
			articleTypeEnum: 'ZCFG',
			category: 'zcjd'
		}];
		$scope.zcfg = $scope.zcfgTitle[0];
		//选择动态信息切换选项卡
		$scope.checkType = function(index) {
			for(var i = 0; i < 3; i++) {
				$scope.zcfgTitle[i].addClass = '';
				$scope.zcfgTitle[i].show = false;
			}
			for(var i = 0; i < 3; i++) {
				if(index === $scope.zcfgTitle[i].value) {
					$scope.zcfgTitle[i].addClass = 'on';
					$scope.zcfgTitle[i].show = true;
					$scope.zcfg = $scope.zcfgTitle[i];
					$scope.policyQuery.title = "";
					$scope.query();
					break;
				}
			}
		}

		$scope.show = function(title) {
			$ionicLoading.show({
				//template: '上传中...'
				template: '<ion-spinner icon="lines" class="spinner-calm"></ion-spinner><p>' + title + '</p>'
			});
		};
		$scope.hide = function() {
			$ionicLoading.hide();
		};
		var jsonObj = {
			title: "政策解读",
			articleTypeEnum: 'ZCFG',
			category: 'zcjd'
		};
		show = function() {
			$ionicLoading.show({
				template: '<ion-spinner icon="lines" class="spinner-calm"></ion-spinner><p>加载中……</p>'
			});
		};
		hide = function() {
			$ionicLoading.hide();
		};
		//文章列表信息数组
		$scope.items = [];
		//搜索记录
		$scope.searchItems = [];
		$scope.query = function() {
			$scope.getArticleByQuery();

			if($scope.policyQuery.title != undefined && $scope.policyQuery.title != "" && $scope.policyQuery.title != null) {
				sName = $scope.policyQuery.title;
				//搜索记录
				if($scope.searchItems.length < 8 && $scope.searchItems.indexOf(sName) < 0) { //$scope.searchItems.indexOf(sName),类似string的方法，获取索引坐标
					$scope.searchItems.unshift(sName); //向数组的开头添加一个或更多元素，并返回新的长度
				} else if($scope.searchItems.length >= 8 && $scope.searchItems.indexOf(sName) < 0) {
					$scope.searchItems.pop(); //删除并返回数组的最后一个元素
					$scope.searchItems.unshift(sName);
				} else if($scope.searchItems.indexOf(sName) >= 0) {
					$scope.searchItems.splice($scope.searchItems.indexOf(sName), 1);
					$scope.searchItems.unshift(sName);
				}
			}
		}
		//历史搜索
		$scope.historyName = function(event) {
			$scope.policyQuery.title = event.target.innerHTML;
			$scope.gotoback();
		}
		//清空搜索记录
		$scope.delSearch = function() {
			$scope.searchItems.splice(0, $scope.searchItems.length); //清空数组
		}
		$scope.policyQuery = {
			articleTypeEnum: $scope.zcfg.articleTypeEnum,
			category: $scope.zcfg.category,
			nCurrent: 0
		}
		//通过文章类型查询文章列表
		$scope.getArticleByQuery = function() {
			$scope.policyQuery.articleTypeEnum = $scope.zcfg.articleTypeEnum;
			$scope.policyQuery.category = $scope.zcfg.category;
			show();
			$zcfgService.getArticleList($scope.policyQuery)
				.then(function(res) {
					if(res.success) {
						hide();
						$scope.items = res.data.page;
						console.log($scope.items);
						//替换照片URL
						if($scope.items.length > 0) {
							for(var i = 0; i < $scope.items.length; i++) {
								var item = $scope.items[i];
								if(item.pictureUrl == null) {
									item.pictureUrl = require("../theme/img/bg2.png");
								}
							}
						}
					}
				}, function(res) {
					hide();
					console.log(res);
				});
		}
		if($scope.items.length === 0) {
			$scope.getArticleByQuery();
		}
		//跳转到政策法规详情页
		$scope.gotodetails = function(i) {
			$state.go('zcfg-details', {
				id: $scope.items[i].id
			});
		}
		//跳转到搜索页面
		$scope.gotosearch = function() {
			$scope.isshow = false;
		}
		$scope.gotoback = function() {
			$scope.isshow = true;
			$scope.query();
		}
	}
]);