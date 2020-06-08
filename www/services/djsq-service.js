angular.module('djsqService', ['ngResource']).factory('$djsqService', ['$gmRestful', function ($gmRestful) {
  var result = {
    allSqdata: {},
    //根据不动产权证号获取不动产信息 hewen 03.27
    getBdcxxByBdcqzh: function (params) {
      var pRestful = new $gmRestful();
      var pPromise = pRestful.post(RESTURL.sqlc.getBdcxxByBdcqzh,null, params,false,{
          contentType: 'json'
        });
      return pPromise;
    },
    //根据预告证明号获取不动产信息
    getEstateInfoByForecastCertificateNumber: function (params) {
      var pRestful = new $gmRestful();
      var pPromise = pRestful.get(RESTURL.sqlc.getEstateInfoByForecastCertificateNumber, params);
      return pPromise;
    },
    //根据抵押证明号获取不动产信息
    getEstateInfoByMortgageCertificateNumber: function (params) {
      var pRestful = new $gmRestful();
      var pPromise = pRestful.get(RESTURL.sqlc.getEstateInfoByMortgageCertificateNumber, params);
      return pPromise;
    },
    //根据合同编号获取不动产信息
    getEstateInfoByContractNumber: function (params) {
      var pRestful = new $gmRestful();
      var pPromise = pRestful.get(RESTURL.sqlc.getEstateInfoByContractNumber, params);
      return pPromise;
    },
    // 不动产权证号/证明号验证 hewen 03.27
    checkBdcqxxByBdcqzhOrZmh:function(params){
      var pRestful = new $gmRestful();
      var pPromise = pRestful.post(RESTURL.sqlc.checkBdcqxxByBdcqzhOrZmh, null, params,false,{
          contentType: 'json'
        });
      return pPromise;
    } ,

    realPropertyCertificateNumberCheck: function (params) {
      var pRestful = new $gmRestful();
      var pPromise = pRestful.post(RESTURL.apply.realPropertyCertificateNumberCheck, null, params);
      return pPromise;
    },
    getRealEstateInfo: function (params) {
      var pRestful = new $gmRestful();
      var pPromise = pRestful.get(RESTURL.apply.getRealEstateInfo, params);
      return pPromise;
    }
  };
  return result;
}]);
