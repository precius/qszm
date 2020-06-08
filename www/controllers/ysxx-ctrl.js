angular.module('ysxxCtrl', []).controller('ysxxCtrl', ["$scope", "ionicToast", "$ionicHistory", "$stateParams",
  "$wysqService", "$filter", "$dictUtilsService",
  function($scope, ionicToast, $ionicHistory, $stateParams, $wysqService, $filter, $dictUtilsService) {
    $scope.goback = function() {
      $ionicHistory.goBack();
    }

    //预审进度
    $scope.ysjdArray = $dictUtilsService.getBlzt().childrens;
    //办理状态固定排序
    var childrenTempArray = $scope.ysjdArray;
    var toChildrenTempArray = [{
        "value": "NETAPPLYING"
      }, {
        "value": "NETCHECKING"
      }, {
        "value": "NETPASSED"
      }, {
        "value": "NETNOPASS"
      }, {
        "value": "ACCEPTANCE"
      },
      {
        "value": "CHECKING"
      }, {
        "value": "REGISTERING"
      }, {
        "value": "CERTIFICATING"
      }, {
        "value": "PAYING"
      }, {
        "value": "AWARD"
      }, {
        "value": "GD"
      }, {
        "value": "COMPLETE"
      }
    ];
    for (var j = 0; j < toChildrenTempArray.length; j++) {
      var toChildrenTemp = toChildrenTempArray[j];
      if (childrenTempArray != undefined && childrenTempArray != "" && childrenTempArray != null) {
        for (var i = childrenTempArray.length - 1; i >= 0; i--) {
          var childrenTemp = childrenTempArray[i];
          if (toChildrenTemp.value == childrenTemp.value) {
            toChildrenTempArray.splice(j, 1, childrenTemp);
            break;
          }
        }
      }
    }
    $scope.ysjdArray = toChildrenTempArray;

    $scope.qlxx = {};
    var ywh = $stateParams.ywh;

    //通过业务号获取业务信息，只需要接收ywh即可
    if (ywh != null) {
      $wysqService.queryApplyByYwh({
        "wwywh": ywh
      }).then(function(res) {
        if (res.success) {
          $scope.qlxx = res.data;
          //过滤器格式化
          $scope.qlxx.yssj = $filter('date')($scope.qlxx.yssj, 'yyyy-MM-dd');
          setYsjd();
        } else {
          ionicToast.show('获取预审信息失败', 'middle', false, 2000);
        }
      }, function(res) {
        ionicToast.show('获取预审信息失败', 'middle', false, 2000);
      });
    }

    //预审进度数据处理
    function setYsjd() {
      $scope.ysjdArray = filterYsjd(); //对预审进度进行过滤，区分预审通过与不通过
      var index = getYsjd(); //获取预审进度具体节点
      for (var i = 0; i < $scope.ysjdArray.length; i++) {
        var ysjd = $scope.ysjdArray[i];
        //页面下显示各个审核节点状态
        if (i <= index) {
          ysjd.status = true;
        } else {
          ysjd.status = false;
        }
        ysjd.srcFinish = require("../theme/img/YSJD_FINISH.png");
        ysjd.srcUnfinish = require("../theme/img/YSJD_UNFINISH.png");
        ysjd.srcFucus = require("../theme/img/" + ysjd.value + "_FOCUS.png");
        ysjd.srcUnfucus = require("../theme/img/" + ysjd.value + "_UNFOCUS.png");
        ysjd.srcFinishToNext = require("../theme/img/YSJD_FINISH_TONEXT.png");
        ysjd.srcUnfinishToNext = require("../theme/img/YSJD_UNFINISH_TONEXT.png");
        if (ysjd.status) {
          ysjd.showsrcFinish = ysjd.srcFinish;
          ysjd.showsrcFucus = ysjd.srcFucus;
          ysjd.showsrcFinishToNext = ysjd.srcFinishToNext;
        } else {
          ysjd.showsrcFinish = ysjd.srcUnfinish;
          ysjd.showsrcFucus = ysjd.srcUnfucus;
          ysjd.showsrcFinishToNext = ysjd.srcUnfinishToNext;
        }
        //是否显示下一步连接线
        ysjd.isShowsrcFinishToNext = true;
        if (i == $scope.ysjdArray.length - 1) {
          ysjd.isShowsrcFinishToNext = false;
        }
      }
    }

    //对预审进度进行过滤，区分预审通过与不通过
    function filterYsjd() {
      var ysjdArrayTemp = [];
      if ("NETNOPASS" == $scope.qlxx.step) {
        for (var i = 0; i < $scope.ysjdArray.length; i++) {
          var tempYsjd = $scope.ysjdArray[i];
          if (tempYsjd.value != "NETPASSED") {
            ysjdArrayTemp.push(tempYsjd);
            if (tempYsjd.value == "NETNOPASS") {
              break;
            }
          }
        }
      } else {
        //剔除不通过
        for (var i = 0; i < $scope.ysjdArray.length; i++) {
          var tempYsjd = $scope.ysjdArray[i];
          if (tempYsjd.value == "NETNOPASS") {

          } else {
            ysjdArrayTemp.push(tempYsjd);
          }
        }
      }
      return ysjdArrayTemp;
    }

    //获取当前办理状态索引
    function getYsjd() {
      var index = 0;
      for (var i = 0; i < $scope.ysjdArray.length; i++) {
        var tempYsjd = $scope.ysjdArray[i];
        if (tempYsjd.value == $scope.qlxx.step) {
          index = i;
          break;
        }
      }
      return index;
    }
  }
]);
