//不动产信息(预告登记-预售商品房抵押权预告登记)页面控制器
angular.module('bdcxxYgdjysspfdyqCtrl', []).controller('bdcxxYgdjysspfdyqCtrl', ["$scope", "ionicToast", "$stateParams", "$state", "$filter", "$ionicHistory", "$wysqService", "$dictUtilsService",
	function($scope, ionicToast, $stateParams, $state, $filter, $ionicHistory, $wysqService, $dictUtilsService) {
		$scope.ywh = $stateParams.ywh;
		//判断是否可以编辑
		if($wysqService.djsqItemData.step == "NETAPPLYING" || $wysqService.djsqItemData.step == "NETNOPASS") {
			$scope.isShow = true;
		} else {
			$scope.isShow = false;
		}
		//预告登记种类
		var ygdjzlStr = "预告登记种类";
		$scope.ygdjzl = {};
		$scope.ygdjzlData = $dictUtilsService.getDictinaryByType(ygdjzlStr).childrens;
		$scope.ygdjzl = $scope.ygdjzlData[2];
		$scope.getYgdjzlByValue = function(value) {
			for(var i = 0; i < $scope.ygdjzlData.length; i++) {
				var temp = $scope.ygdjzlData[i];
				if(temp.value == value) {
					$scope.ygdjzl = temp;
				}
			}
		}
		$scope.qlxx = {};
		$scope.bdcxx = {
			qlxxEx: {}
		};

		$scope.qlxxExMhList = {};
		$scope.qlxxExMhList1 = [];
		$scope.qlxxExMhList1[0] = $scope.qlxxExMhList;
		//模板选择
		$scope.bdcqzhMbData = [{
			name: '甘（***）***不动产权第***号'
		}, {
			name: '*国用(***)第***号'
		}, {
			name: '*房权证***字第***号'
		}];
		$scope.checkBdcqzhMb = function(name) {
			$scope.bdcxx.bdcqzh = name;
		}
		//通知人信息
		$scope.tzrxxList = [];
		//默认添加当前用户为通知人
		$scope.tzrxxList.push({
			index: '$scope.tzrxxList.length',
			tzrmc: mongoDbUserInfo.name,
			tzdh: mongoDbUserInfo.tel,
			tzrfl: '0'
		});

		//义务通知人信息
		$scope.ywtzrxxList = [];
		//默认添加当前用户为义务人
		$scope.ywtzrxxList.push({
			index: '$scope.ywtzrxxList.length',
			tzrmc: mongoDbUserInfo.name,
			tzdh: mongoDbUserInfo.tel,
			tzrfl: '1'
		});
		//通过业务号获取业务信息，只需要接收ywh即可
		$scope.getqlxx = function() {
			if($scope.ywh != null) {
				$wysqService.queryApplyByYwh({
						wwywh: $scope.ywh
					})
					.then(function(res) {
						if(res.success) {
							$scope.qlxx = res.data;
							$wysqService.djsqItemData = res.data;
							//$scope.bdcxx = $scope.qlxx;
							if($scope.qlxx.qlxxEx !== null) {
								/*						$scope.getYgdjzlByValue($scope.qlxx.qlxxEx.ygdjzl);//预告登记种类
														$scope.bdcxx.fwcqmj = $scope.qlxx.qlxxEx.fwcqmj;//房屋产权面积
														$scope.bdcxx.jyjg = $scope.qlxx.qlxxEx.jyjg;//交易价格
														$scope.bdcxx.zwlxqssj = new Date($scope.qlxx.qlxxEx.zwlxqssj);//债务履行起始时间
														$scope.bdcxx.zwlxjssj = new Date($scope.qlxx.qlxxEx.zwlxjssj);//债务履行终止时间
														$scope.bdcxx.bdbzqse = $scope.qlxx.qlxxEx.bdbzqse;//被担保债权数额
														$scope.bdcxx.sqdjyy = $scope.qlxx.qlxxEx.sqdjyy;//申请登记原因*/

								//$scope.getYgdjzlByValue($scope.qlxx.qlxxEx.ygdjzl);//预告登记种类
								$scope.bdcxx.qlxxEx.zwlxqssj = new Date($scope.qlxx.qlxxEx.zwlxqssj); //债务履行起始时间
								$scope.bdcxx.qlxxEx.zwlxjssj = new Date($scope.qlxx.qlxxEx.zwlxjssj); //债务履行终止时间
								$scope.bdcxx.qlxxEx.bdbzqse = $scope.qlxx.qlxxEx.bdbzqse; //被担保债权数额
								$scope.bdcxx.qlxxEx.sqdjyy = $scope.qlxx.qlxxEx.sqdjyy; //申请登记原因
							}
							if($scope.qlxx.qlxxExMhs != undefined && $scope.qlxx.qlxxExMhs != null) {
								if($scope.qlxx.qlxxExMhs[0].bdcqzh != undefined && $scope.qlxx.qlxxExMhs[0].bdcqzh != null) {
									$scope.qlxxExMhList.bdcqzh = $scope.qlxx.qlxxExMhs[0].bdcqzh;
									$scope.needShowMb = false;
								}
								$scope.qlxxExMhList.zl = $scope.qlxx.qlxxExMhs[0].zl;
								$scope.qlxxExMhList.fwcqmj = $scope.qlxx.qlxxExMhs[0].fwcqmj;
								$scope.qlxxExMhList.fwjyjg = $scope.qlxx.qlxxExMhs[0].fwjyjg;
							}
							if($scope.qlxx.tzrxxes != undefined && $scope.qlxx.tzrxxes != null) {
								//区分权利人与义务人
								$scope.tzrxxList = [];
								$scope.ywtzrxxList = [];
								for(var i = 0; i < $scope.qlxx.tzrxxes.length; i++) {
									var temp = $scope.qlxx.tzrxxes[i];
									if(temp.tzrfl == "0") {
										$scope.tzrxxList.push(temp);
									} else if(temp.tzrfl == "1") {
										$scope.ywtzrxxList.push(temp);
									}
								}
							}
						} else {
							$scope.showAlert('获取不动产信息失败');
						}
					}, function(res) {
						$scope.showAlert('获取不动产信息失败');
					});
			}

		}
		$scope.getqlxx();
		//验证房屋_预告登记_预售商品房抵押权预告登记数据保存信息
		$scope.verifyDataNormal = function() {
			var canSave = false;
			/*if(!($scope.bdcxx.bdcdyh == undefined || $scope.bdcxx.bdcdyh === null || $scope.bdcxx.bdcdyh === "")&&!$dictUtilsService.UnitNo($scope.bdcxx.bdcdyh)){
				$scope.showAlert( "请输入正确的不动产单元号");
			}else*/
			if($scope.qlxxExMhList.zl == undefined || $scope.qlxxExMhList.zl === null || $scope.qlxxExMhList.zl === "") {
				$scope.showAlert("请输入不动产坐落");
			} else if(!$dictUtilsService.number($scope.qlxxExMhList.fwcqmj) || $scope.qlxxExMhList.fwcqmj == undefined || $scope.qlxxExMhList.fwcqmj === "") {
				$scope.showAlert("请输入正确的房屋产权面积");
			} else if(!($scope.qlxxExMhList.fwjyjg == undefined || $scope.qlxxExMhList.fwjyjg === null || $scope.qlxxExMhList.fwjyjg === "") && !$dictUtilsService.number($scope.qlxxExMhList.fwjyjg)) {
				$scope.showAlert("请输入正确的交易价格");
			} else if($scope.bdcxx.qlxxEx.bdbzqse == undefined || $scope.bdcxx.qlxxEx.bdbzqse === null || $scope.bdcxx.qlxxEx.bdbzqse === "" || !$dictUtilsService.number($scope.bdcxx.qlxxEx.bdbzqse)) {
				$scope.showAlert("请输入正确的被担保债权数额");
			} else if($scope.bdcxx.qlxxEx.zwlxqssj == undefined || $scope.bdcxx.qlxxEx.zwlxqssj === null || $scope.bdcxx.qlxxEx.zwlxqssj === "") {
				$scope.showAlert("请选择债务履行起始时间");
			} else if($scope.bdcxx.qlxxEx.zwlxjssj == undefined || $scope.bdcxx.qlxxEx.zwlxjssj === null || $scope.bdcxx.qlxxEx.zwlxjssj === "") {
				$scope.showAlert("请债务履行终止时间");
			} else if($scope.bdcxx.qlxxEx.sqdjyy == undefined || $scope.bdcxx.qlxxEx.sqdjyy === "") {
				$scope.showAlert("请输入申请登记原因");
			} else if(!$scope.verifyPersonData()) {

			} else {
				canSave = true;
			}
			return canSave;
		}
		//验证权利通知人数据
		$scope.verifyPersonData = function() {
			var canSave = true;
			if($scope.tzrxxList.length > 0) {
				for(var i = 0; i < $scope.tzrxxList.length; i++) {
					var tempData = $scope.tzrxxList[i];
					if(tempData.tzrmc == undefined || tempData.tzrmc === null || tempData.tzrmc === "") {
						$scope.showAlert("请输入联系人名称");
						canSave = false;
						break;
					} else if(tempData.tzdh == undefined || tempData.tzdh === null || tempData.tzdh === "" || !$dictUtilsService.phone(tempData.tzdh)) {
						$scope.showAlert("请输入正确的联系人电话");
						canSave = false;
						break;
					}
				}
				return canSave;
			}
		}

		$scope.showAlert = function(m) {
			ionicToast.show(m, 'middle', false, 2000);
		};
		//保存不动产信息
		$scope.addbdcxx = function(isApply) {
			$scope.bdcxx.id = $scope.qlxx.id; //权利信息唯一ID
			$scope.bdcxx.tzrxxList = $scope.tzrxxList; //写入权利通知人
			$scope.bdcxx.tzrxxList = $scope.bdcxx.tzrxxList.concat($scope.ywtzrxxList); //写入义务通知人
			$scope.ygdjzl.dyfs = $scope.ygdjzl.value;
			$scope.bdcxx.qlxxExMhList = $scope.qlxxExMhList1;
			console.log("不动产信息：");
			console.log($scope.bdcxx);
			//$scope.bdcxx.zwlxqssj = $filter('date')($scope.bdcxx.zwlxqssj, 'yyyy-MM-dd');//债务履行起始时间
			//$scope.bdcxx.zwlxjssj = $filter('date')($scope.bdcxx.zwlxjssj, 'yyyy-MM-dd');//债务履行终止时间
			if($scope.verifyDataNormal()) {
				//变更登记数据验证
				$scope.addbdcxxServer(isApply);
			}

		};
		//保存不动产信息
		$scope.addbdcxx = function(isApply) {
			$scope.bdcxx.id = $scope.qlxx.id; //权利信息唯一ID
			$scope.bdcxx.tzrxxList = $scope.tzrxxList; //写入权利通知人
			$scope.bdcxx.tzrxxList = $scope.bdcxx.tzrxxList.concat($scope.ywtzrxxList); //写入义务通知人
			$scope.ygdjzl.dyfs = $scope.ygdjzl.value;
			$scope.bdcxx.qlxxExMhList = $scope.qlxxExMhList1;
			if($scope.verifyDataNormal()) {
				//变更登记数据验证
				$wysqService.addbdcxx($scope.bdcxx)
					.then(function(res) {
						$scope.showAlert('保存不动产信息成功');
					}, function(res) {
						$scope.showAlert('保存失败');
					});
			}
		};
		/**
		 * 保存/提交不动产信息到服务器
		 * @param {Object} isApply 是否是提交
		 */
		$scope.addbdcxxServer = function(isApply) {
			$wysqService.addbdcxx($scope.bdcxx)
				.then(function(res) {
					$scope.showAlert('保存不动产信息成功');
					$scope.goFjList();
				}, function(res) {
					$scope.showAlert('保存失败');
				});
		}
		//跳转到附件列表
		$scope.goFjList = function() {
			$state.go('fjxz', {
				subFlowcode: $scope.qlxx.subFlowcode,
				id: $scope.qlxx.id
			}, {
				reload: true
			});
		};
		//下一步按钮
		$scope.save = $wysqService.bdcxxNext;
		//返回到申请人信息列表
		$scope.goback = function() {
			$ionicHistory.goBack();
		};

		//获取登记原因选项
		var serverReasons = $dictUtilsService.getDictinaryByType("登记原因").childrens;
		var localReasons = [];
		initReasons = function() {
			if(serverReasons != null && serverReasons.length > 0) {
				for(i = 0; i < serverReasons.length; i++) {
					var item = {
						text: serverReasons[i].value
					}
					localReasons.push(item);
				}
			}
		}
		initReasons();

		//登记原因选择
		$scope.selectReason = function() {
			$ionicActionSheet.show({
				cancelOnStateChange: true,
				cssClass: 'action_s',
				titleText: "请选择登记原因",
				addCancelButtonWithLabel: '取消',
				androidEnableCancelButton: true,
				buttons: localReasons,
				cancelText: '取消',
				cancel: function() {
					return true;
				},
				buttonClicked: function(index) {
					$scope.bdcxx.qlxxEx.sqdjyy = localReasons[index].text;
					return true;
				}
			});
		};
	}
]);