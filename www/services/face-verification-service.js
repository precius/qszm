angular.module('faceVerificationService', ['ngResource']).factory('$faceVerificationService', ['$gmRestful', function($gmRestful) {
  var result = {
    //获取验证码
    getCode: function(params){
        var pRestful = new $gmRestful();
        var pPromise = pRestful.post('https://faceliveness.zhengwl.cn/aidemo', null, params);
        return pPromise;
    },
    //根据文章ID获取文章详情
    viewArticle: function(params){
        var pRestful = new $gmRestful();
        var pPromise = pRestful.get(internetEstateServer + 'articleController/viewArticle',params);
        return pPromise;
    }
  };
  return result;
}]);