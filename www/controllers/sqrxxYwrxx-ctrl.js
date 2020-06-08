angular.module('sqrxxYwrxxCtrl', []).controller('sqrxxYwrxxCtrl', ["$scope", "ionicToast", "$stateParams", "$state",
  "$ionicHistory",
  "$wysqService", "$dictUtilsService", "$rootScope",
  function($scope, ionicToast, $stateParams, $state, $ionicHistory, $wysqService, $dictUtilsService, $rootScope) {
    if ($wysqService.djsqItemData.step == "NETAPPLYING" || $wysqService.djsqItemData.step == "NETNOPASS") {
      $scope.isShow = true;
    } else {
      $scope.isShow = false;
    }
    //义务人种类
    $scope.ywrtitle = $wysqService.ywrPageTitle;

    //权利人id
    $scope.id = $stateParams.id;
    console.log(JSON.stringify($wysqService.djsqItemData))
    console.log(JSON.stringify($wysqService.djsqItemData.subFlowname))

    //证件种类
    $scope.zjzlData = $dictUtilsService.getDictinaryByType("证件种类").childrens;

    //共有方式(当义务人类型为债务人时，共有方式从字典中取借款方式)
    if ($wysqService.zwrlist != null) {
      $scope.gyfsTitle = '借款方式';
      $scope.gyfsData = $dictUtilsService.getDictinaryByType("借款方式").childrens;
    } else {
      $scope.gyfsTitle = '共有方式';
      $scope.gyfsData = $dictUtilsService.getDictinaryByType("共有方式").childrens;
    }

    //权利人类型
    $scope.qlrlxData = $dictUtilsService.getDictinaryByType("权利人类型").childrens;

    //权利人分类
    $scope.qlrflData = [];
    $scope.qlrflDataAll = $dictUtilsService.getDictinaryByType("权利人分类").childrens;

    //获取义务人信息
    if ($stateParams.id != null) {
      $wysqService.getywrByywrId({
        id: $stateParams.id
      }).then(function(res) {
        if (res.success) {
          $scope.ywr = res.data;
          initEdit();
        } else {
          showAlert("res.message");
        }
      }, function(res) {
        showAlert("res.message");
      });
    } else {
      initAdd();
    }

    //添加义务人初始化
    function initAdd() {
      $scope.ywr = {};
      //初始化证件类型
      $scope.zjzl = $scope.zjzlData[0];
      $scope.ywr.zjzl = $scope.zjzl.value;
      //初始化共有方式
      $scope.gyfs = $scope.gyfsData[0];
      $scope.ywr.gyfs = $scope.gyfs.value;
      $scope.ywr.gyqk = $scope.gyfs.label;
      //初始化义务人类型
      $scope.qlrlx = $scope.qlrlxData[0];
      $scope.ywr.qlrlx = $scope.qlrlx.value;
      //初始化义务人分类，不同的流程显示不同的权利人分类
      if (gyjsydsyq_zydj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //土地_国有建设用地使用权_变更登记
        $scope.qlrflData.push($scope.qlrflDataAll[1]); //只有原使用权类型
        $scope.ywr.category = $scope.qlrflData[0].value;
      } else if (gyjsydsyqjfwsyq_zydj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //转移登记跳转
        $scope.qlrflData.push($scope.qlrflDataAll[1]); //只有原使用权人类型
        $scope.ywr.category = $scope.qlrflData[0].value;
      } else if (gyjsydsyqjfwsyq_bgdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //变更登记跳转
        $scope.qlrflData.push($scope.qlrflDataAll[1]);
        $scope.ywr.category = $scope.qlrflData[0].value;
      } else if (dyqdj_scdj_flowCode == $wysqService.djsqItemData.netFlowdefCode ||
        dyqdj_bgdj_flowCode == $wysqService.djsqItemData.netFlowdefCode ||
        dyqdj_zxdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //抵押权登记首次/变更登记跳转/注销登记
        $scope.qlrflData.push($scope.qlrflDataAll[5]);
        $scope.qlrflData.push($scope.qlrflDataAll[6]);
        if ($wysqService.dyrlist == null) {
          $scope.ywr.category = $scope.qlrflData[1].value;
        } else {
          $scope.ywr.category = $scope.qlrflData[0].value;
        }
      } else if (ygdj_ysspfdyqygdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //房屋_预告登记_预售商品房抵押权预告登记
        $scope.qlrflData.push($scope.qlrflDataAll[10]);
        $scope.qlrflData.push($scope.qlrflDataAll[11]);
        if ($wysqService.dyrlist == null) {
          $scope.ywr.category = $scope.qlrflData[1].value;
        } else {
          $scope.ywr.category = $scope.qlrflData[0].value;
        }
      } else if (ygdj_ysspfmmygdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //房屋_预告登记_预售商品房买卖预告登记
        $scope.qlrflData.push($scope.qlrflDataAll[8]);
        $scope.ywr.category = $scope.qlrflData[0].value;
      }else if (ygdj_ysspfdyqygdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //房屋_预告登记_预售商品房抵押权预告登记
        $scope.qlrflData.push($scope.qlrflDataAll[10]);
        $scope.ywr.category = $scope.qlrflData[0].value;
      }
      //家庭成员模块
      $scope.ywr.familyGroup = {
        familyMemberList: []
      }
    }

    //编辑义务人初始化
    function initEdit() {
      //初始化证件类型
      if ($scope.zjzlData != null && $scope.zjzlData.length > 0) {
        for (var i = 0; i < $scope.zjzlData.length; i++) {
          if ($scope.zjzlData[i].value == $scope.ywr.zjzl) {
            $scope.zjzl = $scope.zjzlData[i];
          }
        }
      }
      //初始化共有方式
      if ($scope.gyfsData != null && $scope.gyfsData.length > 0) {
        for (var i = 0; i < $scope.gyfsData.length; i++) {
          if ($scope.gyfsData[i].value == $scope.ywr.gyfs) {
            $scope.gyfs = $scope.gyfsData[i];
          }
        }
        //共有情况
        if ($scope.gyfs != undefined && $scope.gyfs.label != undefined) {
          $scope.ywr.gyqk = $scope.gyfs.label;
          //只有共有方式为"按份共有"才需要显示权力比例
          if ("按份共有" == $scope.gyfs.label) {
            $scope.isShowQlbl = true;
          } else {
            $scope.isShowQlbl = false;
          }
        }

      }
      //初始化义务人类型
      if ($scope.qlrlxData != null && $scope.qlrlxData.length > 0) {
        for (var i = 0; i < $scope.qlrlxData.length; i++) {
          if ($scope.qlrlxData[i].value == $scope.ywr.qlrlx) {
            $scope.qlrlx = $scope.qlrlxData[i];
          }
        }
      }
      if ($scope.ywr.familyGroup == null) {
        $scope.ywr.familyGroup = {
          familyMemberList: []
        }
      } else {
        if ($scope.ywr.familyGroup.familyMemberList === null) {
          $scope.ywr.familyGroup.familyMemberList = [];
        } else {
          for (var i = 0; i < $scope.ywr.familyGroup.familyMemberList.length; i++) {
            $scope.ywr.familyGroup.familyMemberList[i].isConfirm = true;
            for (var j = 0; j < $scope.familyRelationshipEnum.length; j++) {
              if ($scope.ywr.familyGroup.familyMemberList[i].familyRelationshipEnum == $scope.familyRelationshipEnum[
                  j].value) {
                $scope.ywr.familyGroup.familyMemberList[i].menberRelationship = $scope.familyRelationshipEnum[j];
              }
            }
            for (var k = 0; k < $scope.zjzlData.length; k++) {
              if ($scope.ywr.familyGroup.familyMemberList[i].zjzl == $scope.zjzlData[k].value) {
                $scope.ywr.familyGroup.familyMemberList[i].menberZjzl = $scope.zjzlData[k];
              }
            }
          }
        }
      }

      //初始化代理人
      if ($scope.ywr.dlrlx != null) {
        if ($scope.ywr.dlrlx == '0') { //代理人为个人
          $scope.dlr.dljg = null;
          $scope.dlr.dljgdh = null;
          $scope.dlr.dlrlx = $scope.ywr.dlrlx;
          $scope.dlr.dlrmc = $scope.ywr.dlrmc;
          $scope.dlr.dlrdh = $scope.ywr.dlrdh;
          $scope.dlr.dlrzjzl = $scope.ywr.dlrzjzl;
          $scope.dlr.dlrzjh = $scope.ywr.dlrzjh;
          $scope.dlrlxlSelected = $scope.dlrflData[1];
        }
        /*if ($scope.ywr.dlrlx == '1') { //代理人为组织
          $scope.dlr.dljg = $scope.ywr.dljg;
          $scope.dlr.dljgdh = $scope.ywr.dljgdh;
          $scope.dlr.dlrlx = $scope.ywr.dlrlx;
          $scope.dlr.dlrmc = $scope.ywr.dlrmc;
          $scope.dlr.dlrdh = $scope.ywr.dlrdh;
          $scope.dlr.dlrzjzl = $scope.ywr.dlrzjzl;
          $scope.dlr.dlrzjh = $scope.ywr.dlrzjh;
          $scope.dlrlxlSelected = $scope.dlrflData[2];
        }*/
      }
    }

    //选择证件类型
    $scope.checkZjlx = function(value) {
      $scope.ywr.zjzl = value;
    }

    //选择共有方式
    $scope.checkGyfs = function(item) {
      $scope.ywr.gyfs = item.value;
      $scope.ywr.gyqk = item.label;
      if ("按份共有" == item.label) {
        $scope.isShowQlbl = true;
      } else {
        $scope.isShowQlbl = false;
        $scope.ywr.qlbl = null;
      }
    }

    //选择权利人类型
    $scope.checkQlrlx = function(value) {
      $scope.ywr.qlrlx = value;
    }

    //选择成员关系
    $scope.checkRelationship = function(item) {
      item.familyRelationshipEnum = item.menberRelationship.value;
    }

    //代理人相关信息
    $scope.dlrflData = [{
        value: '-1',
        label: '无'
      },
      {
        value: '0',
        label: '有'
      }
      /*{
        value: '0',
        label: '个人'
      },
      {
        value: '1',
        label: '机构'
      }*/
    ];
    $scope.dlr = {

    };

    $scope.dlrlxlSelected = $scope.dlrflData[0]; //默认代理人类型是个人
    $scope.dlr.dlrlx = '-1';
    $scope.checkDlr = function(dlrlxlSelected) {
      $scope.dlr.dlrlx = dlrlxlSelected.value;
      if (dlrlxlSelected.value != '1') {
        $scope.dlr.dljg = null;
        $scope.dlr.dljgdh = null;
      }
    }



    //选择成员证件类型
    $scope.checkFamilyZjzl = function(item) {
      item.zjzl = item.menberZjzl.value;
    }

    //提示框
    function showAlert(msg) {
      ionicToast.show(msg, 'middle', false, 2000);
    }

    //OCR获取信息返回并且刷新
    $rootScope.$on('ocr-back', function(event, args) {
      //从OCR返回
      if (args.index == 0) {
        $scope.ywr = args.jsonObj;
        $scope.ywr.ywrmc = args.name;
        $scope.ywr.zjh = args.num;
      } else if (args.index == 1) {
        $scope.ywr = args.jsonObj;
        $scope.ywr.dlrmc = args.name;
        $scope.ywr.dlrzjh = args.num;
      }
      //			$scope.initZjlx();
      //			$scope.initGyfs();
      //			$scope.getQlrflByValue($scope.ywr.category);
      //			$scope.getQlrlxByValue($scope.ywr.qlrlx);
    });

    //使用ocr获取义务人信息
    $scope.ywrtoocr = function() {
      $state.go('ocr', {
        "id": $scope.id,
        "index": 0,
        "stateGo": 'sqrxxYwrxxAdd',
        "jsonObj": $scope.ywr
      }, {
        reload: true
      });
    }

    //编辑
    $scope.ywrBjtoocr = function() {
      $state.go('ocr', {
        "id": $scope.id,
        "index": 0,
        "stateGo": 'sqrxxYwrxxEdit',
        "jsonObj": $scope.ywr
      }, {
        reload: true
      });
    }

    //验证数据保存信息
    function verifyYwData() {
      var canSave = false;
      $scope.verify = true;
      if ($scope.ywr.frdh == undefined || $scope.ywr.frdh == null || $scope.ywr.frdh == "") {
        $scope.verify = false;
      }
      if ($scope.ywr.ywrmc == undefined || $scope.ywr.ywrmc === null || $scope.ywr.ywrmc === "" ||
        $dictUtilsService.hasNum($scope.ywr.ywrmc)) {
        showAlert("请输入正确的义务人名称");
      } else if ($scope.ywr.zjzl == undefined || $scope.ywr.zjzl === null || $scope.ywr.zjzl === "") {
        showAlert("请选择证件种类");
      } else if ($scope.ywr.zjh == undefined || $scope.ywr.zjh === null || $scope.ywr.zjh === "") {
        showAlert("请输入证件号码");
      } else if (!($scope.ywr.zjh == undefined || $scope.ywr.zjh === null || $scope.ywr.zjh === "") && !
        $dictUtilsService.idcard($scope.ywr.zjh) && $scope.ywr.zjzl == 1) {
        showAlert("请输入正确的证件证号");
      } else if (!($scope.ywr.zjh == undefined || $scope.ywr.zjh === null || $scope.ywr.zjh === "") && !
        $dictUtilsService.gaIdcard($scope.ywr.zjh) && $scope.ywr.zjzl == 2) {
        showAlert("请输入正确的港澳台证件号");
      } else if (!($scope.ywr.zjh == undefined || $scope.ywr.zjh === null || $scope.ywr.zjh === "") && !
        $dictUtilsService.isPassPortCard($scope.ywr.zjh) && $scope.ywr.zjzl == 3) {
        showAlert("请输入正确的护照号码");
      } else if (!($scope.ywr.zjh == undefined || $scope.ywr.zjh === null || $scope.ywr.zjh === "") && !
        $dictUtilsService.isAccountCard($scope.ywr.zjh) && $scope.ywr.zjzl == 4) {
        showAlert("请输入正确的户口簿号码");
      } else if (!($scope.ywr.zjh == undefined || $scope.ywr.zjh === null || $scope.ywr.zjh === "") && !
        $dictUtilsService.isOfficerCard($scope.ywr.zjh) && $scope.ywr.zjzl == 5) {
        showAlert("请输入正确的军官证号码");
      } else if (!($scope.ywr.zjh == undefined || $scope.ywr.zjh === null || $scope.ywr.zjh === "") && !
        $dictUtilsService.orgcodevalidate($scope.ywr.zjh) && $scope.ywr.zjzl == 6) {
        showAlert("请输入正确的组织机构代码");
      } else if (!($scope.ywr.zjh == undefined || $scope.ywr.zjh === null || $scope.ywr.zjh === "") && !
        $dictUtilsService.checkLicense($scope.ywr.zjh) && $scope.ywr.zjzl == 7) {
        showAlert("请输入正确的营业执照号码");
      } else if ($scope.ywr.dh == undefined || !$dictUtilsService.phone($scope.ywr.dh)) {
        showAlert("请输入正确的联系电话");
      } else if ($scope.ywr.gyfs == undefined || $scope.ywr.gyfs != $scope.ywr.gyfs) {
        showAlert("请选择共有方式");
      } /*else if ($scope.ywr.qlrlx != "1" && ($scope.ywr.frmc == undefined || $scope.ywr.frmc == null || $scope.ywr.frmc ==
          "")) {
        showAlert("请输入法人名称");
      } else if ($scope.ywr.qlrlx != "1" && ($scope.ywr.frdh == undefined || $scope.ywr.frdh == null || $scope.ywr.frdh ==
          "" || $scope.verify && !$dictUtilsService.phone($scope.ywr.frdh))) {
        showAlert("请输入正确的法人电话");
      } */else {
        canSave = true;
      }
      return canSave;
    }

    //根据证件号判断没有人员重复(只允许债务人和抵押人是同一个人)
    function isNotDuplicate() {
      if ($wysqService.qlrlist != null && $wysqService.qlrlist.length > 0) {
        for (var i = 0; i < $wysqService.qlrlist.length; i++) {
          var person = $wysqService.qlrlist[i];
          if ($scope.id != null && $scope.id == person.id) { //这种情况说明是取出的person是正在编辑的人员信息，不跟自己做比较
            continue;
          }
          if (gyjsydsyqjfwsyq_bgdj_flowCode != $wysqService.djsqItemData.netFlowdefCode &&
            gyjsydsyqjfwsyq_bzdj_flowCode != $wysqService.djsqItemData.netFlowdefCode &&
            gyjsydsyqjfwsyq_hzdj_flowCode != $wysqService.djsqItemData.netFlowdefCode &&
            person.zjh == $scope.ywr.zjh) {
            //变更登记中允许权利人和义务人重复
            showAlert('证件号已经被添加过，不可重复添加！');
            return false; //证件号相同，说明人员重复
          }
        }
      }
      if ($wysqService.ywrlist != null && $wysqService.ywrlist.length > 0) {
        for (var i = 0; i < $wysqService.ywrlist.length; i++) {
          var person = $wysqService.ywrlist[i];
          if ($scope.id != null && $scope.id == person.id) { //这种情况说明是取出的person是正在编辑的人员信息，不跟自己做比较
            continue;
          }
          if (person.zjh == $scope.ywr.zjh) {
            showAlert('证件号已经被添加过，不可重复添加！');
            return false; //证件号相同，说明人员重复
          }
        }
      }
      if ($wysqService.dyrlist != null && $wysqService.dyrlist.length > 0) {
        for (var i = 0; i < $wysqService.dyrlist.length; i++) {
          var person = $wysqService.dyrlist[i];
          if ($scope.id != null && $scope.id == person.id) { //这种情况说明是取出的person是正在编辑的人员信息，不跟自己做比较
            continue;
          }
          if (person.zjh == $scope.ywr.zjh) {
            showAlert('证件号已经被添加过，不可重复添加！');
            return false; //证件号相同，说明人员重复
          }
        }
      }
      if ($wysqService.zwrlist != null && $wysqService.zwrlist.length > 0) {
        for (var i = 0; i < $wysqService.zwrlist.length; i++) {
          var person = $wysqService.zwrlist[i];
          if ($scope.id != null && $scope.id == person.id) { //这种情况说明是取出的person是正在编辑的人员信息，不跟自己做比较
            continue;
          }
          if (person.zjh == $scope.ywr.zjh) {
            showAlert('证件号已经被添加过，不可重复添加！');
            return false; //证件号相同，说明人员重复
          }
        }
      }
      return true;
    }

    //判断共有方式是否合理(当有多个人员时，共有方式不能为“单独所有”)
    function checkOwnedRegular() {
      var ywrList = [];
      if ($wysqService.ywrlist != null) {
        ywrList = $wysqService.ywrlist;
      } else if ($wysqService.dyrlist != null) {
        ywrList = $wysqService.dyrlist;
      } else if ($wysqService.zwrlist != null) {
        ywrList = $wysqService.zwrlist;
      } else {
        ywrList = null;
      }
      if (ywrList == null || ywrList.length == 0) {
        // 1 新增一个义务人
        if ($scope.ywr.gyqk == '按份共有' && (!$dictUtilsService.number($scope.ywr.qlbl) || $scope.ywr.qlbl ==
            undefined || parseFloat($scope.ywr.qlbl) <= 0 || parseFloat($scope.ywr.qlbl) >= 100)) {
          showAlert("请输入正确的比例!");
          return false;
        }
        return true;
      } else if (ywrList.length == 1 && $scope.id == ywrList[0].id) {
        // 2 只有一个正在编辑状态的义务人，与1情况一样
        if ($scope.ywr.gyqk == '按份共有' && (!$dictUtilsService.number($scope.ywr.qlbl) || $scope.ywr.qlbl ==
            undefined || parseFloat($scope.ywr.qlbl) <= 0 || parseFloat($scope.ywr.qlbl) >= 100)) {
          showAlert("请输入正确的比例!");
          return false;
        }
        return true;
      } else {
        if ($scope.ywr.gyqk == "单独所有") {
          showAlert('已经存在共有人，不能设置为单独所有！');
          return false;
        }
        if ($scope.ywr.gyqk == "单独借款") {
          showAlert('已经存在共同借款人，不能设置为单独借款！');
          return false;
        }
        var gyfs = '';
        if ($scope.id != null) { //说明是编辑状态，获取"共有方式"时要避开当前编辑人
          gyfs = $scope.id == ywrList[0].id ? ywrList[1].gyqk : ywrList[0].gyqk;
        } else {
          gyfs = ywrList[0].gyqk;
        }
        if ($scope.ywr.gyqk != gyfs) {
          showAlert('不能选择' + $scope.ywr.gyqk + '，共有方式需保持一致！');
          return false;
        } else { //共有方式一样时切 共有方式是 “按份共有时，还要判断权利比例不能超过100”
          if (gyfs == '按份共有' && (!$dictUtilsService.number($scope.ywr.qlbl) || $scope.ywr.qlbl == undefined ||
              parseFloat($scope.ywr.qlbl) <= 0 || parseFloat($scope.ywr.qlbl) >= 100)) {
            showAlert("请输入正确的比例!");
            return false;
          }
          if (gyfs == '按份共有' && (parseFloat($scope.ywr.qlbl) + $wysqService.num > 100)) {
            showAlert("多人比例总和不能大于100！");
            return false;
          }
          return true;
        }
      }
      return true;
    }

    //添加家庭成员
    $scope.addfamilymember = function() {
      // $scope.ywr.familyGroup.familyMemberList.push({
      //   isConfirm: false
      // });
      $state.go('jtcyxx', {
        familyMemberList: $scope.ywr.familyGroup.familyMemberList,
        pdym: "ywr"
      })
    }

    $rootScope.$on('jtcyxxYwr', function(event, data) {
      $scope.familyMemberList = data.familyMemberList;
      // $scope.qlr.familyGroup.familyMemberList = $scope.familyMemberList;
    });

    //验证家庭成员模块信息
    $scope.confirmfamilymember = function(item) {
      if (item.name == undefined || item.name === null || item.name === "" || $dictUtilsService.hasNum(item.name)) {
        showAlert("请输入正确的成员姓名");
      } else if (item.familyRelationshipEnum == undefined || item.familyRelationshipEnum === null || item.familyRelationshipEnum ===
        "") {
        showAlert("请选择成员关系");
      } else if (item.zjzl == undefined || item.zjzl === null || item.zjzl === "") {
        showAlert("请选择证件种类");
      } else if (item.zjh == undefined || item.zjh === null || item.zjh === "") {
        showAlert("请输入证件号码");
      } else if (!(item.zjh == undefined || item.zjh === null || item.zjh === "") && !$dictUtilsService.idcard(
          item.zjh) && item.zjzl.value == 1) {
        showAlert("请输入正确的证件号码");
      } else if (!(item.zjh == undefined || item.zjh === null || item.zjh === "") && !$dictUtilsService.gaIdcard(
          item.zjh) && item.zjzl.value == 2) {
        showAlert("请输入正确的港澳台证件号");
      } else if (!(item.zjh == undefined || item.zjh === null || item.zjh === "") && !$dictUtilsService.isPassPortCard(
          item.zjh) && item.zjzl.value == 3) {
        showAlert("请输入正确的护照号码");
      } else if (!(item.zjh == undefined || item.zjh === null || item.zjh === "") && !$dictUtilsService.isAccountCard(
          item.zjh) && item.zjzl.value == 4) {
        showAlert("请输入正确的户口簿号码");
      } else if (!(item.zjh == undefined || item.zjh === null || item.zjh === "") && !$dictUtilsService.isOfficerCard(
          item.zjh) && item.zjzl.value == 5) {
        showAlert("请输入正确的军官证号码");
      } else if (!(item.zjh == undefined || item.zjh === null || item.zjh === "") && !$dictUtilsService.orgcodevalidate(
          item.zjh) && item.zjzl.value == 6) {
        showAlert("请输入正确的组织机构代码");
      } else if (!(item.zjh == undefined || item.zjh === null || item.zjh === "") && !$dictUtilsService.checkLicense(
          item.zjh) && item.zjzl.value == 7) {
        showAlert("请输入正确的营业执照号码");
      } else if (item.phone == undefined || !$dictUtilsService.phone(item.phone)) {
        showAlert("请输入正确的联系电话");
      } else {
        item.isConfirm = true;
        showAlert("添加成功");
      }
    }

    //检查代理人信息填写是否完成
    $scope.verifyDlrInfo = function() {
      if ($scope.dlr.dlrlx == '-1') { //代理人类型为无
        $scope.ywr.dljg = null;
        $scope.ywr.dljgdh = null;
        $scope.ywr.dlrlx = null;
        $scope.ywr.dlrmc = null;
        $scope.ywr.dlrdh = null;
        $scope.ywr.dlrzjzl = null;
        $scope.ywr.dlrzjh = null;
      }
      if ($scope.dlr.dlrlx == '0') { //代理人类型为个人
        if ($scope.dlr.dlrmc == undefined || $scope.dlr.dlrmc == null || $scope.dlr.dlrmc == '') {
          showAlert("代理人名称未填写！");
          return false;
        }
        if ($scope.dlr.dlrdh == undefined || !$dictUtilsService.phone($scope.dlr.dlrdh)) {
          showAlert("请输入正确的代理人电话！");
          return false;
        }
        if ($scope.dlr.dlrzjh == undefined || $scope.dlr.dlrzjh === null || $scope.dlr.dlrzjh === "") {
          showAlert("请输入代理人证件号码");
          return false;
        }
        if (!$dictUtilsService.idcard($scope.dlr.dlrzjh)) {
          showAlert("请输入正确的代理人身份证号码");
          return false;
        }

        $scope.ywr.dljg = null;
        $scope.ywr.dljgdh = null;
        $scope.ywr.dlrlx = $scope.dlr.dlrlx;
        $scope.ywr.dlrmc = $scope.dlr.dlrmc;
        $scope.ywr.dlrdh = $scope.dlr.dlrdh;
        $scope.ywr.dlrzjzl = 1;
        $scope.ywr.dlrzjh = $scope.dlr.dlrzjh;
      }
      /*if ($scope.dlr.dlrlx == '1') { //代理人类型为组织
        if ($scope.dlr.dljg == undefined || $scope.dlr.dljg == null || $scope.dlr.dljg == '') {
          showAlert("代理人机构名称未填写！");
          return false;
        }
        if ($scope.dlr.dljgdh == undefined || $scope.dlr.dljgdh == null || $scope.dlr.dljgdh == '') {
          showAlert("代理人机构电话未填写！");
          return false;
        }
        if ($scope.dlr.dlrmc == undefined || $scope.dlr.dlrmc == null || $scope.dlr.dlrmc == '') {
          showAlert("代理人法人名称未填写！");
          return false;
        }
        if ($scope.dlr.dlrdh == undefined || !$dictUtilsService.phone($scope.dlr.dlrdh)) {
          showAlert("请输入正确的代理人法人电话！");
          return false;
        }
        if ($scope.dlr.dlrzjh == undefined || $scope.dlr.dlrzjh === null || $scope.dlr.dlrzjh === "") {
          showAlert("请输入代理人法人证件号码");
          return false;
        }
        if (!$dictUtilsService.idcard($scope.dlr.dlrzjh)) {
          showAlert("请输入正确的代理人法人身份证号码");
          return false;
        }

        $scope.ywr.dljg = $scope.dlr.dljg;
        $scope.ywr.dljgdh = $scope.dlr.dljgdh;
        $scope.ywr.dlrlx = $scope.dlr.dlrlx;
        $scope.ywr.dlrmc = $scope.dlr.dlrmc;
        $scope.ywr.dlrdh = $scope.dlr.dlrdh;
        $scope.ywr.dlrzjzl = 1;
        $scope.ywr.dlrzjh = $scope.dlr.dlrzjh;
      }*/

      return true;
    }

    //删除家庭成员
    $scope.deletefamily = function(index) {
      $scope.ywr.familyGroup.familyMemberList.splice(index, 1);
    }

    //添加或者更新是判断家庭成员是否都确认添加了，没有添加的删除掉
    function checkFamily() {
      var familyMemberSize = $scope.ywr.familyGroup.familyMemberList.length;
      if (familyMemberSize > 0) {
        for (var i = 0; i < familyMemberSize; i++) {
          if (!$scope.ywr.familyGroup.familyMemberList[i].isConfirm) {
            $scope.ywr.familyGroup.familyMemberList.splice(i, 1);
          }
        }
      }
    }

    $scope.familyRelationshipEnum = [{
      label: '本人',
      value: 'SELF'
    }, {
      label: '子女',
      value: 'CHILDREN'
    }, {
      label: '夫妻',
      value: 'SPOUSE'
    }]

    //添加义务人
    $scope.addywr1 = function() {
      $scope.ywr.ywh = $wysqService.djsqItemData.ywh[0];
      $scope.ywr.sfczr = 0; //是否持证人
      //如果是个人必须添加家庭组
      // if($scope.ywr.qlrlx == '1' && gyjsydsyqjfwsyq_zydj_flowCode == $wysqService.djsqItemData.netFlowdefCode){
      //     var hasfamily = false;
      //     if($scope.ywr.familyGroup != null && $scope.ywr.familyGroup.familyMemberList != null && $scope.ywr.familyGroup.familyMemberList.length>0){
      //       hasfamily = true;
      //     }
      //     if(!hasfamily){
      //       showAlert("请为当前人员添加家庭组");
      //       return;
      //     }
      // }
      if ($scope.ywrtitle == '卖方') {
        if ($scope.ywr.familyGroup.houseNumber == undefined || $scope.ywr.familyGroup.houseNumber === null ||
          $scope.ywr.familyGroup.houseNumber === "") {
          showAlert("请输入家庭房屋总套数");
          return;
        }
      }
      if (verifyYwData() && isNotDuplicate() && checkOwnedRegular()) {
        checkFamily();
        if (!$scope.verifyDlrInfo()) { //检查代理人信息，如果合法将代理人信息赋到义务人中提交
          return;
        }
        //给申请人赋值单元号
        if ($wysqService.djsqItemData &&
          $wysqService.djsqItemData.children &&
          $wysqService.djsqItemData.children[0] &&
          $wysqService.djsqItemData.children[0].qlxxExMhs &&
          $wysqService.djsqItemData.children[0].qlxxExMhs[0].bdcdyh) {
          $scope.ywr.bdcdyh = $wysqService.djsqItemData.children[0].qlxxExMhs[0].bdcdyh;
        }
        $wysqService.addywr($scope.ywr).then(function(res) {
          if (res.success) {
            showAlert("添加" + $scope.ywrtitle + "成功");
            console.log("res is " + JSON.stringify(res));
            $scope.addTzr();//添加通知人
          } else {
            showAlert(res.message);
          }
        }, function(res) {
          showAlert(res.message);
        });
      }
    }

    //更新义务人
    $scope.updataYwr = function() {
      $scope.ywr.sfczr = 0; //是否持证人
      //如果是个人必须添加家庭组
      // if($scope.ywr.qlrlx == '1' && gyjsydsyqjfwsyq_zydj_flowCode == $wysqService.djsqItemData.netFlowdefCode){
      //     var hasfamily = false;
      //     if($scope.ywr.familyGroup != null && $scope.ywr.familyGroup.familyMemberList != null && $scope.ywr.familyGroup.familyMemberList.length>0){
      //       hasfamily = true;
      //     }
      //     if(!hasfamily){
      //       showAlert("请为当前人员添加家庭组");
      //       return;
      //     }
      // }
      if ($scope.ywrtitle == '卖方') {
        if ($scope.ywr.familyGroup.houseNumber == undefined || $scope.ywr.familyGroup.houseNumber === null ||
          $scope.ywr.familyGroup.houseNumber === "") {
          showAlert("请输入家庭房屋总套数");
          return;
        }
      }
      if (verifyYwData() && isNotDuplicate() && checkOwnedRegular()) {
        checkFamily();
        if (!$scope.verifyDlrInfo()) { //检查代理人信息，如果合法将代理人信息赋到义务人中提交
          return;
        }
        $wysqService.updateYwr($scope.ywr).then(function(res) {
          if (res.success) {
            showAlert("更新" + $scope.ywrtitle + "成功");
            $scope.addTzr();//添加通知人
          } else {
            showAlert(res.message);
          }
        }, function(res) {
          showAlert(res.message);
        });
      }
    }
    //通知人集合
    var tzrxxes = angular.copy($wysqService.djsqItemData.children[0].tzrxxes);
    //添加通知人
    $scope.addTzr = function() {
      if (tzrxxes == null || tzrxxes == undefined || tzrxxes.length == 0) {
        tzrxxes = [];
        tzrxxes.push({
          index: tzrxxes.length,
          tzrmc: $scope.ywr.ywrmc,
          tzdh: $scope.ywr.dh,
          category: $scope.ywr.category
        });

      } else {
        var category = $scope.ywr.category;
        var existTzr = false; //遍历通知人集合,验证是否已经存在通知人
        for (var a = 0; a < tzrxxes.length; a++) {
          if (category == tzrxxes[a].category) {
            existTzr = true;
            //已经存在的通知人更新名称和电话,
            tzrxxes[a].tzrmc = $scope.ywr.ywrmc;
            tzrxxes[a].tzdh = $scope.ywr.dh;
          }
        }
        if (!existTzr) { //不存在category相同的通知人时则新增一个
          tzrxxes.push({
            index: tzrxxes.length,
            tzrmc: $scope.ywr.ywrmc,
            tzdh: $scope.ywr.dh,
            category: $scope.ywr.category
          });
        }
      }
      var param = {
        qlxxChildDtoList: [{
          tzrxxes: tzrxxes,
          ywh: $wysqService.djsqItemData.ywh[0]
        }],
        wwywh: $wysqService.djsqItemData.wwywh
      }
      $wysqService.addbdcxx(param).then(function(res) {
        $ionicHistory.goBack();
      }, function(res) {
        console.log(JSON.stringify(res))
        showAlert(res.message);
      });
    }

    //返回上一页
    $scope.goback = function() {
      $ionicHistory.goBack();
    }
  }
]);
