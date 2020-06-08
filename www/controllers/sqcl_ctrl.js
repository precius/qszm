angular.module('sqclCtrl', []).controller('sqclCtrl', ["$scope", "$state", "$ionicHistory", "ionicToast", "$bsznService", "$menuService",
	function($scope, $state, $ionicHistory, ionicToast, $bsznService, $menuService) {

		//获取申请材料数据
		$bsznService.getUploadFile({
				subcfgId: $menuService.id
			})
			.then(function(response) {
				if(response.success) {
					$scope.uploadFile = angular.copy(response.data);
				} else {
					showAlert(response.message);
				}
			}, function(error) {
				showAlert(error.message);
			});

		//材料示例
		$scope.gotoclsls = function(index) {
			$bsznService.clsls = $scope.uploadFile[index].clsls;
			$state.go('clsls');
		}

		//返回
		$scope.goback = function() {
			$ionicHistory.goBack();
		}

		//提示对话框
		function showAlert(msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		}
	}
]);