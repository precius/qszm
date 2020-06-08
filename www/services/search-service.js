angular.module('searchService', ['ngResource']).factory('$searchService', ['$gmRestful', function($gmRestful) {
	var result = {
		//证书查验
		zscy: function(payload) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.get(internetEstateServer + 'checkCertifyController/getCertifiesHistory',payload);
			return pPromise;
		},
		//证书验证
		zsyz: function(payload) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.post(internetEstateServer + 'checkCertifyController/certificateInspect',null,payload);
			return pPromise;
		},
		
		//证书验证结果查询
		zsyzjg: function(payload) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.get(internetEstateServer + 'checkCertifyController/getCertifiesResult',payload);
			return pPromise;
		},
		//根据用户名和查询类型获取列表
		getAll: function(params){
            	var pRestful = new $gmRestful();
                var pPromise = pRestful.get(internetEstateServer + 'checkCertifyController/getCheckCertifies',params);
                return pPromise;
       	},
       	//根据查询编号取消查询
       	del: function(params){
            	var pRestful = new $gmRestful();
                var pPromise = pRestful.get(internetEstateServer + 'checkCertifyController/cancelCheckCertifies',params);
                return pPromise;
       	},
       	//权属证明真伪查询
		zwcx: function(payload) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.get(internetEstateServer + 'checkCertifyController/getCertifiesTureOrNot',payload);
			return pPromise;
		},
		//权属证明查看(打印PDF)
		qszmpdf: function(payload) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.post(internetEstateServer + 'estatePrintController/printQszm',null,payload);
			return pPromise;
		},
		//快递鸟即时查询
		logisticsSearch: function(payload) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.post('http://api.kdniao.com/Ebusiness/EbusinessOrderHandle.aspx',null,payload);
			return pPromise;
		},
	};
	return result;
}]);