angular.module('serviceCtrl', []).controller('serviceCtrl', ["$scope", "$zcfgService", "$state", "$ionicLoading",
	function($scope, $zcfgService, $state, $ionicLoading) {
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
		//通过文章类型查询文章列表
		$scope.getArticleByQuery = function() {
			show();
			$zcfgService.getArticleList({
					articleTypeEnum: 'ZCFG',
					category: 'zcjd'
				})
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
		//跳转到头条详情页
		$scope.gotodetails = function(i) {
			console.log($scope.items[i].id);
			$state.go('news-details', {
				id: $scope.items[i].id
			});
		}
	}
]);