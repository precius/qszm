angular.module('wyyyService', ['ngResource']).factory('$wyyyService', ['$gmRestful', function($gmRestful) {
	var result = {
		smyyData:null,
		//办事大厅信息
		bsdt: {},
		//选择的预约事项
		yysx: '',
		yysxChoosable: true,
		//选择的预约事项id
		yysxid: '',
		//选择的预约的时间
		yysj: {
			date: '请选择预约时间',
			week: '',
			time: ''
		},
		//预约事项的大类
		ywlx:'', 
		//是否需要重置预约时间
		shouldResetYysj:false,
		wxyy: false,
		yyxm: "",
		yyhm: "",
		yyjg: {},
		//预约详情
		wdyyDetail: function(params) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.get(RESTURL.appointment.wdyyDetail, params);
			return pPromise;
		},
		wdyy: function(playload) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.post(RESTURL.appointment.wdyy, null, playload);
			return pPromise;
		},
		wdyyPersonInfo: function(playload) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.post(RESTURL.appointment.wdyyPersonInfo, null, playload);
			return pPromise;
		},
		cancelWdyy: function(playload) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.post(RESTURL.appointment.cancelWdyy, null, playload);
			return pPromise;
		},
		djyyList: function(params) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.get(RESTURL.appointment.djyyList, params);
			return pPromise;
		},
		//获取预约数量
		yysl: function(params) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.get(RESTURL.appointment.yysl, params);
			return pPromise;
		},
		/**
		 * @method isHoliday 是否是节假日
		 * @param {Object} selectedDay 日期
		 * @return {Boolean}
		 */
		isHoliday: function(selectedDay) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.get(RESTURL.appointment.isHoliday, selectedDay);
			return pPromise;
		},
		/**
		 * @method inWorkday 15个工作日内
		 * @param {Object} selectedDay 日期
		 * @return {Boolean}
		 */
		inWorkday: function(days) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.get(RESTURL.appointment.inWorkday, days);
			return pPromise;
		},
		//根据登记机构获取子流程预约事项列表
		getSubFlowList: function(params) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.get(RESTURL.address.getSubFlowList, params);
			return pPromise;
		},
		//获取手机验证码
		getPhoneCode: function(playload) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.post(RESTURL.register.phoneCode, null, playload);
			return pPromise;
		},
		//根据登记机构获取子流程预约事项列表
		getyysjlist: function(params) {
			var pRestful = new $gmRestful();
//			var pPromise = pRestful.get(RESTURL.address.getyysjlist, params);
			var pPromise = pRestful.get(internetEstateServer+'api/appointment/getNewAppointmentCount', params);
			return pPromise;
		},
		//提交预约信息
		addAppointmentInfo: function(playload) {
			var pRestful = new $gmRestful();	
//			var pPromise = pRestful.post(RESTURL.address.addAppointmentInfo, null, playload);
			var pPromise = pRestful.post(internetEstateServer+'api/appointment/addNewAppointmentInfo', null, playload);
			return pPromise;
		},
		checkEnable: function(params) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.post(RESTURL.appointment.checkEnable, null, params);
			return pPromise;
		},
		//2019/11/6 新增 获取预约事项的接口，数据结构分3级，从后台配置
		getYysx: function(params) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.get(internetEstateServer+'api/appointment/getYyxxConfigByDjjg', params);
			return pPromise;
		},
		//获取时间段配置（甘肃新增接口，类似数据字典）
		getSjdDic: function(params) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.get(internetEstateServer+'workOfficeController/getSjdByOfficeCode', params);
			return pPromise;
		}
	};
	return result;
}]);