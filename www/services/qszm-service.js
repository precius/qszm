angular.module('qszmService', ['ngResource']).factory('$qszmService', ['$gmRestful', function ($gmRestful) {
    var result = {
		wdxxData : {},
        queryOfficeName: function (params) {
            var pRestful = new $gmRestful();
            var pPromise = pRestful.get(RESTURL.qszm.queryOfficeName,params);
            return pPromise;
        },
    	queryQszm: function (playload) {
            var pRestful = new $gmRestful();
            var pPromise = pRestful.post(RESTURL.qszm.queryQszm, null, playload);
            return pPromise;
        },
        queryAll: function (params) {
            var pRestful = new $gmRestful();
            var pPromise = pRestful.get(RESTURL.qszm.queryAll,params);
            return pPromise;
        },
        queryQszmFalse: function (params) {
            var pRestful = new $gmRestful();
            var pPromise = pRestful.get(RESTURL.qszm.queryQszmFalse,params);
            return pPromise;
        },
        queryBdcdjzsFalse: function (params) {
            var pRestful = new $gmRestful();
            var pPromise = pRestful.get(RESTURL.qszm.queryBdcdjzsFalse,params);
            return pPromise;
        },        
    };
    return result;
}]);
