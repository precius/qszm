angular.module('tjbdcCtrl', []).controller('tjbdcCtrl', ["$scope", "$ionicHistory", "$state", "$wdbdcService",
	function($scope, $ionicHistory, $state, $wdbdcService) {
		//选择的小区名称
		$scope.xqmc = $wdbdcService.xqmc;
		$scope.ldmp = $wdbdcService.ldmp;
		$scope.area = "";
		$scope.goback = function() {
			$ionicHistory.goBack();
		};

		$scope.selectName = function() {
			$state.go('xqmc');
		};

		$scope.selectBuildingNumber = function() {
			$state.go('xzld');
		}
		$scope.nextStep = function() {
			console.log($scope.area);
			$wdbdcService.data.push({
				xqmc: $scope.xqmc,
				area: "100",
				price: 420
			});
			$state.go('wdbdc');
		}
	}
]);