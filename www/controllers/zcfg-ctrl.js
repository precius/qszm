//动态搜索界面
angular.module('zcfgCtrl', []).controller('zcfgCtrl', ["$scope", "$ionicHistory", "$zcfgService", "$state", "$ionicLoading", "$stateParams",
	function($scope, $ionicHistory, $zcfgService, $state, $ionicLoading, $stateParams) {
		$scope.goback = function() {
			$ionicHistory.goBack(); //返回上一个页面
		};
		var jsonObj = $stateParams.jsonObj;
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
		$scope.title = jsonObj.title;
		$scope.policyQuery = {
			articleTypeEnum: jsonObj.articleTypeEnum,
			category: jsonObj.category,
			nCurrent: 0
		};
		$scope.query = function() {
			$scope.getArticleByQuery();
		}
		//通过文章类型查询文章列表
		$scope.getArticleByQuery = function() {
			show();
			$zcfgService.getArticleList($scope.policyQuery)
				.then(function(res) {
					if(res.success) {
						hide();
						console.log(res.data.page);
						$scope.items = res.data.page;
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
			console.log($scope.items[i].id);
			$state.go('zcfg-details', {
				id: $scope.items[i].id
			});
		}
	}
]);