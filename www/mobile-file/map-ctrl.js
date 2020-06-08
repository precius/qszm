angular.module('mapCtrl', []).controller('mapCtrl', ["$scope", "$stateParams", "$ionicHistory", "$state", "$ionicTabsDelegate", "$dictUtilsService",
	function($scope, $stateParams, $ionicHistory, $state, $ionicTabsDelegate, $dictUtilsService) {
		$scope.isShow = true;
		$scope.goback = function() {
			$ionicHistory.goBack(); //返回上一个页面
		}
		$scope.goto = function() {
			$state.go("bsdtxq", {
				"data": $scope.data
			}, {
				reload: true
			});
		}
		$scope.go = function() {
			$state.go('bsdt');
		}
		$scope.dataParam = $stateParams.data;
		$scope.data = [];
		$scope.dataBus = [];
		var map = new AMap.Map('containermap', {
			resizeEnable: true,
			zoom: 15 //级别
		});

		function loadMap() {
			if($scope.dataParam != undefined && $scope.dataParam.longitude != undefined && $scope.dataParam.longitude != null && $scope.dataParam.longitude != "") {
				var point = new AMap.LngLat($scope.dataParam.longitude, $scope.dataParam.latitude);
				// 创建点坐标  
				map.setZoomAndCenter(11, point);
				$scope.data.push($scope.dataParam);
			}
			map.setStatus({
				scrollWheel: true
			}); //开启鼠标滚轮缩放   
			AMapUI.loadUI(['misc/MarkerList', 'overlay/SimpleMarker', 'overlay/SimpleInfoWindow'],
				function(MarkerList, SimpleMarker, SimpleInfoWindow) {
					var defaultIconStyle = 'red', //默认的图标样式
						hoverIconStyle = 'green', //鼠标hover时的样式
						selectedIconStyle = 'purple' //选中时的图标样式
					;
					$scope.markerList = new MarkerList({
						map: map,
						//从数据中读取位置, 返回lngLat
						getPosition: function(item) {
							return [item.longitude, item.latitude];
						},
						//数据ID，如果不提供，默认使用数组索引，即index
						getDataId: function(item, index) {
							return item.id;
						},
						getInfoWindow: function(data, context, recycledInfoWindow) {
							return new AMap.InfoWindow({
								isCustom: true, //使用自定义窗体
								content: createInfoWindow(data.officeName, data.address),
								offset: new AMap.Pixel(16, -45)
							});
						},
						//构造marker用的options对象, content和title支持模板，也可以是函数，返回marker实例，或者返回options对象
						getMarker: function(data, context, recycledMarker) {
							return new AMap.Marker({
								position: point,
								icon: new AMap.Icon({
									size: new AMap.Size(40, 50), //图标的大小
									image: require("../theme/img/locate_red.png")
								})
							});
						},
						//marker上监听的事件
						markerEvents: ['click', 'mouseover', 'mouseout'],
						//makeSelectedEvents:false,
						selectedClassNames: 'selected',
						autoSetFitView: true
					});
					$scope.markerList.render($scope.data);
					$scope.markerListBus = new MarkerList({
						map: map,
						//从数据中读取位置, 返回lngLat
						getPosition: function(item) {
							return [item.longitude, item.latitude];
						},
						//数据ID，如果不提供，默认使用数组索引，即index
						getDataId: function(item, index) {
							return item.id;
						},
						getInfoWindow: function(data, context, recycledInfoWindow) {
							return new AMap.InfoWindow({
								isCustom: true, //使用自定义窗体
								content: createInfoWindow(data.name, data.address),
								offset: new AMap.Pixel(16, -45)
							});
						},
						//构造marker用的options对象, content和title支持模板，也可以是函数，返回marker实例，或者返回options对象
						getMarker: function(data, context, recycledMarker) {
							return new AMap.Marker({
								position: point,
								icon: new AMap.Icon({
									size: new AMap.Size(40, 50), //图标的大小
									image: require("../theme/img/locate_green.png")
								})
							});
						},
						//marker上监听的事件
						markerEvents: ['click', 'mouseover', 'mouseout'],
						//makeSelectedEvents:false,
						selectedClassNames: 'selected',
						autoSetFitView: true
					});
					//	            $scope.markerListBus.render($scope.dataBus);
				});
		}
		if(typeof(AMapUI) == "undefined" || typeof(AMap) == "undefined") {
			$.getScript("https://webapi.amap.com/ui/1.0/main.js?v=1.0.11").done(function(script, textstatus) {
				if(textstatus == "success" && typeof(AMapUI) != undefined && typeof(AMap) != undefined) {
					loadMap();
				}
			})
		} else {
			loadMap();
		}
		$scope.queryBsdtData = function(index) {
			$ionicTabsDelegate.select(index);
			$dictUtilsService.getBsdtData($scope, true, function(data) {
				$scope.data = data;
				$scope.markerList.render($scope.data);
			});
		}
		//	$scope.queryBsdtData(0)
		//构建自定义信息窗体   
		function createInfoWindow(officeName, address) {
			var info = document.createElement("div");
			info.className = "info";

			//可以通过下面的方式修改自定义窗体的宽高
			//info.style.width = "400px";
			// 定义左侧全景
			var leftAll = document.createElement("div");
			var leftImg = document.createElement("img");
			var leftText = document.createElement("p");
			leftText.innerHTML = '大厅'; //p节点显示的文字
			leftAll.className = "left-all";
			leftImg.src = require("../theme/img/btn_panorama.png");
			leftAll.onclick = $scope.go;

			leftAll.appendChild(leftImg);
			leftAll.appendChild(leftText);
			info.appendChild(leftAll);

			// 定义中部信息内容
			var middleAll = document.createElement("div");
			var middleTitle = document.createElement("p");
			middleTitle.innerHTML = officeName; //p节点显示的文字
			var middleContent = document.createElement("p");
			middleContent.innerHTML = address; //p节点显示的文字
			middleAll.className = "info-middle";
			middleTitle.className = "middle-title";
			middleAll.onclick = $scope.goto;

			middleAll.appendChild(middleTitle);
			middleAll.appendChild(middleContent);
			info.appendChild(middleAll);

			// 定义右侧导航
			var rightAll = document.createElement("div");
			var rightButton = document.createElement("button");
			rightButton.innerHTML = '导航';
			rightAll.className = "info-right";

			rightAll.appendChild(rightButton);
			info.appendChild(rightAll);

			return info;
		}
		AMap.plugin('AMap.PlaceSearch', function() {
			$scope.search = function(keyword, index) {
				$ionicTabsDelegate.select(index);
				var center = map.getCenter();
				var placeSearch = new AMap.PlaceSearch({});
				placeSearch.searchNearBy(keyword, center, 50000, function(status, result) {
					var statusTemp = status;
					var resultTemp = result;
					$scope.dataBus = [];
					if(status == "complete") {
						var dataTemp = result.poiList.pois;
						for(var i = 0; i < dataTemp.length; i++) {
							var dx = dataTemp[i].location.lng;
							var dy = dataTemp[i].location.lat;
							var name = dataTemp[i].name;
							var address = dataTemp[i].address;
							if(dx != null && dx != "" && dy != null && dy != "") {
								$scope.dataBus.push({
									latitude: dy,
									longitude: dx,
									"name": name,
									"address": address
								});
							}
						}
						$scope.markerListBus.render($scope.dataBus);
					}
				});
			}
		});
	}
]);