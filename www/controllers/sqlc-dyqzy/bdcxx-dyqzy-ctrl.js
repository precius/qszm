//不动产信息(抵押权转移登记)页面控制器
angular.module('bdcxxDyqzyCtrl', []).controller('bdcxxDyqzyCtrl', ["$scope", "ionicToast", "$stateParams", "$state", "$filter", "$ionicHistory", "$ionicActionSheet", "$wysqService", "$dictUtilsService", "$menuService", "$cordovaBarcodeScanner","$rootScope",
	function($scope, ionicToast, $stateParams, $state, $filter, $ionicHistory, $ionicActionSheet, $wysqService, $dictUtilsService, $menuService, $cordovaBarcodeScanner,$rootScope) {
		$scope.ywh = $stateParams.ywh;
		//判断是否可以编辑
		if($wysqService.djsqItemData.step == "NETAPPLYING" || $wysqService.djsqItemData.step == "NETNOPASS") {
			$scope.isShow = true;
		} else {
			$scope.isShow = false;
		}

		if(dyqdj_zxdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //抵押权注销登记，显示不动产登记证明号
			$scope.showZmh = true;
		} else {
			$scope.showZmh = false;
		}

		$("#date").on("input", function() {
			if($(this).val().length > 0) {
				$(this).addClass("full");
			} else {
				$(this).removeClass("full");
			}
		});

		$("#date1").on("input", function() {
			if($(this).val().length > 0) {
				$(this).addClass("full");
			} else {
				$(this).removeClass("full");
			}
		});

		$scope.imgData = [{
			src: require('../../theme/img_menu/zs3.png')
		}, {
			src: require('../../theme/img_menu/zs1.png')
		}, {
			src: require('../../theme/img_menu/zs2.png')
		}];

		//不动产信息模板提示框
		$scope.showTips = false;
		$scope.clickTips = function(n) {
			if(n == 0 || n == 1 || n == 2) {
				$scope.src = $scope.imgData[n].src;
				$scope.showTips = true;
			} else {
				$scope.showTips = false;
			}
		}

		//证件种类
		$scope.qlxx = {};
		$scope.bdcxx = {
			qlxxEx: {
				dyfs: "",
				dyfsLabel: ""
			}
		};
		//		$scope.dyfs = {};
		$scope.dyfsData = $dictUtilsService.getDictinaryByType("抵押方式").childrens;
		$scope.mode = $scope.dyfsData[0];
		//判断是一般抵押还是最高额抵押
		$scope.isFwzgedyqscdj = false;
		$scope.isFwybdyscdj = true;
		$scope.bdcxx.qlxxEx.dyfs = $scope.mode.value;

		//通过业务号获取业务信息，只需要接收ywh即可
		if($scope.ywh != null) {
			$wysqService.queryApplyByYwh({
				wwywh: $scope.ywh
			}).then(function(res) {
				if(res.success) {
					$scope.qlxx = res.data;
					$wysqService.djsqItemData = res.data;
					if($scope.showZmh) {
						$scope.bdcxx.bdcdjzmh = $wysqService.djsqItemData.bdcdjzmh;
					}
					if($scope.qlxx.qlxxEx !== null) {
						/*$scope.bdcxx.fwcqmj = $scope.qlxx.qlxxEx.fwcqmj;//房屋产权面积
						$scope.getDyfsByValue($scope.qlxx.qlxxEx.dyfs);//抵押方式
						$scope.bdcxx.bdbzqse = $scope.qlxx.qlxxEx.bdbzqse;//被担保债权数额
						$scope.bdcxx.zwlxqssj = new Date($scope.qlxx.qlxxEx.zwlxqssj);//债务履行起始时间
						$scope.bdcxx.zwlxjssj = new Date($scope.qlxx.qlxxEx.zwlxjssj);//债务履行终止时间
						$scope.bdcxx.sqdjyy = $scope.qlxx.qlxxEx.sqdjyy;//申请登记原因
						$scope.bdcxx.bdcqzh = $scope.qlxx.bdcqzh;//不动产权证号*/

						$scope.qlxxExMhList.fwcqmj = $scope.qlxx.qlxxEx.fwcqmj;
						//								$scope.getDyfsByValue($scope.qlxx.qlxxEx.dyfs);
						//$scope.bdcxx.qlxxEx.dyfs = $scope.qlxx.qlxxEx.dyfs;
						//console.log($scope.qlxx.qlxxEx.dyfs + $scope.bdcxx.qlxxEx.dyfs);
						//$scope.bdcxx.qlxxEx.dyfs = $scope.qlxx.qlxxEx.dyfs;
						if($scope.qlxx.qlxxEx.dyfs != null) {
							if($scope.qlxx.qlxxEx.dyfs == 1) {
								$scope.isFwybdyscdj = true;
								$scope.isFwzgedyqscdj = false;
							}
							if($scope.qlxx.qlxxEx.dyfs == 2) {
								$scope.isFwybdyscdj = false;
								$scope.isFwzgedyqscdj = true;
							}
							for(var i = 0; i < $scope.dyfsData.length; i++) {
								if($scope.dyfsData[i].value == $scope.qlxx.qlxxEx.dyfs) {
									$scope.mode = $scope.dyfsData[i];
								}
							}
						}
						$scope.bdcxx.qlxxEx.bdbzqse = $scope.qlxx.qlxxEx.bdbzqse;
						$scope.bdcxx.qlxxEx.zgzqse = $scope.qlxx.qlxxEx.zgzqse;
						$scope.bdcxx.qlxxEx.zgzqqdss = $scope.qlxx.qlxxEx.zgzqqdss;

						$scope.bdcxx.qlxxEx.zwlxqssj = new Date($scope.qlxx.qlxxEx.zwlxqssj);
						$scope.bdcxx.qlxxEx.zwlxjssj = new Date($scope.qlxx.qlxxEx.zwlxjssj);
						$scope.setDatePlaceHolder();
						$scope.bdcxx.qlxxEx.sqdjyy = $scope.qlxx.qlxxEx.sqdjyy;
						$scope.bdcxx.bdcqzh = $scope.qlxx.bdcqzh;
						if($scope.bdcxx.bdcqzh != undefined && $scope.bdcxx.bdcqzh != null && $scope.bdcxx.bdcqzh != "") {
							$scope.needShowMb = false;
						}
					}
					$scope.qlxxExMhList.bdcqzh = $scope.qlxx.bdcqzh;
					if($scope.qlxx.qlxxExMhs != undefined && $scope.qlxx.qlxxExMhs != null) {
						if($scope.qlxx.qlxxExMhs[0].bdcqzh != undefined && $scope.qlxx.qlxxExMhs[0].bdcqzh != null) {
							$scope.qlxxExMhList.bdcqzh = $scope.qlxx.qlxxExMhs[0].bdcqzh;
							$scope.needShowMb = false;
						}
						$scope.qlxxExMhList.zlProvince = $scope.qlxx.qlxxExMhs[0].zlProvince;
						$scope.qlxxExMhList.zlCity = $scope.qlxx.qlxxExMhs[0].zlCity;
						$scope.qlxxExMhList.zlArea = $scope.qlxx.qlxxExMhs[0].zlArea;
						$scope.qlxxExMhList.zl = $scope.qlxx.qlxxExMhs[0].zl;
						$scope.qlxxExMhList.fwcqmj = $scope.qlxx.qlxxExMhs[0].fwcqmj;
					}
					if($scope.qlxx.tzrxxes != undefined && $scope.qlxx.tzrxxes != null) {
						//区分权利人与债务人
						$scope.tzrxxList = [];
						$scope.ywtzrxxList = [];
						for(var i = 0; i < $scope.qlxx.tzrxxes.length; i++) {
							var temp = $scope.qlxx.tzrxxes[i];
							if(temp.tzrfl == "0") {
								$scope.tzrxxList.push(temp);
							} else if(temp.tzrfl == "1") {
								$scope.ywtzrxxList.push(temp);
							} else if(temp.tzrfl == "2") {
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

		$scope.selectMode = function(mode) {
			$scope.bdcxx.qlxxEx.dyfs = mode.value;
			if(mode.value == 1) {
				$scope.isFwybdyscdj = true;
				$scope.isFwzgedyqscdj = false;
			}
			if(mode.value == 2) {
				$scope.isFwybdyscdj = false;
				$scope.isFwzgedyqscdj = true;
			}
		}

		//		if($scope.isFwzgedyqscdj) {
		//			$scope.bdcxx.qlxxEx.dyfs = $scope.dyfsData[1].value;
		//			$scope.bdcxx.qlxxEx.dyfsLabel = $scope.dyfsData[1].description;
		//			$scope.dyfs = $scope.dyfsData[1];
		//		} else if($scope.isFwybdyscdj) {
		//			$scope.bdcxx.qlxxEx.dyfs = $scope.dyfsData[0].value;
		//			$scope.bdcxx.qlxxEx.dyfsLabel = $scope.dyfsData[0].description;
		//			$scope.dyfs = $scope.dyfsData[0];
		//		}
		//		$scope.getDyfsByValue = function(value) {
		//			for(var i = 0; i < $scope.dyfsData.length; i++) {
		//				var dyfsTemp = $scope.dyfsData[i];
		//				if(dyfsTemp.value == value) {
		//					$scope.bdcxx.qlxxEx.dyfs = dyfsTemp.description;
		//				}
		//			}
		//		}

		$scope.qlxxExMhList = {};
		$scope.qlxxExMhList1 = [];
		$scope.qlxxExMhList1[0] = $scope.qlxxExMhList;
		//模板选择
		$scope.bdcqzhMbData = $dictUtilsService.getBdcqzhMb();
		for(var i = 0; i < $scope.bdcqzhMbData.length; i++) {
			var model = $scope.bdcqzhMbData[i];
			if(model.name.indexOf('其他') != -1 || model.name.indexOf('二维码') != -1) {
				continue;
			}
			if(model.name.indexOf("***") == 0) {
				//先去掉开头的“***”，再用***分割
				var name = model.name.replace("***", "");
				model.keyWords = name.split("***");
			} else {
				model.keyWords = model.name.split("***");
			}
		}

		$scope.needShowMb = true;
		$scope.getbdcqzh = function() {
			var result = "";
			if($scope.needShowMb) {
				if($scope.bdcqzhMbData != undefined && $scope.bdcqzhMbData.length > 0) {
					for(var i = 0; i < $scope.bdcqzhMbData.length; i++) {
						var model = $scope.bdcqzhMbData[i];
						if(model.isSelected) {
							if(model.name.indexOf('其他') != -1 || model.name.indexOf('二维码') != -1) {
								result = $scope.bdcqzhMbData[3].inputs[0];
								return result;
							} else {
								result = model.name;
								for(var j = 0; j < model.inputs.length; j++) {
									var input = model.inputs[j];
									result = result.replace("***", input);
								}
								return result;
							}
						}
					}
				}
			} else {
				return $scope.bdcxx.bdcqzh;
			}
		}

		//		$scope.checkBdcqzhMb = function(name) {
		//			$scope.bdcxx.bdcqzh = name;
		//		}

		//通知人信息
		$scope.tzrxxList = [];
		//默认添加当前用户为通知人
		$scope.tzrxxList.push({
			index: '$scope.tzrxxList.length',
			tzrmc: mongoDbUserInfo.name,
			tzdh: mongoDbUserInfo.tel,
			tzrfl: '0'
		});

		//债务人通知人信息
		$scope.ywtzrxxList = [];
		//默认添加当前用户为义务人
		$scope.ywtzrxxList.push({
			index: '$scope.ywtzrxxList.length',
			tzrmc: mongoDbUserInfo.name,
			tzdh: mongoDbUserInfo.tel,
			tzrfl: '1'
		});
		$scope.ywtzrxxList.push({
			index: '$scope.ywtzrxxList.length',
			tzrmc: mongoDbUserInfo.name,
			tzdh: mongoDbUserInfo.tel,
			tzrfl: '2'
		});

		$scope.setDatePlaceHolder = function() {
			var dateinput = document.getElementById("date");
			var dateinput1 = document.getElementById("date1");
			if($scope.bdcxx.qlxxEx.zwlxqssj != null || $scope.bdcxx.qlxxEx.zwlxqssj != '' || $scope.bdcxx.qlxxEx.zwlxqssj != "") {
				$(dateinput).addClass('full');
			}
			if($scope.bdcxx.qlxxEx.zwlxjssj != null || $scope.bdcxx.qlxxEx.zwlxjssj != '' || $scope.bdcxx.qlxxEx.zwlxjssj != "") {
				$(dateinput1).addClass('full');
			}
		}

		//验证抵押权登记-首次登记-一般抵押数据保存信息
		$scope.verifyDataNormal = function() {
			var canSave = false;
			if($scope.bdcxx.bdcqzh == undefined || $scope.bdcxx.bdcqzh === null || $scope.bdcxx.bdcqzh === "") {
				$scope.showAlert("请输入正确的不动产权证号");
			} else if(!checkCQZH()) {
				$scope.showAlert("产权证号输入不完整！");
			} else if(!($scope.bdcxx.bdcdyh == undefined || $scope.bdcxx.bdcdyh === null || $scope.bdcxx.bdcdyh === "") && !$dictUtilsService.UnitNo($scope.bdcxx.bdcdyh)) {
				$scope.showAlert("请输入正确的不动产单元号");
			} else if($scope.qlxxExMhList.zl == undefined || $scope.qlxxExMhList.zl === null || $scope.qlxxExMhList.zl === "") {
				$scope.showAlert("请输入不动产坐落");
			} else if(!$dictUtilsService.number($scope.qlxxExMhList.fwcqmj) || $scope.qlxxExMhList.fwcqmj == undefined || $scope.qlxxExMhList.fwcqmj === "") {
				$scope.showAlert("请输入正确的房屋产权面积");
			} else if($scope.bdcxx.qlxxEx.dyfs == undefined || $scope.bdcxx.qlxxEx.dyfs === "") {
				$scope.showAlert("请输入抵押方式");
			} else if($scope.bdcxx.qlxxEx.bdbzqse == undefined || $scope.bdcxx.qlxxEx.bdbzqse === null || $scope.bdcxx.qlxxEx.bdbzqse === "" || !$dictUtilsService.number($scope.bdcxx.qlxxEx.bdbzqse)) {
				$scope.showAlert("请输入正确的被担保债权数额");
			} else if($scope.bdcxx.qlxxEx.zwlxqssj == undefined || $scope.bdcxx.qlxxEx.zwlxqssj === null || $scope.bdcxx.qlxxEx.zwlxqssj === "") {
				$scope.showAlert("请选择债务履行起始时间");
			} else if($scope.bdcxx.qlxxEx.zwlxjssj == undefined || $scope.bdcxx.qlxxEx.zwlxjssj === null || $scope.bdcxx.qlxxEx.zwlxjssj === "") {
				$scope.showAlert("请选择债务履行终止时间");
			} else if(!$scope.compareStartAndEndDate()) {
				$scope.showAlert("终止时间必须晚于起始时间！");
			} else if($scope.bdcxx.qlxxEx.sqdjyy == undefined || $scope.bdcxx.qlxxEx.sqdjyy === "") {
				$scope.showAlert("请输入申请登记原因");
			} else if($scope.showZmh && ($scope.bdcxx.bdcdjzmh == undefined || $scope.bdcxx.bdcdjzmh == null || $scope.bdcxx.bdcdjzmh == "")) {
				$scope.showAlert("请输入不动产登记证明号");
			} else {
				canSave = true;
			}
			return canSave;
		}

		//验证抵押权登记-首次登记-最高额抵押数据保存信息
		$scope.verifyDataBig = function() {
			var canSave = false;
			if($scope.bdcxx.bdcqzh == undefined || $scope.bdcxx.bdcqzh === null || $scope.bdcxx.bdcqzh === "") {
				$scope.showAlert("请输入正确的不动产权证号");
			} else if(!checkCQZH()) {
				$scope.showAlert("产权证号输入不完整！");
			} else if(!($scope.bdcxx.bdcdyh == undefined || $scope.bdcxx.bdcdyh === null || $scope.bdcxx.bdcdyh === "") && !$dictUtilsService.UnitNo($scope.bdcxx.bdcdyh)) {
				$scope.showAlert("请输入正确的不动产单元号");
			} else if($scope.qlxxExMhList.zl == undefined || $scope.qlxxExMhList.zl === null || $scope.qlxxExMhList.zl === "") {
				$scope.showAlert("请输入不动产坐落");
			} else if(!$dictUtilsService.number($scope.qlxxExMhList.fwcqmj) || $scope.qlxxExMhList.fwcqmj == undefined || $scope.qlxxExMhList.fwcqmj === "") {
				$scope.showAlert("请输入正确的房屋产权面积");
			} else if($scope.bdcxx.qlxxEx.dyfs == undefined || $scope.bdcxx.qlxxEx.dyfs === "") {
				$scope.showAlert("请输入抵押方式");
			} else if($scope.bdcxx.qlxxEx.zgzqse == undefined || $scope.bdcxx.qlxxEx.zgzqse === null || $scope.bdcxx.qlxxEx.zgzqse === "" || !$dictUtilsService.number($scope.bdcxx.qlxxEx.zgzqse)) {
				$scope.showAlert("请输入正确的最高债权数额");
			} else if($scope.bdcxx.qlxxEx.zwlxqssj == undefined || $scope.bdcxx.qlxxEx.zwlxqssj === null || $scope.bdcxx.qlxxEx.zwlxqssj === "") {
				$scope.showAlert("请选择债务履行起始时间");
			} else if($scope.bdcxx.qlxxEx.zwlxjssj == undefined || $scope.bdcxx.qlxxEx.zwlxjssj === null || $scope.bdcxx.qlxxEx.zwlxjssj === "") {
				$scope.showAlert("请选择债务履行终止时间");
			} else if(!$scope.compareStartAndEndDate()) {
				$scope.showAlert("终止时间必须晚于起始时间！");
			} else if($scope.bdcxx.qlxxEx.sqdjyy == undefined || $scope.bdcxx.qlxxEx.sqdjyy === "") {
				$scope.showAlert("请输入申请登记原因");
			} else if($scope.showZmh && ($scope.bdcxx.bdcdjzmh == undefined || $scope.bdcxx.bdcdjzmh == null || $scope.bdcxx.bdcdjzmh == "")) {
				$scope.showAlert("请输入不动产登记证明号");
			} else {
				canSave = true;
			}
			return canSave;
		}

		//检验产权证号每个空档是否都输入了
		checkCQZH = function() {
			for(var i = 0; i < $scope.bdcqzhMbData.length; i++) {
				if($scope.bdcqzhMbData[i].name.indexOf('其他') == -1 && $scope.bdcqzhMbData[i].name.indexOf('二维码') == -1 && $scope.bdcqzhMbData[i].isSelected) {
					for(var j = 0; j < $scope.bdcqzhMbData[i].inputs.length; j++) {
						var input = $scope.bdcqzhMbData[i].inputs[j];
						if(input == '' || input == "" || input == null) {
							return false;
						}
					}
				}
			}
			return true;
		}

		//比较起始时间和终止时间，终止时间必须晚于起始时间
		$scope.compareStartAndEndDate = function() {
			//$scope.bdcxx.qlxxEx.zwlxqssj 和 $scope.bdcxx.qlxxEx.zwlxjssj  做比较
			var startTime = $scope.bdcxx.qlxxEx.zwlxqssj.getTime();
			var endTime = $scope.bdcxx.qlxxEx.zwlxjssj.getTime();
			if(endTime <= startTime) {
				return false;
			} else {
				return true;
			}
		}

		//保存不动产信息
		$scope.addbdcxx = function(isApply) {
			if($scope.qlxxExMhList.bdcqzh != undefined && $scope.qlxxExMhList.bdcqzh != null && $scope.qlxxExMhList.bdcqzh != "") {
				$scope.bdcxx.bdcqzh = $scope.qlxxExMhList.bdcqzh;
			} else if($scope.bdcxx.bdcqzh == undefined || $scope.bdcxx.bdcqzh === null || $scope.bdcxx.bdcqzh === "") {
				$scope.bdcxx.bdcqzh = $scope.getbdcqzh();
			}
			$scope.bdcxx.id = $scope.qlxx.id; //权利信息唯一ID
			$scope.bdcxx.tzrxxList = $scope.tzrxxList; //写入权利通知人
			$scope.bdcxx.tzrxxList = $scope.bdcxx.tzrxxList.concat($scope.ywtzrxxList); //写入义务通知人
			$scope.qlxxExMhList.bdcqzh = $scope.bdcxx.bdcqzh;
			$scope.qlxxExMhList.bdcdyh = $scope.bdcxx.bdcdyh;
			$scope.bdcxx.qlxxExMhList = $scope.qlxxExMhList1;
			console.log("不动产信息：");
			console.log($scope.bdcxx);
			/*$scope.bdcxx.zwlxqssj = $filter('date')($scope.bdcxx.zwlxqssj, 'yyyy-MM-dd');//债务履行起始时间
			$scope.bdcxx.zwlxjssj = $filter('date')($scope.bdcxx.zwlxjssj, 'yyyy-MM-dd');//债务履行终止时间*/
			if($scope.isFwybdyscdj) {
				if($scope.verifyDataNormal()) {
					//变更登记数据验证
					$scope.addbdcxxServer(isApply);
				}
			} else if($scope.isFwzgedyqscdj) {
				if($scope.verifyDataBig()) {
					//变更登记数据验证
					$scope.addbdcxxServer(isApply);
				}
			}
		}

		//保存不动产信息
		$scope.savebdcxx = function(isApply) {
			if($scope.qlxxExMhList.bdcqzh != undefined && $scope.qlxxExMhList.bdcqzh != null && $scope.qlxxExMhList.bdcqzh != "") {
				$scope.bdcxx.bdcqzh = $scope.qlxxExMhList.bdcqzh;
			} else if($scope.bdcxx.bdcqzh == undefined || $scope.bdcxx.bdcqzh === null || $scope.bdcxx.bdcqzh === "") {
				$scope.bdcxx.bdcqzh = $scope.getbdcqzh();
			}
			$scope.bdcxx.id = $scope.qlxx.id; //权利信息唯一ID
			$scope.bdcxx.tzrxxList = $scope.tzrxxList; //写入权利通知人
			$scope.bdcxx.tzrxxList = $scope.bdcxx.tzrxxList.concat($scope.ywtzrxxList); //写入义务通知人
			$scope.qlxxExMhList.bdcqzh = $scope.bdcxx.bdcqzh;
			$scope.qlxxExMhList.bdcdyh = $scope.bdcxx.bdcdyh;
			$scope.bdcxx.qlxxExMhList = $scope.qlxxExMhList1;
			if($scope.isFwybdyscdj) {
				if($scope.verifyDataNormal()) {
					//变更登记数据验证
					$wysqService.addbdcxx($scope.bdcxx)
						.then(function(res) {
							$scope.showAlert('保存不动产信息成功');
						}, function(res) {
							$scope.showAlert('保存失败');
						});
				}
			} else if($scope.isFwzgedyqscdj) {
				if($scope.verifyDataBig()) {
					//变更登记数据验证
					$wysqService.addbdcxx($scope.bdcxx)
						.then(function(res) {
							$scope.showAlert('保存不动产信息成功');
						}, function(res) {
							$scope.showAlert('保存失败');
						});
				}
			}
		}

		/**
		 * 保存/提交不动产信息到服务器
		 * @param {Object} isApply 是否是提交
		 */
		$scope.addbdcxxServer = function(isApply) {
			$wysqService.addbdcxx($scope.bdcxx).then(function(res) {
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
		}

		//下一步按钮
		//		$scope.save = $wysqService.bdcxxNext;

		//返回到申请人信息列表
		$scope.goback = function() {
			$ionicHistory.goBack();
		}

		$scope.showAlert = function(m) {
			ionicToast.show(m, 'middle', false, 2000);
		}

		$scope.setUnSelected = function() {
			if($scope.bdcqzhMbData != undefined && $scope.bdcqzhMbData.length > 0) {
				for(var i = 0; i < $scope.bdcqzhMbData.length; i++) {
					$scope.bdcqzhMbData[i].isSelected = false;
				}
			}
		}

		if(platform == "mobile") {
			//调用二维码扫描
			$scope.scanStart = function() {
				$cordovaBarcodeScanner.scan().then(function(barcodeData) {
					if(barcodeData.cancelled) {
						console.log(barcodeData.cancelled);
					} else {
						$scope.barcodeData = barcodeData; // Success! Barcode data is here
						/*					var Request=new UrlSearch($scope.barcodeData.text);
											if(Request.subCode){
												$loginService.subCode = Request.subCode;
												$loginService.ywh = Request.ywh;
												$state.go('fjxzsm');
											}
											else{
												$scope.showAlert('扫描结果','请选择正确的上传文件二维码！');
											}*/
						var result = $scope.barcodeData.text;
						var str = result.split("$");
						$scope.bdcqzhMbData[3].inputs[0] = str[2];
						$scope.$apply();
						//$scope.showAlert('扫描结果',$scope.barcodeData);
					}
				}, function(error) {
					$scope.showAlert('扫描失败！');
				});
			};
		} else {
			//调用二维码扫描
			$wysqService.signature({
				url: signatureUrl
			}).then(function(res) {
				wx.config({
					debug: false,
					appId: res.data.appId,
					timestamp: res.data.timestamp,
					nonceStr: res.data.nonceStr,
					signature: res.data.signature,
					jsApiList: [
						'scanQRCode'
					],
				});
			}, function(res) {
				$scope.showAlert('网络请求失败！');
			});

			wx.ready(function() {
				$scope.scanStart = function() {
					wx.scanQRCode({
						needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
						scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
						success: function(res) {
							var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
							var str = result.split("$");
							$scope.bdcqzhMbData[3].inputs[0] = str[2];
							$scope.$apply();
						}
					});
				}
			});

			wx.error(function() {
				alert("签名失败");
			});
		}

		//选择产权证书类别
		$scope.checkBdcqzhMb = function() {
			$ionicActionSheet.show({
				cancelOnStateChange: true,
				cssClass: 'action_s',
				titleText: "请选择产权证书类别",
				addCancelButtonWithLabel: '取消',
				androidEnableCancelButton: true,
				buttons: [{
					text: $scope.bdcqzhMbData[0].name
				}, {
					text: $scope.bdcqzhMbData[1].name
				}, {
					text: $scope.bdcqzhMbData[2].name
				}, {
					text: $scope.bdcqzhMbData[4].name
				}, {
					text: $scope.bdcqzhMbData[3].name
				}],
				cancelText: '取消',
				cancel: function() {
					return true;
				},
				buttonClicked: function(index) {
					switch(index) {
						case 0:
							//设置没有被选中
							$scope.setUnSelected();
							$scope.bdcqzhMbData[0].isSelected = true;
							break;
						case 1:
							//设置没有被选中
							$scope.setUnSelected();
							$scope.bdcqzhMbData[1].isSelected = true;
							break;
						case 2: //设置没有被选中
							$scope.setUnSelected();
							$scope.bdcqzhMbData[2].isSelected = true;
							break;
						case 3: //设置没有被选中
							$scope.setUnSelected();
							$scope.bdcqzhMbData[3].isSelected = true;
							$scope.scanStart();
						case 4: //设置没有被选中
							$scope.setUnSelected();
							$scope.bdcqzhMbData[3].isSelected = true;
						default:
							break;
					}
					return true;
				}
			});
		}

		//获取登记原因选项
		var serverReasons = $dictUtilsService.getDictinaryByType("登记申请原因").childrens;
		var localReasons = [];
		if(serverReasons != null && serverReasons.length > 0) {
			for(i = 0; i < serverReasons.length; i++) {
				var item = {
					text: serverReasons[i].value
				}
				localReasons.push(item);
			}
		}

		//初始化申请登记原因
		$scope.bdcxx.qlxxEx.sqdjyy = $menuService.sqdjyy;

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
		}
		
		//2019.7.15新增悬浮按钮
		 $('#touch').on('touchmove', function(e) {

	        // 阻止其他事件
	        e.preventDefault();
	
	        // 判断手指数量
	        if (e.originalEvent.targetTouches.length == 1) {
	
	            // 将元素放在滑动位置
	            var touch = e.originalEvent.targetTouches[0];  
	
	            $("#touch").css({'left': touch.pageX + 'px',
	                'top': touch.pageY + 'px'});
	        }
    	});
		
		//悬浮按钮的点击事件
		$scope.floatingButtonClicked = function(){
			$menuService.id = 0;
			$menuService.level3FlowCode = $scope.qlxx.subFlowcode;
			$state.go('bsznDetail');
		}
		//2019.7.15新增悬浮按钮
		
		
		
		//2019.7.22新增坐落选择
		$scope.gotoZlxz = function(){
			$state.go('zlxz');
		}
		$rootScope.$on('zlxz', function(event, args) {
			$scope.qlxxExMhList.zl = args.zl;
			$scope.qlxxExMhList.zlArea = args.zlArea;
			$scope.qlxxExMhList.zlCity = args.zlCity;
			$scope.qlxxExMhList.zlProvince = args.zlProvince;
		});
		//2019.7.22新增坐落选择
	}
]);