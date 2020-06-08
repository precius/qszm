angular.module('recordVideoAppCtrl', []).controller('recordVideoAppCtrl', ["$scope", "ionicToast", "$state",
  "$ionicHistory",
  "$wysqService", "$stateParams", "$ionicPopup", "$ionicLoading", "$interval", "$fjxzUtilsService",
  "$bsznService",
  function($scope, ionicToast, $state, $ionicHistory, $wysqService, $stateParams, $ionicPopup, $ionicLoading,
    $interval, $fjxzUtilsService, $bsznService) {
    $scope.title = '人脸录制';

    $scope.showAlert = function(msg) {
      ionicToast.show(msg, 'middle', false, 2000);
    };
    $scope.file = null;
    $scope.buttonText = '录制视频';
    $scope.goback = function() {
      $ionicHistory.goBack(-2);
    };
    $scope.video = document.getElementById('video'); //显示摄像头捕捉画面的video
    $scope.showVideo = document.getElementById('showVideo'); //录制完成后播放的video
    $scope.isRecordFinished = false;
    //拿到文件
    var oInput = document.getElementById("inputFile");
    onReceiveFile = function() {
      $scope.isRecordFinished = true;
      $scope.buttonText = '重新录制';
      $scope.$apply();
      $scope.file = this.files[0];

      var url = URL.createObjectURL($scope.file);
      $scope.showVideo.src = url;

    }
    oInput.addEventListener('change', onReceiveFile, false);


    // 上传到服务器
    $scope.uploadToServer = function() {

      /* var file = new File(recordedBlobs, 'video-' + (new Date).toISOString().replace(/:|\./g, '-') +
        '.mp4', {
          type: 'video/mp4'
        }); */

      // create FormData
      if (!$scope.isRecordFinished) {
        return;
      }
      var file = $scope.file;
      var fileSize = file.size;
      fileSize = Math.round(fileSize / 1024 * 100) / 100; //単 位カKBif(fileSize>1024){
      if (fileSize > 1024*50) {
        $scope.showAlert('视频超过50Mb,请控制录制时间再上传!');
        return;
      }
      showLoading();
      var formData = new FormData();
      formData.append('wjm', file.name);
      formData.append('file', file);
      // formData.append('ywh', 'WW-20200129000011');
      var mineYwInfo = $wysqService.getMineYwInfo();
      formData.append('ywh', $wysqService.djsqItemData.wwywh);
      if (mineYwInfo.qlrmc) {
        formData.append('userName', mineYwInfo.qlrmc);
      }
      if (mineYwInfo.ywrmc) {
        formData.append('userName', mineYwInfo.ywrmc);
      }
      formData.append('category', mineYwInfo.category);
      formData.append('userId', mineYwInfo.id);
      console.log(formData);
      //TODO 上传动画
      $scope.makeXMLHttpRequest(internetEstateServer + 'fileUploadController/saveVideo', formData, function(
        res) {
        //上传完成后的回调
        $scope.showAlert('视频上传成功!');
        //TODO 上传动画关闭
        refreshService();
        //$ionicHistory.goBack(-2);
      });
    }
    refreshService = function() {
      $wysqService.queryApply({
          applyId: $wysqService.djsqItemData.id
        })
        .then(function(response) {
          //单条申请信息注入服务
          $wysqService.djsqItemData = response.data.qlxx;
          $scope.goback();

        }, function(error) {
          showAlert("刷新申请信息失败!");
        });
    }

    $scope.makeXMLHttpRequest = function(url, data, callback) {
      var request = new XMLHttpRequest();
      request.onreadystatechange = function() {
        if (request.readyState == 4) {
          if(request.status == 200){
            var res = JSON.parse(request.response)
            callback(res);
            hideLoading();
          }else{
            hideLoading();
            $scope.showAlert("上传失败!");
          }
        }
      };
      request.open('POST', url);
      request.send(data);
    }
    showLoading = function() {
      $ionicLoading.show({
        //template: '上传中...'
        template: '<ion-spinner icon="lines" class="spinner-calm"></ion-spinner><p>正在上传视频</p>',
        duration: 1000000
      });
    };
    hideLoading = function() {
      $ionicLoading.hide();
    };
  }
]);
