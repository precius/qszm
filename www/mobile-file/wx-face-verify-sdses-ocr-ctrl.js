angular.module('faceSdsesOcrCtrl', []).controller('faceSdsesOcrCtrl', ["$scope", "ionicToast", "$meService", "$dictUtilsService", "$state", "$ionicHistory", "$stateParams", "$filter", "$ionicLoading", "$loginService",
	function($scope, ionicToast, $meService, $dictUtilsService, $state, $ionicHistory, $stateParams, $filter, $ionicLoading, $loginService) {
		$scope.goback = function() {
			$ionicHistory.goBack();
		}
		$scope.certificate = {
			'address': '',
			'birthday': '',
			'citizen_id': '',
			'gender': '',
			'idcard_type': '',
			'name': '',
			'nation': '',
			'file': ''
		};
		$scope.showAlert = function(msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		};
		//显示拍照规范提示
		$scope.isShowTips = true;
		$scope.hideTips = function() {
			$scope.isShowTips = false;
		}
		//进度框
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

		$scope.isCertification = false;
		//获取个人信息
		$scope.mongoDbUserInfo = {};

		$scope.sendParam = {
			loginName: ""
		};
		$scope.queryPersonInfo = function() {
			$scope.sendParam.loginName = userData.data.loginName;
			//		$scope.sendParam.id = '5add94ffd4b3d672e0ffdce4';
			$meService.getMongoDbUserInfo($scope.sendParam)
				.then(function(response) {
					var result = angular.copy(response.data);
					//存放到constant中用户信息信息父级别，用来判断是否进行了实名认证
					mongoDbUserInfoFather = result;
					$scope.mongoDbUserInfo = result.userinfo;
					//存放到constant中用户信息
					mongoDbUserInfo = result.userinfo;
					//				$scope.getUserInfo($scope.mongoDbUserInfo);
					console.log($scope.mongoDbUserInfo);
					if($stateParams.name || $stateParams.num) {
						$scope.certificate.name = $stateParams.name;
						$scope.certificate.zjh = $stateParams.num;
					}
					//如果进行了实名认证，则无需再次进行实名认证
					if($dictUtilsService.isCertification()) {
						//如果没有进行人脸识别
						if(!$dictUtilsService.isFaceVerifySucceed()) {
							$scope.certificate.name = mongoDbUserInfo.name;
							$scope.certificate.citizen_id = mongoDbUserInfo.zjh;
							$state.go('faceSdsesTakePhoto', {
								"jsonObj": $scope.certificate
							}, {
								reload: true
							}); //跳转到高级实名认证页面						
						}
					}
				}, function(error) {
					$scope.showAlert("请求失败");
				});
		};

		if(userData.hasOwnProperty('data')) {
			$scope.queryPersonInfo();
		}

		function canvasDataURL(re, w, objDiv) {
			var newImg = new Image();
			newImg.src = re;
			var imgWidth, imgHeight, offsetX = 0,
				offsetY = 0;
			newImg.onload = function() {
				var img = document.createElement("img");
				img.src = newImg.src;
				imgWidth = img.width;
				imgHeight = img.height;
				var canvas = document.createElement("canvas");
				canvas.width = w;
				canvas.height = w;
				var ctx = canvas.getContext("2d");
				ctx.clearRect(0, 0, w, w);
				if(imgWidth > imgHeight) {
					imgWidth = w * imgWidth / imgHeight;
					imgHeight = w;
					offsetX = -Math.round((imgWidth - w) / 2);
				} else {
					imgHeight = w * imgHeight / imgWidth;
					imgWidth = w;
					offsetY = -Math.round((imgHeight - w) / 2);
				}
				ctx.drawImage(img, offsetX, offsetY, imgWidth, imgHeight);
				var base64 = canvas.toDataURL("image/jpeg", 0.7);
				if(typeof objDiv == "object") {
					objDiv.appendChild(canvas);
				} else if(typeof objDiv == "function") {
					objDiv(base64);
				}
			}

		};
		/**
		 *  三个参数
		 *	file：一个是文件(类型是图片格式)，
		 *  w：一个是文件压缩的后宽度，宽度越小，字节越小
		 *	objDiv：一个是容器或者回调函数
		 */
		function photoCompress(file, w, objDiv) {
			var ready = new FileReader();
			/*开始读取指定的Blob对象或File对象中的内容. 当读取操作完成时,readyState属性的值会成为DONE,如果设置了onloadend事件处理程序,则调用之.同时,result属性中将包含一个data: URL格式的字符串以表示所读取文件的内容.*/
			ready.readAsDataURL(file);
			ready.onload = function() {
				var re = this.result;
				canvasDataURL(re, w, objDiv)
			}
		}
		/**
		 * 上传身份证正面照片进行OCR验证
		 */
		$scope.queryData = {};
		$scope.photoSelected1 = false;
		$scope.isSuccess1 = false;
		$scope.uploadSfzPositive = function(base64) {
			$scope.isSuccess1 = false;
			$scope.queryData.apptype = 'TYHT';
			$scope.queryData.subtype = 'TYHT';
			$scope.queryData.type1 = 1;
			$scope.queryData.file1 = base64.substring(base64.indexOf(",") + 1);
			console.log($scope.queryData.file1);
			$scope.queryData.ssUrlEnum = 'FRONT_OCR';
			$meService.frontVerify($scope.queryData)
				.then(function(res) {
					$scope.hide();
					if(res.success) {
						var data = res.data;
						data = JSON.parse(data);
						console.log(res);
						if(data.idcard_ocr_result.idcard_type == 1) {
							$scope.isSuccess1 = true;
							$scope.certificate = data.idcard_ocr_result;
							$scope.showAlert("验证成功");
							console.log("验证成功");
						} else {
							$scope.showAlert("验证失败,请重新验证!");
							console.log("验证失败");
						}
					}
				}, function(res) {
					$scope.hide();
					$scope.showAlert("验证失败" + res.message);
					console.log(res.message);
					console.log("验证失败");
				});
		}
		//拍照完成获取拍照内容
		var input = document.getElementById("file_input1");
		readFile1 = function() {
			$scope.show("照片识别中...");
			var file = this.files[0];
			$scope.photoSelected1 = true;
			$scope.idCardSrc = window.URL.createObjectURL(file);
			$scope.$apply();
			photoCompress(file, 1000, function(base64) {
				//压缩完成,上传到服务器验证
				$scope.uploadSfzPositive(base64);
			});

		}
		input.addEventListener('change', readFile1, false);

		/**
		 * 上传身份证反面照片进行OCR验证
		 */
		$scope.photoSelected2 = false;
		$scope.isSuccess2 = false;
		var input2 = document.getElementById("file_input2");
		readFile2 = function() {
			$scope.show("正在验证身份证信息!");
			var file = this.files[0];
			$scope.photoSelected2 = true;
			$scope.idCardSrc2 = window.URL.createObjectURL(file);
			$scope.$apply();
			photoCompress(file, 1000, function(base64) {
				//压缩完成,上传到服务器验证
				$scope.uploadSfzOther(base64);
			});
		}
		input2.addEventListener('change', readFile2, false);
		$scope.uploadSfzOther = function(base64) {
			$scope.isSuccess2 = false;
			$scope.queryData.apptype = 'TYHT';
			$scope.queryData.subtype = 'TYHT';
			$scope.queryData.type1 = 2;
			$scope.queryData.file1 = base64.substring(base64.indexOf(",") + 1);
			console.log($scope.queryData.file1);
			$scope.queryData.ssUrlEnum = 'FRONT_OCR';
			$meService.frontVerify($scope.queryData)
				.then(function(res) {
					$scope.hide();
					if(res.success) {
						var data = res.data;
						console.log(res);
						data = JSON.parse(data);
						if(data.idcard_ocr_result.idcard_type == 2) {
							$scope.isSuccess2 = true;
							$scope.showAlert("验证成功");
							console.log("验证成功");
						} else {
							$scope.showAlert("验证失败,请重新验证!");
							console.log("验证失败");
						}
					}
				}, function(res) {
					$scope.hide();
					console.log(res.message);
					$scope.showAlert("验证失败," + res.message);
					console.log("验证失败");
				});
		}
		//密码解密算法
		$scope.decryptByDES = function(strMessage, key) {
			if(window.CryptoJS && window.CryptoJS.mode) {
				window.CryptoJS.mode.ECB = (function() {
					if(CryptoJS.lib) {
						var ECB = CryptoJS.lib.BlockCipherMode.extend();

						ECB.Encryptor = ECB.extend({
							processBlock: function(words, offset) {
								this._cipher.encryptBlock(words, offset);
							}
						});

						ECB.Decryptor = ECB.extend({
							processBlock: function(words, offset) {
								this._cipher.decryptBlock(words, offset);
							}
						});

						return ECB;
					}
					return null;
				}());
			}

			key = key || '\u0067\u0072\u0065\u0061\u0074\u006d\u0061\u0070';
			var keyHex = CryptoJS.enc.Utf8.parse(key);
			var decrypted = CryptoJS.DES.decrypt({
				ciphertext: CryptoJS.enc.Base64.parse(strMessage)
			}, keyHex, {
				mode: CryptoJS.mode.ECB,
				padding: CryptoJS.pad.Pkcs7
			});
			return decrypted.toString(CryptoJS.enc.Utf8);
		};
		//获取url中指定字段名的参数
		function UrlSearch() {
			var name, value;
			var str = location.href; //取得整个地址栏
			var num = str.indexOf("?");
			str = str.substr(num + 1); //str得到?之后的字符串
			str = decodeURIComponent(str); //还原url中被转义的字符
			str = $scope.decryptByDES(str); //解密
			var arr = str.split("&"); //得到&分割的参数，放入数组中
			for(var i = 0; i < arr.length; i++) {
				num = arr[i].indexOf("=");
				if(num > 0) {
					name = arr[i].substring(0, num);
					value = arr[i].substr(num + 1);
					this[name] = value;
				}
			}
		}
		var Request = new UrlSearch();
		//保存实名认证
		if(userData.hasOwnProperty('data')) {
			$scope.loginName = userData.data.loginName;
		} else {
			$scope.loginName = Request.loginName;
			console.log($scope.loginName);
		}
		//获取民族

		$scope.mz = {};
		getMz = function() {
			var mzStr = "民族";
			if(userData.hasOwnProperty('data')) {
				$scope.id = userData.data.id;
				console.log($scope.id);
				$scope.mzData = $dictUtilsService.getDictinaryByType(mzStr).childrens;
				console.log($scope.mzData);
				if($scope.mzData != null && $scope.mzData.length > 0) {
					$scope.mz = $scope.mzData[0];
				}
			} else {
				$scope.isCertification = false;
				//			$scope.id = Request.id;
				//			console.log($scope.id);
				//获取民族数据字典
				$loginService.getDict({
						currentId: 'null'
					})
					.then(function(res) {
						dictInfos = res.data;
						if(dictInfos != null && dictInfos.length > 0) {
							for(var i = 0; i < dictInfos.length; i++) {
								var dictInfo = dictInfos[i];
								if(dictInfo.label === "民族") {
									$scope.mzData = dictInfo;
									console.log($scope.mzData);
									break;
								}
							}
							if($scope.mzData != null && $scope.mzData.length > 0) {
								$scope.mz = $scope.mzData[0];
							}
						}
					}, function(res) {
						$scope.showAlert('获取数据字典失败' + res.message);
					});
			}
		}
		getMz();
		$scope.certificateSave = {};
		$scope.saveCertificate = function() {
			$scope.certificateSave.loginName = $scope.loginName;
			$scope.certificateSave.name = $scope.certificate.name;
			$scope.certificateSave.zjh = $scope.certificate.citizen_id;
			$scope.certificateSave.xb = $dictUtilsService.getSexFromIdCard($scope.certificate.citizen_id);
			$scope.certificateSave.mz = $scope.mz.value;
			$scope.certificateSave.csrq = $filter('date')(new Date($dictUtilsService.getBirthdayFromIdCard($scope.certificate.citizen_id)), 'yyyy-MM-dd');
			//过滤器格式化
			$scope.certificateSave.csrq = $filter('date')($scope.certificateSave.csrq, 'yyyy-MM-dd');
			if($scope.certificateSave.name === undefined || $scope.certificateSave.name === null || $scope.certificateSave.name === "") {
				$scope.showAlert("请输入姓名");
			} else if($scope.certificateSave.zjh === undefined || $scope.certificateSave.zjh === null || $scope.certificateSave.zjh === "" || !$dictUtilsService.idcard($scope.certificateSave.zjh)) {
				$scope.showAlert("请输入正确的证件号");
			} else if($scope.certificateSave.xb === undefined || $scope.certificateSave.xb === null || $scope.certificateSave.xb === "") {
				$scope.showAlert("请选择性别");
			} else if($scope.certificateSave.mz === undefined || $scope.certificateSave.mz === null || $scope.certificateSave.mz === "") {
				$scope.showAlert("请选择民族");
			} else if($scope.certificateSave.csrq === undefined || $scope.certificateSave.csrq === null || $scope.certificateSave.csrq === "") {
				$scope.showAlert("请选择出生日期");
			} else {
				//保存实名认证数据
				$meService.certificate($scope.certificateSave).then(function(response) {
					var result = angular.copy(response);
					//				$scope.showAlert("保存成功", "提交成功");
					//				$scope.queryPersonInfo();
					$state.go('faceSdsesTakePhoto', {
						"jsonObj": $scope.certificate
					}, {
						reload: true
					}); //跳转到高级实名认证页面
					if(wxyy) {
						//					$state.go("wxxzyysx");
					} else {
						$state.go('tab.me', {}, {
							reload: true
						});
					}
					$scope.certificateSave = {};
				}, function(error) {
					if(!error.success) {
						$scope.showAlert(error.message);
					}
				});
			}
		};
		$scope.nextStep = function() {
			if($scope.isSuccess1) {
				if($scope.isSuccess2) {
					$scope.saveCertificate();

				} else {
					$scope.showAlert('请验证身份证反面');
				}
			} else {
				$scope.showAlert('请验证身份证正面');
			}
		}
	}
]);