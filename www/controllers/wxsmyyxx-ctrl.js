angular.module('smyyxxCtrl', []).controller('smyyxxCtrl', ["$scope", "ionicToast", "$state", "$ionicLoading", "$ionicHistory", "$fmsService", "$menuService", "$wyyyService", "$dictUtilsService", "$ionicPopup", "$wysqService", "$ionicActionSheet", "$registerService",
	function($scope, ionicToast, $state, $ionicLoading, $ionicHistory, $fmsService, $menuService, $wyyyService, $dictUtilsService, $ionicPopup, $wysqService, $ionicActionSheet, $registerService) {
		//上门预约信息
		$scope.yyxx = {
			userId: mongoDbUserInfo.id
		};

		//证件种类
		$scope.zjzlData = $dictUtilsService.getDictinaryByType("证件种类").childrens;
		//选择证件种类
		$scope.checkZjlx = function(value) {
			$scope.yyxx.documentType = value;
		}

		//选择预约时间
		$scope.dateChange = function(date) {
			if(date.valueOf() <= new Date().valueOf()) {
				showAlert("您选择的时间不能预约，请重新选择");
			} else {
				$scope.yyxx.appointmentTime = $dictUtilsService.getFormatDate(date, "yyyy-MM-dd");
			}
		}

		//预约时间段
		$scope.timeData = [{
			label: "上午"
		}, {
			label: "下午"
		}];
		//选择时间段
		$scope.checkTime = function(time) {
			$scope.yyxx.appointmentPeriod = time.label;
		}

		//特殊情况类型
		$scope.tslx = "请选择特殊类型";
		$scope.zmcl = "特殊情况证明材料";
		var button = [{
				text: '老年人（70周岁以上）',
				zmcl: '身份证'
			},
			{
				text: '重大疾病患者',
				zmcl: '医院出具的证明'
			},
			{
				text: '残障人士',
				zmcl: '残疾证'
			},
			{
				text: '其他原因不便出行',
				zmcl: '出行不便相关证明'
			}
		];
		$scope.selecttslx = function() {
			$ionicActionSheet.show({
				buttons: button,
				titleText: '选择特殊类型',
				cancelText: '取消',
				cancel: function() {
					return true;
				},
				buttonClicked: function(index) {
					$scope.tslx = button[index].text;
					$scope.zmcl = button[index].zmcl;
					return true;
				}
			});
		}

		$scope.showTips = false;
		var imgData = [{
			src: require('../theme/img_menu/zs3.png')
		}, {
			src: require('../theme/img_menu/zs1.png')
		}, {
			src: require('../theme/img_menu/zs2.png')
		}];
		//不动产信息模板提示框
		$scope.clickTips = function(n) {
			if(n == 0 || n == 1 || n == 2) {
				$scope.src = imgData[n].src;
				$scope.showTips = true;
			} else {
				$scope.showTips = false;
			}
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

		//选择办事大厅
		var bsdtData = null;
		var selectable = true;
		$scope.selectBsdt = function() {
			if(!selectable) {
				return;
			}
			selectable = false;
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
							selectable = true;
							return true;
						},
						buttonClicked: function(index) {
							selectable = true;
							$scope.yyxx.officeName = bsdtData[index].officeName;
							$scope.yyxx.orgCode = bsdtData[index].djjg;
							$scope.yyxx.orgName = bsdtData[index].jgmc;
							$scope.yyxx.officeHall = bsdtData[index].officeName;
							$scope.yyxx.officeHallPhone = bsdtData[index].dh;
							$scope.yyxx.officeHallAddr = bsdtData[index].address;
							initReservations(bsdtData[index].djjg);
							return true;
						}
					});
				} else {
					selectable = true;
				}
			});
		}

		//初始化预约事项
		var yysxButtons = null;

		function initReservations(jgCode) {
			yysxButtons = [];
			$wyyyService.getSubFlowList({
				userId: mongoDbUserInfo.id,
				djjg: jgCode
			}).then(function(res) {
				if(res.success) {
					if(res.data != null && res.data.length > 0) {
						angular.forEach(res.data, function(item) {
							if(item.sfkyy === 1) {
								yysxButtons.push({
									text: item.subFlowName
								});
							}
						});
					}
				} else {
					showAlert("获取预约事项失败");
				}
			}, function(err) {
				showAlert("获取预约事项失败");
			});
		}

		$scope.selectYysx = function() {
			if(yysxButtons == null) {
				showAlert("请先选择办事大厅");
				return;
			}
			if(yysxButtons.length == 0) {
				showAlert("该办事大厅暂不支持上门预约");
				return;
			}
			$ionicActionSheet.show({
				buttons: yysxButtons,
				titleText: '选择预约事项',
				cancelText: '取消',
				cancel: function() {
					return true;
				},
				buttonClicked: function(index) {
					$scope.yyxx.reservations = yysxButtons[index].text;
					return true;
				}
			});
		}

		$scope.bGetCodeDisabled = false;

		$scope.bigImage = false;
		$scope.isShowDel = false;
		$scope.code = "获取验证码";

		var selectedIndex = 3;
		//附件种类列表：一个二维数组,每个种类中包含多个附件
		$scope.fjzl = {};
		$scope.fjzl.filelist = [];
		var idlist = [];

		if($menuService.tag == 0) {
			$scope.date = new Date();
			$scope.yyxx.proofFileId = "000";
			$scope.yyxx.officeName = "请选择办事大厅";
			$scope.zjzl = $scope.zjzlData[0];
			$scope.yyxx.documentType = $scope.zjzl.value;
			$scope.time = $scope.timeData[0];
			$scope.yyxx.appointmentPeriod = "上午";
			$scope.show2 = true;
			$scope.show3 = false;
		} else if($menuService.tag == 1) {
			$scope.yyxx = $menuService.item;
			$scope.date = new Date($scope.yyxx.appointmentTime);
			$scope.yyxx.appointmentTime = $dictUtilsService.getFormatDate($scope.date, "yyyy-MM-dd");
			for(i = 0; i < $scope.zjzlData.length; i++) {
				if($scope.zjzlData[i].value == $scope.yyxx.documentType) {
					$scope.zjzl = $scope.zjzlData[i];
				}
			}
			$scope.yyxx.officeName = $scope.yyxx.officeHall;
			if($scope.yyxx.appointmentPeriod == "上午") {
				$scope.time = $scope.timeData[0];
			} else {
				$scope.time = $scope.timeData[1];
			}
			$scope.bdcqzhMbData[3].inputs[0] = $scope.yyxx.immovablePropertyNo;
			var idArray = $scope.yyxx.proofFileId.split(",");
			if(idArray != null && idArray.length > 0) {
				for(var i = 0; i < idArray.length; i++) {
					var idStr = idArray[i];
					$fmsService.findFileById({
							'id': idStr
						})
						.then(function(response) {
							if(response.success) {
								$scope.fjzl.filelist.push(response.data);
							} else {
								showAlert("获取数据失败");
							}
						}, function(error) {
							showAlert("请求失败");
						});
				}
			}
			$scope.show2 = false;
			$scope.show3 = true;
		}

		function getbdcqzh() {
			var result = "";
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
			return result;
		}

		function setUnSelected() {
			for(var i = 0; i < $scope.bdcqzhMbData.length; i++) {
				$scope.bdcqzhMbData[i].isSelected = false;
			}
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
					text: $scope.bdcqzhMbData[3].name
				}],
				cancelText: '取消',
				cancel: function() {
					return true;
				},
				buttonClicked: function(index) {
					selectedIndex = index;
					setUnSelected();
					$scope.bdcqzhMbData[index].isSelected = true;
					return true;
				}
			});
		};

		//进行微信签名，调用微信提供的本地功能
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
					'chooseImage',
					'getLocalImgData',
					'previewImage',
					'uploadImage',
					'downloadImage'
				],
			});
		}, function(res) {
			showAlert('请求失败！');
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
			};
			//选择图片
			$scope.addPhoto = function(fjzl) {
				wx.chooseImage({
					count: 1, //默认9  
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有  
					sourceType: ['album', 'camera'], //可以指定来源是相册还是相机，默认二者都有  
					success: function(res) {
						show();
						$scope.localIds = res.localIds[0]; //返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片 
						var phone_type = '';
						if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { //判断iPhone|iPad|iPod|iOS
							phone_type = 'iphone';
						} else if(/(Android)/i.test(navigator.userAgent)) { //判断Android
							phone_type = 'android';
						}

						wx.getLocalImgData({
							localId: $scope.localIds, // 图片的localID
							success: function(res) {
								var localData = res.localData; // localData是图片的base64数据，可以用img标签显示
								var base64 = res.localData.slice(22);
								var abase64 = res.localData.replace(/[\r\n]/g, "");
								if(phone_type == 'iphone') {
									$scope.fjzl.filelist.push({
										filePathUrl: localData,
										uploadSrc: base64,
										id: $scope.localIds,
										status: "未上传"
									});
								} else if(phone_type == 'android') {
									$scope.fjzl.filelist.push({
										filePathUrl: "data:image/jpeg;base64," + localData,
										uploadSrc: abase64,
										id: $scope.localIds,
										status: "未上传"
									});
									console.log('success');
								}
								$scope.$apply();
								console.log('success');
							}
						});

						wx.uploadImage({
							localId: $scope.localIds, // 需要上传的图片的本地ID，由chooseImage接口获得
							isShowProgressTips: 1, // 默认为1，显示进度提示
							success: function(res) {
								var serverId = res.serverId; // 返回图片的服务器端ID
								//保存到业务库
								$dictUtilsService.saveWechatFile({
									fileId: serverId
								}).then(function(res) {
									idlist.push(res.data);
									if($scope.fjzl.filelist.length > 0) {
										for(i = 0; i < $scope.fjzl.filelist.length; i++) {
											if($scope.fjzl.filelist[i].id == $scope.localIds) {
												$scope.fjzl.filelist[i].id = res.data;
											}
										}
									}
									hide();
								}, function(res) {
									hide();
									showAlert('上传文件失败');
								});
							}
						});
					}
				});
			}
		});

		wx.error(function(res) {
			showAlert("签名失败");
		});

		function show() {
			$ionicLoading.show({
				template: '<ion-spinner icon="lines" class="spinner-calm"></ion-spinner><p>上传中……</p>'
			});
		};

		function hide() {
			$ionicLoading.hide();
		};

		//显示大图
		$scope.showImageBig = function(file) {
			if(!$scope.isShowDel) {
				if(file.filePathUrl == "" || file.filePathUrl == null) {
					if($scope.fjzl.filelist != null && $scope.fjzl.filelist.length > 0) {
						for(var i = 0; i < $scope.fjzl.filelist.length; i++) {
							//一个附件
							if(file.id == $scope.fjzl.filelist[i].id) {
								$scope.Url = $scope.fjzl.filelist[i].filePathUrl;
							}
						}
					}
				} else {
					$scope.Url = file.filePathUrl;
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
			$scope.isShowDel = !$scope.isShowDel;
		};

		//删除单张照片
		$scope.delete = function(file) {
			var confirmPopup = $ionicPopup.confirm({
				title: '提示',
				template: '您确定要删除该照片吗?',
				cancelText: '取消',
				okText: '确认',
				cssClass: 'dialog'
			});
			confirmPopup.then(function(res) {
				if(res) {
					for(var i = 0; i < $scope.fjzl.filelist.length; i++) {
						if(file.filePathUrl == $scope.fjzl.filelist[i].filePathUrl) {
							$scope.fjzl.filelist.splice(i, 1);
							break;
						}
					}
					for(var i = 0; i < idlist.length; i++) {
						if(file.id == idlist[i]) {
							idlist.splice(i, 1);
							break;
						}
					}
				}
			});
		}

		/**
		 * 
		 * @param {Object} tel 电话号码
		 */
		function getTelCode(tel) {
			$registerService.getPhoneCode({
				phone: tel,
				areaCode: 640000
			}).then(function(res) {
				if(res.success) {
					$dictUtilsService.addCodeInteral($scope);
				}
			}, function(res) {
				if(res.message == null || res.message == "" || res.message == "null") {
					showAlert("获取验证码失败");
				} else {
					showAlert(res.message);
				}
			});
		}

		$scope.getCode = function() {
			if(!$scope.bGetCodeDisabled) {
				//验证手机号码
				var isPhone = $dictUtilsService.phone($scope.yyxx.applicantPhone);
				if(!isPhone) {
					showAlert("请输入正确的手机号码");
				} else {
					getTelCode($scope.yyxx.applicantPhone);
				}
			} else {
				showAlert($scope.code);
			}
		}

		$scope.goback = function() {
			$ionicHistory.goBack(); //返回上一个页面
		};

		//验证数据保存信息
		verifyYwData = function() {
			var canSave = false;
			var bdcqzh = getbdcqzh();
			if($scope.yyxx.applicantName == undefined || $scope.yyxx.applicantName === null || $scope.yyxx.applicantName === "" || $dictUtilsService.hasNum($scope.yyxx.applicantName)) {
				showAlert("请输入正确的申请人姓名");
			} else if($scope.yyxx.documentType == undefined || $scope.yyxx.documentType === null || $scope.yyxx.documentType === "") {
				showAlert("请选择证件种类");
			} else if($scope.yyxx.certNo == undefined || $scope.yyxx.certNo === null || $scope.yyxx.certNo === "") {
				showAlert("请输入证件号码");
			} else if(!$dictUtilsService.idcard($scope.yyxx.certNo) && $scope.yyxx.documentType == 1) {
				showAlert("请输入正确的证件号码");
			} else if(bdcqzh == undefined || bdcqzh === null || bdcqzh === "") {
				showAlert("请输入正确的不动产权证号");
			} else if(!checkCQZH()) {
				showAlert("产权证号输入不完整！");
			} else if($scope.yyxx.applicantPhone == undefined || !$dictUtilsService.phone($scope.yyxx.applicantPhone)) {
				showAlert("请输入正确的申请人电话");
			} else if($scope.yyxx.applicantAddr == undefined || $scope.yyxx.applicantAddr === null || $scope.yyxx.applicantAddr === "") {
				showAlert("请输入申请人详细地址");
			} else if($scope.yyxx.orgCode == undefined || $scope.yyxx.orgCode === null || $scope.yyxx.orgCode === "") {
				showAlert("请选择办事大厅");
			} else if($scope.yyxx.reservations == undefined || $scope.yyxx.reservations == null || $scope.yyxx.reservations == "") {
				showAlert("请选择预约事项");
			} else if($scope.yyxx.appointmentTime == undefined) {
				showAlert("您选择的时间不能预约，请重新选择预约时间");
			} else if($scope.yyxx.appointmentPeriod == undefined || $scope.yyxx.appointmentPeriod === null || $scope.yyxx.appointmentPeriod === "") {
				showAlert("请选择期望时间段");
			} else if($scope.yyxx.certCode == undefined || $scope.yyxx.certCode === null || $scope.yyxx.certCode === "") {
				showAlert("请输入验证码");
			} else if($scope.tslx == '请选择特殊类型') {
				showAlert("请选择特殊类型");
			}
			//判断是否存在照片
			else if(idlist == null || (idlist != null && idlist.length <= 0)) {
				showAlert("请拍摄照片");
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
		$scope.isAdmitting = false; //防止快速点击发起多次预约
		//发起上门预约
		$scope.initiate = function() {
			if($scope.isAdmitting) {
				return;
			}
			$scope.isAdmitting = true;
			if(verifyYwData()) {
				$scope.yyxx.proofFileId = idlist.join(',');
				$scope.yyxx.immovablePropertyNo = getbdcqzh();
				$menuService.initiate($scope.yyxx).then(function(res) {
					$scope.isAdmitting = false;
					if(res.success) {
						$state.go('smyyjg');
					} else {
						showAlert(res.message);
					}
				}, function(res) {
					$scope.isAdmitting = false;
					showAlert(res.message);
				});
			}else{
				$scope.isAdmitting = false;
			}
			
		}

		//更新上门预约信息
		$scope.update = function() {
			if(verifyYwData()) {
				$scope.yyxx.proofFileId = idlist.join(',');
				$scope.yyxx.immovablePropertyNo = getbdcqzh();
				$menuService.update($scope.yyxx).then(function(res) {
					if(res.success) {
						$state.go('smyyjg');
					} else {
						showAlert(res.message);
					}
				}, function(res) {
					showAlert(res.message);
				});
			}
		}

		function showAlert(msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		}
	}
]);