angular.module('registerService', ['ngResource']).factory('$registerService', ['$gmRestful', function ($gmRestful) {
        var result = {
        	//测试获取验证码
            getCode: function (payload) {
				var pRestful = new $gmRestful();
				var pPromise = pRestful.post(RESTURL.register.code, null, payload);
				return pPromise;
			},
			register: function (payload) {
				var pRestful = new $gmRestful();
				var pPromise = pRestful.post(RESTURL.register.register, null, payload);
				return pPromise;
			},
			//发送手机验证码
            getPhoneCode: function (payload) {
				var pRestful = new $gmRestful();
				var pPromise = pRestful.post(RESTURL.register.phoneCode, null, payload);
				return pPromise;
			}
        };
        return result;
}]);
