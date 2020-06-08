angular.module('personalInfoCtrl', []).controller('personalInfoCtrl', ["$scope", "$ionicHistory", "$dictUtilsService",
	function($scope, $ionicHistory, $dictUtilsService) {
		$scope.gobackToMeTab = function() {
			$ionicHistory.goBack();
		}

		$scope.userInfo = mongoDbUserInfo;
		$scope.status = $dictUtilsService.getCertificationStatus();
	}
]);