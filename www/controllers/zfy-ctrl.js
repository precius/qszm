//真房源控制器
angular.module('zfyCtrl', []).controller('zfyCtrl', ["$scope", "$ionicHistory", "$state", "$zfyService",
	function($scope, $ionicHistory, $state, $zfyService) {
		$scope.goback = function() {
			$ionicHistory.goBack(); //返回上一个页面
			console.log($scope.zfyData1);
		};
		//	房源选项
		$scope.fyTitle = [{
			name: '全部房源',
			addClass: 'on',
			value: '0',
			show: true
		}, {
			name: '优选房源',
			addClass: '',
			value: '1',
			show: false
		}, {
			name: '加盟房源',
			addClass: '',
			value: '2',
			show: false
		}]
		//切换房源
		$scope.checkType = function(index) {
			for(var i = 0; i < 3; i++) {
				$scope.fyTitle[i].addClass = '';
				$scope.fyTitle[i].show = false;
			}
			for(var i = 0; i < 3; i++) {
				if(index === $scope.fyTitle[i].value) {
					$scope.fyTitle[i].addClass = 'on';
					$scope.fyTitle[i].show = true;
				}
			}
		}
		//详情页数据
		$scope.zfyData1 = $zfyService.zfyData;
		//跳转详情页
		$scope.goZfyDetails = function(item) {
			console.log(item);
			$zfyService.zfyData = item;
			$state.go('zfy-details', {}, {
				reload: true
			});
			$scope.zfyData1 = $zfyService.zfyData;
		}
		//	全部房源
		$scope.Qbitems = [{
			text: '白菜价甩欣欣嘉园，阳光邑上中层，可过户，南北向',
			src: require('../theme/img/qb1.jpg'),
			title: '60.35㎡      3室2厅    中层(共30层)',
			details: " 城关-东岗-雁东路,近雁南路 "
		}, {
			text: ' 城关黄河北草场街生物研究所三室一厅精装修',
			src: require('../theme/img/qb2.jpg'),
			title: '59㎡      3室1厅  高层(共8层)',
			details: "城关-黄河北-盐场路1428号"
		}, {
			text: '城关东部市场段家滩欣欣茗园高档小区',
			src: require('../theme/img/qb3.jpg'),
			title: '70.35㎡      2室2厅    南北',
			details: "城关-东部市场-段家滩路450号"
		}, {
			text: '西站 仁恒美林郡对面 兰石润安 ',
			src: require('../theme/img/qb4.jpg'),
			title: '60.35㎡      2室1厅    南北',
			details: "七里河-金港城-敦煌路419号"
		}]
		//	优选房源
		$scope.Yxitems = [{
			text: ' 城关黄河北草场街生物研究所三室一厅精装修',
			src: require('../theme/img/yx2.jpg'),
			title: '59㎡      3室1厅  高层(共8层)',
			details: "城关-黄河北-盐场路1428号"
		}, {
			text: '城关东部市场段家滩欣欣茗园高档小区',
			src: require('../theme/img/qb3.jpg'),
			title: '70.35㎡      2室2厅    南北',
			details: "城关-东部市场-段家滩路450号"
		}, {
			text: '西站 仁恒美林郡对面 兰石润安 ',
			src: require('../theme/img/yx4.jpg'),
			title: '60.35㎡      2室1厅    南北',
			details: "七里河-金港城-敦煌路419号"
		}, {
			text: '白菜价甩欣欣嘉园，阳光邑上中层，可过户，南北向',
			src: require('../theme/img/qb1.jpg'),
			title: '60.35㎡      3室2厅    中层(共30层)',
			details: " 城关-东岗-雁东路,近雁南路 "
		}]
		//	加盟房源
		$scope.Jmitems = [{
			text: '城关东部市场段家滩欣欣茗园高档小区',
			src: require('../theme/img/yx3.jpg'),
			title: '70.35㎡      2室2厅    南北',
			details: "城关-东部市场-段家滩路450号"
		}, {
			text: ' 城关黄河北草场街生物研究所三室一厅精装修',
			src: require('../theme/img/qb2.jpg'),
			title: '59㎡      3室1厅  高层(共8层)',
			details: "城关-黄河北-盐场路1428号"
		}, {
			text: '白菜价甩欣欣嘉园，阳光邑上中层，可过户，南北向',
			src: require('../theme/img/yx1.jpg'),
			title: '60.35㎡      3室2厅    中层(共30层)',
			details: " 城关-东岗-雁东路,近雁南路 "
		}, {
			text: '西站 仁恒美林郡对面 兰石润安 ',
			src: require('../theme/img/qb4.jpg'),
			title: '60.35㎡      2室1厅    南北',
			details: "七里河-金港城-敦煌路419号"
		}]
	}
]);