angular.module('pdfCtrl', []).controller('pdfCtrl', ["$scope", "$ionicHistory", "$stateParams",
	function($scope, $ionicHistory, $stateParams) {
		$scope.goback = function() {
			$ionicHistory.goBack(); //返回上一个页面
		};
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
			console.log(str);
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
		if($stateParams.jsonObj) {
			$scope.src = $stateParams.jsonObj;
		} else {
			$scope.src = Request.fileUrl;
		}
		$('#handout_wrap_inner').media({
			width: '100%',
			height: '100%',
			autoplay: true,
			src: $scope.src
		});
	}
]);