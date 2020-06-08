angular.module('bdcqzVerifyCtrl', []).controller('bdcqzVerifyCtrl', ["$scope", "$state", "$stateParams",
  "$ionicHistory", "ionicToast",
  "$menuService", "$bsznService", "$wysqService", "$rootScope", "$djsqService",
  function($scope, $state, $stateParams, $ionicHistory, ionicToast, $menuService, $bsznService, $wysqService,
    $rootScope, $djsqService) {

    $scope.goback = function() {
      $ionicHistory.goBack(); //返回上一个页面
    };
    $scope.level2Menu = $menuService.level2Menu;
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
      $scope.type = "1";
      $scope.title = "不动产权证验证";
    } else if ($scope.paramObj.netFlowCode == ygdj_ysspfmmygzxdj_flowCode ||
      $scope.paramObj.netFlowCode == ygdj_ysspfdyqygzxdj_flowCode ||
      $scope.paramObj.netFlowCode == dyqdj_zxdj_flowCode ||
      $scope.paramObj.netFlowCode == zxgcdyzx_zydj_flowCode) {
      $scope.type = "2";
      $scope.title = "不动产证明号验证";
    } else if ($scope.paramObj.netFlowCode == "xxxxxxx") {

      $scope.type = "3";
      $scope.title = "不动产证明号验证";

    } else if (ygdy_flowcode == $scope.paramObj.netFlowCode ||
      mmyg_flowcode == $scope.paramObj.netFlowCode) {
      $scope.type = "4";
      $scope.title = "合同验证";
    } else if (gyjsydsyqjfwsyq_gzdj_flowCode == $scope.paramObj.netFlowCode) {
      $scope.type = "5";
      $scope.title = "合同验证";
    } else if (gyjsydsyqjfwsyq_zydj_flowCode == $scope.paramObj.netFlowCode ||
      gyjsydsyqjfwsyq_gzdj_flowCode == $scope.paramObj.netFlowCode ||
      gyjsydsyqjfwsyq_bgdj_flowCode == $scope.paramObj.netFlowCode ||
      dyqdj_scdj_flowCode == $scope.paramObj.netFlowCode ||
      dyqdj_bgdj_flowCode == $scope.paramObj.netFlowCode) {
      //旧流程中根据不动产权证号提取不动产信息(转移、更正、变更、注销、抵押权首次)
      $scope.type = "6";
      $scope.title = "不动产权证验证";
    } else {
      $scope.type = "0";
      $scope.title = "不动产权证验证";
    }
    // 选择区域
    $scope.areaData = {

    };

    $scope.gotoYzqyxz = function() {
      $state.go('yzqyxz');
    };

    $rootScope.$on('yzqyxz', function(event, args) {
      $scope.areaData.zl = args.zl;
      $scope.areaData.zlArea = args.zlArea;
      $scope.areaData.zlCity = args.zlCity;
      $scope.areaData.zlProvince = args.zlProvince;
    });

    $scope.yz = {
      bdcqzmh: ""
    };

    $scope.isVerified = false;
    $scope.verify = function() {
      if ($scope.type == "0" || $scope.type == "1" || $scope.type == "6") { //产权证号
        $djsqService.getEstateInfoByRealEstateRightCode({
          realEstateRightCode: $scope.yz.bdcqzmh,
          unitCode: "150105005010GB00022F00020048,150105005010GB00022F00020049",
          areaCode: "31313"
        }).then(function(res) {
          $scope.returnData = res;
          $scope.showAlert('通过验证！');
          $scope.isVerified = true;
        }, function(err) {
          $scope.isVerified = false;
        });
      } else if ($scope.type == "2") { //预告证明号
        $djsqService.getEstateInfoByMortgageCertificateNumber({
          mortgageCertificateNumber: "123131", //到时候需要把bdcqzmh传过来
          unitCode: "150105005014GB00009F00180118,150105005014GB00009F00180119",
          areaCode: "31313"
        }).then(function(res) {
          // $djsqService.realEstateRightCodeCheck({
          // 		realEstateRightCode: '蒙(呼和浩特)123不动产权第123号',
          // 		areaCode: "150102",
          // 		codeType : "1",
          // 		subFlowName:"aaa",
          // 		unitCode: "150105005014GB00009F00180118,150105005014GB00009F00180119",
          // 		flowCode:"F100301",
          // 	}).then(function (res) {
          $scope.returnData = res;
          $scope.showAlert('通过验证！');
          $scope.isVerified = true;
        }, function(err) {
          console.log("err is " + JSON.stringify(err));
          $scope.isVerified = false;
        });
      } else if ($scope.type == "3") { //抵押证明号
        $djsqService.getEstateInfoByMortgageCertificateNumber({
          mortgageCertificateNumber: $scope.yz.bdcqzmh,
          unitCode: "150105005010GB00022F00020048,150105005010GB00022F00020049",
          areaCode: "31313"
        }).then(function(res) {
          $scope.returnData = res;
          $scope.showAlert('通过验证！');
          $scope.isVerified = true;
        }, function(err) {
          $scope.isVerified = false;
        });
      } else if ($scope.type == "4") { //合同号
        $djsqService.getEstateInfoByContractNumber({
          realEstateRightCode: $scope.yz.bdcqzmh,
          unitCode: "150105005010GB00022F00020048,150105005010GB00022F00020049",
          areaCode: "31313"
        }).then(function(res) {
          $scope.returnData = res;
          $scope.showAlert('通过验证！');
          $scope.isVerified = true;
        }, function(err) {
          $scope.isVerified = false;
        });
      } else if ($scope.type == "5") { //合同号
        $djsqService.getEstateInfoByRealEstateRightCode({
          realEstateRightCode: $scope.yz.bdcqzmh,
          unitCode: "150105005010GB00022F00020048,150105005010GB00022F00020049",
          areaCode: "31313"
        }).then(function(res) {
          $scope.returnData = res;
          $scope.showAlert('通过验证！');
          $scope.isVerified = true;
        }, function(err) {
          $scope.isVerified = false;
        });
      } else { //type=0的情况是为了让原来的旧的流程能通过该界面
        $scope.showAlert('通过验证！');
        $scope.isVerified = true;
      }

    };




    $scope.nextStep = function() {
      if (!$scope.isVerified) {
        // $scope.showAlert('验证通过后才能进行下一步！');
        // return;
        $scope.verify();
      }

      $scope.sqxx = {
        djjg: $scope.paramObj.djjg, //机构代码
        djjgmc: $scope.paramObj.djjgmc, //登记机构名称
        bdclb: $scope.paramObj.bdclb, //不动产类别
        bsdtCode: $scope.paramObj.bsdtCode, //办事大厅
        bsdtName: $scope.paramObj.bsdtName, //办事大厅
        flowCode: $scope.paramObj.flowCode, //流程代码
        flowName: $scope.paramObj.flowName, //流程名称
        subFlowCode: $scope.paramObj.subFlowCode, //子流程代码
        subFlowName: $scope.paramObj.subFlowName, //子流程名称
        netFlowCode: $scope.paramObj.netFlowCode, //网络流程代码
        djdl: $scope.paramObj.djdl, //登记大类
        qllx: $scope.paramObj.qllx, //权利类型
        sqrlx: mongoDbUserInfo.userCategory, //申请人类型
        userId: mongoDbUserInfo.id //用户ID
      };
      //提交申请
      $wysqService.saveSqxx($scope.sqxx)
        .then(function(res) {
          if (res.success) {
            $wysqService.djsqItemData = res.data;
            // if($scope.type =='0'){//老流程
            // 	$state.go('sqrxx', { jsonObj: $scope.sqxx });
            // }else{
            $scope.submitPersonData();
            // }
          }
          //hide();
        }, function(res) {
          $scope.showAlert('数据提交失败！');
          //console.log(res.message);
          //hide();
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
      var personList = $scope.returnData.data.participants;
      if (personList == null || personList.length == 0) {
        return;
      }
      for (var i = 0; i < personList.length; i++) {
        var person = personList[i];
        //将不动产权证号/证明号/合同号获取的人员信息封装成权利人义务人保存数据时接口需要的格式
        var sqr = {
          ywh: $wysqService.djsqItemData.ywh[0],
          category: person.category,
          dh: person.phone,
          gyfs: person.gyfs,
          sfczr: 1,
          zjh: person.zjh,
          zjzl: person.zjzl,
          qlrlx: person.sqrlx
        };
        if (person.category == "0" || person.category == "2" || person.category == "4" || person.category == "7" ||
          person.category == "9") { //权利人
          sqr.qlrmc = person.name;
          $scope.qlrList[$scope.qlrList.length] = sqr;
        } else if (person.category == "1" || person.category == "5" || person.category == "6" || person.category ==
          "8" || person.category == "10" || person.category == "11") { //义务人
          sqr.ywrmc = person.name;
          $scope.ywrList[$scope.ywrList.length] = sqr;
        };
        /**
         * 以下代码只适用于 预告+抵押流程。预告权利人与 抵押人是同一个人，所以category = 7时，数据要在 抵押人中保存一份 category改为10
         */
        if (person.category == "7" && $wysqService.djsqItemData.ywh.length > 1) {
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

      $scope.submitQlrList();
    }
    //提交 权利人
    $scope.submitQlrList = function() {

      $wysqService.addqlrList({
        qlrList: $scope.qlrList
      }).then(function(res) {
        if (res.success) {
          //showAlert("添加权利人集合成功");
          //权利人添加完成后，开始添加义务人
          $scope.submitYwrList();
        } else {
          showAlert(res.message);
        }
      }, function(res) {
        showAlert(res.message);
      });

    }
    //提交 预告义务人 ，预告抵押人，预告债务人
    $scope.submitYwrList = function() {

      $wysqService.addywrList({
        ywrList: $scope.ywrList
      }).then(function(res) {
        if (res.success) {
          //showAlert("添加义务人集合成功");
          $scope.submitBdcxx();
        } else {
          showAlert(res.message);
        }
      }, function(res) {
        showAlert(res.message);
      });

      //预告抵押人 =预告权利人，所以抵押人不用提交
    }


    $scope.submitBdcxx = function() {
      var bdcxx = $scope.returnData.data.bdcxx[0];
      console.log("bdcxx  is " + JSON.stringify(bdcxx));
      var param = {

        qlxxChildDtoList: [{
          bdcdjzmh: $scope.yz.bdcqzmh,
          qlxxEx: {
            bdbzqse: bdcxx.bdbzqse,
            fwcqmj: bdcxx.bdcmj,
            // "zwlxjssj": "2019-10-12T01:47:47.284Z",
            // "zwlxqssj": "2019-10-12T01:47:47.284Z"
            zwlxjssj: bdcxx.zwlxzzsj,
            zwlxqssj: bdcxx.zwlxqssj
          },
          qlxxExMhs: [{
            bdcdyh: bdcxx.bdcdyh,
            bdcqzh: bdcxx.bdcqzh,
            fwcqmj: bdcxx.bdcmj,
            //						fwjyjg: 0,
            //						ldmj: 0,
            lz: "string",
            //						tdqdjg: 0,
            //						tdsyqmj: 0,
            //						tdyt: "string",
            zl: bdcxx.zl,
            //						zlArea: "string",
            //						zlCity: "string",
            //						zlProvince: "string"
          }],

          ywh: $wysqService.djsqItemData.ywh[0],

        }],
        wwywh: $wysqService.djsqItemData.wwywh
      }



      $wysqService.addbdcxx(param)
        .then(function(res) {
          //$scope.showAlert('保存不动产信息成功');
          if ($scope.paramObj.netFlowCode == ygdj_ysspfdyqygzxdj_flowCode ||
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
          }
          //TODO 何文：后续要根据三级流程类型，跳转到不同界面。
        }, function(res) {
          $scope.showAlert(res.message);
        });

    }

    //提示对话框
    $scope.showAlert = function(msg) {
      ionicToast.show(msg, 'middle', false, 2000);
    };

  }
]);
