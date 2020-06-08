angular.module('smyyxyCtrl', []).controller('smyyxyCtrl', ["$scope", "$state", "$ionicHistory", "$interval", "$menuService",
	function($scope, $state, $ionicHistory, $interval, $menuService) {
		$scope.countOver = false;
		var i = 10;
		$scope.count = "(10s)";

		var t = $interval(function() {
			i--;
			if(i == 0) {
				$scope.count = "";
				$scope.countOver = true;
			} else {
				$scope.count = "(" + i + "s)";
			}
		}, 1000, 10);

		$scope.goback = function() {
			$interval.cancel(t);
			$ionicHistory.goBack(); //返回上一个页面
		};

		$scope.agree = function() {
			$menuService.tag = 0;
			$state.go('smyyxx');
		}
		$scope.disagree = function() {
			$interval.cancel(t);
			$ionicHistory.goBack();
		};
	}
]);