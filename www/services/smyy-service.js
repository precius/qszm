angular.module('smyyService', ['ngResource']).factory('$smyyService', ['$gmRestful', function($gmRestful) {
	var result = {
		//办事大厅信息
		bsdt: {},
		//选择的预约事项
		yysx: '',
		//选择的预约事项id
		yysxid: '',
		//选择的预约的时间
		yysj: {
			date: '请选择预约时间',
			time: ''
		},
		wxyy: false,
		yyxm: "",
		yyhm: "",
		yyjg: {},
		//预约详情
		wdyyDetail: function(params) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.get(RESTURL.appointment.findFileById, params);
			return pPromise;
		}
	};
	return result;
}]);