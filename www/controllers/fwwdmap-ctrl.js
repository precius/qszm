angular.module('fwwdmapCtrl', []).controller('fwwdmapCtrl', ["$scope", "ionicToast", "$state", "$stateParams", "$qyglService",
	function($scope, ionicToast, $state, $stateParams, $qyglService) {
		//初始化地图
		var map = new AMap.Map('container', {
			resizeEnable: true,
			zoom: 12
		});
		var endLng = null;
		var endLat = null;
		//选中的item
		var selectedItem = angular.fromJson($stateParams.jsonObj);
		if(selectedItem != null) {
			$scope.selectedOfficeName = selectedItem.officeName;
			$scope.selectedAddress = selectedItem.address;
			endLng = selectedItem.dx;
			endLat = selectedItem.dy;
		} else {
			$scope.selectedOfficeName = "";
			$scope.selectedAddress = "";
		}

		$qyglService.findByDjjg({
			djjg: county.code
		}).then(function(res) {
			if(res.success) {
				var bsdtData = angular.copy(res.data);
				addMarkers(bsdtData);
			} else {
				showAlert("获取办事大厅失败");
			}
		}, function(error) {
			showAlert("获取办事大厅失败");
		});

		function addMarkers(data) {
			if(data == null || data.length < 1) {
				showAlert("暂无坐标信息");
				return;
			}
			for(i = 0; i < data.length; i++) {
				if(data[i].dx == null || data[i].dx == "" || data[i].dy == null || data[i].dy == "") {
					continue;
				}
				var marker = new AMap.Marker({
					position: new AMap.LngLat(data[i].dx, data[i].dy),
					icon: new AMap.Icon({
						image: require("../theme/img/locate_red.png"),
						imageSize: new AMap.Size(21, 30)
					}),
					title: data[i].officeName,
					label: data[i].address
				});
				marker.on('click', function(e) {
					$scope.selectedOfficeName = e.target.getTitle();
					$scope.selectedAddress = e.target.getLabel();
					var position = e.target.getPosition();
					endLng = position.getLng();
					endLat = position.getLat();
					map.panTo(position);
					$scope.$apply();
				});
				map.add(marker);
			}
			if(selectedItem != null) {
				map.panTo([selectedItem.dx, selectedItem.dy]);
			}
		}

		//业务导航
		$scope.ywdh = function() {
			$state.go('bsdt');
		}

		$scope.guide = function() {
			var successCallback = function(message) {
				//do something
			};

			var errorCallback = function(message) {
				console.log(message);
			};

			AMapNavi.navigation({
					lng: endLng,
					lat: endLat
				}, 0 //导航类型，0为实时，1为模拟
				, successCallback, errorCallback);
		}

		showAlert = function(msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		};
	}
]);