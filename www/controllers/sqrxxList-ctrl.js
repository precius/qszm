angular.module('sqrxxListCtrl', []).controller('sqrxxListCtrl', ["$scope", "ionicToast", "$state", "$ionicHistory", "$wysqService", "$ionicPopup", "$ionicLoading", "$dictUtilsService", "$menuService", "$ionicActionSheet",
	function($scope, ionicToast, $state, $ionicHistory, $wysqService, $ionicPopup, $ionicLoading, $dictUtilsService, $menuService, $ionicActionSheet) {
		$scope.showEditInfo = function() {
			if($wysqService.djsqItemData.step == "NETAPPLYING" || $wysqService.djsqItemData.step == "NETNOPASS") {
				$scope.isShow = true;
			} else {
				$scope.isShow = false;
			}
		}
		$scope.showEditInfo();
		$scope.qlxx = {};
		$scope.qlrlist = [];
		$scope.ywrlist = [];
		
		$scope.lastTime = 0;
		//选择办事大厅
		$scope.selectBsdt = function() {
			
			/*防止快速点击，hewen 2019.05.18*/
			var time= new Date().getTime();
			if(time - $scope.lastTime<2000){
				return;
			};
			$scope.lastTime = time ;
			/*防止快速点击，hewen 2019.03.18*/
			
			$dictUtilsService.getBsdtDataByDjjg($scope, function(res) {
				if(res.success) {
					bsdtData = angular.copy(res.data);
					var buttons = [];
					for(var i = 0; i < bsdtData.length; i++) {
						buttons.push({
							text: bsdtData[i].officeName
						});
					}
					$ionicActionSheet.show({
						buttons: buttons,
						titleText: '选择办事大厅',
						cancelText: '取消',
						cancel: function() {
							return true;
						},
						buttonClicked: function(index) {
							$scope.bsdtmc = bsdtData[index].officeName;
							$menuService.changeBsdt({
									qlxxId: $scope.qlxx.id,
									bsdtbh: bsdtData[index].officeCode
								})
								.then(function(res) {
									$scope.showAlert('修改办事大厅成功！');
								}, function(res) {
									$scope.showAlert(res.message);
								});
							return true;
						}
					});
				}
			});

		}
		//通过业务号获取业务信息，只需要接收wwywh即可
		$scope.getqlxx = function() {
			if($wysqService.djsqItemData.wwywh != null) {
				$wysqService.queryApplyByYwh({
						wwywh: $wysqService.djsqItemData.wwywh
					})
					.then(function(res) {
						if(res.success) {
							//获取权利信息
							$scope.qlxx = res.data;
							$wysqService.djsqItemData = res.data;

							//获取权利人列表
							$scope.qlrlist = res.data.qlr;
							//获取业务人员列表
							$scope.ywrlist = res.data.ywr;
							//清空在抵押人和债务人集合
							$scope.dyrList = [];
							$scope.zwrList = [];
							//初始化tab信息
							$scope.initInfo();
							//获取办事大厅
							$scope.bsdtmc = res.data.bsdtmc;
						} else {
							$scope.showAlert('获取申请信息失败');
						}
					}, function(res) {
						$scope.showAlert('获取申请信息失败');
					});
			}

		}
		$scope.getqlxx();
		$scope.sqrTitle = [{
			name: '',
			value: '0',
			show: true, //显示权利人列表还是义务人列表
			showTab: true //是否显示权利人Tab
		}, {
			name: '',
			value: '1',
			show: false,
			showTab: true //是否显示义务人Tab
		}, {
			name: '',
			value: '2',
			show: false,
			showTab: false //是否显示抵押人Tab
		}, {
			name: '',
			value: '3',
			show: false,
			showTab: false //是否显示债务人Tab
		}]

		var flowCode = $menuService.flowCode;

		$scope.initInfo = function() {
			$scope.showEditInfo();
			if(gyjsydsyqjfwsyq_zydj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //过户
				$menuService.sqdjyy = "过户";
				$scope.sqrTitle[0].name = "买方";
				$menuService.qlr = "买方";
				$scope.sqrTitle[1].name = "卖方";
				$menuService.ywr = "卖方";
				$scope.sqrTitle[0].showTab = true;
				$scope.sqrTitle[1].showTab = true;
				
			} else if(gyjsydsyqjfwsyq_bgdj_flowCode == $wysqService.djsqItemData.netFlowdefCode||
						gyjsydsyq_bgdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //变更
				$menuService.sqdjyy = "变更";
				$menuService.qlr = "权利人";
				$scope.sqrTitle[0].name = "权利人";
				$scope.sqrTitle[1].name = "义务人";
				$scope.sqrTitle[0].showTab = true;
				$scope.sqrTitle[1].showTab = false;
			} else if(gyjsydsyqjfwsyq_bzdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //补证登记
				$menuService.sqdjyy = "其他";
				$menuService.qlr = "权利人";
				$scope.sqrTitle[0].name = "权利人";
				$scope.sqrTitle[1].name = "义务人";
				$scope.sqrTitle[0].showTab = true;
				$scope.sqrTitle[1].showTab = false;
			}   else if(gyjsydsyqjfwsyq_hzdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //换证登记
				$menuService.sqdjyy = "其他";
				$menuService.qlr = "权利人";
				$scope.sqrTitle[0].name = "权利人";
				$scope.sqrTitle[1].name = "义务人";
				$scope.sqrTitle[0].showTab = true;
				$scope.sqrTitle[1].showTab = false;
			}  else if(gyjsydsyqjfwsyq_zxdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //所有权注销登记
				$menuService.sqdjyy = "注销";
				$scope.sqrTitle[0].name = "权利人";
				$scope.sqrTitle[1].name = "义务人";
				$scope.sqrTitle[0].showTab = true;
				$scope.sqrTitle[1].showTab = false;
			}
			else if(dyqdj_zxdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //抵押权注销登记
				$menuService.sqdjyy = "注销";
				$menuService.qlr = "抵押权人";
				$scope.sqrTitle[0].name = "抵押权人";
				$scope.sqrTitle[0].showTab = true;

				$scope.sqrTitle[1].showTab = false;
				$scope.sqrTitle[1].show = false;
				$scope.sqrTitle[2].name = '抵押人';
				$scope.sqrTitle[2].showTab = true;
				$scope.sqrTitle[2].show = true;
				$scope.sqrTitle[3].name = '债务人';
				$scope.sqrTitle[3].showTab = true;
				$scope.sqrTitle[3].show = true;
				$scope.separateYwr() //将义务人区分为抵押人和债务人

			} else if(dyqdj_scdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //抵押
				$menuService.sqdjyy = "抵押";
				$menuService.qlr = "抵押权人";
				$scope.sqrTitle[0].name = "抵押权人";
				$scope.sqrTitle[0].showTab = true;

				$scope.sqrTitle[1].showTab = false;
				$scope.sqrTitle[1].show = false;
				$scope.sqrTitle[2].name = '抵押人';
				$scope.sqrTitle[2].showTab = true;
				$scope.sqrTitle[2].show = true;
				$scope.sqrTitle[3].name = '债务人';
				$scope.sqrTitle[3].showTab = true;
				$scope.sqrTitle[3].show = true;
				$scope.separateYwr() //将义务人区分为抵押人和债务人
			}
			/*if(flowCode == "IEBDC:GH:FCMM") { // 转移登记
				$menuService.sqdjyy = "转移登记";
				$scope.sqrTitle[0].name = "买方";
				$scope.sqrTitle[1].name = "卖方";
				$scope.sqrTitle[0].showTab = true;
				$scope.sqrTitle[1].showTab = true;
			} else if(flowCode == "IEBDC:GH:FCJC") { // 转移登记
				$menuService.sqdjyy = "转移登记";
				$scope.sqrTitle[0].name = "继承人";
				$scope.sqrTitle[1].name = "被继承人";
				$scope.sqrTitle[0].showTab = true;
				$scope.sqrTitle[1].showTab = true;
			} else if(flowCode == "IEBDC:GH:FCZY") { // 转移登记
				$menuService.sqdjyy = "转移登记";
				$scope.sqrTitle[0].name = "受赠人";
				$scope.sqrTitle[1].name = "赠与人";
				$scope.sqrTitle[0].showTab = true;
				$scope.sqrTitle[1].showTab = true;
			} else if(flowCode == "IEBDC:GH:FCXC") { // 转移登记
				$menuService.sqdjyy = "转移登记";
				$scope.sqrTitle[0].name = "权利人信息";
				$scope.sqrTitle[1].name = "义务人信息";
				$scope.sqrTitle[0].showTab = true;
				$scope.sqrTitle[1].showTab = true;
			} else if(flowCode == "IEBDC:BG:DZBG") { // 变更登记
				$menuService.sqdjyy = "变更登记";
				$scope.sqrTitle[0].name = "权利人信息";
				$scope.sqrTitle[0].showTab = true;
				$scope.sqrTitle[1].showTab = false;
			} else if(flowCode == "IEBDC:BG:SFXXBG") { // 变更登记
				$menuService.sqdjyy = "变更登记";
				$scope.sqrTitle[0].name = "权利人信息";
				$scope.sqrTitle[0].showTab = true;
				$scope.sqrTitle[1].showTab = false;
			} else if(flowCode == "IEBDC:BG:FWXXBG") { // 变更登记
				$menuService.sqdjyy = "变更登记";
				$scope.sqrTitle[0].name = "权利人信息";
				$scope.sqrTitle[0].showTab = true;
				$scope.sqrTitle[1].showTab = false;
			} else if(flowCode == "IEBDC:BB:YSBB") { // 补办登记
				$menuService.sqdjyy = "补办登记";
				$scope.sqrTitle[0].name = "权利人信息";
				$scope.sqrTitle[0].showTab = true;
				$scope.sqrTitle[1].showTab = false;
			} else if(flowCode == "IEBDC:BB:HZ") { //  补办登记
				$menuService.sqdjyy = "补办登记";
				$scope.sqrTitle[0].name = "权利人信息";
				$scope.sqrTitle[0].showTab = true;
				$scope.sqrTitle[1].showTab = false;
			} else if(flowCode == "IEBDC:GZ") { // 更正登记
				$menuService.sqdjyy = "更正登记";
				$scope.sqrTitle[0].name = "权利人信息";
				$scope.sqrTitle[0].showTab = true;
				$scope.sqrTitle[1].showTab = false;
			}*/
		}

		// 当申请类型是  抵押或抵押权注销 时，义务人 分成 抵押人和债务人
		$scope.dyrList = [];
		$scope.zwrList = [];
		$scope.separateYwr = function() {
			console.log($scope.ywrlist)
			if($scope.ywrlist != null && $scope.ywrlist.length > 0) {
				for(var i = 0; i < $scope.ywrlist.length; i++) {
					var ywr = $scope.ywrlist[i];
					if(ywr.category == 5) {
						$scope.dyrList[$scope.dyrList.length] = ywr;
					}
					if(ywr.category == 6) {
						$scope.zwrList[$scope.zwrList.length] = ywr;
					}
				}

			}
		}

		$scope.bdcxx = {};

		$scope.show = function(title) {
			$ionicLoading.show({
				//template: '上传中...'
				template: '<ion-spinner icon="lines" class="spinner-calm"></ion-spinner><p>' + title + '</p>'
			});
		};
		$scope.hide = function() {
			$ionicLoading.hide();
		};
		//删除权利人对话框
		$scope.delParam = {};
		$scope.delQlrDialog = function(item) {
			console.log(item);
			$scope.delParam = {
				id: item.id
			};
			$scope.showConfirm("提示", "确认", "取消", "确认要删除该权利人吗?", true);
		}
		//删除义务人对话框
		$scope.delParam = {};
		$scope.delYwrDialog = function(item) {
			console.log(item);
			$scope.delParam = {
				id: item.id
			};
			//在服务端，抵押人和债务人都属于 义务人
			if(item.category == 5) {
				$scope.showConfirm("提示", "确认", "取消", "确认要删除该抵押人吗?", false);
			} else if(item.category == 6) {
				$scope.showConfirm("提示", "确认", "取消", "确认要删除该债务人吗?", false);
			} else {
				$scope.showConfirm("提示", "确认", "取消", "确认要删除该义务人吗?", false);
			}

		}
		//删除权利人
		$scope.delQlr = function() {
			$wysqService.delQlr($scope.delParam)
				.then(function(res) {
					if(res.success) {
						console.log("删除权利人成功");
					}
					//				$scope.recordqlr();
					$scope.getqlxx();
				}, function(res) {
					console.log(res.message);
					console.log("删除失败");
				});
		}

		//删除义务人
		$scope.delYwr = function() {
			$wysqService.delYwr($scope.delParam)
				.then(function(res) {
					if(res.success) {
						console.log("删除义务人成功");
						//					$scope.recordywr();
						$scope.getqlxx();
					}
				}, function(res) {
					console.log(res.message);
					console.log("删除失败");
				});
		}
		//删除权利人/义务人信息对话框
		$scope.showConfirm = function(titel, okText, cancelText, contentText, isQlr) {
			var confirmPopup = $ionicPopup.confirm({
				title: titel,
				okText: okText,
				cancelText: cancelText,
				content: contentText
			});
			confirmPopup.then(function(res) {
				if(res) {
					if(isQlr) {
						$scope.delQlr(); //删除权利人信息
					} else {
						$scope.delYwr(); //删除义务人信息
					}
				} else {

				}
			});
		};
		//返回上一个页面
		$scope.goback = function() {
			$ionicHistory.goBack();
		};

		//跳转到编辑权利人页面
		$scope.updataQlr = function(qlrId) {
			$wysqService.qlrlist = $scope.qlrlist;
			$wysqService.ywrlist = $scope.ywrlist;
			$wysqService.dyrlist = null;
			$wysqService.zwrlist = null;
			var num = 0; //按份共有的权利比例和
			$wysqService.num = 0;
			for(var i = 0; i < $scope.qlrlist.length; i++) {
				if($scope.qlrlist[i].gyqk == "按份共有" && $scope.qlrlist[i].id != qlrId) {
					num += parseFloat($scope.qlrlist[i].qlbl);
				}

			}
			$wysqService.num = num;

			$state.go('sqrxxQlrxxEdit', {
				'id': qlrId
			}, {
				reload: true
			});
		};
		//跳转到编辑义务人页面
		$scope.updataYwr = function(ywrId) {
			$wysqService.qlrlist = $scope.qlrlist;
			$wysqService.ywrlist = $scope.ywrlist;
			$wysqService.dyrlist = null;
			$wysqService.zwrlist = null;

			var num = 0; //按份共有的权利比例和
			$wysqService.num = 0;
			for(var i = 0; i < $scope.ywrlist.length; i++) {
				if($scope.ywrlist[i].gyqk == "按份共有" && $scope.ywrlist[i].id != ywrId) {
					num += parseFloat($scope.ywrlist[i].qlbl);
				}

			}
			$wysqService.num = num;
			$state.go('sqrxxYwrxxEdit', {
				'id': ywrId
			}, {
				reload: true
			});
		};
		//跳转到编辑抵押人页面
		$scope.updataDyr = function(ywrId) {
			$wysqService.qlrlist = $scope.qlrlist;
			$wysqService.ywrlist = null;
			$wysqService.dyrlist = $scope.dyrList;
			$wysqService.zwrlist = null;

			var num = 0; //按份共有的权利比例和
			$wysqService.num = 0;
			if($scope.dyrList != null) {
				for(var i = 0; i < $scope.dyrList.length; i++) {
					if($scope.dyrList[i].gyqk == "按份共有" && $scope.dyrList[i].id != ywrId) {
						num += parseFloat($scope.dyrList[i].qlbl);
					}

				}
			}
			$wysqService.num = num;
			$state.go('sqrxxYwrxxEdit', {
				'id': ywrId
			}, {
				reload: true
			});
		};
		//跳转到编辑债务人页面
		$scope.updataZwr = function(ywrId) {
			$wysqService.qlrlist = $scope.qlrlist;
			$wysqService.ywrlist = null;
			$wysqService.dyrlist = null;
			$wysqService.zwrlist = $scope.zwrList;

			var num = 0; //按份共有的权利比例和
			$wysqService.num = 0;
			if($scope.zwrList != null) {
				for(var i = 0; i < $scope.zwrList.length; i++) {
					if($scope.zwrList[i].gyqk == "按份共有" && $scope.zwrList[i].id != ywrId) {
						num += parseFloat($scope.zwrList[i].qlbl);
					}

				}
			}
			$wysqService.num = num;
			$state.go('sqrxxYwrxxEdit', {
				'id': ywrId
			}, {
				reload: true
			});
		};
		//跳转到添加权利人页面
		$scope.addqlr = function() {
			$wysqService.qlrlist = $scope.qlrlist;
			$wysqService.ywrlist = $scope.ywrlist;
			$wysqService.dyrlist = null;
			$wysqService.zwrlist = null;
			var num = 0; //按份共有的权利比例和
			$wysqService.num = 0;
			if($scope.qlrlist) {
				for(var i = 0; i < $scope.qlrlist.length; i++) {
					if($scope.qlrlist[i].gyqk === "单独所有") {
						$scope.showAlert('单独所有只能添加一个人！');
						return;
					}
					if($scope.qlrlist[i].gyqk === "按份共有") {
						num += parseFloat($scope.qlrlist[i].qlbl);
						if(num >= 100) {
							$scope.showAlert('总比例已经达到100，不可再添加！');
							return;
						}
					}

				}
				$wysqService.num = num;
				$state.go('sqrxxQlrxxAdd');
			} else {

				$state.go('sqrxxQlrxxAdd');
			}
		}
		//跳转到添加义务人页面
		$scope.addywr = function() {
			$wysqService.qlrlist = $scope.qlrlist;
			$wysqService.ywrlist = $scope.ywrlist;
			$wysqService.dyrlist = null;
			$wysqService.zwrlist = null;
			var num = 0; //按份共有的权利比例和
			$wysqService.num = 0;
			if($scope.ywrlist) {
				for(var i = 0; i < $scope.ywrlist.length; i++) {
					if($scope.ywrlist[i].gyqk === "单独所有") {
						$scope.showAlert('单独所有只能添加一个人！');
						return;
					}
					if($scope.ywrlist[i].gyqk === "按份共有") {
						num += parseFloat($scope.ywrlist[i].qlbl);
						if(num >= 100) {
							$scope.showAlert('总比例已经达到100，不可再添加！');
							return;
						}
					}

				}
				$wysqService.num = num;
				$state.go('sqrxxYwrxxAdd');
			} else {

				$state.go('sqrxxYwrxxAdd');
			}
		};

		//添加抵押人
		$scope.addDyr = function() {
			$wysqService.qlrlist = $scope.qlrlist;
			$wysqService.ywrlist = null;
			$wysqService.dyrlist = $scope.dyrList;
			$wysqService.zwrlist = null;

			var num = 0; //按份共有的权利比例和
			$wysqService.num = 0;
			if($scope.dyrList) {
				for(var i = 0; i < $scope.dyrList.length; i++) {
					if($scope.dyrList[i].gyqk === "单独所有") {
						$scope.showAlert('单独所有只能添加一个人！');
						return;
					}
					if($scope.dyrList[i].gyqk === "按份共有") {
						num += parseFloat($scope.dyrList[i].qlbl);
						if(num >= 100) {
							$scope.showAlert('总比例已经达到100，不可再添加！');
							return;
						}
					}

				}
				$wysqService.num = num;
				$state.go('sqrxxYwrxxAdd');
			} else {

				$state.go('sqrxxYwrxxAdd');
			}
		};

		//添加债务人
		$scope.addZwr = function() {
			$wysqService.qlrlist = $scope.qlrlist;
			$wysqService.ywrlist = null;
			$wysqService.dyrlist = null;
			$wysqService.zwrlist = $scope.zwrList;
			var num = 0; //按份共有的权利比例和
			$wysqService.num = 0;
			if($scope.zwrList) {
				for(var i = 0; i < $scope.zwrList.length; i++) {
					if($scope.zwrList[i].gyqk === "单独借款") {
						$scope.showAlert('单独借款只能添加一个人！');
						return;
					}
					/*if($scope.zwrList[i].gyqk === "按份共有") {
						num += parseFloat($scope.zwrList[i].qlbl);
						if(num >= 100) {
							$scope.showAlert('总比例已经达到100，不可再添加！');
							return;
						}
					}
*/
				}
				$wysqService.num = num;
				$state.go('sqrxxYwrxxAdd');
			} else {

				$state.go('sqrxxYwrxxAdd');
			}

		};

		//提示框
		$scope.showAlert = function(msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		};
		//加载框
		show = function() {
			$ionicLoading.show({
				template: '加载中...'
			});
		};
		//隐藏加载框
		hide = function() {
			$ionicLoading.hide();
		};
		//下一步
		$scope.nextStep = function() {
			console.log("next step")
			goBdcxxAlert();
		}
		//下一步跳转不动产信息
		goBdcxxAlert = function() {
			if(gyjsydsyqjfwsyq_zydj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //过户
				if($scope.qlrlist != null && $scope.qlrlist.length > 0 && $scope.ywrlist != null && $scope.ywrlist.length > 0) {
					$scope.goBdcxxPage();
					$state.go("bdcxx", {
						"ywh": $wysqService.djsqItemData.ywh
					}, {
						reload: true
					});
				} else if($scope.qlrlist != null && $scope.qlrlist.length > 0) {
					$scope.showAlert("请先填写卖方信息");
				} else if($scope.ywrlist != null && $scope.ywrlist.length > 0) {
					$scope.showAlert("请先填写买方信息");
				} else {
					$scope.showAlert("请先填写买方、卖方信息");
				}
			} else if(gyjsydsyqjfwsyq_bgdj_flowCode == $wysqService.djsqItemData.netFlowdefCode ||
			          	gyjsydsyqjfwsyq_bzdj_flowCode == $wysqService.djsqItemData.netFlowdefCode ||
					  	gyjsydsyqjfwsyq_hzdj_flowCode == $wysqService.djsqItemData.netFlowdefCode ||
						gyjsydsyq_bgdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //变更/补证/换证
				if($scope.qlrlist != null && $scope.qlrlist.length > 0) {
					$scope.goBdcxxPage();
					$state.go("bdcxx", {
						"ywh": $wysqService.djsqItemData.ywh
					}, {
						reload: true
					});
				} else if($scope.qlrlist != null && $scope.qlrlist.length > 0) {
					$scope.showAlert("请先填写义务人信息");
				} else if($scope.ywrlist != null && $scope.ywrlist.length > 0) {
					$scope.showAlert("请先填写权利人信息");
				} else {
					$scope.showAlert("请先填写权利人、义务人信息");
				}
			}else if(gyjsydsyqjfwsyq_zxdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //所有权注销
				if($scope.qlrlist != null && $scope.qlrlist.length > 0) {
					$scope.goBdcxxPage();
					$state.go("bdcxx", {
						"ywh": $wysqService.djsqItemData.ywh
					}, {
						reload: true
					});
				} else if($scope.qlrlist != null && $scope.qlrlist.length > 0) {
					$scope.showAlert("请先填写义务人信息");
				} else if($scope.ywrlist != null && $scope.ywrlist.length > 0) {
					$scope.showAlert("请先填写权利人信息");
				} else {
					$scope.showAlert("请先填写权利人、义务人信息");
				}
			} else if(dyqdj_zxdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //抵押权注销
				if($scope.qlrlist != null && $scope.qlrlist.length > 0 && $scope.dyrList != null && $scope.dyrList.length > 0 && $scope.zwrList != null && $scope.zwrList.length > 0) {
					$scope.goBdcxxPage();
					$state.go("bdcxx_dyqdj_scdj", {
						"ywh": $wysqService.djsqItemData.ywh
					}, {
						reload: true
					});
				} else if($scope.qlrlist == null || $scope.qlrlist.length == 0) {
					$scope.showAlert("请先填写抵押权人信息");
				} else if($scope.dyrList == null || $scope.dyrList.length == 0) {
					$scope.showAlert("请先抵押人信息");
				} else if($scope.zwrList == null || $scope.zwrList.length == 0) {
					$scope.showAlert("请先填债务人信息");
				}
			} else if(dyqdj_scdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //抵押

				if($scope.qlrlist != null && $scope.qlrlist.length > 0 && $scope.dyrList != null && $scope.dyrList.length > 0 && $scope.zwrList != null && $scope.zwrList.length > 0) {
					$scope.goBdcxxPage();
					$state.go("bdcxx_dyqdj_scdj", {
						"ywh": $wysqService.djsqItemData.ywh
					}, {
						reload: true
					});
				} else if($scope.qlrlist == null || $scope.qlrlist.length == 0) {
					$scope.showAlert("请先填写银行信息");
				} else if($scope.dyrList == null || $scope.dyrList.length == 0) {
					$scope.showAlert("请先抵押人信息");
				} else if($scope.zwrList == null || $scope.zwrList.length == 0) {
					$scope.showAlert("请先填债务人信息");
				}
			}
			/*if(flowCode.indexOf("IEBDC:GH") != -1) {
				if($scope.qlrlist != null && $scope.qlrlist.length > 0 && $scope.ywrlist != null && $scope.ywrlist.length > 0) {
					$scope.goBdcxxPage();
					$state.go("bdcxx", { "ywh": $wysqService.djsqItemData.ywh }, { reload: true });
				} else {
					$scope.showAlert(  "请添加权利人或者义务人");
				}
			} else if(flowCode.indexOf("FCDY") != -1) {
				if($scope.qlrlist != null && $scope.qlrlist.length > 0 && $scope.ywrlist != null && $scope.ywrlist.length > 0) {
					$scope.goBdcxxPage();
					$state.go("bdcxx_dyqdj_scdj", { "ywh": $wysqService.djsqItemData.ywh }, { reload: true });
				} else {
					$scope.showAlert(  "请添加权利人或者义务人");
				}
			} else {
				if($scope.qlrlist != null && $scope.qlrlist.length > 0) {
					$scope.goBdcxxPage();
					$state.go("bdcxx", { "ywh": $wysqService.djsqItemData.ywh }, { reload: true });
				}
			}*/
		};

		//	$scope.goBdcxx = function() {
		//		if(gyjsydsyqjfwsyq_zydj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //过户
		//			$scope.goBdcxxPage();
		//			$state.go("bdcxx", { "ywh": $wysqService.djsqItemData.ywh }, { reload: true });
		//		} else if(gyjsydsyqjfwsyq_bgdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //变更
		//			$scope.goBdcxxPage();
		//			$state.go("bdcxx", { "ywh": $wysqService.djsqItemData.ywh }, { reload: true });
		//		} else if("N400104" == $wysqService.djsqItemData.netFlowdefCode) { //注销
		//			$scope.goBdcxxPage();
		//			$state.go("bdcxx", { "ywh": $wysqService.djsqItemData.ywh }, { reload: true });
		//		} else if(dyqdj_scdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //抵押
		//			$scope.goBdcxxPage();
		//			$state.go("bdcxx_dyqdj_scdj", { "ywh": $wysqService.djsqItemData.ywh }, { reload: true });
		//		}
		//		/*if(gyjsydsyq_zydj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //土地_国有建设用地使用权_转移登记
		//			$scope.goBdcxxPage();
		//			$state.go("bdcxx_td_gyjsydsyq_zydj", { "ywh": $wysqService.djsqItemData.ywh }, { reload: true });
		//		} else if(gyjsydsyq_bgdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //土地_国有建设用地使用权_变更登记
		//			$scope.goBdcxxPage();
		//			$state.go("bdcxx_td_gyjsydsyq_bgdj", { "ywh": $wysqService.djsqItemData.ywh }, { reload: true });
		//		} else if(gyjsydsyqjfwsyq_zydj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //过户
		//			$scope.goBdcxxPage();
		//			$state.go("bdcxx", { "ywh": $wysqService.djsqItemData.ywh }, { reload: true });
		//		} else if(gyjsydsyqjfwsyq_bgdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //变更
		//			$scope.goBdcxxPage();
		//			$state.go("bdcxx", { "ywh": $wysqService.djsqItemData.ywh }, { reload: true });
		//		} else if(N400104 == $wysqService.djsqItemData.netFlowdefCode) {//注销
		//			$scope.goBdcxxPage();
		//			$state.go("bdcxx", { "ywh": $wysqService.djsqItemData.ywh }, { reload: true });
		//		} else if (gyjsydsyqjfwsyq_gzdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //房屋_更正登记跳转
		//			$scope.goBdcxxPage();
		//			$state.go("bdcxx", { "ywh": $wysqService.djsqItemData.ywh }, { reload: true });
		//		} else if(dyqdj_scdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //房屋_抵押权登记首次登记跳转
		//			$scope.goBdcxxPage();
		//			$state.go("bdcxx_dyqdj_scdj", { "ywh": $wysqService.djsqItemData.ywh }, { reload: true });
		//		} else if(ygdj_ysspfmmygdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //房屋_预告登记_预售商品房买卖预告登记
		//			$scope.goBdcxxPage();
		//			$state.go("bdcxx_ygdj_ysspfmmygdj", { "ywh": $wysqService.djsqItemData.ywh }, { reload: true });
		//		} else if(ygdj_ysspfdyqygdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //房屋_预告登记_预售商品房抵押权预告登记
		//			$scope.goBdcxxPage();
		//			$state.go("bdcxx_ygdj_ysspfdyqygdj", { "ywh": $wysqService.djsqItemData.ywh }, { reload: true });
		//		} else if(lq_lqscdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { ////林地_林权_林权首次登记
		//			$scope.goBdcxxPage();
		//			$state.go("bdcxx_ld_lqdj_scdj", { "ywh": $wysqService.djsqItemData.ywh }, { reload: true });
		//		} else {
		//			//			$scope.showAlert( "请添加权利人或者义务人");
		//		}*/
		//	};
		//跳转到不动产信息需要设置参数值
		$scope.goBdcxxPage = function() {
			//清空列表编辑信息
			$wysqService.bdcxxData = {};
			//显示下一步按钮
			$wysqService.bdcxxNext = true;
			//编辑按钮不显示
			$wysqService.bdcxxMod = false;
		};
	}
]);