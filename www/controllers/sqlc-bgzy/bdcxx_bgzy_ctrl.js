//合并流程 转移+抵押 不动产信息页面控制器
angular.module('bdcxxBgzyCtrl', []).controller('bdcxxBgzyCtrl', ["$scope", "ionicToast", "$stateParams", "$state", "$filter", "$ionicHistory", "$ionicActionSheet", "$wysqService", "$dictUtilsService", "$menuService", "$cordovaBarcodeScanner","$rootScope",
	function($scope, ionicToast, $stateParams, $state, $filter, $ionicHistory, $ionicActionSheet, $wysqService, $dictUtilsService, $menuService, $cordovaBarcodeScanner,$rootScope) {
		$scope.ywh = $stateParams.ywh;
		//判断是否可以编辑
		if($wysqService.djsqItemData.step == "NETAPPLYING" || $wysqService.djsqItemData.step == "NETNOPASS") {
			$scope.canEdit = true;
		} else {
			$scope.canEdit = false;
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
		$scope.qlxx = {};//全部信息
		$scope.bdcdjzmh = '';
		$scope.qlxxEx = {};
		$scope.qlxxExMh = {};
		$scope.qlxxExMhList = [];
		$scope.qlxxExMhList[0] = $scope.qlxxExMh;
		
	
		

		//通过业务号获取业务信息，只需要接收ywh即可
		if($scope.ywh != null) {
			$wysqService.queryApplyByYwh({
				wwywh: $scope.ywh
			}).then(function(res) {
				if(res.success) {
					$scope.qlxx = res.data;
					$wysqService.djsqItemData = res.data;
					if($scope.showZmh) {
						$scope.bdcdjzmh = $wysqService.djsqItemData.bdcdjzmh;
					}
					if($scope.qlxx.children[0].qlxxEx !== null) {
						$scope.qlxxEx = $scope.qlxx.children[0].qlxxEx;
					}
			
					if($scope.qlxx.children[0].qlxxExMhs != undefined && $scope.qlxx.children[0].qlxxExMhs != null) {
						$scope.qlxxExMh = $scope.qlxx.children[0].qlxxExMhs[0];
						if($scope.qlxxExMh.bdcqzh != undefined && $scope.qlxxExMh.bdcqzh != null && $scope.qlxxExMh.bdcqzh != "") {
							$scope.needShowMb = false;
						}
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
				return $scope.qlxxExMh.bdcqzh;
			}
		}

		//		$scope.checkBdcqzhMb = function(name) {
		//			$scope.qlxxExMh.bdcqzh = name;
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


		//验证抵押权登记-首次登记-一般抵押数据保存信息
		$scope.verifyDataNormal = function() {
			var canSave = false;
			if($scope.qlxxExMh.bdcqzh == undefined || $scope.qlxxExMh.bdcqzh === null || $scope.qlxxExMh.bdcqzh === "") {
				$scope.showAlert("请输入正确的不动产权证号");
			} else if(!checkCQZH()) {
				$scope.showAlert("产权证号输入不完整！");
			} else if(!($scope.qlxxExMh.bdcdyh == undefined || $scope.qlxxExMh.bdcdyh === null || $scope.qlxxExMh.bdcdyh === "") && !$dictUtilsService.UnitNo($scope.qlxxExMh.bdcdyh)) {
				$scope.showAlert("请输入正确的不动产单元号");
			} else if($scope.qlxxExMh.zl == undefined || $scope.qlxxExMh.zl === null || $scope.qlxxExMh.zl === "") {
				$scope.showAlert("请输入不动产坐落");
			} else if(!$dictUtilsService.number($scope.qlxxExMh.fwcqmj) || $scope.qlxxExMh.fwcqmj == undefined || $scope.qlxxExMh.fwcqmj === "") {
				$scope.showAlert("请输入正确的房屋产权面积");
			} else if($scope.qlxxEx.sqdjyy == undefined || $scope.qlxxEx.sqdjyy === "") {
				$scope.showAlert("请输入申请登记原因");
			} else if($scope.showZmh && ($scope.bdcdjzmh == undefined || $scope.bdcdjzmh == null || $scope.bdcdjzmh == "")) {
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

		//保存不动产信息
		$scope.addbdcxx = function(isApply) {
			if($scope.qlxxExMh.bdcqzh != undefined && $scope.qlxxExMh.bdcqzh != null && $scope.qlxxExMh.bdcqzh != "") {
				$scope.qlxxExMh.bdcqzh = $scope.qlxxExMh.bdcqzh;
			} else if($scope.qlxxExMh.bdcqzh == undefined || $scope.qlxxExMh.bdcqzh === null || $scope.qlxxExMh.bdcqzh === "") {
				$scope.qlxxExMh.bdcqzh = $scope.getbdcqzh();
			}
			$scope.tzrxxList = $scope.tzrxxList.concat($scope.ywtzrxxList); //写入义务通知人
			
			/*$scope.bdcxx.zwlxqssj = $filter('date')($scope.bdcxx.zwlxqssj, 'yyyy-MM-dd');//债务履行起始时间
			$scope.bdcxx.zwlxjssj = $filter('date')($scope.bdcxx.zwlxjssj, 'yyyy-MM-dd');//债务履行终止时间*/
			if($scope.verifyDataNormal()) {
				//变更登记数据验证
				$scope.addbdcxxServer(isApply);
			}
		}

		//保存不动产信息
		$scope.savebdcxx = function(isApply) {
			if($scope.qlxxExMh.bdcqzh == undefined || $scope.qlxxExMh.bdcqzh === null || $scope.qlxxExMh.bdcqzh === "") {
				$scope.qlxxExMh.bdcqzh = $scope.getbdcqzh();
			}
			
		
			$scope.tzrxxList = $scope.tzrxxList.concat($scope.ywtzrxxList); //写入义务通知人
			var param = {
				qlxxChildDtoList: [{
//					bdcdjzmh: $scope.bdcdjzmh,
					qlxxEx: $scope.qlxxEx,
					tzrxxes: $scope.tzrxxList,
					qlxxExMhs: [$scope.qlxxExMh],
					ywh: $wysqService.djsqItemData.ywh[0],

				}],
				wwywh: $wysqService.djsqItemData.wwywh
			}

			if($scope.verifyDataNormal()) {
				//变更登记数据验证
				$wysqService.addbdcxx(param)
					.then(function(res) {
						$scope.showAlert('保存不动产信息成功');
					}, function(res) {
						$scope.showAlert('保存失败');
					});
			}
		}

		/**
		 * 保存/提交不动产信息到服务器
		 * @param {Object} isApply 是否是提交
		 */
		$scope.addbdcxxServer = function(isApply) {
			var param = {
				qlxxChildDtoList: [{
//					bdcdjzmh: $scope.bdcdjzmh,
					qlxxEx: $scope.qlxxEx,
					tzrxxes: $scope.tzrxxList,
					qlxxExMhs: [$scope.qlxxExMh],
					ywh: $wysqService.djsqItemData.ywh[0],

				}],
				wwywh: $wysqService.djsqItemData.wwywh
			}
			$wysqService.addbdcxx(param).then(function(res) {
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
		$scope.qlxxEx.sqdjyy = $menuService.sqdjyy;

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
					$scope.qlxxEx.sqdjyy = localReasons[index].text;
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
			$scope.qlxxExMh.zl = args.zl;
			$scope.qlxxExMh.zlArea = args.zlArea;
			$scope.qlxxExMh.zlCity = args.zlCity;
			$scope.qlxxExMh.zlProvince = args.zlProvince;
		});
		//2019.7.22新增坐落选择
	}
]);