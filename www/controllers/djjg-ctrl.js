angular.module('djjgCtrl', []).controller('djjgCtrl', ["$scope", "$state", "$ionicHistory", "$wysqService",
  "$bsznService", "$menuService", "ionicToast", "$qyglService",
  function($scope, $state, $ionicHistory, $wysqService, $bsznService, $menuService, ionicToast, $qyglService) {
    //登记结果
    $scope.djjg = $wysqService.djsqItemData;
    $scope.djjg.lxrmc = mongoDbUserInfo.name;
    $scope.djjg.lxdh = mongoDbUserInfo.tel;
    $scope.yssx = 3;
    //刷新数据
    $wysqService.queryApplyByYwh({
        wwywh: $wysqService.djsqItemData.wwywh
      })
      .then(function(res) {
          if (res.success) {
            $wysqService.djsqItemData = res.data;

          }
        },
        function(Error) {
          // $scope.showAlert('获取信息失败');
        });
    $qyglService.findByOfficeCode({
      officeCode: $scope.djjg.bsdt
    }).then(function(res) {
      if (res.success) {
        $scope.blsx = res.data.blsx
      } else {
        showAlert("获取办事大厅失败");
      }
    }, function(error) {
      showAlert("获取办事大厅失败");
    });
    //获取预审时限
    $bsznService.getBsznDetail({
        subcfgId: $menuService.id
      })
      .then(function(res) {
        $scope.yssx = res.data.yssx;
        //								console.log($wysqService.yssx);
      }, function(error) {

      });
    //获取申请材料数据
    $bsznService.getUploadFileByCode({
      subCode: $wysqService.djsqItemData.subFlowcode
    }).then(function(response) {
      if (response.success) {
        $scope.uploadFile = angular.copy(response.data);
        if ($scope.uploadFile != null && $scope.uploadFile.length > 0) {
          $scope.showcllb = true;
        } else {
          $scope.showcllb = false;
        }
      } else {
        showAlert(response.message);
      }
    }, function(error) {
      //showAlert(error.message);
    });

    $scope.isShowDocs = false;
    $scope.showDocs = function() {
      if ($scope.uploadFile == null || $scope.uploadFile.length == 0) {
        showAlert("未获取到所需材料信息!");
      } else {
        $scope.isShowDocs = !$scope.isShowDocs;
      }
    }

    function showAlert(msg) {
      ionicToast.show(msg, 'middle', false, 2000);
    }

    $scope.BackToHome = function() {
      $wysqService.djsqItemData = {};
      $state.go('tab.home');
    };
    $scope.GoToMine = function() {
      // $wysqService.djsqItemData = {};
      $state.go('djsq');
    };
    $scope.goback = function() {
      //$wysqService.djsqItemData = {};
      $ionicHistory.goBack(); //返回上一个页面
    };
  }
]);
