angular.module('fjxzCtrl', []).controller('fjxzCtrl', ["$scope", "ionicToast", "$state", "$ionicHistory",
  "$wysqService", "$stateParams", "$ionicPopup", "$ionicLoading", "$dictUtilsService", "$fjxzUtilsService",
  "$bsznService",
  function($scope, ionicToast, $state, $ionicHistory, $wysqService, $stateParams, $ionicPopup, $ionicLoading,
    $dictUtilsService, $fjxzUtilsService, $bsznService) {
    /* if(!$wysqService.pageStack.includes('fjcl')){
      $wysqService.pageStack.push('fjcl');//栈中保存此页面记录
    } */
    if ($wysqService.isMainApplicant) {
      $scope.isMainApplicant = true; //是否是申请发起人
    } else {
      $scope.isMainApplicant = false; //是否是申请发起人
    };
   //是否显示下一步 以及流程进度条
   $scope.showNextStep = $wysqService.stepByStep;
   //如果强制中断了不显示下一步,那就不再显示下一步
   //$scope.interruptNextStep = $wysqService.interruptNextStep;
   //第一步信息(申请人信息)是否完成
   $scope.stepOneFinished = $wysqService.stepInfo.one;
   //第二步信息(不动产信息)是否完成
   $scope.stepTwoFinished = $wysqService.stepInfo.two;
   //第三步步信息(附件信息)是否完成
   $scope.stepThreeFinished = $wysqService.stepInfo.three;
   //第四步 提交申请是否完成
   $scope.stepFourFinished = $wysqService.stepInfo.four;
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
			//  	str = $scope.decryptByDES(str); //解密
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
    $scope.fromWeb = false;//是否是从web端扫码进来的
    if ($wysqService.djsqItemData.step == "NETAPPLYING" || $wysqService.djsqItemData.step == "NETNOPASS" || Request
      .subCode != undefined) {
      $scope.isShow = true;
    } else {
      $scope.isShow = false;
    }
    if ($stateParams.subFlowcode) {
      var subFlowcode = $stateParams.subFlowcode;
    } else {
      var subFlowcode = Request.subCode;//从web端扫码进入改界面
      $scope.isShow = true;
      $scope.fromWeb = true;
    }

    //根据子流程代码获取附件类型列表
    $scope.getFjlist = function() {
      $wysqService.getfjlxlist({
          subCode: subFlowcode
        })
        .then(function(res) {
          if (res.success) {
            $wysqService.fjlxlist = res.data;
            $scope.fjzlList = $wysqService.fjlxlist;
            $scope.getFj();
            console.log($wysqService.fjlxlist);
          }
        }, function(res) {});
    }
    //附件种类列表：一个二维数组,每个种类中包含多个附件
    $scope.getFjlist();

		if($wysqService.djsqItemData.wwywh) {
			var wwywh = $wysqService.djsqItemData.wwywh;
		} else {
			var wwywh = Request.ywh;
		}


		/**
		 * 从服务器中获取图片--start
		 */
		//根据业务号获取所有附件
		$scope.getFj = function() {
			$fjxzUtilsService.getAllFjByYwh(wwywh, function(filelistAll) {
				if($scope.fjzlList != null && $scope.fjzlList.length > 0) {
					for(var j = 0; j < $scope.fjzlList.length; j++) {
						var fjzlTemp = $scope.fjzlList[j];
						$fjxzUtilsService.setFileToListByclmc(filelistAll, fjzlTemp);
						getFileListFromFms(fjzlTemp.filelist); //从Fms服务器中获取文件
					}
				}
			});
		}
		//上传完之后，刷新当前材料分类的附件列表
		$scope.getFjByFjzl = function(fjzlParam) {
			$fjxzUtilsService.getFjByFjzl(wwywh, $scope.fjzlList, fjzlParam, function(filelistTemp) {
				getFileListFromFms(filelistTemp); //从Fms服务器中获取文件
			});
		}
		//从Fms中获取文件列表
		getFileListFromFms = function(filelist) {
			$fjxzUtilsService.getFileListFromFms(filelist, function(res) {
				var src = res.data.filePathUrl;
				src = $dictUtilsService.replacePicUrl(src);
				if($scope.fjzlList != null && $scope.fjzlList.length > 0) {
					for(var j = 0; j < $scope.fjzlList.length; j++) {
						$fjxzUtilsService.setImgSrcToFile($scope.fjzlList[j], src, res.data.id);
					}
				}
			});
		}
		//	var result = {filexxSuccess:[],filexxFail:[]};
		/**
		 * 从服务器中获取图片--end
		 */
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
			//选择图片
			$scope.addPhoto = function(fjzl) {
				//	 		result.filexxSuccess  = angular.copy(fjzl.filelist);
				wx.chooseImage({
					count: 1, //默认9
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
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
									fjzl.filelist.push({
										id: $scope.localIds,
										src: localData,
										uploadSrc: base64,
										fileid: "0",
										status: "未上传"
									});
									//							$scope.uploadOnePhoto(fjzl,$scope.localIds);
								} else if(phone_type == 'android') {
									fjzl.filelist.push({
										id: $scope.localIds,
										src: "data:image/jpeg;base64," + res.localData,
										uploadSrc: abase64,
										fileid: "0",
										status: "未上传"
									});
									//							$scope.uploadOnePhoto(fjzl,$scope.localIds);
									console.log('success');
								}
								console.log('success');
							}
						});
						show();
						//上传到微信服务器
						var result = {
							filexxSuccess: [],
							filexxFail: []
						};
						wx.uploadImage({
							localId: $scope.localIds, // 需要上传的图片的本地ID，由chooseImage接口获得
							isShowProgressTips: 0, // 默认为1，显示进度提示
							success: function(res) {
								var serverId = res.serverId; // 返回图片的服务器端ID
								//保存到业务库
								var timestamp = new Date();
								timestamp = $dictUtilsService.getFormatDate(timestamp, "yyyy-MM-dd");
								var fileDir = $wysqService.djsqItemData.djjg + '/' + timestamp + '/' + wwywh + '/' + fjzl.clmc;
								$dictUtilsService.saveWechatFile({
									fileId: serverId,
									filePath: fileDir
								}).then(function(res) {
									//保存到业务库
									result.filexxSuccess.push({
										ywh: wwywh,
										clfl: fjzl.clmc,
										clmc: res.data.fileName,
										fileId: res.data.id,
										clsm: fjzl.clsm,
										sxh: fjzl.sxh,
										zjh: fjzl.clmc
									});
									$fjxzUtilsService.uploadPhotoYwData($scope, result.filexxSuccess, function(res) {
										hide();
										if(res.success == true) {
											hide();
											$scope.getFjByFjzl(fjzl);
										} else {
											hide();
											$scope.showAlert(res.message);
										}
									});
								}, function(res) {
									hide();
									$scope.showAlert(res.message);
								});
							}
						});

          }
        });
      }
    });
    wx.error(function(res) {
      $scope.showAlert("error" + res);
    });
    //显示大图
    $scope.openFile = function(file) {
      if (file.clfl == '不动产申请书') {

        return;
      }
      if (file.clfl == '申请视频') {
        //待开发视频播放
        return;
      }
      if (file.clfl == '询问笔录') {
        //待开发pdf预览
        return;
      }
      if (!$scope.isShowDel) {
        if (file.src == "" || file.src == null) {
          $scope.Url = $fjxzUtilsService.getSrcById(file.id, $scope.fjzlList);
        } else {
          $scope.Url = file.src;
        }
        $scope.bigImage = true;
      }
    };
    //初始默认大图是隐藏的
    $scope.hideBigImage = function() {
      $scope.bigImage = false;
    };
    /**
     * 拍摄按钮拍摄照片--end
     */
    //长按显示删除按钮
    $scope.showdel = function() {
      if ($scope.isShow) {
        $scope.isShowDel = !$scope.isShowDel;
      }
    };
    //删除照片
    $scope.delete = function(file) {
      $fjxzUtilsService.deleteOneFile($scope, file, function(res) {
        if ($scope.fjzlList != null && $scope.fjzlList.length > 0) {
          for (var j = 0; j < $scope.fjzlList.length; j++) {
            $fjxzUtilsService.deleteLocalFile($scope.fjzlList[j], file);
          }
        }
      });
    }
    show = function() {
      $ionicLoading.show({
        //template: '上传中...'
        template: '<ion-spinner icon="lines" class="spinner-calm"></ion-spinner><p>正在上传图片</p>',
        duration: 10000
      });
    };
    hide = function() {
      $ionicLoading.hide();
    };

    //返回上一页
    $scope.goback = function() {

      // $ionicHistory.goBack(-$wysqService.pageStack.length);//根据栈中页面数量来确定回退几级
      $ionicHistory.goBack(-1);
    };


    //下一步 最终提交申请
    $scope.nextStep = function() {

      // if (!$wysqService.isMainApplicant) {
      //   $scope.showAlert('您不是申请发起人,不能提交最终申请!');//防止被添加为申请人(权利人或义务人)的用户提交最后申请
      //   return;
      // }

      // var mineYwInfo = $wysqService.getMineYwInfo();
      // if (mineYwInfo == null) {
      //   $scope.showAlert('在申请人信息中没检测到您本人信息!'); //防止主申请人不添加自己为申请人(权利人或义务人)
      //   return;
      // }

      // if (!mineYwInfo.xwbl || !mineYwInfo.sfsprz) {
      //   $state.go('xwbl', { //主申请人去认证
      //     ywh: $wysqService.djsqItemData.ywh,
      //     id: mineYwInfo.id
      //   })
      //   return;
      // }
      if (!$fjxzUtilsService.verifyData($scope, $scope.fjzlList)) {
        return; //附件上传不完整
      }

      // if (!$wysqService.judgeAllPeoleXwbl($scope)) {
      //   return; //有人没提交申请笔录
      // }
      // if (!$wysqService.judgeAllPeoleVideo($scope)) {
      //   retuen; //有人没提交视频认证
      // }
      $wysqService.stepInfo.three = true ;
      $state.go("djsq-details", {}, {
      	reload: true
      });
      //$scope.applyInfo();
    };

    $scope.applyInfo = function() {
      $wysqService.completeApply({
          qlxxId: $stateParams.id
        })
        .then(function(res) {
          if (res.success) {
            $scope.showAlert('提交成功');
            $state.go('djjg');
          }
        }, function(res) {
          //						$scope.showAlert(res.message);
        });
    }
    $scope.showAlert = function(msg) {
      ionicToast.show(msg, 'middle', false, 2000);
    };
    //模板图片地址
    $scope.imgData = [{
      src: require('../theme/img_menu/zs3.png')
    }, {
      src: require('../theme/img_menu/zs1.png')
    }, {
      src: require('../theme/img_menu/zs2.png')
    }];
    //不动产信息模板提示框
    $scope.showTips = false;
    $scope.clickTips = function(n) {
      console.log(n);
      $bsznService.clsls = $scope.fjzlList[n].clsls;
      $state.go('clsls');
      /* 		if(n>=0){
       			$scope.show("加载中");
      			$bsznService.viewUploadFile({fileId:$scope.fjzlList[n].clsls[0].fileId})
      			.then(function(res){
      				$scope.src = res.data;
      				$scope.hide();
      				$scope.showTips = true;
      			}, function(error){
      				console.log("请求失败");
      				$scope.showAlert("获取图片示例失败");
      				$scope.hide();
      			});
       		}
       		else{
       			$scope.showTips = false;
       		}*/
    }
    //下载图片加载框
    $scope.show = function(title) {
      $ionicLoading.show({
        //template: '上传中...'
        template: '<ion-spinner icon="lines" class="spinner-stable"></ion-spinner><p>' + title + '</p>'
      });
    };
    $scope.hide = function() {
      $ionicLoading.hide();
    };
  }
]);
