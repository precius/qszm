angular.module('fmsService', ['ngResource']).factory('$fmsService', ['$gmRestful', function($gmRestful) {
	var result = {
		//根据FileID从Fms中获取附件信息
		findFileById: function(params) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.get(RESTURL.fms.findFileById, params);
			return pPromise;
		}
	};
	return result;
}]);