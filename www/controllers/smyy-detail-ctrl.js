angular.module('smyyDetailCtrl', ['ionic']).controller('smyyDetailCtrl', ["$scope", "ionicToast", "$stateParams", "$ionicHistory", "$ionicPopup", "$fmsService", "$menuService", "$dictUtilsService", "$qyglService",
	function($scope, ionicToast, $stateParams, $ionicHistory, $ionicPopup, $fmsService, $menuService, $dictUtilsService, $qyglService) {
		$scope.detail = angular.fromJson($stateParams.jsonObj);

		var statusData = $dictUtilsService.getDictinaryByType("上门预约状态").childrens;

		for(var i = 0; i < statusData.length; i++) {
			if(statusData[i].value == $scope.detail.status) {
				$scope.statusLabel = statusData[i].label;
			}
		}
		//		if($scope.detail.applicantType == "2"){
		//			$scope.showtslx = true;
		//		} else {
		//			$scope.showtslx = false;
		//		}
		//		
		//		$scope.gzsx = $scope.detail.gzsx;
		//		$qyglService.getOrganizationTree({
		//			// currentId: '150100'
		//		}).then(function(res) {
		//			if(res.success) {
		//				if(res.data.length == 0){
		//					if($scope.showAlert != undefined){
		//						$scope.showAlert( '该地区暂无网点信息！');
		//					}
		//				}else {
		//					$scope.gzjgData = res.data[0].childrens[1].childrens;
		//					for(i = 0; i < $scope.gzjgData.length; i++) {
		//						if($scope.gzjgData[i].code == $scope.detail.notarialOfficeCode) {
		//							$scope.detail.gzjg = $scope.gzjgData[i].name;
		//						}
		//					}
		//				}
		//			} else {
		//				if($scope.showAlert != undefined){
		//					$scope.showAlert(  "获取登记机构失败");
		//				}
		//			}
		//		}, function(error) {
		//			if($scope.showAlert != undefined){
		//				$scope.showAlert(  "服务器请求出错");
		//			}
		//		});	

		//附件种类列表：一个二维数组,每个种类中包含多个附件
		$scope.fjzl = {};
		$scope.fjzl.filelist = [];

		//获取预约详情
		var fileIDS = $scope.detail.proofFileId;
		var idArray = fileIDS.split(",");
		//		var idArray = fileIDS;
		if(idArray != null && idArray.length > 0) {
			for(var i = 0; i < idArray.length; i++) {
				var idStr = idArray[i];
				$fmsService.findFileById({
						'id': idStr
					})
					.then(function(response) {
						if(response.success) {
							$scope.fjzl.filelist.push(response.data);
						} else {
							showAlert("获取数据失败");
						}
					}, function(error) {
						showAlert("请求失败");
					});
			}
		}

		//显示大图
		$scope.showImageBig = function(file) {
			if(!$scope.isShowDel) {
				$scope.Url = file.filePathUrl;
				$scope.bigImage = true;
			}
		};

		//初始默认大图是隐藏的
		$scope.hideBigImage = function() {
			$scope.bigImage = false;
		};

		//删除预约
		$scope.delete = function() {
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
							id: $scope.detail.id
						})
						.then(function(res) {
							if(res.success) {
								$scope.detail.status = "预约取消";
								showAlert("取消预约成功");
							} else {
								showAlert("取消预约失败");
							}
						}, function(error) {
							showAlert("取消预约失败");
						});
				}
			});
		}

		//返回
		$scope.goBack = function() {
			$ionicHistory.goBack();
		}

		//提示对话框
		function showAlert(msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		}
	}
]);