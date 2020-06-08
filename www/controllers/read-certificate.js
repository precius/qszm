angular.module('readCertificateCtrl', []).controller('readCertificateCtrl', ["$scope", "$state", "$ionicHistory", "$stateParams", "$qszmService", "$ionicLoading", "ionicToast",
	function ($scope, $state, $ionicHistory, $stateParams, $qszmService, $ionicLoading, ionicToast) {
		$scope.showAlert = function (msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		};
		//进度框
		$scope.show = function (title) {
			$ionicLoading.show({
				template: '<ion-spinner icon="lines" class="spinner-calm"></ion-spinner><p>' + title + '</p>',
				duration: 6000
			});
		}
		$scope.hide = function () {
			$ionicLoading.hide();
		}

		queryCertificate = function () {
			$scope.show('正在验证真伪,请稍后');
			var src = jsonObjParam;
			var str = Base64.decode(src);
			var queryArray = str.split(':');
			var key = queryArray[0];
			var value = queryArray[1];
			var sendParam = { 'key1': value };
			for (var item in sendParam) {
				sendParam[key] = sendParam[item];
				delete sendParam[item];
			}
			if ('cxbh' == key) {
				// $scope.title = '权属真伪查验';
				$scope.title = '不动产证明验证';
				//查询权属证明
				queryQszmFalse(sendParam);
			} else if ('ywh' == key) {
				$scope.title = '不动产权证明查验';
				//不动产登记
				queryBdcdjzsFalse(sendParam);
			} else {
				$scope.hide();
			}
		};
		var url = window.location.href;
		var jsonObjParam1 = url.split('?')[1]
		var jsonObjParam = jsonObjParam1.split('#')[0]
		// var jsonObjParam = "Y3hiaDpCSDIwMjAwNDA5MDAwMjIy";
		//  var jsonObjParam = "Y3hiaDpCSDIwMjAwNDE4MDAwMDA1";
		// var jsonObjParam = "BH20200605000013";

		$scope.result = [];
		$scope.resultBdcxx = [];
		// $scope.title = '权属真伪查验';
		$scope.title = '不动产证明验证';
		$scope.title1 = { 'show': false, 'title': '' };
		$scope.title2 = { 'show': false, 'title': '' };


		//Base64加密解密
		// var Base64 = {
		// 	// private property
		// 	_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
		// 	// public method for encoding
		// 	encode: function (input) {
		// 		var output = "";
		// 		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		// 		var i = 0;
		// 		input = Base64._utf8_encode(input);
		// 		while (i < input.length) {
		// 			chr1 = input.charCodeAt(i++);
		// 			chr2 = input.charCodeAt(i++);
		// 			chr3 = input.charCodeAt(i++);

		// 			enc1 = chr1 >> 2;
		// 			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
		// 			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
		// 			enc4 = chr3 & 63;

		// 			if (isNaN(chr2)) {
		// 				enc3 = enc4 = 64;
		// 			} else if (isNaN(chr3)) {
		// 				enc4 = 64;
		// 			}

		// 			output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

		// 		}

		// 		return output;
		// 	},

		// 	// public method for decoding
		// 	decode: function (input) {
		// 		var output = "";
		// 		var chr1, chr2, chr3;
		// 		var enc1, enc2, enc3, enc4;
		// 		var i = 0;

		// 		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		// 		while (i < input.length) {

		// 			enc1 = this._keyStr.indexOf(input.charAt(i++));
		// 			enc2 = this._keyStr.indexOf(input.charAt(i++));
		// 			enc3 = this._keyStr.indexOf(input.charAt(i++));
		// 			enc4 = this._keyStr.indexOf(input.charAt(i++));

		// 			chr1 = (enc1 << 2) | (enc2 >> 4);
		// 			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
		// 			chr3 = ((enc3 & 3) << 6) | enc4;

		// 			output = output + String.fromCharCode(chr1);

		// 			if (enc3 != 64) {
		// 				output = output + String.fromCharCode(chr2);
		// 			}
		// 			if (enc4 != 64) {
		// 				output = output + String.fromCharCode(chr3);
		// 			}

		// 		}

		// 		output = Base64._utf8_decode(output);

		// 		return output;

		// 	},

		// 	// private method for UTF-8 encoding
		// 	_utf8_encode: function (string) {
		// 		string = string.replace(/\r\n/g, "\n");
		// 		var utftext = "";

		// 		for (var n = 0; n < string.length; n++) {

		// 			var c = string.charCodeAt(n);

		// 			if (c < 128) {
		// 				utftext += String.fromCharCode(c);
		// 			} else if ((c > 127) && (c < 2048)) {
		// 				utftext += String.fromCharCode((c >> 6) | 192);
		// 				utftext += String.fromCharCode((c & 63) | 128);
		// 			} else {
		// 				utftext += String.fromCharCode((c >> 12) | 224);
		// 				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
		// 				utftext += String.fromCharCode((c & 63) | 128);
		// 			}

		// 		}

		// 		return utftext;
		// 	},

		// 	// private method for UTF-8 decoding
		// 	_utf8_decode: function (utftext) {
		// 		var string = "";
		// 		var i = 0;
		// 		var c = c1 = c2 = 0;

		// 		while (i < utftext.length) {

		// 			c = utftext.charCodeAt(i);

		// 			if (c < 128) {
		// 				string += String.fromCharCode(c);
		// 				i++;
		// 			} else if ((c > 191) && (c < 224)) {
		// 				c2 = utftext.charCodeAt(i + 1);
		// 				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
		// 				i += 2;
		// 			} else {
		// 				c2 = utftext.charCodeAt(i + 1);
		// 				c3 = utftext.charCodeAt(i + 2);
		// 				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
		// 				i += 3;
		// 			}
		// 		}
		// 		return string;
		// 	}
		// };
		//权属证明查询结果
		var resultQszm = [{ 'key': '查询编号', 'keyEn': 'cxbh' }, { 'key': '申请人', 'keyEn': 'cxsqr' },
		{ 'key': '证件号码', 'keyEn': 'zjh' }, { 'key': '备注', 'keyEn': 'bz' },
		{ 'key': '最终时间', 'keyEn': 'utime' }, { 'key': '起始时间', 'keyEn': 'ctime' },
		{ 'key': '不动产权人', 'keyEn': 'qlrmc' }, { 'key': '不动产权证号', 'keyEn': 'bdcqzh' },
		{ 'key': '不动产权单元号', 'keyEn': 'bdcdyh' },
		{ 'key': '抵押情况', 'keyEn': 'sfdy' }, { 'key': '查封情况', 'keyEn': 'sfcf' },
		{ 'key': '建筑面积(㎡)', 'keyEn': 'jzmj' }, { 'key': '坐落', 'keyEn': 'zl' },
		{ 'key': '查询日期' }, { 'key': '证件号码' }];

		addStrAfterChar = function (str, c, addStr) {
			if (str != null && str.length > 0) {
				var strs = new Array();
				strs = str.split(c);
				if (strs.length <= 1) {
					return str;
				}
				var newStr = "";
				for (var i = 0; i < strs.length - 1; i++) {
					if (strs[i].length > 0) {
						newStr = newStr + strs[i] + c + addStr;
					} else {
						newStr = newStr + c;
					}
				}
				return newStr;
			}
			return str;
		};

		//  更换key值
		qszmResult = function (dataResult) {
			if (dataResult != undefined && dataResult.success) {
				$scope.title1 = { 'show': true, 'title': '查询信息' };
				$scope.title2 = { 'show': true, 'title': '不动产权信息' };
				var jsonObj = dataResult.data;
				if (jsonObj == null || jsonObj == "" || jsonObj == undefined) {
					scanFailed();
				}
				for (var i = 0; i < resultQszm.length; i++) {
					var resultQszmItem = resultQszm[i];
					for (var item in jsonObj) {
						if (item == resultQszmItem.keyEn) {
							var key = resultQszmItem.key;
							jsonObj[key] = jsonObj[item];
							if (jsonObj[key] != null && jsonObj[key] != "" && jsonObj[key] != undefined) {
								if (key == "起始时间") {
									jsonObj[key] = addStrAfterChar(jsonObj[key], ";", " \n ");
								} else if (key == "最终时间") {
									jsonObj[key] = addStrAfterChar(jsonObj[key], ";", " \n ");
								}
								else if (jsonObj[key].indexOf(";") != -1) {
									//正则式，在所有;后加换行(同时出现多个；会多次换行)
									// var reg = /[;；]/g;
									// jsonObj[key]=jsonObj[key].replace(reg,"$&\r\n");
									jsonObj[key] = addStrAfterChar(jsonObj[key], ";", " \n ");
								}
							}
							delete jsonObj[item];
						}
					}
				}


				//处理不动产信息列表
				if (jsonObj != null && jsonObj != "" && jsonObj != undefined) {
					if (jsonObj.bdcxxList != undefined && jsonObj.bdcxxList.length > 0) {
						for (var j = 0; j < jsonObj.bdcxxList.length; j++) {
							var bdcxxListItem = jsonObj.bdcxxList[j];
							for (var i = 0; i < resultQszm.length; i++) {
								var resultQszmItem = resultQszm[i];
								for (var item in bdcxxListItem) {
									if (item == resultQszmItem.keyEn) {
										var key = resultQszmItem.key;
										bdcxxListItem[key] = bdcxxListItem[item];
										if ('抵押情况' == key || '查封情况' == key) {
											if (bdcxxListItem[key] == true) {
												bdcxxListItem[key] = '是';
											} else {
												bdcxxListItem[key] = '否';
											}
										}
										if (bdcxxListItem[key] != null && bdcxxListItem[key] != "" && bdcxxListItem[key] != undefined) {
											if (key == "起始时间") {
												bdcxxListItem[key] = addStrAfterChar(bdcxxListItem[key], ";", " \n ");
											} else if (key == "最终时间") {
												bdcxxListItem[key] = addStrAfterChar(bdcxxListItem[key], ";", " \n ");
											}
											else if (bdcxxListItem[key].toString().indexOf(";") != -1) {
												bdcxxListItem[key] = addStrAfterChar(bdcxxListItem[key].toString(), ";", " \n ");
											}
										}
										delete bdcxxListItem[item];
									}
								}
							}

						}
					}
					$scope.resultBdcxx = jsonObj.bdcxxList;
					$scope.result = jsonObj;
				}
				console.log(JSON.stringify(jsonObj))
				delete $scope.result.bdcxxList;
				delete $scope.result.sjscsj;
				delete $scope.result.id;
				delete $scope.result.cxlx;
				delete $scope.result.jssj;
				delete $scope.result.sjhqbs;
				delete $scope.result.sjhqsj;
			}
		};

		// qszmResult(data);
		//权属证明查询PDF文档二维码扫描确定真伪
		queryQszmFalse = function (sendParam) {
			sendParam = {cxbh:sendParam}
			$qszmService.queryQszmFalse(sendParam)
				.then(function (res) {
					if (res.success) {
						if (res != null) {
							qszmResult(res);
						} else {
							scanFailed();
						}
					} else {
						scanFailed();
					}
					$scope.hide();
				}, function (res) {
					scanFailed();
				});
		};
		queryQszmFalse(jsonObjParam);


		//不动产权证明
		var resultBdcqzm = [{ 'key': '业务编号', 'keyEn': 'ywbh' }, { 'key': '不动产权证号', 'keyEn': 'bdcqzh' },
		{ 'key': '不动产登记证明号', 'keyEn': 'bdcdjzmh' }, { 'key': '证明权利或事项', 'keyEn': 'sx' },
		{ 'key': '权利人(申请人)', 'keyEn': 'qlr' }, 
		{ 'key': '服务', 'keyEn': 'fwyt' },	{ 'key': '登记时间', 'keyEn': 'djsj' },
		{ 'key': '义务人', 'keyEn': 'ywr' }, { 'key': '坐落', 'keyEn': 'zl' },
		{ 'key': '不动产单元号', 'keyEn': 'bdcdyh' }, { 'key': '其他', 'keyEn': 'qlqtzk' },
		{ 'key': '附记', 'keyEn': 'fj' }, { 'key': 'djsj', 'keyEn': 'cxsqr' }];
		bdcqzmResult = function (dataResult) {
			if (dataResult != undefined && dataResult.success) {
				$scope.title1 = { 'show': true, 'title': '不动产权证明信息' };
				$scope.title2 = { 'show': false, 'title': '不动产权信息' };
				var jsonObj = dataResult.data;
				for (var i = 0; i < resultBdcqzm.length; i++) {
					var resultBdcqzmItem = resultBdcqzm[i];
					for (var item in jsonObj) {
						if (item == resultBdcqzmItem.keyEn) {
							var key = resultBdcqzmItem.key;
							jsonObj[key] = jsonObj[item];
							jsonObj[key] = addStrAfterChar(jsonObj[key].toString(), ";", " \n ");
							delete jsonObj[item];
						}
					}
				}

				$scope.result = jsonObj;

				delete $scope.result.id;
				delete $scope.result.djsj;
				delete $scope.result.qssj;
				delete $scope.result.dyfs;
				delete $scope.result.jssj;
				delete $scope.result.qlqtzk;
				delete $scope.result.tdPdfFileUrl;
				delete $scope.result.zzbh;
				delete $scope.result.tdsj;
			}
		};
		//		bdcqzmResult(data1);
		//不动产权登记证明PDF文档二维码扫描确定真伪
		queryBdcdjzsFalse = function (sendParam) {
			$qszmService.queryBdcdjzsFalse(sendParam)
				.then(function (res) {
					$scope.hide();
					if (res.success) {
						if (res != null) {
							bdcqzmResult(res);
						} else {
							scanFailed();
						}
					} else {
						scanFailed();
					}
				}, function (res) {
					scanFailed();
				});
		};

		function scanFailed() {
			$scope.showAlert("此扫描结果未查询到任何信息");
			// $scope.hide();
			return;
		}

		if (jsonObjParam == null || jsonObjParam == "" || jsonObjParam == undefined) {
			scanFailed();
		} else {
			queryCertificate();
		}
	}
]);