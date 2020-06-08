angular.module('mapCtrl', []).controller('mapCtrl', ["$scope", "ionicToast", "$rootScope", "$ionicHistory", "$state", "$addressService", "$ionicTabsDelegate", "$dictUtilsService",
	function($scope, ionicToast, $rootScope, $ionicHistory, $state, $addressService, $ionicTabsDelegate, $dictUtilsService) {
		$scope.isShow = true;
		$scope.goback = function() {
			$ionicHistory.goBack(); //返回上一个页面
		};
		$scope.goto = function() {
			$state.go("bsdtxq", {
				"data": $scope.data
			}, {
				reload: true
			});
		};
		$scope.go = function() {
			$state.go('bsdt');
		};
		//关闭地图页面提示框
		$scope.closeAlert = function() {
			$scope.isShow = false;
		};
		$scope.showSelectedAlert = function() {
			$scope.showAlert("请在地图上选中一个办事大厅再进行操作");
		}

		//导航
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

		//根据关键字综合搜索办事大厅
		$scope.search = function() {
			$scope.isSelected = false;
			$addressService.getBsdtByKey({
				jgmc: $scope.policyQuery.title,
				officeName: $scope.policyQuery.title
			}).then(function(res) {
				var resTemp = res;
				if(res.success) {
					dataTemp = res.data;
					if(dataTemp.length == 0) {
						$scope.showAlert("未查询到办事大厅");
					} else {
						$scope.data = $dictUtilsService.parseBsdtData(dataTemp, $scope);
					}
					console.log($scope.data);
					window.markerList.render($scope.data);
				} else {
					$scope.showAlert("获取办事大厅失败");
				}
			}, function(error) {
				$scope.showAlert("获取办事大厅失败");
			});
		}
		//根据我的预约的办理地点定位
		$scope.locateByAddress = function() {
			$scope.isSelected = false;
			$addressService.getBsdtByJgmcAndOfficeName({
				jgmc: $addressService.jgmc,
				officeName: $addressService.officeName
			}).then(function(res) {
				if(res.success) {
					$scope.data.push({
						address: res.data.address,
						latitude: res.data.dy,
						longitude: res.data.dx,
						officeName: res.data.officeName
					})
					console.log($scope.data);
					window.markerList.render($scope.data);
				} else {
					$scope.showAlert("获取办事大厅失败");
				}
			}, function(error) {
				$scope.showAlert("获取办事大厅失败");
			});
		}
		//定位
		$scope.locate = function() {
			map.plugin('AMap.Geolocation', function() {
				var geolocation = new AMap.Geolocation({
					enableHighAccuracy: true, //是否使用高精度定位，默认:true
					timeout: 10000, //超过10秒后停止定位，默认：无穷大
					buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
					zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
					buttonPosition: 'RB'
				});
				map.addControl(geolocation);
				geolocation.getCurrentPosition();
				AMap.event.addListener(geolocation, 'complete', onComplete); //返回定位信息
				AMap.event.addListener(geolocation, 'error', onError); //返回定位出错信息
			});
		}
		$scope.zoomOut = function() {
			map.setZoom(map.getZoom() + 1);
		}
		$scope.zoomIn = function() {
			map.setZoom(map.getZoom() - 1);
		}
		//提示对话框
		$scope.showAlert = function(msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		};
		//信息元素是否被选中
		$scope.isSelected = false;
		//被选中的信息元素值
		$scope.dataSelected = {};
		//信息元素列表值
		$scope.data = [];
		//综合搜索条件
		$scope.policyQuery = {
			title: ""
		}
		var map = new AMap.Map('containermap', {
			resizeEnable: true,
			zoom: 15 //级别
		});

		$scope.queryBsdtDataNew = function() {
			//		$ionicTabsDelegate.select(index);
			$scope.isSelected = false;
			$scope.data = [];
			window.markerList.render($scope.data);
			$dictUtilsService.getBsdtData($scope, true, function(data) {
				$scope.data = data;
				window.markerList.render($scope.data);
			});
		};
		//判断是否需要加载，首次进入需要加载
		$scope.needLoad = true;
		$rootScope.$on('on-map', function(event, args) {
			//重新设置区县
			if(args.index == 0) {
				$scope.setSelectedData(args.data);
				$scope.isSelected = true;
				$scope.isShow = false;
			} else if(args.index == 1) {
				$scope.isSelected = false;
				$scope.needLoad = false;
				$scope.isShow = true;
				$scope.queryBsdtDataNew();
			}
		});
		$scope.setSelectedData = function(selectedDataTemp) {
			$scope.dataSelected = selectedDataTemp;
		}

		var endLng;
		var endLat;

		/**
		 * 加载地图同时将查询出来的办事大厅信息点显示在地图上
		 */
		function loadMap() {
			map.setStatus({
				scrollWheel: true
			}); //开启鼠标滚轮缩放 
			AMapUI.loadUI(['misc/MarkerList', 'overlay/SimpleMarker', 'overlay/SimpleInfoWindow'],
				function(MarkerList, SimpleMarker, SimpleInfoWindow) {
					markerList = new MarkerList({
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
								//					        content: createInfoWindow(data.officeName,data.address),
								offset: new AMap.Pixel(56, -45)
							});
						},
						//构造marker用的options对象, content和title支持模板，也可以是函数，返回marker实例，或者返回options对象
						getMarker: function(data, context, recycledMarker) {
							return new AMap.Marker({
								position: new AMap.LngLat(data.longitude, data.latitude),
								icon: new AMap.Icon({
									image: require("../theme/img/locate_red.png"),
									imageSize: new AMap.Size(21, 30)
								})
							});
						},
						//marker上监听的事件
						markerEvents: ['click', 'mouseover', 'mouseout'],
						//makeSelectedEvents:false,
						selectedClassNames: 'selected',
						autoSetFitView: true,
					});
					window.markerList = markerList;
					//获取办事大厅信息点
					$scope.queryBsdtData = function(index) {
						$ionicTabsDelegate.select(index);
						$dictUtilsService.getBsdtData($scope, true, function(data) {
							$scope.data = data;
							window.markerList.render($scope.data);
						});
					};
					if($scope.needLoad) {
						$scope.queryBsdtData(0);
					}
					if($addressService.jgmc != '' && $addressService.officeName != '') {
						console.log(1);
						$scope.locateByAddress();
					}
					//markerList选中事件
					window.markerList.on('selectedChanged', function(event, info) {
						if(info.selected) {
							if(info.selected.marker) {
								//更新为选中样式
								info.selected.marker.setIcon(new AMap.Icon({
									imageSize: new AMap.Size(31, 44), //图标的大小
									size: new AMap.Size(31, 44), //图标的大小
									image: require("../theme/img/locate_red_selected.png"),
								}));
								$rootScope.$broadcast('on-map', {
									index: 0,
									"data": info.selected.data
								});
								$scope.$apply();
							}

							//选中并非由列表节点上的事件触发，将关联的列表节点移动到视野内
							if(!info.sourceEventInfo.isListElementEvent) {

								if(info.selected.listElement) {
									scrollListElementIntoView($(info.selected.listElement));
								}
							}
						}
						map.setZoomAndCenter(17, new AMap.LngLat(info.selected.data.longitude, info.selected.data.latitude - 0.0005));
						endLat = info.selected.data.latitude;
						endLng = info.selected.data.longitude;
						if(info.unSelected && info.unSelected.marker) {
							//更新为默认样式
							info.unSelected.marker.setIcon(new AMap.Icon({
								imageSize: new AMap.Size(21, 30), //图标的大小
								image: require("../theme/img/locate_red.png")
							}));
						}
					});

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
	}
]);