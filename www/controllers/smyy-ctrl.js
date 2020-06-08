angular.module('smyyCtrl', []).controller('smyyCtrl', ["$scope", "$ionicHistory", "$state", "$menuService", "$wyyyService",
	function($scope, $ionicHistory, $state, $menuService, $wyyyService) {
		//房产买卖数据
		$scope.data = $menuService.fcmm;
		//图片地址
		$scope.imgData = [{
			src: require('../theme/img_menu/menu-wsyy.png')
		}, {
			src: require('../theme/img_menu/menu-wssq.png')
		}, {
			src: require('../theme/img_menu/menu-bszn.png')
		}, {
			src: require('../theme/img_menu/menu-sqcl.png')
		}];
		//返回上一个页面
		$scope.goback = function() {
			$ionicHistory.goBack();
		};

		$scope.title = "";
		if($wyyyService.wxyy) {
			$scope.title = "预约";
			$scope.title1 = $menuService.yysx;
		} else {
			$scope.title = "上门预约";
			$scope.title1 = $menuService.yysx;
		}

		//跳转到我要预约业务
		$scope.gotoyw = function(index) {
			switch(index) {
				case 0:
					if($wyyyService.wxyy) {
						$state.go("yyxz");
					} else {
						$state.go('smyyxy');
					}
					break;
				case 1:
					$menuService.flag = 0;
					$state.go('tab.bszn');
					break;
				case 2:
					$state.go('sqcl');
					break;
			}
		}
	}
]);