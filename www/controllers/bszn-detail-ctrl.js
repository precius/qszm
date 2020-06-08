angular.module('bsznDetailCtrl', []).controller('bsznDetailCtrl', ["$scope", "ionicToast", "$state", "$ionicHistory", "$bsznService", "$menuService", "$ionicLoading",
	function($scope, ionicToast, $state, $ionicHistory, $bsznService, $menuService, $ionicLoading) {
		//加载框
		$scope.show = function(title) {
			$ionicLoading.show({
				//template: '上传中...'
				template: '<ion-spinner icon="lines" class="spinner-stable"></ion-spinner><p>' + title + '</p>'
			});
		};
		$scope.hide = function() {
			$ionicLoading.hide();
		};
		$scope.show('加载中...');
		//获取办事指南详情  当流程id等有0时，说明是从我的申请-不动产信息-查看办事指南 中进入该界面，那个界面中获取不到id,则用code查询办事指南
		if($menuService.id == 0){
			$bsznService.getBsznDetailByCode({
				subcfgCode: $menuService.level3FlowCode
			})
			.then(function(response) {
				$scope.hide();
				$scope.bsznDetails = angular.copy(response.data);
			}, function(error) {
				$scope.hide();
				showAlert("请求失败");
			});
		}else{
			$bsznService.getBsznDetail({
				subcfgId: $menuService.id
			})
			.then(function(response) {
				$scope.hide();
				$scope.bsznDetails = angular.copy(response.data);
			}, function(error) {
				$scope.hide();
				showAlert("请求失败");
			});
		};
		//获取办事指南详情  当流程id等有0时，说明是从我的申请-不动产信息-查看办事指南 中进入该界面，那个界面中获取不到id,则用code查询申请材料
		if($menuService.id == 0){
			$bsznService.getUploadFileByCode({
					subCode: $menuService.level3FlowCode
				})
				.then(function(response) {
					$scope.uploadFile = angular.copy(response.data);
					if($scope.uploadFile != null && $scope.uploadFile.length > 0) {
						$scope.showcllb = true;
					} else {
						$scope.showcllb = false;
					}
				}, function(error) {
					showAlert("请求失败");
				});
		}else{
			$bsznService.getUploadFile({
					subcfgId: $menuService.id
				})
				.then(function(response) {
					$scope.uploadFile = angular.copy(response.data);
					if($scope.uploadFile != null && $scope.uploadFile.length > 0) {
						$scope.showcllb = true;
					} else {
						$scope.showcllb = false;
					}
				}, function(error) {
					showAlert("请求失败");
				});
		};
		

		//跳转到示例详情页
		$scope.gotoclsls = function(i) {
			$bsznService.clsls = $scope.uploadFile[i].clsls;
			$state.go('clsls');
		}

		//返回
		$scope.goback = function() {
			$ionicHistory.goBack();
		}

		//弹框
		function showAlert(msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		}
	}
]);