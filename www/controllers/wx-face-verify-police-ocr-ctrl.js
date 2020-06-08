angular.module('faceSdsesOcrCtrl', []).controller('faceSdsesOcrCtrl', ['$scope', 'ionicToast', '$meService', '$dictUtilsService', '$state', '$ionicHistory', '$filter', '$ionicLoading', '$loginService',
	function($scope, ionicToast, $meService, $dictUtilsService, $state, $ionicHistory, $filter, $ionicLoading, $loginService) {
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
			var base64Upload = base64.substring(base64.indexOf(",") + 1);
			//		base64Upload = base64Upload.replace(/[\r\n]/g,"");
			//		var param = {'image':base64Upload,'id_card_side':'front'};		
			//			if($scope.show != undefined){
			//				$scope.show("正在获取身份证信息");	
			//			}
			//			$meService.getOcrResult(param).then(function(res) {
			//				if($scope.hide != undefined){
			//					$scope.hide();					
			//				}
			//				if(res.success) {
			//					$scope.showAlert("验证成功");
			//					var result = angular.copy(res.data);
			//					var resultJson = GM.CommonOper.parseToJSON(result);
			//					var words_result = resultJson.words_result;
			//					$scope.certificate.name = words_result.姓名.words;
			//					$scope.certificate.citizen_id = words_result.公民身份号码.words;
			//					$scope.certificate.address = words_result.住址.words;
			//					$scope.isSuccess1 = true;
			//				} else {
			//					if($scope.showAlert != undefined){
			//						$scope.showAlert("身份证信息识别失败，请重试或者手动输入");
			//					}
			//				}
			//			}, function(error) {
			//				if($scope.hide != undefined){
			//					$scope.hide();					
			//				}
			//				if($scope.showAlert != undefined){
			//					$scope.showAlert("身份证信息识别失败，请重试或者手动输入");
			//				}			
			//			});	

			var jsonData = {
				'image': base64Upload,
				'configure': {
					'side': 'face'
				}
			};
			var strData = JSON.stringify(jsonData);
			$dictUtilsService.getAlibabaOcr($scope, strData, function(res) {
				$scope.certificate.name = res.name;
				$scope.certificate.citizen_id = res.num;
				$scope.certificate.address = res.address;
				$scope.isSuccess1 = true;
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
			//		$scope.show("正在验证身份证信息!");
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
			var base64Upload = base64.substring(base64.indexOf(",") + 1);
			//		var param = {'image':base64Upload,'id_card_side':'back'};
			//			if($scope.show != undefined){
			//				$scope.show("正在获取身份证信息");	
			//			}
			//			$meService.getOcrResult(param).then(function(res) {
			//				if($scope.hide != undefined){
			//					$scope.hide();					
			//				}
			//				if(res.success) {
			//					$scope.showAlert("验证成功");
			//					var result = angular.copy(res.data);
			//					var resultJson = GM.CommonOper.parseToJSON(result);
			//					var words_result = resultJson.words_result;
			//					$scope.isSuccess2 = true;
			//				} else {
			//					if($scope.showAlert != undefined){
			//						$scope.showAlert("身份证信息识别失败,请重试或者手动输入");
			//					}
			//				}
			//			}, function(error) {
			//				if($scope.hide != undefined){
			//					$scope.hide();					
			//				}
			//				if($scope.showAlert != undefined){
			//					$scope.showAlert("身份证信息识别失败,请重试或者手动输入");
			//				}			
			//			});
			var jsonData = {
				'image': base64Upload,
				'configure': {
					'side': 'back'
				}
			};
			var strData = JSON.stringify(jsonData);
			$dictUtilsService.getAlibabaOcr($scope, strData, function(res) {
				$scope.isSuccess2 = true;
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
		//	var Request = new UrlSearch();
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
		$scope.getoCertificate = function() {
			$scope.certificateSave.loginName = $scope.loginName;
			$scope.certificateSave.name = $scope.certificate.name;
			$scope.certificateSave.zjh = $scope.certificate.citizen_id;
			$scope.certificateSave.address = $scope.certificate.address;
			$scope.certificateSave.xb = $dictUtilsService.getSexFromIdCard($scope.certificate.citizen_id);
			$scope.certificateSave.mz = $scope.mz.value;
			$scope.certificateSave.csrq = $filter('date')(new Date($dictUtilsService.getBirthdayFromIdCard($scope.certificate.citizen_id)), 'yyyy-MM-dd');
			//过滤器格式化
			$scope.certificateSave.csrq = $filter('date')($scope.certificateSave.csrq, 'yyyy-MM-dd');
			if($scope.certificateSave.name === undefined || $scope.certificateSave.name === null || $scope.certificateSave.name === "") {
				$scope.showAlert("请输入姓名");
			} else if($scope.certificateSave.zjh === undefined || $scope.certificateSave.zjh === null || $scope.certificateSave.zjh === "" || !$dictUtilsService.idcard($scope.certificateSave.zjh)) {
				$scope.showAlert("请输入正确的证件号");
			} else if($scope.certificateSave.address === undefined || $scope.certificateSave.address === null || $scope.certificateSave.address === "") {
				$scope.showAlert("请输入正确地址");
			} else if($scope.certificateSave.xb === undefined || $scope.certificateSave.xb === null || $scope.certificateSave.xb === "") {
				$scope.showAlert("请选择性别");
			} else if($scope.certificateSave.mz === undefined || $scope.certificateSave.mz === null || $scope.certificateSave.mz === "") {
				$scope.showAlert("请选择民族");
			} else if($scope.certificateSave.csrq === undefined || $scope.certificateSave.csrq === null || $scope.certificateSave.csrq === "") {
				$scope.showAlert("请选择出生日期");
			} else {
				//先验证当前人员的身份证与姓名是否一致，再跳转到拍摄照片页面
				policeCertificateTwo();
			}
		};
		$scope.nextStep = function() {
			//跳转到拍摄照片页面
			$scope.getoCertificate();
			//		if($scope.isSuccess1) {
			//			if($scope.isSuccess2) {
			//				//跳转到拍摄照片页面
			//				$scope.getoCertificate();
			//			} else {
			//				$scope.showAlert('请验证身份证反面');
			//			}
			//		} else {
			//			$scope.showAlert('请验证身份证正面');
			//		}
		}
		//公安部实名认证通过后保存实名认证信息
		saveCertificate = function() {
			//保存实名认证数据
			$meService.certificate($scope.certificateSave).then(function(response) {
				var result = angular.copy(response);
				$scope.showAlert("实名认证成功");
				//跳转到个人中心页面
				$state.go('tab.me', {}, {
					reload: true
				});
				certificate = {};
			}, function(error) {
				if(!error.success) {
					$scope.showAlert(error.message);
				}
			});
		}
		$scope.showAlert = function(msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		};
		//进度框
		$scope.show = function(title) {
			$ionicLoading.show({
				template: '<ion-spinner icon="lines" class="spinner-calm"></ion-spinner><p>' + title + '</p>',
				duration: 10000
			});
		}

		$scope.hide = function() {
			$ionicLoading.hide();
		}
		//公安部二要素实名验证
		$scope.queryData = {};
		$scope.isSuccess1 = false;
		policeCertificateTwo = function() {
			//先进行公安部实名认证，再保存实名认证信息到数据库中
			$scope.isSuccess1 = false;
			$scope.queryData.sbm = '武汉天耀宏图科技有限公司';
			$scope.queryData.gmsfhm = $scope.certificateSave.zjh;
			$scope.queryData.xm = $scope.certificateSave.name;
			$scope.queryData.fsd = 420116;
			$scope.queryData.ywlx = 'app';
			//			$scope.show("正在进行公安部身份信息验证");
			$scope.show("正在进行身份信息验证");
			$meService.frontVerifyPoliceTwo($scope.queryData)
				.then(function(res) {
					$scope.hide();
					if(res.success) {
						var data = res.data;
						console.log(res);
						if(data.resultXm == null) {
							$scope.showAlert("姓名与身份证号不一致");
							console.log("验证失败");
						} else if(data.resultXm == "一致") {
							$scope.isSuccess1 = true;
							//跳转到拍摄照片页面
							$state.go('faceSdsesTakePhoto', {
								'jsonObj': $scope.certificateSave
							}, {
								reload: true
							});
							//							$scope.showAlert(data.resultXm);
						} else {
							$scope.showAlert("姓名与身份证号不一致");
							//							$scope.showAlert(data.resultXm);
						}
					}
				}, function(res) {
					$scope.hide();
					$scope.showAlert("验证失败" + res.message);
					console.log(res.message);
					console.log("验证失败");
				});
		}
	}
]);