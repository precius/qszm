angular.module('fjscCtrl', []).controller('fjscCtrl', ["$scope", "ionicToast", "$state", "$ionicHistory",
  "$wysqService", "$stateParams", "$ionicPopup", "$ionicLoading", "$dictUtilsService", "$fjxzUtilsService",
  "$bsznService",
  function($scope, ionicToast, $state, $ionicHistory, $wysqService, $stateParams, $ionicPopup, $ionicLoading,
    $dictUtilsService, $fjxzUtilsService, $bsznService) {
    /* if(!$wysqService.pageStack.includes('fjcl')){
      $wysqService.pageStack.push('fjcl');//栈中保存此页面记录
    } */
    if ($wysqService.isMainApplicant) {
      $scope.isMainApplicant = true; //是否是申请发起人
    } else {
      $scope.isMainApplicant = false; //是否是申请发起人
    };
    //是否显示下一步 以及流程进度条
    $scope.showNextStep = $wysqService.stepByStep;
    //如果强制中断了不显示下一步,那就不再显示下一步
    //$scope.interruptNextStep = $wysqService.interruptNextStep;
    //第一步信息(申请人信息)是否完成
    $scope.stepOneFinished = $wysqService.stepInfo.one;
    //第二步信息(不动产信息)是否完成
    $scope.stepTwoFinished = $wysqService.stepInfo.two;
    //第三步步信息(附件信息)是否完成
    $scope.stepThreeFinished = $wysqService.stepInfo.three;
    //第四步 提交申请是否完成
    $scope.stepFourFinished = $wysqService.stepInfo.four;
    //密码解密算法
    $scope.decryptByDES = function(strMessage, key) {
      if (window.CryptoJS && window.CryptoJS.mode) {
        window.CryptoJS.mode.ECB = (function() {
          if (CryptoJS.lib) {
            var ECB = CryptoJS.lib.BlockCipherMode.extend();

            ECB.Encryptor = ECB.extend({
              processBlock: function(words, offset) {
                this._cipher.encryptBlock(words, offset);
              }
            });

            ECB.Decryptor = ECB.extend({
              processBlock: function(words, offset) {
                this._cipher.decryptBlock(words, offset);
              }
            });

            return ECB;
          }
          return null;
        }());
      }

      key = key || '\u0067\u0072\u0065\u0061\u0074\u006d\u0061\u0070';
      var keyHex = CryptoJS.enc.Utf8.parse(key);
      var decrypted = CryptoJS.DES.decrypt({
        ciphertext: CryptoJS.enc.Base64.parse(strMessage)
      }, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
      return decrypted.toString(CryptoJS.enc.Utf8);
    };
    //获取url中指定字段名的参数
    function UrlSearch() {
      var name, value;
      var str = location.href; //取得整个地址栏
      var num = str.indexOf("?");
      str = str.substr(num + 1); //str得到?之后的字符串
      str = decodeURIComponent(str); //还原url中被转义的字符
      //  	str = $scope.decryptByDES(str); //解密
      var arr = str.split("&"); //得到&分割的参数，放入数组中
      for (var i = 0; i < arr.length; i++) {
        num = arr[i].indexOf("=");
        if (num > 0) {
          name = arr[i].substring(0, num);
          value = arr[i].substr(num + 1);
          this[name] = value;
        }
      }
    }
    var Request = new UrlSearch();

    if ($wysqService.djsqItemData.step == "NETAPPLYING" || $wysqService.djsqItemData.step == "NETNOPASS" ||
      Request.subCode != undefined ||
      $wysqService.djsqItemData.step == "REJECT") {
      $scope.isShow = true;
    } else {
      $scope.isShow = false;
    }

    getSqData = function(wwywh) {
      $wysqService.queryApplyByYwh({
          wwywh: wwywh
        })
        .then(function(res) {
            if (res.success) {
              $wysqService.djsqItemData = res.data;

            }
          },
          function(Error) {
            $scope.showAlert('获取信息失败');
          });
    }
    
    $scope.fromWeb = false; //是否是从web端扫码进来的
    if ($stateParams.subFlowcode) {
      var subFlowcode = $stateParams.subFlowcode;
      var wwywh = $wysqService.djsqItemData.wwywh;
    } else {
      var subFlowcode = Request.subCode; //从web端扫码进入改界面
      var wwywh = Request.ywh;
      $scope.isShow = true;
      $scope.fromWeb = true;
      getSqData(wwywh); //从web端扫码进来需要获取整个业务信息
    }

    //以下4个集合所有人请勿改动,也不要重命名,在$fjxzUtilsService中会用到--何文
    $scope.fjzlList = []; //所有附件大类集合,适配后将拆分到下面三个集合中
    $scope.fbzclList = [];
    $scope.bzclList = [];
    $scope.sqrxgclList = [];

    //以上4个集合所有人请勿改动,也不要重命名,在$fjxzUtilsService中会用到--何文
    //根据子流程代码获取附件类型列表
    $scope.getFjlist = function() {

      //是否兼容以前发起的流程申请的已经上传的材料
      $wysqService.getfjlxlist({
          subCode: subFlowcode,
           oldFlag: $wysqService.djsqItemData.oldFlag
          // subCode: 'aed65678e8074029aabe8375726eb96c'
        })
        .then(function(res) {
          if (res.success) {
            $scope.fjzlList = res.data;
            $fjxzUtilsService.adaptFjcl($scope);
          }
        }, function(res) {
          //$scope.showAlert('获取附件列表失败!');
        });

        // $scope.fjzlList = data;
        // $fjxzUtilsService.adaptFjcl($scope);

    }
    //根据业务号获取所有附件图片
    $scope.getAllFileList = function() {
      $fjxzUtilsService.getAllFjByYwh(wwywh, function(fileList) {
        if ($scope.fjzlList != null && $scope.fjzlList.length > 0) {
          $fjxzUtilsService.setFileToFjList($scope, fileList);
        }
      });
    }
    //附件种类列表
    $scope.getFjlist();



    // $scope.qlrxgclList = [];
    // $scope.ywrxgclList = [];


    $scope.showImageChoice = false;
    //取消选择图片
    $scope.cancelChoice = function() {
      $scope.showImageChoice = false;

      //清空input内容,不然下次选同一个文件时,不能触发change事件
      inputFromAlbum.value = '';
      inputFromCamera.value = '';
      inputFromAlbum.disabled = true;
      inputFromCamera.disabled = true;
    }

    //添加图片
    $scope.addPhoto = function(fjzl, people, fjxl) {
      $scope.fjzl = fjzl; //附件种类
      $scope.people = people; //附件相关的人
      $scope.fjxl = fjxl; //人下附件小类
      if (fjxl.imgSrc) {
        $scope.showAlert('您已上传该附件');
        return;
      }
      $scope.showImageChoice = true;
      setTimeout(function() {
        inputFromAlbum.disabled = false;
        inputFromCamera.disabled = false;
      }, 10);
    }

    //收到文件
    onReceiveFile = function() {
      var file = this.files[0];
      /* var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.addEventListener('loadend', function() {
        let uploadSrc = reader.result.split(',')[1];
        $scope.showImageChoice = false;
        //清空input内容,不然下次选同一个文件时,不能触发change事件
        inputFromAlbum.value = '';
        inputFromCamera.value = '';
        inputFromAlbum.disabled = true;
        inputFromCamera.disabled = true;
        showLoading();
        //上传
        $scope.uploadOnePhoto($scope.fjzl, $scope.people, $scope.fjxl, uploadSrc);

      }); */
      $scope.showImageChoice = false;
      //清空input内容,不然下次选同一个文件时,不能触发change事件
      inputFromAlbum.value = '';
      inputFromCamera.value = '';
      inputFromAlbum.disabled = true;
      inputFromCamera.disabled = true;
      showLoading();
      //上传
      $scope.uploadOnePhoto($scope.fjzl, $scope.people, $scope.fjxl, file);
    }
    var inputFromAlbum = document.getElementById('fileFromAlbum');
    var inputFromCamera = document.getElementById('fileFromCamera');

    inputFromAlbum.addEventListener('change', onReceiveFile, false);
    inputFromCamera.addEventListener('change', onReceiveFile, false);

    /**
     * @param {Object} fjzl 附件种类
     * @param {Object} people 附件相关的人
     * @param {Object} fjxl  人下的附件小类
     * @param {Object} uploadSrc  选择的图片
     */
    $scope.uploadOnePhoto = function(fjzl, people, fjxl, file) {
      var fileName = '';
      if ($scope.fjzl.uploadfileConfig.cllb == 'bzcl') { //标准材料
        fileName = fjxl.name+'.jpg';
      }
      if (people != null && fjxl != null) { //与人相关的材料
        fileName = people.name + fjxl.name + people.zjh+'.jpg';
      }
      if ($scope.fjzl.uploadfileConfig.cllb == 'fbzcl') { //非标准材料
        var sxh = fjxl.imgList.length + 1;
        fileName = fjxl.name + sxh + new Date().getTime()+'.jpg';;
      }

      $wysqService.getSystemTime().then(function(res) {
        if (res.success === true) {
          //获取当前时间成功
          var time = res.data;
          if (fjzl.uploadfileConfig.cllb == 'fbzcl') { //非标准材料

          }
          //将图片上传到fms
          $fjxzUtilsService.uploadOnePhotoToServer(
            $scope,
            time,
            $wysqService.djsqItemData.djjg,
            wwywh,
            fjzl.clmc,
            fjzl.clsm,
            sxh,
            file,
            fileName,
            people,
            fjxl,
            function(result) { //上传成功后的回调,将图片上传后返回的信息绑定到业务流程中
              if (result.filexxSuccess.length == 0) {
                return; //说明文件上传到fms失败,无须进行下面的业务信息保存了
              }
              $fjxzUtilsService.uploadPhotoYwData($scope, result.filexxSuccess, function(res) {
                hideLoading();
                if (res.success == true) {
                  if ($scope.fjzl.uploadfileConfig.cllb == 'fbzcl') { //非标准材料
                    var imgData = {};
                    imgData.imgSrc = result.filexxSuccess[0].fileUrl+'?t='+ Math.random();
                    imgData.fileId = result.filexxSuccess[0].fileId;
                    imgData.id = res.data[0].id;
                    imgData.status = '已上传';
                    imgData.sxh = result.filexxSuccess[0].sxh;
                    imgData.name = result.filexxSuccess[0].clmc;
                    $scope.fjxl.imgList.push(imgData);
                  } else {
                    fjxl.imgSrc = result.filexxSuccess[0].fileUrl+'?t='+Math.random();
                    fjxl.fileId = result.filexxSuccess[0].fileId;
                    fjxl.id = res.data[0].id;
                    fjxl.status = '已上传';
                  }
                  //$scope.getFjByFjzl(fjzl);
                }
              });
            });
        } else {
          hideLoading();
          console.log(res.message);
        }
      }, function(res) {
        hideLoading();
        console.log(res.message);
      });
    };

    $scope.openFile = function(fjxl) {
      if (fjxl.imgSrc == "" || fjxl.imgSrc == null) {
        return;
      } else {
        $scope.Url = fjxl.imgSrc;
      }
      $scope.bigImage = true;
    };
    //初始默认大图是隐藏的
    $scope.hideBigImage = function() {
      $scope.bigImage = false;
    };

    //删除附件小类照片
    $scope.deleteFjImg = function(fjxl) {
      if (!fjxl.imgSrc) {
        return;
      }
      $fjxzUtilsService.deleteOneFile($scope, fjxl, function(res) {
        fjxl.imgSrc = null;
        fjxl.fileId = null;
        fjxl.id = null;
        fjxl.status = null;
      });
    }
    //删除非标准材料
    $scope.deleteFbzcl = function(fjzl, index) {

      $fjxzUtilsService.deleteOneFile($scope, fjzl.fjxl.imgList[index], function(res) {
        fjzl.fjxl.imgList.splice(index, 1); //删除对应的imgData
        //从index起,后面的所有附件重新保存到业务库并且重命名
        var imgList = [];
        for (var a = index; a < fjzl.fjxl.imgList.length; a++) {
          fjzl.fjxl.imgList[a].ywh = wwywh;
          fjzl.fjxl.imgList[a].clfl = fjzl.clmc;
          fjzl.fjxl.imgList[a].clmc = fjzl.fjxl.name + (a + 1) + '.jpg';
          fjzl.fjxl.imgList[a].sxh = a + 1;
          fjzl.fjxl.imgList[a].name = fjzl.fjxl.name + (a + 1) + '.jpg';
          fjzl.fjxl.imgList[a].fileUrl = fjzl.fjxl.imgList[a].imgSrc;
          imgList.push(angular.copy(fjzl.fjxl.imgList[a]));
        }
        if (imgList.length == 0) {
          return;
        }

        $fjxzUtilsService.uploadPhotoYwData($scope, imgList, function(res) {
          if (res.success == true) {
            //删除后重新排序成功
          }
        });
      });
    }
    showLoading = function() {
      $ionicLoading.show({
        //template: '上传中...'
        template: '<ion-spinner icon="lines" class="spinner-calm"></ion-spinner><p>正在上传图片</p>',
        duration: 10000
      });
    };
    hideLoading = function() {
      $ionicLoading.hide();
    };

    //返回上一页
    $scope.goback = function() {
      $fjxzUtilsService.verifyData($scope);
      // $ionicHistory.goBack(-$wysqService.pageStack.length);//根据栈中页面数量来确定回退几级
      $ionicHistory.goBack(-1);
    };


    //下一步 最终提交申请
    $scope.nextStep = function() {
      if (!$fjxzUtilsService.verifyData($scope)) {
        return; //附件上传不完整
      }

      $wysqService.stepInfo.three = true;
      $state.go("djsq-details", {}, {
        reload: true
      });
    };


    $scope.showAlert = function(msg) {
      ionicToast.show(msg, 'middle', false, 2000);
    };
    //模板图片地址
    $scope.imgData = [{
      src: require('../../theme/img_menu/zs3.png')
    }, {
      src: require('../../theme/img_menu/zs1.png')
    }, {
      src: require('../../theme/img_menu/zs2.png')
    }];
    //不动产信息模板提示框
    $scope.showTips = false;
    $scope.clickTips = function(n) {
      console.log(n);
      $bsznService.clsls = $scope.fjzlList[n].clsls;
      $state.go('clsls');
    }
    //下载图片加载框
    $scope.show = function(title) {
      $ionicLoading.show({
        //template: '上传中...'
        template: '<ion-spinner icon="lines" class="spinner-stable"></ion-spinner><p>' + title + '</p>'
      });
    };
    $scope.hide = function() {
      $ionicLoading.hide();
    };
    // 返回首页
    $scope.goHome = function(){
       $wysqService.goHomePage($ionicPopup,$state,"提示", "确定", "取消", "确定要跳转到首页吗?");
    }
  }
]);
