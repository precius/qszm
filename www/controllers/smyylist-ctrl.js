angular.module('smyylistCtrl', ['ionic']).controller('smyylistCtrl', ["$scope", "ionicToast", "$ionicHistory", "$ionicPopup", "$state", "$dictUtilsService", "$ionicLoading", "$addressService", "$menuService",
	function($scope, ionicToast, $ionicHistory, $ionicPopup, $state, $dictUtilsService, $ionicLoading, $addressService, $menuService) {
		//获取列表参数
		var djyyListPage = {
			nCurrent: 0,
			nSize: 100
		};

		var statusData = $dictUtilsService.getDictinaryByType("上门预约状态").childrens;
		$scope.gzsxData = [{text: "委托", code: 1}, {text: "继承", code: 2}, {text: "遗嘱", code: 3}];

		//获取预约列表
		if(mongoDbUserInfo != undefined && mongoDbUserInfo.id != undefined) {
			// djyyListPage.applicantPhone = mongoDbUserInfo.tel;
			djyyListPage.userId = mongoDbUserInfo.id;
		}
		show("正在获取预约列表信息");
		$menuService.getsmyylist(djyyListPage)
			.then(function(response) {
				var result = angular.copy(response.data);
				$scope.djyy1 = result.page;
				if($scope.djyy1 != null && $scope.djyy1.length > 0) {
					for(var i = 0; i < $scope.djyy1.length; i++) {
						//换算时间格式
						$scope.djyy1[i].yysj = $dictUtilsService.getFormatDate(new Date($scope.djyy1[i].appointmentTime), "yyyy-MM-dd");
						for(j = 0; j < $scope.gzsxData.length; j++) {
							if($scope.gzsxData[j].code == $scope.djyy1[i].matter) {
								$scope.djyy1[i].gzsx = $scope.gzsxData[j].text;
							}
						}
						for(var j = 0; j < statusData.length; j++) {
							if($scope.djyy1[i].status == statusData[j].value) {
								$scope.djyy1[i].statusLabel = statusData[j].label;
								if($scope.djyy1[i].status == "COMMITTED") {
									$scope.djyy1[i].statusColor = "#E8A010";
									$scope.djyy1[i].cancelable = true;
								} else if($scope.djyy1[i].status == "PASSED" || $scope.djyy1[i].status == "FINISHED") {
									$scope.djyy1[i].statusColor = "#46B071";
									$scope.djyy1[i].cancelable = false;
								} else {
									$scope.djyy1[i].statusColor = "#F15A4A";
									$scope.djyy1[i].cancelable = false;
								}
								break;
							}
						}
					}
					$scope.isShow = false;
				} else {
					$scope.isShow = true;
				}
				hide();
			}, function(error) {
				showAlert(error.message);
				hide();
			});

		//查看详细信息
		$scope.checkDjyy = function(item) {
			$state.go('smyy-detail', {
				"jsonObj": angular.toJson(item)
			});
		}

		//取消指定的申请
		$scope.delete = function(item) {
			var confirmPopup = $ionicPopup.confirm({
				title: '取消预约',
				template: '您确定要取消预约吗?',
				cancelText: '取消',
				okText: '确认',
				cssClass: 'dialog'
			});
			confirmPopup.then(function(res) {
				if(res) {
					$menuService.cancel({
							id: item.id
						})
						.then(function(res) {
							if(res.success) {
								$state.reload("smyylist");
							} else {
								showAlert(res.message);
							}
						}, function(res) {
							showAlert(res.message);
						});
				}
			});
		}

		//修改指定的申请
		$scope.update = function(item) {
			$menuService.tag = 1;
			$menuService.item = item;
			$state.go('smyyxx');
		}

		//跳转到地址导航页
		$scope.gotoaddress = function(item) {
			$addressService.jgmc = item.yyjg;
			$addressService.officeName = item.yybsdt;
			$state.go('map');
		}

		//返回
		$scope.goback = function() {
			$ionicHistory.goBack();
		};

		//弹框
		showAlert = function(msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		};

		//loading
		function show(title) {
			$ionicLoading.show({
				template: '<ion-spinner icon="lines" class="spinner-calm"></ion-spinner><p>' + title + '</p>'
			});
		}

		//关闭loading
		function hide() {
			$ionicLoading.hide();
		}
	}
]);