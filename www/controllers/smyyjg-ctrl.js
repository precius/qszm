angular.module('smyyjgCtrl', []).controller('smyyjgCtrl', ["$scope", "$state",
	function($scope, $state) {
		$scope.BackToHome = function() {
			$state.go('tab.home');
		};

		$scope.GoToMine = function() {
			$state.go('tab.me');
		};
	}
]);