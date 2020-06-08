angular.module('slideSplashCtrl', ['ionic']).controller('slideSplashCtrl', ["$scope", "$state",
	function($scope, $state) {
		var t;
		finishSplash = function() {
			t = window.setTimeout(function() {
				$state.go('tab.home');
			}, 7500)
		}

		check = function() {
			var isFirstIn = localStorage.getItem("isFirstIn");
			if(isFirstIn != null && isFirstIn == "false") {
				$scope.isShow = false;
				finishSplash();
			} else {
				$scope.isShow = true;
			}
			localStorage.setItem("isFirstIn", false);
		}
		check();

		$scope.begin = function() {
			$scope.isShow = false;
			finishSplash();
		}

		$scope.finishNow = function() {
			window.clearTimeout(t);
			$state.go('tab.home');
		}
	}
]);