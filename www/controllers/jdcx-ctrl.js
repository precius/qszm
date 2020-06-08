angular.module('jdcxCtrl', []).controller('jdcxCtrl', ["$scope", "ionicToast", "$ionicHistory", "$wysqService", "$filter", "$dictUtilsService", "$registerService",
	function($scope, ionicToast, $ionicHistory, $wysqService, $filter, $dictUtilsService, $registerService) {
		$scope.goback = function() {
			$ionicHistory.goBack();
		};
		$scope.code = "获取验证码";
		$scope.qlxxQuery = {
			wwywh: "",
			tel: "",
			authCode: ""
		};
		if(mongoDbUserInfo != undefined && mongoDbUserInfo != null && mongoDbUserInfo.tel != undefined) {
			$scope.qlxxQuery.tel = mongoDbUserInfo.tel;
		}
		$scope.qlxxQuery.isShow = false;
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
					ionicToast.show('获取验证码成功！', 'middle', false, 2000);
				}

			}, function(res) {
				if(res.message == null || res.message == "" || res.message == "null") {
					ionicToast.show('获取验证码失败！', 'middle', false, 2000);
				} else {
					ionicToast.show(res.message, 'middle', false, 2000);
				}
			});
		}
		$scope.getCode = function() {
			if($scope.bGetCodeDisabled == undefined || !$scope.bGetCodeDisabled) {
				//验证手机号码
				var isPhone = $dictUtilsService.phone($scope.qlxxQuery.tel);
				if(!isPhone) {
					ionicToast.show('请输入正确的手机号码！', 'middle', false, 2000);
				} else {
					getTelCode($scope.qlxxQuery.tel);
				}
			}

		}
		$scope.query = function() {
			if($scope.qlxxQuery.wwywh === null || $scope.qlxxQuery.wwywh === "") {
				ionicToast.show('请输入业务号！', 'middle', false, 2000);
			} else if(!$dictUtilsService.phone($scope.qlxxQuery.tel)) {
				ionicToast.show('请输入正确的手机号码！', 'middle', false, 2000);
			} else if($scope.qlxxQuery.authCode === null || $scope.qlxxQuery.authCode === "") {
				ionicToast.show('请输入验证码！', 'middle', false, 2000);
			} else {
				$scope.qlxxQuery.isShow = false;
				$scope.getqlxx();
			}
		}
		//通过业务号获取业务信息，只需要接收ywh即可
		$scope.getqlxx = function() {
			$wysqService.getProcessInfoByWwyyhAndTel({
					"ywh": $scope.qlxxQuery.wwywh,
					"lxdh": $scope.qlxxQuery.tel,
					"djjg": county.code,
					"authCode": $scope.qlxxQuery.authCode
				})
				.then(function(res) {
					if(res.success) {
						$scope.qlxx = res.data;
						$scope.qlxxQuery.isShow = true;
						//过滤器格式化
						$scope.qlxx.yssj = $filter('date')($scope.qlxx.yssj, 'yyyy-MM-dd');
						$scope.setYsjd();
					} else {
						ionicToast.show(res.message, 'middle', false, 2000);
					}
				}, function(res) {
					ionicToast.show(res.message, 'middle', false, 2000);
				});
		}
		//预审进度
		var labelStr = '办理状态';
		$scope.ysjdArray = $dictUtilsService.getDictinaryByType(labelStr).childrens;
		//预审进度数据处理
		$scope.setYsjd = function() {
			$scope.ysjdArray = $scope.filterYsjd(); //对预审进度进行过滤，区分预审通过与不通过
			var index = $scope.getYsjd(); //获取预审进度具体节点
			for(var i = 0; i < $scope.ysjdArray.length; i++) {
				var ysjd = $scope.ysjdArray[i];
				//页面下显示各个审核节点状态
				if(i <= index) {
					ysjd.status = true;
				} else {
					ysjd.status = false;
				}
				ysjd.srcFinish = require("../theme/img/YSJD_FINISH.png");
				ysjd.srcUnfinish = require("../theme/img/YSJD_UNFINISH.png");
				ysjd.srcFucus = require("../theme/img/" + ysjd.value + "_FOCUS.png");
				ysjd.srcUnfucus = require("../theme/img/" + ysjd.value + "_UNFOCUS.png");
				ysjd.srcFinishToNext = require("../theme/img/YSJD_FINISH_TONEXT.png");
				ysjd.srcUnfinishToNext = require("../theme/img/YSJD_UNFINISH_TONEXT.png");
				if(ysjd.status) {
					ysjd.showsrcFinish = ysjd.srcFinish;
					ysjd.showsrcFucus = ysjd.srcFucus;
					ysjd.showsrcFinishToNext = ysjd.srcFinishToNext;
				} else {
					ysjd.showsrcFinish = ysjd.srcUnfinish;
					ysjd.showsrcFucus = ysjd.srcUnfucus;
					ysjd.showsrcFinishToNext = ysjd.srcUnfinishToNext;
				}
				//是否显示下一步连接线
				ysjd.isShowsrcFinishToNext = true;
				if(i == $scope.ysjdArray.length - 1) {
					ysjd.isShowsrcFinishToNext = false;
				}
			}
		}
		//对预审进度进行过滤，区分预审通过与不通过
		$scope.filterYsjd = function() {
			var ysjdArrayTemp = [];
			if("NETNOPASS" == $scope.qlxx.step) {
				for(var i = 0; i < $scope.ysjdArray.length; i++) {
					var tempYsjd = $scope.ysjdArray[i];
					if(tempYsjd.value != "NETPASSED") {
						ysjdArrayTemp.push(tempYsjd);
						if(tempYsjd.value == "NETNOPASS") {
							break;
						}
					}
				}
			} else {
				//剔除不通过
				for(var i = 0; i < $scope.ysjdArray.length; i++) {
					var tempYsjd = $scope.ysjdArray[i];
					if(tempYsjd.value == "NETNOPASS") {

					} else {
						ysjdArrayTemp.push(tempYsjd);
					}
				}
			}
			return ysjdArrayTemp;

		}
		//获取当前办理状态索引
		$scope.getYsjd = function() {
			var index = 0;
			for(var i = 0; i < $scope.ysjdArray.length; i++) {
				var tempYsjd = $scope.ysjdArray[i];
				if(tempYsjd.value == $scope.qlxx.step) {
					index = i;
					break;
				}
			}
			return index;
		};
		//模板图片地址
		$scope.imgData = [{
			src: require('../theme/img_menu/zs3.png')
		}, {
			src: require('../theme/img_menu/zs1.png')
		}, {
			src: require('../theme/img_menu/1.png')
		}];
		//不动产信息模板提示框
		$scope.showTips = false;
		$scope.clickTips = function(n) {
			console.log(n);
			if(n >= 0) {
				$scope.src = $scope.imgData[n].src;
				$scope.showTips = true;
			} else {
				$scope.showTips = false;
			}
		}
		//调用二维码扫描
		$wysqService.signature({
				url: signatureUrl
			})
			.then(function(res) {
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
						$scope.qlxxQuery.wwywh = result;
						$scope.$apply();
					}
				});
			}
		});
		wx.error(function() {
			alert("签名失败");
		});
	}
]);