angular.module('smyyxxCtrl', []).controller('smyyxxCtrl', ["$scope", "ionicToast", "$state", "$ionicHistory", "$menuService", "$dictUtilsService", "$fjxzUtilsService", "$ionicPopup", "$wysqService", "$ionicActionSheet", "$qyglService", "$registerService",
	function($scope, ionicToast, $state, $ionicHistory, $menuService, $dictUtilsService, $fjxzUtilsService, $ionicPopup, $wysqService, $ionicActionSheet, $qyglService, $registerService) {
		//上门预约信息
		$scope.yyxx = {};
		//证件种类
		var zjzlStr = "证件种类";
		$scope.zjzl = {};
		$scope.zjzlData = $dictUtilsService.getDictinaryByType(zjzlStr).childrens;
		console.log($scope.zjzlData);
		//初始化证件种类
		$scope.initZjlx = function() {
			if($scope.zjzlData != null && $scope.zjzlData.length > 0) {
				$scope.zjzl = $scope.zjzlData[0];
			}
		}

		$scope.timeData = [{
			label: "上午"
		}, {
			label: "下午"
		}];
		$scope.time = $scope.timeData[0];
		$scope.yyxx.appointmentPeriod = "上午";

		$scope.checkTime = function(time) {
			$scope.yyxx.appointmentPeriod = time;
		}

		$scope.initZjlx();
		//选择证件种类
		$scope.checkZjlx = function(value) {
			for(var i = 0; i < $scope.zjzlData.length; i++) {
				if(value === $scope.zjzlData[i].value) {
					$scope.zjzl = $scope.zjzlData[i];
					console.log("证件类型：");
					console.log($scope.zjzl);
					$scope.yyxx.documentType = $scope.zjzl.value;
					console.log($scope.yyxx.documentType);
				}
			}
		}
		if($menuService.tag == 0) {
			$scope.yyxx.reservations = $menuService.yysx;
			/*		$scope.yyxx.orgCode = $menuService.bsdt.djjg;
					$scope.yyxx.orgName = $menuService.bsdt.jgmc;*/
			$scope.yyxx.appointmentTime = $dictUtilsService.getFormatDate($scope.date, "yyyy-MM-dd");
			$scope.yyxx.proofFileId = "000";
			//附件种类列表：一个二维数组,每个种类中包含多个附件
			$scope.fjzl = {};
			$scope.fjzl.filelist = [];

			$scope.show1 = true;
			$scope.show2 = true;
			$scope.show3 = false;
		} else if($menuService.tag == 1) {
			$scope.yyxx = $menuService.item;
			//附件种类列表：一个二维数组,每个种类中包含多个附件
			$scope.fjzl = {};
			$scope.fjzl.filelist = [];
			$scope.show1 = true;
			$scope.show2 = false;
			$scope.show3 = true;
		} else {
			$scope.yyxx = $menuService.item;
			//附件种类列表：一个二维数组,每个种类中包含多个附件
			$scope.fjzl = {};
			$scope.fjzl.filelist = [];
			$scope.show1 = false;
			$scope.show2 = false;
			$scope.show3 = false;
		}
		var bsdtData = [];
		$scope.yyxx.officeName = "请选择办事大厅";
		$scope.selectBsdt = function() {
			$qyglService.findByDjjg({
				djjg: county.code
			}).then(function(res) {
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
							console.log(bsdtData[index]);
							$scope.yyxx.officeName = bsdtData[index].officeName;
							$scope.yyxx.orgCode = bsdtData[index].djjg;
							$scope.yyxx.orgName = bsdtData[index].jgmc;
							return true;
						}
					});
				} else {
					alert.show("获取办事大厅失败");
				}
			}, function(error) {
				alert.show("获取办事大厅失败");
			});
		}
		//点击拍摄按钮
		$scope.addPhoto = function(fjzl) {
			$fjxzUtilsService.addPhoto(fjzl, function(index) {
				switch(index) {
					case 0:
						$scope.takePhoto(fjzl);
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
						if(file.src == $scope.fjzl.filelist[i].src) {
							$scope.fjzl.filelist.splice(i, 1);
							break;
						}
					}
				}
			});
		}

		$scope.code = "获取验证码";
		/**
		 * 
		 * @param {Object} tel 电话号码
		 */
		function getTelCode(tel) {
			$registerService.getPhoneCode({
					phone: tel
				})
				.then(function(res) {
					if(res.success) {
						$dictUtilsService.addCodeInteral($scope);
					}
				}, function(res) {
					if(res.message == null || res.message == "" || res.message == "null") {
						$scope.showAlert("获取验证码失败");
					} else {
						$scope.showAlert(res.message);
					}
				});
		}
		$scope.getCode = function() {
			if(!$scope.bGetCodeDisabled) {
				//验证手机号码
				var isPhone = $dictUtilsService.phone($scope.yyxx.applicantPhone);
				if(!isPhone) {
					$scope.showAlert("请输入正确的手机号码");
				} else {
					getTelCode($scope.yyxx.applicantPhone);
				}
			}
		}

		$scope.goback = function() {
			$ionicHistory.goBack(); //返回上一个页面
		};
		//发起上门预约
		$scope.initiate = function() {
			console.log($scope.yyxx);
			for(var i = 0; i < $scope.fjzl.filelist.length; i++) {
				var timestamp = new Date().getTime();
				var fileDir = "特殊情况证明文件";
				var filename = timestamp;
				$wysqService.uploadfile({
						'file': $scope.fjzl.filelist[i].uploadSrc,
						'dir': fileDir,
						'filename': filename + '.jpg',
						'recover': true
					})
					.then(function(res) {
						if(res.success === true) {
							//保存到业务员库
							$scope.yyxx.proofFileId = res.data.id;
							//alert($scope.yyxx.proofFileId);
							$menuService.initiate($scope.yyxx)
								.then(function(res) {
									if(res.success) {
										$menuService.applicantPhone = $scope.yyxx.applicantPhone;
										$state.go('smyyjg');
									}
								}, function(res) {
									console.log(res);
								});
						}
					}, function(res) {
						$scope.showAlert('上传单张照片到文件库失败');
					});
			}
			/*		if(i == $scope.fjzl.filelist.length){
						$menuService.initiate($scope.yyxx)
						.then(function(res) {
							if (res.success) {
								$state.go('smyyjg');
							}
						}, function(res) {
							console.log(res);
						});
					}*/
		}
		//更新上门预约信息
		$scope.update = function() {
			console.log($scope.yyxx);
			for(var i = 0; i < $scope.fjzl.filelist.length; i++) {
				var timestamp = new Date().getTime();
				var fileDir = "特殊情况证明文件";
				var filename = timestamp;
				$wysqService.uploadfile({
						'file': $scope.fjzl.filelist[i].uploadSrc,
						'dir': fileDir,
						'filename': filename + '.jpg',
						'recover': true
					})
					.then(function(res) {
						if(res.success === true) {
							//保存到业务员库
							$scope.yyxx.proofFileId = res.data.id;
							//alert($scope.yyxx.proofFileId);
							$menuService.update($scope.yyxx)
								.then(function(res) {
									if(res.success) {
										$menuService.applicantPhone = $scope.yyxx.applicantPhone;
										$state.go('smyyjg');
									}
								}, function(res) {
									console.log(res);
								});
						}
					}, function(res) {
						$scope.showAlert('上传单张照片到文件库失败');
					});
			}
			/*		if(i == $scope.fjzl.filelist.length){
						$menuService.initiate($scope.yyxx)
						.then(function(res) {
							if (res.success) {
								$state.go('smyyjg');
							}
						}, function(res) {
							console.log(res);
						});
					}*/
		}
		$scope.showAlert = function(msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		};
	}
]);