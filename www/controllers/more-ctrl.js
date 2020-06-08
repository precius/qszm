angular.module('moreCtrl', []).controller('moreCtrl', ["$scope", "ionicToast", "$rootScope", "$ionicHistory", "$stateParams",
	"$state", "$dictUtilsService", "$ionicPopup", "$wyyyService", "$menuService",
	function ($scope, ionicToast, $rootScope, $ionicHistory, $stateParams, $state, $dictUtilsService, $ionicPopup, $wyyyService, $menuService) {
		//调用微信人脸识别之前进行签名
		var appId = null;
		$dictUtilsService.signature(function (res) {
			appId = res.data.appId;
		});
		//返回
		$scope.goback = function () {
			$ionicHistory.goBack();
		}
		//跳转登录对话框
		$scope.showConfirmFour = function (titel, okText, cancelText, contentText) {
			var confirmPopup = $ionicPopup.confirm({
				title: titel,
				okText: okText,
				cancelText: cancelText,
				content: contentText
			});
			confirmPopup.then(function (res) {
				if (res) {
					$loginService.flag = 1;
					$state.go('login', {
						'fromPosition': 'tab.me'
					});
				} else {

				}
			});
		};
		$scope.level1MenuArray = [];
		if ($menuService.level1MenuArray != null) {
			$scope.level1MenuArray = $menuService.level1MenuArray;//从后台获取的菜单；
			console.log(JSON.stringify($scope.level1MenuArray));
		}
		//给【流程申请菜单】配置描述文字和菜单图片
		for (var i = 0; i < $scope.level1MenuArray.length; i++) {
			if ($scope.level1MenuArray[i].name.indexOf("过户") != -1) {
				$scope.level1MenuArray[i].src = require("../theme/img_home/transfer.png");
				$scope.level1MenuArray[i].des = "过户一站办，快速又省心";
			} else if ($scope.level1MenuArray[i].name.indexOf("抵押") != -1) {
				$scope.level1MenuArray[i].src = require("../theme/img_home/mortgage.png");
				$scope.level1MenuArray[i].des = "不动产抵押一站办";
			} else if ($scope.level1MenuArray[i].name.indexOf("变更") != -1) {
				$scope.level1MenuArray[i].src = require("../theme/img_home/change.png");
				$scope.level1MenuArray[i].des = "不动产变更一站办";
			} else if ($scope.level1MenuArray[i].name.indexOf("更正") != -1) {
				$scope.level1MenuArray[i].src = require("../theme/img_home/home_service.png");
				$scope.level1MenuArray[i].des = "不动产更正一站办";
			} else if ($scope.level1MenuArray[i].name.indexOf("合并") != -1) {
				$scope.level1MenuArray[i].src = require("../theme/img_home/transfer.png");
				$scope.level1MenuArray[i].des = "一次申请，处理多个流程";
			} else {
				$scope.level1MenuArray[i].src = require("../theme/img_home/order.png");
				$scope.level1MenuArray[i].des = "高效办，省心办";
			}
		}

		//网上办事的全部菜单 预约排号和上门预约是在移动端写死，其余的所有申请流程菜单从后台配置，若没配则没有流程菜单
		var onlineData = [
			// {
			// 	src: require("../theme/img_home/order.png"),
			// 	name: "预约排号",
			// 	des: "提早预约免排队、快速办理真省心",
			// 	page: "yyxz",
			// 	hasConfigInSerer: true,
			// 	permValue: 'IEBDC:SY:WYYY'
			// },
			{
				src: require("../theme/img_home/home_service.png"),
				name: "上门预约",
				des: "绿色通道，上门服务",
				//				page: ""
				page: "smyy",
				hasConfigInSerer: true,
				permValue: 'IEBDC:SY:WYSM'
			}

		];

		var infoData = [
		{
			src: require("../theme/img_home/schedule.png"),
			name: "进度查询",
			des: "业务办理情况轻松掌握",
			//				page: ""
			page: "jdcx",
			hasConfigInSerer: true,
			permValue: 'IEBDC:SY:JDCX'
		},
		{
			src: require("../theme/img_home/qszm_check.png"),
			name: "不动产证明",
			des: "名下不动产情况查询证明",
			//				page: ""
			page: "qszmxxlist",
			hasConfigInSerer: true,
			permValue: 'IEBDC:SY:BDCZMCX'
		},
		{
			src: require("../theme/img_home/zszw_check.png"),
			name: "权属真伪查询",
			des: "权属证明真伪一键核查",
			//				page: ""
			page: "zwcx",
			hasConfigInSerer: false,
		},
		{
			src: require("../theme/img_home/zshs.png"),
			name: "证书验证",
			des: "证书真伪一键核查",
			page: "zsyzlist",
			hasConfigInSerer: true,
			permValue: 'IEBDC:SY:ZSHS'
		},
		{
			src: require("../theme/img_home/ems.png"),
			name: "EMS查询",
			des: "证书物流实时把握",
			page: "logistics-search",
			hasConfigInSerer: false
			/* page: "" */
		}
		];

		var convenientData = [{
			src: require("../theme/img_home/service_site.png"),
			name: "服务网点",
			des: "网点导航就近办",
			page: "fwwd",
			hasConfigInSerer: false
		},
		{
			src: require("../theme/img_home/online_service.png"),
			name: "在线客服",
			des: "有问必答",
			page: "zxkf",
			hasConfigInSerer: false
		},
		{
			src: require("../theme/img_home/suggest.png"),
			name: "投诉建议",
			des: "您的建议是最宝贵的财富",
			page: "suggest",
			hasConfigInSerer: false
		},
		// {
		// 	src: require("../theme/img_home/3d_show.png"),
		// 	name: "实景大厅",
		// 	des: "纵览三维实景，享受智能服务",
		// 	page: "sjdt_nav",
		// 	hasConfigInSerer: false
		// }
		];
		$scope.showSqMenu = false;//是否显示从后台获取的申请流程菜单
		var flag = $stateParams.flag;

		switch (flag) {
			case 1:
				$scope.title = "网上办事";
				$scope.listData = onlineData;
				$scope.showSqMenu = true;
				break;
			case 2:
				$scope.title = "信息查询";
				$scope.listData = infoData;
				$scope.showSqMenu = false;
				break;
			case 3:
				$scope.title = "便民站点";
				$scope.listData = convenientData;
				$scope.showSqMenu = false;
				break;
			default:
				$scope.title = "";
				$scope.listData = null;
				$scope.showSqMenu = false;
				break;
		}
		$scope.gotoLevel1Menu = function (index) {
			if (!$dictUtilsService.isLogin()) {
				$scope.showConfirmFour('提示', '确认', '取消', "请先登录再办理业务");
				return;
			}
			if (!$dictUtilsService.isCertification()) {
				showAlert("请在'我的'页面完成实名认证!");
				return;
			}
			if (!$dictUtilsService.hasPermisonByPermValue($scope.level1MenuArray[index].code)) {
				showAlert("该功能暂未开通");
				return;
			}
			$menuService.level1Menu = $scope.level1MenuArray[index];//用服务保存点击的一级菜单数据，再跳转到一级菜单界面
			$state.go('level1menu');
		}
		//页面跳转
		$scope.gotoPage = function (item) {
			if (item.hasConfigInSerer || item.page == 'zwcx') {
				if (!$dictUtilsService.isLogin()) {
					$scope.showConfirmFour('提示', '确认', '取消', "请先登录再办理业务");
					return;
				}
				if (!$dictUtilsService.isCertification()) {
					showAlert("请在'我的'页面完成实名认证!");
					return;
				}
				if (!$dictUtilsService.hasPermisonByPermValue(item.permValue)) {
					showAlert("该功能暂未开通");
					return;
				}
			}
			var page = item.page;
			if (page == "") {
				showAlert("该功能暂未开通");
			} else if (page == "yyxz") {
				if (!$dictUtilsService.isCertification()) {
					$scope.showConfirm1('提示', '确认', '取消', "立即进行公安部实名身份认证！");
				} else {
					//实名认证过了，调用微信人脸识别
					if (needWxFaceVerify) {
						$dictUtilsService.wxface(function (data) {
							$state.go(page);
						}, appId, mongoDbUserInfo.name, mongoDbUserInfo.zjh);
					} else {
						$state.go(page);
					}

				}
			} else if (page == "map") {
				$state.go(page);
				$rootScope.$broadcast('on-map', {
					index: 1
				});
			} else if (page == "qszmxxlist") {
				if (!$dictUtilsService.isCertification()) {
					$scope.showConfirm1('提示', '确认', '取消', "立即进行公安部实名身份认证！");
				} else {
					//实名认证过了，调用微信人脸识别
					if (needWxFaceVerify) {
						$dictUtilsService.wxface(function (data) {
							$state.go('qszmxxlist');
						}, appId, mongoDbUserInfo.name, mongoDbUserInfo.zjh);
					} else {
						$state.go('qszmxxlist');
					}

				}
			} else if (page == "smyy") {
				if ($dictUtilsService.isLogin()) {
					if (!$dictUtilsService.isCertification()) {
						$scope.showConfirm1('提示', '确认', '取消', "立即进行公安部实名身份认证！");
					} else {
						//实名认证过了，调用微信人脸识别
						if (needWxFaceVerify) {
							$dictUtilsService.wxface(function (data) {
								$state.go('smyyxy');
							}, appId, mongoDbUserInfo.name, mongoDbUserInfo.zjh);
						} else {
							$state.go('smyyxy');
						}
					}
				} else {
					$scope.showLoginConfirm('提示', '确认', '取消', "请先登录再发起预约");
				}
			} else if (page == "zsyzlist") {
				if ($dictUtilsService.isLogin()) {
					if (!$dictUtilsService.isCertification()) {
						$scope.showConfirm1('提示', '确认', '取消', "立即进行公安部实名身份认证！");
					} else {
						//实名认证过了，调用微信人脸识别
						if (needWxFaceVerify) {
							$dictUtilsService.wxface(function (data) {
								$state.go(page);
							}, appId, mongoDbUserInfo.name, mongoDbUserInfo.zjh);
						} else {
							$state.go(page);
						}

					}
				} else {
					$scope.showLoginConfirm('提示', '确认', '取消', "请先登录用户。");
				}
			} else if (page == "zxkf") {
				window.open("https://cloud.chatbot.cn/cloud/robot/webui/5c47d586200000e36368d382")
			} else {
				$state.go(page);
			}
		}

		showAlert = function (msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		};

		//跳转登录对话框
		$scope.showLoginConfirm = function (titel, okText, cancelText, contentText) {
			var confirmPopup = $ionicPopup.confirm({
				title: titel,
				okText: okText,
				cancelText: cancelText,
				content: contentText
			});
			confirmPopup.then(function (res) {
				if (res) {
					$state.go('login', {
						'fromPosition': 'more'
					});
				} else {

				}
			});
		};
		//实名认证跳转登录对话框
		$scope.showConfirm1 = function (titel, okText, cancelText, contentText) {
			var confirmPopup = $ionicPopup.confirm({
				title: titel,
				okText: okText,
				cancelText: cancelText,
				content: contentText
			});
			confirmPopup.then(function (res) {
				if (res) {
					$state.go('mine-certificate');
				} else {

				}
			});
		};

	}
]);
