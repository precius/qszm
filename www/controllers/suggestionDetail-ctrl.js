//投诉建议控制器
angular.module('suggestionDetailCtrl', []).controller('suggestionDetailCtrl', ["$scope", "ionicToast", "$state", "$ionicHistory", "$dictUtilsService", "$menuService","$stateParams",
	function($scope, ionicToast, $state, $ionicHistory, $dictUtilsService, $menuService,$stateParams) { 
		$scope.goback = function() {
			$ionicHistory.goBack(); //返回上一个页面
		};
		//处理留言时间和留言状态
		$scope.init = function(){
			for(let i=0;i<$scope.GuestNote.length;i++){
				$scope.GuestNote[i].ctime = $dictUtilsService.getFormatDate(new Date($scope.GuestNote[i].ctime),'yyyy-MM-dd');
				if($scope.GuestNote[i].status === "REPLY"){
					$scope.GuestNote[i].status = "已回复";
					$scope.GuestNote[i].replyNote.ctime = $dictUtilsService.getFormatDate(new Date($scope.GuestNote[i].replyNote.ctime),'yyyy-MM-dd');
				}
				else{
					$scope.GuestNote[i].status = "待回复";
				}
			}
		}
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
						$scope.GuestNote = res.data.page;
						$scope.init();
						console.log($scope.GuestNote);
					}
				}, function(res) {
					$scope.showAlert(res.message);
			});
		}
		$scope.getGuestNoteList(1,{id: $stateParams.id});
		//提示框
		$scope.showAlert = function(msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		};
	}
]);