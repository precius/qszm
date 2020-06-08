angular.module('addressService', ['ngResource']).factory('$addressService', ['$gmRestful', function($gmRestful) {
	var result = {
		//默认当前区域已经上线
		isOnline : true,
		addressData: {},
		AreaId: "",
		//机构名称
		jgmc: "",
		//办事大厅名称
		officeName: "",
		hasPromptLocation : false,//记录首页是否已经提示过切换地区
		getBsdtByKey : function(params) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.get(RESTURL.address.getBsdtByKey, params);
			return pPromise;
		},
		getBsdtByJgmcAndOfficeName : function(params) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.get(RESTURL.address.getBsdtByJgmcAndOfficeName, params);
			return pPromise;
		},	
		queryAddress: function(params) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.get(RESTURL.address.queryAddress, params);
			return pPromise;
		},
		//根据区域id获取办事大厅id
		queryAreaId: function(params) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.get(RESTURL.address.AreaId, params);
			return pPromise;
		},
		//获取省份列表
		getArea: function(params) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.get(RESTURL.address.getArea, params);
			return pPromise;
		},
		getTree: function(params){
			var pRestful = new $gmRestful();
			var pPromise = pRestful.get(RESTURL.address.getTree, params);
			return pPromise;			
		}
	};
	return result;
}]);