angular.module('selectBsdtCtrl', []).controller('selectBsdtCtrl', ["$scope", "ionicToast", "$rootScope", "$ionicHistory", "$wyyyService", "$wysqService", "$dictUtilsService",
	function($scope, ionicToast, $rootScope, $ionicHistory, $wyyyService, $wysqService, $dictUtilsService) {
		//地图位置标记
		var marker = null;
		//选择的办事大厅
		var selectedItem = null;
		//我的位置
		var myLocation = null;
		//选择的办事大厅下标
		$scope.selectedIndex = -1;

		//初始化地图
		var map = new AMap.Map('mapcontainer', {
			resizeEnable: true,
			zoom: 10
		});

		//计算距离
		function calculateDistance() {
			if(myLocation != null) {
				for(i = 0; i < $scope.bsdtData.length; i++) {
					if($scope.bsdtData[i].dx != null && $scope.bsdtData[i].dy != null) {
						$scope.bsdtData[i].distanceTemp = AMap.GeometryUtil.distance([$scope.bsdtData[i].dx, $scope.bsdtData[i].dy], [myLocation.getLng(), myLocation.getLat()]);
						if($scope.bsdtData[i].distanceTemp >= 1000) {
							$scope.bsdtData[i].distance = Math.round($scope.bsdtData[i].distanceTemp / 1000) + "km";
						} else {
							$scope.bsdtData[i].distance = Math.round($scope.bsdtData[i].distanceTemp) + "m";
						}
					} else {
						$scope.bsdtData[i].distanceTemp = 0;
						$scope.bsdtData[i].distance = "";
					}
				}
				$scope.bsdtData.sort(function(a, b) {
					return a.distanceTemp - b.distanceTemp;
				});
				$scope.$apply();
			}
		}

		//查询办事大厅数据
		function getData() {
			$dictUtilsService.getBsdtDataByDjjg($scope, function(res) {
				if(res.success) {
					$scope.bsdtData = angular.copy(res.data);
					calculateDistance();
				} else {
					showAlert(res.message);
				}
			}, function(err) {
				showAlert(err.message);
			});
		}

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
							'getLocation'
						],
					});
				}, function(res) {
					showAlert('网络请求失败！');
				});

			wx.ready(function() {
				wx.getLocation({
					type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
					success: function(res) {
						var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
						var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
						myLocation = new AMap.LngLat(longitude, latitude);
						map.add(new AMap.Marker({
							position: myLocation,
							icon: new AMap.Icon({
								image: require("../theme/img/locate_blue.png"),
								imageSize: new AMap.Size(21, 30)
							})
						}));
						map.panTo(myLocation);
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

		//选择办事大厅并移动地图到选择的办事大厅
		$scope.click = function(index) {
			$scope.selectedIndex = index;
			selectedItem = $scope.bsdtData[index];
			if(marker != null) {
				map.remove(marker);
			}
			if(selectedItem.dx != null && selectedItem.dy != null) {
				marker = new AMap.Marker({
					position: new AMap.LngLat(selectedItem.dx, selectedItem.dy),
					icon: new AMap.Icon({
						image: require("../theme/img/locate_red.png"),
						imageSize: new AMap.Size(21, 30)
					})
				});
				map.add(marker);
				map.panTo([selectedItem.dx, selectedItem.dy]);
			} else {
				showAlert("暂无坐标信息");
			}
		}

		//确认选择
		$scope.admit = function() {
			if(selectedItem != null) {
				$wyyyService.bsdt = selectedItem;
				$rootScope.$broadcast('xzbsdt', {
					bsdt: selectedItem.officeName
				});
				$ionicHistory.goBack();
			} else {
				showAlert("请选择办事大厅");
			}
		}

		//返回
		$scope.goback = function() {
			$ionicHistory.goBack();
		}

		//提示对话框
		showAlert = function(msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		};
	}
]);