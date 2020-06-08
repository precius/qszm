angular.module('wysqService', ['ngResource']).factory('$wysqService', ['$gmRestful', function($gmRestful) {
  var result = {
    qlrPageTitle: '', //权利人页面标题
    ywrPageTitle: '', //义务人页面标题
    //预审时限
    yssx: '',
    //单条申请信息办理状态
    blzt: '',
    //所有申请信息
    djsqListData: {},
    //单条ID申请信息
    djsqItemData: {},
    //不动产信息
    bdcxxData: {},
    //附件类型列表
    fjlxlist: {},
    //根据业务号获取的附件列表
    fjlist: [],
    //权利人或者义务人按份共有的权利比例和
    num: -1,
    //是否是业务流程主申请人
    isMainApplicant: true,
    //记录点击申请流程中点击下一步按钮返回的次数
    clickNextTimes: 0,
    //我要申请里面的所有申请人信息
    qlrlist: [], //权利人集合
    ywrlist: [], //义务人集合
    dyrlist: [], //抵押人集合
    zwrlist: [], //债务人集合
    //pageStack: [],//保存页面跳转信息的栈, 申请主界面 - 申请人信息 - 不动产信息 - 附件上传界面 4个界面跳转控制
    stepByStep: false, //是否按步骤填写申请信息, 首页发起申请则按步骤填写,从"我的申请"进入,则不需要按步骤走
    interruptNextStep: false, //是否强制中断下一步,如从步骤1234 走完之后到了申请信息界面,再从申请信息界面进入123界面时,不再显示下一步,避免用户一直循环操作
    //判断按顺序走流程步骤是否完成  1 申请人信息 2 不动产信息 3 附件信息 4 发起认证然后提交申请
    stepInfo: {
      one: false,
      two: false,
      three: false,
      four: false
    },
    saveSqxx: function(payload) {
      var pRestful = new $gmRestful();
      var pPromise = pRestful.post(internetEstateServer + 'api/registerflow/addProcessInfo', null, payload);
      return pPromise;
    },
    //获取权利人信息列表
    getqlrlist: function(params) {
      var pRestful = new $gmRestful();
      var pPromise = pRestful.get(internetEstateServer + 'registerController/getQlrsByQlxxId', params);
      return pPromise;
    },
    //复制申请
    copyProcessInfo: function(params) {
      var pRestful = new $gmRestful();
      var pPromise = pRestful.post(internetEstateServer + 'api/registerflow/copyProcessInfo', null, params);
      return pPromise;
    },
    //获取义务人信息列表
    getywrlist: function(params) {
      var pRestful = new $gmRestful();
      var pPromise = pRestful.get(internetEstateServer + 'registerController/getYwrsByQlxxId', params);
      return pPromise;
    },
    //根据权利人ID获取权利人信息
    getqlrByqlrId: function(params) {
      var pRestful = new $gmRestful();
      var pPromise = pRestful.get(internetEstateServer + 'api/registerflow/getRightHolder', params);
      return pPromise;
    },
    //根据义务人ID获取义务人信息
    getywrByywrId: function(params) {
      var pRestful = new $gmRestful();
      var pPromise = pRestful.get(internetEstateServer + 'api/registerflow/getObligor', params);
      return pPromise;
    },
    addqlr: function(payload) {
      var pRestful = new $gmRestful();
      var pPromise = pRestful.post(internetEstateServer + 'api/registerflow/addRightHolder', null, payload);
      return pPromise;
    },
    addywr: function(payload) {
      var pRestful = new $gmRestful();
      var pPromise = pRestful.post(internetEstateServer + 'api/registerflow/addObligor', null, payload);
      return pPromise;
    },
    //批量添加权利人 hewen 03.27
    addqlrList: function (params) {
      var pRestful = new $gmRestful();
      var pPromise = pRestful.post(internetEstateServer + 'api/registerflow/addRightHolderBatch',null, params,false,{
          contentType: 'json'
        });
      return pPromise;
    },
    //批量添加义务人 hewen 03.27
    addywrList: function (params) {
      var pRestful = new $gmRestful();
      var pPromise = pRestful.post(internetEstateServer + 'api/registerflow/addObligorBatch',null, params,false,{
          contentType: 'json'
        });
      return pPromise;
    },
    //判断权利人义务人是否重复
    judgeDuplicate: function(payload) {
      var pRestful = new $gmRestful();
      var pPromise = pRestful.post(internetEstateServer + 'api/registerflow/judgeDuplicate', null, payload,
        false, {
          contentType: 'json'
        });
      return pPromise;
    },
    addbdcxx: function(payload) {
      var pRestful = new $gmRestful();
      var pPromise = pRestful.post(internetEstateServer + 'api/registerflow/modifyProcessInfo', null, payload,
        true, {
          contentType: 'json'
        });
      return pPromise;
    },
    updateQlr: function(payload) {
      var pRestful = new $gmRestful();
      var pPromise = pRestful.post(internetEstateServer + 'api/registerflow/modifyRightHolder', null, payload);
      return pPromise;
    },
    updateYwr: function(payload) {
      var pRestful = new $gmRestful();
      var pPromise = pRestful.post(internetEstateServer + 'api/registerflow/modifyObligor', null, payload);
      return pPromise;
    },
    //获取申请信息列表
    getSqList: function(params) {
      var pRestful = new $gmRestful();
      if (this.isMainApplicant) { //是主申请人,去查看自己发起的申请
        var pPromise = pRestful.get(internetEstateServer + 'api/registerflow/getProcessInfoPageList', params);
      } else { //其他人发起得申请,但添加了你作为申请人
        var pPromise = pRestful.get(internetEstateServer + 'api/registerflow/getByProcessInfoList', params);
      }

      return pPromise;
    },
    uploadfile: function(payload) {
      var pRestful = new $gmRestful();
      var pPromise = pRestful.post(fmsServer + 'file/uploadFileByBase64', null, payload);
      return pPromise;
    },
    savefile: function(payload) {
      var pRestful = new $gmRestful();
      var pPromise = pRestful.post(internetEstateServer + 'fileUploadController/saveFileUploadInfo', null,payload,false,{
          contentType: 'json'
        });
      return pPromise;
    },
    //更新业务库中的文件信息
    updateFileInfo: function(payload) {
      var pRestful = new $gmRestful();
      var pPromise = pRestful.post(internetEstateServer + 'fileUploadController/updateFileInfo', null,payload,false,{
          contentType: 'json'
        });
      return pPromise;
    },
    //根据文件fileid获取文件（图片）
    getfileList: function(params) {
      var pRestful = new $gmRestful();
      var pPromise = pRestful.get(fmsServer + 'file/findFileById', params);
      return pPromise;
    },
    //根据文件fileid删除文件（图片）
    delFileById: function(params) {
      var pRestful = new $gmRestful();
      var pPromise = pRestful.get(fmsServer + 'file/delFileById', params);
      return pPromise;
    },
    //获取当前时间
    getSystemTime: function() {
      var pRestful = new $gmRestful();
      var pPromise = pRestful.get(internetEstateServer + 'uumsController/getSystemTime');
      return pPromise;
    },
    //根据业务号获取所有材料信息
    getFj: function(payload) {
      var pRestful = new $gmRestful();
      var pPromise = pRestful.post(internetEstateServer + 'fileUploadController/getUploadFilesCurrent', null,
        payload);
      return pPromise;
    },
    //根据文件id删除文件信息
    deleteUploadFile: function(payload) {
      var pRestful = new $gmRestful();
      var pPromise = pRestful.post(internetEstateServer + 'fileUploadController/deleteUploadFile', null,
        payload);
      return pPromise;
    },
    //通过区域代码获取区域名和机构名
    queryJg: function(params) {
      var pRestful = new $gmRestful();
      var pPromise = pRestful.get(RESTURL.address.queryJg, params);
      return pPromise;
    },
    //通过区域ID获取区域名和机构名(树形结构)
    queryJgByAreaId: function(params) {
      var pRestful = new $gmRestful();
      var pPromise = pRestful.get(RESTURL.address.queryJgByAreaId, params);
      return pPromise;
    },
    //通过登记机构代码获取办事大厅
    queryBsdt: function(params) {
      var pRestful = new $gmRestful();
      var pPromise = pRestful.get(RESTURL.address.queryBsdt, params);
      return pPromise;
    },
    //获取流程
    queryFlow: function(params) {
      var pRestful = new $gmRestful();
      var pPromise = pRestful.get(RESTURL.address.queryFlow, params);
      return pPromise;
    },
    //根据登记机构获取子流程
    getSubFlowList: function(params) {
      var pRestful = new $gmRestful();
      var pPromise = pRestful.get(RESTURL.address.getSubFlowList, params);
      return pPromise;
    },
    //获取指定ID的申请
    queryApply: function(params) {
      var pRestful = new $gmRestful();
      var pPromise = pRestful.get(RESTURL.apply.queryApply, params);
      return pPromise;
    },
    //获取指定ywh的申请
    queryApplyByYwh: function(params) {
      var pRestful = new $gmRestful();
      var pPromise = pRestful.get(RESTURL.apply.queryApplyByYwh, params);
      return pPromise;
    },
    //根据外网业务号和手机号获取业务信息
    getProcessInfoByWwyyhAndTel: function(params) {
      var pRestful = new $gmRestful();
      var pPromise = pRestful.get(RESTURL.apply.getProcessInfoByWwyyhAndTel, params);
      return pPromise;
    },
    //根据ywh删除申请信息
    deleteApplyByYwh: function(params) {
      var pRestful = new $gmRestful();
      var pPromise = pRestful.post(RESTURL.apply.deleteApplyByYwh, params);
      return pPromise;
    },
    //根据Id撤销网上申请信息
    revertApplyById: function(params) {
      var pRestful = new $gmRestful();
      var pPromise = pRestful.post(RESTURL.apply.revertApplyById, params);
      return pPromise;
    },
    //根据子流程code获取附件类型列表
    getfjlxlist: function(params) {
      var pRestful = new $gmRestful();
      var pPromise = pRestful.get(internetEstateServer + 'flowDefController/getUploadFilesBySubcfgCode',
        params);
      return pPromise;
    },
    //删除指定ID的权利人
    delQlr: function(payload) {
      var pRestful = new $gmRestful();
      var pPromise = pRestful.post(RESTURL.sqrxx.delQlr, null, payload);
      return pPromise;
    },
    //删除指定ID的义务人
    delYwr: function(payload) {
      var pRestful = new $gmRestful();
      var pPromise = pRestful.post(RESTURL.sqrxx.delYwr, null, payload);
      return pPromise;
    },

    //通知所有申请人认证
    notifyEveryone: function(params) {
      var pRestful = new $gmRestful();
      var pPromise = pRestful.get(internetEstateServer + '/registerController/sendMsgToQlrAndYwr', params);
      return pPromise;
    },
    //完成申请
    completeApply: function(params) {
      var pRestful = new $gmRestful();
      var pPromise = pRestful.get(internetEstateServer + 'registerController/completeApply', params);
      return pPromise;
    },
    //根据业务号获取pdf申请书
    printApply: function(payload) {
      var pRestful = new $gmRestful();
      var pPromise = pRestful.post(RESTURL.sqrxx.printApply, null, payload);
      return pPromise;
    },
    //获取微信签名参数
    signature: function(params) {
      var pRestful = new $gmRestful();
      var pPromise = pRestful.get(RESTURL.signature.signature, params);
      return pPromise;
    },
    //从申请流程业务数据中通过对比登陆保存的个人信息,获取本人的权利人信息或者义务人信息
    getMineYwInfo: function() {
      var applicantList = [];
      if (this.djsqItemData.children[0].qlrs != null && this.djsqItemData.children[0].qlrs.length > 0) {
        applicantList = applicantList.concat(angular.copy(this.djsqItemData.children[0].qlrs)); //先将所有权利人添加到集合
      };
      if (this.djsqItemData.children[0].ywrs != null && this.djsqItemData.children[0].ywrs.length > 0) {
        applicantList = applicantList.concat(angular.copy(this.djsqItemData.children[0].ywrs)); //所有义务人也添加到总的集合中
      }
      var applicantTargetList = [];
      if (applicantList != null) {
        for (var i = 0; i < applicantList.length; i++) {
          if (applicantList[i].qlrmc != null && applicantList[i].qlrmc != '') {
            applicantList[i].name = applicantList[i].qlrmc;
          } else {
            applicantList[i].name = applicantList[i].ywrmc;
          }
          var applicant = applicantList[i];
          if (applicant.name == mongoDbUserInfoFather.userinfo.name && applicant.zjh == mongoDbUserInfoFather
            .userinfo.zjh) {
            applicantTargetList.push(applicant);
          } /* else if (mongoDbUserInfoFather.userinfo.name == applicant.dlrmc && mongoDbUserInfoFather.userinfo
            .zjh ==
            applicant.dlrzjh) {
            applicantTargetList.push(applicant);
          } */
        }

        if (applicantTargetList.length > 0) {
          var identityVerified = true; //当代理人登录账号时,用来控制是否显示认证的按钮的
          for (var j = 0; j < applicantTargetList.length; j++) {
            if (applicantTargetList[j].category != '6' && applicantTargetList[j].category != '11' &&
              applicantTargetList[j].qlrlx == '1' && (!applicantTargetList[j].xwbl||!applicantTargetList[j].sfsprz)) {
              identityVerified = false;
            }
          }
          applicantTargetList[0].identityVerified = identityVerified;
          return applicantTargetList[0];
        }
      }

      return null;
    },
    //判断是否所有申请人都认证了
    judgeAllPeoleIdentityVerified: function($scope) {
      var applicantList = [];
      if (this.djsqItemData.children[0].qlrs != null && this.djsqItemData.children[0].qlrs.length > 0) {
        applicantList = applicantList.concat(angular.copy(this.djsqItemData.children[0].qlrs)); //先将所有权利人添加到集合
      };
      if (this.djsqItemData.children[0].ywrs != null && this.djsqItemData.children[0].ywrs.length > 0) {
        applicantList = applicantList.concat(angular.copy(this.djsqItemData.children[0].ywrs)); //所有义务人也添加到总的集合中
      }
      if (applicantList != null) {
        for (var i = 0; i < applicantList.length; i++) {
          var applicant = applicantList[i];
          if (applicant.qlrlx != '1') { //非个人都跳过认证校验
            continue;
          }
          if (applicant.category == '6' || applicant.category == '11') { //债务人都跳过认证校验
            continue;
          }
          if (!applicant.xwbl || !applicant.sfsprz) {
            // if (applicant.dlrmc) {
            //   $scope.showAlert('代理人' + applicant.dlrmc + '未完成认证!'); //提示代理人未认证
            // } else {
              $scope.showAlert(applicant.name + '未完成认证!'); //提示申请人本人未认证
            // }
            return false;
          }
        }
      }

      return true;
    },
    //获取所有申请人列表,所有权利人义务人,且经过去重处理
    getAllApplicant:function(){
      var allApplicantTemp = [];
      if (this.djsqItemData.children[0].qlrs != null && this.djsqItemData.children[0].qlrs.length > 0) {
        allApplicantTemp = allApplicantTemp.concat(angular.copy(this.djsqItemData.children[0].qlrs)); //先将所有权利人添加到集合
      };
      if (this.djsqItemData.children[0].ywrs != null && this.djsqItemData.children[0].ywrs.length > 0) {
        allApplicantTemp = allApplicantTemp.concat(angular.copy(this.djsqItemData.children[0].ywrs)); //所有义务人也添加到总的集合中
      }
      //为每个申请人赋值 name
      for (var i = 0; i < allApplicantTemp.length; i++) {
        if (allApplicantTemp[i].qlrmc != null && allApplicantTemp[i].qlrmc != '') {
          allApplicantTemp[i].name = allApplicantTemp[i].qlrmc;
        } else {
          allApplicantTemp[i].name = allApplicantTemp[i].ywrmc;
        }
      }
      var applicantArrayResult = [];
      //遍历申请人数组,每一个申请人之间互相对比
      for (var i = 0; i < allApplicantTemp.length; i++) {
        var applicant = allApplicantTemp[i];
        var exist = false;

        for (var j = 0; j < applicantArrayResult.length; j++) {
          // 1 两个申请人名字和证件号相同 需要去重
          if (applicant.name == applicantArrayResult[j].name && applicant.zjh == applicantArrayResult[j].zjh) {
            exist = true;
          }
        }
        if (!exist) {
          applicantArrayResult.push(applicant);
        }
      }
      return applicantArrayResult;
    },

    /**
     * 获取所有申请人,并且去重,(变更登记中有权利人和义务人存在相同的人)
     * 将qlrmc(权利人名称)和ywrmc(义务人名称)全都赋值到name属性中
     * 每个人新增identityVerified字段,sfsprz(是否视频认证)和xwbl都为true时,表示认证通过
     */
    getVerifiedList: function() {
      var allApplicantTemp = [];
      if (this.djsqItemData.children[0].qlrs != null && this.djsqItemData.children[0].qlrs.length > 0) {
        allApplicantTemp = allApplicantTemp.concat(angular.copy(this.djsqItemData.children[0].qlrs)); //先将所有权利人添加到集合
      };

      if (this.djsqItemData.children[0].ywrs != null && this.djsqItemData.children[0].ywrs.length > 0) {
        allApplicantTemp = allApplicantTemp.concat(angular.copy(this.djsqItemData.children[0].ywrs)); //所有义务人也添加到总的集合中
      }

      if (allApplicantTemp == null || allApplicantTemp.length == 0) {
        return allApplicantTemp;
      }
      //为每个申请人赋值 name 和 identityVerified和status
      for (var i = 0; i < allApplicantTemp.length; i++) {
        if (allApplicantTemp[i].qlrlx != '1' || allApplicantTemp[i].category == '6' || allApplicantTemp[i].category =='11') { //非个人类型显示无需认证
          allApplicantTemp[i].status = '无需认证';
          allApplicantTemp[i].identityVerified = true;
        } else {
          if (allApplicantTemp[i].sfsprz && allApplicantTemp[i].xwbl) {
            allApplicantTemp[i].identityVerified = true;
            allApplicantTemp[i].status = '已认证';
          } else {
            allApplicantTemp[i].identityVerified = false;
            allApplicantTemp[i].status = '未认证';
          };

        }

        if (allApplicantTemp[i].qlrmc != null && allApplicantTemp[i].qlrmc != '') {
          allApplicantTemp[i].name = allApplicantTemp[i].qlrmc;
        } else {
          allApplicantTemp[i].name = allApplicantTemp[i].ywrmc;
        }
      }
      /* --------------start-去重,所有申请人和代理人互相比较,获取需要认证的人员信息列表,认证状态有未认证/已认证/无需认证----------------*/

      var applicantArrayResult = [];
      //遍历申请人数组,每一个申请人之间互相对比代理人信息,dlrmc和dlrzjh,存在相同的则去掉
      for (var i = 0; i < allApplicantTemp.length; i++) {
        var applicant = allApplicantTemp[i];
        var exist = false;

        for (var j = 0; j < applicantArrayResult.length; j++) {
          // 1 两个申请人名字和证件号相同 并且都没有代理人 认证信息列表需要去重
          if (/* (applicant.dlrzjh ==null||applicant.dlrzjh=='')&&(applicantArrayResult[j].dlrzjh ==null||applicantArrayResult[j].dlrzjh=='')&& */
            applicant.name == applicantArrayResult[j].name && applicant.zjh == applicantArrayResult[j].zjh) {
            exist = true;
          }
          /* // 2 两个申请人的代理人名字和证件号相同, 认证信息列表需要去重
          if (applicant.dlrmc != null && applicant.dlrmc != ''&& applicantArrayResult[j].dlrmc != null && applicantArrayResult[j].dlrmc != ''&&
            applicant.dlrmc ==applicantArrayResult[j].dlrmc &&
            applicant.dlrzjh != null && applicant.dlrzjh != '' && applicantArrayResult[j].dlrzjh != null && applicantArrayResult[j].dlrzjh != ''&&
            applicant.dlrzjh ==applicantArrayResult[j].dlrzjh) {
             exist = true;
          }
          // 3 A申请人有代理人,B申请人无代理人, A的代理人与B相同, 认证信息列表需要去重
          if (applicant.dlrmc != null && applicant.dlrmc != ''&& (applicantArrayResult[j].dlrmc == null || applicantArrayResult[j].dlrmc == '')&&
            applicant.dlrmc ==applicantArrayResult[j].name &&
            applicant.dlrzjh != null && applicant.dlrzjh != '' && (applicantArrayResult[j].dlrzjh == null || applicantArrayResult[j].dlrzjh == '')&&
            applicant.dlrzjh ==applicantArrayResult[j].zjh) {
             exist = true;
          }
          // 4 A申请人无代理人,B申请人有申请人, A与B的代理人相同, 认证信息列表需要去重
          if ((applicant.dlrmc == null || applicant.dlrmc == '')&& applicantArrayResult[j].dlrmc != null && applicantArrayResult[j].dlrmc != ''&&
            applicant.name ==applicantArrayResult[j].dlrmc &&
            (applicant.dlrzjh == null || applicant.dlrzjh == '') && applicantArrayResult[j].dlrzjh != null && applicantArrayResult[j].dlrzjh != ''&&
            applicant.zjh ==applicantArrayResult[j].dlrzjh) {
             exist = true;
          } */
          if(exist){
            //去重之前认证状态做统一,统一原则:存在一个未认证的个人时,且不是债务人时,则统一成未认证状态
            if (applicant.qlrlx == '1' && applicant.category != '6' && applicant.category != '11') {
              if(applicant.identityVerified && applicantArrayResult[j].identityVerified){
                applicantArrayResult[j].status = '已认证';
                applicantArrayResult[j].identityVerified = true;
              }else{
                applicantArrayResult[j].status = '未认证';
                applicantArrayResult[j].identityVerified = false; //存在未认证的个人
              }
            }
          }
        }
        if (!exist) {
          applicantArrayResult.push(applicant);
        }
      }
      return applicantArrayResult;
      /* ---------------去重,所有申请人和代理人互相比较,获取需要认证的人员信息列表,认证状态有未认证/已认证/无需认证- end---------------*/
    },

    //判断申请人信息是否完善
    judgeApplicantFinished: function($scope) {
      if (this.djsqItemData == null) {
        $scope.showAlert('获取业务信息失败');
        return false;
      };
      var netFlowdefCode = this.djsqItemData.netFlowdefCode;
      //权利人列表
      var qlrlist = this.djsqItemData.children[0].qlrs;
      //义务人列表
      var ywrlist = this.djsqItemData.children[0].ywrs;
      //抵押人集合
      var dyrList = [];
      //债务人集合
      var zwrList = [];

      var isDY = false; //是否是抵押相关流程,如果是抵押相关流程则需要把义务人区分层 抵押人和债务人

      if (dyqdj_scdj_flowCode == netFlowdefCode || //抵押权首次登记
        dyqdj_zxdj_flowCode == netFlowdefCode || //抵押权注销登记
        ygdj_ysspfdyqygzxdj_flowCode == netFlowdefCode || //预抵押注销
        dyqdj_bgdj_flowCode == netFlowdefCode || //抵押权变更登记
        ygdj_ysspfdyqygdj_flowCode == netFlowdefCode) { //预抵押

        isDY = true;
        if (ywrlist != null && ywrlist.length > 0) {
          for (var i = 0; i < ywrlist.length; i++) {
            var ywr = ywrlist[i];
            if (ywr.category == 5 || ywr.category == 10) {
              dyrList[dyrList.length] = ywr;
            }
            if (ywr.category == 6 || ywr.category == 11) {
              zwrList[zwrList.length] = ywr;
            }
          }
        }
      };

      if (qlrlist == null || qlrlist.length == 0) {
        if (isDY) {
          $scope.showAlert('未添加抵押权人!');
        } else {
          $scope.showAlert('未添加权利人!');
        }

        return false;
      };

      if (gyjsydsyqjfwsyq_zxdj_flowCode != netFlowdefCode && //房屋所有权注销无义务人
          gyjsydsyqjfwsyq_bzdj_flowCode != netFlowdefCode && //补证登记无义务人
          gyjsydsyqjfwsyq_hzdj_flowCode != netFlowdefCode && //换证登记无义务人
        !isDY && (ywrlist == null || ywrlist.length == 0)) { //上面三种流程没有义务人正常,抵押相关流程义务人需要区分为抵押人和债务人,所以排除在外不判断义务人集合

        $scope.showAlert('未添加义务人!');
        return false;
      };

      if (isDY && (dyrList == null || dyrList.length == 0)) {
        $scope.showAlert('未添加抵押人!');
        return false;
      };

      /* if (isDY && (zwrList == null || zwrList.length == 0)) {
        $scope.showAlert('未添加债务人!');
        return false;
      }; */
      //以上代码都是判断是否集合为空,以下代码判断添加了人员但是共有方式是否合理
      if (isDY) {
        if (!this.judgeGyfs($scope, '抵押权人', qlrlist)) {
          return false; //抵押权人共有方式不合理
        }
        if (!this.judgeGyfs($scope, '抵押人', dyrList)) {
          return false; //抵押人共有方式不合理
        }
        if (zwrList != null && zwrList.length > 0 && !this.judgeGyfs($scope, '债务人', zwrList)) {
          return false; //债务人共有方式不合理
        }
        return true;
      } else {
        if (!this.judgeGyfs($scope, '权利人', qlrlist)) {
          return false; //权利人共有方式不合理
        }
        if (gyjsydsyqjfwsyq_zxdj_flowCode != netFlowdefCode && //房屋所有权注销无义务人
            gyjsydsyqjfwsyq_bzdj_flowCode != netFlowdefCode && //补证登记无义务人
            gyjsydsyqjfwsyq_hzdj_flowCode != netFlowdefCode && //换证登记无义务人
          !this.judgeGyfs($scope, '义务人', ywrlist)) {
          return false; //义务人共有方式不合理
        }
        return true;
      }
      return true;
    },
    //判断共有方式是否合理,或者共有比例是否达到了100
    judgeGyfs: function($scope, type, array) {
      if(array==null||array.length==0){
        return true;
      }
      var people = array[0];
      var gyfs = people.gyqk; //共有方式
      if (gyfs != undefined && gyfs != null) {
        if (gyfs.indexOf('共有') != -1 && array.length == 1) { //有三种共有方式,共同共有/按份共有/其他共有
          showAlert(type + '中缺少共有人,请继续添加' + type);
          return false;
        }
        if (gyfs.indexOf('共同借款') != -1 && array.length == 1) {
          showAlert(type + '中缺少共同借款人,请继续添加' + type);
          return false;
        }
        if (gyfs == '按份共有') {
          var total = 0;
          for (var a = 0; a < array.length; a++) {
            total += parseFloat(array[a].qlbl);
          }
          if (total < 100) {
            showAlert(type + '中按份共有人总比例不足100,请继续添加' + type);
            return false;
          }
          if (total > 100) {
            showAlert(type + '中按份共有人总比例超过100,请检查' + type + '持有比例');
            return false;
          }
          if (total = 100) {
            return true;
          }
        }
      }
      return true;

    },
    //判断不动产信息是否完善
    judgeBdcxxFinished: function($scope) {
      if (this.djsqItemData == null) {
        $scope.showAlert('获取业务信息失败');
        return false;
      };
      //如果是房屋_预告登记_预售商品房买卖预告登记和房屋_预告登记_预售商品房抵押权预告登记则不需要判断不动产权证号是否填写
      if (this.djsqItemData.netFlowdefCode == ygdj_ysspfmmygdj_flowCode || this.djsqItemData.netFlowdefCode ==
        ygdj_ysspfdyqygdj_flowCode) {
        return true;
      }
      if (this.djsqItemData.children[0].qlxxExMhs == null ||
        this.djsqItemData.children[0].qlxxExMhs.length == 0 ||
        this.djsqItemData.children[0].qlxxExMhs[0].bdcqzh == null ||
        this.djsqItemData.children[0].qlxxExMhs[0].bdcqzh == '') {

        $scope.showAlert('未填写不动产信息');
        return false;
      }
      return true;
    },
    //获取登记申请原因
    getApplyReason: function() {
      var form = formJson;
      for (var i = 0; i < form.length; i++) {
        if (this.djsqItemData.netFlowdefCode == form[i].code) {
          return form[i].applyReason;
        }
      }
      return "";
    },
    /**
     * @param {Object} ionicPopup : ionic自带插件，传递参数为$ionicPopup
     * @param {Object} state : ionic自带插件，传递参数为$istate
     * @param {Object} titleStr : 对话框标题
     * @param {Object} okText :对话框确定按钮名称
     * @param {Object} cancelText:对话框取消按钮名称
     * @param {Object} contentText :对话框显示内容
     */
    goHomePage: function(ionicPopup, state, titleStr, okText, cancelText, contentText) {
      var confirmPopup = ionicPopup.confirm({
        title: titleStr,
        okText: okText,
        cancelText: cancelText,
        content: contentText
      });
      confirmPopup.then(function(res) {
        if (res) {
          state.go('tab.home')
        }
      });
    }

  };
  return result;
}]);
