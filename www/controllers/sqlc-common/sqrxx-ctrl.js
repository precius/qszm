angular.module('sqrxxCtrl', []).controller('sqrxxCtrl', ["$scope", "ionicToast", "$state", "$ionicHistory",
  "$wysqService", "$ionicPopup", "$ionicLoading", "$dictUtilsService", "$ionicActionSheet",
  function($scope, ionicToast, $state, $ionicHistory, $wysqService, $ionicPopup, $ionicLoading, $dictUtilsService,
    $ionicActionSheet, ) {
    $scope.showEditInfo = function() {
      if ($wysqService.djsqItemData.step == "NETAPPLYING" || $wysqService.djsqItemData.step == "NETNOPASS") {
        $scope.isShow = true;
      } else {
        $scope.isShow = false;
      }
    }
    //是否显示下一步 以及流程进度条
    $scope.showNextStep = $wysqService.stepByStep;
    //如果强制中断了不显示下一步,那就不再显示下一步
    if ($wysqService.interruptNextStep) {
      $scope.showNextStep = false;
    }

    //第一步信息(申请人信息)是否完成
    $scope.stepOneFinished = $wysqService.stepInfo.one;
    //第二步信息(不动产信息)是否完成
    $scope.stepTwoFinished = $wysqService.stepInfo.two;
    //第三步步信息(附件信息)是否完成
    $scope.stepThreeFinished = $wysqService.stepInfo.three;
    //第四步 提交申请是否完成
    $scope.stepFourFinished = $wysqService.stepInfo.four;

    $scope.showEditInfo();
    $scope.qlxx = {};
    $scope.qlrlist = [];
    $scope.ywrlist = [];

    //通过业务号获取业务信息，只需要接收wwywh即可
    $scope.getqlxx = function() {
      if ($wysqService.djsqItemData.wwywh != null) {
        $wysqService.queryApplyByYwh({
            wwywh: $wysqService.djsqItemData.wwywh
          })
          .then(function(res) {
            if (res.success) {
              //获取权利信息
              $scope.qlxx = res.data;
              $wysqService.djsqItemData = res.data;

              //获取权利人列表
              // $scope.qlrlist = res.data.qlr;
              $scope.qlrlist = res.data.children[0].qlrs;
              //获取业务人员列表
              $scope.ywrlist = res.data.children[0].ywrs;
              console.log("$scope.ywrlist is " + JSON.stringify($scope.ywrlist));
              //清空在抵押人和债务人集合
              $scope.dyrList = [];
              $scope.zwrList = [];
              //初始化tab信息
              $scope.initInfo();
              //获取办事大厅
              $scope.bsdtmc = res.data.bsdtmc;
            } else {
              $scope.showAlert('获取申请信息失败');
            }
          }, function(res) {
            $scope.showAlert('获取申请信息失败');
          });
      }

    }
    $scope.getqlxx();
    $scope.sqrTitle = [{
      name: '',
      value: '0',
      showTab: true //是否显示权利人Tab
    }, {
      name: '',
      value: '1',
      showTab: true //是否显示义务人Tab
    }, {
      name: '',
      value: '2',
      showTab: false //是否显示抵押人Tab
    }, {
      name: '',
      value: '3',
      showTab: false //是否显示债务人Tab
    }]

    $scope.initInfo = function() {
      $scope.showEditInfo();
      if (gyjsydsyqjfwsyq_zydj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //过户
        $scope.sqrTitle[0].name = "买方";
        $wysqService.qlrPageTitle = "买方";
        $scope.sqrTitle[1].name = "卖方";
        $wysqService.ywrPageTitle = "卖方";
        $scope.sqrTitle[0].showTab = true;
        $scope.sqrTitle[1].showTab = true;

      } else if (gyjsydsyqjfwsyq_bgdj_flowCode == $wysqService.djsqItemData.netFlowdefCode ||
        gyjsydsyq_bgdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //变更
        $wysqService.qlrPageTitle = "权利人";
        $wysqService.ywrPageTitle = "义务人";
        $scope.sqrTitle[0].name = "权利人";
        $scope.sqrTitle[1].name = "义务人";
        $scope.sqrTitle[0].showTab = true;
        $scope.sqrTitle[1].showTab = true;

      } else if (gyjsydsyqjfwsyq_bzdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //补证登记
        $wysqService.qlrPageTitle = "权利人";
        $scope.sqrTitle[0].name = "权利人";
        $scope.sqrTitle[0].showTab = true;
        $scope.sqrTitle[1].showTab = false;
      }
      //异议登记-异议设立登记
      else if (gyjsydsyqjfwsyq_yysldj_flowCode == $wysqService.djsqItemData.netFlowdefCode) {
        $wysqService.qlrPageTitle = "异议申请人";
        $wysqService.ywrPageTitle = "所有权人";
        $scope.sqrTitle[0].name = "异议申请人";
        $scope.sqrTitle[1].name = "所有权人";
        $scope.sqrTitle[0].showTab = true;
        $scope.sqrTitle[1].showTab = true;
      }
      //异议登记-异议注销登记
      else if (gyjsydsyqjfwsyq_yyzxdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) {
        $wysqService.qlrPageTitle = "异议申请人";
        $wysqService.ywrPageTitle = "所有权人";
        $scope.sqrTitle[0].name = "异议申请人";
        $scope.sqrTitle[1].name = "所有权人";
        $scope.sqrTitle[0].showTab = true;
        $scope.sqrTitle[1].showTab = true;
      } else if (gyjsydsyqjfwsyq_hzdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //换证登记
        $wysqService.qlrPageTitle = "权利人";
        $scope.sqrTitle[0].name = "权利人";
        $scope.sqrTitle[0].showTab = true;
        $scope.sqrTitle[1].showTab = false;
      } else if (gyjsydsyqjfwsyq_zxdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //所有权注销登记
        $wysqService.qlrPageTitle = "权利人";
        $scope.sqrTitle[0].name = "权利人";
        $scope.sqrTitle[0].showTab = true;
        $scope.sqrTitle[1].showTab = false;
      } else if (ygdj_ysspfmmygzxdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //预买卖预告注销
        $scope.sqrTitle[0].name = "预告权利人";
        $scope.sqrTitle[1].name = "预告义务人";
        $scope.sqrTitle[0].showTab = true;
        $scope.sqrTitle[1].showTab = true;
      } else if (dyqdj_zxdj_flowCode == $wysqService.djsqItemData.netFlowdefCode ||//抵押注销
        ygdj_ysspfdyqygzxdj_flowCode == $wysqService.djsqItemData.netFlowdefCode ||//预抵押注销
        dyqdj_scdj_flowCode == $wysqService.djsqItemData.netFlowdefCode ||//抵押首次
        dyqdj_bgdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //抵押权变更
        $wysqService.qlrPageTitle = "抵押权人";
        $scope.sqrTitle[0].name = "抵押权人";
        $scope.sqrTitle[0].showTab = true;

        $scope.sqrTitle[1].showTab = false;

        $scope.sqrTitle[2].name = '抵押人';
        $scope.sqrTitle[2].showTab = true;
        $scope.sqrTitle[3].name = '债务人';
        $scope.sqrTitle[3].showTab = true;
        $scope.separateYwr() //将义务人区分为抵押人和债务人

      } else if (ygdj_ysspfdyqygdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //房屋_预告登记_预售商品房抵押权预告登记
        $wysqService.qlrPageTitle = "抵押权人";
        $scope.sqrTitle[0].name = "预告抵押权人(银行)";
        $scope.sqrTitle[0].showTab = true;

        $scope.sqrTitle[1].showTab = false;

        $scope.sqrTitle[2].name = '预告抵押人(购房者)';
        $scope.sqrTitle[2].showTab = true;
        $scope.sqrTitle[3].name = '预告债务人(借款者)';
        $scope.sqrTitle[3].showTab = true;
        $scope.separateYwr() //将义务人区分为抵押人和债务人
      }else{
       $scope.showAlert('公众号中暂不支持此类型业务办理!');
     }
    }

    // 当申请类型是  抵押或抵押权注销 时，义务人 分成 抵押人和债务人
    $scope.dyrList = [];
    $scope.zwrList = [];
    $scope.separateYwr = function() {
      console.log($scope.ywrlist)
      if ($scope.ywrlist != null && $scope.ywrlist.length > 0) {
        for (var i = 0; i < $scope.ywrlist.length; i++) {
          var ywr = $scope.ywrlist[i];
          if (ywr.category == 5 || ywr.category == 10) {
            $scope.dyrList[$scope.dyrList.length] = ywr;
          }
          if (ywr.category == 6 || ywr.category == 11) {
            $scope.zwrList[$scope.zwrList.length] = ywr;
          }
        }

      }
    }

    $scope.bdcxx = {};

    $scope.show = function(title) {
      $ionicLoading.show({
        //template: '上传中...'
        template: '<ion-spinner icon="lines" class="spinner-calm"></ion-spinner><p>' + title + '</p>'
      });
    };
    $scope.hide = function() {
      $ionicLoading.hide();
    };
    //删除权利人对话框
    $scope.delParam = {};
    $scope.delQlrDialog = function(item) {
      console.log(item);
      $scope.delParam = {
        id: item.id
      };
      $scope.showConfirm("提示", "确认", "取消", "确认要删除该权利人吗?", true);
    }
    //删除义务人对话框
    $scope.delParam = {};
    $scope.delYwrDialog = function(item) {
      console.log(item);
      $scope.delParam = {
        id: item.id
      };
      //在服务端，抵押人和债务人都属于 义务人
      if (item.category == 5) {
        $scope.showConfirm("提示", "确认", "取消", "确认要删除该抵押人吗?", false);
      } else if (item.category == 6) {
        $scope.showConfirm("提示", "确认", "取消", "确认要删除该债务人吗?", false);
      } else {
        $scope.showConfirm("提示", "确认", "取消", "确认要删除该义务人吗?", false);
      }

    }
    //删除权利人
    $scope.delQlr = function() {
      $wysqService.delQlr($scope.delParam)
        .then(function(res) {
          if (res.success) {
            console.log("删除权利人成功");
          }
          //				$scope.recordqlr();
          $scope.getqlxx();
        }, function(res) {
          console.log(res.message);
          console.log("删除失败");
        });
    }

    //删除义务人
    $scope.delYwr = function() {
      $wysqService.delYwr($scope.delParam)
        .then(function(res) {
          if (res.success) {
            console.log("删除义务人成功");
            //					$scope.recordywr();
            $scope.getqlxx();
          }
        }, function(res) {
          console.log(res.message);
          console.log("删除失败");
        });
    }
    //删除权利人/义务人信息对话框
    $scope.showConfirm = function(titel, okText, cancelText, contentText, isQlr) {
      var confirmPopup = $ionicPopup.confirm({
        title: titel,
        okText: okText,
        cancelText: cancelText,
        content: contentText
      });
      confirmPopup.then(function(res) {
        if (res) {
          if (isQlr) {
            $scope.delQlr(); //删除权利人信息
          } else {
            $scope.delYwr(); //删除义务人信息
          }
        } else {

        }
      });
    };
    //返回上一个页面
    $scope.goback = function() {
      // $wysqService.judgeApplicantFinished($scope); //判断申请人信息是否完善
      $ionicHistory.goBack();
    };

    //跳转到编辑权利人页面
    $scope.updataQlr = function(qlrId) {
      $wysqService.qlrlist = $scope.qlrlist;
      $wysqService.ywrlist = $scope.ywrlist;
      $wysqService.dyrlist = null;
      $wysqService.zwrlist = null;
      var num = 0; //按份共有的权利比例和
      $wysqService.num = 0;
      for (var i = 0; i < $scope.qlrlist.length; i++) {
        if ($scope.qlrlist[i].gyqk == "按份共有" && $scope.qlrlist[i].id != qlrId) {
          num += parseFloat($scope.qlrlist[i].qlbl);
        }

      }
      $wysqService.num = num;

      $state.go('sqrxxQlrxxEdit', {
        'id': qlrId
      }, {
        reload: true
      });
    };
    //跳转到编辑义务人页面
    $scope.updataYwr = function(ywrId) {
      $wysqService.qlrlist = $scope.qlrlist;
      $wysqService.ywrlist = $scope.ywrlist;
      $wysqService.dyrlist = null;
      $wysqService.zwrlist = null;

      var num = 0; //按份共有的权利比例和
      $wysqService.num = 0;
      for (var i = 0; i < $scope.ywrlist.length; i++) {
        if ($scope.ywrlist[i].gyqk == "按份共有" && $scope.ywrlist[i].id != ywrId) {
          num += parseFloat($scope.ywrlist[i].qlbl);
        }

      }
      $wysqService.num = num;
      $state.go('sqrxxYwrxxEdit', {
        'id': ywrId
      }, {
        reload: true
      });
    };
    //跳转到编辑抵押人页面
    $scope.updataDyr = function(ywrId) {
      $wysqService.qlrlist = $scope.qlrlist;
      $wysqService.ywrlist = null;
      $wysqService.dyrlist = $scope.dyrList;
      $wysqService.zwrlist = null;

      var num = 0; //按份共有的权利比例和
      $wysqService.num = 0;
      if ($scope.dyrList != null) {
        for (var i = 0; i < $scope.dyrList.length; i++) {
          if ($scope.dyrList[i].gyqk == "按份共有" && $scope.dyrList[i].id != ywrId) {
            num += parseFloat($scope.dyrList[i].qlbl);
          }

        }
      }
      $wysqService.num = num;
      $wysqService.ywrPageTitle = "抵押人";
      $state.go('sqrxxYwrxxEdit', {
        'id': ywrId
      }, {
        reload: true
      });
    };
    //跳转到编辑债务人页面
    $scope.updataZwr = function(ywrId) {
      $wysqService.qlrlist = $scope.qlrlist;
      $wysqService.ywrlist = null;
      $wysqService.dyrlist = null;
      $wysqService.zwrlist = $scope.zwrList;

      var num = 0; //按份共有的权利比例和
      $wysqService.num = 0;
      if ($scope.zwrList != null) {
        for (var i = 0; i < $scope.zwrList.length; i++) {
          if ($scope.zwrList[i].gyqk == "按份共有" && $scope.zwrList[i].id != ywrId) {
            num += parseFloat($scope.zwrList[i].qlbl);
          }

        }
      }
      $wysqService.num = num;
      $wysqService.ywrPageTitle = "债务人";
      $state.go('sqrxxYwrxxEdit', {
        'id': ywrId
      }, {
        reload: true
      });
    };
    //跳转到添加权利人页面
    $scope.addqlr = function() {
      $wysqService.qlrlist = $scope.qlrlist;
      $wysqService.ywrlist = $scope.ywrlist;
      $wysqService.dyrlist = null;
      $wysqService.zwrlist = null;
      var num = 0; //按份共有的权利比例和
      $wysqService.num = 0;
      if ($scope.qlrlist) {
        if ((dyqdj_scdj_flowCode == $wysqService.djsqItemData.netFlowdefCode || //房屋_抵押权登记首次/注销/变更登记跳转
            dyqdj_bgdj_flowCode == $wysqService.djsqItemData.netFlowdefCode ||
            dyqdj_zxdj_flowCode == $wysqService.djsqItemData.netFlowdefCode ||
            ygdj_ysspfdyqygdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) &&
          $scope.qlrlist.length > 0) {
          $scope.showAlert('已添加抵押权人,不能再添加！');
          return;
        }
        for (var i = 0; i < $scope.qlrlist.length; i++) {
          if ($scope.qlrlist[i].gyqk === "单独所有") {
            $scope.showAlert('单独所有只能添加一个人！');
            return;
          }
          if ($scope.qlrlist[i].gyqk === "按份共有") {
            num += parseFloat($scope.qlrlist[i].qlbl);
            if (num >= 100) {
              $scope.showAlert('总比例已经达到100，不可再添加！');
              return;
            }
          }

        }
        $wysqService.num = num;
        $state.go('sqrxxQlrxxAdd');
      } else {

        $state.go('sqrxxQlrxxAdd');
      }
    }
    //跳转到添加义务人页面
    $scope.addywr = function() {
      $wysqService.qlrlist = $scope.qlrlist;
      $wysqService.ywrlist = $scope.ywrlist;
      $wysqService.dyrlist = null;
      $wysqService.zwrlist = null;
      var num = 0; //按份共有的权利比例和
      $wysqService.num = 0;
      if ($scope.ywrlist) {
        for (var i = 0; i < $scope.ywrlist.length; i++) {
          if ($scope.ywrlist[i].gyqk === "单独所有") {
            $scope.showAlert('单独所有只能添加一个人！');
            return;
          }
          if ($scope.ywrlist[i].gyqk === "按份共有") {
            num += parseFloat($scope.ywrlist[i].qlbl);
            if (num >= 100) {
              $scope.showAlert('总比例已经达到100，不可再添加！');
              return;
            }
          }

        }
        $wysqService.num = num;
        $state.go('sqrxxYwrxxAdd');
      } else {

        $state.go('sqrxxYwrxxAdd');
      }
    };

    //添加抵押人
    $scope.addDyr = function() {
      $wysqService.qlrlist = $scope.qlrlist;
      $wysqService.ywrlist = null;
      $wysqService.dyrlist = $scope.dyrList;
      $wysqService.zwrlist = null;

      var num = 0; //按份共有的权利比例和
      $wysqService.num = 0;
      if ($scope.dyrList) {
        for (var i = 0; i < $scope.dyrList.length; i++) {
          if ($scope.dyrList[i].gyqk === "单独所有") {
            $scope.showAlert('单独所有只能添加一个人！');
            return;
          }
          if ($scope.dyrList[i].gyqk === "按份共有") {
            num += parseFloat($scope.dyrList[i].qlbl);
            if (num >= 100) {
              $scope.showAlert('总比例已经达到100，不可再添加！');
              return;
            }
          }

        }
        $wysqService.num = num;
        $wysqService.ywrPageTitle = "抵押人";
        $state.go('sqrxxYwrxxAdd');
      } else {
        $wysqService.ywrPageTitle = "抵押人";
        $state.go('sqrxxYwrxxAdd');
      }
    };

    //添加债务人
    $scope.addZwr = function() {
      $wysqService.qlrlist = $scope.qlrlist;
      $wysqService.ywrlist = null;
      $wysqService.dyrlist = null;
      $wysqService.zwrlist = $scope.zwrList;
      var num = 0; //按份共有的权利比例和
      $wysqService.num = 0;
      if ($scope.zwrList) {
        for (var i = 0; i < $scope.zwrList.length; i++) {
          if ($scope.zwrList[i].gyqk === "单独借款") {
            $scope.showAlert('单独借款只能添加一个人！');
            return;
          }
          /*if($scope.zwrList[i].gyqk === "按份共有") {
						num += parseFloat($scope.zwrList[i].qlbl);
						if(num >= 100) {
							$scope.showAlert('总比例已经达到100，不可再添加！');
							return;
						}
					}
*/
        }
        $wysqService.num = num;
        $wysqService.ywrPageTitle = "债务人";
        $state.go('sqrxxYwrxxAdd');
      } else {
        $wysqService.ywrPageTitle = "债务人";
        $state.go('sqrxxYwrxxAdd');
      }

    };

    //提示框
    $scope.showAlert = function(msg) {
      ionicToast.show(msg, 'middle', false, 2000);
    };
    //加载框
    show = function() {
      $ionicLoading.show({
        template: '加载中...'
      });
    };
    //隐藏加载框
    hide = function() {
      $ionicLoading.hide();
    };
    //下一步
    $scope.nextStep = function() {
      if (!$wysqService.judgeApplicantFinished($scope)) {
        return;
      }
      if (gyjsydsyqjfwsyq_zydj_flowCode == $wysqService.djsqItemData.netFlowdefCode || //转移
        gyjsydsyqjfwsyq_yysldj_flowCode == $wysqService.djsqItemData.netFlowdefCode || //异议
        gyjsydsyqjfwsyq_zxdj_flowCode == $wysqService.djsqItemData.netFlowdefCode || //注销
        gyjsydsyqjfwsyq_bgdj_flowCode == $wysqService.djsqItemData.netFlowdefCode || //变更
        gyjsydsyqjfwsyq_gzdj_flowCode == $wysqService.djsqItemData.netFlowdefCode || //更正
        gyjsydsyqjfwsyq_bzdj_flowCode == $wysqService.djsqItemData.netFlowdefCode || //补正
        gyjsydsyqjfwsyq_hzdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //换证
        $scope.refreshBeforeNextStep();
        $state.go("bdcxx", {
          "ywh": $wysqService.djsqItemData.ywh
        }, {
          reload: true
        });
      } else if (dyqdj_zxdj_flowCode == $wysqService.djsqItemData.netFlowdefCode ||
        dyqdj_scdj_flowCode == $wysqService.djsqItemData.netFlowdefCode ||
        dyqdj_bgdj_flowCode == $wysqService.djsqItemData.netFlowdefCode||
        ygdj_ysspfdyqygdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //抵押登记//抵押权注销//抵押权变更//预售商品房抵押权预告

        $scope.refreshBeforeNextStep();
        $state.go("bdcxx_dyqdj_scdj", {
          "ywh": $wysqService.djsqItemData.ywh
        }, {
          reload: true
        });
      }else{
       $scope.showAlert('公众号中暂不支持此类型业务办理!');
     }
    }
    //跳转到不动产信息需要设置参数值
    $scope.refreshBeforeNextStep = function() {
      //清空列表编辑信息
      $wysqService.bdcxxData = {};
      $wysqService.stepInfo.one = true;
    };

    $scope.goYgqkPage = function() {
      //清空列表编辑信息
      $wysqService.bdcxxData = {};
      //显示下一步按钮
      $wysqService.bdcxxNext = true;
      //编辑按钮不显示
      $wysqService.bdcxxMod = false;
    };
  }
]);
