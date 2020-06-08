//权属证明控制器
angular.module('qszmCtrl', ['ionic']).controller('qszmCtrl', ["$scope", "ionicToast", "$state", "$ionicHistory", "$ionicPopup", "$qszmService", "$searchService", "$wysqService", "$ionicLoading","$dictUtilsService",
	function($scope, ionicToast, $state, $ionicHistory, $ionicPopup, $qszmService, $searchService, $wysqService, $ionicLoading,$dictUtilsService) {
		$scope.goback = function() {
			$ionicHistory.goBack(); //返回上一个页面
		};
		$scope.gobacktohome = function() {
			$state.go('tab.home');
		};
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
			checkCertifyTypeEnum: 'QSZM'
		};
		//根据查询类型获取已提交的查询
		searchAll = function(isRefresh) {
			//		show();
			if(isRefresh) {
				$scope.datalist = [];
				sendParam.nCurrent = 0;
			}
			$qszmService.queryAll(sendParam)
				.then(function(res) {
					if(res.success) {
						datalist = res.data.page;
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
								searchAll(true);
							}
						}, function(res) {
							console.log(res);
							$scope.showAlert('取消失败');
						});
				}
			});
		}
		//点击查询跳转到申请须知
		$scope.goSqxz = function(){
			//实名认证过了，调用微信人脸识别
			if(needWxFaceVerify) {
				$dictUtilsService.signature(function(res) {
					$dictUtilsService.wxface(function(data) {
						$state.go('sqxz');
					}, res.data.appId, mongoDbUserInfo.name, mongoDbUserInfo.zjh);
				});
			} else {
				$state.go('sqxz');
			}
		}
		//显示PDF文档
		$scope.showPDF = function(url) {
//				  $scope.jsonObj = 	{title:'权属证明信息',pdfUrl:url,pdfName:'qszm.pdf',pdfLocalDirctory:'qszm'};
//				  $state.go('pdfShow',{"jsonObj":$scope.jsonObj},{reload:true});
//			$state.go('pdf', {
//				"jsonObj": 'http://hohhot-estate.gsbdcdj.com:8189/internet/zspdf/20190522/345d73b0300540c2adef10179d8f0bb8.pdf'
//			}, {
//				reload: true
//			});
			window.location.href = url;
		}
		//查询加载框加载框
		$scope.show = function(title) {
			$ionicLoading.show({
				//template: '上传中...'
				template: '<ion-spinner icon="lines" class="spinner-stable"></ion-spinner><p>' + title + '</p>'
			});
		};

		$scope.hide = function() {
			$ionicLoading.hide();
		};
		//查看详情
		$scope.showInfo = function(i) {
//			$scope.show("查询中");
			var dataInfo = $scope.datalist[i];
			$searchService.qszmpdf({
					cxbh: dataInfo.cxbh
				})
				.then(function(res) {
					$scope.hide();
					if(res.success) {
						var data = res.data;
						if(data == null) {
							$scope.showAlert("正在查询中,还未返回结果");
						} else {
							var src = res.data;

							//http://hohhot-estate.gsbdcdj.com:8086/pdf/js/pdf0/web/viewer.html?file=/internet/zspdf/20190711/24bdada1b20544bf8b87ff02c9ee4378.pdf
							var strs = src.split('/internet/print/');
							var url = pdfViewer+'/internet/print/'+strs[1];
							window.location.href= url;
//							var arrayTemp = src.split("download");
//							var lengthTemp = arrayTemp[0].length - 1;
//							src = internetAddress + src.slice(lengthTemp);
//							$scope.showPDF(src);
							//返回的Data为FileId,再通过fms获取文件
							/*						$wysqService.getfileList({
														id:data
													})
													.then(function(res) {
														if (res.success) {
															var src = res.data.filePathUrl;
															var arrayTemp = src.split("internet");
															var lengthTemp = arrayTemp[0].length-1;
															src = internetAddress + src.slice(lengthTemp);
															$scope.showPDF(src);
														}
													}, function(res) {});*/
						}
						console.log(res);
						//						$scope.searchAll();
					} else {
						$scope.showAlert("查询还在处理中！");
					}
				}, function(res) {
					$scope.hide();
					$scope.showAlert("查询还在处理中！");
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
