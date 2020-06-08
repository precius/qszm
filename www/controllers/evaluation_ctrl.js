angular.module("evaluationCtrl", []).controller("evaluationCtrl", ["$scope", "$ionicHistory", "$stateParams", "ionicToast", "$dictUtilsService", "$evaluationService",
	function($scope, $ionicHistory, $stateParams, ionicToast, $dictUtilsService, $evaluationService) {
		$evaluationService.getByServiceId({
			serviceId: $stateParams.ywbh
		}).then(function(res) {
			if(res.data != null && res.data.length > 0) {
				$scope.data = res.data[0];
				$scope.showDetail = true;
				$scope.title = "评价详情";
				initDetail();
			} else {
				$scope.showDetail = false;
				$scope.title = "评价";
				init();
			}
		}, function(error) {
			showAlert(error.message);
		});
		/*$scope.showDetail = false;
		$scope.title = "评价";
		init();*/

		function initDetail() {
			$scope.stars = [{
				id: 1,
				status: true
			}, {
				id: 2,
				status: true
			}, {
				id: 3,
				status: true
			}, {
				id: 4,
				status: true
			}, {
				id: 5,
				status: true
			}];
			for(var i = 0; i < $scope.stars.length; i++) {
				if(i < $scope.data.serviceStar) {
					$scope.stars[i].status = true;
				} else {
					$scope.stars[i].status = false;
				}
			}
			//		$scope.evaluatePrivate = $scope.data.evaluatePrivate;
			switch($scope.data.serviceStar) {
				case 1:
					$scope.des = "非常不满意，各方面都很差";
					break;
				case 2:
					$scope.des = "不满意，比较差";
					break;
				case 3:
					$scope.des = "一般，还需改善";
					break;
				case 4:
					$scope.des = "比较满意，仍可完善";
					break;
				case 5:
					$scope.des = "非常满意，无可挑剔";
					break;
			}
			if($scope.data.serviceLabel != "" && $scope.data.serviceLabel != null) {
				var arr = $scope.data.serviceLabel.split("|");
				$scope.evaluateFlags = [];
				for(var i = 0; i < arr.length - 1; i++) {
					$scope.evaluateFlags.push({
						label: arr[i],
						selected: true
					});
				}
			}
		}

		function init() {
			$scope.stars = [{
				id: 1,
				status: true
			}, {
				id: 2,
				status: true
			}, {
				id: 3,
				status: true
			}, {
				id: 4,
				status: true
			}, {
				id: 5,
				status: true
			}];
			$scope.evaluatePrivate = false;
			$scope.des = "非常满意，无可挑剔";
			$scope.serviceStar = 5;
			$scope.evaluateFlags = $dictUtilsService.getDictinaryByType("服务评价").childrens;
			$scope.evaluate = {
				serviceEvaluate: ""
			};
			for(var i = 0; i < $scope.evaluateFlags.length; i++) {
				$scope.evaluateFlags[i].selected = false;
			}
		}

		//评分
		$scope.grade = function(index) {
			if($scope.showDetail) {
				return;
			}
			switch(index) {
				case 1:
					$scope.des = "非常不满意，各方面都很差";
					break;
				case 2:
					$scope.des = "不满意，比较差";
					break;
				case 3:
					$scope.des = "一般，还需改善";
					break;
				case 4:
					$scope.des = "比较满意，仍可完善";
					break;
				case 5:
					$scope.des = "非常满意，无可挑剔";
					break;
			}
			$scope.serviceStar = index;
			for(var i = 0; i < $scope.stars.length; i++) {
				if(i < index) {
					$scope.stars[i].status = true;
				} else {
					$scope.stars[i].status = false;
				}
			}
		}

		//标签选择
		$scope.selectFlag = function(index) {
			if($scope.showDetail) {
				return;
			}
			$scope.evaluateFlags[index].selected = !$scope.evaluateFlags[index].selected;
		}

		//匿名选择
		$scope.privateCheck = function() {
			$scope.evaluatePrivate = !$scope.evaluatePrivate;
		}

		//提交评价
		$scope.admit = function() {
			var serviceLabel = "";
			for(var i = 0; i < $scope.evaluateFlags.length; i++) {
				if($scope.evaluateFlags[i].selected) {
					serviceLabel += $scope.evaluateFlags[i].label;
					serviceLabel += "|";
				}
			}
			$evaluationService.saveEvaluate({
				userId: mongoDbUserInfo.id,
				serviceStar: $scope.serviceStar,
				serviceLabel: serviceLabel,
				serviceEvaluate: $scope.evaluate.serviceEvaluate,
				evaluatePrivate: $scope.evaluatePrivate,
				serviceUserName: mongoDbUserInfo.loginName,
				serviceid: $stateParams.ywbh,
				orgCode: $stateParams.orgCode,
				orgName: $stateParams.orgName
			}).then(function(res) {
				if(res.success) {
					showAlert("评价提交成功");
					$ionicHistory.goBack();
				} else {
					showAlert(res.message);
				}
			}, function(err) {
				showAlert(err.message);
			});
		}

		//返回
		$scope.goBack = function() {
			$ionicHistory.goBack();
		}

		function showAlert(msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		}
	}
]);