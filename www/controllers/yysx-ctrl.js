//填写预约信息
angular.module('yysxCtrl', []).controller('yysxCtrl', ["$registerService", "$scope", "ionicToast", "$stateParams",
  "$state", "$ionicHistory", "$meService", "$ionicActionSheet", "$wyyyService", "$ionicPopup", "$dictUtilsService",
  "$bsznService", "$rootScope", "$wysqService", "$cordovaBarcodeScanner",
  function($registerService, $scope, ionicToast, $stateParams, $state, $ionicHistory, $meService, $ionicActionSheet,
    $wyyyService, $ionicPopup, $dictUtilsService, $bsznService, $rootScope, $wysqService, $cordovaBarcodeScanner) {
    //预约事项数据
    $scope.wyyy = {
      name: "",
      number: "",
      yyzh: ""
    };

    $scope.yysx = {
      sx: '请选择预约事项',
      time: '请选择预约时间',
      bsdt: '请选择办事大厅',
      date: '',
      yysxid: '',

    };

    $scope.fontColor = {
      sxColor: "#ABABAB",
      timeColor: "#ABABAB",
      bsdtColor: "#ABABAB"
    }

		$scope.getDocs = function() {
			//获取申报材料
			$bsznService.getUploadFileNew({
					subcfgId: $scope.yysx.yysxid
				})
				.then(function(response) {
					$scope.uploadFile = angular.copy(response.data);
					console.log($scope.uploadFile)
					if($scope.uploadFile != null && $scope.uploadFile.length > 0) {
						$scope.canShowDoc = true;
					} else {
						$scope.canShowDoc = false;
					}
				}, function(error) {
					showAlert("未获取到所需材料信息!");
				});

    }

    $scope.yysxChoosable = $wyyyService.yysxChoosable;
    if (!$scope.yysxChoosable) {
      $scope.yysx.sx = $wyyyService.yysx;
      $scope.yysx.yysxid = $wyyyService.yysxid;
      $scope.fontColor.sxColor = "#000000";
      $scope.getDocs();
    }

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
      if (n == 0 || n == 1 || n == 2) {
        $scope.src = $scope.imgData[n].src;
        $scope.showTips = true;
      } else {
        $scope.showTips = false;
      }
    }

		$rootScope.$on('xzsj', function(event, args) {
			if($wyyyService.yysj.date==null||$wyyyService.yysj.date==""||$wyyyService.yysj.date==''||
				$wyyyService.yysj.week==null||$wyyyService.yysj.week==""||$wyyyService.yysj.week==''||
				$wyyyService.yysj.time==null||$wyyyService.yysj.time==""||$wyyyService.yysj.time==''){
				$scope.yysx.time = "请选择预约时间";
				$scope.fontColor.timeColor = "#ABABAB";
				return;
			}
			$scope.yysx.time = $wyyyService.yysj.date + '/' + $wyyyService.yysj.week + "\xa0\xa0\xa0" + $wyyyService.yysj.time;
			if($scope.yysx.time != "请选择预约时间") {
				$scope.fontColor.timeColor = "#000000";
			}
			$scope.yysx.date = $wyyyService.yysj.date;
		});

		$rootScope.$on('yysx', function(event, args) {

			$scope.yysx.sx = $wyyyService.yysx;
			$scope.yysx.yysxid = $wyyyService.yysxid;
			if($wyyyService.shouldResetYysj){
				$scope.yysx.time = "请选择预约时间";
				$scope.fontColor.timeColor = "#ABABAB";
				$wyyyService.yysj.time = "";
			}
			$scope.getDocs();
			if($scope.yysx.sx != "请选择预约事项") {
				$scope.fontColor.sxColor = "#000000";
			}

    });

    $scope.isShowDocs = false;
    $scope.showDocs = function() {
      if ($scope.uploadFile == null || $scope.uploadFile.length == 0) {
        showAlert("未获取到所需材料信息!");
      } else {
        $scope.isShowDocs = !$scope.isShowDocs;
      }

    }
    $rootScope.$on('yyjg', function(event, args) {
      $scope.yysx = {
        sx: '请选择预约事项',
        time: '请选择预约时间',
        bsdt: '请选择办事大厅',
        date: ''
      };
      $scope.bdcqzhMbData = $dictUtilsService.getBdcqzhMb();
      initKeyWords();
      $scope.fontColor = {
        sxColor: "#ABABAB",
        timeColor: "#ABABAB",
        bsdtColor: "#ABABAB"
      }
      $scope.wyyy.code = "";
    });

    if ($wyyyService.yymc != "") {
      $scope.wyyy.name = $wyyyService.yymc;
    }

    if ($wyyyService.yyhm != "") {
      $scope.wyyy.number = $wyyyService.yyhm;
    }

    //预约基本信息
    /*$scope.goback = function() {
    	$ionicHistory.goBack(); //返回上一个页面
    };*/

    $scope.yysxGoback = function() {
      $wyyyService.yymc = "";
      $wyyyService.yyhm = "";
      $wyyyService.yysx = "";
      $wyyyService.bsdt = "";
      $wyyyService.yysj = {
        date: '请选择预约时间',
        week: '',
        time: ''
      };
      $ionicHistory.goBack();
    }
    //5.1.3版
    /*	$scope.agree = function() {
    		$state.go('qyxz', {
    			"id": 0
    		});
    	};*/
    //模板选择
    $scope.bdcqzhMbData = $dictUtilsService.getBdcqzhMb();
    initKeyWords = function() {
      for (var i = 0; i < $scope.bdcqzhMbData.length; i++) {
        var model = $scope.bdcqzhMbData[i];
        if (model.name.indexOf('其他') != -1 || model.name.indexOf('二维码') != -1) {
          continue;
        }

        if (model.name.indexOf("***") == 0) {
          //先去掉开头的“***”，再用***分割
          var name = model.name.replace("***", "");
          model.keyWords = name.split("***");
        } else {
          model.keyWords = model.name.split("***");
        }

      }
    }
    initKeyWords();

    //获取不动产权证号
    $scope.getbdcqzh = function() {
      var result = "";

      if ($scope.bdcqzhMbData != undefined && $scope.bdcqzhMbData.length > 0) {

        for (var i = 0; i < $scope.bdcqzhMbData.length; i++) {
          var model = $scope.bdcqzhMbData[i];
          if (model.isSelected) {

						if(model.name.indexOf('其他') != -1 || model.name.indexOf('二维码') != -1) {
							result = $scope.bdcqzhMbData[3].inputs[0];
							return result;
						} else {
							result = model.name;
							for(var j = 0; j < model.inputs.length; j++) {
								var input = model.inputs[j];
								result = result.replace("***", input);
							}
							return result;
						}

          }
        }

      }
      return result;
    };

    $scope.setUnSelected = function() {
      if ($scope.bdcqzhMbData != undefined && $scope.bdcqzhMbData.length > 0) {
        for (var i = 0; i < $scope.bdcqzhMbData.length; i++) {
          $scope.bdcqzhMbData[i].isSelected = false;
        }
      }
    }

    /*	//调用二维码扫描
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
    					'scanQRCode'
    				],
    			});
    		}, function(res) {
    			showAlert('网络请求失败！');
    		});

    	wx.ready(function() {
    		$scope.scanStart = function() {
    			wx.scanQRCode({
    				needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
    				scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
    				success: function(res) {
    					var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
    					var str = result.split("$");
    					$scope.bdcqzhMbData[3].inputs[0] = str[2];
    					$scope.$apply();
    				}
    			});
    		}
    	});

    	wx.error(function() {
    		alert("签名失败");
    	});*/
    if (platform == "mobile") {
      //调用二维码扫描
      $scope.scanStart = function() {
        $cordovaBarcodeScanner
          .scan()
          .then(function(barcodeData) {
            if (barcodeData.cancelled) {
              console.log(barcodeData.cancelled);
            } else {
              $scope.barcodeData = barcodeData; // Success! Barcode data is here
              /*					var Request=new UrlSearch($scope.barcodeData.text);
              					if(Request.subCode){
              						$loginService.subCode = Request.subCode;
              						$loginService.ywh = Request.ywh;
              						$state.go('fjxzsm');
              					}
              					else{
              						showAlert('请选择正确的上传文件二维码！');
              					}*/
              var result = $scope.barcodeData.text;
              var str = result.split("$");
              $scope.bdcqzhMbData[3].inputs[0] = str[2];
              $scope.$apply();
              //$scope.showAlert($scope.barcodeData);
            }
          }, function(error) {
            showAlert('扫描失败！');
          });
      };
    } else {
      //调用二维码扫描
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
              'scanQRCode'
            ],
          });
        }, function(res) {
          showAlert('网络请求失败！');
        });
      wx.ready(function() {
        $scope.scanStart = function() {
          wx.scanQRCode({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function(res) {
              var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
              var str = result.split("$");
              $scope.bdcqzhMbData[3].inputs[0] = str[2];
              $scope.$apply();
            }
          });
        }
      });
      wx.error(function() {
        alert("签名失败");
      });
    }
		//	$scope.scanStart = function() {
		//		$scope.bdcqzhMbData[3].inputs[0] = "蒙（2019）呼和浩特市不动产权第0018524号";
		//	}
    //选择产权证书类别
    $scope.checkBdcqzhMb = function() {
      $ionicActionSheet.show({
        cancelOnStateChange: true,
        cssClass: 'action_s',
        titleText: "请选择产权证书类别",
        addCancelButtonWithLabel: '取消',
        androidEnableCancelButton: true,
        buttons: [{
          text: $scope.bdcqzhMbData[0].name
        }, {
          text: $scope.bdcqzhMbData[1].name
        }, {
          text: $scope.bdcqzhMbData[2].name
        }, {
          text: $scope.bdcqzhMbData[3].name
        }],
        cancelText: '取消',
        cancel: function() {
          return true;
        },
        buttonClicked: function(index) {
          $scope.setUnSelected();
          $scope.bdcqzhMbData[index].isSelected = true;
          return true;
        }
      });
    };

		//选择办事大厅
		$scope.selectBsdt = function() {
			$state.go("selectBsdt");
		}

		$rootScope.$on('xzbsdt', function(event, args) {

			if($scope.yysx.bsdt!= args.bsdt){
				$scope.yysx.sx = "请选择预约事项";
				$scope.fontColor.sxColor = "#ABABAB";
				$wyyyService.yysx = "";
				$scope.yysx.time = "请选择预约时间";
				$scope.fontColor.timeColor = "#ABABAB";
				$wyyyService.yysj.time = "";
			}
			$scope.yysx.bsdt = args.bsdt;
			if($scope.yysx.bsdt != "请选择办事大厅") {
				$scope.fontColor.bsdtColor = "#000000";
			}
		});

		//提交预约信息
		//验证预约事项数据保存信息
		$scope.verifyDataBgdj = function() {
			var canSave = false;

			if($wyyyService.yysx == undefined || $wyyyService.yysx === null || $wyyyService.yysx === "") {
				showAlert("请选择预约事项");
			} else if($scope.yysx.bsdt == '请选择办事大厅') {
				showAlert("请选择办事大厅");
			} else if($wyyyService.yysj.time == undefined || $wyyyService.yysj.time === null || $wyyyService.yysj.time === "") {
				showAlert("请选择预约时间");
			} else if($scope.wyyy.yyzh == undefined || $scope.wyyy.yyzh === null || $scope.wyyy.yyzh === "" || !$dictUtilsService.CertificationNo($scope.wyyy.yyzh)) {
				showAlert("请输入正确的不动产权证号");
			} else if(!checkCQZH()) {
				showAlert("产权证号输入不完整！");
			} else if($scope.wyyy.code == undefined || $scope.wyyy.code === null || $scope.wyyy.code === "") {
				showAlert("请输入验证码");
			} else {
				canSave = true;
			}
			return canSave;
		}
		//检验产权证号每个空档是否都输入了
		checkCQZH = function() {

			for(var i = 0; i < $scope.bdcqzhMbData.length; i++) {

				if($scope.bdcqzhMbData[i].name.indexOf('其他') == -1 && $scope.bdcqzhMbData[i].name.indexOf('二维码') == -1 && $scope.bdcqzhMbData[i].isSelected) {

					for(var j = 0; j < $scope.bdcqzhMbData[i].inputs.length; j++) {
						var input = $scope.bdcqzhMbData[i].inputs[j];
						if(input == '' || input == "" || input == null) {
							return false;
						}
					}
				}
			}
			return true;
		}

		$scope.isAdmitting = false;//防止快速点击弹出多个预约确认弹窗，导致每个弹窗可以发起一次预约
		$scope.admit = function() {
			if($scope.isAdmitting){
				return;
			}

			$scope.wyyy.yyzh = $scope.getbdcqzh();
			if(!$scope.verifyDataBgdj()) {
				return;
			}
			$scope.isAdmitting = true;
			//弹出登录对话框
			var confirmPopup = $ionicPopup.confirm({
				title: "提示",
				okText: "确认",
				cancelText: "取消",
				content: "信息填写完成，确认发起预约申请？"
			});
			confirmPopup.then(function(res) {
				$scope.isAdmitting = false;
				if(res) {

					$wyyyService.addAppointmentInfo({
						"yyyhmc": $scope.wyyy.name,
						"zjzl":"1",
						"zjh": mongoDbUserInfo.zjh,
						"yysx": $scope.yysx.sx,
						"yyFlowId": $wyyyService.yysxid,
						"lxdh": $scope.wyyy.number,
						"yyjg": $wyyyService.bsdt.jgmc,
						"orgCode": $wyyyService.bsdt.djjg,
						"yybsdt": $wyyyService.bsdt.officeName,
						"yybsdtdz": $wyyyService.bsdt.address,
						"bsdtdh": $wyyyService.bsdt.dh,
						"sjd": $wyyyService.yysj.time,
						"yysj": $wyyyService.yysj.date,
						"yyzh": $scope.wyyy.yyzh,
						"authCode": $scope.wyyy.code,
						"userId": mongoDbUserInfo.id
					}).then(function(res) {
						if(res.success) {
							$wyyyService.yyjg = res.data;
							$wyyyService.lxdh = $scope.wyyy.number;
							$state.go('yyjg', {}, {
								reload: true
							});
						} else {
							showAlert(res.message);
						}
					}, function(error) {
						showAlert(error.message);
					});

        }
      });

    };

		$scope.selectyysx = function() {
			if($scope.yysx.bsdt != "请选择办事大厅") {
				$state.go('xzyysx');
			} else {
				showAlert("请先选择办事大厅");
			}

		}

		$scope.xzyysj = function() {
			if($wyyyService.yysx == undefined || $wyyyService.yysx === null || $wyyyService.yysx === "") {
				showAlert("请先选择预约事项！");
				return;
			}

			$wyyyService.yymc = $scope.wyyy.name;
			$wyyyService.yyhm = $scope.wyyy.number;
			$state.go('xzyysj');

		}

		function getTelCode(tel) {
			$registerService.getPhoneCode({
					phone: tel,areaCode:640000
				})
				.then(function(res) {
					console.log("请求成功");
					if(res.success) {
						$dictUtilsService.addCodeInteral($scope);
					}
				}, function(res) {
					console.log(res.message);
					console.log("获取验证码失败！");
					if(res.message == null || res.message == "" || res.message == "null") {
						showAlert("获取验证码失败");
					} else {
						showAlert(res.message);
					}
				});
		}

    //获取验证码
    $scope.code = "获取验证码";
    $scope.getCode = function() {
      if ($scope.wyyy.name == "" ||
        $scope.wyyy.number == "" ||
        $wyyyService.yysj.time == "" ||
        $scope.yysx.sx == ""
      ) {
        showAlert("请输入完整信息后再尝试");
        return;
      }
      //验证手机号码
      if (!$scope.bGetCodeDisabled) {
        var isPhone = $dictUtilsService.phone($scope.wyyy.number);
        if (!isPhone) {
          showAlert("请输入正确的手机号码");
        } else {
          getTelCode($scope.wyyy.number);
        }
      }
    }

		/*$scope.checkEnable = function() {
			//获取预约证号
			$scope.wyyy.yyzh = $scope.getbdcqzh();
			if($scope.verifyDataBgdj()) {
				$wyyyService.checkEnable({
					"userId": mongoDbUserInfo.id,
					"yysj": $scope.yysx.date,
					"sjd": $wyyyService.yysj.time,
					"yyjg": $wyyyService.bsdt.jgmc,
					"yybsdt": $wyyyService.bsdt.officeName
				}).then(function(res) {
					if(res.success) {
						var result = res.data;
						if(result) {
							showAlert("该日期不可重复预约");
						} else {
							$scope.admit();
						}
					}
				}, function(res) {
					showAlert(res.message);
				});
			}

		}*/

    showAlert = function(msg) {
      ionicToast.show(msg, 'middle', false, 2000);
    };

    var sendParam = {
      loginName: ""
    };

    $scope.queryPersonInfo = function() {
      sendParam.loginName = userData.data.loginName;
      //		sendParam.id = '5add94ffd4b3d672e0ffdce4';
      $meService.getMongoDbUserInfo(sendParam)
        .then(function(response) {
          var result = angular.copy(response.data);
          //存放到constant中用户信息信息父级别，用来判断是否进行了实名认证
          mongoDbUserInfoFather = result;
          $scope.mongoDbUserInfo = result.userinfo;
          //存放到constant中用户信息
          mongoDbUserInfo = result.userinfo;
          $scope.getUserInfo($scope.mongoDbUserInfo);
          console.log($scope.mongoDbUserInfo);
          if ($stateParams.name || $stateParams.number) {
            $scope.wyyy.name = $stateParams.name;
            $scope.wyyy.number = $stateParams.number;
          }
        }, function(error) {
          showAlert("请求失败");
        });
    };

    if ($dictUtilsService.isLogin()) {
      $scope.queryPersonInfo();
    }

    $scope.getUserInfo = function(mongoDbUserInfo) {
      $scope.wyyy.name = mongoDbUserInfo.name;
      $scope.wyyy.number = mongoDbUserInfo.tel;
      //过滤器格式化
    }
    //解决虚拟键盘弹起遮住输入框的问题
    $("input").on("click", function() {
      console.log("success!");
      var target = this;
      window.setTimeout(function() {
        target.scrollIntoView(true);
      }, 100);
    });
  }
]);
