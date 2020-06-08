angular.module('sqrxxGzdjCtrl', []).controller('sqrxxGzdjCtrl', ["$scope", "ionicToast", "$state", "$ionicHistory", "$wysqService", "$ionicPopup", "$ionicLoading", "$dictUtilsService", "$menuService", "$ionicActionSheet",
	function($scope, ionicToast, $state,$ionicHistory, $wysqService, $ionicPopup, $ionicLoading, $dictUtilsService, $menuService, $ionicActionSheet, ) {
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
		// 9.20   9.21接着做   给这里添加数据
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
                            console.log("res.data is " +JSON.stringify(res.data));
							//获取权利人列表
							// $scope.qlrlist = res.data.qlr;
							$scope.qlrlist = res.data.children[0].qlrs;
							//获取业务人员列表
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

		$scope.initInfo = function() {
			$scope.showEditInfo();
        }

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
        //删除权利人
        $scope.showConfirm = function(titel, okText, cancelText, contentText, isQlr) {
			var confirmPopup = $ionicPopup.confirm({
				title: titel,
				okText: okText,
				cancelText: cancelText,
				content: contentText
			});
			confirmPopup.then(function(res) {
				if(res) {
					$scope.delQlr(); //删除权利人信息
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

		//跳转到添加权利人页面
		$scope.addqlr = function() {
			$wysqService.qlrlist = $scope.qlrlist;
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
			goBdcxxAlert();
		}
		//下一步跳转不动产信息
		goBdcxxAlert = function() {
				if($scope.qlrlist != null && $scope.qlrlist.length > 0) {
					$scope.goBdcxxPage();
					$state.go("bdcxx", {
						"ywh": $wysqService.djsqItemData.ywh

					}, {
						reload: true
					});
				} else if($scope.qlrlist != null && $scope.qlrlist.length > 0) {
					$scope.showAlert("请先填写所有权人信息");
				} 
		};

		//跳转到不动产信息需要设置参数值
		$scope.goBdcxxPage = function() {
			//清空列表编辑信息
			$wysqService.bdcxxData = {};
			//显示下一步按钮
			$wysqService.bdcxxNext = true;
			//编辑按钮不显示
			$wysqService.bdcxxMod = false;
		};

		$scope.goYgqkPage = function() {
			//清空列表编辑信息
			$wysqService.bdcxxData = {};
			//显示下一步按钮
			$wysqService.bdcxxNext = true;
			//编辑按钮不显示
			$wysqService.bdcxxMod = false;
		};
	}
]);