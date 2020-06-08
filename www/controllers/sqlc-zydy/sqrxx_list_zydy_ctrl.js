angular.module('sqrxxListZydyCtrl', []).controller('sqrxxListZydyCtrl', ["$scope", "ionicToast", "$state",
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
			name: '转移',
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
						$scope.sqrList = [].concat($scope.qlxx.children[0].qlrs ,$scope.qlxx.children[0].ywrs,$scope.qlxx.children[1].qlrs,$scope.qlxx.children[1].ywrs);
						
		
						if($scope.sqrList != null && $scope.sqrList.length > 0) {
							$scope.zyqlrList = [];
							$scope.zyywrList = [];
							$scope.dyqrList = [];
							$scope.dyrList = [];
							$scope.zwrList = [];
							for(var i = 0; i < $scope.sqrList.length; i++) {
								var person = $scope.sqrList[i];
								if(person.category == "0") { //转移权利人
									$scope.zyqlrList[$scope.zyqlrList.length] = person;
								} else if(person.category == "1") { //转移义务人
									$scope.zyywrList[$scope.zyywrList.length] = person;
								} else if(person.category == "4") { //抵押权人
									$scope.dyqrList[$scope.dyqrList.length] = person;
								}
								else if(person.category == "5"){//抵押人
									$scope.dyrList[$scope.dyrList.length] = person; 
								}
								else if(person.category == "6") { //债务人
									$scope.zwrList[$scope.zwrList.length] = person;
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
		
		$scope.zyqlrList = [];
		$scope.zyywrList = [];
		$scope.dyqrList = [];
		$scope.dyrList = [];
		$scope.zwrList = [];
		

		$scope.getqlxx();
	

		//调转到查看，分3种状态 查看 编辑 新增
		$scope.showPersonInfo = function(item) {
			if(item.category == '0'||item.category == '2'||item.category == '4'||item.category == '7'||item.category == '9') {
				$state.go('qlrxxZydy', {
					'id': item.id,
					'category': item.category,
					'action': '查看'
				});
			} else {
				$state.go('ywrxxZydy', {
					'id': item.id,
					'category': item.category,
					'action': '查看'
				});
			}

		}
		//跳转到编辑
		$scope.editPersonInfo = function(item) {
			if(item.category == '0'||item.category == '2'||item.category == '4'||item.category == '7'||item.category == '9') {
				$state.go('qlrxxZydy', {
					'id': item.id,
					'category': item.category,
					'action': '编辑'
				});
			} else {
				$state.go('ywrxxZydy', {
					'id': item.id,
					'category': item.category,
					'action': '编辑'
				});
			}

		}
		//跳转到添加
		$scope.addPerson = function(category) {
			if(category == '0'||category == '2'||category == '4'||category == '7'||category == '9') {
				$state.go('qlrxxZydy', {
					'category': category,
					'action': '新增'
				});
			}
			if(category == '1'||category == '5'||category == '6'||category == '8'||category == '10'||category == '11') {
				$state.go('ywrxxZydy', {
					'category': category,
					'action': '新增'
				});
			}
		}
		//删除对话框
		$scope.delPersonDialog = function(item) {
			$scope.delItem = item;
			
			$scope.deleteConfirm("提示", "确认", "取消", "确认要删除该人员信息吗?");
			
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
					if($scope.delItem.category == '0'
					||$scope.delItem.category == '2'
					||$scope.delItem.category == '4'
					||$scope.delItem.category == '7'
					||$scope.delItem.category == '9') {
						$scope.delQlr(); //删除权利人信息
					}
					if($scope.delItem.category == '1'
					||$scope.delItem.category == '5'
					||$scope.delItem.category == '6'
					||$scope.delItem.category == '8'
					||$scope.delItem.category == '10'
					||$scope.delItem.category == '11') {
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
			if($scope.zyqlrList == null || $scope.zyqlrList.length == 0) {
				$scope.showAlert("缺少转移权利人");
			} else if($scope.zyywrList == null || $scope.zyywrList.length == 0) {
				$scope.showAlert("缺少转移义务人");
			} else if($scope.dyqrList == null || $scope.dyqrList.length == 0) {
				$scope.showAlert("缺少抵押权人");
			} else if($scope.zwrList == null || $scope.zwrList.length == 0) {
				$scope.showAlert("缺少债务人");
			} else {
				//清空列表编辑信息
				$wysqService.bdcxxData = {};
				//显示下一步按钮
				$wysqService.bdcxxNext = true;
				//编辑按钮不显示
				$wysqService.bdcxxMod = false;
				$state.go('bdcxxZydy', {
					'ywh': $wysqService.djsqItemData.wwywh
				});
			}
		}

	}
]);