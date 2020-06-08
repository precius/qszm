//预约成功后跳转的预约结果
angular.module('yyjgCtrl', []).controller('yyjgCtrl', ["$scope", "ionicToast", "$state", "$ionicHistory", "$wyyyService", "$rootScope", "$dictUtilsService", "$bsznService",
	function($scope, ionicToast, $state, $ionicHistory, $wyyyService, $rootScope, $dictUtilsService, $bsznService) {
		//预约结果
		$scope.yyjg = $wyyyService.yyjg;
		$scope.yysj = $dictUtilsService.getFormatDate(new Date($scope.yyjg.yysj), "yyyy-MM-dd");
		$scope.GoToMine = function() {
			cleanData();
			$state.go('djyy');
		};
		$scope.GoToHome = function() {
			cleanData();
			$state.go('tab.home');
		};
		$scope.goback = function() {
			cleanData();
			$ionicHistory.goBack(); //返回上一个页面
		};
		$scope.yysxid = $wyyyService.yysxid;
		$scope.getDocs = function() {
			//获取申报材料
			$bsznService.getUploadFileNew({
					subcfgId: $scope.yysxid
				})
				.then(function(response) {
					$scope.uploadFile = angular.copy(response.data);
					console.log($scope.uploadFile)
				}, function(error) {
					ionicToast.show('未获取到所需材料信息');
				});

		}
		$scope.getDocs();
		$scope.isShowDocs = false;
		$scope.showDocs = function() {
			if($scope.uploadFile == null || $scope.uploadFile.length == 0) {
				showAlert("未获取到所需材料信息!");
			} else {
				$scope.isShowDocs = !$scope.isShowDocs;
			}

		}

		//清楚数据
		function cleanData() {
			$wyyyService.yymc = "";
			$wyyyService.yyhm = "";
			$wyyyService.yysx = "";
			$wyyyService.bsdt = "";
			$wyyyService.yysxid = "";
			$wyyyService.yysj = {
				date: '请选择预约时间',
				time: ''
			};
			$rootScope.$broadcast('yyjg', {});
		}
	}
]);
