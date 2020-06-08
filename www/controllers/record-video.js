angular.module('recordVideoCtrl', []).controller('recordVideoCtrl', ["$scope", "ionicToast", "$state", "$ionicHistory",
  "$wysqService", "$stateParams", "$ionicPopup", "$ionicLoading", "$interval", "$fjxzUtilsService",
  "$bsznService",
  function($scope, ionicToast, $state, $ionicHistory, $wysqService, $stateParams, $ionicPopup, $ionicLoading,
    $interval, $fjxzUtilsService, $bsznService) {
    $scope.title = '人脸录制';

    $scope.showAlert = function(msg) {
      ionicToast.show(msg, 'middle', false, 2000);
    };


    $scope.goback = function() {
      if ($scope.isRecording) { //如果正在录制中,先停止录制,再关闭摄像头,再返回上一级
        stopRecording();
        $scope.closeCamera();
      }
      if (!$scope.showVideo.paused) {
        $scope.showVideo.pause(); //另一个播放器暂停播放
      }
      $ionicHistory.goBack(-2);
    };
    $scope.video = document.getElementById('video'); //显示摄像头捕捉画面的video
    $scope.showVideo = document.getElementById('showVideo'); //录制完成后播放的video
    //$scope.mediaRecorder = null;
    $scope.isRecording = false; //是否正在录制中
    $scope.isRecordFisnished = false; //是否录制完成
    $scope.stream = null; //摄像头获取的流

    const mediaSource = new MediaSource();
    mediaSource.addEventListener('sourceopen', handleSourceOpen, false);

    function handleSourceOpen(event) {
      console.log('MediaSource opened');
      sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="vp8"');
      console.log('Source buffer: ', sourceBuffer);
    }
    let mediaRecorder;
    let recordedBlobs;
    let sourceBuffer;
    let width = $scope.video.offsetWidth;
    let height = $scope.video.offsetHeight;

    document.querySelector('p#start').addEventListener('click', async () => {

      if ($scope.isRecording) {
        // $scope.showAlert('正在录制中!')
        return;
      }
      if (!$scope.showVideo.paused) {
        $scope.showVideo.pause(); //另一个播放器暂停播放
      }

      var recordWidth = 360;
      var recordHeight = recordWidth*(height/width);

      const constraints = {
        audio: {
          // echoCancellation: {exact: hasEchoCancellation}
          echoCancellation: true, //回音消除
          noiseSuppression: true, //降噪
          // autoGainControl: true //增强
        },
        video: {
          // heiht: {
          //   min: 500,
          //   ideal: 1000
          // },
          // width: {
          //   min: 360,
          //   ideal: 720
          // },

          facingMode: 'user', //environment表示后置,user表示前置
          width: recordWidth,
          height: recordHeight,
          aspectRatio: width/height
        }
      };
      // console.log('Using media constraints:', constraints);
      await init(constraints);
    });
    async function init(constraints) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        handleSuccess(stream);
      } catch (e) {
        console.error('navigator.getUserMedia error:', e);
        $scope.showAlert('navigator.getUserMedia error:' + JSON.stringify(e))
      }
    }

    function handleSuccess(stream) {

      console.log('getUserMedia() got stream:', stream);
      $scope.stream = stream;

      $scope.video.srcObject = stream;
      $scope.video.onloadedmetadata = function(e) {
        $scope.video.play();

        // $scope.startRecord(); //摄像头已经打开,开始录制
        startRecording(); //摄像头已经打开,开始录制
      };
    }

    function handleDataAvailable(event) {
      console.log('handleDataAvailable', event);
      if (event.data && event.data.size > 0) {
        recordedBlobs.push(event.data);
      }
    }

    function startRecording() {
      recordedBlobs = [];
      let options = {
        mimeType: 'video/mp4;codecs=vp9'
      };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        //console.error(`${options.mimeType} is not Supported`);
        //errorMsgElement.innerHTML = `${options.mimeType} is not Supported`;
        options = {
          mimeType: 'video/mp4;codecs=vp8'
        };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          // console.error(`${options.mimeType} is not Supported`);
          // errorMsgElement.innerHTML = `${options.mimeType} is not Supported`;
          options = {
            mimeType: 'video/mp4'
          };
          if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            // console.error(`${options.mimeType} is not Supported`);
            // errorMsgElement.innerHTML = `${options.mimeType} is not Supported`;
            options = {
              mimeType: ''
            };
          }
        }
      }

      try {
        mediaRecorder = new MediaRecorder($scope.stream, options);
      } catch (e) {
        console.error('Exception while creating MediaRecorder:', e);
        $scope.showAlert('Exception while creating MediaRecorder:' + JSON.stringify(e));
        return;
      }

      // console.log('Created MediaRecorder', mediaRecorder, 'with options', options);

      mediaRecorder.onstop = (event) => {
        console.log('Recorder stopped: ', event);
        console.log('Recorded Blobs: ', recordedBlobs);
      };
      mediaRecorder.ondataavailable = handleDataAvailable;
      mediaRecorder.start(10); // collect 10ms of data
      // console.log('MediaRecorder started', mediaRecorder);
      $scope.isRecording = true;
      $scope.isRecordFinished = false;
      $scope.timeCount(); //启动计时器

    }

    function stopRecording() {
      if ($scope.isRecording) {
        mediaRecorder.stop();
        $scope.isRecording = false;
        $scope.isRecordFinished = true;
        //$scope.downLoadVideo();//下载(保存)到本地
      }
    }

    //录制开始后计时,15秒后录制完成自动停止录像
    $scope.time = 0;
    $scope.buttonText = '录像';

    $scope.timeCount = function() {
      var t = $interval(function() {
        $scope.time++;
        $scope.buttonText = '正在录像' + $scope.time + "s"
        console.log($scope.buttonText);

        if ($scope.time >= 12) {
          $scope.time = 0;
          $scope.buttonText = '重新录制';
          // $scope.stopRecord(); //停止录制
          stopRecording(); //停止录制
          $scope.closeCamera(); //关闭摄像头
          $scope.downLoadVideo(); //本地播放
        }
      }, 1000, 12);
    };




    // 关闭摄像头
    $scope.closeCamera = function() {
      if ($scope.video.srcObject == null) {
        return;
      }
      var stream = $scope.video.srcObject;
      var tracks = stream.getTracks();
      tracks.forEach(track => {
        track.stop();
      });
      $scope.video.srcObject = null;
      // $scope.mediaStream = null;
      $scope.stream = null;
    };




    //停止录制
    $scope.stopRecord = function() {
      if ($scope.isRecording) {
        $scope.mediaRecorder.stop();
        $scope.isRecording = false;
        $scope.isRecordFinished = true;
        //$scope.downLoadVideo();//下载(保存)到本地
      }
    };
    //下载到本地
    $scope.downLoadVideo = function() {
      /* var downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(
        new Blob($scope.recordedChunks, {
          type: "application/video",
        })
      );
      // downloadLink.download = 'live.webm';
      // downloadLink.download = "live.ogg";
      // downloadLink.download = '录制测试.mp4';
      // downloadLink.click();
      $scope.showVideo.src = downloadLink.href; //界面上播放出来 */

      const superBuffer = new Blob(recordedBlobs, {
        type: 'video/mp4'
      });
      $scope.showVideo.src = null;
      $scope.showVideo.srcObject = null;
      $scope.showVideo.src = window.URL.createObjectURL(superBuffer);
      $scope.showVideo.play();
    };

    // 上传到服务器
    $scope.uploadToServer = function() {
      if (!$scope.isRecordFinished) {
        // $scope.showAlert("还未完成录制!");
        return;
      }
      showLoading();
      var file = new File(recordedBlobs, 'video-' + (new Date).toISOString().replace(/:|\./g, '-') +
        '.mp4', {
          type: 'video/mp4'
        });
      // create FormData
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
      $scope.makeXMLHttpRequest(internetEstateServer + '/fileUploadController/saveVideo', formData, function(
        res) {
        //上传完成后的回调
        hide();
        $scope.showAlert('视频上传成功!');
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
        duration: 10000
      });
    };
    hideLoading = function() {
      $ionicLoading.hide();
    };

  }
]);
