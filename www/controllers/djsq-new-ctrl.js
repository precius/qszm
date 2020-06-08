//我的申请列表申请控制器
angular.module('djsqCtrl', []).controller('djsqCtrl', ["$scope", "$state", "$ionicPopup", "ionicToast", "$ionicHistory", "$wysqService", "$dictUtilsService", "$ionicLoading", "$ionicActionSheet",
	function($scope, $state, $ionicPopup, ionicToast, $ionicHistory, $wysqService, $dictUtilsService, $ionicLoading, $ionicActionSheet) {
		//返回
		$scope.goback = function() {
			$ionicHistory.goBack();
		};
    if($wysqService.isMainApplicant){
      $scope.title = '我的申请';
    }else{
      $scope.title = '需认证的申请';
    }
		//办理状态
		var blztStr = "办理状态";
		$scope.blzt = {};
		$scope.blztData = $dictUtilsService.getBlzt().childrens;
		getBlztLabel = function(blztValue) {
			var blztLabel = "";
			if($scope.blztData != null && $scope.blztData.length > 0) {
				for(var i = 0; i < $scope.blztData.length; i++) {
					var blzt = $scope.blztData[i];
					if(blzt.value == blztValue) {
						blztLabel = blzt.label;
						break;
					}
				}
			}
			return blztLabel;
		}
		//获取申请列表
		$scope.show = function(title) {
			$ionicLoading.show({
				//template: '上传中...'
				template: '<ion-spinner icon="lines" class="spinner-calm"></ion-spinner><p>' + title + '</p>'
			});
		};

		$scope.hide = function() {
			$ionicLoading.hide();
		};

		$scope.djsq = [];
		var sendParam = {
			nCurrent: 0,
			nSize: 10,
			userId: ''
		};
		queryDjsqData = function(isRefresh) {
			//	$scope.show("正在获取申请列表信息");
			if(isRefresh) {
				$scope.djsq = [];
				sendParam.nCurrent = 0;
			}
			sendParam.userId = mongoDbUserInfo.id; //用户ID
			$wysqService.getSqList(sendParam)
				.then(function(response) {
					if(response.data == null) {
						$scope.hide();
						return;
					}
					var result = angular.copy(response.data);
					// console.log("result is " + JSON.stringify(result));
					var djsq = result.page;
					// console.log("djsq is " + JSON.stringify(djsq));
					if(djsq != null && djsq.length > 0) {
						for(var i = 0; i < djsq.length; i++) {
							//换算时间格式
							if(djsq[i].sqsj == null){
								djsq[i].sqsj = getFormatDate(new Date(djsq[i].ctime));
							}else{
								djsq[i].sqsj = getFormatDate(new Date(djsq[i].sqsj));
							}
							console.log("时间 is "+djsq[i].sqsj);
							//判断权利人是否为null
							if(djsq[i].qlr == "null" || djsq[i].qlr == null) {
								djsq[i].qlr = "";
							}
							//判断义务人是否为null
							if(djsq[i].ywrmc == "null" || djsq[i].ywrmc == null) {
								djsq[i].ywrmc = "";
							}
							if(djsq[i].step == "NETAPPLYING" || djsq[i].step == "NETCHECKING" || djsq[i].step == "CHECKING") {
								djsq[i].color = "#E8A010";
							} else if(djsq[i].step == "NETPASSED" || djsq[i].step == "COMPLETE") {
								djsq[i].color = "#46B071";
							} else if(djsq[i].step == "NETNOPASS") {
								djsq[i].color = "#F15A4A";
							} else {
								djsq[i].color = "#108EE9";
							}
							//解析办理状态
							djsq[i].blzt = getBlztLabel(djsq[i].step);
							//根据业务添加权利人义务人类别
							if(djsq[i].subFlowName == "存量房买卖") {
								djsq[i].qlrlb = "买方";
								djsq[i].ywrlb = "卖方";
							} else if(djsq[i].subFlowName == "夫妻更名" || djsq[i].subFlowName == "更名" || djsq[i].subFlowName == "拆证" || djsq[i].subFlowName == "更址" || djsq[i].subFlowName == "所有权注销登记") {
								djsq[i].qlrlb = "权利人";
								djsq[i].ywrlb = "义务人";
							} else if(djsq[i].subFlowName == "抵押权注销登记" || djsq[i].subFlowName == "按揭" || djsq[i].subFlowName == "续贷" || djsq[i].subFlowName == "按揭" || djsq[i].subFlowName == "一般抵押" || djsq[i].subFlowName == "最高额抵押") {
								djsq[i].qlrlb = "银行";
								djsq[i].ywrlb = "义务人";
							} else {
								djsq[i].qlrlb = "权利人";
								djsq[i].ywrlb = "义务人";
							}
						}
						$scope.djsq = $scope.djsq.concat(djsq);
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
					//申请列表信息保存至服务
					$wysqService.djsqListData = $scope.djsq;
					console.log($wysqService.djsqListData);
					//				$scope.hide();
					$scope.$broadcast('scroll.refreshComplete');
					$scope.$broadcast('scroll.infiniteScrollComplete');
				}, function(error) {
					showAlert("请求失败");
					//				$scope.hide();
					$scope.$broadcast('scroll.refreshComplete');
					$scope.$broadcast('scroll.infiniteScrollComplete');
				});
		};
		showAlert = function(msg) {
			ionicToast.show(msg, 'middle', false, 2000)
		};

		//选中一条显示
		$scope.checkDjsq = function(item) {
			//根据当前ID获取该ID申请信息
			$wysqService.queryApply({
					applyId: item.qlxxId
				})
				.then(function(response) {
					//单条申请信息注入服务
					$wysqService.djsqItemData = response.data.qlxx;
					$wysqService.blzt = item.blzt;
					//跳转到单条申请详细页面
					$state.go("djsq-details", {}, {
						reload: true
					});
					console.log($wysqService.djsqItemData);
				}, function(error) {
					showAlert("请求失败");
				});
		}
		//长按触发单条信息操作
		$scope.operation = function(item) {
			if(item.blzt == "网上申请中" || item.blzt == "网上审核未通过") {
				$scope.delete(item);
			} else if(item.blzt == "网上审核中") {
				$scope.cancel(item);
			}
		}
		//删除业务信息按钮
		$scope.delete = function(item) {
			showConfirm("提示", "确认", "取消", "确认要删除该条业务信息吗?", true);
			$scope.delParam = {
				wwywh: item.wwywh
			};
		}

		//撤销业务按钮
		$scope.cancel = function(item) {
			showConfirm("提示", "确认", "取消", "确认要撤销该条业务信息吗?", false);
			$scope.revertParam = {
				id: item.qlxxId
			};
		}

		//删除业务信息对话框
		showConfirm = function(titel, okText, cancelText, contentText, isDel) {
			var confirmPopup = $ionicPopup.confirm({
				title: titel,
				okText: okText,
				cancelText: cancelText,
				content: contentText
			});
			confirmPopup.then(function(res) {
				if(res) {
          if(!$wysqService.isMainApplicant){
            showAlert("您不是申请发起人,不允许该操作!");
            return;
          }
					if(isDel) { //删除业务数据
						//删除业务信息发送请求
						$wysqService.deleteApplyByYwh($scope.delParam)
							.then(function(res) {
								if(res.success) {
									showAlert("删除业务信息成功");
									queryDjsqData(true);
								}
							}, function(error) {
								showAlert("删除业务信息失败");
							});
					} else { //取消业务数据
						$wysqService.revertApplyById($scope.revertParam)
							.then(function(res) {
								if(res.success) {
									showAlert("撤销业务信息成功");
									queryDjsqData(true);
								}
							}, function(error) {
								showAlert("撤销业务信息失败");
							});
					}
				}
			});
		};

		$scope.showMenu = function(item) {
			$ionicActionSheet.show({
				cancelOnStateChange: true,
				cssClass: 'action_s',
				titleText: "请选择",
				addCancelButtonWithLabel: '取消',
				androidEnableCancelButton: true,
				buttons: [{
					text: '查看'
				}, {
					text: '删除'
				}],
				cancelText: '取消',
				cancel: function() {
					return true;
				},
				buttonClicked: function(index) {
					switch(index) {
						case 0:
							$scope.checkDjsq(item);
							break;
						case 1:
							$scope.delete(item)
							break;
						default:
							break;
					}
					return true;
				}
			});
		}

		/**
		 *
		 * @param {Object} date long类型时间
		 * @param {Object} pattern 格式化参数类型
		 */
		function getFormatDate(date, pattern) {
			if(date == undefined) {
				date = new Date();
			}
			if(pattern == undefined) {
				pattern = "yyyy-MM-dd hh:mm:ss";
			}
			return dateFtt(pattern, date);
		}

		/**************************************时间格式化处理************************************/
		function dateFtt(fmt, date) { //author: meizz
			var o = {
				"M+": date.getMonth() + 1, //月份
				"d+": date.getDate(), //日
				"h+": date.getHours(), //小时
				"m+": date.getMinutes(), //分
				"s+": date.getSeconds(), //秒
				"q+": Math.floor((date.getMonth() + 3) / 3), //季度
				"S": date.getMilliseconds() //毫秒
			};
			if(/(y+)/.test(fmt))
				fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
			for(var k in o)
				if(new RegExp("(" + k + ")").test(fmt))
					fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			return fmt;
		}
		/**
		 * 实现下拉刷新，上拉加载更多
		 */
		$scope.hasValue = true;
		$scope.doRefresh = function() {
			queryDjsqData(true);
		};

		$scope.hasMore = function() {
			return $scope.hasValue;
		}

		$scope.loadMore = function() {
			if(sendParam.nCurrent == 0) {
				queryDjsqData(true)
			} else {
				queryDjsqData(false);
			}
		}
	}
]);
