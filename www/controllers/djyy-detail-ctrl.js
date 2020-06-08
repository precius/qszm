//一条预约详细详细信息
angular.module('djyyDetailCtrl', ['ionic']).controller('djyyDetailCtrl', ["$scope", "ionicToast", "$stateParams", "$ionicHistory", "$ionicPopup", "$wyyyService", "$dictUtilsService", "$bsznService", "$state",
	function($scope, ionicToast, $stateParams, $ionicHistory, $ionicPopup, $wyyyService, $dictUtilsService, $bsznService, $state) {
		$scope.goBack = function() {
			$ionicHistory.goBack();
		}

		//提示对话框
		$scope.showAlert = function(title, msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		};

		//获取预约详情
		getDetail = function() {
			var yybh = $stateParams.yybh;
			$scope.yybh = yybh;
			$wyyyService.wdyyDetail({
					yybh: yybh
				})
				.then(function(response) {
					if(response.success) {
						$scope.detail = angular.copy(response.data);
						$scope.detail.zjh = mongoDbUserInfo.zjh;

						var weekday = new Date($scope.detail.yysj).getDay(); //表示星期几
						//换算时间格式
						$scope.detail.yysj = $dictUtilsService.getFormatDate(new Date($scope.detail.yysj), "yyyy-MM-dd");

						var currentTime = new Date().getTime(); //当前毫秒时间
						var tomorrowTime = currentTime + 24 * 60 * 60 * 1000; //24小时后的毫秒时间
						var afterTomorrowTime = currentTime + 48 * 60 * 60 * 1000; //48小时后的毫秒时间

						var today = $dictUtilsService.getFormatDate(new Date(), "yyyy-MM-dd"); //今天的日期 ，格式为：yyyy-MM-dd
						var tomorrow = $dictUtilsService.getFormatDate(new Date(tomorrowTime), "yyyy-MM-dd"); //明天的日期 ，格式为：yyyy-MM-dd
						var afterTomorrow = $dictUtilsService.getFormatDate(new Date(afterTomorrowTime), "yyyy-MM-dd"); //后天的日期 ，格式为：yyyy-MM-dd

						if(today == $scope.detail.yysj) {
							$scope.detail.week = '今 天';
						} else if(tomorrow == $scope.detail.yysj) {
							$scope.detail.week = '明 天';
						} else if(afterTomorrow == $scope.detail.yysj) {
							$scope.detail.week = '后 天';
						} else {
							switch(weekday) {
								case 0:
									$scope.detail.week = '星期日';
									break;
								case 1:
									$scope.detail.week = '星期一';
									break;
								case 2:
									$scope.detail.week = '星期二';
									break;
								case 3:
									$scope.detail.week = '星期三';
									break;
								case 4:
									$scope.detail.week = '星期四';
									break;
								case 5:
									$scope.detail.week = '星期五';
									break;
								case 6:
									$scope.detail.week = '星期六';
									break;
							}
						}

						$scope.getDocs();
					} else {
						$scope.showAlert("获取数据失败");
					}
				}, function(error) {
					$scope.showAlert("请求失败");
				});
		}

		getDetail();

		$scope.getDocs = function() {
			//获取所有需要材料
			$bsznService.getUploadFileNew({
					subcfgId: $scope.detail.yyFlowId
				})
				.then(function(response) {
					$scope.uploadFile = angular.copy(response.data);
					console.log($scope.uploadFile)
				}, function(error) {
					//				showAlert( "未获取到所需材料信息!");
				});

		}
		$scope.isShowDocs = false;
		$scope.showDocs = function() {
			if($scope.uploadFile == null || $scope.uploadFile.length == 0) {
				showAlert("未获取到所需材料信息!");
			} else {
				$scope.isShowDocs = !$scope.isShowDocs;
			}

		}
		//删除预约
		$scope.delete = function(yybh) {
			showCancelConfirm(yybh);
		}
		$scope.evaluate = function() {
			$state.go("evaluation", {
				"ywbh": $scope.detail.yybh,
				"orgCode": $scope.detail.orgCode,
				"orgName": $scope.detail.yyjg
			});
		}

		showCancelConfirm = function(yybh) {
			var confirmPopup = $ionicPopup.confirm({
				title: '取消预约',
				template: '您确定要取消预约吗?',
				cancelText: '取消',
				okText: '确认',
				cssClass: 'dialog'
			});
			confirmPopup.then(function(res) {
				if(res) {
					var param = {
						yybh: yybh
					};
					$wyyyService.cancelWdyy(param).then(function(response) {
						if(response.success) {
							getDetail();
							$scope.showAlert('取消成功');
						}
					}, function(error) {
						$scope.showAlert('取消失败');
					});
				}
			});
		}
	}
]);
