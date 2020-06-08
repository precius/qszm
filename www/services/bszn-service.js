angular.module('bsznService', ['ngResource']).factory('$bsznService', ['$gmRestful', function ($gmRestful) {
    var result = {
        title2 : '',
        //办事指南材料示例数组
        clsls:[],
        queryBszn: function (params) {
            var pRestful = new $gmRestful();
            var pPromise = pRestful.get(RESTURL.address.queryFlow,params);
            return pPromise;
        },
        getBsznDetail: function(params){
        	var pRestful = new $gmRestful();
            var pPromise = pRestful.get(RESTURL.address.getBsznDetail,params);
            return pPromise;
        },
        getUploadFile: function(params){
        	var pRestful = new $gmRestful();
            var pPromise = pRestful.get(RESTURL.address.getUploadFile,params);
            return pPromise;
        },
        //通过三级流程code获取办事指南
        getBsznDetailByCode: function(params){
        	var pRestful = new $gmRestful();
            var pPromise = pRestful.get(RESTURL.address.getBsznDetailByCode,params);
            return pPromise;
        },
        //通过三级流程code获取申请材料
        getUploadFileByCode: function(params){
        	var pRestful = new $gmRestful();
            var pPromise = pRestful.get(RESTURL.address.getUploadFileByCode,params);
            return pPromise;
        },
        //根据文件id获取材料示例
        viewUploadFile: function(params){
        	var pRestful = new $gmRestful();
            var pPromise = pRestful.get(RESTURL.address.viewUploadFile,params);
            return pPromise;
        },
	//新增接口，获取预约材料
        getUploadFileNew: function(params){
        	var pRestful = new $gmRestful();
            var pPromise = pRestful.get(internetEstateServer + 'api/appointment/getNewUploadFilesBySubcfgId',params);
            return pPromise;
        }
    };
    return result;
}]);
