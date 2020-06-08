angular.module('newsCtrl', []).controller('newsCtrl', ["$scope", "ionicToast", "$ionicHistory", "$searchService", "$dictUtilsService", "$ionicLoading", "$state", "$ionicPopup", "$rootScope",
	function($scope, ionicToast, $ionicHistory, $searchService, $dictUtilsService, $ionicLoading, $state, $ionicPopup, $rootScope) {
		//证件种类
		var zjzlStr = "证件种类";
		$scope.zjzl = {};
		$scope.zjzlData = $dictUtilsService.getDictinaryByType(zjzlStr).childrens;
		if($scope.zjzlData != null && $scope.zjzlData.length > 0) {
			$scope.zjzl = $scope.zjzlData[0];
		}
		//选择证件类型
		$scope.checkZjlx = function(value) {
			for(var i = 0; i < $scope.zjzlData.length; i++) {
				if(value === $scope.zjzlData[i].value) {
					$scope.zjzl = $scope.zjzlData[i];
					console.log("证件类型：");
					console.log($scope.zjzl);
				}
			}
		}
		//权属真伪信息
		$scope.cret = {};
		$scope.familyMemberList = [];
		$scope.familyMemberList[0] = {
			name: '',
			zjh: '',
			zjzl: $scope.zjzl.label,
			familyRelationshipEnum: 'SELF'
		}
		//提交权属真伪信息
		$scope.zscy = function() {
			if($scope.verifyData()) {
				$searchService.zscy({
						//					loginName: userData.data.loginName,
						bdcqzh: $scope.cret.zszmbh,
						qlrzjh: $scope.cret.qlrzjh,
						qlrmc: $scope.cret.qlrmc,
					})
					.then(function(res) {
						if(res.success) {
							var data = res.data;
							if("0" == data) {
								$scope.showAlert("无数据");
							} else if("1" == data) {
								$scope.showAlert("有效证书/证明");
							} else if("2" == data) {
								$scope.showAlert("无效证书/证明");
							}
						} else {
							$scope.showAlert("查询失败");
						}
					}, function(res) {
						$scope.showAlert("查询失败");
					});
			}
		}
		//验证数据保存信息
		$scope.verifyData = function() {
			var canSave = false;
			if($scope.cret.zszmbh == undefined || $scope.cret.zszmbh === null || $scope.cret.zszmbh === "") {
				$scope.showAlert("请输入证书(证明)证号");
			} else if($scope.cret.qlrmc == undefined || $scope.cret.qlrmc === null || $scope.cret.qlrmc === "") {
				$scope.showAlert("请输入权利人名称");
			} else if($scope.cret.qlrzjh == undefined || $scope.cret.qlrzjh === null || $scope.cret.qlrzjh === "") {
				$scope.showAlert("请输入权利人证件号");
			} else {
				canSave = true;
			}
			return canSave;
		}
		//验证家庭成员数据
		$scope.verifyPersonData = function() {
			var canSave = true;
			if($scope.familyMemberList.length > 0) {
				for(var i = 0; i < $scope.familyMemberList.length; i++) {
					var tempData = $scope.familyMemberList[i];
					if(tempData.name == undefined || tempData.name === null || tempData.name === "") {
						$scope.showAlert("请输入权利人名称");
						canSave = false;
						break;
					} else if(tempData.zjh == undefined || tempData.zjh === null || tempData.zjh === "" || !$dictUtilsService.idcard(tempData.zjh)) {
						$scope.showAlert("请输入正确的证件号码");
						canSave = false;
						break;
					}
				}
				return canSave;
			}
		}
		show = function() {
			$ionicLoading.show({
				template: '<ion-spinner icon="lines" class="spinner-calm"></ion-spinner><p>加载中……</p>'
			});
		};
		hide = function() {
			$ionicLoading.hide();
		};
		//查询的结果列表
		$scope.datalist = [];
		//根据查询类型获取已提交的查询
		$scope.searchAll = function() {
			show();
			$searchService.getAll({
					loginName: userData.data.loginName,
					checkCertifyTypeEnum: 'ZSZMHS'
				})
				.then(function(res) {
					if(res.success) {
						$scope.datalist = res.data.page;
						for(var i = 0; i < $scope.datalist.length; i++) {
							if($scope.datalist[i].checkCertifyStatusEnum == "CXZ") {
								$scope.datalist[i].status = "查询中";
							} else {
								$scope.datalist[i].status = "已取消";
							}
						}
						console.log($scope.datalist);
						hide();
					}
				}, function(res) {
					hide();
				});
		}
		$scope.searchAll();
		//提示对话框

		$scope.showAlert = function(msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		}
		//按查询编号取消查询
		$scope.del = function(i) {
			var confirmPopup = $ionicPopup.confirm({
				title: '取消查询',
				template: '您确定要取消查询吗?',
				cancelText: '取消',
				okText: '确认',
				cssClass: 'dialog'
			});
			confirmPopup.then(function(res) {
				if(res) {
					$searchService.del({
							cxbh: $scope.datalist[i].cxbh
						})
						.then(function(res) {
							if(res.success) {
								console.log(res);
								$scope.showAlert('取消成功');
								$scope.searchAll();
							}
						}, function(res) {
							console.log(res);
							$scope.showAlert('取消失败');
						});
				}
			});
		}
		$scope.goback = function() {
			$ionicHistory.goBack(); //返回上一个页面
		}
		//使用ocr获取证件信息
		$scope.zscytoocr = function() {
			$state.go('ocr', {
				"index": 0
			}, {
				reload: true
			});
		};
		$scope.zmcytoocr = function() {
			$state.go('ocr', {
				"index": 0
			}, {
				reload: true
			});
		};
		//OCR获取信息返回并且刷新
		$rootScope.$on('ocr-back', function(event, args) {
			//从OCR返回
			$scope.familyMemberList[0].name = args.name;
			$scope.familyMemberList[0].zjh = args.num;
		});
		//点击证书证明按钮进入当前页面
		$rootScope.$on('zszmcy', function(event, args) {
			$scope.searchAll();
		});
	}
]);