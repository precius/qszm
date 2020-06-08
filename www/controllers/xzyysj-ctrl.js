//在填写预约信息里面选择预约   时间
angular.module('xzyysjCtrl', []).controller('xzyysjCtrl', ["$scope", "ionicToast", "$ionicHistory", "$ionicActionSheet", "$wyyyService", "$dictUtilsService", "$rootScope",
	function($scope, ionicToast, $ionicHistory, $ionicActionSheet, $wyyyService, $dictUtilsService, $rootScope) {
		$scope.yysj = {
			date: '',
			week: '',
			time: ''
		}
		//预约时间信息列表
		$scope.yysjlist = [];

		$scope.showDate = false;
		$scope.showTime = false;

		$scope.goback = function() {
			$ionicHistory.goBack(); //返回上一个页面
		};
		$scope.showAlert = function(msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		};
		var labelStr = '预约时间段';
		//$scope.dic = $dictUtilsService.getDictinaryByType(labelStr).childrens;
		$scope.dic = [];
		$wyyyService.getSjdDic({officeCode:$wyyyService.bsdt.officeCode}).then(
			function(res){
				$scope.dic = res.data;
				if($scope.dic!=null&&$scope.dic.length>0){
					$scope.getyysjlist();
				}else{
					$scope.showAlert('获取预约时间段字典失败!');
				}
			},
			function(error){
				$scope.showAlert('获取预约时间段字典失败!');
			}
		);
		//获取预约时间列表
		$scope.getyysjlist = function() {
			$wyyyService.getyysjlist({
				djjg: $wyyyService.bsdt.jgmc,
				bsdt: $wyyyService.bsdt.officeName,
				yysx: $wyyyService.yysx
			}).then(function(res) {
				console.log(res);
				if(res.success) {

					var sjList = res.data;

					for(var k = 0; k < sjList.length; k++) {

						var yysjOfDay = sjList[k];
						var yyxxConfigDtoList = yysjOfDay.yyxxConfigDtoList;
						var yyxxConfigDto = null;
						//根据办事大厅和预约事项大类筛选出时间列表
						for (var m= 0;m<yyxxConfigDtoList.length;m++){
							if(yyxxConfigDtoList[m].djjg  == $wyyyService.bsdt.djjg&& yyxxConfigDtoList[m].name == $wyyyService.ywlx){
								yyxxConfigDto = yyxxConfigDtoList[m];
							}
						}
						var item = {
							//periodTime:$dictUtilsService.getFormatDate(new Date(Date.parse(key)), "yyyy-MM-dd"),
							periodTime: yysjOfDay.date,
							week: '',
							sjdArray: [],
							totalCount: 0
						};
						if(yyxxConfigDto ==null){
							$scope.showAlert('获取预约时间列表失败!');
							return;
						}
						var sjdArray = yyxxConfigDto.countVoList;
						for(var j = 0; j < sjdArray.length; j++) {
							var sjd = sjdArray[j];
							item.totalCount += sjd.surplus;

							for(var i = 0; i < $scope.dic.length; i++) {
								var model = $scope.dic[i];
								if(sjd.period == model.order) {
									sjd.label = model.sjqj;
									break;
								}
							}
						}
						item.sjdArray = sjdArray;

						$scope.yysjlist.push(item);
						//					console.log(key +"--------" +yysjMap[key]);
						
					}
					for(var i = 0; i < $scope.yysjlist.length; i++) {

						var weekday = new Date($scope.yysjlist[i].periodTime).getDay(); //表示星期几
						$scope.yysjlist[i].periodTime = $dictUtilsService.getFormatDate(new Date($scope.yysjlist[i].periodTime), "yyyy-MM-dd");

						var currentTime = new Date().getTime(); //当前毫秒时间
						var tomorrowTime = currentTime + 24 * 60 * 60 * 1000; //24小时后的毫秒时间
						var afterTomorrowTime = currentTime + 48 * 60 * 60 * 1000; //48小时后的毫秒时间

						var today = $dictUtilsService.getFormatDate(new Date(), "yyyy-MM-dd"); //今天的日期 ，格式为：yyyy-MM-dd
						var tomorrow = $dictUtilsService.getFormatDate(new Date(tomorrowTime), "yyyy-MM-dd"); //明天的日期 ，格式为：yyyy-MM-dd
						var afterTomorrow = $dictUtilsService.getFormatDate(new Date(afterTomorrowTime), "yyyy-MM-dd"); //后天的日期 ，格式为：yyyy-MM-dd

						if(today == $scope.yysjlist[i].periodTime) {
							$scope.yysjlist[i].week = '今 天';
						} else if(tomorrow == $scope.yysjlist[i].periodTime) {
							$scope.yysjlist[i].week = '明 天';
						} else if(afterTomorrow == $scope.yysjlist[i].periodTime) {
							$scope.yysjlist[i].week = '后 天';
						} else {
							switch(weekday) {
								case 0:
									$scope.yysjlist[i].week = '星期日';
									break;
								case 1:
									$scope.yysjlist[i].week = '星期一';
									break;
								case 2:
									$scope.yysjlist[i].week = '星期二';
									break;
								case 3:
									$scope.yysjlist[i].week = '星期三';
									break;
								case 4:
									$scope.yysjlist[i].week = '星期四';
									break;
								case 5:
									$scope.yysjlist[i].week = '星期五';
									break;
								case 6:
									$scope.yysjlist[i].week = '星期六';
									break;
							}
						}

					}
					console.log($scope.yysjlist);
				} else {
					$scope.showAlert('获取预约时间列表失败！');
				}
			}, function(error) {
				$scope.showAlert('获取预约时间列表失败!');
			});
		}
		
		//选择预约时间
		$scope.xzsj = function($index) {
			$scope.showDate = true;
			$scope.yysj.date = $scope.yysjlist[$index].periodTime;
			$scope.yysj.week = $scope.yysjlist[$index].week;
			var sjdArray = $scope.yysjlist[$index].sjdArray;
			var buttonsArray = [];
			for(var j = 0; j < sjdArray.length; j++) {
				var sjd = sjdArray[j];
				buttonsArray.push({
					text: sjd.label + "剩余" + sjd.surplus + "位"
				});
			}

			$ionicActionSheet.show({
				cancelOnStateChange: true,
				cssClass: 'action_s',
				titleText: "请选择预约时间段",
				addCancelButtonWithLabel: '取消',
				androidEnableCancelButton: true,
				/*buttons: [{
					text: '上午（8:00-12:00） 剩余' + $scope.yysjlist[$index].surplusAm + '位'
				}, {
					text: '下午（2:00-5:00）    剩余' + $scope.yysjlist[$index].surplusPm + '位'
				}],*/
				buttons: buttonsArray,
				cancelText: '取消',
				cancel: function() {
					return true;
				},
				buttonClicked: function(index) {
					if(sjdArray[index].surplus == 0) {
						$scope.yysj.date = '';
						$scope.yysj.week = '';
						$scope.yysj.time = '';
						$scope.showDate = false;
						$scope.showTime = false;
						$scope.showAlert("该时间段预约人数已满！")
					} else {
						$scope.showTime = true;
						$scope.yysj.time = sjdArray[index].label;
					}
					return true;
				}
			});
		};

		$scope.choose = function() {
			$wyyyService.yysj = $scope.yysj;
			$rootScope.$broadcast('xzsj', {});
			$ionicHistory.goBack();
		}
	}
]);