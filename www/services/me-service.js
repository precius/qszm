angular.module('meService', ['ngResource']).factory('$meService', ['$gmRestful', function ($gmRestful) {
        var result = {
        	//实名验证
            certificate : function (playload) {
                var pRestful = new $gmRestful();
                var pPromise = pRestful.post(RESTURL.me.certification, null, playload);
                return pPromise;
            },
            //修改密码
            passwordModify : function(playload){
            	var pRestful = new $gmRestful();
                var pPromise = pRestful.post(RESTURL.me.passwordModify, null, playload);
                return pPromise;
            },
            //忘记密码，找回密码
            modifyUserinfoByTel : function(playload){
            	var pRestful = new $gmRestful();
                var pPromise = pRestful.post(RESTURL.me.modifyUserinfoByTel, null, playload);
                return pPromise;
            },
            //通过mongoDb获取个人信息
            getMongoDbUserInfo : function(params){
                var pRestful = new $gmRestful();
                var pPromise = pRestful.get(RESTURL.me.mongoDbUserInfo,params);
                return pPromise;
            },
            phoneModify : function(playload){
            	var pRestful = new $gmRestful();
            	var pPromise = pRestful.post(RESTURL.me.phoneModify, null, playload);
            	return pPromise;
            },
            //上传身份认证图片
            saveBase64File: function(playload){
            	var pRestful = new $gmRestful();
            	var pPromise = pRestful.post(RESTURL.me.saveBase64File, null, playload);
            	return pPromise;
            },
            //发起身份认证
            FaceVerifyByUserId: function (params) {
                var pRestful = new $gmRestful();
                var pPromise = pRestful.get(RESTURL.me.FaceVerifyByUserId,params);
                return pPromise;
            },
            //认证结果
            FaceVerifyResult: function (params) {
                var pRestful = new $gmRestful();
                var pPromise = pRestful.get(RESTURL.me.FaceVerifyResult,params);
                return pPromise;
            },
            getVersionInfo:function(params){
            	var pRestful = new $gmRestful();
                var pPromise = pRestful.get(RESTURL.me.getVersionInfo,params);
                return pPromise;
            },
            //神思ocr身份证信息识别
            frontVerify: function(params){
            	var pRestful = new $gmRestful();
            	var pPromise = pRestful.post(RESTURL.me.front_verify,params);
            	return pPromise;
            },
            //神思视频人脸识别
            frontVerifyVideo: function(params){
            	var pRestful = new $gmRestful();
            	var pPromise = pRestful.post(RESTURL.me.front_verifyVideo,params);
            	return pPromise;
            },
            //公安部二要素实名认证
            frontVerifyPoliceTwo(params){
             	var pRestful = new $gmRestful();
            	var pPromise = pRestful.get(RESTURL.me.front_verifyPoliceTwo,params);
            	return pPromise;           	
            },            
            //公安部三要素实名认证
            frontVerifyPolice(params){
             	var pRestful = new $gmRestful();
            	var pPromise = pRestful.get(RESTURL.me.front_verifyPolice,params);
            	return pPromise;           	
            },
            //百度OCR识别
            getOcrResult(params){
              	var pRestful = new $gmRestful();
            	var pPromise = pRestful.post(RESTURL.me.baidu_ocr,params);
            	return pPromise;            	
            },
        };
        return result;
}]);
