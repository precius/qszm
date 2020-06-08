angular.module('fjxzsmCtrl', []).controller('fjxzsmCtrl', ["$scope", "ionicToast", "$state", "$ionicHistory", "$wysqService", "$stateParams", "$ionicPopup", "$ionicLoading", "$dictUtilsService", "$fjxzUtilsService", "$loginService",
	function($scope, ionicToast, $state, $ionicHistory, $wysqService, $stateParams, $ionicPopup, $ionicLoading, $dictUtilsService, $fjxzUtilsService, $loginService) {
		var subFlowcode = $loginService.subCode;
		//根据子流程代码获取附件类型列表
		$scope.getFjlist = function() {
			$wysqService.getfjlxlist({
					subCode: subFlowcode
				})
				.then(function(res) {
					if(res.success) {
						$wysqService.fjlxlist = res.data;
						$scope.fjzlList = $wysqService.fjlxlist;
						$scope.getFj();
						console.log($wysqService.fjlxlist);
					}
				}, function(res) {});
		}
		//附件种类列表：一个二维数组,每个种类中包含多个附件
		$scope.fjzlList = $wysqService.fjlxlist;
		$scope.getFjlist();
		$scope.fjzlList = [];

		var wwywh = $loginService.ywh;
		//通过业务号获取业务信息，只需要接收ywh即可
		$wysqService.queryApplyByYwh({
				wwywh: wwywh
			})
			.then(function(res) {
				$wysqService.djsqItemData = res.data;
			}, function(res) {
				$scope.showAlert('获取业务信息失败');
			});
		/**
		 * 从服务器中获取图片--start
		 */
		//根据业务号获取所有附件
		$scope.getFj = function() {
			$fjxzUtilsService.getAllFjByYwh(wwywh, function(filelistAll) {
				if($scope.fjzlList != null && $scope.fjzlList.length > 0) {
					for(var j = 0; j < $scope.fjzlList.length; j++) {
						var fjzlTemp = $scope.fjzlList[j];
						$fjxzUtilsService.setFileToListByclmc(filelistAll, fjzlTemp);
						getFileListFromFms(fjzlTemp.filelist); //从Fms服务器中获取文件
					}
				}
			});
		}
		//上传完之后，刷新当前材料分类的附件列表
		$scope.getFjByFjzl = function(fjzlParam) {
			$fjxzUtilsService.getFjByFjzl(wwywh, $scope.fjzlList, fjzlParam, function(filelistTemp) {
				getFileListFromFms(filelistTemp); //从Fms服务器中获取文件
			});
		}
		//从Fms中获取文件列表
		getFileListFromFms = function(filelist) {
			$fjxzUtilsService.getFileListFromFms(filelist, function(res) {
				var src = res.data.filePathUrl;
				src = $dictUtilsService.replacePicUrl(src);
				if($scope.fjzlList != null && $scope.fjzlList.length > 0) {
					for(var j = 0; j < $scope.fjzlList.length; j++) {
						$fjxzUtilsService.setImgSrcToFile($scope.fjzlList[j], src, res.data.id);
					}
				}
			});
		}
		/**
		 * 从服务器中获取图片--end
		 */
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
				$scope.uploadOnePhoto(fjzl, imageURI);
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
					$scope.Url = $fjxzUtilsService.getSrcById(file.id, $scope.fjzlList);
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
		/**
		 * 拍摄按钮拍摄照片--end
		 */
		//长按显示删除按钮
		$scope.showdel = function() {
			if($scope.isShow) {
				$scope.isShowDel = !$scope.isShowDel;
			}
		};
		//删除照片
		$scope.delete = function(file) {
			$fjxzUtilsService.deleteOneFile($scope, file, function(res) {
				if($scope.fjzlList != null && $scope.fjzlList.length > 0) {
					for(var j = 0; j < $scope.fjzlList.length; j++) {
						$fjxzUtilsService.deleteLocalFile($scope.fjzlList[j], file);
					}
				}
			});
		}
		//上传单张照片
		//将要上传的附件种类
		$scope.fjzlParam = null;
		$scope.uploadOnePhoto = function(fjzl, uploadSrc) {
			$scope.fjzlParam = fjzl;
			$wysqService.getSystemTime()
				.then(function(res) {
					if(res.success === true) {
						//获取当前时间成功
						var time = res.data;
						$fjxzUtilsService.uploadOnePhotoToServer($scope, time, $wysqService.djsqItemData.djjg, wwywh, fjzl.clmc, fjzl.clsm, fjzl.sxh, uploadSrc,
							function(result) {
								$fjxzUtilsService.uploadPhotoYwData($scope, result.filexxSuccess, function(res) {
									if(res.success == true) {
										$scope.getFjByFjzl($scope.fjzlParam);
									}
								});

							});
					} else {
						console.log(res.message);
					}
				}, function(res) {
					console.log(res.message);
				});
		};
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
		//返回上一页
		$scope.gobacktolist = function() {
			if($fjxzUtilsService.hasPhotoToUpload($scope.fjzlList)) {
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
		//跳转到我要申请列表
		$scope.gotolist = function() {
			if($fjxzUtilsService.verifyData($scope, $scope.fjzlList)) {
				$wysqService.completeApply({
						qlxxId: $stateParams.id
					})
					.then(function(res) {
						if(res.success) {
							console.log('提交成功！');
							$state.go('djsq', {}, {
								reload: true
							});
						}
					}, function(res) {
						console.log('提交失败！');
					});
			}
		};
		$scope.saveInfo = function() {
			$scope.showConfirm("保存成功，确认信息无误后提交申请", "确认", "取消");
		};
		//保存弹出对话框
		$scope.showConfirm = function(titel, okText, cancelText) {
			var confirmPopup = $ionicPopup.confirm({
				title: titel,
				okText: okText,
				cancelText: cancelText
			});
			confirmPopup.then(function(res) {
				if(res) {
					//				$state.go('djsq', {}, {reload: true});	
				}
			});
		};
		$scope.gobackto = function() {
			$state.go('tab.home');
		}
		//下一步
		$scope.nextStep = function(isApply) {
			//首先确认是否存在未上传的照片
			if($fjxzUtilsService.hasPhotoToUpload($scope.fjzlList)) {
				var confirmPopup = $ionicPopup.confirm({
					title: '提示',
					template: '还有未上传的图片，您确定要继续吗?',
					cancelText: '取消',
					okText: '确认',
					cssClass: 'dialog'
				});
				confirmPopup.then(function(res) {
					if(res) {
						//再确认是否所有必拍摄的照片都拍摄了
						if($fjxzUtilsService.verifyData($scope, $scope.fjzlList)) {
							$state.go('djjg');
						}
					}
				});
			} else {
				//再确认是否所有必拍摄的照片都拍摄了,然后提交
				if(isApply) {
					$scope.applyInfo();
				} else {
					$scope.saveInfo();
				}
			}
		};
		$scope.applyInfo = function() {
			if($fjxzUtilsService.verifyData($scope, $scope.fjzlList)) {
				$wysqService.completeApply({
						qlxxId: $stateParams.id
					})
					.then(function(res) {
						if(res.success) {
							$scope.showAlert('提交成功');
							$state.go('djjg');
						}
					}, function(res) {
						$scope.showAlert('提交失败');
					});
			}
		}
		$scope.showAlert = function(msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		};
	}
]);