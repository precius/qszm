angular.module('extractSqxxCtrl', []).controller('extractSqxxCtrl', ["$scope", "$state", "$stateParams",
  "$ionicHistory", "ionicToast",
  "$menuService", "$bsznService", "$wysqService", "$rootScope", "$djsqService", "$dictUtilsService",
  "$ionicActionSheet", "$ionicLoading",
  function($scope, $state, $stateParams, $ionicHistory, ionicToast, $menuService, $bsznService, $wysqService,
    $rootScope, $djsqService, $dictUtilsService, $ionicActionSheet, $ionicLoading) {

    $scope.goback = function() {
      $ionicHistory.goBack(); //返回上一个页面
    };
    $scope.paramObj = $stateParams.jsonObj; //上级界面传递过来的参数，包含提交申请接口需要的信息
    console.log("$scope.paramObj.netFlowCode is " + $scope.paramObj.netFlowCode);
    if (zydy_flowcode == $scope.paramObj.netFlowCode //转移+抵押
      ||
      bgzy_flowcode == $scope.paramObj.netFlowCode //变更+转移
      ||
      bz_flowcode == $scope.paramObj.netFlowCode //补证
      ||
      hz_flowcode == $scope.paramObj.netFlowCode //换证
    ) {
      $scope.flowType = "1";
      $scope.title = "不动产权证验证";
    } else if ($scope.paramObj.netFlowCode == ygdj_ysspfmmygzxdj_flowCode ||
      $scope.paramObj.netFlowCode == ygdj_ysspfdyqygzxdj_flowCode ||
      $scope.paramObj.netFlowCode == dyqdj_zxdj_flowCode ||
      $scope.paramObj.netFlowCode == zxgcdyzx_zydj_flowCode) {
      $scope.flowType = "2";
      $scope.title = "不动产证明号验证";
    } else if ($scope.paramObj.netFlowCode == "xxxxxxx") {

      $scope.flowType = "3";
      $scope.title = "不动产证明号验证";

    } else if (ygdy_flowcode == $scope.paramObj.netFlowCode ||
      mmyg_flowcode == $scope.paramObj.netFlowCode) {
      $scope.flowType = "4";
      $scope.title = "合同验证";
    } else if (gyjsydsyqjfwsyq_gzdj_flowCode == $scope.paramObj.netFlowCode) {
      $scope.flowType = "5";
      $scope.title = "合同验证";
    } else if (gyjsydsyqjfwsyq_zydj_flowCode == $scope.paramObj.netFlowCode ||
      gyjsydsyqjfwsyq_gzdj_flowCode == $scope.paramObj.netFlowCode ||
      gyjsydsyqjfwsyq_bgdj_flowCode == $scope.paramObj.netFlowCode ||
      dyqdj_scdj_flowCode == $scope.paramObj.netFlowCode ||
      dyqdj_bgdj_flowCode == $scope.paramObj.netFlowCode) {
      //旧流程中根据不动产权证号提取不动产信息(转移、更正、变更、注销、抵押权首次)
      $scope.flowType = "6";
      $scope.title = "不动产权证验证";
    } else {
      $scope.flowType = "0";
      $scope.title = "不动产权证验证";
    }

    if ($scope.flowType == '1' || $scope.flowType == '0' || $scope.flowType == '5' || $scope.flowType == '6') {
      $scope.needShowMb = true;
    } else {
      $scope.needShowMb = false;
    }

    //模板选择
    $scope.bdcqzhMbData = $dictUtilsService.getBdcqzhMb();
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
    setUnSelected();
    $scope.bdcqzhMbData[0].isSelected = true;
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
        }],
        cancelText: '取消',
        cancel: function() {
          return true;
        },
        buttonClicked: function(index) {
          switch (index) {
            case 0:
              //设置没有被选中
              setUnSelected();
              $scope.bdcqzhMbData[0].isSelected = true;
              break;
            case 1:
              //设置没有被选中
              setUnSelected();
              $scope.bdcqzhMbData[1].isSelected = true;
              break;
            case 2: //设置没有被选中
              setUnSelected();
              $scope.bdcqzhMbData[2].isSelected = true;
              break;

          }
          return true;
        }
      });
    }

    function setUnSelected() {
      if ($scope.bdcqzhMbData != undefined && $scope.bdcqzhMbData.length > 0) {
        for (var i = 0; i < $scope.bdcqzhMbData.length; i++) {
          $scope.bdcqzhMbData[i].isSelected = false;
        }
      }
    }
    //获取不动产权证号
    function getbdcqzh() {
      if ($scope.bdcqzhMbData != undefined && $scope.bdcqzhMbData.length > 0) {
        for (var i = 0; i < $scope.bdcqzhMbData.length; i++) {
          var model = $scope.bdcqzhMbData[i];
          if (model.isSelected) {
            result = model.name;
            for (var j = 0; j < model.inputs.length; j++) {
              var input = model.inputs[j];
              result = result.replace("***", input);
            }
            return result;
          }
        }
      }

    }
    //检验产权证号每个空档是否都输入了
    function checkCQZH() {
      for (var i = 0; i < $scope.bdcqzhMbData.length; i++) {
        if ($scope.bdcqzhMbData[i].name.indexOf('其他') == -1 && $scope.bdcqzhMbData[i].name.indexOf('二维码') == -1 &&
          $scope.bdcqzhMbData[i].isSelected) {
          for (var j = 0; j < $scope.bdcqzhMbData[i].inputs.length; j++) {
            var input = $scope.bdcqzhMbData[i].inputs[j];
            if (input == '' || input == "" || input == null) {
              return false;
            }
          }
        }
      }
      return true;
    }

    function checkDyh() {
      if ($scope.yz.dyh == null || $scope.yz.dyh == '') {
        $scope.showAlert('请输入不动产单元号');
        return false;
      }
      var re = /^[0-9]{12}[GJZ]{1}[ABSXCDEFGHWY]{1}[0-9]{5}[FLQW]{1}[0-9]{8}$/;
      var bRt = re.test($scope.yz.dyh);
      if (!bRt) {
        $scope.showAlert('不动产单元号格式不正确');
      }
      return bRt;
    }
    // 选择区域
    $scope.areaData = {
      zlProvince: '',
      zlCity: '',
      zlArea: '',
      zl: '',
      areaCode: ''
    };

    $scope.gotoYzqyxz = function() {
      $state.go('zlxz');
    };

    $rootScope.$on('zlxz', function(event, args) {
      $scope.areaData.zl = args.zl;
      $scope.areaData.zlArea = args.zlArea;
      $scope.areaData.zlCity = args.zlCity;
      $scope.areaData.zlProvince = args.zlProvince;
      $scope.areaData.areaCode = args.areaCode;
    });
    //需要验证的证号  1 不动产权证号 2 不动产证明号 3 合同号 4单元号
    $scope.yz = {
      bdcqzh: '',
      zmh: '',
      hth: '',
      dyh: ''
    };

    $scope.isVerified = false;
    $scope.verify = function() {
      if ($scope.areaData.zlProvince == '' || $scope.areaData.zlCity == '' || $scope.areaData.zlArea == '') {
        $scope.showAlert('请选择坐落');
        return;
      }
      //校验不动产单元号
      if (!checkDyh()) {
        return;
      }
      if ($scope.flowType == "0" || $scope.flowType == "1" || $scope.flowType == "6") { //产权证号
        //验证不动产权证号或者证明号验证  hewen 03.27
        /* {
          "params": [
            {
              "bdcdyh": [
                "string"
              ],
              "bdclx": "string",
              "bdcqzh": [
                "string"
              ],
              "lcdm": "string",
              "lcxlmc": "string",
              "qydm": "string",
              "zhlx": "string"
            }
          ]
        } */
        $scope.yz.bdcqzh = getbdcqzh();
        if ($scope.yz.bdcqzh == null || $scope.yz.bdcqzh == '') {
          $scope.showAlert('请输入不动产权证号');
          return;
        }
        if (!checkCQZH()) {
          $scope.showAlert("产权证号输入不完整！");
          return;
        }
        showLoading1();
        $djsqService.checkBdcqxxByBdcqzhOrZmh({
          "params": [{
            "bdcdyh": [$scope.yz.dyh],
            "bdcqzh": [$scope.yz.bdcqzh],
            "lcdm": $scope.paramObj.netFlowCode,
            "qydm": $scope.areaData.areaCode
            // "bdcdyh": ["130929001015GB00007F00140121"],
            // "bdcqzh": ["冀（2020）献县不动产权第0000156号"],
            // "lcdm": "N200104",
            // "qydm": "130929"
          }]
        }).then(function(res) {
          // $scope.returnData = res;
          hideLoading();
          if (res.data) {
            $scope.showAlert('通过验证！');
            $scope.isVerified = true;
          } else {
            $scope.showAlert(res.message);
            $scope.isVerified = false;
          }

        }, function(err) {
          $scope.showAlert(err.message);
          $scope.isVerified = false;
          hideLoading();
        });
      }
      /* else if ($scope.flowType == "2") { //预告证明号
             $djsqService.getEstateInfoByMortgageCertificateNumber({
               mortgageCertificateNumber: "123131", //到时候需要把bdcqzh传过来
               unitCode: "150105005014GB00009F00180118,150105005014GB00009F00180119",
               areaCode: "31313"
             }).then(function(res) {
               $scope.returnData = res;
               $scope.showAlert('通过验证！');
               $scope.isVerified = true;
             }, function(err) {
               console.log("err is " + JSON.stringify(err));
               $scope.isVerified = false;
             });
           } else if ($scope.flowType == "3") { //抵押证明号
             $djsqService.getEstateInfoByMortgageCertificateNumber({
               mortgageCertificateNumber: $scope.yz.bdcqzh,
               unitCode: "150105005010GB00022F00020048,150105005010GB00022F00020049",
               areaCode: "31313"
             }).then(function(res) {
               $scope.returnData = res;
               $scope.showAlert('通过验证！');
               $scope.isVerified = true;
             }, function(err) {
               $scope.isVerified = false;
             });
           } else if ($scope.flowType == "4") { //合同号
             $djsqService.getEstateInfoByContractNumber({
               realEstateRightCode: $scope.yz.bdcqzh,
               unitCode: "150105005010GB00022F00020048,150105005010GB00022F00020049",
               areaCode: "31313"
             }).then(function(res) {
               $scope.returnData = res;
               $scope.showAlert('通过验证！');
               $scope.isVerified = true;
             }, function(err) {
               $scope.isVerified = false;
             });
           } else if ($scope.flowType == "5") { //合同号
             $djsqService.getEstateInfoByRealEstateRightCode({
               realEstateRightCode: $scope.yz.bdcqzh,
               unitCode: "150105005010GB00022F00020048,150105005010GB00022F00020049",
               areaCode: "31313"
             }).then(function(res) {
               $scope.returnData = res;
               $scope.showAlert('通过验证！');
               $scope.isVerified = true;
             }, function(err) {
               $scope.isVerified = false;
             });
           } */


    };


    $scope.hasGetSqxx = false;
    $scope.bdcxxList = [];
    $scope.participants = [];
    //提取信息
    $scope.getSqxx = function() {
      if (!$scope.isVerified) {
        $scope.showAlert('验证通过后才能操作！');
        return;
      }

      /* {
        "params": [
          {
            "bdcdyh": [
              "string"
            ],
            "bdcqzh": [
              "string"
            ],
            "lcdm": "string",
            "lcxlmc": "string",
            "qydm": "string"
          }
        ]
      } */
      //通过不动产权证号获取信不动产信息
      showLoading2();
      $djsqService.getBdcxxByBdcqzh({
        "params": [{
          "bdcdyh": [$scope.yz.dyh],
          "bdcqzh": [$scope.yz.bdcqzh],
          "lcdm": $scope.paramObj.netFlowCode,
          "qydm": $scope.areaData.areaCode
          // "bdcdyh": ["130929001015GB00007F00140121"],
          // "bdcqzh": ["冀（2020）献县不动产权第0000156号"],
          // "lcdm": "N200104",
          // "qydm": "130929"
        }]
      }).then(
        function(res) {
          hideLoading();
          if (res.success) {
            $scope.showAlert('提取信息成功！');
            $scope.hasGetSqxx = true;
            console.log(res.data);
            var data = res.data;
            //提取到的不动产信息
            $scope.bdcxxList = data[0].bdcxx;

            //提取出来的申请人信息
            $scope.participants = data[0].participants;

          } else {
            $scope.hasGetSqxx = false;
            $scope.showAlert(res.message);
          }

        },
        function(error) {
          hideLoading();
          $scope.showAlert(error.message);
          $scope.hasGetSqxx = false;
        });


    }
    $scope.startSq = function() {
      //提交申请
      $wysqService.saveSqxx($scope.paramObj)
        .then(function(res) {
          if (res.success) {
            $wysqService.djsqItemData = res.data;

            $scope.submitPersonData();
          }
        }, function(res) {
          $scope.showAlert('数据提交失败！');

        })
    }
    /**
     * 权利人接口    （删除、新增、编辑）
     * 所有权人-0
     * 使用权人-2
     * 抵押权人-4
     * 预告权利人-7
     * 预告抵押权人-9
     *
     *
     * 义务人接口    （删除、新增、编辑）
     * 原所有权人 -1
     * 抵押人-5
     * 债务人-6
     * 预告义务人-8
     * 预告抵押人-10
     * 预告债务人-11
     *
     */
    $scope.qlrList = [];
    $scope.ywrList = [];
    $scope.submitPersonData = function() {
      $scope.qlrList = [];
      $scope.ywrList = [];
      var personList = $scope.participants;
      if (personList == null || personList.length == 0) {
        return;
      }
      for (var i = 0; i < personList.length; i++) {
        var person = personList[i];
        //将不动产权证号/证明号/合同号获取的人员信息封装成权利人义务人保存数据时接口需要的格式
        //-----------------------------人员信息-------
        // category: "0"
        // gyfs: "1"
        // name: "张晓阳"
        // phone: "15831870505"
        // sqrlx: "1"
        // zjh: "13098119861103561X"
        // zjzl: "1"
        if (person.gyfs == 0 || person.gyfs == '0') {
          person.gyqk = '单独所有';
        }
        if (person.gyfs == 1 || person.gyfs == '1') {
          person.gyqk = '共同共有';
        }

        var sqr = {
          ywh: $wysqService.djsqItemData.ywh[0],
          // category: person.category,
          category: "0",
          dh: person.phone,
          gyfs: person.gyfs,
          gyqk: person.gyqk,
          sfczr: 1,
          zjh: person.zjh,
          zjzl: person.zjzl,
          qlrlx: person.sqrlx,
          bdcdyh: $scope.bdcxxList[0].bdcdyh,
        };
        if (sqr.category == "0" || sqr.category == "2" || sqr.category == "4" || sqr.category == "7" ||
          sqr.category == "9") { //权利人
          sqr.qlrmc = person.name;
          $scope.qlrList[$scope.qlrList.length] = sqr;
        } else if (sqr.category == "1" || sqr.category == "5" || sqr.category == "6" || sqr.category ==
          "8" || sqr.category == "10" || sqr.category == "11") { //义务人
          sqr.ywrmc = person.name;
          $scope.ywrList[$scope.ywrList.length] = sqr;
        };
        /**
         * 以下代码只适用于 预告+抵押流程。预告权利人与 抵押人是同一个人，所以category = 7时，数据要在 抵押人中保存一份 category改为10
         */
        if (sqr.category == "7" && $wysqService.djsqItemData.ywh.length > 1) {
          var sqr2 = {
            ywh: $wysqService.djsqItemData.ywh[1],
            category: '10',
            ywrmc: person.name,
            dh: person.phone,
            gyfs: person.gyfs,
            sfczr: 1,
            zjh: person.zjh,
            zjzl: person.zjzl,
            qlrlx: person.sqrlx
          };
          $scope.ywrList[$scope.ywrList.length] = sqr2;
        }
      }

      $scope.submitqlrList();
    }
    //提交 权利人
    $scope.submitqlrList = function() {
      if ($scope.qlrList.length > 0) {
        $wysqService.addqlrList({
          qlrList: $scope.qlrList
        }).then(function(res) {
          if (res.success) {
            //showAlert("添加权利人集合成功");
            //权利人添加完成后，开始添加义务人
            $scope.submitywrList();
          } else {
            showAlert(res.message);
          }
        }, function(res) {
          showAlert(res.message);
        });
      } else {
        $scope.submitywrList();
      }


    }
    //提交 预告义务人 ，预告抵押人，预告债务人
    $scope.submitywrList = function() {
      if ($scope.ywrList.length > 0) {
        $wysqService.addywrList({
          ywrList: $scope.ywrList
        }).then(function(res) {
          if (res.success) {
            //showAlert("添加义务人集合成功");
            //义务人保存成功后继续保存不动产信息
            $scope.submitBdcxx();
          } else {
            showAlert(res.message);
          }
        }, function(res) {
          showAlert(res.message);
        });
      } else {
        $scope.submitBdcxx();
      }


      //预告抵押人 =预告权利人，所以抵押人不用提交
    }


    $scope.submitBdcxx = function() {
      //默认将权利人集合第0个作为权力人通知人,义务人集合第0个设为义务人通知人
      var tzrxxes = [];

      if ($scope.qlrList != null && $scope.qlrList.length > 0) {
        tzrxxes.push({
          index: tzrxxes.length,
          tzrmc: $scope.qlrList[0].qlrmc,
          tzdh: $scope.qlrList[0].dh,
          category: $scope.qlrList[0].category
        });
      }
      if ($scope.ywrList != null && $scope.ywrList.length > 0) {
        tzrxxes.push({
          index: tzrxxes.length,
          tzrmc: $scope.ywrList[0].ywrmc,
          tzdh: $scope.ywrList[0].dh,
          category: $scope.ywrList[0].category
        });
      }
      //将获取到的不动产信息封装成接口参数格式
      var bdcxx = $scope.bdcxxList[0];
      //-----------------------------不动产信息--------
      // bdcdyh: "130929001015GB00007F00140121"
      // bdcqzh: "冀（2020）献县不动产权第0000156号"
      // dytdmj: 0
      // ftjzmj: 16.39
      // fttdmj: 0
      // fwjg: "3"
      // fwjyjg: 36.5842
      // fwlx: "1"
      // fwxz: "0"
      // fwyt: "11"
      // jgsj: 1532016000000
      // jzmj: 97.66
      // sfcf: "0"
      // sfdy: "0"
      // sfyg: "0"
      // sfygdy: "0"
      // sfyy: "0"
      // shbw: "3-301"
      // syqjssj: 3568896000000
      // syqqssj: 1359907200000
      // szc: "3"
      // xmmc: "龙港佳苑"
      // zcs: "16"
      // zh: "0014"
      // zl: "河北省沧州市献县龙港佳苑14号楼3单元301室"
      // zyjzmj: 81.27
      console.log("bdcxx  is " + JSON.stringify(bdcxx));
      var param = {

        qlxxChildDtoList: [{
          bdcdjzmh: $scope.yz.bdcqzh,
          qlxxEx: {
            // bdbzqse: bdcxx.bdbzqse,
            // fwcqmj: bdcxx.jzmj,
            // "zwlxjssj": "2019-10-12T01:47:47.284Z",
            // "zwlxqssj": "2019-10-12T01:47:47.284Z"
            // zwlxjssj: bdcxx.zwlxzzsj,
            // zwlxqssj: bdcxx.zwlxqssj
            sqzsbs: 1,
            sffbcz: false,
            sfdbz: false
          },
          qlxxExMhs: [{
            bdcdyh: bdcxx.bdcdyh,
            bdcqzh: bdcxx.bdcqzh,
            fwcqmj: bdcxx.jzmj,
            //						fwjyjg: 0,
            //						ldmj: 0,
            //						tdqdjg: 0,
            //						tdsyqmj: 0,
            //						tdyt: "string",
            zl: $scope.areaData.zl,
            zlArea: $scope.areaData.zlArea,
            zlCity: $scope.areaData.zlCity,
            zlProvince: $scope.areaData.zlProvince
          }],
          tzrxxes: tzrxxes,
          ywh: $wysqService.djsqItemData.ywh[0]

        }],
        wwywh: $wysqService.djsqItemData.wwywh
      }

      $wysqService.addbdcxx(param)
        .then(function(res) {
            //$scope.showAlert('保存不动产信息成功');
            if (res.success) {
              $wysqService.isMainApplicant = true; //是主申请人
              $wysqService.stepByStep = true; //在申请人信息  不动产信息 附件上传信息显示下一步
              $wysqService.stepInfo.one = false;
              $wysqService.stepInfo.two = false;
              $wysqService.stepInfo.three = false;
              $wysqService.stepInfo.four = false;
              $state.go('sqrxx', {
                "stateGo": 'djsq'
              });
            } else {
              $scope.showAlert(res.message);
            }
            /* if ($scope.paramObj.netFlowCode == ygdj_ysspfdyqygzxdj_flowCode ||
              $scope.paramObj.netFlowCode == window.dyqdj_zxdj_flowCode ||
              $scope.paramObj.netFlowCode == zxgcdyzx_zydj_flowCode) {
              $state.go('sqrxxYdyzx');
            } else if ($scope.paramObj.netFlowCode == ygdj_ysspfmmygzxdj_flowCode) {
              $state.go('sqrxxYmmygzx');
            } else if ($scope.paramObj.netFlowCode == ygdy_flowcode) {
              $state.go('sqrxx-list-ygdy');
            } else if ($scope.paramObj.netFlowCode == zydy_flowcode) {
              $state.go('sqrxx-list-zydy');
            } else if ($scope.paramObj.netFlowCode == bgzy_flowcode) {
              $state.go('sqrxx-list-bgzy');
            } else if ($scope.paramObj.netFlowCode == mmyg_flowcode) {
              $state.go('sqrxx-list-mmyg');
            } else if (gyjsydsyqjfwsyq_gzdj_flowCode == $scope.paramObj.netFlowCode) {
              $state.go('sqrxx-gzdj');
            } else if ($scope.paramObj.netFlowCode == hz_flowcode ||
              $scope.paramObj.netFlowCode == bz_flowcode) {
              $state.go('sqrxx-list-hzbz');
            } else {
              $state.go('sqrxx', {
                jsonObj: $scope.sqxx
              });
            } */
            //TODO 何文：后续要根据三级流程类型，跳转到不同界面。
          },
          function(res) {
            $scope.showAlert(res.message);
          });

    }
    showLoading1 = function() {
      $ionicLoading.show({
        //template: '上传中...'
        template: '<ion-spinner icon="lines" class="spinner-calm"></ion-spinner><p>验证中...</p>',
        duration: 100000000
      });
    };
    showLoading2 = function() {
      $ionicLoading.show({
        //template: '上传中...'
        template: '<ion-spinner icon="lines" class="spinner-calm"></ion-spinner><p>提取中...</p>',
        duration: 100000000
      });
    };
    hideLoading = function() {
      $ionicLoading.hide();
    };
    //提示对话框
    $scope.showAlert = function(msg) {
      ionicToast.show(msg, 'middle', false, 2000);
    };

  }
]);
