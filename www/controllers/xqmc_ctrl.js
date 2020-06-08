angular.module('xqmcCtrl', []).controller('xqmcCtrl', ["$scope", "$ionicHistory", "$state", "$wdbdcService",
	function($scope, $ionicHistory, $state, $wdbdcService) {
		$scope.data = ["亿达云山湖", "紫云府", "锦绣龙城", "保利时代", "清江锦城", "金域天下"];

		//返回上一个页面
		$scope.goback = function() {
			$ionicHistory.goBack();
		};

		$scope.choose = function($index) {
			$wdbdcService.xqmc = $scope.data[$index];
			$state.go('tjbdc', {}, {
				reload: true
			});
		}
	}
]);