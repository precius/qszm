angular.module('newsDetailCtrl', [])
	.controller('newsDetailCtrl', ["$scope", "$ionicHistory", "$zcfgService", "$ionicLoading", "$stateParams",
		function($scope, $ionicHistory, $zcfgService, $ionicLoading, $stateParams) {
			$scope.id = $stateParams.id;
			$scope.goback = function() {
				$ionicHistory.goBack(); //返回上一个页面
			};
			show = function() {
				$ionicLoading.show({
					template: '<ion-spinner icon="lines" class="spinner-calm"></ion-spinner><p>加载中……</p>'
				});
			};
			hide = function() {
				$ionicLoading.hide();
			};
			//头条详情页内容
			$scope.details = {
				time: '2018-5-8'
			};
			//根据id获取对应的头条详情页内容
			$scope.viewArticle = function() {
				show();
				console.log($scope.id);
				$zcfgService.viewArticle({
						id: $scope.id
					})
					.then(function(res) {
						if(res.success) {
							hide();
							console.log(res.data);
							$scope.details = res.data;
						}
					}, function(res) {
						hide();
						console.log(res);
					});
			}
			$scope.viewArticle();
		}
	])
	//解析html文本的过滤器
	.filter('toTruster', ['$sce', function($sce) {
		return function(text) {
			return $sce.trustAsHtml(text);
		}
	}]);