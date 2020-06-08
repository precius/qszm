angular.module('wdbdcService', ['ngResource']).factory('$wdbdcService', ['$gmRestful', function($gmRestful) {
	var result = {
		//小区名称
		xqmc: '选择小区名称',
		//楼栋门牌
		ldmp: '选择楼栋门牌',
		//我的不动产列表数据
		data: [{
			xqmc: "锦绣龙城",
			ldmp: "",
			area: "120",
			price: 420
		},{
			xqmc: "亿达云山湖",
			ldmp: "",
			area: "100",
			price: 120
		}, {
			xqmc: "锦绣龙城",
			ldmp: "",
			area: "120",
			price: 420
		},{
			xqmc: "碧桂园",
			ldmp: "",
			area: "120",
			price: 320
		}]
	};
	return result;
}]);