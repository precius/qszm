angular.module('bsznclslsCtrl', []).controller('bsznclslsCtrl', ["$scope", "$ionicHistory", "$bsznService", "$ionicLoading",
	function($scope, $ionicHistory, $bsznService, $ionicLoading) {
		$scope.clsls = $bsznService.clsls;
		$scope.src = [];
		//下载图片加载框
		$scope.show = function(title) {
			$ionicLoading.show({
				//template: '上传中...'
				template: '<ion-spinner icon="lines" class="spinner-stable"></ion-spinner><p>' + title + '</p>'
			});
		};

		$scope.hide = function() {
			$ionicLoading.hide();
		};
		for(var i = 0; i < $scope.clsls.length; i++) {
			$scope.show("加载中");
			$bsznService.viewUploadFile({
					fileId: $scope.clsls[i].fileId
				})
				.then(function(res) {
					$scope.src.push({
						src: res.data
					});
					$scope.hide();
				}, function(error) {
					console.log("请求失败");
					$scope.hide();
				});
		}
		$scope.goback = function() {
			$ionicHistory.goBack(); //返回上一个页面
		};
	}
]);