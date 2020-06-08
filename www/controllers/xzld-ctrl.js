angular.module('xzldCtrl', []).controller('xzldCtrl', ["$scope", "$ionicHistory", "$state", "$wdbdcService",
	function($scope, $ionicHistory, $state, $wdbdcService) {
		$scope.data = ['1层', '2层', '3层'];

		//返回上一个页面
		$scope.goback = function() {
			$ionicHistory.goBack();
		};

		$scope.choose = function($index) {
			$wdbdcService.ldmp = $scope.data[$index];
			console.log($wdbdcService.ldmp);
			$state.go('tjbdc', {}, {
				reload: true
			});
		}
	}
]);