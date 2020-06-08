angular.module('faceSdsesTakePhotoCtrl', []).controller('faceSdsesTakePhotoCtrl', ["$scope", "$rootScope","ionicToast", "$stateParams", "$state", "$filter","$ionicLoading", "$meService", "$dictUtilsService",
	function($scope, $rootScope,ionicToast, $stateParams, $state,$filter, $ionicLoading, $meService, $dictUtilsService) {
		//调用微信人脸识别之前进行签名
		var appId = null;
		$dictUtilsService.signature(function(res) {
			appId = res.data.appId;
		});
		$scope.certificate = {"zjh":"","name":""};
		$scope.base64 = {};
		$scope.photoSelected = false;
		var Orientation = null;

		function selectFileImage(file) {
			//图片方向角 added by lzk
			var Orientation = null;

			if(file) {
				console.log("正在上传,请稍后...");
				var rFilter = /^(image\/jpeg|image\/png)$/i; // 检查图片格式
				if(!rFilter.test(file.type)) {
					return;
				}
				// var URL = URL || webkitURL;
				//获取照片方向角属性，用户旋转控制
				EXIF.getData(file, function() {
					EXIF.getAllTags(this);
					Orientation = EXIF.getTag(this, 'Orientation');
				});

				var oReader = new FileReader();
				oReader.onload = function(e) {
					var image = new Image();
					image.src = e.target.result;
					image.onload = function() {
						var expectWidth = this.naturalWidth;
						var expectHeight = this.naturalHeight;
						if(this.naturalWidth > this.naturalHeight && this.naturalWidth > 800) {
							expectWidth = 800;
							expectHeight = expectWidth * this.naturalHeight / this.naturalWidth;
						} else if(this.naturalHeight > this.naturalWidth && this.naturalHeight > 1200) {
							expectHeight = 1200;
							expectWidth = expectHeight * this.naturalWidth / this.naturalHeight;
						}
						var canvas = document.createElement("canvas");
						var ctx = canvas.getContext("2d");
						canvas.width = expectWidth;
						canvas.height = expectHeight;
						ctx.drawImage(this, 0, 0, expectWidth, expectHeight);
						var base64 = null;
						//修复ios
						if(navigator.userAgent.match(/iphone/i)) {
							//alert(expectWidth + ',' + expectHeight);
							//如果方向角不为1，都需要进行旋转 added by lzk
							if(Orientation != null && Orientation != "" && Orientation != 1) {
								switch(Orientation) {
									case 6: //需要顺时针（向左）90度旋转
										rotateImg(this, 'left', canvas);
										break;
									case 8: //需要逆时针（向右）90度旋转
										rotateImg(this, 'right', canvas);
										break;
									case 3: //需要180度旋转
										rotateImg(this, 'right', canvas); //转两次
										rotateImg(this, 'right', canvas);
										break;
								}
							}
							base64 = canvas.toDataURL("image/jpeg", 0.8);
						}
						//					else if (navigator.userAgent.match(/Android/i)) {// 修复android
						//						base64 = canvas.toDataURL("image/jpeg", 0.8);
						//					}
						else {
							if(Orientation != null && Orientation != "" && Orientation != 1) {
								switch(Orientation) {
									case 6: //需要顺时针（向左）90度旋转
										rotateImg(this, 'left', canvas);
										break;
									case 8: //需要逆时针（向右）90度旋转
										rotateImg(this, 'right', canvas);
										break;
									case 3: //需要180度旋转
										rotateImg(this, 'right', canvas); //转两次
										rotateImg(this, 'right', canvas);
										break;
								}
							}
							base64 = canvas.toDataURL("image/jpeg", 0.8);
						}
						$scope.base64 = base64;
					};
				};
				oReader.readAsDataURL(file);
			}
		}
		//对图片旋转处理 added by lzk
		function rotateImg(img, direction, canvas) {
			//alert(img);
			//最小与最大旋转方向，图片旋转4次后回到原方向
			var min_step = 0;
			var max_step = 3;
			//var img = document.getElementById(pid);
			if(img == null) return;
			//img的高度和宽度不能在img元素隐藏后获取，否则会出错
			var height = img.height;
			var width = img.width;
			//var step = img.getAttribute('step');
			var step = 2;
			if(step == null) {
				step = min_step;
			}
			if(direction == 'right') {
				step++;
				//旋转到原位置，即超过最大值
				step > max_step && (step = min_step);
			} else {
				step--;
				step < min_step && (step = max_step);
			}
			var degree = step * 90 * Math.PI / 180;
			var ctx = canvas.getContext('2d');
			switch(step) {
				case 0:
					canvas.width = width;
					canvas.height = height;
					ctx.drawImage(img, 0, 0);
					break;
				case 1:
					canvas.width = height;
					canvas.height = width;
					ctx.rotate(degree);
					ctx.drawImage(img, 0, -height);
					break;
				case 2:
					canvas.width = width;
					canvas.height = height;
					ctx.rotate(degree);
					ctx.drawImage(img, -width, -height);
					break;
				case 3:
					canvas.width = height;
					canvas.height = width;
					ctx.rotate(degree);
					ctx.drawImage(img, -width, 0);
					break;
			}
		}
		var input3 = document.getElementById("file_input3");
		readFile3 = function() {
			var file = this.files[0];
			$scope.faceSrc = window.URL.createObjectURL(file);
			$scope.photoSelected = true;
			$scope.$apply();
			selectFileImage(file);
		}
		input3.addEventListener('change', readFile3, false);
		//OCR获取信息返回并且刷新
		$rootScope.$on('ocr-back', function(event, args) {
			//从OCR返回
			if(args.index == 0) {
				$scope.certificate.zjh = args.num;
				$scope.certificate.name = args.name;
			}
		});
		//使用ocr获取权利人信息
		$scope.qlrtoocr = function() {
			$state.go('ocr', {
				"index": 0,
				"jsonObj": $scope.qlr
			}, {
				reload: true
			});
		};
		//返回
		$scope.goback = function() {
			$state.go("tab.me");
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
				$scope.certificate = {};
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
			});
		}

		$scope.hide = function() {
			$ionicLoading.hide();
		}
		$scope.isShowTips = false;
		$scope.tips = "正在进行公安部身份验证，请稍后…";
		//公安部三要素实名验证
		$scope.queryData = {};
		$scope.isSuccess1 = false;
		unPoliceCertificate = function() {
			$scope.isSuccess1 = true;
			saveCertificate();
		}
    $scope.isSuccess = function(res,isThree){
      //$scope.hide();
      $scope.isShowTips = false;
      $scope.hide();
      var data = res.data;
      console.log(res);
      if(res.success) {
        if(isThree){
          if(data.resultGmsfhm == "一致" && data.resultXm == "一致" && data.resultFx == "系统判断为同一人") {
            $scope.isSuccess1 = true;
            saveCertificate();
            //系统判定为同一人
            $scope.showAlert(data.resultFx);
          } else if(data.resultFx != null) {
            $scope.showAlert(data.resultFx);
            if(data.resultFx == "") {
              $scope.showAlert('请确认姓名与身份证号是否一致');
            }
            console.log("验证失败");
          } else if(data.resultFs == null) {
            $scope.showAlert(data.errorMsg);
            console.log("验证失败");
          }
        }else{
          if(data.resultXm == null) {
            $scope.showAlert("姓名与身份证号不一致");
            console.log("验证失败");
          } else if(data.resultXm == "一致") {
            $scope.isSuccess1 = true;
            saveCertificate();
          } else {
            $scope.showAlert("姓名与身份证号不一致");
          }
        }
      }
    }
    $scope.isFail = function(res){
      //$scope.hide();
      $scope.isShowTips = false;
      $scope.showAlert("验证失败" + res.message);
      console.log(res.message);
      console.log("验证失败");
    }
		policeCertificate = function() {
			//先进行公安部实名认证，再保存实名认证信息到数据库中
			$scope.isSuccess1 = false;
      $scope.queryData = {};
			$scope.queryData.sbm = '武汉天耀宏图科技有限公司';
			$scope.queryData.gmsfhm = $scope.certificate.zjh;
			$scope.queryData.xm = $scope.certificate.name;
			$scope.queryData.fsd = 420116;
			$scope.queryData.ywlx = 'app';
			//			$scope.show("正在进行公安部身份信息验证");
			$scope.isShowTips = true;
      var userAgent = navigator.userAgent;
      // if(/(iPhone|iPad|iPod|iOS)/i.test(userAgent)){
      //   $meService.frontVerifyPoliceTwo($scope.queryData)
      //     .then(function(res) {
      //         $scope.isSuccess(res,false);
      //     }, function(res) {
      //         $scope.isFail(res);
      //     });
      // }else{
        var base64Temp = $scope.base64.replace(/[\r\n]/g, "");
        $scope.queryData.xp = base64Temp.substring(base64Temp.indexOf(",") + 1);
        $meService.frontVerifyPolice($scope.queryData)
          .then(function(res) {
              $scope.isSuccess(res,true);
          }, function(res) {
              $scope.isFail(res);
          });
      // }

		}
		wxFaceVerify = function(){
			if($scope.photoSelected) {
				//调用微信活体检测
				if(needWxFaceVerify) {
					$dictUtilsService.wxface(function() {
						if(needPoliceVerify){
							policeCertificate();
						}else{
							unPoliceCertificate();
						}
					}, appId, $scope.certificate.name, $scope.certificate.zjh);
				} else {
						if(needPoliceVerify){
							policeCertificate();
						}else{
							unPoliceCertificate();
						}
				}

			} else {
				ionicToast.show("请先选择脸部照片", "middle", false, 2000);
			}
		}
		//公安部二要素实名验证
		$scope.queryData = {};
		$scope.isSuccess1 = false;
		policeCertificateTwo = function() {
			//先进行公安部实名认证，再保存实名认证信息到数据库中
			$scope.isSuccess1 = false;
      $scope.queryData = {};
			$scope.queryData.sbm = '武汉天耀宏图科技有限公司';
			$scope.queryData.gmsfhm = $scope.certificate.zjh;
			$scope.queryData.xm = $scope.certificate.name;
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
							wxFaceVerify();
							//$scope.showAlert(data.resultXm);
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

		//保存实名认证
		if(userData.hasOwnProperty('data')) {
			$scope.loginName = userData.data.loginName;
		} else {
			var UrlSearchTemp = new UrlSearch();
			$scope.loginName = UrlSearchTemp.loginName;
			console.log($scope.loginName);
		}
		$scope.certificateSave = {};
		$scope.getoCertificate = function() {
			$scope.certificateSave.loginName = $scope.loginName;
			$scope.certificateSave.name = $scope.certificate.name;
			$scope.certificateSave.zjh = $scope.certificate.zjh;
//			$scope.certificateSave.address = $scope.certificate.address;
			$scope.certificateSave.xb = $dictUtilsService.getSexFromIdCard($scope.certificate.zjh);
			$scope.certificateSave.mz = 1;
			$scope.certificateSave.csrq = $filter('date')(new Date($dictUtilsService.getBirthdayFromIdCard($scope.certificate.zjh)), 'yyyy-MM-dd');
			//过滤器格式化
			$scope.certificateSave.csrq = $filter('date')($scope.certificateSave.csrq, 'yyyy-MM-dd');
			if($scope.certificateSave.name === undefined || $scope.certificateSave.name === null || $scope.certificateSave.name === "") {
				$scope.showAlert("请输入姓名");
			} else if($scope.certificateSave.zjh === undefined || $scope.certificateSave.zjh === null || $scope.certificateSave.zjh === "" || !$dictUtilsService.idcard($scope.certificateSave.zjh)) {
				$scope.showAlert("请输入正确的证件号");
			}
//			else if($scope.certificateSave.address === undefined || $scope.certificateSave.address === null || $scope.certificateSave.address === "") {
//				$scope.showAlert("请输入正确地址");
//			}
			else if($scope.certificateSave.xb === undefined || $scope.certificateSave.xb === null || $scope.certificateSave.xb === "") {
				$scope.showAlert("请选择性别");
			}
//			else if($scope.certificateSave.mz === undefined || $scope.certificateSave.mz === null || $scope.certificateSave.mz === "") {
//				$scope.showAlert("请选择民族");
//			}
			else if($scope.certificateSave.csrq === undefined || $scope.certificateSave.csrq === null || $scope.certificateSave.csrq === "") {
				$scope.showAlert("请选择出生日期");
			} else {
				//先验证当前人员的身份证与姓名是否一致，再跳转到拍摄照片页面
				if(needPoliceVerify){
					policeCertificateTwo();
				}else{
					wxFaceVerify();
				}
			}
		};
		//下一步
		$scope.next = function() {
			if($scope.photoSelected) {
				$scope.getoCertificate();
			} else {
				ionicToast.show("请先选择脸部照片", "middle", false, 2000);
			}
		}
	}
]);
