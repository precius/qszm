//不动产信息页面控制器（林地_林权_林权首次登记）
angular.module('bdcxxLdLqLqscdjCtrl', []).controller('bdcxxLdLqLqscdjCtrl', ["$scope", "ionicToast", "$stateParams", "$state", "$filter", "$ionicHistory", "$wysqService", "$dictUtilsService",
	function($scope, ionicToast, $stateParams, $state, $filter, $ionicHistory, $wysqService, $dictUtilsService) {
		$scope.ywh = $stateParams.ywh;
		if($wysqService.djsqItemData.step == "NETAPPLYING" || $wysqService.djsqItemData.step == "NETNOPASS") {
			$scope.isShow = true;
		} else {
			$scope.isShow = false;
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
			name: '*国用（***）第***号'
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
		//是否分别持证
		$scope.sffbczData = [{
			"label": '是',
			"value": true
		}, {
			"label": '否',
			"value": false
		}];
		$scope.sffbczClass = $scope.sffbczData[0];
		$scope.checkSffbcz = function(value) {
			for(var i = 0; i < $scope.sffbczData.length; i++) {
				if(value === $scope.sffbczData[i].value) {
					$scope.sffbczClass = $scope.sffbczData[i];
					$scope.bdcxx.sffbcz = $scope.sffbczClass.value;
					console.log("是否分别持证：");
					console.log($scope.sffbczClass);
				}
			}
		}
		//林种
		var lzStr = "林种";
		$scope.lzData = $dictUtilsService.getDictinaryByType(lzStr).childrens;
		$scope.lzClass = $scope.lzData[0];
		$scope.checkLz = function(value) {
			for(var i = 0; i < $scope.lzData.length; i++) {
				if(value === $scope.lzData[i].value) {
					$scope.lzClass = $scope.lzData[i];
					$scope.bdcxx.lz = $scope.lzClass.value;
					console.log("林种：");
					console.log($scope.lzClass);
				}
			}
		}
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
								//						$scope.bdcxx.ldmj = $scope.qlxx.qlxxEx.ldmj;//林地面积
								//						$scope.checkLz($scope.qlxx.qlxxEx.lz);//林种
								//						$scope.checkSffbcz($scope.qlxx.qlxxEx.sffbcz);//初始化是否分别持证
								$scope.bdcxx.qlxxEx.sqdjyy = $scope.qlxx.qlxxEx.sqdjyy; //申请登记原因
								$scope.bdcxx.qlxxEx.ldmj = $scope.qlxx.qlxxEx.ldmj;
							}
							if($scope.qlxx.qlxxExMhs != undefined && $scope.qlxx.qlxxExMhs != null) {
								$scope.qlxxExMhList.zl = $scope.qlxx.qlxxExMhs[0].zl;
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
		//验证首次登记数据保存信息
		$scope.verifyDataBgdj = function() {
			var canSave = false;
			//		if($scope.bdcxx.bdcqzh == undefined || $scope.bdcxx.bdcqzh === null || $scope.bdcxx.bdcqzh === "" || !$dictUtilsService.CertificationNo($scope.bdcxx.bdcqzh)){
			//			$scope.showAlert( "请输入正确的不动产权证号");
			//		}else if(!($scope.bdcxx.bdcdyh == undefined || $scope.bdcxx.bdcdyh === null || $scope.bdcxx.bdcdyh === "")&&!$dictUtilsService.UnitNo($scope.bdcxx.bdcdyh)){
			//			$scope.showAlert( "请输入正确的不动产单元号");
			//		}else 
			if($scope.qlxxExMhList.zl == undefined || $scope.qlxxExMhList.zl === null || $scope.qlxxExMhList.zl === "") {
				$scope.showAlert("请输入不动产坐落");
			} else if(!$dictUtilsService.number($scope.bdcxx.qlxxEx.ldmj) || $scope.bdcxx.qlxxEx.ldmj == undefined || $scope.bdcxx.qlxxEx.ldmj === "") {
				$scope.showAlert("请输入正确的林地面积");
			} else if($scope.bdcxx.qlxxEx.sqdjyy == undefined || $scope.bdcxx.qlxxEx.sqdjyy === "") {
				$scope.showAlert("请输入申请登记原因");
			} else {
				canSave = true;
			}
			return canSave;
		}

		$scope.showAlert = function(m) {
			ionicToast.show(m, 'middle', false, 2000);
		};
		//保存不动产信息
		$scope.addbdcxx = function(isApply) {
			$scope.bdcxx.id = $scope.qlxx.id; //权利信息唯一ID
			$scope.bdcxx.tzrxxList = $scope.tzrxxList; //写入权利通知人
			$scope.bdcxx.tzrxxList = $scope.bdcxx.tzrxxList.concat($scope.ywtzrxxList); //写入义务通知人
			$scope.bdcxx.qlxxExMhList = $scope.qlxxExMhList1;
			console.log("不动产信息：");
			console.log($scope.bdcxx);
			//过滤器格式化
			//$scope.bdcxx.gfhtqdrq = $filter('date')($scope.bdcxx.gfhtqdrq, 'yyyy-MM-dd');
			if($scope.verifyDataBgdj()) { //首次登记数据验证
				$scope.addbdcxxServer(isApply);
			}

		};
		//保存不动产信息
		$scope.savebdcxx = function(isApply) {
			$scope.bdcxx.id = $scope.qlxx.id; //权利信息唯一ID
			$scope.bdcxx.tzrxxList = $scope.tzrxxList; //写入权利通知人
			$scope.bdcxx.tzrxxList = $scope.bdcxx.tzrxxList.concat($scope.ywtzrxxList); //写入义务通知人
			$scope.bdcxx.qlxxExMhList = $scope.qlxxExMhList1;
			if($scope.verifyDataBgdj()) { //首次登记数据验证
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