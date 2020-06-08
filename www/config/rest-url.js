//rest请求配置
window.RESTURL = {
  evaluation: {
    getByServiceId: internetEstateServer + "evaluateController/getByServiceId",
    saveEvaluate: internetEstateServer + "evaluateController/saveEvaluate"
  },
  login: {
    login: internetEstateServer + 'userInfoController/getLoginUser',
    dictInfo: internetEstateServer + 'uumsController/getDictTree',
    permissionInfo: internetEstateServer + 'uumsController/getPermByAreaCode',
    existUserPhoneOrName: internetEstateServer + 'userInfoController/existsUserByNameOrPhone' //根据手机号或用户名判断是否已经注册
  },
  register: {
    code: internetEstateServer + 'thirdServiceController/addAuthCodeSample',
    register: internetEstateServer + 'userInfoController/registerUserinfo',
    phoneCode: internetEstateServer + 'thirdServiceController/sendAuthCodeMsg'
  },
  appointment: {
    //  	djyyList: internetEstateServer + 'userOperatorController/findByCondition',//预约信息列表
    djyyList: internetEstateServer + 'api/appointment/getAppointmentPgaeList', //预约信息列表
    wdyy: internetEstateServer + 'userOperatorController/insertMakeAnAppointment', //预约信息保存
    wdyyPersonInfo: internetEstateServer + 'userOperatorController/insertPersonalInformation', //预约信息保存
    cancelWdyy: internetEstateServer + 'api/appointment/cancelAppointment', //取消预约信息
    yysl: internetEstateServer + 'userOperatorController/getCurrentAppointmentInfo', //获取预约数量
    isHoliday: internetEstateServer + 'uumsController/isHoliday', //是否是节假日
    inWorkday: internetEstateServer + 'uumsController/calculateDateSkipHoliday', //是否在工作日
    checkEnable: internetEstateServer + 'api/appointment/ifDuplicate',
    wdyyDetail: internetEstateServer + 'api/appointment/getAppointmentInfoByCode' //获取预约详情
  },
  sqrxx: {
    sqrxx: internetEstateServer + 'registerController/saveQlrAndYwr',
    delQlr: internetEstateServer + 'api/registerflow/deleteRightHolder', //删除指定ID的权利人
    delYwr: internetEstateServer + 'api/registerflow/deleteObligor', //删除指定ID的义务人
    printApply: internetEstateServer + 'estatePrintController/printApply' //根据业务号获取申请书
  },
  me: {
    getVersionInfo: internetEstateServer + "fileUploadController/appNewAndValid", //获取服务器版本信息
    certification: internetEstateServer + 'userInfoController/authUserinfo', //实名验证
    FaceVerifyByUserId: verify + 'faceverify/getFaceVerifyByUserId', //发起身份认证
    FaceVerifyResult: verify + 'faceverify/getFaceVerifyResult', //身份认证结果（true or false）
    saveBase64File: verify + 'faceverify/saveBase64File', //提交认证照片，等待审核
    passwordModify: internetEstateServer + 'userInfoController/modifyUserinfoPwd', //修改密码
    modifyUserinfoByTel: internetEstateServer + 'userInfoController/modifyUserinfoByTel', //找回密码
    phoneModify: internetEstateServer + 'userInfoController/modifyUserinfoPhone', //修改手机号
    mongoDbUserInfo: internetEstateServer + 'userInfoController/findUser', //从MongoDB中获取个人信息实名认证
    menu: internetEstateServer + 'api/appMenu/tree', //获取菜单树
    matchSubflow: internetEstateServer + 'api/appMenu/matchSubflow', //根据最后一级菜单id和区域code查询对应的流程信息
    getSubFlowConfigInfo: internetEstateServer + 'api/process/getSubFlowConfigDetail', //根据流程信息id查询三级流程详细信息
    initiate: internetEstateServer + 'api/doorToDoor/initiate', //提交上门预约信息
    getsmyylist: internetEstateServer + 'api/doorToDoor/listByOptions', //获取上门预约列表
    getdetailsById: internetEstateServer + 'api/doorToDoor/detailsById', //根据id查询上门预约详情
    cancel: internetEstateServer + 'api/doorToDoor/cancel', //根据id取消上门预约
    update: internetEstateServer + 'api/doorToDoor/update', //更新上门预约
    saveWechatFile: internetEstateServer + 'fileUploadController/saveWechatFile', //将微信上的图片保存到fms
    front_verify: internetEstateServer + 'front_verify', //神思ocr身份证信息识别
    front_verifyVideo: internetEstateServer + 'front_verifyVideo', //神思视频人脸识别
    front_verifyPoliceTwo: thirdServer + 'iden/idenOnePeoConfirm', //公安部二要素认证
    front_verifyPolice: thirdServer + 'iden/getVerify', //公安部三要素认证
    changeBsdt: internetEstateServer + 'api/registerflow/changeBsdt', //修改办事大厅
    isInBlackList: verify + 'userInfoController/inBlackList', //判断是否在黑名单中
    suggest: internetEstateServer + 'userOperatorController/saveGuestNote',
    baidu_ocr: internetEstateServer + 'uploadfileConfigController/baiDuOcrInfo', //调用百度OCR获取Access Token
    getCertifyCard: internetEstateServer + 'userTokenController/getCertifyCard',
    updateCertifyCard: internetEstateServer + 'userTokenController/updateCertifyCard',
    getGuestNoteList: internetEstateServer + 'userOperatorController/getGuestNoteList' //获取投诉建议列表
  },
  address: {
    queryAddress: internetEstateServer + '/uumsController/getAreasByAreaCode', //城市选择
    queryJg: internetEstateServer + '/uumsController/getMapByCode', //获取区域名机构名
    queryJgByAreaId: internetEstateServer + '/uumsController/getOrgsByAreaId', //根据区域ID获取该区域下的机构树
    queryFlow: internetEstateServer + '/flowDefController/getFlowDefConfigPhone', //根据登记机构和不动产类型获取子流程
    getSubFlowList: internetEstateServer + '/api/process/getSubFlowList', //根据登记机构获取所有子流程
    queryBsdt: internetEstateServer + '/workOfficeController/getWorkOffice', //获取办事大厅
    getyysjlist: internetEstateServer + 'api/appointment/getAppointmentCount', //根据登记机构和办事大厅获取已预约数量
    addAppointmentInfo: internetEstateServer + 'api/appointment/addAppointmentInfo', //提交预约信息
    AreaId: internetEstateServer + 'api/workOffice/getWorkOfficeByAreaId', //获取办事大厅坐标
    getBsznDetail: internetEstateServer + 'flowDefController/getFlowGuidanceBySubcfgId',
    getBsznDetailByCode: internetEstateServer + 'flowDefController/getFlowGuidanceBySubcfgCode',
    getUploadFile: internetEstateServer + 'flowDefController/getUploadFilesBySubcfgId',
    getUploadFileByCode: internetEstateServer + 'flowDefController/getUploadFilesBySubcfgCode',//根据三级流程code查询材料列表
    getArea: internetEstateServer + 'uumsController/getAreasListById', //根据id获取下一级区域列表
    getTree: internetEstateServer + 'uumsController/tree', //获取全国区域
    getBsdtByKey: internetEstateServer + 'workOfficeController/findBydjjgAndName', //根据关键字获取办事大厅
    getBsdtByJgmcAndOfficeName: internetEstateServer + 'workOfficeController/findByJgmcAndOfficeName',
    viewUploadFile: internetEstateServer + 'fileUploadController/viewUploadFile' //根据文件id获取材料示例
  },
  apply: {
    queryApply: internetEstateServer + '/registerController/getApplyById', //获取指定ID的申请
    queryApplyByYwh: internetEstateServer + '/api/registerflow/getProcessInfo', //获取指定外网业务号的申请
    getProcessInfoByWwyyhAndTel: internetEstateServer + '/api/registerflow/getProcessInfoByWwyyhAndTel', //根据外网业务号和手机号获取业务信息
    deleteApplyByYwh: internetEstateServer + '/api/registerflow/deleteProcessInfo', //根据WWYWH删除指定业务信息
    revertApplyById: internetEstateServer + '/api/registerflow/rejectProcess', //根据ID撤回指定业务信息
    realPropertyCertificateNumberCheck: internetEstateServer +
      'registerController/realPropertyCertificateNumberCheck', //验证不动产权证号
    getRealEstateInfo: internetEstateServer + 'registerController/getRealEstateInfo' //根据不动产权证号获取不动产信息
  },
  dictionary: {
    queryDictByType: internetEstateServer + '/uumsController/getDict' //获取指定ID的申请
  },
  qszm: {
    queryWorkOffice: internetEstateServer + '/workOffice/getWorkOfficeByAreaId', //根据区县ID获取办事大厅
    queryOfficeName: internetEstateServer + '/workOfficeController/getWorkOffice', //查询办事大厅
    queryQszm: internetEstateServer + 'checkCertifyController/checkCertifyInspect', //提交权属证明查询接口
    queryAll: internetEstateServer + 'checkCertifyController/getCheckCertifies', //根据用户名查询已提交的权属证明查询
    queryQszmFalse: internetEstateServer + 'checkCertifyController/getCheckCertifyQrCode', //权属证明查询PDF文档二维码扫描确定真伪
    queryBdcdjzsFalse: internetEstateServer + 'checkCertifyController/getDyaDzzzQrCode', //不动产权登记证书PDF文档二维码扫描确定真伪
  },
  qygl: { //区域管理
    queryWorkOffice: internetEstateServer + '/api/workOffice/getWorkOfficeByAreaId', //根据区县ID获取办事大厅
    findByDjjg: internetEstateServer + 'workOfficeController/findByDjjg',
    getOrganizationTree: internetEstateServer + 'uumsController/getOrganizationTree', //获取所有机构
    findByOfficeCode: internetEstateServer + "workOfficeController/findByOfficeCode" //根据办事大厅代码获取办事大厅信息
  },
  signature: {
    signature: internetEstateServer + 'uploadfileConfigController/getWxMonitor'
  },
  fms: {
    findFileById: fmsServer + 'file/findFileById'
  },
  //发起申请流程中，一些借口地址
  sqlc: {
    //根据不动产权证号获取不动产信息 hewen 03.27
    getBdcxxByBdcqzh: internetEstateServer + 'dataExchangeController/getBdcxxByBdcqzh',
    //根据预告证明号获取不动产信息
    getEstateInfoByForecastCertificateNumber: internetEstateServer +
      'dataExchangeController/getEstateInfoByForecastCertificateNumber',
    //根据抵押证明号获取不动产信息
    getEstateInfoByMortgageCertificateNumber: internetEstateServer +
      '/dataExchangeController/getEstateInfoByMortgageCertificateNumber',
    //根据合同编号获取不动产信息
    getEstateInfoByContractNumber: internetEstateServer + '/dataExchangeController/getEstateInfoByContractNumber',
    // 不动产权证号/证明号验证 hewen 03.27
    checkBdcqxxByBdcqzhOrZmh: internetEstateServer + 'dataExchangeController/checkBdcqxxByZh'
  },
  yj: { //邮寄
    saveOrUpdateAddress: internetEstateServer + 'userOperatorController/saveOrUpdateAddress', //保存修改地址信息
    deleteAddress: internetEstateServer + 'userOperatorController/deleteAddress', //删除地址信息
    getAddressByUserId: internetEstateServer + 'userOperatorController/getAddressByUserId', //根据用户id获取收获地址列表
    findByYwhAndPostType: internetEstateServer + 'api/express/findByYwhAndPostType', //根据外网业务号和邮寄类型获取邮寄信息详情
    saveExpressInfo: internetEstateServer + 'api/express/saveExpressInfo', //保存快递订单信息
  },
  xwbl: {
    getInquiryRecordByYwh: internetEstateServer + 'InquiryRecordController/getInquiryRecordByYwh', //通过业务号查询询问笔录详情
    saveInquiryRecord: internetEstateServer + 'InquiryRecordController/save', //保存询问笔录信息
  }

};
