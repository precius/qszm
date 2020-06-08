angular.module('faceSdsesFaceRecognitionCtrl', []).controller('faceSdsesFaceRecognitionCtrl', ["$scope", "ionicToast", "$ionicHistory", "$stateParams", "$state", "$ionicLoading", "$meService",
	function($scope, ionicToast, $ionicHistory, $stateParams, $state, $ionicLoading, $meService) {

		var certificate = $stateParams.jsonObj;

		//获取四位随机码
		var queryData = {
			apptype: "TYHT",
			subtype: "TYHT",
			ssUrlEnum: "FRONT_LIVEGETFOUR",
			idnum: certificate.citizen_id,
			idname: certificate.name
		};
		$meService.frontVerify(queryData)
			.then(function(res) {
				if(res.success) {
					var data = res.data;
					data = JSON.parse(data);
					$scope.fourNum = data.data.validate_data;
				} else {
					ionicToast.show(res.message, "middle", false, 2000);
				}
			}, function(res) {
				ionicToast.show(res.message, "middle", false, 2000);
			});

		var inputVideo = document.getElementById("file_video");
		readVideopFile = function() {
			show("视频识别中...");
			var file = this.files[0];
			uploadVideo(file);
		}
		inputVideo.addEventListener('change', readVideopFile, false);
		//{"code":"0","status":"1","message":{"code":"0","tradeNo":"20190227152342000811","message":"认证通过(00XX)"}}
		//获取录取的视频提交到服务器
		uploadVideo = function(file) {
			var formData = new FormData(); // FormData 对象
			formData.append("apptype", 'TYHT');
			formData.append("subtype", 'TYHT');
			formData.append("userId", mongoDbUserInfo.id); //用户ID;
			formData.append("idnum", certificate.citizen_id);
			formData.append("idname", certificate.name);

			formData.append("verifyNumber", $scope.fourNum);
			formData.append("streamNumber", 1);
			formData.append("ssUrlEnum", 'FRONT_VERIFYVIDEO');

			formData.append("videoFacePicture", certificate.file); // 文件对象

			formData.append("video", file); // 文件对象
			GM.CommonOper.uploadRequest(RESTURL.me.front_verifyVideo, formData, function(res) {
				hide();
				var data = JSON.parse(res.data);
				if(data.code == 0) {
					var message = data.message;
					if(message.code == 0) {
						ionicToast.show("认证通过", "middle", false, 2000);
						$state.go('tab.me', {}, {
							reload: true
						});
					} else {
						ionicToast.show(message.message, "middle", false, 2000);
					}
				} else {
					ionicToast.show(data.message, "middle", false, 2000);
				}
			}, function(res) {
				hide();
				ionicToast.show(res.message, "middle", false, 2000);
			});
		}

		//进度框
		function show(title) {
			$ionicLoading.show({
				template: '<ion-spinner icon="lines" class="spinner-calm"></ion-spinner><p>' + title + '</p>',
			});
		}

		function hide() {
			$ionicLoading.hide();
		}

		//返回
		$scope.goback = function() {
			$ionicHistory.goBack();
		}
	}
]);