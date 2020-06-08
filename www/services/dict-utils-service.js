angular.module('dictUtilsService', ['ngResource']).factory('$dictUtilsService', ['$http','$gmRestful','$interval','$loginService','$addressService','$wysqService','$qyglService','$meService',function ($http,$gmRestful,$interval,$loginService,$addressService,$wysqService,$qyglService,$meService) {
    var result = {
		//替代照片URL
		replacePicUrl: function(pictureUrlParam){
			var result = pictureUrlParam;
			if(pictureUrlParam != undefined){
				var arrayTemp = pictureUrlParam.split("internet");
				var lengthTemp = arrayTemp[0].length-1;
				result = internetAddressPicUrl + pictureUrlParam.slice(lengthTemp);
			}
			return result;
		},
		//微信人脸识别接口签名
		signature: function(callback){
			 //微信签名
			$wysqService.signature({
				url: signatureUrl
			})
			.then(function(res) {
				wx.config({
				beta: true, // 必填，开启内测接口调用，注入 wx.invoke 和 wx.on 方法
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
			       'downloadImage',
			       'requestWxFacePictureVerify'
			    ],
				});
				callback(res);
			}, function(res) {
				console.log('请求失败！');
			});
		},
		wxface: function(callback,appId,name,zjh){
			//签名成功后执行的函数
		    wx.ready(function(){
			 	//微信人脸识别
			 	if(name != undefined && name != null && zjh != undefined && zjh != null){
			 		personParma = JSON.stringify({"name":name,"id_card_number":zjh});
			 	}
			 	if(appId != undefined && appId != null){
			 		paramSend = {"appId":appId,"request_verify_pre_info":personParma,"check_alive_type":1};
			 	}
		 		wx.invoke("requestWxFacePictureVerify",paramSend,function(res){
					if(res.err_code == 0) {
						var verify_identifier = res.verify_result;
						// 开发者选择是否使用后台文档获取本次认证的其他信息
						callback(res);
					} else {
//						var ret = res.err_msg;ret += " err_code: " + res.err_code;
//						alert(ret);
					}
				});
		    });
			wx.error(function(res){
				alert("error"+res);
			});
		},
        /**
         * 通过字典类型从服务获取字典数组列表
         * @param {Object} type 字典类型：如'办理状态'
         */
        getServerDictionaryByType: function(type){
        	    var pRestful = new $gmRestful();
                var pPromise = pRestful.get(RESTURL.dictionary.queryDictByType,type);
                return pPromise;
        },
    //判断是否用户是否存在该权限
    hasPermisonByPermValue : function(permValue){
      var hasPermission = false;
      if(permissionInfoServers != undefined && permissionInfoServers != null && permissionInfoServers.length>0){
        for(var i = permissionInfoServers.length-1;i>=0;i--){
          var permValueTemp = permissionInfoServers[i].permValue;
          if(permValueTemp == permValue){
            hasPermission = true;
            break;
          }
        }
      }
      return hasPermission;
    },
		//根据区域及用户ID重新获取权限
		getPermByAreaCode : function($rootScope,$scope){
			$loginService.getPermByAreaCode({
				areaCode:county.code,userId:$loginService.userdata.id
			}).then(function(res) {
					if(res.success){
						permissionInfoServers = res.data;
						//广播通知权限已经修改
						$rootScope.$broadcast('permission-modify', {});
					}
				}, function(error) {
					$scope.showAlert("获取权限失败");
				});
		},
		parseBsdtData : function(dataTemp,$scope){
			var dataLocation = [];
			var hasLocation = false;
			for (var i = 0; i < dataTemp.length; i++) {
				var dx = dataTemp[i].dx;
				var dy = dataTemp[i].dy;
				var officeName = dataTemp[i].officeName;
				var address = dataTemp[i].address;
				if(dx != null && dx != "" && dy != null && dy != ""){
					hasLocation = true;
					dataLocation.push({latitude:dy,longitude:dx,"officeName": officeName,"address":address});
				}
			}
			//办事大厅中没有一个大厅有坐标
			if(!hasLocation){
				$scope.showAlert("办事大厅缺少定位信息，请联系系统管理员");
			}
			return dataLocation;
		},
		//根据区县获取办事大厅
		getBsdtData : function($scope,needLocation,callback){
			if (county != undefined && county.id != undefined) {
			$addressService.queryAreaId({
				areaId: county.id
			}).then(function(res) {
						if(res.success){
							var dataTemp = res.data;
							var dataLocation = [];
							//存在办事大厅
							if(dataTemp != undefined && dataTemp != null && dataTemp.length>0){
								if(needLocation){
									var hasLocation = false;
									for (var i = 0; i < dataTemp.length; i++) {
										var dx = dataTemp[i].dx;
										var dy = dataTemp[i].dy;
										var officeName = dataTemp[i].officeName;
										var address = dataTemp[i].address;
										if(dx != null && dx != "" && dy != null && dy != ""){
											hasLocation = true;
											dataLocation.push({latitude:dy,longitude:dx,"officeName": officeName,"address":address});
										}
									}
									//办事大厅中没有一个大厅有坐标
									if(!hasLocation){
										$scope.showAlert("办事大厅缺少定位信息，请联系系统管理员");
									}
									callback(dataLocation);
								}else{
									callback(dataTemp);
								}
							}else{
							//不存在办事大厅
								$scope.showAlert("当前区县下不存在办事大厅");
							}
						}else{
							$scope.showAlert("获取办事大厅失败");
						}
					}, function(error) {
						$scope.showAlert("获取办事大厅失败");
				});
			}
		},
		getOcrResult : function($scope,param,callback){
			if($scope.show != undefined){
				$scope.show("正在获取身份证信息");
			}
			$meService.getOcrResult(param).then(function(res) {
				if($scope.hide != undefined){
					$scope.hide();
				}
				if(res.success) {
					callback(res);
					if($scope.showAlert != undefined){
						$scope.showAlert("身份证信息获取成功");
					}
				} else {
					callback(res);
					if($scope.showAlert != undefined){
						$scope.showAlert("身份证信息识别失败,请重试或者手动输入");
					}
				}
			}, function(error) {
				if($scope.hide != undefined){
					$scope.hide();
				}
				if($scope.showAlert != undefined){
					$scope.showAlert("身份证信息识别失败,请重试或者手动输入");
				}
				callback('fail');
			});
		},
		getAlibabaOcr : function($scope,param,callback){
			$http({
				method: 'POST',
				url: 'https://dm-51.data.aliyun.com/rest/160601/ocr/ocr_idcard.json',
				headers: {
					'Content-Type': 'application/json; charset=UTF-8',
					'Authorization': 'APPCODE f4852476554c42fab6b40a2111baebc1'
				},
				data: param
			})
			.success(function(res) {
				if($scope.hide != undefined){
					$scope.hide();
				}
				callback(res)
				$scope.showAlert("验证成功");
			}, function(error) {
				callback("fail")
				if($scope.hide != undefined){
					$scope.hide();
				}
				if($scope.showAlert != undefined){
					$scope.showAlert("身份证信息识别失败,请重试或者手动输入");
				}
			});
		},
		//根据登记机构获取办事大厅
		getBsdtDataByDjjg : function($scope,callback){
			var queryCode = county.code;
			if(county.code == '150101' || county.code == '620101'){
				queryCode = city.code;
			}
			$qyglService.findByDjjg({
				djjg: queryCode
			}).then(function(res) {
				if(res.success) {
					callback(res);
					if(res.data.length == 0){
						if($scope.showAlert != undefined){
							$scope.showAlert( '该地区暂无网点信息！');
						}
					}
				} else {
					callback(res);
					if($scope.showAlert != undefined){
						$scope.showAlert(  "获取办事大厅失败");
					}
				}
			}, function(error) {
				callback('fail');
				if($scope.showAlert != undefined){
					$scope.showAlert(  "服务器请求出错");
				}
			});
		},

    getBlzt:function() {
      var dictionary = {};
      if(dictInfos != null && dictInfos.length>0){
      	for(var i = 0;i<dictInfos.length;i++){
      		var dictInfo = dictInfos[i];
      		if(dictInfo.label === "办理状态"){
      			dictionary = dictInfo;
      			break;
      		}
      	}
      }
      return dictionary;
    },

		/**
		 * 根据字典类型获取字典
		 * @param {Object} type 字典类型：如'办理状态'
		 */
		getDictinaryByType: function (type) {
		    var dictionary = {};
		    if(dictInfos != null && dictInfos.length>0){
		    	for(var i = 0;i<dictInfos.length;i++){
		    		var dictInfo = dictInfos[i];
		    		if(dictInfo.label === type){
		    			dictionary = dictInfo;
		    			break;
		    		}
		    	}
		    }
		    if('办理状态' == type){
		    	//办理状态固定排序
		    	var childrenTempArray = dictionary.childrens;
		    	var toChildrenTempArray = [{"value": "NETAPPLYING"},{"value": "NETCHECKING"},{"value": "NETPASSED"},{"value": "NETNOPASS"},{"value": "ACCEPTANCE"},
		    	{"value": "CHECKING"},{"value": "REGISTERING"},{"value": "CERTIFICATING"},{"value": "PAYING"},{"value": "AWARD"},{"value": "GD"},{"value": "COMPLETE"}];
		    	for(var j = 0;j<toChildrenTempArray.length;j++){
		    		var toChildrenTemp = toChildrenTempArray[j];
			    	if(childrenTempArray != undefined && childrenTempArray != "" &&  childrenTempArray != null){
			    		for(var i = childrenTempArray.length-1;i>=0;i--){
			    			var childrenTemp = childrenTempArray[i];
			    			if(toChildrenTemp.value == childrenTemp.value){
			    				toChildrenTempArray.splice(j,1,childrenTemp);
			    				break;
			    			}
			    		}
			    	}
		    	}
		    	dictionary.childrens = toChildrenTempArray;
		    }
        if('权利人分类' == type){
		    	//办理状态固定排序
		    	var childrenTempArray = dictionary.childrens;
		    	var toChildrenTempArray = [{"value": "0"},{"value": "1"},{"value": "2"},{"value": "3"},{"value": "4"},
		    	{"value": "5"},{"value": "6"},{"value": "7"},{"value": "8"},{"value": "9"},{"value": "10"},{"value": "11"},
          {"value": "12"},{"value": "13"},{"value": "14"},{"value": "15"}];
		    	for(var j = 0;j<toChildrenTempArray.length;j++){
		    		var toChildrenTemp = toChildrenTempArray[j];
			    	if(childrenTempArray != undefined && childrenTempArray != "" &&  childrenTempArray != null){
			    		for(var i = childrenTempArray.length-1;i>=0;i--){
			    			var childrenTemp = childrenTempArray[i];
			    			if(toChildrenTemp.value == childrenTemp.value){
			    				toChildrenTempArray.splice(j,1,childrenTemp);
			    				break;
			    			}
			    		}
			    	}
		    	}
		    	dictionary.childrens = toChildrenTempArray;
        }
		    return dictionary;
		},
        /**
         * @member NgModule.validation.rule
         * @method phone 电话号码，包括座机和手机验证
         * @param {String} param 电话号码
         */
        phone: function (value) {
        	var isPhone = false;
        	if (GM.CommonOper.isStrNullOrEmpty(value)) {
                isPhone = false;
            }
	    	 if((/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(value))){
	    	 	isPhone = true;
	    	 }
	    	 return isPhone;
        },
        /**
         * @member NgModule.validation.rule
         * @method number 数值验证
         * @param {Number} param 数值
         */
        number: function (value) {
            if (GM.CommonOper.isStrNullOrEmpty(value)) {
                return true;
            }
            var re = /^\d*(\.\d+)?$/g;
            var bRt = re.test(value);
            return bRt;
        },
        getBdcqzhMb:function (){
        	var bdcqzhMb = [{
				name: '冀（***）***不动产权第***号',
				isSelected: false,
				inputs:["","",""],
				keyWords:[]
			}, {
				name: '***国用（***）第***号',
				isSelected: false,
				inputs:["","",""],
				keyWords:[]
			}, {
				name: '***房权证***字第***号',
				isSelected: false,
				inputs:["","",""],
				keyWords:[]
			}, {
				name: "其他",
				isSelected: true,
				inputs:[],
				keyWords:[]
			},{
				name: "扫描二维码识别产权证号",
				isSelected: true,
				inputs:[],
				keyWords:[]
			}];
			return bdcqzhMb;
        },
        /**
         * @member NgModule.validation.rule
         * @member NgModule.frameApp.estateValidationProvider
         * @method CertificationNo 由汉字、字母和数字组成（不动产权证号）
         */
        CertificationNo: function (value) {
            if (GM.CommonOper.isStrNullOrEmpty(value)) {
                return true;
            }
            var re = /^[\u4E00-\u9FA5]+[\u4E00-\u9FA5A-Za-z0-9()\uff08\uff09]*\u53f7$/;
            var bRt = re.test(value);
            console.log(bRt);
            return bRt;
        },
        //判断是否有数字
        hasNum:function(value){
        	var p = /[0-9]/;
        	var result = p.test(value);//true,说明有数字
        	return result;
        },
        //判断是否已经登录
 		isLogin: function(){
			var isLogin = false;
			if(userData != null && userData.data != undefined && userData.data.loginName != undefined){
				isLogin = true;
			}
			return isLogin;
		},
		//判断是否进行了实名认证
		isCertification: function(){
			var isCertification = false;
			if(mongoDbUserInfoFather != null && mongoDbUserInfoFather.authName != false && mongoDbUserInfoFather.authName != undefined){
				isCertification = true;
			}
			return isCertification;
		},
		getCertificationStatus :function(){
			var status = "未认证";
			if(mongoDbUserInfoFather != null && mongoDbUserInfoFather.authName != false && mongoDbUserInfoFather.authName != undefined){
				status = "已认证";
			}
			return status;
		},
		//获取人脸识别状态
		getFaceVerifyStatus:function(){
			var status = "待认证"
				if(faceVerify == "VERIFY_SUCCESS") {
					status = "已认证";
				}else if(faceVerify == "VERIFY_DOING") {
					status = "认证中";
				}else if(faceVerify == "VERIFY_FAILURE") {
					status = "认证失败，请重新认证！";
				}else if(faceVerify == "VERIFY_BYADMIN") {
					status = "管理员审核中";
				}else if(faceVerify == "VERIFY_WAITING") {
					status = "待认证";
				}
			return status;
		},
		//是否已经人脸识别成功
		isFaceVerifySucceed:function(){
			var isSucceed = false;
			if(faceVerify == "VERIFY_SUCCESS"){
				isSucceed = true;
			}
			return isSucceed;
		},
		//当前选择的是否是区县
        isDistrict: function(){
        	var isDistrict = false;
        	if(county != undefined && county.code != undefined && county.code != null && county.code != ""){
        		isDistrict = true;
        	}
        	return isDistrict;
        },
        /**
         * @member NgModule.validation.rule
         * @member NgModule.frameApp.estateValidationProvider
         * @method UnitNo 12位数字+2位字母+5位数字+1位字母+8位数字组成（不动产单元号）
         */
        UnitNo: function (value) {
            if (GM.CommonOper.isStrNullOrEmpty(value)) {
                return true;
            }
             var re = /^[0-9]{12}[A-Za-z]{2}[0-9]{5}[A-Za-z]{1}[0-9]{8}$/;
            var bRt = re.test(value);
            return bRt;
        },
        password: function(value){
			if(value.length < 6 || value.length > 20){
				return false;
			}
            var re = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*_]+$)[a-zA-Z\d!@#$%^&*_]+$/g;
            var bRt = re.test(value);
            return bRt;
        },
      /**
       * @member ..
       * 由于证件种类的验证多处都要用到,在此定义证件种类验证对象，方便调用
       * @author Yuejunqi
       * @method 验证证件种类
       */
      cardValidator: {
        1: {
          errInfo: '请输入正确的证件号码',
          valid: function (code) {
            return result.idcard(code)
          }
        },
        2: {
          errInfo: '请输入正确的港澳台证件号',
          valid: function (code) {
            return result.idcard(code)
          }
        },
        3: {
          errInfo: '请输入正确的护照号码',
          valid: function (code) {
            return result.isPassPortCard(code)
          }
        },
        4: {
          errInfo: '请输入正确的户口簿号码',
          valid: function (code) {
            return result.isAccountCard(code)
          }
        },
        5: {
          errInfo: '请输入正确的军官证号码',
          valid: function (code) {
            return result.isOfficerCard(code)
          }
        },
        6: {
          errInfo: '请输入正确的组织机构代码',
          valid: function (code) {
            return result.orgcodevalidate(code)
          }
        },
        7: {
          errInfo: '请输入正确的营业执照号码',
          valid: function (code) {
            return result.checkLicense(code)
          }
        }
      },
		/**
		*验证营业执照是否合法：营业执照长度须为15位数字，前14位为顺序码，
		*最后一位为根据GB/T 17710 1999(ISO 7064:1993)的混合系统校验位生成算法
		*计算得出。此方法即是根据此算法来验证最后一位校验位是否政正确。如果
		*最后一位校验位不正确，则认为此营业执照号不正确(不符合编码规则)。
		*以下说明来自于网络:
		*我国现行的营业执照上的注册号都是15位的，不存在13位的，从07年开始国
		*家进行了全面的注册号升级就全部都是15位的了，如果你看见的是13位的注
		*册号那肯定是假的。
		*15位数字的含义，代码结构工商注册号由14位数字本体码和1位数字校验码
		*组成，其中本体码从左至右依次为：6位首次登记机关码、8位顺序码。
		* 一、前六位代表的是工商行政管理机关的代码，国家工商行政管理总局用
		* “100000”表示，省级、地市级、区县级登记机关代码分别使用6位行
		* 政区划代码表示。设立在经济技术开发区、高新技术开发区和保税区
		* 的工商行政管理机关（县级或县级以上）或者各类专业分局应由批准
		* 设立的上级机关统一赋予工商行政管理机关代码，并报国家工商行政
		* 管理总局信息化管理部门备案。
		* 二、顺序码是7-14位，顺序码指工商行政管理机关在其管辖范围内按照先
		* 后次序为申请登记注册的市场主体所分配的顺序号。为了便于管理和
		* 赋码，8位顺序码中的第1位（自左至右）采用以下分配规则：
		*　　 1）内资各类企业使用“0”、“1”、“2”、“3”；
		*　　 2）外资企业使用“4”、“5”；
		*　　 3）个体工商户使用“6”、“7”、“8”、“9”。
		* 顺序码是系统根据企业性质情况自动生成的。
		*三、校验码是最后一位，校验码用于检验本体码的正确性
		*/
		checkLicense(code){
		  if (!code) return;
		    var tip = "OK";
		    var pass= true;

		    if(code.length != 18){
		        tip = "社会信用代码长度错误！";
		        pass = false;
		    }
		    var reg = /^([159Y]{1})([1239]{1})([0-9]{6})([0-9ABCDEFGHJKLMNPQRTUWXY]{9})([0-9ABCDEFGHJKLMNPQRTUWXY]{1})$/;
		    if(!reg.test(code)){
		        tip = "社会信用代码校验错误！";
		        pass = false;
		    }
		    //不用I、O、S、V、Z
		    var str = '0123456789ABCDEFGHJKLMNPQRTUWXY';
		    var ws =[1,3,9,27,19,26,16,17,20,29,25,13,8,24,10,30,28];

		    var codes  = new Array();
		    var sum = 0;
		    codes[0] = code.substr(0,code.length-1);
		    codes[1] = code.substr(code.length-1,code.length);

		    for(var i=0;i<codes[0].length;i++){
		        var Ancode = codes[0].charAt(i);
		        var Ancodevalue = str.indexOf(Ancode);
		        sum += Ancodevalue * ws[i];
		    }
		    var indexOfc18 = 31 - (sum % 31);
		    var c18 = str.charAt(indexOfc18);
		    if(c18 != codes[1]){
		        tip = "社会信用代码有误！";
		        pass = false;
		    }

		    return pass;
		},
		/**
		*	验证组织机构代码是否合法：组织机构代码为8位数字或者拉丁字母+“-”+1位校验码。
		*	验证最后那位校验码是否与根据公式计算的结果相符。
		*	编码规则请参看
		*	http://wenku.baidu.com/view/d615800216fc700abb68fc35.html
		*/
	    orgcodevalidate(value){
	    	isRight = false;
	    	if(value!=""){
				var reg = /^([0-9ABCDEFGHJKLMNPQRTUWXY]){9}$/;
				if(reg.test(value)){
					isRight = true;
				}
				//以下是2015以前的编码规则
// 	 		   var values=value.split("-");
// 	 		    var ws = [3, 7, 9, 10, 5, 8, 4, 2];
// 	 		    var str = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
// 	 		    var reg = /^([0-9A-Z]){8}$/;
// 	 		    if (!reg.test(values[0])) {
// 	 		        isRight = false;
// 	 		    }else{
// 		 		    var sum = 0;
// 		 		    for (var i = 0; i < 8; i++) {
// 		 		        sum += str.indexOf(values[0].charAt(i)) * ws[i];
// 		 		    }
// 		 		    var C9 = 11 - (sum % 11);
// 		 		    var YC9=values[1]+'';
// 		 		    if (C9 == 11) {
// 		 		    	C9 = '0';
// 		 		    } else if (C9 == 10) {
// 		 		    	C9 = 'X'  ;
// 		 		    } else {
// 		 		    	C9 = C9+'';
// 		 		    }
// 		 		    isRight = (YC9==C9);
// 	 		    }
	    	}
	    	return isRight;
	    },
         /**
         * @member NgModule.validation.rule
         * @method gaIdcard 户口本
         * @param {String} param
         */
		isAccountCard(card) {
			var isRight = false;
		      // 户口本
		      // 规则： 15位数字, 18位数字, 17位数字 + X
		      // 样本： 441421999707223115
		      var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
		      if (reg.test(card) === false) {
		        isRight = false;
		      } else {
		        isRight = true;
		      }
		     return isRight;
		    },
         /**
         * @member NgModule.validation.rule
         * @method gaIdcard 军官
         * @param {String} param
         */
		isOfficerCard(card) {
		      // 军官证
		      // 规则： 军/兵/士/文/职/广/（其他中文） + "字第" + 4到8位字母或数字 + "号"
		      // 样本： 军字第2001988号, 士字第P011816X号
		      var isRight = false;
		      var reg = /^[\u4E00-\u9FA5](字第)([0-9a-zA-Z]{4,8})(号?)$/;
		      if (reg.test(card) === false) {
		        isRight = false;
		      } else {
		        isRight = true;
		      }
		    },
         /**
         * @member NgModule.validation.rule
         * @method gaIdcard 护照
         * @param {String} param
         */
		isPassPortCard(card) {
		      // 护照
		      // 规则： 14/15开头 + 7位数字, G + 8位数字, P + 7位数字, S/D + 7或8位数字,等
		      // 样本： 141234567, G12345678, P1234567
		      var isRight = false;
		      var reg = /^([a-zA-z]|[0-9]){5,17}$/;
		      if (reg.test(card) === false) {
		        isRight = false;
		      } else {
		        isRight = true;
		      }
		    },
         /**
         * @member NgModule.validation.rule
         * @method gaIdcard 港澳台身份证
         * @param {String} param
         */
        gaIdcard: function (value, scope, element, attrs, param) {
            if (GM.CommonOper.isStrNullOrEmpty(value)) {
                return true;
            }
            // 港澳居民来往内地通行证
			// 规则： H/M + 10位或6位数字
			// 样本： H1234567890
            var re1 = /^([A-Z]\d{6,10}(\(\w{1}\))?)$/;
            // 台湾居民来往大陆通行证
 			// 规则： 新版8位或18位数字， 旧版10位数字 + 英文字母
 			// 样本： 12345678 或 1234567890B
            var re2 = /^\d{8}|^[a-zA-Z0-9]{10}|^\d{18}$/;
            var bRt = (re2.test(value)) || re1.test(value);
            return bRt;
        },
	    /**
	     * @member NgModule.validation.rule
	     * @method idcard 身份证验证
	     * @param {String} param
	     */
        idcard: function (value) {
            if (GM.CommonOper.isStrNullOrEmpty(value)) {
                return true;
            }
            var idcard, Y, JYM, ereg;
            idcard = value;
            if (idcard == null || idcard === '') {
                return false;
            }
            var Errors = [true, false, false, false, false];
            var S, M;
            var idcardArray = [];
            idcardArray = idcard.split('');
            //地区检验
            //if(area[parseInt(idcard.substr(0,2))]==null) return Errors[4];
            //身份号码位数及格式检验
            switch (idcard.length) {
            case 15:
                if ((parseInt(idcard.substr(6, 2)) + 1900) % 4 === 0 || ((parseInt(idcard.substr(6, 2)) + 1900) % 100 === 0 && (parseInt(idcard.substr(6, 2)) + 1900) % 4 === 0)) {
                    ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/; //测试出生日期的合法性
                } else {
                    ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/; //测试出生日期的合法性
                }
                if (ereg.test(idcard)) return Errors[0];
                else return Errors[2];
            case 18:
                //18 位身份号码检测
                //出生日期的合法性检查
                //闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
                //平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
                if (parseInt(idcard.substr(6, 4)) % 4 === 0 || (parseInt(idcard.substr(6, 4)) % 100 === 0 && parseInt(idcard.substr(6, 4)) % 4 === 0)) {
                    ereg = /^[1-9][0-9]{7}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/; //闰年出生日期的合法性正则表达式
                } else {
                    ereg = /^[1-9][0-9]{7}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/; //平年出生日期的合法性正则表达式
                }
                if (ereg.test(idcard)) { //测试出生日期的合法性
                    //计算校验位
                    S = (parseInt(idcardArray[0]) + parseInt(idcardArray[10])) * 7 +
                            (parseInt(idcardArray[1]) + parseInt(idcardArray[11])) * 9 +
                            (parseInt(idcardArray[2]) + parseInt(idcardArray[12])) * 10 +
                            (parseInt(idcardArray[3]) + parseInt(idcardArray[13])) * 5 +
                            (parseInt(idcardArray[4]) + parseInt(idcardArray[14])) * 8 +
                            (parseInt(idcardArray[5]) + parseInt(idcardArray[15])) * 4 +
                            (parseInt(idcardArray[6]) + parseInt(idcardArray[16])) * 2 +
                            parseInt(idcardArray[7]) * 1 +
                            parseInt(idcardArray[8]) * 6 +
                            parseInt(idcardArray[9]) * 3;
                    Y = S % 11;
                    M = 'F';
                    JYM = '10X98765432';
                    M = JYM.substr(Y, 1); //判断校验位
                    if (M === idcardArray[17]) return Errors[0]; //检测ID的校验位
                    else return Errors[3];
                } else return Errors[2];
            case 10:
                //香港身份证
                ereg = /^[A-Z]\d{6}[(|(]\d[)|)]$/g;
                if (ereg.test(idcard)) {
                    return Errors[0];
                } else {
                    return false;
                }
            default:
                return Errors[1];
            }
        },
        /**
         * 通过身份证号获取身份证日期
         * @param {Object} idCard
         */
		getBirthdayFromIdCard : function(idCard) {
	        var birthday = "";
	        if(idCard != null && idCard != ""){
	            if(idCard.length == 15){
	                birthday = "19"+idCard.substr(6,6);
	            } else if(idCard.length == 18){
	                birthday = idCard.substr(6,8);
	            }
	            birthday = birthday.replace(/(.{4})(.{2})/,"$1-$2-");
	        }
	        return birthday;
	      },
        /**
         * 通过身份证号获取性别
         * @param {Object} idCard
         */
		getSexFromIdCard : function(idCard) {
	        var sex = 1;
	        if(idCard != null && idCard != ""){
	            if(idCard.length == 18){
	                if(parseInt(idCard.substr(16, 1)) % 2 == 1){
	                	sex = 1;
	                }else{
	                	sex = 2;
	                }
	            }
	        }
	        return sex;
	      },
	   /**
	     *
	     * @param {Object} date long类型时间
	     * @param {Object} pattern 格式化参数类型
	     */
		getFormatDate:function(date, pattern) {
		    if (date == undefined) {
		        date = new Date();
		    }
		    if (pattern == undefined) {
		        pattern = "yyyy-MM-dd hh:mm:ss";
		    }
		  var o = {
		    "M+" : date.getMonth()+1,                 //月份
		    "d+" : date.getDate(),                    //日
		    "h+" : date.getHours(),                   //小时
		    "m+" : date.getMinutes(),                 //分
		    "s+" : date.getSeconds(),                 //秒
		    "q+" : Math.floor((date.getMonth()+3)/3), //季度
		    "S"  : date.getMilliseconds()             //毫秒
		  };
		  if(/(y+)/.test(pattern))
		    pattern=pattern.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
		  for(var k in o)
		    if(new RegExp("("+ k +")").test(pattern))
		  pattern = pattern.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
		  return pattern;
		},
        /**
         * 添加验证码定时器，防止多次点击验证码
         * @param {Object} $scope 作用域
         */
        addCodeInteral: function ($scope) {
            var timeCount = 60;
            $scope.bGetCodeDisabled = true;
            $scope.registerCode = timeCount + 's';
            $interval(function () {
                timeCount--;
                $scope.code = timeCount + 's后重新获取';
                if (timeCount === 0) {
                    $scope.code = '获取验证码';
                    $scope.bGetCodeDisabled = false;
                }
            }, 1000, 60);
        },
        /**
         * @member NgModule.validation.rule
         * @method loginname 第一个是字母,长度是4-20
         */
        loginname: function (value) {
            var re = /^[a-zA-Z]\w{3,19}$/;
            var bRt = re.test(value);
            if (bRt === true) {
                re = /\d+/;
                bRt = re.test(value);
            }
            return bRt;
        },
        //将微信上的图片保存到fms
		saveWechatFile: function(payload) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.post(RESTURL.me.saveWechatFile, null, payload);
			return pPromise;
		},
		/**
	     * @description 节流和防抖
	     * @method throttle
	     * @param {function} fn 最后执行的回调函数
	     * @param {number} delay 延时执行毫秒数
	     * @param {number} atleast 固定间隔必须执行
	     * @return {Function} 延迟执行的方法
	     */
	    throttle: function (fn, delay, atleast) {
	        let timer, previous;
	        return function () {
	            let now = +new Date();
	            (!previous) && (previous = now);
	            // 判断间隔了多久，要是超过设置时间则立即执行一次
	            if (atleast && now - previous > atleast) {
	                fn.apply(this, arguments);
	                previous = now;
	            } else {
	                clearTimeout(timer);
	                timer = setTimeout(function () {
	                    fn.apply(this, arguments);
	                    previous = null;
	                }, delay);
	            }
	        };
	    }
    };
    return result;
}]);
