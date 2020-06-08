//不动产信息页面控制器
angular.module('bdcxxCtrl', []).controller('bdcxxCtrl', ["$scope", "ionicToast", "$stateParams", "$state", "$filter",
  "$ionicHistory", "$ionicActionSheet", "$wysqService", "$dictUtilsService", "$menuService",
  "$cordovaBarcodeScanner", "$rootScope", "$qyglService",
  function($scope, ionicToast, $stateParams, $state, $filter, $ionicHistory, $ionicActionSheet, $wysqService,
    $dictUtilsService, $menuService, $cordovaBarcodeScanner, $rootScope, $qyglService) {
    if ($wysqService.djsqItemData.step == "NETAPPLYING" || $wysqService.djsqItemData.step == "NETNOPASS") {
      $scope.isShow = true;
    } else {
      $scope.isShow = false;
    }
    //预告登记种类
    var ygdjzlStr = "预告登记种类";
    $scope.ygdjzl = {};
    $scope.ygdjzlData = $dictUtilsService.getDictinaryByType(ygdjzlStr).childrens;
    $scope.ygdjzl = $scope.ygdjzlData[0]; //固定为预售商品房买卖预告登记
    $scope.getYgdjzlByValue = function(value) {
      for (var i = 0; i < $scope.ygdjzlData.length; i++) {
        var temp = $scope.ygdjzlData[i];
        if (temp.value == value) {
          $scope.ygdjzl = temp;
        }
      }
    }
    //是否显示下一步 以及流程进度条
    $scope.showNextStep = $wysqService.stepByStep;
    //如果强制中断了不显示下一步,那就不再显示下一步
    if ($wysqService.interruptNextStep) {
      $scope.showNextStep = false;
    };
    //第一步信息(申请人信息)是否完成
    $scope.stepOneFinished = $wysqService.stepInfo.one;
    //第二步信息(不动产信息)是否完成
    $scope.stepTwoFinished = $wysqService.stepInfo.two;
    //第三步步信息(附件信息)是否完成
    $scope.stepThreeFinished = $wysqService.stepInfo.three;
    //第四步 提交申请是否完成
    $scope.stepFourFinished = $wysqService.stepInfo.four;

    //权利信息
    $scope.qlxx = {};
    //不动产信息
    $scope.bdcxx = {
      qlxxEx: {}
    };
    $scope.showBdcdyh = false;
    if (gyjsydsyqjfwsyq_zydj_flowCode == $wysqService.djsqItemData.netFlowdefCode ||
      gyjsydsyqjfwsyq_hzdj_flowCode == $wysqService.djsqItemData.netFlowdefCode ||
      gyjsydsyqjfwsyq_bzdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) {
      $scope.showBdcdyh = true;
    } else {
      $scope.showBdcdyh = false;
    }
    //模板图片地址
    $scope.imgData = [{
      src: require('../../theme/img_menu/zs3.png')
    }, {
      src: require('../../theme/img_menu/zs1.png')
    }, {
      src: require('../../theme/img_menu/zs2.png')
    }];

    //给日期选择增加默认文字
    $("#date").on("input", function() {
      if ($(this).val().length > 0) {
        $(this).addClass("full");
      } else {
        $(this).removeClass("full");
      }
    });

    //不动产信息模板提示框
    $scope.showTips = false;
    $scope.clickTips = function(n) {
      if (n == 0 || n == 1 || n == 2) {
        $scope.src = $scope.imgData[n].src;
        $scope.showTips = true;
      } else {
        $scope.showTips = false;
      }
    }

    $scope.qlxxExMh = {};
    $scope.qlxxExMhList = [];
    $scope.qlxxExMhList[0] = $scope.qlxxExMh;
    /*$scope.isGyjsydsyqjfwsyq_bgdj_flowCode = false; //变更登记
    $scope.isGyjsydsyqjfwsyq_zydj_flowCode = false; //转移登记
    $scope.isGyjsydsyqjfwsyq_gzdj_flowCode = false; //更正登记
    $scope.isDyqdj_scdj_flowCode = false; //抵押登记

		$scope.initInfo = function() {
			//申请人信息
			if(gyjsydsyqjfwsyq_bgdj_flowCode == $scope.qlxx.netFlowdefCode ||
				gyjsydsyqjfwsyq_bzdj_flowCode == $scope.qlxx.netFlowdefCode ||
				gyjsydsyqjfwsyq_hzdj_flowCode == $scope.qlxx.netFlowdefCode) { //变更登记、补正登记、换证登记
				isGyjsydsyqjfwsyq_bgdj_flowCode = true;
			} else if(gyjsydsyqjfwsyq_zydj_flowCode == $scope.qlxx.netFlowdefCode) { //转移登记
				$scope.isGyjsydsyqjfwsyq_zydj_flowCode = true;
			} else if(gyjsydsyqjfwsyq_gzdj_flowCode == $scope.qlxx.netFlowdefCode) { //更正登记
				$scope.isGyjsydsyqjfwsyq_gzdj_flowCode = true;
			} else if(dyqdj_scdj_flowCode == $scope.qlxx.netFlowdefCode) {
				$scope.isDyqdj_scdj_flowCode = true;
			}
		}*/

    //zhoushaotao 2020/02/20 feat：添加证书邮寄功能 start
    //获取办理时间列表
    $scope.timeDatas = $dictUtilsService.getDictinaryByType('上门时间').childrens;
    $scope.timeData = {};
    $scope.initTime = function() {
      if ($scope.timeDatas != undefined && $scope.timeDatas != null && $scope.timeDatas.length > 0) {
        $scope.timeData = $scope.timeDatas[0];
        $scope.timeDatas[0].isChecked = true;
        if ($scope.smqjData.senderAddress != null && $scope.smqjData.senderAddress != undefined &&
          $scope.smqjData.senderAddress.timeInterval != undefined && $scope.smqjData.senderAddress.timeInterval !=
          null) {
          for (var i = 0; i < $scope.timeDatas.length; i++) {
            var timeDataTemp = $scope.timeDatas[i];
            timeDataTemp.isChecked = false;
            if ($scope.smqjData.senderAddress.timeInterval == timeDataTemp.value) {
              timeDataTemp.isChecked = true;
              $scope.timeData = timeDataTemp;
            }
          }
        }
      }
    };
    $scope.selectTime = function(timeData) {
      $scope.timeData = timeData;
      if ($scope.timeDatas != undefined && $scope.timeDatas != null && $scope.timeDatas.length > 0) {
        for (var i = 0; i < $scope.timeDatas.length; i++) {
          var timeDataTemp = $scope.timeDatas[i];
          timeDataTemp.isChecked = false;
          if (timeData.value == timeDataTemp.value) {
            timeDataTemp.isChecked = true;
          }
        }
      }
    }
    //获取当前办事大厅信息
    $scope.bsdtData = {};
    $scope.getBsdtData = function() {
      $qyglService.findByOfficeCode({
        officeCode: $wysqService.djsqItemData.bsdt
      }).then(function (res) {
        if (res.success) {
          $scope.bsdtData = res.data;
        } else {
          showAlert("获取办事大厅失败");
        }
      }, function (error) {
        showAlert("获取办事大厅失败");
      });
    };
    $scope.getBsdtData();
    $scope.needZsyj = supportZsyj;
    //从服务器获取到的证书邮寄地址信息
    $scope.exPressInfo = {};
    //证书邮寄数据,qzfs(SELF_TAKING,EXPRESS):从办事大厅获取证书的方式,deliveryAddress:邮寄地址
    $scope.zsyjData = { 'qzfs': '', 'deliveryAddress': {}, 'showAddButton': false, 'showAddress': false };
    //保存证书邮寄信息
    $scope.saveZsyjData = function () {
      var result = true;
      var param = $scope.zsyjData.deliveryAddress;
      if (param == null || param == undefined) {
        result = false;
        return result;
      }
      param.ywh = $wysqService.djsqItemData.wwywh;
      param.flowName = $wysqService.djsqItemData.flowname;
      param.postType = 'ZSYJ';
      if ($scope.exPressInfo != null) {
        param.id = $scope.exPressInfo.id;
      }
      $menuService.saveExpressInfo(param).then(function (res) {
        if (res.success) {
          $scope.getZsyjData();
          // showAlert('保存证书邮寄信息成功');
        }
      }, function (res) {
        // showAlert('保存证书邮寄信息失败');
        console.log(res)
      });
      return result;
    }
    $scope.qzfs = null;
    $scope.initRadioButton = function () {
      $scope.qzfs = $scope.qlxx.qzfs;
      var selects = document.getElementsByName("qzfsType");
      if ($scope.qzfs == null) {
        $scope.qzfs = 'EXPRESS';
      }
      for (var i = 0; i < selects.length; i++) {
        if ($scope.qzfs == selects[i].value) {
          selects[i].checked = true;
          break;
        }
      }
      $scope.isShowAll = false;
      if ($scope.qzfs == "EXPRESS") {
        $scope.isShowAll = true;
      }
      $scope.getZsyjData();//获取证书邮寄数据
      $scope.getSmqjData();//获取上门取件数据
    }
    //初始化证书邮寄数据
    $scope.initZsyjData = function () {
      if ($scope.qzfs == 'EXPRESS' && $scope.zsyjData.deliveryAddress == null) {
        $scope.zsyjData.showAddButton = true;
      } else if ($scope.qzfs == 'EXPRESS' && $scope.zsyjData.deliveryAddress != null) {
        $scope.zsyjData.showAddress = true;
      }
    }
    //获取证书邮寄数据
    $scope.getZsyjData = function () {
      if ($wysqService.djsqItemData.wwywh != undefined && $wysqService.djsqItemData.wwywh != null) {
        $menuService.findByYwhAndPostType({ 'ywh': $wysqService.djsqItemData.wwywh, 'postType': 'ZSYJ' })
          .then(function (res) {
            if (res.success) {
              $scope.exPressInfo = angular.copy(res.data);
              $scope.zsyjData.deliveryAddress = res.data;
            }
            //初始化证书邮寄数据
            $scope.initZsyjData();
          },
            function (Error) {
              //初始化证书邮寄数据
              $scope.initZsyjData();
              $scope.showAlert('刷新不动产信息失败');
            });
      }
    }
    // 选择取证方式

    $scope.isShowAll = false;
    $scope.selectMethod = function (value) {
      $scope.qzfs = value;
      $scope.isShowAll = false;
      if (value == "EXPRESS") {
        $scope.isShowAll = true;
      }
      $scope.initZsyjData();
      $scope.initSmqjData();
    }
    //从地址列表返回返回并且刷新
    $rootScope.$on('to-bdcxx', function (event, args) {
      //证书邮寄
      if (addressLabel == 'ZSYJ') {
        //从地址列表返回
        $scope.zsyjData.showAddButton = false;
        $scope.zsyjData.showAddress = true;
        var receiveData = {};
        // 收件人姓名（证书邮寄必填）
        receiveData.receiverName = args.address.shr;
        // 收件人联系电话（证书邮寄必填）
        receiveData.receiverPhone = args.address.sjhm;
        //收件省（证书邮寄必填）
        receiveData.receiverProvince = args.address.szs;
        //收件市（证书邮寄必填）
        receiveData.receiverCity = args.address.szsq;
        //收件区（证书邮寄必填）
        receiveData.receiverArea = args.address.szqx;
        //收件详细地址（证书邮寄必填）
        receiveData.receiverAddr = args.address.szxqdz;
        $scope.zsyjData.deliveryAddress = receiveData;
      } else if (addressLabel == 'SMQJ') {
        //从地址列表返回
        $scope.smqjData.showAddButton = false;
        $scope.smqjData.showAddress = true;
        var senderData = {};
        //寄件人姓名（上门取件必填）
        senderData.senderName = args.address.shr;
        //寄件人联系电话（上门取件必填）
        senderData.senderPhone = args.address.sjhm;
        //寄件省（上门取件必填）
        senderData.senderProvince = args.address.szs;
        //寄件市（上门取件必填）
        senderData.senderCity = args.address.szsq;
        //寄件区（上门取件必填）
        senderData.senderArea = args.address.szqx;
        //寄件详细地址（上门取件必填）
        senderData.senderAddr = args.address.szxqdz;
        $scope.smqjData.senderAddress = senderData;
      }
    });
    var addressLabel = '';
    $scope.goAddress = function (param) {
      addressLabel = param;
      $state.go('myAddress');
    }
    //zhoushaotao 2020/02/20 feat：添加证书邮寄功能 end

    //zhoushaotao 2020/02/25 feat：上门取件 start
    //从服务获取的上门取件数据
    $scope.exPressInfoSmqj = {};
    //纸质资料邮寄数据
    //上门取件数据,qzfs(SELF_TAKING,EXPRESS):从办事大厅获取证书的方式,deliveryAddress:邮寄地址
    $scope.smqjData = { 'qzfs': '', 'senderAddress': {}, 'showSmqjInfo': false, 'showAddButton': false, 'showAddress': false };
    //保存上门取件信息
    $scope.saveSmqjData = function () {
      var result = true; 
      var param = $scope.smqjData.senderAddress;
      if (param != null) {
        param.ywh = $wysqService.djsqItemData.wwywh;
        param.flowName = $wysqService.djsqItemData.flowname;
        param.postType = 'SMQJ';
        param.timeInterval = $scope.timeData.value;
        if ($scope.exPressInfoSmqj != null) {
          param.id = $scope.exPressInfoSmqj.id;
        }
        $menuService.saveExpressInfo(param).then(function (res) {
          if (res.success) {
            $scope.getSmqjData();
            // showAlert('保存上门取件信息成功');
          }
        }, function (res) {
          // showAlert('保存证书邮寄信息失败');
          console.log(res)
        });
        return result;
      } else {
        showAlert('请选择上门地址');
        result = false;
        return result;
      }
    }
    //初始化上门取件数据
    $scope.initSmqjData = function () {
      if ($scope.qzfs == 'EXPRESS' && $scope.smqjData.senderAddress == null) {
        $scope.smqjData.showAddButton = true;
        $scope.smqjData.showSmqjInfo = true;
        $scope.smqjData.showAddress = false;
        document.getElementById("checkBoxSmqj").checked = true;
      } else if ($scope.qzfs == 'EXPRESS' && $scope.smqjData.senderAddress != null) {
        $scope.smqjData.showSmqjInfo = true;
        $scope.smqjData.showAddress = true;
      }
    }
    //获取上门取件数据
    $scope.getSmqjData = function () {
      if ($wysqService.djsqItemData.wwywh != undefined && $wysqService.djsqItemData.wwywh != null) {
        $menuService.findByYwhAndPostType({ 'ywh': $wysqService.djsqItemData.wwywh, 'postType': 'SMQJ' })
          .then(function (res) {
            if (res.success) {
              $scope.exPressInfoSmqj = angular.copy(res.data);
              $scope.smqjData.senderAddress = res.data;
            }
            $scope.initTime();
            //初始化证书邮寄数据
            $scope.initSmqjData();
          },
            function (Error) {
              //初始化证书邮寄数据
              $scope.initZsyjData();
              $scope.showAlert('刷新不动产信息失败');
            });
      }
    }
    $scope.onClickCheckbox = function () {
      var isShow = $scope.smqjData.showSmqjInfo;
      var smChecked = document.getElementById("checkBoxSmqj").checked;
      console.log(smChecked)
      if (smChecked == true) {
        $scope.pdsmqj = true;
      } else {
        $scope.pdsmqj = false;
      }
      console.log($scope.pdsmqj)
      if (isShow) {
        document.getElementById("checkBoxSmqj").checked = false;
        $scope.smqjData.showSmqjInfo = false;
      } else {
        document.getElementById("checkBoxSmqj").checked = true;
        $scope.smqjData.showSmqjInfo = true;
      }
    }
    //zhoushaotao 2020/02/25 feat：上门取件 end

    //模板选择
    $scope.bdcqzhMbData = $dictUtilsService.getBdcqzhMb();
    for (var i = 0; i < $scope.bdcqzhMbData.length; i++) {
      var model = $scope.bdcqzhMbData[i];
      if (model.name.indexOf('其他') != -1 || model.name.indexOf('二维码') != -1) {
        continue;
      }
      if (model.name.indexOf("***") == 0) {
        //先去掉开头的“***”，再用***分割
        var name = model.name.replace("***", "");
        model.keyWords = name.split("***");
      } else {
        model.keyWords = model.name.split("***");
      }
    }
    $scope.needShowMb = true;

    //获取不动产权证号
    function getbdcqzh() {
      var result = "";
      if ($scope.needShowMb) {
        if ($scope.bdcqzhMbData != undefined && $scope.bdcqzhMbData.length > 0) {
          for (var i = 0; i < $scope.bdcqzhMbData.length; i++) {
            var model = $scope.bdcqzhMbData[i];
            if (model.isSelected) {
              if (model.name.indexOf('其他') != -1 || model.name.indexOf('二维码') != -1) {
                result = $scope.bdcqzhMbData[3].inputs[0];
                return result;
              } else {
                result = model.name;
                for (var j = 0; j < model.inputs.length; j++) {
                  var input = model.inputs[j];
                  result = result.replace("***", input);
                }
                return result;
              }
            }
          }
        }
      } else {
        return $scope.qlxxExMh.bdcqzh;
      }
    }

    //是否分别持证
    $scope.sffbczData = [{
      "label": '是',
      "value": true
    }, {
      "label": '否',
      "value": false
    }];
    $scope.sffbczClass = $scope.sffbczData[1];
    $scope.bdcxx.qlxxEx.sffbcz = $scope.sffbczClass.value;
    $scope.checkSffbcz = function(value) {
      for (var i = 0; i < $scope.sffbczData.length; i++) {
        if (value === $scope.sffbczData[i].value) {
          $scope.sffbczClass = $scope.sffbczData[i];
          $scope.bdcxx.qlxxEx.sffbcz = $scope.sffbczClass.value;
        }
      }
    }
    //是否分多本证
    $scope.sfdbzClass = $scope.sffbczData[1];
    $scope.bdcxx.qlxxEx.sfdbz = $scope.sfdbzClass.value;
    $scope.checkSfdbz = function(value) {
      for (var i = 0; i < $scope.sffbczData.length; i++) {
        if (value === $scope.sffbczData[i].value) {
          $scope.sfdbzClass = $scope.sffbczData[i];
          $scope.bdcxx.qlxxEx.sfdbz = $scope.sfdbzClass.value;
        }
      }
    }

    //通过业务号获取业务信息，只需要接收ywh即可
    if ($stateParams.ywh != null) {
      $wysqService.queryApplyByYwh({
        // wwywh: $stateParams.ywh
        wwywh: $wysqService.djsqItemData.wwywh
      }).then(function(res) {
        if (res.success) {
          $scope.qlxx = {};
          $scope.qlxx = res.data;
          $wysqService.djsqItemData = res.data;
          //$scope.bdcxx = $scope.qlxx;
          if ($scope.qlxx.children[0].qlxxEx !== null) {
            /*							$scope.bdcxx.fwcqmj = $scope.qlxx.qlxxEx.fwcqmj;
													$scope.bdcxx.gfhtbh = $scope.qlxx.qlxxEx.gfhtbh;
													$scope.bdcxx.fwjyjg = $scope.qlxx.qlxxEx.fwjyjg;
													//转移登记
													$scope.bdcxx.jyjg = $scope.qlxx.qlxxEx.jyjg; //交易价格
													$scope.bdcxx.gfhtbh = $scope.qlxx.qlxxEx.gfhtbh; //购房合同编号
													$scope.bdcxx.gfhtqdrq = $scope.qlxx.qlxxEx.gfhtqdrq;
																			//换算时间格式
													$scope.bdcxx.gfhtqdrq = new Date($scope.qlxx.qlxxEx.gfhtqdrq); //购房合同签订日期

            $scope.checkSffbcz($scope.qlxx.qlxxEx.sffbcz); //初始化是否分别持证
            $scope.bdcxx.sqdjyy = $scope.qlxx.qlxxEx.sqdjyy; //申请登记原因 */

            // $scope.qlxxExMh.fwcqmj = $scope.qlxx.children[0].qlxxExMhs[0].fwcqmj;
            // console.log("$scope.qlxxExMh.fwcqmj is " + $scope.qlxxExMh.fwcqmj);
            //							$scope.bdcxx.qlxxEx.gfhtbh = $scope.qlxx.qlxxEx.gfhtbh;
            //							$scope.qlxxExMh.fwjyjg = $scope.qlxx.qlxxEx.fwjyjg;
            //转移登记
            //							$scope.qlxxExMh.fwjyjg = $scope.qlxx.qlxxEx.fwjyjg; //交易价格
            //							$scope.bdcxx.qlxxEx.gfhtbh = $scope.qlxx.qlxxEx.gfhtbh; //购房合同编号
            //							$scope.bdcxx.qlxxEx.gfhtqdrq = $scope.qlxx.qlxxEx.gfhtqdrq; //换算时间格式
            //							$scope.setDatePlaceHolder();

            /*if($scope.bdcxx.qlxxEx.gfhtbh){
            	$scope.bdcxx.qlxxEx.gfhtqdrq = new Date($scope.qlxx.qlxxEx.gfhtqdrq);
            }*/
            /*if($scope.qlxx.qlxxEx.sffbcz == undefined || $scope.qlxx.qlxxEx.sffbcz == null || $scope.qlxx.qlxxEx.sffbcz == "") {
            	$scope.qlxx.qlxxEx.sffbcz = true;
            }*/
            $scope.checkSffbcz($scope.qlxx.children[0].qlxxEx.sffbcz); //初始化是否分别持证
            $scope.checkSfdbz($scope.qlxx.children[0].qlxxEx.sfdbz); //初始化是否多本证

            if ($scope.qlxx.children[0].qlxxEx.sqdjyy) {
              $scope.bdcxx.qlxxEx.sqdjyy = $scope.qlxx.children[0].qlxxEx.sqdjyy; //申请登记原因
            }
            if ($scope.qlxx.bdcqzh != undefined && $scope.qlxx.bdcqzh != null && $scope.qlxx.bdcqzhh != "") {
              $scope.needShowMb = false;
            }
          } else {
            $scope.checkSffbcz(false); //初始化是否分别持证
            $scope.checkSfdbz(false); //初始化是否多本证
            //							$scope.bdcxx.qlxxEx.gfhtqdrq = new Date();
            //							$scope.setDatePlaceHolder();
          }
          if ($scope.qlxx.children[0].qlxxExMhs != undefined && $scope.qlxx.children[0].qlxxExMhs != null) {
            if ($scope.qlxx.children[0].qlxxExMhs[0].bdcqzh != undefined && $scope.qlxx.children[0].qlxxExMhs[0]
              .bdcqzh != null) {
              $scope.qlxxExMh.bdcqzh = $scope.qlxx.children[0].qlxxExMhs[0].bdcqzh; //不动产权证号
              $scope.needShowMb = false;
            }
            $scope.qlxxExMh.bdcdyh = $scope.qlxx.children[0].qlxxExMhs[0].bdcdyh;
            $scope.qlxxExMh.zlProvince = $scope.qlxx.children[0].qlxxExMhs[0].zlProvince;
            $scope.qlxxExMh.zlCity = $scope.qlxx.children[0].qlxxExMhs[0].zlCity;
            $scope.qlxxExMh.zlArea = $scope.qlxx.children[0].qlxxExMhs[0].zlArea;
            $scope.qlxxExMh.zl = $scope.qlxx.children[0].qlxxExMhs[0].zl;
            $scope.qlxxExMh.fwcqmj = $scope.qlxx.children[0].qlxxExMhs[0].fwcqmj;
            console.log(JSON.stringify($scope.qlxx.children[0].qlxxExMhs))
            $scope.qlxxExMh.fwjyjg = $scope.qlxx.children[0].qlxxExMhs[0].fwjyjg;
          }
          if (supportZsyj) {
            $scope.initRadioButton(); //初始化RadioButton按钮
          }
          //					$scope.initInfo(); //初始化信息
        } else {
          showAlert('获取不动产信息失败');
        }
      }, function(res) {
        showAlert('获取不动产信息失败');
      });
    }

    /*$scope.setDatePlaceHolder = function(){
    	var dateinput = document.getElementById("date");
    	if($scope.bdcxx.qlxxEx.gfhtqdrq!=null||$scope.bdcxx.qlxxEx.gfhtqdrq!=''||$scope.bdcxx.qlxxEx.gfhtqdrq!=""){
    		$(dateinput).addClass('full');
    	}
    }*/

    //验证变更登记数据保存信息
    function verifyDataBgdj() {
      var canSave = false;
      if ($scope.qlxxExMh.bdcqzh == undefined || $scope.qlxxExMh.bdcqzh === null || $scope.qlxxExMh.bdcqzh === "") {
        showAlert("请输入正确的不动产权证号");
      } else if (!checkCQZH()) {
        showAlert("产权证号输入不完整！");
      } else if ($scope.qlxxExMh.zl == undefined || $scope.qlxxExMh.zl === null || $scope.qlxxExMh.zl === "") {
        showAlert("请输入不动产坐落");
      } else if (!$dictUtilsService.number($scope.qlxxExMh.fwcqmj) || $scope.qlxxExMh.fwcqmj == undefined || $scope
        .qlxxExMh.fwcqmj === "" || $scope.qlxxExMh.fwcqmj === "0") {
        showAlert("请输入正确的房屋产权面积");
      } else if ($scope.bdcxx.qlxxEx.sqdjyy == undefined || $scope.bdcxx.qlxxEx.sqdjyy === "") {
        showAlert("请输入申请登记原因");
      } else {
        canSave = true;
      }
      return canSave;
    }

    //验证转移登记数据保存信息
    function verifyDataZydj() {
      var canSave = false;
      if ($scope.qlxxExMh.bdcqzh == undefined || $scope.qlxxExMh.bdcqzh === null || $scope.qlxxExMh.bdcqzh === "") {
        showAlert("请输入正确的不动产权证号");
      } else if (!checkCQZH()) {
        showAlert("产权证号输入不完整！");
      } else if (!($scope.qlxxExMh.bdcdyh == undefined || $scope.qlxxExMh.bdcdyh === null || $scope.qlxxExMh.bdcdyh ===
          "") &&
        !$dictUtilsService.UnitNo($scope.qlxxExMh.bdcdyh)) {
        showAlert("请输入正确的不动产单元号");
      } else if ($scope.qlxxExMh.zl == undefined || $scope.qlxxExMh.zl === null || $scope.qlxxExMh.zl === "") {
        showAlert("请输入不动产坐落");
      } else if (!$dictUtilsService.number($scope.qlxxExMh.fwcqmj) || $scope.qlxxExMh.fwcqmj == undefined || $scope
        .qlxxExMh.fwcqmj === "" || $scope.qlxxExMh.fwcqmj === "0") {
        showAlert("请输入正确的房屋产权面积");
      } else if ($scope.bdcxx.qlxxEx.sqdjyy == undefined || $scope.bdcxx.qlxxEx.sqdjyy === "") {
        showAlert("请输入申请登记原因");

      }
      /*else if(!$dictUtilsService.number($scope.qlxxExMh.fwjyjg) || $scope.qlxxExMh.fwjyjg == undefined || $scope.qlxxExMh.fwjyjg === null || $scope.qlxxExMh.fwjyjg === "" || $scope.qlxxExMh.fwjyjg === "0") {

			showAlert(  "请输入正确的交易价格");
		}*/
      else {
        canSave = true;
      }
      return canSave;
    }
    //验证房屋_预告登记-预售商品房买卖预告登记
    verifyDataYgdj = function() {
      var canSave = false;
      /*if(!($scope.qlxxExMh.bdcdyh == undefined || $scope.qlxxExMh.bdcdyh === null || $scope.qlxxExMh.bdcdyh === "")&&!$dictUtilsService.UnitNo($scope.qlxxExMh.bdcdyh)){
        $scope.showAlert( "请输入正确的不动产单元号");
      }else*/
      if ($scope.qlxxExMhList.zl == undefined || $scope.qlxxExMhList.zl === null || $scope.qlxxExMhList.zl === "") {
        $scope.showAlert("请输入不动产坐落");
      } else if (!$dictUtilsService.number($scope.qlxxExMhList.fwcqmj) || $scope.qlxxExMhList.fwcqmj == undefined ||
        $scope.qlxxExMhList.fwcqmj === "") {
        $scope.showAlert("请输入正确的房屋产权面积");
      } else if (!($scope.qlxxExMhList.fwjyjg == undefined || $scope.qlxxExMhList.fwjyjg === null || $scope.qlxxExMhList
          .fwjyjg === "") && !$dictUtilsService.number($scope.qlxxExMhList.fwjyjg)) {
        $scope.showAlert("请输入正确的交易价格");
      } else if ($scope.bdcxx.qlxxEx.sqdjyy == undefined || $scope.bdcxx.qlxxEx.sqdjyy === "") {
        $scope.showAlert("请输入申请登记原因");
      } else {
        canSave = true;
      }
      return canSave;
    }

    //检验产权证号每个空档是否都输入了
    function checkCQZH() {
      for (var i = 0; i < $scope.bdcqzhMbData.length; i++) {
        if ($scope.bdcqzhMbData[i].name.indexOf('其他') == -1 && $scope.bdcqzhMbData[i].name.indexOf('二维码') == -1 &&
          $scope.bdcqzhMbData[i].isSelected) {
          for (var j = 0; j < $scope.bdcqzhMbData[i].inputs.length; j++) {
            var input = $scope.bdcqzhMbData[i].inputs[j];
            if (input == '' || input == "" || input == null) {
              return false;
            }
          }
        }
      }
      return true;
    }

    function showAlert(msg) {
      ionicToast.show(msg, "middle", false, 2000);
    }

    //保存不动产信息
    $scope.saveAndNext = function() {
      $scope.qlxxExMh.bdcqzh = getbdcqzh();
      $scope.bdcxx.id = $scope.qlxx.id; //权利信息唯一ID
      $scope.bdcxx.qlxxExMhList = $scope.qlxxExMhList;
      if ($scope.pdsmqj == true) {
        if ($scope.smqjData.senderAddress== "" || $scope.smqjData.senderAddress== null) {
          showAlert('请输入上门取件的详细地址');
          return;
        }
      }
      //过滤器格式化
      //$scope.bdcxx.gfhtqdrq = $filter('date')($scope.bdcxx.gfhtqdrq, 'yyyy-MM-dd');
      if ((gyjsydsyqjfwsyq_bgdj_flowCode == $scope.qlxx.netFlowdefCode ||
          gyjsydsyqjfwsyq_hzdj_flowCode == $scope.qlxx.netFlowdefCode ||
          gyjsydsyqjfwsyq_bzdj_flowCode == $scope.qlxx.netFlowdefCode ||
          gyjsydsyqjfwsyq_gzdj_flowCode == $scope.qlxx.netFlowdefCode ||
          gyjsydsyqjfwsyq_zxdj_flowCode == $scope.qlxx.netFlowdefCode ||
          dyqdj_zxdj_flowCode == $scope.qlxx.netFlowdefCode) && verifyDataBgdj()) {
        addbdcxxServer(true);
      }
      if (gyjsydsyqjfwsyq_zydj_flowCode == $scope.qlxx.netFlowdefCode && verifyDataZydj()) {
        addbdcxxServer(true);
      }
    }

    $scope.savebdcxx = function() {
      $scope.qlxxExMh.bdcqzh = getbdcqzh();
      $scope.bdcxx.id = $scope.qlxx.id; //权利信息唯一ID
      $scope.bdcxx.qlxxExMhList = $scope.qlxxExMhList;
      if ($scope.pdsmqj == true) {
        if ($scope.smqjData.senderAddress== "" || $scope.smqjData.senderAddress== null) {
          showAlert('请输入上门取件的详细地址');
          return;
        }
      }
      //过滤器格式化
      if ((gyjsydsyqjfwsyq_bgdj_flowCode == $scope.qlxx.netFlowdefCode ||
          gyjsydsyqjfwsyq_gzdj_flowCode == $scope.qlxx.netFlowdefCode ||
          dyqdj_zxdj_flowCode == $scope.qlxx.netFlowdefCode) && verifyDataBgdj()) {
        addbdcxxServer(false);
      }
      if ((gyjsydsyqjfwsyq_zydj_flowCode == $scope.qlxx.netFlowdefCode ||
          gyjsydsyqjfwsyq_hzdj_flowCode == $scope.qlxx.netFlowdefCode ||
          gyjsydsyqjfwsyq_bzdj_flowCode == $scope.qlxx.netFlowdefCode) &&
        verifyDataZydj()) { //转移登记
        addbdcxxServer(false);
      }
      if (ygdj_ysspfmmygdj_flowCode == $scope.qlxx.netFlowdefCode && verifyDataYgdj()) { //预售商品房买卖预告登记
        addbdcxxServer(false);
      }
    }

    /**
     * 保存/提交不动产信息到服务器
     */
    function addbdcxxServer(goNextStep) {
      console.log("bdcxx is " + JSON.stringify($scope.bdcxx));
      var param = {
        qlxxChildDtoList: [{
          qlxxEx: {
            sqdjyy: $scope.bdcxx.qlxxEx.sqdjyy,
            sffbcz: $scope.bdcxx.qlxxEx.sffbcz,
            sfdbz: $scope.bdcxx.qlxxEx.sfdbz
          },
          //					bdcdjzmh: $scope.yz.bdcqzmh,
          // "qlxxEx": {
          // 		"fwcqmj":$scope.bdcxx.bdcmj,
          // 		"zwlxjssj": bdcxx.zwlxzzsj,
          // 		"zwlxqssj": bdcxx.zwlxqssj
          // 	  },
          qlxxExMhs: [{
            bdcdyh: $scope.qlxxExMh.bdcdyh,
            bdcqzh: $scope.qlxxExMh.bdcqzh,
            zl: $scope.qlxxExMh.zl,
            fwcqmj: $scope.qlxxExMh.fwcqmj,
            fwjyjg: $scope.qlxxExMh.fwjyjg,
            zlArea: $scope.qlxxExMh.zlArea,
            zlCity: $scope.qlxxExMh.zlCity,
            zlProvince: $scope.qlxxExMh.zlProvince
          }],
          qzfs: $scope.qzfs,
          ywh: $wysqService.djsqItemData.ywh[0],

        }],
        qzfs: $scope.qzfs,
        wwywh: $wysqService.djsqItemData.wwywh
      }
      $wysqService.addbdcxx(param).then(function(res) { 
        showAlert('保存不动产信息成功');
        //保存不动产信息成功之后保存证书邮寄信息
        if ($scope.qzfs == 'EXPRESS' && supportZsyj) {
          //保存证书邮寄数据
          if (!$scope.saveZsyjData()) {
            showAlert('请添加邮寄地址');
            return;
          }
         //保存上门取件数据
        //  $scope.saveSmqjData();
        if (!$scope.saveSmqjData()) {
          showAlert('请选择上门取件地址');
          return;
          }
        }
        if (goNextStep) {
          refreshAndNextStep();
        } else {
          refresh();
        }
      }, function(res) {
        console.log(JSON.stringify(res))
        showAlert(res.message);
      });
    }
    refresh = function() {
      $wysqService.queryApplyByYwh({
          wwywh: $wysqService.djsqItemData.wwywh
        })
        .then(function(res) {
            if (res.success) {
              $wysqService.djsqItemData = res.data;
              //$scope.goback();
            }
          },
          function(Error) {
            $scope.showAlert('刷新不动产信息失败');
          });

    };
    refreshAndNextStep = function() {
      $wysqService.queryApplyByYwh({
          wwywh: $wysqService.djsqItemData.wwywh
        })
        .then(function(res) {
            if (res.success) {
              $wysqService.djsqItemData = res.data;
              $scope.stepTwoFinished = true;
              $wysqService.stepInfo.two = true; //第二步完成
              $state.go('fjxz', {
                subFlowcode: $scope.qlxx.subFlowcode,
                id: $scope.qlxx.id
              }, {
                reload: true
              });
            }
          },
          function(Error) {
            $scope.showAlert('刷新不动产信息失败');
          });

    };
    //下一步按钮
    //		$scope.save = $wysqService.bdcxxNext;

    //返回
    $scope.goback = function() {
      $ionicHistory.goBack();
    }

    function setUnSelected() {
      if ($scope.bdcqzhMbData != undefined && $scope.bdcqzhMbData.length > 0) {
        for (var i = 0; i < $scope.bdcqzhMbData.length; i++) {
          $scope.bdcqzhMbData[i].isSelected = false;
        }
      }
    }

    if (platform == "mobile") {
      //调用二维码扫描
      $scope.scanStart = function() {
        $cordovaBarcodeScanner.scan().then(function(barcodeData) {
          if (barcodeData.cancelled) {
            //						console.log(barcodeData.cancelled);
          } else {
            $scope.barcodeData = barcodeData; // Success! Barcode data is here
            /*					var Request=new UrlSearch($scope.barcodeData.text);
            					if(Request.subCode){
            						$loginService.subCode = Request.subCode;
            						$loginService.ywh = Request.ywh;
            						$state.go('fjxzsm');
            					}
            					else{
            						showAlert('扫描结果','请选择正确的上传文件二维码！');
            					}*/
            var result = $scope.barcodeData.text;
            var str = result.split("$");
            $scope.bdcqzhMbData[3].inputs[0] = str[2];
            $scope.$apply();
            //showAlert('扫描结果',$scope.barcodeData);
          }
        }, function(error) {
          showAlert('扫描结果', '扫描失败！');
        });
      };
    } else {
      //调用二维码扫描
      $wysqService.signature({
        url: signatureUrl
      }).then(function(res) {
        wx.config({
          debug: false,
          appId: res.data.appId,
          timestamp: res.data.timestamp,
          nonceStr: res.data.nonceStr,
          signature: res.data.signature,
          jsApiList: [
            'scanQRCode'
          ],
        });
      }, function(res) {
        showAlert('网络请求失败！');
      });
      wx.ready(function() {
        $scope.scanStart = function() {
          wx.scanQRCode({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function(res) {
              var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
              var str = result.split("$");
              $scope.bdcqzhMbData[3].inputs[0] = str[2];
              $scope.$apply();
            }
          });
        }
      });
      wx.error(function() {
        showAlert('签名失败！');
      });
    }

    //选择产权证书类别
    $scope.checkBdcqzhMb = function() {
      $ionicActionSheet.show({
        cancelOnStateChange: true,
        cssClass: 'action_s',
        titleText: "请选择产权证书类别",
        addCancelButtonWithLabel: '取消',
        androidEnableCancelButton: true,
        buttons: [{
          text: $scope.bdcqzhMbData[0].name
        }, {
          text: $scope.bdcqzhMbData[1].name
        }, {
          text: $scope.bdcqzhMbData[2].name
        }, {
          text: $scope.bdcqzhMbData[4].name
        }, {
          text: $scope.bdcqzhMbData[3].name
        }],
        cancelText: '取消',
        cancel: function() {
          return true;
        },
        buttonClicked: function(index) {
          switch (index) {
            case 0:
              //设置没有被选中
              setUnSelected();
              $scope.bdcqzhMbData[0].isSelected = true;
              break;
            case 1:
              //设置没有被选中
              setUnSelected();
              $scope.bdcqzhMbData[1].isSelected = true;
              break;
            case 2: //设置没有被选中
              setUnSelected();
              $scope.bdcqzhMbData[2].isSelected = true;
              break;
            case 3: //设置没有被选中
              setUnSelected();
              $scope.bdcqzhMbData[3].isSelected = true;
              $scope.scanStart();
            case 4: //设置没有被选中
              setUnSelected();
              $scope.bdcqzhMbData[3].isSelected = true;
            default:
              break;
          }
          return true;
        }
      });
    }

    //初始化申请登记原因
    $scope.bdcxx.qlxxEx.sqdjyy = $wysqService.getApplyReason();


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
      $menuService.level3FlowCode = $scope.qlxx.subFlowcode;
      $state.go('bsznDetail');
    }

    //2019.7.22新增坐落选择
    $scope.gotoZlxz = function() {
      if ($scope.isShow) {
        $state.go('zlxz');
      }
    }
    $rootScope.$on('zlxz', function(event, args) {
      $scope.qlxxExMh.zl = args.zl;
      $scope.qlxxExMh.zlArea = args.zlArea;
      $scope.qlxxExMh.zlCity = args.zlCity;
      $scope.qlxxExMh.zlProvince = args.zlProvince;
    });
    //2019.7.22新增坐落选择

    //2020.4.9 chenweida 新增纸质清单数据获取 start
    $scope.getzzqdList = function() {
      $wysqService.getfjlxlist({
          subCode: $wysqService.djsqItemData.subFlowcode
        })
        .then(function(res) {
          if (res.success) {
            $wysqService.fjlxlist = res.data;
            $scope.fjzlList = $wysqService.fjlxlist;
            $scope.isShowZzqd = !$scope.isShowZzqd;
            console.log($wysqService.fjlxlist);
            console.log($scope.isShowZzqd);
          }
        }, function(res) {
          $scope.showAlert('验证附件材料失败!');
        });
    };
    //2020.4.9 chenweida 新增纸质清单数据获取 end
  }
]);
