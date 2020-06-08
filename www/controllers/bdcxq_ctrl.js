angular.module('bdcxqCtrl', []).controller('bdcxqCtrl', ["$scope", "$ionicHistory",
	function($scope, $ionicHistory) {
		$scope.data = [{
			xqmc: "锦绣龙城",
			ldmp: "",
			area: 120,
			price: 420
		}];
		// 基于准备好的dom，初始化echarts实例
		var myChart1 = echarts.init(document.getElementById('chart1'));

		// 指定图表的配置项和数据
		var option1 = {
			xAxis: {
				type: 'category',
				data: ['02', '03', '04', '05', '06', '07', '08']
			},
			yAxis: {
				type: 'value'
			},
			series: [{
				data: [820, 932, 901, 934, 1290, 1330, 1320],
				type: 'line'
			}]
		};

		// 使用刚指定的配置项和数据显示图表。
		myChart1.setOption(option1);

		var myChart2 = echarts.init(document.getElementById('chart2'));

		// 指定图表的配置项和数据
		var option2 = {
			tooltip: {},
			radar: {
				// shape: 'circle',
				name: {
					textStyle: {
						color: '#fff',
						backgroundColor: '#999',
						borderRadius: 3,
						padding: [3, 5]
					}
				},
				indicator: [{
						name: '交通',
						max: 6500
					},
					{
						name: '教育',
						max: 16000
					},
					{
						name: '环境',
						max: 30000
					},
					{
						name: '医疗',
						max: 38000
					},
					{
						name: '商业',
						max: 52000
					},
				]
			},
			series: [{
				name: '预算 vs 开销（Budget vs spending）',
				type: 'radar',
				// areaStyle: {normal: {}},
				data: [{
						value: [4300, 10000, 28000, 35000, 50000, 19000],
						name: '预算分配（Allocated Budget）'
					},
					{
						value: [5000, 14000, 28000, 31000, 42000, 21000],
						name: '实际开销（Actual Spending）'
					}
				]
			}]
		};

		// 使用刚指定的配置项和数据显示图表。
		myChart2.setOption(option2);

		//返回上一个页面
		$scope.goback = function() {
			$ionicHistory.goBack();
		};
	}
]);