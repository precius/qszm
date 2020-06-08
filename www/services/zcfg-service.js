angular.module('zcfgService', ['ngResource']).factory('$zcfgService', ['$gmRestful', function($gmRestful) {
	var result = {
		point:{},
       	//根据文章类型查询文章列表
       	getArticleList: function(params){
            var pRestful = new $gmRestful();
            var pPromise = pRestful.get(internetEstateServer + 'articleController/getArticleByQuery',params);
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