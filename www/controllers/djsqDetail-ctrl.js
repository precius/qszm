//我的申请列表申请控制器
angular.module('djsqDetailCtrl', []).controller('djsqDetailCtrl', ["$scope", "ionicToast", "$state", "$ionicPopup",
  "$ionicHistory", "$wysqService", "$dictUtilsService", "$menuService", "$fjxzUtilsService",
  function($scope, ionicToast, $state, $ionicPopup, $ionicHistory, $wysqService, $dictUtilsService, $menuService,
    $fjxzUtilsService) {
    $scope.goback = function() {
      $ionicHistory.goBack(); //返回上一个页面
    };
    //是否显示申请信息菜单（包含申请人、不动产信息、附件材料）
    $scope.showMenuInfo = false;
    var formJsonArray = formJson;
    if(formJsonArray != null && formJsonArray.length>0){
       for(var i = 0;i<formJsonArray.length;i++){
          var flowData = formJsonArray[i];
          if($wysqService.djsqItemData.netFlowdefCode == flowData.code){
            $scope.showMenuInfo = true;
            break;
          }
       }
    }
    // $wysqService.pageStack.splice(0,$wysqService.pageStack.length)//申请流程页面栈清空;
    //单条申请信息
    $scope.sqxx = $wysqService.djsqItemData;
    //是否显示下一步 以及流程进度条
    $scope.showNextStep = $wysqService.stepByStep;
    $wysqService.interruptNextStep = false; //不强制中断显示下一步
    //显示对应的信息操作按钮
    if ($wysqService.djsqItemData.step == "NETAPPLYING" || $wysqService.djsqItemData.step == "NETNOPASS" ||
      $wysqService.djsqItemData.step == "REJECT") {
      $scope.showDelete = true;//显示删除申请按钮
      $scope.showSubmit = true;//显示提交申请按钮
    } else {
      $scope.showDelete = false;
      $scope.showSubmit = false;
    };
    if ($wysqService.djsqItemData.step == "NETCHECKING" ) {
      $scope.showCancel = true;//显示取消申请按钮
    } else {
      $scope.showCancel = false;//
    };
    $scope.isMainApplicant = $wysqService.isMainApplicant; //是否是申请发起人
    //第一步信息(申请人信息)是否完成
    $scope.stepOneFinished = $wysqService.stepInfo.one;
    //第二步信息(不动产信息)是否完成
    $scope.stepTwoFinished = $wysqService.stepInfo.two;
    //第三步步信息(附件信息)是否完成
    $scope.stepThreeFinished = $wysqService.stepInfo.three;
    //第四步 提交申请是否完成
    $scope.stepFourFinished = $wysqService.stepInfo.four;

    //删除业务信息按钮
    $scope.delete = function() {
      showConfirm("提示", "确认", "取消", "确认要删除该条业务信息吗?", true);
      $scope.delParam = {
        wwywh: $scope.sqxx.wwywh
      };
    }
    //撤销业务按钮
    $scope.cancel = function() {
      showConfirm("提示", "确认", "取消", "确认要撤销该条业务信息吗?", false);
      $scope.revertParam = {
        id: $scope.sqxx.id
      };
    }

    //删除业务信息对话框
    showConfirm = function(titel, okText, cancelText, contentText, isDel) {
      var confirmPopup = $ionicPopup.confirm({
        title: titel,
        okText: okText,
        cancelText: cancelText,
        content: contentText
      });
      confirmPopup.then(function(res) {
        if (res) {
          if (isDel) { //删除业务数据
            //删除业务信息发送请求
            $wysqService.deleteApplyByYwh($scope.delParam)
              .then(function(res) {
                if (res.success) {
                  $scope.showAlert("删除业务信息成功");
                  //queryDjsqData();
                  $ionicHistory.goBack(); //返回上一个页面
                }
              }, function(error) {
                $scope.showAlert("删除业务信息失败");
              });
          } else { //取消业务数据
            $wysqService.revertApplyById($scope.revertParam)
              .then(function(res) {
                if (res.success) {
                  $scope.showAlert("撤销业务信息成功");
                  //queryDjsqData();
                  $ionicHistory.goBack(); //返回上一个页面
                }
              }, function(error) {
                $scope.showAlert("撤销业务信息失败");
              });
          }
        }
      });
    };

    //所有人员认证状态信息
    $scope.verifiedList = []; //所有申请人集合
    $scope.getVerifiedList = function() {
      $scope.verifiedList = $wysqService.getVerifiedList();
    }
    $scope.getVerifiedList();

    if ($wysqService.getMineYwInfo() != null && $wysqService.getMineYwInfo().identityVerified) {
      $scope.identityVerified = true; //询问笔录和视频认证已完成
    } else {
      $scope.identityVerified = false; //询问笔录和视频认证未完成
    };
    //刷新所有人员认证状态信息
    $scope.refreshApplicant = function() {

      $wysqService.queryApplyByYwh({
          wwywh: $wysqService.djsqItemData.wwywh
        })
        .then(function(res) {
            if (res.success) {
              $wysqService.djsqItemData = res.data;
              $scope.getVerifiedList();
              $scope.showAlert('刷新认证信息成功');
            }
          },
          function(Error) {
            $scope.showAlert('刷新认证信息失败');
          });
    }


    //申请人信息
    $scope.applicant = function() {
      $wysqService.interruptNextStep = true; //强制中断显示下一步
      $state.go("sqrxx");
    }

    //不动产信息
    $scope.bdcxx = function() {
     $wysqService.interruptNextStep = true; //强制中断显示下一步
     if (gyjsydsyqjfwsyq_zydj_flowCode == $wysqService.djsqItemData.netFlowdefCode || //转移
       gyjsydsyqjfwsyq_yysldj_flowCode == $wysqService.djsqItemData.netFlowdefCode || //异议
       gyjsydsyqjfwsyq_zxdj_flowCode == $wysqService.djsqItemData.netFlowdefCode || //注销
       gyjsydsyqjfwsyq_bgdj_flowCode == $wysqService.djsqItemData.netFlowdefCode || //变更
       gyjsydsyqjfwsyq_gzdj_flowCode == $wysqService.djsqItemData.netFlowdefCode || //更正
       gyjsydsyqjfwsyq_bzdj_flowCode == $wysqService.djsqItemData.netFlowdefCode || //补正
       gyjsydsyqjfwsyq_hzdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //换证
       $state.go("bdcxx", {
         "ywh": $wysqService.djsqItemData.ywh
       });
     } else if (dyqdj_zxdj_flowCode == $wysqService.djsqItemData.netFlowdefCode ||
       dyqdj_scdj_flowCode == $wysqService.djsqItemData.netFlowdefCode ||
       dyqdj_bgdj_flowCode == $wysqService.djsqItemData.netFlowdefCode||
       ygdj_ysspfdyqygdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //抵押登记//抵押权注销//抵押权变更//预审商品房抵押权预告
       $state.go("bdcxx_dyqdj_scdj", {
         "ywh": $wysqService.djsqItemData.ywh
       });
     }else{
       $scope.showAlert('公众号中暂不支持此类型业务办理!');
     }

    }

    //附件材料
    $scope.fjcl = function() {
      if (!$wysqService.judgeApplicantFinished($scope)) { //申请人信息不完善,或者申请人共有方式不合理
        return;
      }
      var mineYwInfo = $wysqService.getMineYwInfo();
      if (mineYwInfo == null) {
        $scope.showAlert('请先添加自己为权利人或义务人'); //防止主申请人不添加自己为申请人(权利人或义务人)
        return;
      }
      //$wysqService.interruptNextStep = true;//强制中断显示下一步
      $state.go('fjxz', {
        subFlowcode: $wysqService.djsqItemData.subFlowcode,
        id: $wysqService.djsqItemData.id
      }, {
        reload: true
      });
    }

    //询问笔录
    $scope.askPaper = function() {
      var mineYwInfo = $wysqService.getMineYwInfo();
      if (mineYwInfo == null) {
        $scope.showAlert('您不是该笔业务中的权利人或者义务人,不能代替别人申请和验证!');
      } else if (mineYwInfo.xwbl && mineYwInfo.sfsprz) {
        $scope.showAlert('您已经完成认证!');
      } else {
        //跳转到询问笔录界面
        $state.go('xwbl')
      }
    };
    //录制视频上传认证
    $scope.videoConfirm = function() {
      var mineYwInfo = $wysqService.getMineYwInfo();
      if (mineYwInfo == null) {
        $scope.showAlert('您不是该笔业务中的权利人或者义务人,不能代替别人申请和验证!');
      }
      /* else if (mineYwInfo.sfsprz) {
             $scope.showAlert('您已经提交过视频认证!');
           } */
      else {
        $state.go('recordVideo');
      }

    }
    //办理状态
    var blztKeyStr = "办理状态";
    $scope.blztData = $dictUtilsService.getBlzt().childrens;
    getBlztLabel = function(step) {
      var blztLabel = "";
      if ($scope.blztData != null && $scope.blztData.length > 0) {
        for (var i = 0; i < $scope.blztData.length; i++) {
          var blzt = $scope.blztData[i];
          if (blzt.value == step) {
            blztLabel = blzt.label;
            break;
          }
        }
      }
      return blztLabel;
    }
    $scope.sqxx.status = getBlztLabel($wysqService.djsqItemData.step);

    //申请人信息
    /* $scope.applicant = function () {
       if (ygdj_ysspfdyqygzxdj_flowCode == $wysqService.djsqItemData.netFlowdefCode
         ||$wysqService.djsqItemData.netFlowdefCode == zxgcdyzx_zydj_flowCode
         ||$wysqService.djsqItemData.netFlowdefCode == window.dyqdj_zxdj_flowCode) {
         $state.go("sqrxxYdyzx",{}, {
           reload: true
         });
       } else if(ygdj_ysspfmmygzxdj_flowCode == $wysqService.djsqItemData.netFlowdefCode){
         $state.go("sqrxxYmmygzx", {jsonObj:$wysqService.wdsqData}, {
           reload: true
         });
       }
       else if(ygdy_flowcode == $wysqService.djsqItemData.netFlowdefCode){
       	$state.go("sqrxx-list-ygdy");
       }
       else if(zydy_flowcode == $wysqService.djsqItemData.netFlowdefCode){
       	$state.go("sqrxx-list-zydy");
       }
       else if(bgzy_flowcode == $wysqService.djsqItemData.netFlowdefCode){
       	$state.go("sqrxx-list-bgzy");
       }
       else if(mmyg_flowcode == $wysqService.djsqItemData.netFlowdefCode){
       	$state.go("sqrxx-list-mmyg");
       }
       else if (gyjsydsyqjfwsyq_gzdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) {
         $state.go('sqrxx-gzdj');
       }
       else if(bz_flowcode == $wysqService.djsqItemData.netFlowdefCode
       	||hz_flowcode == $wysqService.djsqItemData.netFlowdefCode){
       	$state.go("sqrxx-list-hzbz");
       }
       else {
         $state.go("sqrxx", {}, {
           reload: true
         });
       }
     } */

    //不动产信息
    /*    $scope.bdcxx = function () {
          if (gyjsydsyqjfwsyq_zydj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //过户
            $state.go("bdcxx", {
              "ywh": $wysqService.djsqItemData.wwywh
            }, {
              reload: true
            });
          } else if (gyjsydsyqjfwsyq_bgdj_flowCode == $wysqService.djsqItemData.netFlowdefCode ||
            gyjsydsyq_bgdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) {
            $state.go("bdcxx", {
              "ywh": $wysqService.djsqItemData.wwywh
            }, {
              reload: true
            });
          } else if ("N400104" == $wysqService.djsqItemData.netFlowdefCode) { //注销
            $state.go("bdcxx", {
              "ywh": $wysqService.djsqItemData.wwywh
            }, {
              reload: true
            });
          } else if (dyqdj_scdj_flowCode == $wysqService.djsqItemData.netFlowdefCode || dyqdj_zxdj_flowCode ==
            $wysqService.djsqItemData.netFlowdefCode) { //抵押和抵押权注销
            $state.go("bdcxx_dyqdj_scdj", {
              "ywh": $wysqService.djsqItemData.wwywh
            }, {
              reload: true
            });
          }else if (ygdj_ysspfdyqygzxdj_flowCode == $wysqService.djsqItemData.netFlowdefCode
            || $wysqService.djsqItemData.netFlowdefCode == zxgcdyzx_zydj_flowCode
            || $wysqService.djsqItemData.netFlowdefCode == window.dyqdj_zxdj_flowCode) {
            $state.go("bdcxx_ydyzx", {}, {
              reload: true
            });
          } else if(ygdj_ysspfmmygzxdj_flowCode == $wysqService.djsqItemData.netFlowdefCode){
            $state.go("bdcxx_ymmygzx", {}, {
              reload: true
            });
          }else if (ygdy_flowcode == $wysqService.djsqItemData.netFlowdefCode){
          	$state.go('bdcxxYgdy',{'ywh':$wysqService.djsqItemData.wwywh},{reload:true});
          }
          else if (zydy_flowcode == $wysqService.djsqItemData.netFlowdefCode){
          	$state.go('bdcxxZydy',{'ywh':$wysqService.djsqItemData.wwywh},{reload:true});
          }
          else if (bgzy_flowcode == $wysqService.djsqItemData.netFlowdefCode){
          	$state.go('bdcxxBgzy',{'ywh':$wysqService.djsqItemData.wwywh},{reload:true});
          }
          else if (mmyg_flowcode == $wysqService.djsqItemData.netFlowdefCode){
          	$state.go('bdcxxMmyg',{'ywh':$wysqService.djsqItemData.wwywh},{reload:true});
          }
          else if (bz_flowcode == $wysqService.djsqItemData.netFlowdefCode
          	||hz_flowcode == $wysqService.djsqItemData.netFlowdefCode){
          	$state.go('bdcxxHzbz',{'ywh':$wysqService.djsqItemData.wwywh},{reload:true});
          }else if ( gyjsydsyqjfwsyq_gzdj_flowCode == $wysqService.djsqItemData.netFlowdefCode ||
            gyjsydsyq_bgdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) {
            $state.go("bdcxx", {
              "ywh": $wysqService.djsqItemData.wwywh
            }, {
              reload: true
            });
          }
        } */

    //是否显示预审信息item
    $scope.isShow = false;
    if ($wysqService.djsqItemData.step != "NETAPPLYING") {
      $scope.isShow = true;
    }
    //点击预审信息显示预审信息
    $scope.showYsxx = function() {
      $state.go("ysxx", {
        "ywh": $wysqService.djsqItemData.wwywh
      }, {
        reload: true
      });
    }

    // 以下代码用来判断附件上传信息是否完整
    //根据子流程代码获取附件类型列表
    $scope.getFjlist = function() {
      $wysqService.getfjlxlist({
          subCode: $wysqService.djsqItemData.subFlowcode
        })
        .then(function(res) {
          if (res.success) {
            $wysqService.fjlxlist = res.data;
            $scope.fjzlList = $wysqService.fjlxlist;
            $scope.getFj();
            console.log($wysqService.fjlxlist);
          }
        }, function(res) {
          $scope.showAlert('验证附件材料失败!');
        });
    }
    //根据业务号获取所有附件
    $scope.getFj = function() {
      $fjxzUtilsService.getAllFjByYwh($wysqService.djsqItemData.wwywh, function(filelistAll) {
        if ($scope.fjzlList != null && $scope.fjzlList.length > 0) {
          for (var j = 0; j < $scope.fjzlList.length; j++) {
            var fjzlTemp = $scope.fjzlList[j];
            $fjxzUtilsService.setFileToListByclmc(filelistAll, fjzlTemp);
            //getFileListFromFms(fjzlTemp.filelist); //从Fms服务器中获取文件
          }
        }
      });
    }
    $scope.getFjlist();

    //最终提交申请
    $scope.submit = function() {

     if (!$wysqService.judgeApplicantFinished($scope)) {//申请人信息不完善,或者申请人共有方式不合理
        return;
      }
      var mineYwInfo = $wysqService.getMineYwInfo();
      if (mineYwInfo == null) {
        $scope.showAlert('您不是该笔业务中的权利人或者义务人,不能代替别人申请!'); //防止主申请人不添加自己为申请人(权利人或义务人)
        return;
      }
      if (!$wysqService.judgeBdcxxFinished($scope)) {//请先完善不动产信息
        return;
      }

      if (!$fjxzUtilsService.verifyData($scope, $scope.fjzlList)) {
        return; //附件上传不完整
      }
      
      if (!$wysqService.judgeAllPeoleIdentityVerified($scope)) {
        return; //有人没完成认证
      }

      $scope.applyInfo();
    };

    $scope.applyInfo = function() {
      $wysqService.completeApply({
          qlxxId: $wysqService.djsqItemData.id
        })
        .then(function(res) {
          if (res.success) {
            $scope.showAlert('提交成功');
            $wysqService.blzt = '网上审核中';
            $wysqService.stepInfo.four = true;
            $state.go('djjg');
          }
        }, function(res) {
          //						$scope.showAlert(res.message);
        });
    }
    //通知所有人进行认证
    $scope.notifyEveryone = function() {

      if (!$wysqService.judgeApplicantFinished($scope)) {
        return;
      }
      if ($wysqService.djsqItemData.dxzt) {
        $scope.showAlert('后台已经帮您发送过短信通知了!');
        return;
      }
      $wysqService.notifyEveryone({
          qlxxId: $wysqService.djsqItemData.id
        })
        .then(function(res) {
          if (res.success) {
            $scope.showAlert('发送通知成功!');
            $wysqService.djsqItemData.dxzt = true;
          }
        }, function(res) {
          $scope.showAlert('发送通知失败!');
          //						$scope.showAlert(res.message);
        });
    }

    //跳转评价功能
    $scope.evaluate = function() {
      $state.go("evaluation", {
        "ywbh": $wysqService.djsqItemData.ywh,
        "orgCode": $wysqService.djsqItemData.djjg,
        "orgName": $wysqService.djsqItemData.djjgmc
      });
    }

    //2019.7.15新增悬浮按钮
    $('#touch').on('touchmove', function(e) {
      // 阻止其他事件
      e.preventDefault();
      // 判断手指数量
      if (e.originalEvent.targetTouches.length == 1) {
        // 将元素放在滑动位置
        var touch = e.originalEvent.targetTouches[0];
        $("#touch").css({
          'left': touch.pageX + 'px',
          'top': touch.pageY + 'px'
        });
      }
    });

    //悬浮按钮的点击事件
    $scope.floatingButtonClicked = function() {
      $menuService.id = 0;
      $menuService.level3FlowCode = $scope.sqxx.subFlowcode;
      $state.go('bsznDetail');
    }

    $scope.showAlert = function(msg) {
      ionicToast.show(msg, 'middle', false, 2000);
    };
  }
]);
