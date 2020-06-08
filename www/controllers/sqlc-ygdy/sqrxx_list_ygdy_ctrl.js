angular.module('sqrxxListYgdyCtrl', []).controller('sqrxxListYgdyCtrl', ["$scope", "ionicToast", "$state",
	"$ionicHistory", "$wysqService", "$ionicPopup", "$ionicLoading", "$dictUtilsService", "$menuService",
	"$ionicActionSheet", "$stateParams",
	function($scope, ionicToast, $state, $ionicHistory, $wysqService, $ionicPopup, $ionicLoading, $dictUtilsService,
		$menuService, $ionicActionSheet, $stateParams) {

		if($wysqService.djsqItemData.step == "NETAPPLYING" || $wysqService.djsqItemData.step == "NETNOPASS") {
			$scope.isShow = true; //控制界面是编辑状态还是查看状态
		} else {
			$scope.isShow = false;
		};
		$scope.qlxx = {};
		$scope.sqrList = [];

		$scope.bsdtmc = "七里河不动产登记中心";

		
		$scope.lastTime = 0;
		//选择办事大厅
		$scope.selectBsdt = function() {
			/*防止快速点击，hewen 2019.05.18*/
			var time = new Date().getTime();
			if(time - $scope.lastTime < 2000) {
				return;
			};
			$scope.lastTime = time;
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
							}).then(function(res) {
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
		
		$scope.flowType = [{
			name: '预告',
			addClass: 'on',
			value: '0',
		}, {
			name: '抵押',
			addClass: '',
			value: '1',

		}];
		$scope.type = '0';
		//选择动态信息切换选项卡
		$scope.checkType = function(index) {
			for(var i = 0; i < 2; i++) {
				$scope.flowType[i].addClass = '';
			}
			for(var i = 0; i < 2; i++) {
				if(index === $scope.flowType[i].value) {
					$scope.flowType[i].addClass = 'on';
					$scope.type = $scope.flowType[i].value;
					break;
				}
			}
		}
		
		
		
		//通过业务号获取业务信息，只需要接收wwywh即可
		$scope.getqlxx = function() {
			if($wysqService.djsqItemData.wwywh != null) {
				$wysqService.queryApplyByYwh({
					wwywh: $wysqService.djsqItemData.wwywh
				}).then(function(res) {
					if(res.success) {
						//获取权利信息
						$scope.qlxx = res.data;
						console.log("$scope.qlxx is " + JSON.stringify($scope.qlxx));
						$wysqService.djsqItemData = res.data;
						//获取权利人列表
					
						$scope.sqrList = [].concat($scope.qlxx.children[0].qlrs ,$scope.qlxx.children[0].ywrs ,$scope.qlxx.children[1].qlrs,$scope.qlxx.children[1].ywrs);
						//讲所有申请人信息分成5类
						if($scope.sqrList != null && $scope.sqrList.length > 0) {
							$scope.ygqlrList = [];
							$scope.ygywrList = [];
							$scope.ygdyqrList = [];
							$scope.ygdyrList = [];
							$scope.ygzwrList = [];
							for(var i = 0; i < $scope.sqrList.length; i++) {
								var person = $scope.sqrList[i];
								if(person.category == "7") { //预告权利人
									$scope.ygqlrList[$scope.ygqlrList.length] = person;
								} else if(person.category == "8") { //预告义务人
									$scope.ygywrList[$scope.ygywrList.length] = person;
								} else if(person.category == "9") { //预告抵押权人
									$scope.ygdyqrList[$scope.ygdyqrList.length] = person;
								}
								else if(person.category == "10"){//预告抵押人
									$scope.ygdyrList[$scope.ygdyrList.length] = person; 
								}
								else if(person.category == "11") { //预告抵债务人
									$scope.ygzwrList[$scope.ygzwrList.length] = person;
								}

							};
							
						}
				
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
		
		$scope.ygqlrList = [];
		$scope.ygywrList = [];
		$scope.ygdyqrList = [];
		$scope.ygdyrList = [];
		$scope.ygzwrList = [];
		

		$scope.getqlxx();
	

		//调转到查看，分3种状态 查看 编辑 新增
		$scope.showPersonInfo = function(item) {
			if(item.category == '7' || item.category == '9') {
				$state.go('qlrxxYgdy', {
					'id': item.id,
					'category': item.category,
					'action': '查看'
				});
			} else {
				$state.go('ywrxxYgdy', {
					'id': item.id,
					'category': item.category,
					'action': '查看'
				});
			}

		}
		//跳转到编辑
		$scope.editPersonInfo = function(item) {
			if(item.category == '7' || item.category == '9') {
				$state.go('qlrxxYgdy', {
					'id': item.id,
					'category': item.category,
					'action': '编辑'
				});
			} else {
				$state.go('ywrxxYgdy', {
					'id': item.id,
					'category': item.category,
					'action': '编辑'
				});
			}

		}
		//跳转到添加
		$scope.addPerson = function(category) {
			if(category == '9') {
				$state.go('qlrxxYgdy', {
					'category': '9',
					'action': '新增'
				});
			}
			if(category == '11') {
				$state.go('ywrxxYgdy', {
					'category': '11',
					'action': '新增'
				});
			}
		}
		//删除对话框
		$scope.delPersonDialog = function(item) {
			$scope.delItem = item;
			//在服务端，抵押人和债务人都属于 义务人
			if(item.category == '9') {
				$scope.deleteConfirm("提示", "确认", "取消", "确认要删除该预告抵押权人吗?");
			}
			if(item.category == '11') {
				$scope.deleteConfirm("提示", "确认", "取消", "确认要删除该预告债务人吗?");
			}
		}
		//删除权利人/义务人信息确认框
		$scope.deleteConfirm = function(titel, okText, cancelText, contentText) {
			var confirmPopup = $ionicPopup.confirm({
				title: titel,
				okText: okText,
				cancelText: cancelText,
				content: contentText
			});
			confirmPopup.then(function(res) {
				if(res) {
					if($scope.delItem.category == '9') {
						$scope.delQlr(); //删除权利人信息
					}
					if($scope.delItem.category == '11') {
						$scope.delYwr(); //删除义务人信息
					}
				}
			});
		}
		//删除权利人
		$scope.delQlr = function() {
			$wysqService.delQlr({
				id: $scope.delItem.id
			}).then(function(res) {
				if(res.success) {
					$scope.showAlert('删除成功');
				}
				$scope.getqlxx();
			}, function(res) {
				$scope.showAlert('删除失败');
			});
		}

		//删除义务人
		$scope.delYwr = function() {
			$wysqService.delYwr({
				id: $scope.delItem.id
			}).then(function(res) {
				if(res.success) {
					$scope.showAlert('删除成功');
					$scope.getqlxx();
				}
			}, function(res) {
				$scope.showAlert('删除失败');
			});
		}

		$scope.show = function(title) {
			$ionicLoading.show({
				//template: '上传中...'
				template: '<ion-spinner icon="lines" class="spinner-calm"></ion-spinner><p>' + title + '</p>'
			});
		}

		$scope.hide = function() {
			$ionicLoading.hide();
		}

		//返回上一个页面
		$scope.goback = function() {
			$ionicHistory.goBack();
		}

		//提示框
		$scope.showAlert = function(msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		}

		//下一步
		$scope.nextStep = function() {
			if($scope.ygqlrList == null || $scope.ygqlrList.length == 0) {
				$scope.showAlert("缺少预告权利人");
			} else if($scope.ygywrList == null || $scope.ygywrList.length == 0) {
				$scope.showAlert("缺少预告义务人");
			} else if($scope.ygdyqrList == null || $scope.ygdyqrList.length == 0) {
				$scope.showAlert("缺少预告抵押权人");
			} else if($scope.ygzwrList == null || $scope.ygzwrList.length == 0) {
				$scope.showAlert("缺少预告债务人");
			} else {
				//清空列表编辑信息
				$wysqService.bdcxxData = {};
				//显示下一步按钮
				$wysqService.bdcxxNext = true;
				//编辑按钮不显示
				$wysqService.bdcxxMod = false;
				$state.go('bdcxxYgdy', {
					'ywh': $wysqService.djsqItemData.wwywh
				});
			}
		}

	}
]);