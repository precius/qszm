//预约须知（预约协议）
angular.module('yyxzCtrl', []).controller('yyxzCtrl', ["$scope", "$ionicHistory", "$state", "$interval",
	function($scope, $ionicHistory, $state, $interval) {
		$scope.countOver = false;
		var i = timeCount;
		$scope.count = "(10s)";

		var t = $interval(function() {
			i--;
			if(i <= 0) {
				$scope.count = "";
				$scope.countOver = true;
			} else {
				$scope.count = "(" + i + "s)";
			}
		}, 1000, i);

		//返回
		$scope.goback = function() {
			$interval.cancel(t);
			$ionicHistory.goBack();
		}

		//同意协议
		$scope.agree = function() {
			$state.go('yysx');
		}

		//不同意协议
		$scope.disagree = function() {
			$interval.cancel(t);
			$ionicHistory.goBack();
		}
	}
]);