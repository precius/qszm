//在填写预约信息里面选择预约   事项
angular.module('xzyysxCtrl', []).controller('xzyysxCtrl', ["$scope", "ionicToast", "$rootScope", "$state", "$ionicHistory", "$wyyyService","$bsznService",
	function($scope, ionicToast, $rootScope, $state, $ionicHistory, $wyyyService,$bsznService) {
		//预约事项列表数据
		$scope.items = [];
		$scope.queryCondition = {};

		//返回
		$scope.goback = function() {
			$ionicHistory.goBack(); //返回上一个页面
		};
		/*$scope.level1YysxList = [{
			name: '预告',
			addClass: 'on',
			value: '0',
		}, {
			name: '抵押',
			addClass: '',
			value: '1',

		}];*/
		$scope.level1YysxList = [];
		
		$scope.indexOfLevel1Checked = 0;
		
		//选择动态信息切换选项卡
		$scope.checkType = function(index) {
			for(var i = 0; i < $scope.level1YysxList.length; i++) {
				$scope.level1YysxList[i].addClass = '';
				if(index === $scope.level1YysxList[i].index) {
					$scope.level1YysxList[i].addClass = 'on';
					$scope.indexOfLevel1Checked = $scope.level1YysxList[i].index;
				}
			}
			$scope.initYysxChild();
		}
		
		
		$scope.childList = [];//三级预约事项的集合
		$scope.initYysxChild = function(){
			$scope.childList = [];
			var level1YYSX = $scope.yysxData[$scope.indexOfLevel1Checked];//选定的一级事项
			var level2YysxList = level1YYSX.yyxxConfigList;//遍历二级事项集合，将所有二级事项中的三级事项集合合并成1个大集合
			for (var i = 0;i<level2YysxList.length;i++){
				var level2Child =  level2YysxList[i];
				var level3List = level2Child.flowSubDefConfigs;
				$scope.childList = [].concat($scope.childList,level3List);
			}
			var a=0;
		}
		
		
		
		$scope.yysxData=[];
		//获取预约事项 
		$wyyyService.getYysx({
			djjg: $wyyyService.bsdt.djjg
		}).then(
		function(res) {
			if(res.success) {
				console.log(res);
				$scope.yysxData = res.data;
				for (var i=0 ;i<$scope.yysxData.length;i++){
					var yysxLevel1 = $scope.yysxData[i];
					
					$scope.level1YysxList.push({
						name:yysxLevel1.name,
						addClass: '',
						index:i,
					})
				} 
				$scope.indexOfLevel1Checked = 0;
				$scope.level1YysxList[0].addClass = 'on';
				
				$scope.initYysxChild();
			} else {
				showAlert('获取预约事项列表失败！');
			}
		}, 
		function(error) {
			showAlert('获取预约事项列表失败!');
		}
		);
		

		$scope.choose = function(item) {

			$wyyyService.yysxid = item.id;
			$wyyyService.yysx = item.name;
			
			if($wyyyService.ywlx != $scope.level1YysxList[$scope.indexOfLevel1Checked].name){//如果预约事项大类发生了变化，那么就应该记录下来，通知上一级界面重置预约时间
				$wyyyService.shouldResetYysj = true;
			}else{
				$wyyyService.shouldResetYysj = false;
			}
			$wyyyService.ywlx = $scope.level1YysxList[$scope.indexOfLevel1Checked].name;
			
			$rootScope.$broadcast('yysx', {});
			$ionicHistory.goBack(); //返回上一个页面
			//		$state.go('yysx');
		}
		
		$scope.choosemenu0 = function(index){
			$scope.item.flowDefConfigs[index].show = !$scope.item.flowDefConfigs[index].show; 
		}
		//切换菜单折叠
		$scope.choosemenu = function(index){
			$scope.items[index].show = !$scope.items[index].show; 
		}
		

		showAlert = function(msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		};
	}
]);