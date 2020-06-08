angular.module('loginService', ['ngResource']).factory('$loginService', ['$gmRestful', function($gmRestful) {
	var result = {
		subCode: '', //扫描得到的流程code 
		ywh: '', //扫描得到的外网业务号
		userdata: { id: '' },
		//跳转过来的页面id
		flag: 0,
		//登录
		login: function(params) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.get(RESTURL.login.login, params);
			return pPromise;
		},
		//获取字典
		getDict: function(params) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.get(RESTURL.login.dictInfo, params);
			return pPromise;
		},
		//找回密码
		forget: function(payload) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.post(RESTURL.login.forget, null, payload);
			return pPromise;
		},
		//根据区域代码和用户ID获取对应的功能权限
		getPermByAreaCode: function(params) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.get(RESTURL.login.permissionInfo, params);
			return pPromise;
		},
		//根据用户名或手机号判断用户名是否已经注册
		getRegisterStatusByNameOrPhone:function(params){
			var pRestful = new $gmRestful();
			var pPromise = pRestful.get(RESTURL.login.existUserPhoneOrName, params);
			return pPromise;
		},
		isInBlackList:function(params){
			var pRestful = new $gmRestful();
			var pPromise = pRestful.get(RESTURL.me.isInBlackList,params);
			return pPromise;
		}
	};
	return result;
}]);