angular.module('zfyService', ['ngResource']).factory('$zfyService', ['$gmRestful', function ($gmRestful) {
    var result = {
		zfyData : {}
    };
    return result;
}]);
