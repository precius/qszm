//权属证明控制器
angular.module('zsyzListCtrl', ['ionic']).controller('zsyzListCtrl', ["$scope", "ionicToast", "$state", "$ionicHistory", "$ionicPopup", "$qszmService", "$searchService","$dictUtilsService",
	function($scope, ionicToast, $state, $ionicHistory, $ionicPopup, $qszmService, $searchService,$dictUtilsService) {
		$scope.goback = function() {
			$ionicHistory.goBack(); //返回上一个页面
		};
		$scope.gobacktohome = function() {
			$state.go('tab.home');
		};
		$scope.toCheck = function() {
			//实名认证过了，调用微信人脸识别
			if(needWxFaceVerify) {
				$dictUtilsService.signature(function(res) {
					$dictUtilsService.wxface(function(data) {
						$state.go('sqzsyz');
					}, res.data.appId, mongoDbUserInfo.name, mongoDbUserInfo.zjh);
				});
			} else {
				$state.go('sqzsyz');
			}
		}
		//	不动产权属证明申请须知
		$scope.viewTitle = '不动产权属证明申请须知';
		$scope.agreementHref = '#/qszm/zxcx/sqxz/blwdxx'
		//申请须知同意选择
		$scope.sqxz = {
			aggreChecked: false
		};
		//查询的结果列表
		$scope.datalist = [];
		var sendParam = {
			nCurrent: 0,
			nSize: 10,
			loginName: userData.data.loginName,
			checkCertifyTypeEnum: 'ZSZMHS'
		};
		//根据查询类型获取已提交的查询     
		// 这里是和权属证明同一个接口，只需要改变查询条件 checkCertifyTypeEnum 为'ZSZMHS'
		searchAll = function(isRefresh) {
			//		show();
			if(isRefresh) {
				$scope.datalist = [];
				sendParam.nCurrent = 0;
			}
			$qszmService.queryAll(sendParam)
				.then(function(res) {
					if(res.success) {
						var datalist = res.data.page;
						if(datalist != null && datalist.length > 0) {
							for(var i = 0; i < datalist.length; i++) {
								if(datalist[i].checkCertifyStatusEnum == "CXZ") {
									datalist[i].status = "查询中";
								} else if(datalist[i].checkCertifyStatusEnum == "QXCX") {
									datalist[i].status = "已取消";
								} else {
									datalist[i].status = "查询完成";
								}
							}
							console.log(datalist);
							$scope.datalist = $scope.datalist.concat(datalist);
							if(isRefresh) {
								$scope.isShow = false;
								$scope.hasValue = true;
							}
						} else {
							if(isRefresh) {
								$scope.isShow = true;
							}
							$scope.hasValue = false;
						}
						sendParam.nCurrent = sendParam.nCurrent + 1;
					} else {
						console.log('获取证书验证列表数据失败');
					}
					$scope.$broadcast('scroll.refreshComplete');
					$scope.$broadcast('scroll.infiniteScrollComplete');
				}, function(res) {
					$scope.$broadcast('scroll.refreshComplete');
					$scope.$broadcast('scroll.infiniteScrollComplete');
				});
		}
		//按查询编号取消查询
		$scope.del = function(i) {

			var confirmPopup = $ionicPopup.confirm({
				title: '取消查询',
				template: '您确定要取消查询吗?',
				cancelText: '取消',
				okText: '确认',
				cssClass: 'dialog'
			});
			confirmPopup.then(function(res) {
				if(res) {
					$searchService.del({
							cxbh: $scope.datalist[i].cxbh
						})
						.then(function(res) {
							if(res.success) {
								console.log(res);
								$scope.showAlert('取消成功');
								$scope.searchAll();
							}
						}, function(res) {
							console.log(res);
							$scope.showAlert('取消失败');
						});
				}
			});
		}
		//显示PDF文档
		$scope.showPDF = function(url) {
			$scope.jsonObj = {
				title: '权属证明信息',
				pdfUrl: url,
				pdfName: 'qszm.pdf',
				pdfLocalDirctory: 'qszm'
			};
			$state.go('pdfShow', {
				"jsonObj": $scope.jsonObj
			}, {
				reload: true
			});
		}
		//查看详情
		$scope.showInfo = function(i) {
			var dataInfo = $scope.datalist[i];
			$searchService.zsyzjg({
					cdbh: dataInfo.cxbh
				})
				.then(function(res) {
					if(res.success) {
						if(res.data && res.data.result == 1) {
							$scope.showAlert("此证书/证明是真实的");
						} else {
							$scope.showAlert("暂无此证书/证明相关信息！");
						}
					} else {
						$scope.showAlert(res.message);
					}
				}, function(res) {
					$scope.showAlert("正在人工受理中,请等待验证结果。");
					console.log(res);
				});
		}
		//	查询指南
		$scope.cxznTitle = [{
			name: '受理条件',
			addClass: 'on',
			value: '0',
			show: true
		}, {
			name: '收费情况',
			addClass: '',
			value: '1',
			show: false
		}, {
			name: '常见问题',
			addClass: '',
			value: '2',
			show: false
		}]
		$scope.checkType = function(index) {
			for(var i = 0; i < 3; i++) {
				$scope.cxznTitle[i].addClass = '';
				$scope.cxznTitle[i].show = false;
			}
			for(var i = 0; i < 3; i++) {
				if(index === $scope.cxznTitle[i].value) {
					$scope.cxznTitle[i].addClass = 'on';
					$scope.cxznTitle[i].show = true;
				}
			}
		}
		//用户须知确定按钮点击事件
		$scope.sure = function() {
			if(!$scope.sqxz.aggreChecked) {
				$scope.showAlert("请同意以上条款");
			} else {
				$state.go('blwdxx', {}, {
					reload: true
				});
			}
		}
		//用户须知不符合条件弹出框
		$scope.showAlert = function(msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		};
		/**
		 * 实现下拉刷新，上拉加载更多
		 */
		$scope.hasValue = true;
		$scope.doRefresh = function() {
			searchAll(true);
		};

		$scope.hasMore = function() {
			return $scope.hasValue;
		}

		$scope.loadMore = function() {
			if(sendParam.nCurrent == 0) {
				searchAll(true)
			} else {
				searchAll(false);
			}
		}

	}
]);