angular.module('qyxzCtrl', []).controller('qyxzCtrl', ["$scope", "$ionicHistory", "$addressService", "$state", "$stateParams", "$wyyyService", "$dictUtilsService", "$rootScope", "$ionicScrollDelegate", "$menuService", "ionicToast",
	function($scope, $ionicHistory, $addressService, $state, $stateParams, $wyyyService, $dictUtilsService, $rootScope, $ionicScrollDelegate, $menuService, ionicToast) {
		$scope.cityCounty = {
			"title": ""
		};
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
		//获取市
		$scope.cityDatas = [];
		//获取县
		$scope.countyDatas = [];
		//提示对话框
		$scope.showAlert = function(msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		};
		$scope.city = {};
		//将其他县设置为没有点击
		$scope.setUnClick = function() {
			if($scope.countyDatas != null && $scope.countyDatas.length > 0) {
				for(var i = 0; i < $scope.countyDatas.length; i++) {
					var item = $scope.countyDatas[i];
					item.isClick = false;
				}
			}
		}
		$scope.isShow = false;
		$scope.onClickDistrict = function() {
			$scope.isShow = !$scope.isShow;
		};
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
		//获取城市和区县列表进行分组
		function getCityAndCounty(data) {
			if(data != undefined && data != null && data.length > 0) {
				for(var i = 0; i < data.length; i++) {
					var province = data[i];
					//当前省下面所有的市
					var childrens = province.childrens;
					if(childrens != undefined && childrens != null && childrens.length > 0) {
						for(var j = 0; j < childrens.length; j++) {
							var city = childrens[j];
							if($scope.datalist != undefined && $scope.datalist != null && $scope.datalist.length > 0) {
								for(var x = 0; x < $scope.datalist.length; x++) {
									var charData = $scope.datalist[x];
									//城市的title第一个字母进行匹配
									var firstChar = pinyin.getCamelChars(city.title).substr(0, 1);
									if(charData.initData == firstChar) {
										//										charData.datas.push(city);//是否加上城市一级
										break;
									}
								}
							}
							//当前城市下所有的区县
							var cityChildrens = city.childrens;
							if(cityChildrens != undefined && cityChildrens != null && cityChildrens.length > 0) {
								for(var y = 0; y < cityChildrens.length; y++) {
									var county = cityChildrens[y];
									for(var z = 0; z < $scope.datalist.length; z++) {
										var charData = $scope.datalist[z];
										//城市的title第一个字母进行匹配
										var firstChar = pinyin.getCamelChars(county.title).substr(0, 1);
										if(charData.initData == firstChar) {
											charData.datas.push(county);
											break;
										}
									}
								}
							}
						}
					}
				}
			}
		};
		if(areaTree.length > 0) {
			getCityAndCounty(areaTree);
		}

		function copyArray(array, city) {
			var newArray = [];
			//			newArray.push(city);//是否将市本级加入进去
			if(array != undefined && array != null && array.length > 0) {
				for(var i = 0; i < array.length; i++) {
					var object = array[i];
					newArray.push(object);
				}
			}
			if(newArray != undefined && newArray != null && newArray.length > 0) {
				for(var j = 0; j < newArray.length; j++) {
					var object = newArray[j];
					object.showTitle = object.title;
					if(object.areaType == "3") {
						object.showTitle = "全城";
					}
				}
			}
			return newArray;
		}
		//根据区县代码获取当前区县所在的市
		function getCity(countyCode, data) {
			var cityTemp = null;
			if(data != undefined && data != null && data.length > 0) {
				var isThisCity = false;
				for(var i = 0; i < data.length; i++) {
					var province = data[i];
					//当前省下面所有的市
					var childrens = province.childrens;
					if(childrens != undefined && childrens != null && childrens.length > 0) {
						for(var j = 0; j < childrens.length; j++) {
							var city = childrens[j];
							//当前城市下所有的区县
							var cityChildrens = city.childrens;
							if(cityChildrens != undefined && cityChildrens != null && cityChildrens.length > 0) {
								for(var y = 0; y < cityChildrens.length; y++) {
									var county = cityChildrens[y];
									if(countyCode == county.code) {
										isThisCity = true;
										break;
									}
								}
							}
							if(isThisCity) {
								cityTemp = city;
								break;
							}
						}
					}
					if(isThisCity) {
						break;
					}
				}
			}
			return cityTemp;
		};
		$scope.selectCityCounty = function(cityCounty, isClick) {
			if(cityCounty != undefined && cityCounty.code != undefined && cityCounty.code != null) {
				//如果选择的是城市，则直接获取城市下面的区县作为区县集合
				if(cityCounty.childrens != undefined && cityCounty.childrens.length > 0) {
					$scope.countyDatas = copyArray(cityCounty.childrens, cityCounty);
					$scope.cityCounty = cityCounty;
					city = cityCounty;
					county = cityCounty;
				} else {
					//如果选择的是区县，首先获取区县所在的城市，然后获取当前城市下的区县集合
					var cityTemp = getCity(cityCounty.code, areaTree);
					$scope.countyDatas = copyArray(cityTemp.childrens, cityTemp);
					$scope.cityCounty = cityCounty;
					city = cityTemp;
					county = cityCounty;
				}
				$scope.setUnClick();
				cityCounty.isClick = true;
				$menuService.code = cityCounty.code;
				//根据区域代码获取菜单树
				$menuService.getmenu({
						areaCode: cityCounty.code
					})
					.then(function(res) {
						if(res.success) {
							console.log(res);
							$menuService.level1MenuArray = res.data;
							$menuService.bsdt = $scope.bsdt;
							$wyyyService.bsdt = $scope.bsdt;
							if(res.data != null && res.data.length > 0) {
								$addressService.isOnline = true;
								
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
					console.log(cityCounty);
					city.code = cityCounty.code;
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
		}
		$scope.selectCityCounty(county);

		function getTreeData() {

		}
	}
]);