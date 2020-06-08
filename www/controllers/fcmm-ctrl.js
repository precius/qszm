angular.module('fcmmCtrl', []).controller('fcmmCtrl', ["$scope", "ionicToast", "$ionicHistory", "$state", "$menuService", "$ionicPopup", "$wysqService", "$bsznService", "$wyyyService", "$dictUtilsService", "$loginService", "$ionicActionSheet",
	function($scope, ionicToast, $ionicHistory, $state, $menuService, $ionicPopup, $wysqService, $bsznService, $wyyyService, $dictUtilsService, $loginService, $ionicActionSheet) {
		//调用微信人脸识别之前进行签名
		var appId = null;
		$dictUtilsService.signature(function(res) {
			appId = res.data.appId;
		});
		//房产买卖数据
		$scope.data0 = angular.copy($menuService.fcmm);
		if($scope.data0 != null && $scope.data0.length > 0) {
			for(var i = 0; i < $scope.data0.length; i++) {
				var str = $scope.data0[i].name.split("#");
				$scope.data0[i].name = str[0];
				if(str.length > 1) {
					$scope.data0[i].name1 = str[1];
				}
			}
			$scope.data = $scope.data0;
		}
		console.log($scope.data);
		//图片地址
		$scope.imgData = [{
			src: require('../theme/img_menu/menu-wsyy.png')
		}, {
			src: require('../theme/img_menu/menu-wssq.png')
		}, {
			src: require('../theme/img_menu/menu-bszn.png')
		}, {
			src: require('../theme/img_menu/menu-sqcl.png')
		}];
		//返回上一个页面
		$scope.goback = function() {
			$ionicHistory.goBack();
		};
		//提示对话框
		$scope.showAlert = function(msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		};

		var bsdtData = [];

		selectBsdt = function(res1) {
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
							$bsznService.getBsznDetail({
									subcfgId: $menuService.id
								})
								.then(function(res) {
									$wysqService.yssx = res.data.yssx;
									console.log($wysqService.yssx);
								}, function(error) {
									console.log("请求失败");
								});
							$scope.sqxx = {
								djjg: bsdtData[index].djjg, //机构代码
								djjgmc: bsdtData[index].jgmc, //登记机构名称
								bdclb: res1.data.bdclb, //不动产类别
								bsdtCode: bsdtData[index].officeCode, //办事大厅
								bsdtName: bsdtData[index].officeName, //办事大厅
								flowCode: res1.data.flowCode, //流程代码
								flowName: res1.data.flowName, //流程名称
								subFlowCode: res1.data.subFlowCode, //子流程代码
								subFlowName: res1.data.subFlowName, //子流程名称
								netFlowCode: res1.data.netFlowCode, //网络流程代码
								djdl: res1.data.djdl, //登记大类
								qllx: res1.data.qllx, //权利类型
								sqrlx: mongoDbUserInfo.userCategory, //申请人类型
								userId: mongoDbUserInfo.id //用户ID
							};

							//show("正在提交数据");
							//提交区域信息数据
							$wysqService.saveSqxx($scope.sqxx)
								.then(function(res) {
									if(res.success) {
										console.log("保存区域信息成功");
										$wysqService.djsqItemData = res.data;
										console.log($wysqService.djsqItemData);
										// $state.go('sqrxx',{"stateGo":'djsq'});
										$state.go('djsqxz');
									}
									//hide();
								}, function(res) {
									console.log(res.message);
									console.log("获取失败");
									//hide();
								})
							return true;
						}
					});
				}
			});
		}
		$scope.lastTime = 0;

		//跳转到我要预约业务
		$scope.gotoyw = function(item) {
			/*防止快速点击，hewen 2019.03.11*/
			var time = new Date().getTime();
			if(time - $scope.lastTime < 2000) {
				return;
			};
			$scope.lastTime = time;
			/*防止快速点击，hewen 2019.03.11*/

			$menuService.matchSubflow({
					id: item.id,
					areaCode: $menuService.code
				})
				.then(function(res) {
					if(res.success) {
						//保存三级流程id
						$menuService.id = res.data.id;
						if(item.name === "办事指南") {
							$menuService.flag = 0;
							$state.go('bsznDetail');
						} else if(item.name === "申请材料") {
							$state.go('sqcl');
						} else {
							$menuService.getSubFlowConfigInfo({
									id: res.data.id
								})
								.then(function(res) {
									if(res.success) {
										$menuService.ywdata = res.data;
										console.log(res.data);
										if(item.name === "网上自助申请") {
											if($dictUtilsService.isLogin()) {
												if(!$dictUtilsService.isCertification()) {
													//$scope.showAlert('提示', "该业务需要在个人中心实名认证！");
													$scope.showConfirm1('提示', '确认', '取消', "请先实名认证再办理业务！");
													return;
												} else {
													//实名认证过了，调用微信人脸识别
													if(needWxFaceVerify) {
														$dictUtilsService.wxface(function(data) {
															selectBsdt(res);
														}, appId, mongoDbUserInfo.name, mongoDbUserInfo.zjh);
													} else {
														selectBsdt(res);
													}

												}
											} else {
												$scope.showConfirm('提示', '确认', '取消', "请先登录再办理业务");
											}

											//$state.go('yyxz');
										} else if(item.name === "网上预约") {
											if($dictUtilsService.isLogin()) {
												if(!$dictUtilsService.isCertification()) {
													$scope.showConfirm1('提示', '确认', '取消', "请先实名认证再办理业务！");
													//$scope.showAlert('提示', "该业务需要在个人中心实名认证！");
													return;
												} else {
													//实名认证过了，调用微信人脸识别
													if(needWxFaceVerify) {
														$dictUtilsService.wxface(function(data) {
															$wyyyService.yysx = $menuService.ywdata.name;
															$wyyyService.yysxid = $menuService.ywdata.id;
															$wyyyService.yysxChoosable = false;
															$state.go('yyxz');
														}, appId, mongoDbUserInfo.name, mongoDbUserInfo.zjh);
													} else {
														$wyyyService.yysx = $menuService.ywdata.name;
														$wyyyService.yysxid = $menuService.ywdata.id;
														$wyyyService.yysxChoosable = false;
														$state.go('yyxz');
													}

												}
											} else {
												$scope.showConfirm('提示', '确认', '取消', "请先登录再办理业务");
											}
										}
									}
								}, function(res) {
									$scope.showAlert(res.message);
								});
						}
					}
				}, function(res) {
					$scope.showAlert(res.message);
				});
		}

		//跳转登录对话框
		$scope.showConfirm = function(titel, okText, cancelText, contentText) {
			var confirmPopup = $ionicPopup.confirm({
				title: titel,
				okText: okText,
				cancelText: cancelText,
				content: contentText
			});
			confirmPopup.then(function(res) {
				if(res) {
					$loginService.flag = 0;
					$state.go('login', {
						'fromPosition': 'fcmm'
					});
				} else {

				}
			});
		};
		//实名认证跳转登录对话框
		$scope.showConfirm1 = function(titel, okText, cancelText, contentText) {
			var confirmPopup = $ionicPopup.confirm({
				title: titel,
				okText: okText,
				cancelText: cancelText,
				content: contentText
			});
			confirmPopup.then(function(res) {
				if(res) {
					$state.go('mine-certificate');
				} else {

				}
			});
		};
	}
]);