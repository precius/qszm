//我的控制器
angular.module('faceVerificationCtrl', []).controller('faceVerificationCtrl', ["$scope", "$state", "$ionicHistory", "$faceVerificationService", "$interval", "ionicToast",
  function($scope, $state, $ionicHistory, $faceVerificationService, $interval, ionicToast) {
    //验证信息弹框
    $scope.onDialogVideoResult = false;
    $scope.verificationCode = false;
    $scope.showLoading = false;
    var task = null;
    
    let stayTimer = null;
    $scope.items = [
        {
            number: 1,
            text: '牢记验证码，点击开始录制',
            border: 1
        }, {
            number: 2,
            text: '开启前置摄像头，用普通话朗读数字',
            border: 1
        }, {
            number: 3,
            text: '完成录制，等待验证结果',
            border: 0
        }
    ];
    
    //获取验证码
    $scope.getVerifyCodeModal = function() {
      $faceVerificationService.getCode({
        type: 'faceliveness_sessioncode',
        apiType: 'faceliveness'
      }).then(function(res) {
        //验证码
        let result = res.data.result;
        if (result) {
          $scope.verificationCode = true;
          $scope.codeResult = result.code;
          $scope.sessionId = result.session_id;
          //60s倒计时
          $scope.refreshTime = 60;
          $scope.timeout();
          //等待的时间 3秒倒计时
          $scope.timeHaveToStay = 3;
          $scope.stayTimerF();
          $scope.btnPoint = false;
        } else {
          //获取失败
          $scope.verificationCode = false;
          $scope.errorContent();
        }
      });
    }
  
    //下一步
    $scope.nextStep = function() {
      $scope.onDialogVideoResult = true;
      //获取验证码
      $scope.getVerifyCodeModal();
      //按钮文字
      $scope.confirmBtnText = '记住了，开始录制(3s)';
    },
    
    //倒计时
    $scope.timeout = function() {
      // 60秒倒计时
      task = $interval(() => {
        $scope.refreshTime--;
        if ($scope.refreshTime === 0) {
          $interval.cancel(task);
          //重新获取验证码
          $scope.getVerifyCodeModal();
        }
      }, 1000);
    }
    
    //获取失败
    $scope.errorContent = function() {
      console.log('失败');
    }
    
    $scope.stayTimerF = function() {
      stayTimer = setTimeout(() => {
        $scope.timeHaveToStay -= 1;
        if ($scope.timeHaveToStay > 0) {
          $scope.stayTimerF();
          $scope.confirmBtnText = '记住了，开始录制(' + $scope.timeHaveToStay +'s)';
        } else if ($scope.timeHaveToStay === 0) {
          stayTimer = null;
          $scope.btnPoint = true;
          $scope.confirmBtnText = '记住了，开始录制'
          return ;
        }
      }, 1000);
    }
    
    //重新获取
    $scope.videoRestart = function () {
      $scope.getVerifyCodeModal();
    }
    
    //返回
    $scope.goback = function() {
      $ionicHistory.goBack();
    };
    
    //关闭弹框
    $scope.closePopup = function() {
      $scope.onDialogVideoResult = false;
      if (task != null) {
        $interval.cancel(task);
      }
    }
    
    //上传文件
    var oInput = document.getElementById("inputFile");
    readFile = function() {
      $scope.showLoading = true;
      $scope.confirmBtnText = '验证中....';
      var file = this.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.addEventListener('loadend', function () {
        let formdata = {
          type: 'faceliveness_verify',
          apiType: 'faceliveness',
          'session_id': $scope.sessionId,
          'video_base64': reader.result.split(',')[1]
        };
        
        $faceVerificationService.getCode(formdata).then(function(res) {
          //验证码
          console.log(res);
          if (res.data.error_code) {
            ionicToast.show('验证失败', 'middle', false, 2000);
            $scope.onDialogVideoResult = false;
          } else {
            ionicToast.show('验证成功', 'middle', false, 2000);
          }
        });
      });
    }
    oInput.addEventListener('change', readFile, false);
    
  }
]);