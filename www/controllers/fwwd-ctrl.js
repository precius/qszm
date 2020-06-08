angular.module('fwwdCtrl', []).controller('fwwdCtrl', ["$scope", "ionicToast", "$state", "$ionicHistory", "$wysqService", "$dictUtilsService",
	function($scope, ionicToast, $state, $ionicHistory, $wysqService, $dictUtilsService) {
		//我的位置
		var myLocation = null;
		var wechatPermission = false;

		if(platform != 'mobile') {
			//获取定位信息
			$wysqService.signature({
					url: signatureUrl
				})
				.then(function(res) {
					wx.config({
						debug: false,
						appId: res.data.appId,
						timestamp: res.data.timestamp,
						nonceStr: res.data.nonceStr,
						signature: res.data.signature,
						jsApiList: [
							'getLocation', 'openLocation'
						],
					});
				}, function(res) {
					showAlert('网络请求失败！');
				});

			wx.ready(function() {
				wechatPermission = true;
				wx.getLocation({
					type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
					success: function(res) {
						var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
						var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
						myLocation = new AMap.LngLat(longitude, latitude);
						getData();
					}
				});
			});

			wx.error(function() {
				showAlert("签名失败");
				getData();
			});
		} else {
			getData();
		}

		//查询办事大厅数据
		function getData() {
			$dictUtilsService.getBsdtDataByDjjg($scope, function(res) {
				if(res.success) {
					$scope.bsdtData = angular.copy(res.data);
					calculateDistance();
				}
			});
		}

		//计算距离
		function calculateDistance() {
			if(myLocation != null) {
				for(i = 0; i < $scope.bsdtData.length; i++) {
					if($scope.bsdtData[i].dx != null && $scope.bsdtData[i].dy != null) {
						$scope.bsdtData[i].distance = Math.round(AMap.GeometryUtil.distance([$scope.bsdtData[i].dx, $scope.bsdtData[i].dy], [myLocation.getLng(), myLocation.getLat()]) / 1000) + "km";
					} else {
						$scope.bsdtData[i].distance = "";
					}
				}
				$scope.$apply();
			}
		}

		$scope.selectBsdt = function(item) {
			if(platform == "weixin") {
				if(wechatPermission) {
					if(item.dx == null || item.dx == "" || item.dy == null || item.dy == "") {
						showAlert("该大厅暂无坐标信息");
					} else {
						wx.openLocation({
							latitude: item.dy, // 纬度，浮点数，范围为90 ~ -90
							longitude: item.dx, // 经度，浮点数，范围为180 ~ -180。
							name: item.officeName, // 位置名
							address: item.address, // 地址详情说明
							scale: 12, // 地图缩放级别,整形值,范围从1~28。默认为最大
							infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
						});
					}
				} else {
					showAlert("微信接口权限获取失败");
				}
			} else {
				if(item.dx == null || item.dx == "" || item.dy == null || item.dy == "") {
					showAlert("该大厅暂无坐标信息");
				} else {
					var jsonObj = angular.toJson(item);
					$state.go('fwwdmap', {
						'jsonObj': jsonObj
					});
				}
			}
		}

		//返回
		$scope.goback = function() {
			$ionicHistory.goBack();
		}

		showAlert = function(msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		};
		//提示对话框
		$scope.showAlert = function(msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		};
	}
]);