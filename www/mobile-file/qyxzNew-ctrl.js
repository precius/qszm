angular.module('qyxzCtrl', []).controller('qyxzCtrl', ["$scope", "$ionicHistory", "$addressService", "$state", "$qyglService", "$stateParams", "$wyyyService", "$dictUtilsService", "$rootScope", "$ionicScrollDelegate", "$menuService", "ionicToast",
	function($scope, $ionicHistory, $addressService, $state, $qyglService, $stateParams, $wyyyService, $dictUtilsService, $rootScope, $ionicScrollDelegate, $menuService, ionicToast) {
		$scope.hIndex = (window.screen.height - 44) / 26; //右边侧边栏每个字母的高度，是屏幕高度减去标题栏的44，减去页面样式中的margin-top:2px，margin-bottom:2px,再除以26，这样以保证在各个手机屏幕上的字母的距离的均等性
		var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		$scope.indexs = [];
		//省份数据
		$scope.datalist = [];
		for(var i = 0; i < chars.length; i++) {
			$scope.indexs.push(chars.charAt(i)); //获取字母数组
			$scope.datalist.push({
				"initData": chars.charAt(i),
				"datas": []
			});
		}
		$scope.mTouch = function(c) {
			$scope.showMiddle = true;
			$scope.hint = c;
			var a = document.getElementById($scope.hint);
			var scroll = a.offsetTop - $ionicScrollDelegate.getScrollPosition().top;
			$ionicScrollDelegate.scrollBy(0, scroll, false); //方式一
		};

		$scope.goback = function() {
			//			$scope.showAlert( "请选择省市区或者办事大厅！");
			$ionicHistory.goBack(); //返回上一个页面
		};
		//是否显示办事大厅
		if($stateParams.id == 2 || $stateParams.id == 3) {
			$scope.isShowBsdt = false;
		} else {
			$scope.isShowBsdt = true;
		}
		//返回到甘肃省
		$scope.backToProvince = function() {
			var province = {
				title: '甘肃省',
				code: '620000',
				areaType: '2',
				id: "466519d314b94571a39681096de5e30f"
			};
			var city = {
				title: '',
				code: '',
				areaType: '3',
				id: ""
			};
			var county = {
				title: '',
				code: '',
				areaType: '4',
				id: ""
			};
			$scope.city = city.title;
		};
		//获取市
		$scope.cityDatas = [];
		//获取县
		$scope.countyDatas = [];
		//获取城市列表
		$scope.queryCityDatas = function() {
			if(province.id != undefined && province.id != null && province.id != "") {
				provinceId = province.id;
			} else {
				provinceId = "466519d314b94571a39681096de5e30f";
			}
			$addressService.getArea({
					areaId: provinceId
				})
				.then(function(response) {
					$scope.cityDatas = angular.copy(response.data);
					$scope.setSelectedCity();
				}, function(error) {
					$scope.showAlert("请求失败");
				});
		};
		//设置默认城市
		$scope.setSelectedCity = function() {
			if(city.id != undefined && city.id != null && city.id != "") {
				if($scope.cityDatas != undefined && $scope.cityDatas.length > 0) {
					for(var i = 0; i < $scope.cityDatas.length; i++) {
						var cityTemp = $scope.cityDatas[i];
						if(cityTemp.id == city.id) {
							$scope.selectCity(cityTemp);
							break;
						}
					}
				}
			}
		}
		$scope.queryCityDatas(province.id);
		//提示对话框
		$scope.showAlert = function(msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		};
		$scope.city = {};
		//选择城市
		$scope.selectCity = function(item) {
			$scope.bsdtData = [];
			$scope.bsdt = {};
			$scope.isShow = !$scope.isShow;
			$addressService.getArea({
					areaId: item.id
				})
				.then(function(response) {
					$scope.countyDatas = angular.copy(response.data);
				}, function(error) {
					$scope.showAlert("请求失败");
				});
			$scope.city = item;
			//全局变量城市赋值
			city = item;
			$scope.setSelectedCounty();
		}
		//设置默认区县
		$scope.setSelectedCounty = function() {
			if(county.code != undefined && county.code != null && county.code != "") {
				if($scope.countyDatas != undefined && $scope.countyDatas.length > 0) {
					for(var i = 0; i < $scope.countyDatas.length; i++) {
						var countyTemp = $scope.countyDatas[i];
						if(countyTemp.code == county.code) {
							$scope.selectCounty(countyTemp, false);
							break;
						}
					}
				}
			}
		}
		//选择区县
		$scope.selectCounty = function(item, isClick) {
			$scope.bsdtData = [];
			$scope.bsdt = {};
			$scope.setUnClick();
			item.isClick = true;
			$scope.queryBsdtData(item.id);
			county = item;
			$menuService.code = item.code;
			//根据区域代码获取菜单树
			$menuService.getmenu({
					areaCode: item.code
				})
				.then(function(res) {
					if(res.success) {
						console.log(res);
						$menuService.data = res.data;
						$menuService.bsdt = $scope.bsdt;
						$wyyyService.bsdt = $scope.bsdt;
						if(res.data != null && res.data.length > 0) {
							$addressService.isOnline = true;
							for(var i = 0; i < res.data.length; i++) {
								if(res.data[i].code === "IEBDC:GH") {
									$menuService.permission[0] = true;
									$menuService.ghindex = i;
								} else if(res.data[i].code === "IEBDC:DY") {
									$menuService.permission[1] = true;
									$menuService.dyindex = i;
								} else if(res.data[i].code === "IEBDC:BG") {
									$menuService.permission[2] = true;
									$menuService.bgindex = i;
								} else if(res.data[i].code === "IEBDC:BB") {
									$menuService.permission[3] = true;
									$menuService.bbindex = i;
								} else if(res.data[i].code === "IEBDC:GZ") {
									$menuService.permission[4] = true;
									$menuService.gzindex = i;
								} else if(res.data[i].code === "IEBDC:CX") {
									$menuService.permission[5] = true;
									$menuService.cxindex = i;
								}
							}
						} else {
							$addressService.isOnline = false;
						}
					}
				}, function(res) {
					$scope.showAlert(res.message);
				});
			//根据区域及用户ID重新获取权限
			$dictUtilsService.getPermByAreaCode($rootScope, $scope);
			//办事指南跳转
			if($stateParams.id == 2 && isClick) {
				//				$state.go('tab.service',{},{reload:true,cache:false});
				console.log(item);
				city.code = item.code;
				console.log(city);
				$ionicHistory.goBack();
				$state.go('tab.bszn', {}, {
					reload: true,
					cache: false
				});
			}

			//首页跳转
			else if($stateParams.id == 3 && isClick) {
				$state.go('tab.home', {}, {
					reload: true,
					cache: false
				});
			}
			$rootScope.$broadcast('to-home', {});
		}
		//将其他县设置为没有点击
		$scope.setUnClick = function() {
			if($scope.countyDatas != null && $scope.countyDatas.length > 0) {
				for(var i = 0; i < $scope.countyDatas.length; i++) {
					var item = $scope.countyDatas[i];
					item.isClick = false;
				}
			}
		}
		$scope.isShow = true;
		$scope.onClickDistrict = function() {
			$scope.isShow = !$scope.isShow;
		};
		//办事大厅
		//根据区县获取办事大厅
		$scope.bsdtData = [];
		$scope.bsdt = {
			officeName: ""
		};
		$scope.queryBsdtData = function(areaId) {
			//获取办理网点（办事大厅）
			$qyglService.queryWorkOffice({
				areaId: areaId
			}).then(function(res) {
				if(res.success) {
					$scope.bsdtData = angular.copy(res.data);
					$scope.unClickBsdt();
					//初始化办事大厅
					if($scope.bsdtData.length > 0) {
						$scope.bsdt = $scope.bsdtData[0];
						$scope.checkBsdt($scope.bsdt.officeName);
					}
				}
			}, function(error) {});
		};
		//当前选择办事大厅
		$scope.checkBsdt = function(bsdtStr) {
			$scope.unClickBsdt();
			for(var i = 0; i < $scope.bsdtData.length; i++) {
				if(bsdtStr === $scope.bsdtData[i].officeName) {
					$scope.bsdtData[i].isClick = true;
					$scope.bsdt = $scope.bsdtData[i];
					console.log("办事大厅：");
					console.log($scope.bsdt);
				}
			}
		}
		//设置办事大厅没有选中
		$scope.unClickBsdt = function() {
			if($scope.bsdtData != null && $scope.bsdtData.length > 0) {
				for(var i = 0; i < $scope.bsdtData.length; i++) {
					var bsdt = $scope.bsdtData[i];
					bsdt.isClick = false;
				}
			}
		}
		$scope.isShowWyyy = true;
		$scope.showWyyy = function() {
			if($dictUtilsService.isCertification()) {
				$scope.isShowWyyy = permissionInfoApps[1].isShow;
			} else if($dictUtilsService.isLogin()) {
				$scope.isShowWyyy = permissionInfoApps[0].isShow;
			} else {
				$scope.isShowWyyy = permissionInfoApps[2].isShow;
			}
		}

		//获取省份列表
		function getProvince() {
			$addressService.getArea({})
				.then(function(response) {
					$scope.provinces = angular.copy(response.data);
					for(var i = 0; i < $scope.provinces.length; i++) {
						if($scope.provinces[i].code === "340000") {
							$scope.datalist[0].datas.push({
								"province": $scope.provinces[i].title,
								"id": $scope.provinces[i].id
							});
						};
						if($scope.provinces[i].code === "620000") {
							$scope.datalist[6].datas.push({
								"province": $scope.provinces[i].title,
								"id": $scope.provinces[i].id
							});
						};
						if($scope.provinces[i].code === "450000") {
							$scope.datalist[6].datas.push({
								"province": $scope.provinces[i].title,
								"id": $scope.provinces[i].id
							});
						};
						if($scope.provinces[i].code === "110000") {
							$scope.datalist[9].datas.push({
								"province": $scope.provinces[i].title,
								"id": $scope.provinces[i].id
							});
						};
						if($scope.provinces[i].code === "350000") {
							$scope.datalist[5].datas.push({
								"province": $scope.provinces[i].title,
								"id": $scope.provinces[i].id
							});
						};
						if($scope.provinces[i].code === "440000") {
							$scope.datalist[6].datas.push({
								"province": $scope.provinces[i].title,
								"id": $scope.provinces[i].id
							});
						};
						if($scope.provinces[i].code === "460000") {
							$scope.datalist[7].datas.push({
								"province": $scope.provinces[i].title,
								"id": $scope.provinces[i].id
							});
						};
						if($scope.provinces[i].code === "130000") {
							$scope.datalist[7].datas.push({
								"province": $scope.provinces[i].title,
								"id": $scope.provinces[i].id
							});
						};
						if($scope.provinces[i].code === "520000") {
							$scope.datalist[6].datas.push({
								"province": $scope.provinces[i].title,
								"id": $scope.provinces[i].id
							});
						};
						if($scope.provinces[i].code === "420000") {
							$scope.datalist[7].datas.push({
								"province": $scope.provinces[i].title,
								"id": $scope.provinces[i].id
							});
						};
						if($scope.provinces[i].code === "230000") {
							$scope.datalist[7].datas.push({
								"province": $scope.provinces[i].title,
								"id": $scope.provinces[i].id
							});
						};
						if($scope.provinces[i].code === "410000") {
							$scope.datalist[7].datas.push({
								"province": $scope.provinces[i].title,
								"id": $scope.provinces[i].id
							});
						};
						if($scope.provinces[i].code === "430000") {
							$scope.datalist[7].datas.push({
								"province": $scope.provinces[i].title,
								"id": $scope.provinces[i].id
							});
						};
						if($scope.provinces[i].code === "220000") {
							$scope.datalist[9].datas.push({
								"province": $scope.provinces[i].title,
								"id": $scope.provinces[i].id
							});
						};
						if($scope.provinces[i].code === "320000") {
							$scope.datalist[9].datas.push({
								"province": $scope.provinces[i].title,
								"id": $scope.provinces[i].id
							});
						};
						if($scope.provinces[i].code === "210000") {
							$scope.datalist[11].datas.push({
								"province": $scope.provinces[i].title,
								"id": $scope.provinces[i].id
							});
						};
						if($scope.provinces[i].code === "360000") {
							$scope.datalist[9].datas.push({
								"province": $scope.provinces[i].title,
								"id": $scope.provinces[i].id
							});
						};
						if($scope.provinces[i].code === "640000") {
							$scope.datalist[11].datas.push({
								"province": $scope.provinces[i].title,
								"id": $scope.provinces[i].id
							});
						};
						if($scope.provinces[i].code === "630000") {
							$scope.datalist[16].datas.push({
								"province": $scope.provinces[i].title,
								"id": $scope.provinces[i].id
							});
						};
						if($scope.provinces[i].code === "370000") {
							$scope.datalist[18].datas.push({
								"province": $scope.provinces[i].title,
								"id": $scope.provinces[i].id
							});
						};
						if($scope.provinces[i].code === "140000") {
							$scope.datalist[18].datas.push({
								"province": $scope.provinces[i].title,
								"id": $scope.provinces[i].id
							});
						};
						if($scope.provinces[i].code === "310000") {
							$scope.datalist[18].datas.push({
								"province": $scope.provinces[i].title,
								"id": $scope.provinces[i].id
							});
						};
						if($scope.provinces[i].code === "510000") {
							$scope.datalist[18].datas.push({
								"province": $scope.provinces[i].title,
								"id": $scope.provinces[i].id
							});
						};
						if($scope.provinces[i].code === "610000") {
							$scope.datalist[18].datas.push({
								"province": $scope.provinces[i].title,
								"id": $scope.provinces[i].id
							});
						};
						if($scope.provinces[i].code === "650000") {
							$scope.datalist[23].datas.push({
								"province": $scope.provinces[i].title,
								"id": $scope.provinces[i].id
							});
						};
						if($scope.provinces[i].code === "530000") {
							$scope.datalist[24].datas.push({
								"province": $scope.provinces[i].title,
								"id": $scope.provinces[i].id
							});
						};
						if($scope.provinces[i].code === "120000") {
							$scope.datalist[19].datas.push({
								"province": $scope.provinces[i].title,
								"id": $scope.provinces[i].id
							});
						};
						if($scope.provinces[i].code === "540000") {
							$scope.datalist[23].datas.push({
								"province": $scope.provinces[i].title,
								"id": $scope.provinces[i].id
							});
						};
						if($scope.provinces[i].code === "500000") {
							$scope.datalist[2].datas.push({
								"province": $scope.provinces[i].title,
								"id": $scope.provinces[i].id
							});
						};
						if($scope.provinces[i].code === "810000") {
							$scope.datalist[23].datas.push({
								"province": $scope.provinces[i].title,
								"id": $scope.provinces[i].id
							});
						};
						if($scope.provinces[i].code === "820000") {
							$scope.datalist[0].datas.push({
								"province": $scope.provinces[i].title,
								"id": $scope.provinces[i].id
							});
						};
						if($scope.provinces[i].code === "710000") {
							$scope.datalist[19].datas.push({
								"province": $scope.provinces[i].title,
								"id": $scope.provinces[i].id
							});
						};
						if($scope.provinces[i].code === "330000") {
							$scope.datalist[25].datas.push({
								"province": $scope.provinces[i].title,
								"id": $scope.provinces[i].id
							});
						};
						if($scope.provinces[i].code === "150000") {
							$scope.datalist[13].datas.push({
								"province": $scope.provinces[i].title,
								"id": $scope.provinces[i].id
							});
						};
						if($scope.provinces[i].code === "310000") {
							$scope.datalist[18].datas.push({
								"province": $scope.provinces[i].title,
								"id": $scope.provinces[i].id
							});
						};
					}
				}, function(error) {
					$scope.showAlert("请求失败");
				});
		}
		getProvince();

		$scope.getCity = function(item) {
			province = item;
			$scope.isShow = true;
			county.id = "";
			$addressService.getArea({
					areaId: item.id
				})
				.then(function(response) {
					$scope.cityDatas = angular.copy(response.data);
					$scope.countyDatas = [];
					$scope.setSelectedCity();
					$ionicScrollDelegate.$getByHandle('toTop').scrollTop();
				}, function(error) {
					$scope.showAlert("请求失败");
				});
		}

		//下一步
		$scope.nextStep = function() {
			$scope.showWyyy();
			//预约
			if($stateParams.id == 0 && $scope.bsdt != undefined && $scope.bsdt.officeName != undefined && $scope.bsdt.officeName != "") {
				//当前区域没有预约权限
				if($scope.isShowWyyy == false) {
					$scope.showAlert("当前区域没有预约权限");
				} else {
					$wyyyService.bsdt = $scope.bsdt;
					$state.go('yysx');
				}
			}
			//申请
			else if($scope.bsdt != undefined && $scope.bsdt.officeName != undefined && $scope.bsdt.officeName != "") {
				//当前区域没有预约权限
				if(permissionInfoApps[3].isShow == false) {
					$scope.showAlert("当前区域没有申请权限");
				} else {
					$state.go('djsxxz', {
						"bsdt": $scope.bsdt
					}, {
						reload: true
					})
				}
			} else {
				$scope.showAlert("请选择办事大厅");
			}
		}
	}
]);