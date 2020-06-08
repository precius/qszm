angular.module('wdbdcCtrl', []).controller('wdbdcCtrl', ["$scope", "$ionicHistory", "$state", "$wdbdcService",
	function($scope, $ionicHistory, $state, $wdbdcService) {
		$scope.data = $wdbdcService.data;
		$scope.isShow = $scope.data.length === 0 ? true : false;

		//返回上一个页面
		$scope.goback = function() {
			$ionicHistory.goBack();
		};

		//添加不动产
		$scope.add = function() {
			$state.go('tjbdc');
		}
		$scope.gotoesf = function() {
			$state.go('esf');
		}
		//不动产详情
		$scope.gotodetail = function() {
			$state.go('bdcxq');
		}
		$scope.delete = function($index) {
			$scope.data.splice($index, 1);
		}
		$scope.show = 0;
		$scope.showclass = function(i) {
			$scope.show = i;
		}

	}
]);