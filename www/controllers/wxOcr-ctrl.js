angular.module('ocrCtrl', []).controller('ocrCtrl', ["$scope", "ionicToast", "$wysqService", "$ionicHistory", "$stateParams", "$ionicLoading", "$rootScope", "$dictUtilsService", "$meService",
	function($scope, ionicToast, $wysqService, $ionicHistory, $stateParams, $ionicLoading, $rootScope, $dictUtilsService, $meService) {
		//从那一页传来的ID
		$scope.i = $stateParams.index;
		$scope.id = $stateParams.id;
		$scope.stateGo = $stateParams.stateGo;
		var jsonObj = $stateParams.jsonObj;
		console.log($scope.i);
		//拍照按钮初始时显示
		$scope.icon = true;
		//返回上一页
		$scope.goback = function() {
			$ionicHistory.goBack();
		};
		//显示拍照规范提示
		$scope.isShowTips = true;
		$scope.hideTips = function() {
			$scope.isShowTips = false;
		}
		/**
		 * 拍摄按钮拍摄照片--start
		 */
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
						'chooseImage',
						'getLocalImgData',
						'previewImage',
						'uploadImage',
						'downloadImage'
					],
				});
			}, function(res) {
				$scope.showAlert('请求失败！');
			});
		//签名成功后执行的函数
		wx.ready(function() {
			$scope.addPhoto = function(fjzl) {
				wx.chooseImage({
					count: 1, //默认9  
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有  
					sourceType: ['album', 'camera'], //可以指定来源是相册还是相机，默认二者都有  
					success: function(res) {
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
									$scope.imageSrc = localData;
									$scope.data = base64;
									$scope.icon = false;
									$scope.test();
								} else if(phone_type == 'android') {
									$scope.imageSrc = "data:image/jpeg;base64," + res.localData;
									$scope.data = abase64;
									$scope.icon = false;
									$scope.test();
								}
							}
						});

					}
				});
			}
		});
		wx.error(function(res) {
			$scope.showAlert("error" + res);
		});
		$scope.person = {}
		//OCR验证
		$scope.test = function() {
			//		var param = {'image':$scope.data,'id_card_side':'front'};	
			//			if($scope.show != undefined){
			//				$scope.show("正在获取身份证信息");	
			//			}
			//			$meService.getOcrResult(param).then(function(res) {
			//				if($scope.hide != undefined){
			//					$scope.hide();					
			//				}
			//				if(res.success) {
			//					var result = angular.copy(res.data);
			//					var resultJson = GM.CommonOper.parseToJSON(result);
			//					var words_result = resultJson.words_result;
			//					$scope.person.name = words_result.姓名.words;
			//					$scope.person.num = words_result.公民身份号码.words;
			//				} else {
			//					if($scope.showAlert != undefined){
			//						$scope.showAlert("获取信息失败");
			//					}
			//				}
			//			}, function(error) {
			//				if($scope.hide != undefined){
			//					$scope.hide();					
			//				}
			//				if($scope.showAlert != undefined){
			//					$scope.showAlert("获取信息失败");
			//				}			
			//			});			
			var jsonData = {
				'image': $scope.data,
				'configure': {
					'side': 'face'
				}
			};
			var strData = JSON.stringify(jsonData);
			$dictUtilsService.getAlibabaOcr($scope, strData, function(res) {
				$scope.person.name = res.name;
				$scope.person.num = res.num;
				$scope.isSuccess2 = true;
			});
		};
		//确认返回并把身份证信息存到服务里
		$scope.confirm = function($ocrService) {
			$ionicHistory.goBack();
			$rootScope.$broadcast('ocr-back', {
				"id": $scope.id,
				"index": $scope.i,
				"name": $scope.person.name,
				"num": $scope.person.num,
				"jsonObj": jsonObj
			});
		}
		//正在获取身份证信息
		$scope.show = function(title) {
			$ionicLoading.show({
				//template: '上传中...'
				template: '<ion-spinner icon="lines" class="spinner-calm"></ion-spinner><p>' + title + '</p>',
				duration: 10000
			});
		};
		$scope.hide = function() {
			$ionicLoading.hide();
		};

		$scope.showAlert = function(msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		};
	}
]);