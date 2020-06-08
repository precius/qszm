angular.module('evaluationService', ['ngResource']).factory('$evaluationService', ['$gmRestful', function($gmRestful) {
	var result = {
		//获取评价详情
		getByServiceId: function(params) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.get(RESTURL.evaluation.getByServiceId, params);
			return pPromise;
		},
		//提交评价
		saveEvaluate: function(params) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.post(RESTURL.evaluation.saveEvaluate, null, params);
			return pPromise;
		}
	};
	return result;
}]);