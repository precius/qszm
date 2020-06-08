angular.module('level2MenuCtrl', []).controller('level2MenuCtrl', ['$menuService', '$wyyyService', '$scope', 'ionicToast',
  '$ionicHistory', '$state',
  '$ionicPopup', '$bsznService', '$wysqService', '$dictUtilsService', '$loginService', '$qyglService',
  '$ionicActionSheet',
  function($menuService, $wyyyService, $scope, ionicToast, $ionicHistory, $state, $ionicPopup, $bsznService,
    $wysqService,
    $dictUtilsService, $loginService, $qyglService, $ionicActionSheet) {
    //调用微信人脸识别之前进行签名
    var appId = null;
    $dictUtilsService.signature(function(res) {
      appId = res.data.appId;
    });
    $scope.level1Menu = $menuService.level1Menu;
    $scope.level2Menu = $menuService.level2Menu;

    //不同的菜单配置不同的顶部大图
		if($scope.level1Menu.name.indexOf("过户")!=-1){
			$scope.bigImg = require("../theme/img_menu/wygh-bg.png");
		}else if($scope.level1Menu.name.indexOf("抵押")!=-1){
			$scope.bigImg = require("../theme/img_menu/wydy_bg.png");
		}else if($scope.level1Menu.name.indexOf("变更")!=-1){
			$scope.bigImg =  require("../theme/img_menu/wybg_bg.png");
		}else if($scope.level1Menu.name.indexOf("更正")!=-1){
			$scope.bigImg =  require("../theme/img_menu/wybg_bg.png");
		}else if($scope.level1Menu.name.indexOf("合并")!=-1){
			$scope.bigImg =  require("../theme/img_menu/wydy_bg.png");
		}else{
			$scope.bigImg =  require("../theme/img_menu/wygh-bg.png");
		}

    //3级流程集合
    var level3FlowTemp = angular.copy($menuService.level3FlowArray);
    $scope.level3FlowArray = [];
    angular.forEach(level3FlowTemp, function(item, index) {
      if (item.bdclbEnum == "HOUSE") {
        $scope.level3FlowArray.push(item);
      }
    })

    if ($scope.level2Menu != null && $scope.level3FlowArray != null && $scope.level3FlowArray.length > 0) {
      for (var i = 0; i < $scope.level3FlowArray.length; i++) {
        if ($scope.level3FlowArray[i].name.indexOf('-') != -1) {
          var str = $scope.level3FlowArray[i].name.split("-");
          if (str[1].indexOf('(') != -1) {
            var name = str[1].replace('(', '-');
            name = name.replace(')', '-');
            var names = name.split('-')
            $scope.level3FlowArray[i].name = names[0];
            $scope.level3FlowArray[i].name1 = names[1];

          } else if (str[1].indexOf('（') != -1) {
            var name = str[1].replace('（', '-');
            name = name.replace('）', '-');
            var names = name.split('-')
            $scope.level3FlowArray[i].name = names[0];
            $scope.level3FlowArray[i].name1 = names[1];
          } else {
            $scope.level3FlowArray[i].name = str[1];
          }
        } else {
          if ($scope.level3FlowArray[i].name.indexOf('(') != -1) {
            var name = $scope.level3FlowArray[i].name.replace('(', '-');
            name = name.replace(')', '-');
            var names = name.split('-')
            $scope.level3FlowArray[i].name = names[0];
            $scope.level3FlowArray[i].name1 = names[1];

          } else if ($scope.level3FlowArray[i].name.indexOf('（') != -1) {
            var name = $scope.level3FlowArray[i].name.replace('（', '-');
            name = name.replace('）', '-');
            var names = name.split('-')
            $scope.level3FlowArray[i].name = names[0];
            $scope.level3FlowArray[i].name1 = names[1];
          }
        }

      }
    }
    //最低级子菜单(网上自助自助申请、网上预约、办事指南、申请材料)
    $scope.childMenuArray = $menuService.getChildMenu();


    //返回上一个页面
    $scope.goback = function() {
      $ionicHistory.goBack();
    };
    //提示对话框
    $scope.showAlert = function(msg) {
      ionicToast.show(msg, 'middle', false, 2000);
    };


    $scope.lastTime = 0;
    //跳转到对应业务
    $scope.gotoyw = function(level3Flow, childMenu) {
      /*防止快速点击，hewen 2019.03.11*/
      var time = new Date().getTime();
      if (time - $scope.lastTime < 2000) {
        return;
      };
      $scope.lastTime = time;
      /*防止快速点击，hewen 2019.03.11*/

      //保存三级流程id 用于查询对应的办事指南和申请材料
      $menuService.id = level3Flow.id;
      if (childMenu.name === "办事指南") {
        $menuService.flag = 0;
        $state.go('bsznDetail');
        return;
      }
      if (childMenu.name === "申请材料") {
        $state.go('sqcl');
        return;
      }
      if (!$dictUtilsService.isLogin()) {
        $scope.showConfirm('提示', '确认', '取消', "请先登录再办理业务!");
        return;
      }
      if (!$dictUtilsService.isCertification()) {
        //$scope.showAlert('提示', "该业务需要在个人中心实名认证！");
        $scope.showConfirm1('提示', '确认', '取消', "请先实名认证再办理业务！");
        return;
      }
      if (childMenu.name === "网上申请") {
        $menuService.ywdata = level3Flow;
        //获取3级流程更多信息
        $menuService.getSubFlowConfigInfo({
          id: level3Flow.id
        }).then(
          function(res) {
            console.log(res);
            selectBsdt(res.data);
          },
          function(error) {
            console.log(res);
          }
        );
      }
    }
    var bsdtData = [];

    selectBsdt = function(level3FlowInfo) {
      $dictUtilsService.getBsdtDataByDjjg($scope, function(res) {
        bsdtData = angular.copy(res.data);
        var buttons = [];
        for (var i = 0; i < bsdtData.length; i++) {
          buttons.push({
            text: bsdtData[i].officeName
          });
        }
        $ionicActionSheet.show({
          buttons: buttons,
          titleText: '选择办事大厅',
          cancelText: '取消',
          cancel: function() {
            return true;
          },
          buttonClicked: function(index) {
						$scope.sqxx = {
							djjg: bsdtData[index].djjg, //机构代码
							djjgmc: bsdtData[index].jgmc, //登记机构名称
							bdclb: level3FlowInfo.bdclb, //不动产类别
							bsdtCode: bsdtData[index].officeCode, //办事大厅
							bsdtName: bsdtData[index].officeName, //办事大厅
							flowCode: level3FlowInfo.flowCode, //流程代码
							flowName: level3FlowInfo.flowName, //流程名称
							subFlowCode: level3FlowInfo.subFlowCode, //子流程代码
							subFlowName: level3FlowInfo.subFlowName, //子流程名称
							netFlowCode: level3FlowInfo.netFlowCode, //网络流程代码
							djdl: level3FlowInfo.djdl, //登记大类
							qllx: level3FlowInfo.qllx, //权利类型
							sqrlx: mongoDbUserInfo.userCategory, //申请人类型
							userId: mongoDbUserInfo.id //用户ID
						};
            var sqxxString = JSON.stringify($scope.sqxx);
            //实名认证过了，调用微信人脸识别
            if (needWxFaceVerify) {
              $dictUtilsService.wxface(function(data) {
                $state.go('djsqxz',{'jsonObj':sqxxString});
              }, appId, mongoDbUserInfo.name, mongoDbUserInfo.zjh);
            } else {
              $state.go('djsqxz',{'jsonObj':sqxxString});
            }
						return true;
					}
				});
			});
		}
    //跳转登录对话框
    $scope.showConfirm = function(titel, okText, cancelText, contentText) {
      var confirmPopup = $ionicPopup.confirm({
        title: titel,
        okText: okText,
        cancelText: cancelText,
        content: contentText
      });
      confirmPopup.then(function(res) {
        if (res) {
          $loginService.flag = 0;
          $state.go('login', {
            'fromPosition': 'level2Menu'
          });
        } else {

        }
      });
    };
    //实名认证跳转登录对话框
    $scope.showConfirm1 = function(titel, okText, cancelText, contentText) {
      var confirmPopup = $ionicPopup.confirm({
        title: titel,
        okText: okText,
        cancelText: cancelText,
        content: contentText
      });
      confirmPopup.then(function(res) {
        if (res) {
          $state.go('mine-certificate');
        } else {

        }
      });
    };
  }
]);
