//我的申请列表申请控制器
angular.module('djsqxzCtrl', []).controller('djsqxzCtrl', ["$scope", "$state", "$stateParams", "$ionicHistory",
  "$interval", "$wysqService",
  function($scope, $state, $stateParams, $ionicHistory, $interval, $wysqService) {
    $scope.countOver = false;
    $scope.sqxx = JSON.parse($stateParams.jsonObj);
    var i = timeCount;
    $scope.count = "(" + i + "s)";

    var t = $interval(function() {
      i--;
      if (i <= 0) {
        $scope.count = "";
        $scope.countOver = true;
      } else {
        $scope.count = "(" + i + "s)";
      }
    }, 1000, i);

    $scope.goback = function() {
      $interval.cancel(t);
      $ionicHistory.goBack(); //返回上一个页面
    };

    $scope.agree = function() {
      // $wysqService.saveSqxx($scope.sqxx)
      //   .then(function(res) {
      //     if (res.success) {
      //       $wysqService.djsqItemData = res.data;
      //       //									console.log($wysqService.djsqItemData);
      //       // $state.go('sqrxx',{"stateGo":'djsq'});
      //       $wysqService.isMainApplicant = true; //是主申请人
      //       $wysqService.stepByStep = true; //在申请人信息  不动产信息 附件上传信息显示下一步
      //       $wysqService.stepInfo.one = false;
      //       $wysqService.stepInfo.two = false;
      //       $wysqService.stepInfo.three = false;
      //       $wysqService.stepInfo.four = false;

      //       $state.go('sqrxx', {
      //         "stateGo": 'djsq'
      //       });
      //     }
      //     //hide();
      //   }, function(res) {
      //     $scope.showAlert('请求失败!');
      //     //								console.log(res.message);
      //     //hide();
      //   })

      $state.go('extractSqxx', {
        "jsonObj": $scope.sqxx
      });
    };

    $scope.disagree = function() {
      $interval.cancel(t);
      $ionicHistory.goBack();
    };
  }
]);
