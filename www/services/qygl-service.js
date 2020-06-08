angular.module('qyglService', ['ngResource']).factory('$qyglService', ['$gmRestful', function($gmRestful) {
	var result = {
		queryWorkOffice: function(params) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.get(RESTURL.qygl.queryWorkOffice, params);
			return pPromise;
		},
		findByDjjg: function(params) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.get(RESTURL.qygl.findByDjjg, params);
			return pPromise;
		},
		//获取所有机构
		getOrganizationTree: function(params) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.get(RESTURL.qygl.getOrganizationTree, params);
			return pPromise;
		},
		findByOfficeCode: function(params) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.get(RESTURL.qygl.findByOfficeCode, params);
			return pPromise;
		}
	};
	return result;
}]);