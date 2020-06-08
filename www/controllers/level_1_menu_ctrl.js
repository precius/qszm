angular.module('level1MenuCtrl', []).controller('level1MenuCtrl',['$scope','ionicToast','$ionicHistory','$state','$menuService',
	function($scope,ionicToast, $ionicHistory, $state, $menuService) {
	
		$scope.level1Menu = $menuService.level1Menu;
		$scope.level2MenuArray = $scope.level1Menu.children;
		//不同的菜单配置不同的顶部大图
		if($scope.level1Menu.name.indexOf("过户")!=-1){
			$scope.bigImg = require("../theme/img_menu/wygh-bg.png");
		}else if($scope.level1Menu.name.indexOf("抵押")!=-1){
			$scope.bigImg = require("../theme/img_menu/wydy_bg.png");
		}else if($scope.level1Menu.name.indexOf("变更")!=-1){
			$scope.bigImg =  require("../theme/img_menu/wybg_bg.png");
		}else if($scope.level1Menu.name.indexOf("更正")!=-1){
			$scope.bigImg =  require("../theme/img_menu/wybg_bg.png");
		}else if($scope.level1Menu.name.indexOf("合并")!=-1){
			$scope.bigImg =  require("../theme/img_menu/wydy_bg.png");
		}else{
			$scope.bigImg =  require("../theme/img_menu/wygh-bg.png");
		}
		
		if($scope.level2MenuArray == null||$scope.level2MenuArray.length == 0){
			ionicToast.show('该功能暂未开通','middle',false,2000);
		}
		//二级菜单按钮图标，只给出3种，如果菜单超出3个，则重复循环显示
		$scope.imgData = [{
			src:  require('../theme/img_menu/icon_sfxxbg.png')
		},{
			src: require('../theme/img_menu/icon_cz.png')  
		}, {
			src: require('../theme/img_menu/icon_dzbg.png')  
		}];
		/*for(var i = 0; i < $scope.data.length; i++) {
			if($scope.data[i].code === "IEBDC:GH:FCMM") {
				$menuService.fcmm = $scope.data[i].children;
				$scope.show = true;
				$scope.data.splice(i, 1);
				//console.log($scope.data);
			}
		}*/
		//返回上一个页面
		$scope.goback = function() {
			$ionicHistory.goBack();
		};
		/*$scope.gotofcmm = function() {
			$menuService.flowCode = "IEBDC:GH:FCMM";
			$state.go('fcmm');
		}*/
		$scope.gotoLevel2Menu = function(item) {
			
			$menuService.flowCode = item.code;
			$menuService.level2Menu = item;
			//获取2级菜单下的所有3级流程，若果后台没有在二级菜单下绑定3级流程，不能往下一步点
			$menuService.matchSubflow({
					id: $menuService.level2Menu.id,
					areaCode: $menuService.code
				})
				.then(function(res) {
					if(res.success) {
						console.log(res);
						if(res.data ==null ||res.data.length ==0){
							ionicToast.show($menuService.level2Menu.name+"中还未绑定三级流程！",'middle',false,2000);
						}else{
							$menuService.level3FlowArray = res.data;
							$state.go('level2Menu');
						}
					}
				}, function(res) {
					ionicToast.show(res.message,'middle',false,2000);
				}
			);
		}
	}
]);