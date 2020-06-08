//投诉建议控制器
angular.module('suggestCtrl', []).controller('suggestCtrl', ["$scope", "ionicToast", "$state", "$ionicHistory", "$dictUtilsService", "$menuService",
	function($scope, ionicToast, $state, $ionicHistory, $dictUtilsService, $menuService) { 
		$scope.goback = function() {
			$ionicHistory.goBack(); //返回上一个页面
		};
		$scope.add = function(){
			$state.go('addSuggestion');
		}
		$scope.detail = function(item){
			$state.go('suggestionDetail',{id: item.id});
		}
		//处理留言时间和留言状态
		$scope.init = function(){
			for(let i=0;i<$scope.GuestNoteList.length;i++){
				$scope.GuestNoteList[i].ctime = $dictUtilsService.getFormatDate(new Date($scope.GuestNoteList[i].ctime),'yyyy-MM-dd');
				if($scope.GuestNoteList[i].status === "REPLY"){
					$scope.GuestNoteList[i].status = "已回复";
				}
				else{
					$scope.GuestNoteList[i].status = "待回复";
				}
			}
		}
		$scope.isShow = false;
		/*
		 * type 0查列表 1查详情
		 * params 查询条件
		  */
		$scope.getGuestNoteList = function(type,params){
			$menuService.getGuestNoteList(params)
				.then(function(res) {
					if(type === 0){
						$scope.GuestNoteList = res.data.page;
						if(res.data.page.length == 0){
							$scope.isShow = true;
						}
						else{
							$scope.init();
						}
					}
					else{
						$scope.GuestNote = res.data;
					}
				}, function(res) {
					$scope.showAlert(res.message);
			});
		}
		$scope.getGuestNoteList(0,{username: userData.data.realName});
		
		//提示框
		$scope.showAlert = function(msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		};
	}
]);