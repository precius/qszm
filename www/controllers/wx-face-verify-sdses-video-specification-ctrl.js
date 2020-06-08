angular.module('faceSdsesVideoSpecificationCtrl', []).controller('faceSdsesVideoSpecificationCtrl', ["$scope", "$ionicHistory", "$stateParams", "$state",
	function($scope, $ionicHistory, $stateParams, $state) {

		var certificate = $stateParams.jsonObj;

		//返回
		$scope.goback = function() {
			$ionicHistory.goBack();
		}

		//下一步
		$scope.next = function() {
			$state.go("faceSdsesFaceRecognition", {
				"jsonObj": certificate
			});
		}
	}
]);