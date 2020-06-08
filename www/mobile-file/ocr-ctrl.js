angular.module('ocrCtrl', []).controller('ocrCtrl', ["$scope", "$cordovaCamera", "$ionicActionSheet", "$state", "$ionicHistory", "$stateParams", "$ionicLoading", "$rootScope",
	function($scope, $cordovaCamera, $ionicActionSheet, $state, $ionicHistory, $stateParams, $ionicLoading, $rootScope) {
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
		//选择图片获取方式
		$scope.addPhoto = function() {
			$ionicActionSheet.show({
				cancelOnStateChange: true,
				cssClass: 'action_s',
				titleText: "请选择获取图片方式",
				buttons: [{
					text: '相机'
				}, {
					text: '图库'
				}],
				cancelText: '取消',
				cancel: function() {
					return true;
				},
				buttonClicked: function(index) {

					switch(index) {
						case 0:
							$scope.takePhoto();
							break;
						case 1:
							$scope.pickImage();
							break;
						default:
							break;
					}
					return true;
				}
			});
		};
		//拍照
		$scope.takePhoto = function() {
			var options = {
				quality: 100,
				destinationType: Camera.DestinationType.DATA_URL,
				sourceType: Camera.PictureSourceType.CAMERA, //资源类型：CAMERA打开系统照相机；PHOTOLIBRARY打开系统图库
				targetWidth: 400, //宽度
				targetHeight: 300 //高度
			};
			$cordovaCamera.getPicture(options)
				.then(function(imageURI) {
					$scope.imageSrc = "data:image/jpeg;base64," + imageURI;
					$scope.data = imageURI;
					$scope.icon = false;
					$scope.test();
				}, function(err) {
					// Error
				});
		};
		//选择照片
		$scope.pickImage = function() {
			var options = {
				quality: 100,
				destinationType: Camera.DestinationType.DATA_URL,
				sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM, //资源类型：CAMERA打开系统照相机；PHOTOLIBRARY打开系统图库
				targetWidth: 400, //宽度
				targetHeight: 300 //高度
			};
			$cordovaCamera.getPicture(options)
				.then(function(imageURI) {
					$scope.imageSrc = "data:image/jpeg;base64," + imageURI;
					$scope.data = imageURI;
					$scope.icon = false;
					$scope.test();
				}, function(err) {
					// Error
				});
		};
		$scope.person = {}
		//OCR验证
		$scope.test = function() {
			var param = {
				'image': $scope.data,
				'id_card_side': 'front'
			};
			$dictUtilsService.getOcrResult($scope, param, function(res) {
				if(res.success) {
					var result = angular.copy(res.data);
					var resultJson = GM.CommonOper.parseToJSON(result);
					var words_result = resultJson.words_result;
					$scope.person.name = words_result.姓名.words;
					$scope.person.num = words_result.公民身份号码.words;
				}
			});
		};
		//确认返回并把身份证信息存到服务里
		$scope.confirm = function($ocrService) {
			if($scope.i === 0) {
				$state.go('mine-certificate', {
					"id": $scope.id,
					"index": $scope.i,
					"name": $scope.person.name,
					"num": $scope.person.num,
					"jsonObj": jsonObj
				}, {
					reload: true
				});
			} else {
				$ionicHistory.goBack();
				$rootScope.$broadcast('ocr-back', {
					"id": $scope.id,
					"index": $scope.i,
					"name": $scope.person.name,
					"num": $scope.person.num,
					"jsonObj": jsonObj
				});
			}
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
	}
]);