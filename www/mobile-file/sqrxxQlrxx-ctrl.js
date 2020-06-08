angular.module('sqrxxQlrxxCtrl', []).controller('sqrxxQlrxxCtrl', ["$scope", "ionicToast", "$stateParams", "$state", "$ionicHistory", "$wysqService", "$dictUtilsService", "$fjxzUtilsService", "$ionicPopup", "$rootScope", "$ionicLoading", "$menuService",
	function($scope, ionicToast, $stateParams, $state, $ionicHistory, $wysqService, $dictUtilsService, $fjxzUtilsService, $ionicPopup, $rootScope, $ionicLoading, $menuService) {
		if($wysqService.djsqItemData.step == "NETAPPLYING" || $wysqService.djsqItemData.step == "NETNOPASS") {
			$scope.isShow = true;
		} else {
			$scope.isShow = false;
		}
		//	$scope.goback = function() {
		//		$ionicHistory.goBack(); //返回上一个页面
		//	};
		//权利人种类
		$scope.qlrtitle = $menuService.qlr;
		//权利人Id
		$scope.id = $stateParams.id;
		$scope.qlr = {};
		//权利人名称
		$scope.qlrmc = {
			name: '权利人名称',
			placeholder: '请输入权利人名称'
		}
		//判断是否是抵押
		var needUploadTwoPhoto = false;
		var isDy = dyqdj_scdj_flowCode == $wysqService.djsqItemData.netFlowdefCode ? true : false;
		if(isDy) { //抵押
			$scope.qlrmc.name = '银行名称';
			$scope.qlrmc.placeholder = '请输入银行名称';
			$scope.zm = "法人身份证明和营业执照照片"
			needUploadTwoPhoto = true;
		}
		//权利人类型
		var qlrlxStr = "权利人类型";
		$scope.qlrlxData = $dictUtilsService.getDictinaryByType(qlrlxStr).childrens;
		if($scope.qlrtitle == "银行") {
			$scope.qlrlx = $scope.qlrlxData[1];
		} else {
			$scope.qlrlx = $scope.qlrlxData[0];
		}

		if($scope.qlrlx.value == "1") {
			$scope.zm = "身份证明照片";
			needUploadTwoPhoto = false;
		} else {
			$scope.zm = "法人身份证明和营业执照照片";
			needUploadTwoPhoto = true;
		}

		$scope.getQlrlxByValue = function(value) {
			for(var i = 0; i < $scope.qlrlxData.length; i++) {
				var temp = $scope.qlrlxData[i];
				if(temp.value == value) {
					$scope.qlrlx = temp;
				}
			}
			if($scope.qlrlx.value == "1") {
				$scope.zm = "身份证明照片";
				needUploadTwoPhoto = false;
			} else {
				$scope.zm = "法人身份证明和营业执照照片";
				needUploadTwoPhoto = true;
			}
		}
		//权利人分类
		var qlrflStr = "权利人分类";
		$scope.qlrfl = {};
		$scope.qlrflData = [];
		$scope.qlrflDataAll = $dictUtilsService.getDictinaryByType(qlrflStr).childrens;
		$scope.getQlrflByValue = function(value) {
			for(var i = 0; i < $scope.qlrflData.length; i++) {
				var temp = $scope.qlrflData[i];
				if(temp.value == value) {
					$scope.qlrfl = temp;
				}
			}
		}
		//OCR获取信息返回并且刷新
		$rootScope.$on('ocr-back', function(event, args) {
			//从OCR返回
			if(args.index == 0) {
				$scope.qlr = args.jsonObj;
				$scope.qlr.qlrmc = args.name;
				$scope.qlr.zjh = args.num;
			} else if(args.index == 1) {
				$scope.qlr = args.jsonObj;
				$scope.qlr.dlrmc = args.name;
				$scope.qlr.dlrzjh = args.num;
			}
			$scope.initZjlx();
			$scope.initGyfs();
			$scope.getQlrflByValue($scope.qlr.category);
			$scope.getQlrlxByValue($scope.qlr.qlrlx); //权利人类型
		});
		//使用ocr获取权利人信息
		$scope.qlrtoocr = function() {
			$state.go('ocr', {
				"index": 0,
				"jsonObj": $scope.qlr
			}, {
				reload: true
			});
		};
		//使用ocr获取权利人代理人信息
		$scope.qlrdlrtoocr = function() {
			$state.go('ocr', {
				"index": 1,
				"jsonObj": $scope.qlr
			}, {
				reload: true
			});
		};
		//编辑
		$scope.qlrBjtoocr = function() {
			$state.go('ocr', {
				"id": $scope.id,
				"index": 0,
				"jsonObj": $scope.qlr
			}, {
				reload: true
			});
		};
		//使用ocr获取权利人代理人信息
		$scope.qlrdlrBjtoocr = function() {
			$state.go('ocr', {
				"id": $scope.id,
				"index": 1,
				"jsonObj": $scope.qlr
			}, {
				reload: true
			});
		};
		//证件种类
		var zjzlStr = "证件种类";
		$scope.zjzl = {};
		$scope.zjzlData = $dictUtilsService.getDictinaryByType(zjzlStr).childrens;

		//代理人证件种类
		$scope.dlrzjzl = {};
		$scope.dlrzjzlData = $dictUtilsService.getDictinaryByType(zjzlStr).childrens;

		//共有方式
		var gyfsStr = '共有方式';
		$scope.gyfs = {};
		$scope.gyfsData = $dictUtilsService.getDictinaryByType(gyfsStr).childrens;

		//初始化证件种类
		$scope.initZjlx = function() {
			if($scope.zjzlData != null && $scope.zjzlData.length > 0) {
				$scope.zjzl = $scope.zjzlData[0];
				if(isDy) {
					$scope.zjzl = $scope.zjzlData[6];
				}
				for(var i = 0; i < $scope.zjzlData.length; i++) {
					var zjzlTemp = $scope.zjzlData[i];
					if(zjzlTemp.value == $scope.qlr.zjzl) {
						$scope.zjzl = zjzlTemp;
					}
				}
			}
		}

		//选择证件种类
		$scope.checkZjlx = function(value) {
			for(var i = 0; i < $scope.zjzlData.length; i++) {
				if(value === $scope.zjzlData[i].value) {
					$scope.zjzl = $scope.zjzlData[i];
					console.log("证件类型：");
					console.log($scope.zjzl);
				}
			}
		}
		//初始化共有方式
		$scope.initGyfs = function() {
			if($scope.gyfsData != null && $scope.gyfsData.length > 0) {
				$scope.gyfs = $scope.gyfsData[0];
				for(var i = 0; i < $scope.gyfsData.length; i++) {
					var gyfsTemp = $scope.gyfsData[i];
					if(gyfsTemp.value == $scope.qlr.gyfs) {
						$scope.gyfs = gyfsTemp;
					}
				}
				//共有情况
				$scope.qlr.gyqk = $scope.gyfs.label;
				//只有共有方式为"按份共有"才需要显示权力比例
				if("按份共有" == $scope.gyfs.label) {
					$scope.isShowQlbl = true;
				} else {
					$scope.isShowQlbl = false;
				}
			}
		}
		//选择共有方式
		$scope.checkGyfs = function(value) {
			for(var i = 0; i < $scope.gyfsData.length; i++) {
				if(value === $scope.gyfsData[i].value) {
					$scope.gyfs = $scope.gyfsData[i];
					//共有情况
					$scope.qlr.gyqk = $scope.gyfs.label;
					//只有共有方式为"按份共有"才需要显示权力比例
					if("按份共有" == $scope.gyfs.label) {
						$scope.isShowQlbl = true;
					} else {
						$scope.isShowQlbl = false;
					}
				}
			}
		}
		//附件种类列表：一个二维数组,每个种类中包含多个附件
		$scope.fjzl = {};
		$scope.fjzl.filelist = [];
		//根据子流程代码获取附件类型列表
		$scope.getFjlist = function(m, zjhTemp) {
			$wysqService.getfjlxlist({
					subCode: m
				})
				.then(function(res) {
					if(res.success) {
						$wysqService.fjlxlist = res.data;
						if($wysqService.fjlxlist != undefined && $wysqService.fjlxlist.length > 0) {
							for(var i = 0; i < $wysqService.fjlxlist.length; i++) {
								var fjlxTemp = $wysqService.fjlxlist[i];
								if(fjlxTemp.clmc.indexOf("身份证" != -1)) {
									$scope.fjzl = $wysqService.fjlxlist[i];
									break;
								}
							}
						}
						$scope.fjzl.filelist = [];
						$scope.getFj(zjhTemp);
						console.log($wysqService.fjlxlist);
					}
				}, function(res) {});
		};
		//根据权利人ID获取权利人信息
		if($scope.id != null) {
			$wysqService.getqlrByqlrId({
					id: $scope.id
				})
				.then(function(res) {
					if(res.success) {
						console.log("获取权利人信息成功");
						$scope.qlr = res.data;
						$scope.initZjlx();
						$scope.initGyfs();
						$scope.getQlrflByValue($scope.qlr.category);
						$scope.getQlrlxByValue($scope.qlr.qlrlx); //权利人类型
						$scope.getFjlist($wysqService.djsqItemData.subFlowcode, $scope.qlr.zjh);
					} else {
						console.log("获取权利人信息失败");
					}
				}, function(res) {
					console.log(res.message);
					console.log("获取权利人信息失败");
				});
		} else {
			$scope.initZjlx();
			$scope.initGyfs();
			$scope.getQlrflByValue($scope.qlr.category);
			$scope.getQlrlxByValue($scope.qlr.qlrlx); //权利人类型
			$scope.getFjlist($wysqService.djsqItemData.subFlowcode, -1);
		}
		//验证数据保存信息
		$scope.verifyYwData = function() {
			var canSave = false;
			var needUploadData = $fjxzUtilsService.getUploadData($scope.fjzl); //需要上传的照片
			if($scope.qlr.qlrmc == undefined || $scope.qlr.qlrmc === null || $scope.qlr.qlrmc === "" || $dictUtilsService.hasNum($scope.qlr.qlrmc)) {
				$scope.showAlert("请输入正确的权利人姓名");
			} else if($scope.qlr.zjzl == undefined || $scope.qlr.zjzl === null || $scope.qlr.zjzl === "") {
				$scope.showAlert("请选择证件种类");
			} else if($scope.qlr.zjh == undefined || $scope.qlr.zjh === null || $scope.qlr.zjh === "") {
				$scope.showAlert("请输入证件号码");
			} else if(!($scope.qlr.zjh == undefined || $scope.qlr.zjh === null || $scope.qlr.zjh === "") && !$dictUtilsService.idcard($scope.qlr.zjh) && $scope.qlr.zjzl == 1) {
				$scope.showAlert("请输入正确的证件号码");
			} else if(!($scope.qlr.zjh == undefined || $scope.qlr.zjh === null || $scope.qlr.zjh === "") && !$dictUtilsService.gaIdcard($scope.qlr.zjh) && $scope.qlr.zjzl == 2) {
				$scope.showAlert("请输入正确的港澳台证件号");
			} else if(!($scope.qlr.zjh == undefined || $scope.qlr.zjh === null || $scope.qlr.zjh === "") && !$dictUtilsService.isPassPortCard($scope.qlr.zjh) && $scope.qlr.zjzl == 3) {
				$scope.showAlert("请输入正确的护照号码");
			} else if(!($scope.qlr.zjh == undefined || $scope.qlr.zjh === null || $scope.qlr.zjh === "") && !$dictUtilsService.isAccountCard($scope.qlr.zjh) && $scope.qlr.zjzl == 4) {
				$scope.showAlert("请输入正确的户口簿号码");
			} else if(!($scope.qlr.zjh == undefined || $scope.qlr.zjh === null || $scope.qlr.zjh === "") && !$dictUtilsService.isOfficerCard($scope.qlr.zjh) && $scope.qlr.zjzl == 5) {
				$scope.showAlert("请输入正确的军官证号码");
			} else if(!($scope.qlr.zjh == undefined || $scope.qlr.zjh === null || $scope.qlr.zjh === "") && !$dictUtilsService.orgcodevalidate($scope.qlr.zjh) && $scope.qlr.zjzl == 6) {
				$scope.showAlert("请输入正确的组织机构代码");
			} else if(!($scope.qlr.zjh == undefined || $scope.qlr.zjh === null || $scope.qlr.zjh === "") && !$dictUtilsService.checkLicense($scope.qlr.zjh) && $scope.qlr.zjzl == 7) {
				$scope.showAlert("请输入正确的营业执照号码");
			} else if($scope.qlr.dh == undefined || !$dictUtilsService.phone($scope.qlr.dh)) {
				$scope.showAlert("请输入正确的联系电话");
			} else if($scope.qlr.gyfs == undefined || $scope.qlr.gyfs != $scope.qlr.gyfs) {
				$scope.showAlert("请选择共有方式");
			} else if($scope.qlrlx.value != "1" && ($scope.qlr.frmc == undefined || $scope.qlr.frmc == null || $scope.qlr.frmc == "")) {
				$scope.showAlert("提示", "请输入法人名称");
			}
			//判断是否存在照片
			else if($scope.fjzl.filelist.length == 0 && ((needUploadData != null && needUploadData.length == 0) || needUploadData == null)) {
				$scope.showAlert("请上传身份证明照片");
			} else if(needUploadTwoPhoto && $scope.fjzl.filelist.length <= 1) {
				$scope.showAlert("请上传完整的身份证明材料");
			} else if(!($scope.qlr.dlrdh == undefined || $scope.qlr.dlrdh === null || $scope.qlr.dlrdh === "") && !$dictUtilsService.phone($scope.qlr.dlrdh)) {
				$scope.showAlert("请输入正确的代理人手机号码");
			} else if("按份共有" == $scope.gyfs.label && (!$dictUtilsService.number($scope.qlr.qlbl) || $scope.qlr.qlbl == undefined)) {
				$scope.showAlert("请输入正确的权利比例");
			} else {
				canSave = true;
			}

			return canSave;
		}
		//添加权利人
		$scope.addqlr1 = function() {
			$scope.qlr.ywh = $wysqService.djsqItemData.ywh;
			$scope.qlr.zjzl = $scope.zjzl.value; //证件种类
			$scope.qlr.dlrzjzl = $scope.dlrzjzl.value; //证件种类
			$scope.qlr.gyfs = $scope.gyfs.value; //共有方式
			$scope.qlr.qllx = $wysqService.djsqItemData.qllx; //将权利信息中的权利类型保存到权利人的权利类型中
			$scope.qlr.category = $scope.qlrfl.value; //权利人分类存放到category中去
			$scope.qlr.qlrlx = $scope.qlrlx.value; //权利人类型
			var arr = Object.keys($scope.qlr);
			var len = arr.length;
			console.log(len);
			if($scope.verifyYwData()) {
				//			$wysqService.judgeDuplicate({
				//				dto: $scope.qlr
				//			})
				//			.then(function(res) {
				// 				console.log(res);
				//			}, function(res) {
				// 				console.log(res);
				//			});
				$wysqService.addqlr($scope.qlr)
					.then(function(res) {
						if(res.success) {
							console.log("保存权利人成功");
							$scope.uploadPhoto($scope.qlr.zjh);
						}
					}, function(res) {
						console.log(res.message);
						console.log("保存失败");
					});
			}

		};
		//更新权利人信息
		$scope.updataQlr = function() {
			$scope.qlr.zjzl = $scope.zjzl.value; //证件种类
			$scope.qlr.dlrzjzl = $scope.dlrzjzl.value; //证件种类
			$scope.qlr.gyfs = $scope.gyfs.value; //共有方式
			$scope.qlr.category = $scope.qlrfl.value; //权利人分类存放到category中去
			$scope.qlr.qllx = $wysqService.djsqItemData.qllx; //将权利信息中的权利类型保存到权利人的权利类型中
			$scope.qlr.qlrlx = $scope.qlrlx.value; //权利人类型
			if($scope.verifyYwData()) {
				$wysqService.updateQlr($scope.qlr)
					.then(function(res) {
						if(res.success) {
							console.log("更新权利人成功");
							$scope.uploadPhoto($scope.qlr.zjh);

						}
					}, function(res) {
						console.log(res.message);
						console.log("更新失败");
					});
			}

		}
		$scope.showAlert = function(msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		};

		//不同的流程显示不同的权利人类型
		if(gyjsydsyq_zydj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //土地_国有建设用地使用权_转移登记
			$scope.qlrflData.push($scope.qlrflDataAll[2]); //只有使用权人类型
			$scope.qlrfl = $scope.qlrflData[0];
		} else if(gyjsydsyq_bgdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //土地_国有建设用地使用权_变更登记
			$scope.qlrflData.push($scope.qlrflDataAll[2]); //只有使用权人类型
			$scope.qlrfl = $scope.qlrflData[0];
		} else if(gyjsydsyqjfwsyq_zydj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //房屋_转移登记跳转
			$scope.qlrflData.push($scope.qlrflDataAll[0]); //只有所有权人类型
			$scope.qlrfl = $scope.qlrflData[0];
		} else if(gyjsydsyqjfwsyq_bgdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //房屋_变更登记跳转
			$scope.qlrflData.push($scope.qlrflDataAll[0]); //只有所有权人类型
			$scope.qlrfl = $scope.qlrflData[0];
		} else if(gyjsydsyqjfwsyq_gzdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //房屋_更正登记跳转
			$scope.qlrflData.push($scope.qlrflDataAll[0]); //只有所有权人类型
			$scope.qlrfl = $scope.qlrflData[0];
		} else if(dyqdj_scdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //房屋_抵押权登记首次登记跳转
			$scope.qlrflData.push($scope.qlrflDataAll[4]);
			$scope.qlrfl = $scope.qlrflData[0];
		} else if(ygdj_ysspfmmygdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //房屋_预告登记_预售商品房买卖预告登记
			$scope.qlrflData.push($scope.qlrflDataAll[7]);
			$scope.qlrfl = $scope.qlrflData[0];
		} else if(ygdj_ysspfdyqygdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //房屋_预告登记_预售商品房抵押权预告登记
			$scope.qlrflData.push($scope.qlrflDataAll[9]);
			$scope.qlrfl = $scope.qlrflData[0];
		} else if(lq_lqscdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //林地_林权_林权首次登记
			$scope.qlrflData.push($scope.qlrflDataAll[2]); //只有使用权人类型
			$scope.qlrfl = $scope.qlrflData[0];
		};
		//根据业务号获取所有附件
		$scope.getFj = function(zjhTemp) {
			$fjxzUtilsService.getAllFjByYwh($wysqService.djsqItemData.ywh, function(filelistAll) {
				$fjxzUtilsService.setFileToListByclmc(filelistAll, $scope.fjzl, zjhTemp);
				getFileListFromFms($scope.fjzl.filelist); //从Fms服务器中获取文件
			});
		};
		//从Fms中获取文件列表
		getFileListFromFms = function(filelist) {
			$fjxzUtilsService.getFileListFromFms(filelist, function(res) {
				var src = res.data.filePathUrl;
				src = $dictUtilsService.replacePicUrl(src);
				$fjxzUtilsService.setImgSrcToFile($scope.fjzl, src, res.data.id);
			});
		};
		/**
		 * 拍摄按钮拍摄照片--start
		 */
		$scope.addPhoto = function(fjzl) {
			$fjxzUtilsService.addPhoto(fjzl, function(index) {
				switch(index) {
					case 0:
						$scope.takePhoto(fjzl);
						//测试
						//					fjzl.filelist.push({
						//						src: "data:image/jpeg;base64," + 'iVBORw0KGgoAAAANSUhEUgAAADYAAAA2CAYAAACMRWrdAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABi1JREFUeNrcWn1oVWUYf5e2zJJWaMEWflVaTis33VKzSCpSmLNpllhRMhsFERXNPrRPZyspaP9IWYo6m1q3ZCJClEErnQ5b3qzcws1FDirJRdbYnFu/h/1eeO/tnHPP553sgR/nPefe+57nd57nfd7nec7NUOv61GCU89QglaERzDkauA2YDkwAxgIjgYv5+WngJHAcaAYagC+BX8JUIiMkVxTlHwCWAhN9znEU+BDYDLQNNLGpwHPAQgu3/heIU8khwCJe/xg4y4cxBRie9LteIAasAb5LN7ErgDdppQzj+kFgJ7AH+J4ERG4G6jieDXzNsRC+HrgLKAGmGXOJYluAZ4Df0xE87qXbPEhSZ4D3gRuAQuB1PumzLuaS7zTyN7ImbwQ+4JwZvEcTsDhKYpnAu8A2IIvXxGWuBZbT7YLKYaCUc8Z4Te61nffODJuYRLTdwCM8',
						//						uploadSrc:'iVBORw0KGgoAAAANSUhEUgAAADYAAAA2CAYAAACMRWrdAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABi1JREFUeNrcWn1oVWUYf5e2zJJWaMEWflVaTis33VKzSCpSmLNpllhRMhsFERXNPrRPZyspaP9IWYo6m1q3ZCJClEErnQ5b3qzcws1FDirJRdbYnFu/h/1eeO/tnHPP553sgR/nPefe+57nd57nfd7nec7NUOv61GCU89QglaERzDkauA2YDkwAxgIjgYv5+WngJHAcaAYagC+BX8JUIiMkVxTlHwCWAhN9znEU+BDYDLQNNLGpwHPAQgu3/heIU8khwCJe/xg4y4cxBRie9LteIAasAb5LN7ErgDdppQzj+kFgJ7AH+J4ERG4G6jieDXzNsRC+HrgLKAGmGXOJYluAZ4Df0xE87qXbPEhSZ4D3gRuAQuB1PumzLuaS7zTyN7ImbwQ+4JwZvEcTsDhKYpnAu8A2IIvXxGWuBZbT7YLKYaCUc8Z4Te61nffODJuYRLTdwCM8',
						//						fileid: "0"
						//					});
						//					$scope.uploadOnePhoto(fjzl,'iVBORw0KGgoAAAANSUhEUgAAADYAAAA2CAYAAACMRWrdAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABi1JREFUeNrcWn1oVWUYf5e2zJJWaMEWflVaTis33VKzSCpSmLNpllhRMhsFERXNPrRPZyspaP9IWYo6m1q3ZCJClEErnQ5b3qzcws1FDirJRdbYnFu/h/1eeO/tnHPP553sgR/nPefe+57nd57nfd7nec7NUOv61GCU89QglaERzDkauA2YDkwAxgIjgYv5+WngJHAcaAYagC+BX8JUIiMkVxTlHwCWAhN9znEU+BDYDLQNNLGpwHPAQgu3/heIU8khwCJe/xg4y4cxBRie9LteIAasAb5LN7ErgDdppQzj+kFgJ7AH+J4ERG4G6jieDXzNsRC+HrgLKAGmGXOJYluAZ4Df0xE87qXbPEhSZ4D3gRuAQuB1PumzLuaS7zTyN7ImbwQ+4JwZvEcTsDhKYpnAu8A2IIvXxGWuBZbT7YLKYaCUc8Z4Te61nffODJuYRLTdwCM8');
						break;
					case 1:
						$scope.pickImage(fjzl);
						break;
					default:
						break;
				}
			});
		};
		//调用摄像头拍照
		$scope.takePhoto = function(fjzl) {
			$fjxzUtilsService.takePhoto(fjzl, function(imageURI) {
				//				$scope.uploadOnePhoto(fjzl,imageURI);
				console.log($scope.image);
			});
		};
		//选择本地相册图片照片
		$scope.pickImage = function(fjzl) {
			$fjxzUtilsService.pickImage(fjzl, function(imageURI) {
				$scope.uploadOnePhoto(fjzl, imageURI);
				console.log(fjzl);
			});
		};
		//显示大图
		$scope.showImageBig = function(file) {
			if(!$scope.isShowDel) {
				if(file.src == "" || file.src == null) {
					$scope.Url = $fjxzUtilsService.getSrcByIdFileList(file.id, $scope.fjzl.filelist);
				} else {
					$scope.Url = file.src;
				}
				$scope.bigImage = true;
			}
		};
		//初始默认大图是隐藏的
		$scope.hideBigImage = function() {
			$scope.bigImage = false;
		};
		//长按显示删除按钮
		$scope.showdel = function() {
			if($scope.isShow) {
				$scope.isShowDel = !$scope.isShowDel;
			}
		};
		//删除单张照片
		$scope.delete = function(file) {
			$fjxzUtilsService.deleteOneFile($scope, file, function(res) {
				$fjxzUtilsService.deleteLocalFile($scope.fjzl, file);
			});
		}
		/**
		 * 上传照片--start
		 */
		//将要上传的照片
		$scope.data = [];
		//成功上传到fms文件信息，保存到filexxSuccess数组中
		$scope.filexxSuccess = [];
		//上传到fms文件失败，保存到filexxFail数组中
		$scope.filexxFail = [];
		//上传图片
		$scope.uploadToServer = function(time, zjhTemp) {
			show(); //显示上传中进度框
			for(var i = 0; i < $scope.data.length; i++) {
				$fjxzUtilsService.uploadOnePhotoToServer($scope, time, $wysqService.djsqItemData.djjg, $wysqService.djsqItemData.ywh, $scope.fjzl.clmc, $scope.fjzl.clsm, $scope.fjzl.sxh, $scope.data[i].uploadSrc,
					function(result) {
						$scope.filexxSuccess = $scope.filexxSuccess.concat(result.filexxSuccess);
						$scope.filexxFail = $scope.filexxFail.concat(result.filexxFail);
						$scope.judgeSaveYwData(zjhTemp);
					}, zjhTemp);
			}

		}
		$scope.uploadPhoto = function(zjhTemp) {
			$scope.data = $fjxzUtilsService.getUploadData($scope.fjzl);
			if($scope.data != undefined && $scope.data.length > 0) {
				$wysqService.getSystemTime()
					.then(function(res) {
						if(res.success === true) {
							//获取当前时间成功
							var time = res.data;
							$scope.uploadToServer(time, zjhTemp);
						} else {
							console.log(res.message);
						}
					}, function(res) {
						console.log(res.message);
					});
			} else {
				$scope.updateYwData(zjhTemp);
				//			$scope.showAlert('没有需要上传的文件');
			}
		}
		//判断是否需要上传数据到业务库
		$scope.judgeSaveYwData = function(zjhTemp) {
			if($scope.filexxSuccess.length == $scope.data.length) { //全部成功
				$scope.saveYwData(zjhTemp);
			} else if($scope.filexxFail.length == $scope.data.length) { //全部失败
				hide();
				$scope.showAlert('上传失败111');
			} else if($scope.filexxSuccess.length + $scope.filexxFail.length == $scope.data.length) { //既有成功，又有失败
				$scope.saveYwData(zjhTemp);
			}
		};
		//照片上传到fms之后，将返回结果保存到业务数据中
		$scope.saveYwData = function(zjhTemp) {
			$fjxzUtilsService.uploadPhotoYwData($scope, $scope.filexxSuccess, function(res) {
				hide();
				if(res.success == true) {
					//清空已上传的数据
					$scope.filelist = [];
					$scope.imageSrc = [];
					$scope.data = [];
					$scope.filexxSuccess = [];
					$scope.filexxFail = [];
					$scope.updateYwData(zjhTemp);
				}
			});
		}
		//更新业务数据
		getNeedUpdateFileList = function(zjhTemp) {
			var result = [];
			if($scope.fjzl.filelist != undefined && $scope.fjzl.filelist.length > 0) {
				for(var i = 0; i < $scope.fjzl.filelist.length; i++) {
					var fileTemp = $scope.fjzl.filelist[i];
					if(fileTemp.zjh != zjhTemp && fileTemp.fileid != "0") {
						fileTemp.zjh = zjhTemp;
						result.push(fileTemp);
					}
				}
			}
			return result;
		}
		$scope.updateYwData = function(zjhTemp) {
			var needUpdateFileListTemp = getNeedUpdateFileList(zjhTemp);
			if(needUpdateFileListTemp != undefined && needUpdateFileListTemp.length > 0) {
				$wysqService.updateFileInfo({
						uploadfiles: needUpdateFileListTemp
					})
					.then(function(res) {
						if(res.success === true) {
							$scope.showAlert('更新业务数据完成');
							//重新获取列表
							$scope.getFj();
							$ionicHistory.goBack();
						} else {
							hide();
							$scope.showAlert('更新业务数据失败');
						}
					}, function(res) {
						$scope.showAlert('更新业务数据失败');
						console.log(res.message);
					});
			} else {
				$scope.getFj();
				$ionicHistory.goBack();
			}

		}
		show = function() {
			$ionicLoading.show({
				//template: '上传中...'
				template: '<ion-spinner icon="lines" class="spinner-calm"></ion-spinner><p>正在上传图片</p>',
				duration: 10000
			});
		};
		hide = function() {
			$ionicLoading.hide();
		};
		/**
		 * 上传照片--end
		 *
		 */
		//获取需要上传的文件列表
		hasPhotoToUpload = function() {
			var result = false;
			//一个种类包含的附件列表
			var filelist = $scope.fjzl.filelist;
			if(filelist != null && filelist.length > 0) {
				for(var i = 0; i < filelist.length; i++) {
					//一个附件
					var file = filelist[i];
					if(file.fileid == "0") {
						result = true;
						break;
					}
				}
			}
			return result;
		}
		//返回上一页
		$scope.goback = function() {
			if(hasPhotoToUpload()) {
				var confirmPopup = $ionicPopup.confirm({
					title: '提示',
					template: '还有未上传的图片，您确定要退出吗?',
					cancelText: '取消',
					okText: '确认',
					cssClass: 'dialog'
				});
				confirmPopup.then(function(res) {
					if(res) {
						$ionicHistory.goBack();
					}
				});
			} else {
				$ionicHistory.goBack();
			}
		};

	}
]);