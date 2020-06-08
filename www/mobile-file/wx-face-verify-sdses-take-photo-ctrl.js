angular.module('faceSdsesTakePhotoCtrl', []).controller('faceSdsesTakePhotoCtrl', ["$scope", "ionicToast", "$stateParams", "$state",
	function($scope, ionicToast, $stateParams, $state) {

		var certificate = $stateParams.jsonObj;
		$scope.photoSelected = false;

		var input3 = document.getElementById("file_input3");
		readFile3 = function() {
			certificate.file = this.files[0];
			$scope.faceSrc = window.URL.createObjectURL(certificate.file);
			$scope.photoSelected = true;
			$scope.$apply();
		}
		input3.addEventListener('change', readFile3, false);

		//返回
		$scope.goback = function() {
			$state.go("tab.me");
		}

		//下一步
		$scope.next = function() {
			if($scope.photoSelected) {
				$state.go("faceSdsesVideoSpecification", {
					"jsonObj": certificate
				});
			} else {
				ionicToast.show("请先选择脸部照片", "middle", false, 2000);
			}
		}
	}
]);