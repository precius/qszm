angular.module('homeCtrl', []).controller('homeCtrl', ["$scope", "ionicToast", "$rootScope", "$state", "$loginService",
  "$zcfgService", "$dictUtilsService", "$menuService", "$wyyyService", "$meService", "$ionicPopup",
  "$cordovaBarcodeScanner", "$wysqService", "$addressService",
  function ($scope, ionicToast, $rootScope, $state, $loginService, $zcfgService, $dictUtilsService, $menuService,
    $wyyyService, $meService, $ionicPopup, $cordovaBarcodeScanner, $wysqService, $addressService) {
    //调用微信人脸识别之前进行签名
    /*	var appId = null;
    	$dictUtilsService.signature(function(res){
    		appId = res.data.appId;
    	});*/
    //显示下边导航栏
    $rootScope.hideTabs = false;
    $scope.city = city.title + county.title;
    if (county.title.indexOf(city.title) >= 0) {
      $scope.city = county.title;
    }
    $scope.isOnline = $addressService.isOnline;
    if (projectName == "lingbao") {
      $scope.city = county.title;
    }
    //跳转登录对话框
    $scope.showConfirmFour = function (titel, okText, cancelText, contentText) {
      var confirmPopup = $ionicPopup.confirm({
        title: titel,
        okText: okText,
        cancelText: cancelText,
        content: contentText
      });
      confirmPopup.then(function (res) {
        if (res) {
          $loginService.flag = 1;
          $state.go('login', {
            'fromPosition': 'tab.me'
          });
        } else {

        }
      });
    };
    //判断自己是否在黑名单中
    $scope.isInBlackList = false;
    $scope.isInBlackList1 = function () {
      console.log(JSON.stringify(userData.data))
      $loginService.isInBlackList({
        'loginName': userData.data.loginName
      })
        .then(
          function (res) {
            if (res.success) {
              $scope.isInBlackList = res.data;
            } else {
              console.log(res.message);
            }
          },
          function (error) {
            console.log(error.message);
          }
        );
    }

    //获取办事大厅
    $scope.selectBsdt = function () {
      $scope.convenientData1 = [{
        src: require("../theme/img_home/online_service.png"),
        name: "在线客服",
        des: "",
        page: "zxkf"
      }];
      $dictUtilsService.getBsdtDataByDjjg($scope, function (res) {
        if (res.success) {
          if (res.data.length > 0) {
            $scope.tel = res.data[0].dh;
            console.log($scope.tel);
            $scope.convenientData1 = [{
              src: require("../theme/img_home/online_service.png"),
              name: "在线客服",
              des: $scope.tel,
              page: "zxkf"
            }];
          }
        }

      });
    }
    $scope.selectBsdt();
    //		参数1：文字内容 ，
    //		参数2：toast在屏幕的位置，
    //		参数3：true-需要手动关闭，false-会自动消失
    //		参数4: 显示的时长
    //		ionicToast.show('顶部toast', 'top',false, 2000);
    //		ionicToast.show('中部toast', 'middle',false, 2000);
    //		ionicToast.show('底部toast', 'bottom',false, 2000);

    $scope.navData = [

      {
        src: require("../theme/img_home/order.png"),
        name: "预约排号",
        des: "提早预约免排队、快速办理真省心",
        page: "yyxz",
        hasConfigInSerer: true,
        permValue: 'IEBDC:SY:WYYY'
      },
      {
        src: require("../theme/img_home/order.png"),
        name: "补办登记",
        des: "不动产变更一站办",
        page: "level1menu",
        hasConfigInSerer: true,
        permValue: 'IEBDC:BB'
      },
      {
        src: require("../theme/img_home/service_site.png"),
        name: "服务网点",
        des: "网点位置",
        page: "fwwd",
        //确定后台是否存在该配置,如果不存在该配置则不需要填写permValue
        hasConfigInSerer: false
      },
      // {
      //   src: require("../theme/img_home/transfer.png"),
      //   name: "转移登记",
      //   des: "过户一站办，快速又省心",
      //   //				page: ""
      //   page: "level1menu",
      //   hasConfigInSerer: true,
      //   permValue: 'IEBDC:ZY'
      // },
      // {
      //   src: require("../theme/img_home/mortgage.png"),
      //   name: "抵押登记",
      //   des: "不动产抵押一站办",
      //   page: "level1menu",
      //   hasConfigInSerer: true,
      //   permValue: 'IEBDC:DY'
      // },
      {
        src: require("../theme/img_home/suggest.png"),
        name: "投诉建议",
        des: "您的建议是最宝贵的财富",
        page: "suggest",
        hasConfigInSerer: false
      },
    ];

    $scope.onlineData = [{
      src: require("../theme/img_home/order.png"),
      name: "预约排号",
      des: "提早预约免排队、快速办理真省心",
      page: "yyxz",
      hasConfigInSerer: true,
      permValue: 'IEBDC:SY:WYYY'
    },
    {
      src: require("../theme/img_home/order.png"),
      name: "补办登记",
      des: "不动产变更一站办",
      page: "level1menu",
      hasConfigInSerer: true,
      permValue: 'IEBDC:BB'
    },
    {
      src: require("../theme/img_home/transfer.png"),
      name: "转移登记",
      des: "过户一站办，快速又省心",
      page: "level1menu",
      hasConfigInSerer: true,
      permValue: 'IEBDC:ZY'
    },
    {
      src: require("../theme/img_home/mortgage.png"),
      name: "抵押登记",
      des: "不动产抵押一站办",
      page: "level1menu",
      hasConfigInSerer: true,
      permValue: 'IEBDC:DY'
    },
      // {
      //   src: require("../theme/img_home/change.png"),
      //   name: "变更登记",
      //   des: "不动产变更一站办",
      //   page: "level1menu",
      //   hasConfigInSerer: true,
      //   permValue: 'IEBDC:BG'
      // }
    ];

    $scope.infoData = [{
      src: require("../theme/img_home/schedule.png"),
      name: "进度查询",
      des: "业务办理情况轻松掌握",
      //				page: ""
      page: "jdcx",
      hasConfigInSerer: true,
      permValue: 'IEBDC:SY:JDCX'
    },
    {
      src: require("../theme/img_home/qszm_check.png"),
      name: "不动产证明",
      des: "名下不动产情况查询证明",
      //				page: ""
      page: "qszmxxlist",
      hasConfigInSerer: true,
      permValue: 'IEBDC:SY:BDCZMCX'
    },
    {
      src: require("../theme/img_home/zshs.png"),
      name: "证书验证",
      des: "证书真伪一键核查",
      page: "zsyzlist",
      hasConfigInSerer: true,
      permValue: 'IEBDC:SY:ZSHS'
    },
    // {
    //   src: require("../theme/img_home/ems.png"),
    //   name: "EMS查询",
    //   des: "证书物流实时把握",
    //   page: "logistics-search",
    //   hasConfigInSerer: false
    // },
    {
      src: require("../theme/img_home/zszw_check.png"),
      name: "权属真伪查询",
      des: "权属证明真伪一键核查",
      //				page: ""
      page: "zwcx",
      hasConfigInSerer: false,
    },
    ];

    $scope.convenientData = [{
      src: require("../theme/img_home/service_site.png"),
      name: "服务网点",
      des: "网点导航就近办",
      page: "fwwd",
      hasConfigInSerer: false
    },
    {
      src: require("../theme/img_home/suggest.png"),
      name: "投诉建议",
      des: "您的建议是最宝贵的财富",
      page: "suggest",
      hasConfigInSerer: false
    },
    {
      src: require("../theme/img_home/3d_show.png"),
      name: "实景大厅",
      des: "纵览三维实景，享受智能服务",
      page: "sjdt_nav",
      hasConfigInSerer: false
    }
    ];
    //跳转到行情报告页面
    $scope.gotohqbg = function () {
      $state.go('hqbg');
    }
    $menuService.code = county.code;
    //主页扫描跳转到证书验证
    goToReadCertificate = function (jsonObj) {
      $state.go('read-certificate', {
        'jsonObj': jsonObj
      });
    }
    //		var jsonObjParam = 'Y3hiaDpCSDIwMTkwNTIwMDAwMDAx';
    //		var jsonObjParam = 'eXdoOjIwMTkwNTIxMDgzMw==';
    //		goToReadCertificate(jsonObjParam);
    //zhoushaotao 2020/3/3 feat:添加定位提示 start
    $scope.locate = function () {
      function updateData() {
        $scope.selectBsdt();
        $menuService.code = county.code;
        $scope.getMenu();
        $scope.city = city.title + county.title;
        if (county.title.indexOf(city.title) >= 0) {
          $scope.city = county.title;
        }
      }
      //根据区县代码获取当前区县所在的市
      function getCity(countyCode, data) {
        var cityAndCounty = {
          'city': '',
          'county': ''
        };
        if (data != undefined && data != null && data.length > 0) {
          var isThisCity = false;
          for (var i = 0; i < data.length; i++) {
            var province = data[i];
            //当前省下面所有的市
            var childrens = province.childrens;
            if (childrens != undefined && childrens != null && childrens.length > 0) {
              for (var j = 0; j < childrens.length; j++) {
                var city = childrens[j];
                //当前城市下所有的区县
                var cityChildrens = city.childrens;
                if (cityChildrens != undefined && cityChildrens != null && cityChildrens.length > 0) {
                  for (var y = 0; y < cityChildrens.length; y++) {
                    var county = cityChildrens[y];
                    if (countyCode == county.code) {
                      cityAndCounty.county = county;
                      isThisCity = true;
                      break;
                    }
                  }
                }
                if (isThisCity) {
                  cityAndCounty.city = city;
                  break;
                }
              }
            }
            if (isThisCity) {
              break;
            }
          }
        }
        return cityAndCounty;
      };
      $scope.selectCity = function (cityCounty) {
        if (cityCounty != undefined && cityCounty.code != undefined && cityCounty.code != null) {
          //如果选择的是城市，则直接获取城市下面的区县作为区县集合
          if (cityCounty.childrens != undefined && cityCounty.childrens.length > 0) {
            city = cityCounty;
            county = cityCounty;
          } else {
            //如果选择的是区县，首先获取区县所在的城市，然后获取当前城市下的区县集合
            var cityAndCounty = getCity(cityCounty.code, areaTree);
            if (cityAndCounty.city == '' || cityAndCounty.county == '') {
              $scope.showAlert('当前位置所在区域未开通!');
              return;
            }
            city = cityAndCounty.city;
            county = cityAndCounty.county;
          }
          $menuService.code = county.code;
          //根据区域代码获取菜单树
          $menuService.getmenu({
            areaCode: county.code
          })
            .then(function (res) {
              if (res.success) {
                console.log(res);
                $menuService.level1MenuArray = res.data;
                $menuService.bsdt = $scope.bsdt;
                $wyyyService.bsdt = $scope.bsdt;
                if (res.data != null && res.data.length > 0) {
                  $addressService.isOnline = true;

                } else {
                  $addressService.isOnline = false;
                }
              }
            }, function (res) {
              $scope.showAlert(res.message);
            });
          //根据区域及用户ID重新获取权限
          $dictUtilsService.getPermByAreaCode($rootScope, $scope);
          updateData();
        }
      }
      //弹出实名认证或者登录对话框
      $scope.showLocationDialog = function (titel, okText, cancelText, contentText, cityCounty) {
        var confirmPopup = $ionicPopup.confirm({
          title: titel,
          okText: okText,
          cancelText: cancelText,
          content: contentText
        });
        confirmPopup.then(function (res) {
          if (res) {
            $scope.selectCity(cityCounty);
          }
        });
      };
      //根据当前坐标获取当前区县
      $scope.getCurrentAddress = function (myLocation) {

        AMap.service('AMap.Geocoder', function () { //回调函数
          //实例化Geocoder
          geocoder = new AMap.Geocoder({
            city: "" //城市，默认：“全国”
          });
          // var lnglatXY=[lng_str, lat_str];//地图上所标点的坐标
          geocoder.getAddress(myLocation, function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
              //获得了有效的地址信息:
              //即，result.regeocode.formattedAddress
              //console.log(result);
              var city = result.regeocode.addressComponent.adcode;
              var cityCounty = {
                code: result.regeocode.addressComponent.adcode
              };
              // 判断是否已经提示过切换地区
              if (!$scope.hasPromptLocation) {
                $scope.showLocationDialog("提示", "确定", "取消", "当前地区为" + result.regeocode.addressComponent.city +
                  result.regeocode.addressComponent.district + ",是否切换到该地区?", cityCounty);
                $scope.hasPromptLocation = true;
              }
            }
          });
        })
      };
      //测试定位
      // var locationTemp = new AMap.LngLat('106.2428301400', '38.4731290200');
      // var locationTemp = new AMap.LngLat('106.2531711800', '38.2774810700');
      // var locationTemp = new AMap.LngLat('114.3052387800', '30.5927599000');
      // $scope.getCurrentAddress(locationTemp);
      //获取定位信息
      $wysqService.signature({
        url: signatureUrl
      })
        .then(function (res) {
          wx.config({
            debug: false,
            appId: res.data.appId,
            timestamp: res.data.timestamp,
            nonceStr: res.data.nonceStr,
            signature: res.data.signature,
            jsApiList: [
              'getLocation', 'openLocation'
            ],
          });
        }, function (res) {
          showAlert('网络请求失败！');
        });
      //获取微信定位的经纬度
      wx.ready(function () {
        wechatPermission = true;
        //获取全国区域树
        $addressService.getTree({
          "currentId": ""
        })
          .then(function (res) {
            areaTree = res.data;
            getLocation();
          }, function (res) {
            //隐藏加载框
            showAlert('获取区域失败', res.message);
          });
        getLocation = function () {
          wx.getLocation({
            type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: function (res) {
              var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
              var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
              var locationTemp = new AMap.LngLat(longitude, latitude);
              $scope.getCurrentAddress(locationTemp);
            }
          });
        }

      });
      wx.error(function () {
        showAlert("签名失败");
      });
    }
    if (isFirstLocation) {
      isFirstLocation = false;
      $scope.locate();
    }
    //zhoushaotao 2020/3/3 feat:添加定位提示 end

    $scope.getMenu = function () {
      $menuService.getmenu({
        areaCode: county.code
      })
        .then(function (res) {
          if (res.success) {
            console.log(res);
            if (res.data != null) {
              $addressService.isOnline = true;
              $scope.isOnline = $addressService.isOnline;
              $menuService.level1MenuArray = res.data; //保存申请流程的菜单集合
              $menuService.bsdt = $scope.bsdt;
              $wyyyService.bsdt = $scope.bsdt;

            } else {
              $addressService.isOnline = false;
              $scope.isOnline = $addressService.isOnline;
              showAlert("该区域暂未开通");
            }
          }
        }, function (res) {
          showAlert(res.message);
        });
    }
    $scope.getMenu();

    if (platform == "mobile") {
      //调用二维码扫描
      $scope.scanStart = function () {
        console.log(111);
        alert("mobile!");
        $cordovaBarcodeScanner
          .scan()
          .then(function (barcodeData) {
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
              						$scope.showAlert('扫描结果','请选择正确的上传文件二维码！');
              					}*/
              ionicToast.show($scope.barcodeData, 'middle', false, 2000);
            }
          }, function (error) {
            ionicToast.show('扫描失败！', 'middle', false, 2000);
          });
      };
    } else {
      //调用二维码扫描
      $wysqService.signature({
        url: signatureUrl
      })
        .then(function (res) {
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
        }, function (res) {
          ionicToast.show('网络请求失败！', 'middle', false, 2000);
        });
      wx.ready(function () {
        $scope.scanStart = function () {
          wx.scanQRCode({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
              var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
              goToReadCertificate(result);
            }
          });
        }
      });
      wx.error(function () {
        alert("签名失败");
      });
    }
    //获取字典
    $loginService.getDict(dictParam)
      .then(function (res) {
        dictInfos = res.data;
        console.log(dictInfos);
      }, function (res) {
        //隐藏加载框
        showAlert('获取数据字典失败', res.message);
      });
    //获取全国区域树
    $addressService.getTree({
      "currentId": ""
    })
      .then(function (res) {
        areaTree = res.data;
      }, function (res) {
        //隐藏加载框
        showAlert('获取区域失败', res.message);
      });
    //文章列表信息数组
    $scope.items = [];
    //通过文章类型查询文章列表
    $zcfgService.getArticleList({
      articleTypeEnum: 'ZCFG',
      category: 'zcjd'
    })
      .then(function (res) {
        if (res.success) {
          $scope.items = res.data.page;
          //替换照片URL
          if ($scope.items.length > 0) {
            for (var i = 0; i < $scope.items.length; i++) {
              var item = $scope.items[i];
              item.pictureUrl = $dictUtilsService.replacePicUrl(item.pictureUrl);
            }
          }
        }
      }, function (res) {
        console.log("获取资讯失败");
      });

    //跳转到我要过户，我要抵押，我要变更的一级菜单界面，这个三个按钮本地写死，但是如果后台没配，就不能跳转
    $scope.gotoLevel1Menu = function (item) {
      if (item.hasConfigInSerer) {
        if (!$dictUtilsService.isLogin()) {
          $scope.showConfirmFour('提示', '确认', '取消', "请先登录再办理业务");
          return;
        }
        if (!$dictUtilsService.isCertification()) {
          showAlert("请在'我的'页面完成实名认证!");
          return;
        }
        if (!$dictUtilsService.hasPermisonByPermValue(item.permValue)) {
          showAlert("该功能暂未开通");
          return;
        }
      }
      console.log(item.page)
      console.log(item.name)
      if (item.name == "转移登记" || item.name == "抵押登记") {
        showAlert("该业务暂未对个人用户开放");
        return;
      }
      if (item.name == "服务网点" || item.name == "预约排号") {
        $scope.gotoPage(item); //预约功能或服务网点
      } else {
        //申请流程
        if ($menuService.level1MenuArray != null && $menuService.level1MenuArray.length > 0) {
          $menuService.level1Menu = null;
          for (var i = 0; i < $menuService.level1MenuArray.length; i++) {
            if (item.name == $menuService.level1MenuArray[i].name) {
              $menuService.level1Menu = $menuService.level1MenuArray[i];
            }
          }
          if ($menuService.level1Menu == null) {
            showAlert("该功能暂未开通！");
          } else {
            $state.go(item.page);
          }
        } else {
          showAlert("该功能暂未开通！");
        }
      }
      //			$menuService.level1Menu = $scope.level1MenuArray[index];//用服务保存点击的一级菜单数据，再跳转到一级菜单界面

    }
    //页面跳转
    $scope.gotoPage = function (item) {
      if (item.hasConfigInSerer) {
        if (!$dictUtilsService.isLogin()) {
          $scope.showConfirmFour('提示', '确认', '取消', "请先登录再办理业务");
          return;
        }
        if (!$dictUtilsService.isCertification()) {
          showAlert("请在'我的'页面完成实名认证!");
          return;
        }
        if (!$dictUtilsService.hasPermisonByPermValue(item.permValue)) {
          showAlert("该功能暂未开通");
          return;
        }
      }
      var page = item.page;
      // if(!$addressService.isOnline) {
      // 	showAlert("该区域暂未开通");
      // 	return;
      // }
      if (page == "sjdt_nav" || page == "suggest") {
        showAlert("该功能暂未开通");
        return;
      }
      if (page == "") {
        showAlert("该功能暂未开通");
      } else if (page == "yyxz") {
        if ($dictUtilsService.isLogin()) {
          if ($scope.isInBlackList) {
            showAlert('你已经被后台管理员加入黑名单，无法使用该功能！')
            return;
          }
          if (!$dictUtilsService.isCertification()) {
            //					$scope.showCertificateDialog( "提示", "立即认证", "稍后再说", "通过实名认证后才能发起预约。");
            $scope.showCertificateDialog("提示", "立即认证", "稍后再说", "立即进行公安部实名身份认证。");
          } else {
            //实名认证过了，调用微信人脸识别
            if (needWxFaceVerify) {
              //app用活体检测
              //						  if (window.platform === 'mobile') {
              //                $state.go('face-verification');
              //              }
              $dictUtilsService.signature(function (res) {
                $dictUtilsService.wxface(function (data) {
                  $wyyyService.yysxChoosable = true;
                  $state.go(page);
                }, res.data.appId, mongoDbUserInfo.name, mongoDbUserInfo.zjh);
              });
            } else {
              $state.go(page);
            }

          }
        } else {
          $scope.showLoginDialog("提示", "确定", "取消", "请先登录再操作。")
        }

      } else if (page == "map") {
        $state.go(page);
        $rootScope.$broadcast('on-map', {
          index: 1
        });
      } else if (page == "qszmxxlist") {
        if ($dictUtilsService.isLogin()) {
          if (!$dictUtilsService.isCertification()) {
            //					$scope.showCertificateDialog( "提示",  "立即认证", "稍后再说", "通过实名认证后才能查询。");
            $scope.showCertificateDialog("提示", "立即认证", "稍后再说", "立即进行公安部实名身份认证。");
          } else {
            //实名认证过了，调用微信人脸识别
            if (needWxFaceVerify) {
              $dictUtilsService.signature(function (res) {
                $dictUtilsService.wxface(function (data) {
                  $state.go(page);
                }, res.data.appId, mongoDbUserInfo.name, mongoDbUserInfo.zjh);
              });
            } else {
              $state.go(page);
            }

          }
        } else {
          $scope.showLoginDialog("提示", "确定", "取消", "请先登录再操作。")
        }

      } else if (page == "zsyzlist") {
        if ($dictUtilsService.isLogin()) {
          if (!$dictUtilsService.isCertification()) {
            //					$scope.showCertificateDialog( "提示",  "立即认证", "稍后再说", "通过实名认证后才能查询。");
            $scope.showCertificateDialog("提示", "立即认证", "稍后再说", "立即进行公安部实名身份认证。");
          } else {
            //实名认证过了，调用微信人脸识别
            if (needWxFaceVerify) {
              $dictUtilsService.signature(function (res) {
                $dictUtilsService.wxface(function (data) {
                  $state.go(page);
                }, res.data.appId, mongoDbUserInfo.name, mongoDbUserInfo.zjh);
              });
            } else {
              $state.go(page);
            }
          }
        } else {
          $scope.showLoginDialog('提示', '确认', '取消', "请先登录用户。");
        }
      } else if (page == "suggest") {
        if ($dictUtilsService.isLogin()) {
          $state.go(page);
        } else {
          $scope.showLoginDialog('提示', '确认', '取消', "请先登录用户！");
        }
      } else if (page == "zxkf") {
        // window.open("https://cloud.chatbot.cn/cloud/robot/webui/5c47d586200000e36368d382")
        window.open(
          "https://vx.sdses.com/robot/?User=hushi&Appid=N1000042&CheckSum=e14c727e0429c1fcf94bf8d52fb946ff")
      } else if (page == 'zwcx') {
        console.log("1111")
        $scope.startScan()
        // $state.go('read-certificate');
      }

      else {
        $state.go(page);
      }
    }

    $scope.startScan = function () {
      //调用二维码扫描
      $wysqService.signature({
        url: signatureUrl
      })
        .then(function (res) {
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
        }, function (res) {
          ionicToast.show('网络请求失败！', 'middle', false, 2000);
        });
      wx.ready(function () {
        $scope.scanStart = function () {
          wx.scanQRCode({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
              var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
              goToZwcx(result);
            }
          });
        }
      });
      wx.error(function () {
        alert("签名失败");
      });
    }

    goToZwcx = function (jsonObj) {
      $state.go('read-certificate', {
        'jsonObj': jsonObj
      });
    }
    $scope.more = function (flag) {
      // if (!$addressService.isOnline) {
      //   showAlert("请先登录");
      //   return;
      // }
      $state.go('more', {
        "flag": flag
      });
    }

    //跳转到区域选择
    $scope.gotoQyxz = function () {
      $state.go('qyxz', {
        "id": 3
      });
    }
    $rootScope.$on('to-home', function (event, args) {
      //重新设置区县
      $scope.city = county.title;
    });
    //跳转到新闻详情页
    $scope.gotodetails = function (i) {
      $state.go('news-details', {
        id: $scope.items[i].id
      });
    }

    $scope.news = function () {
      $state.go('news');
    }

    var account = localStorage.getItem("account");
    var passWord = localStorage.getItem("passWord");
    if (account != null && account != "" && passWord != null && passWord != "") {
      login(account, passWord);
    }

    //密码加密算法
    function encryptByDES(strMessage, key) {
      if (window.CryptoJS && window.CryptoJS.mode) {
        window.CryptoJS.mode.ECB = (function () {
          if (CryptoJS.lib) {
            var ECB = CryptoJS.lib.BlockCipherMode.extend();

            ECB.Encryptor = ECB.extend({
              processBlock: function (words, offset) {
                this._cipher.encryptBlock(words, offset);
              }
            });

            ECB.Decryptor = ECB.extend({
              processBlock: function (words, offset) {
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
      var encrypted = CryptoJS.DES.encrypt(strMessage, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
      return encrypted.toString();
    }

    function login(account, passWord) {
      var password = encryptByDES(passWord);
      $loginService.login({
        loginName: account,
        password: password
      })
        .then(function (res) {
          if (res.success) {
            userData = res;
            $loginService.userdata = res.data;
            //登录成功获取MongoDB个人信息
            queryPersonInfo();
            $scope.isInBlackList1();
          } else {
            showAlert("登录失败");
          }
        }, function (res) {
          showAlert("登录失败");
        });
    }

    function queryPersonInfo() {
      $meService.getMongoDbUserInfo({
        loginName: userData.data.loginName
      })
        .then(function (response) {
          var result = angular.copy(response.data);
          //存放到constant中用户信息信息父级别，用来判断是否进行了实名认证
          mongoDbUserInfoFather = result;
          //存放到constant中用户信息
          mongoDbUserInfo = result.userinfo;
          //获取用户权限
          $dictUtilsService.getPermByAreaCode($rootScope, $scope);
          //隐藏加载框
        }, function (error) {
          //隐藏加载框
          showAlert("请求失败");
        });
    }

    showAlert = function (msg) {
      ionicToast.show(msg, 'middle', false, 2000);
    };
    //提示对话框
    $scope.showAlert = function (msg) {
      ionicToast.show(msg, 'middle', false, 2000);
    };

    //弹出实名认证或者登录对话框
    $scope.showCertificateDialog = function (titel, okText, cancelText, contentText) {
      var confirmPopup = $ionicPopup.confirm({
        title: titel,
        okText: okText,
        cancelText: cancelText,
        content: contentText
      });
      confirmPopup.then(function (res) {
        if (res) {
          $state.go('mine-certificate');
        }
      });

    };
    //弹出登录对话框
    $scope.showLoginDialog = function (titel, okText, cancelText, contentText) {
      var confirmPopup = $ionicPopup.confirm({
        title: titel,
        okText: okText,
        cancelText: cancelText,
        content: contentText
      });
      confirmPopup.then(function (res) {
        if (res) {
          $loginService.flag = 2;
          $state.go('login', {
            'fromPosition': 'tab.home'
          });
        }
      });

    };
  }
]);
