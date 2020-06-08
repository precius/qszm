angular.module('editAddressCtrl', []).controller('editAddressCtrl', ["$scope", "$state", "$stateParams", "$ionicHistory", "ionicToast",
	"$menuService", "$bsznService", "$wysqService", "$rootScope","$dictUtilsService",
	function ($scope, $state, $stateParams, $ionicHistory, ionicToast, $menuService, $bsznService, $rootScope,$dictUtilsService) {
		$scope.goback = function () {
			$ionicHistory.goBack(); //返回上一个页面
		};
		
		$scope.userId = userData.data.id;

		$scope.init = function () {
            $scope.shxx = $stateParams.item
		}

		$scope.init();

		$scope.confirmfamilymember = function (item) {
			if ($scope.shxx.shr == undefined || $scope.shxx.shr === null || $scope.shxx.shr === "") {
				showAlert("请输入正确的姓名");
			} else if ($scope.shxx.szs == undefined || $scope.shxx.szs === null || $scope.shxx.szs === "") {
				showAlert("请输入正确的省级名称");
			} else if ($scope.shxx.szsq == undefined || $scope.shxx.szsq === null || $scope.shxx.szsq === "") {
				showAlert("请输入正确的市区名称");
			} else if ($scope.shxx.szqx == undefined || $scope.shxx.szqx === null || $scope.shxx.szqx === "") {
				showAlert("请输入所在区县位置");
			} else if ($scope.shxx.szjd == undefined || $scope.shxx.szjd === null || $scope.shxx.szjd === "") {
				showAlert("请输入所在街道");
			} else if ($scope.shxx.szxqdz == undefined || $scope.shxx.szxqdz === null || $scope.shxx.szxqdz === "") {
				showAlert("请输入所在小区地址，精确到门牌号");
			} else if ($scope.shxx.sjhm == undefined || $scope.shxx.szxqdz === null || $scope.shxx.szxqdz === "") {
				showAlert("请输入正确的联系电话");
			} else {
				showAlert("添加成功");
			}
		}

		$scope.save = function () {
			$scope.confirmfamilymember();
			$menuService.saveOrUpdateAddress({
                id:$scope.shxx.id,
				shr: $scope.shxx.shr,
				sjhm: $scope.shxx.sjhm,
				szs: $scope.shxx.szs,
				szsq: $scope.shxx.szsq,
				szxqdz: $scope.shxx.szxqdz,
				szqx: $scope.shxx.szqx,
				szjd: $scope.shxx.szjd,
				userId: $scope.userId,
				xxdz: $scope.shxx.szjd + $scope.shxx.szxqdz,
			}).then(function (res) {
				$state.go('myAddress')
				console.log(JSON.stringify(res))
			}, function (error) {
				$scope.showAlert('保存数据失败！')
			}
			);
		}
		//提示对话框
		$scope.showAlert = function (msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		};
	}
]);