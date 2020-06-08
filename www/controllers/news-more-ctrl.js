angular.module('newsMoreCtrl', []).controller('newsMoreCtrl', ["$scope", "$zcfgService", "$dictUtilsService", "$ionicHistory", "$state",
	function($scope, $zcfgService, $dictUtilsService, $ionicHistory, $state) {
		//返回
		$scope.goback = function() {
			$ionicHistory.goBack();
		}

		//文章列表信息数组
		$scope.items = [];
		//通过文章类型查询文章列表
		$zcfgService.getArticleList({
				articleTypeEnum: 'ZCFG',
				category: 'zcjd'
			})
			.then(function(res) {
				if(res.success) {
					$scope.items = res.data.page;
					//替换照片URL
					if($scope.items.length > 0) {
						for(var i = 0; i < $scope.items.length; i++) {
							var item = $scope.items[i];
							item.pictureUrl = $dictUtilsService.replacePicUrl(item.pictureUrl);
						}
					}
				}
			}, function(res) {
				console.log("获取资讯失败");
			});

		//跳转到新闻详情页
		$scope.gotodetails = function(i) {
			$state.go('news-details', {
				id: $scope.items[i].id
			});
		}
	}
]);