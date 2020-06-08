//预约列表控制器
angular.module('djyyCtrl', ['ionic']).controller('djyyCtrl', ["$scope", "ionicToast", "$ionicHistory", "$ionicPopup", "$wyyyService", "$state", "$dictUtilsService", "$ionicLoading", "$addressService", "$wysqService",
	function($scope, ionicToast, $ionicHistory, $ionicPopup, $wyyyService, $state, $dictUtilsService, $ionicLoading, $addressService, $wysqService) {
		$scope.goback = function() {
			$ionicHistory.goBack(); //返回上一个页面
		};
		if(platform == "weixin") {
			$scope.showBack = true;
		} else {
			$scope.showBack = true;
		}
		var wechatPermission = false;

		if(platform == "weixin") {
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
			});

			wx.error(function() {
				showAlert("签名失败");
				getData();
			});
		}
		//提示对话框
		$scope.showAlert = function(msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		};

		$scope.show = function(title) {
			$ionicLoading.show({
				template: '<ion-spinner icon="lines" class="spinner-calm"></ion-spinner><p>' + title + '</p>'
			});
		};

		$scope.hide = function() {
			$ionicLoading.hide();
		};
		//获取列表参数
		$scope.djyy1 = [];
		var sendParam = {
			nCurrent: 0,
			nSize: 10,
			userId:mongoDbUserInfo.id
		};
		//获取预约列表
		queryDjyyData = function(isRefresh) {
			//		$scope.show("正在获取预约列表信息");
			if(isRefresh) {
				$scope.djyy1 = [];
				sendParam.nCurrent = 0;
			}
			$wyyyService.djyyList(sendParam)
				.then(function(response) {
					if(response.success) {
						var result = angular.copy(response.data);
						var djyy1 = result.page;
						console.log(djyy1);
						if(djyy1 != null && djyy1.length > 0) {
							for(var i = 0; i < djyy1.length; i++) {

								var weekday = new Date(djyy1[i].yysj).getDay(); //表示星期几
								//换算时间格式
								djyy1[i].yysj = $dictUtilsService.getFormatDate(new Date(djyy1[i].yysj), "yyyy-MM-dd");

								var currentTime = new Date().getTime(); //当前毫秒时间
								var tomorrowTime = currentTime + 24 * 60 * 60 * 1000; //24小时后的毫秒时间
								var afterTomorrowTime = currentTime + 48 * 60 * 60 * 1000; //48小时后的毫秒时间

								var today = $dictUtilsService.getFormatDate(new Date(), "yyyy-MM-dd"); //今天的日期 ，格式为：yyyy-MM-dd
								var tomorrow = $dictUtilsService.getFormatDate(new Date(tomorrowTime), "yyyy-MM-dd"); //明天的日期 ，格式为：yyyy-MM-dd
								var afterTomorrow = $dictUtilsService.getFormatDate(new Date(afterTomorrowTime), "yyyy-MM-dd"); //后天的日期 ，格式为：yyyy-MM-dd

								if(today == djyy1[i].yysj) {
									djyy1[i].week = '今 天';
								} else if(tomorrow == djyy1[i].yysj) {
									djyy1[i].week = '明 天';
								} else if(afterTomorrow == djyy1[i].yysj) {
									djyy1[i].week = '后 天';
								} else {
									switch(weekday) {
										case 0:
											djyy1[i].week = '星期日';
											break;
										case 1:
											djyy1[i].week = '星期一';
											break;
										case 2:
											djyy1[i].week = '星期二';
											break;
										case 3:
											djyy1[i].week = '星期三';
											break;
										case 4:
											djyy1[i].week = '星期四';
											break;
										case 5:
											djyy1[i].week = '星期五';
											break;
										case 6:
											djyy1[i].week = '星期六';
											break;
									}
								}

							}
							$scope.djyy1 = $scope.djyy1.concat(djyy1);
							if(isRefresh) {
								$scope.isShow = false;
								$scope.hasValue = true;
							}
						} else {
							if(isRefresh) {
								$scope.isShow = true;
							}
							$scope.hasValue = false;
						}
						sendParam.nCurrent = sendParam.nCurrent + 1;
					}
					$scope.$broadcast('scroll.refreshComplete');
					$scope.$broadcast('scroll.infiniteScrollComplete');
					//				$scope.hide();
				}, function(error) {
					$scope.$broadcast('scroll.refreshComplete');
					$scope.$broadcast('scroll.infiniteScrollComplete');
					$scope.showAlert("请求失败");
					//				$scope.hide();
				});
		};

		//删除预约
		$scope.delete = function(item) {
			showCancelConfirm(item.yybh);
		}

		//详细信息
		$scope.checkDjyy = function(item) {
			$state.go('djyy-detail', {
				'yybh': item.yybh
			});
		}
		/**
		 * 微信定位办理地点,首先通过登记机构名称和办事大厅查询办事大厅信息
		 */
		weixinLocation = function(jgmc, officeName) {
			$addressService.getBsdtByJgmcAndOfficeName({
				'jgmc': jgmc,
				'officeName': officeName
			}).then(function(res) {
				if(res.success) {
					var item = res.data;
					if(item.dx == null || item.dx == "" || item.dy == null || item.dy == "") {
						$scope.showAlert("该大厅暂无坐标信息");
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
					$scope.showAlert("获取办事大厅失败");
				}
			}, function(error) {
				$scope.showAlert("获取办事大厅失败");
			});
		}
		//跳转到地址导航页
		$scope.gotoaddress = function(item) {
			if(platform == "mobile") {
				$addressService.jgmc = item.yyjg;
				$addressService.officeName = item.yybsdt;
				$state.go('map');
			} else if(platform == "weixin" && wechatPermission) {
				weixinLocation(item.yyjg, item.yybsdt);
			}
		}

		showCancelConfirm = function(item) {
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
						yybh: item
					};
					$wyyyService.cancelWdyy(param).then(function(response) {
						if(response.success) {
							queryDjyyData();
							$scope.showAlert('取消成功');
						}
					}, function(error) {
						$scope.showAlert('取消失败');
					});
				}
			});
		}
		/**
		 * 实现下拉刷新，上拉加载更多
		 */
		$scope.hasValue = true;
		$scope.doRefresh = function() {
			queryDjyyData(true);
		};

		$scope.hasMore = function() {
			return $scope.hasValue;
		}

		$scope.loadMore = function() {
			if(sendParam.nCurrent == 0) {
				queryDjyyData(true)
			} else {
				queryDjyyData(false);
			}
		}
	}
]);