//真伪查询
angular.module('zwcxCtrl', []).controller('zwcxCtrl', ["$scope", "ionicToast", "$ionicHistory", "$searchService", "$dictUtilsService", "$registerService", "$ionicLoading", "$state", "$wysqService",
	function($scope, ionicToast, $ionicHistory, $searchService, $dictUtilsService, $registerService, $ionicLoading, $state, $wysqService) {
		$scope.goback = function() {
			$ionicHistory.goBack(); //返回上一个页面
		}

		//显示PDF文档
		$scope.showPDF = function(url) {
			$scope.jsonObj = {
				title: '不动产权属真伪',
				pdfUrl: url,
				pdfName: 'bdcqszw.pdf',
				pdfLocalDirctory: 'bdcqszw'
			};
			$state.go('pdfShow', {
				"jsonObj": $scope.jsonObj
			}, {
				reload: true
			});
		}
		$scope.cret = {

		}
		if($dictUtilsService.isLogin()) {
			//获取用户信息（电话号码）
			$scope.userTel = userData.data.userInfo.phone;
		}
		//提交证书查验信息
		$scope.zwcx = function() {
			if(!$scope.verifyData()) {
				return;
			}
			if($scope.cret.yzCode == null || $scope.cret.yzCode == '' || $scope.cret.yzCode == "") {
				$scope.showAlert("请输入验证码");
				return;
			}
			$searchService.zwcx({
					cdbh: $scope.cret.cdbh,
					qlrzjh: $scope.cret.qlrzjh,
					qlrmc: $scope.cret.qlrmc,
					phone: $scope.userTel,
					authCode: $scope.cret.yzCode
				})
				.then(function(res) {
					if(res.success) {
						if(res.data) {
							$scope.showAlert("此证明为真！");
						} else {
							$scope.showAlert("暂无此证明相关信息！");
						}
						/*					console.log(res);
											if(data == null){
												$scope.showAlert( "证书为假");
											}else{
												//返回的Data为FileId,再通过fms获取文件
												$wysqService.getfileList({
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
												}, function(res) {});
											}*/

					}
				}, function(res) {
					console.log(res);
					$scope.showAlert("查询失败！");
				});

		}
		//验证数据保存信息
		$scope.verifyData = function() {
			var canSave = false;
			if($scope.cret.cdbh == undefined || $scope.cret.cdbh === null || $scope.cret.cdbh === "") {
				$scope.showAlert("请输入查档编号");
			} else if($scope.cret.qlrmc == undefined || $scope.cret.qlrmc === null || $scope.cret.qlrmc === "") {
				$scope.showAlert("请输入权利人名称");
			} else if($scope.cret.qlrzjh == undefined || $scope.cret.qlrzjh === null || $scope.cret.qlrzjh === "") {
				$scope.showAlert("请输入权利人证件号");
			} else {
				canSave = true;
			}
			return canSave;
		}

		//获取验证码按钮文字
		$scope.code = "获取验证码";
		$scope.bGetCodeDisabled = false;

		$scope.getTelCode = function() {
			//		获取验证码之前检查信息填写是否正确
			if(!$scope.verifyData()) {
				return;
			}
			if($scope.bGetCodeDisabled) {
				$scope.showAlert("60秒内请勿重复获取!");
				return;
			}
			$registerService.getPhoneCode({
				phone: $scope.userTel,
				areaCode: 640000
			}).then(function(res) {
				console.log("请求成功");
				if(res.success) {
					$dictUtilsService.addCodeInteral($scope);
				}

			}, function(res) {
				console.log(res.message);
				console.log("获取验证码失败！");
				if(res.message == null || res.message == "" || res.message == "null") {
					$scope.showAlert("获取验证码失败");
				} else {
					$scope.showAlert(res.message);
				}
			});
		}

		show = function() {
			$ionicLoading.show({
				template: '<ion-spinner icon="lines" class="spinner-calm"></ion-spinner><p>加载中……</p>'
			});
		};
		hide = function() {
			$ionicLoading.hide();
		};

		//提示对话框
		$scope.showAlert = function(msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		};

	}
]);