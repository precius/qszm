angular.module('sjdtCtrl', []).controller('sjdtCtrl', ["$scope", "ionicToast","$state", "$ionicHistory","$dictUtilsService",
	function($scope,ionicToast, $state, $ionicHistory,$dictUtilsService) {
		$scope.goback = function() {
			$ionicHistory.goBack(); //返回上一个页面
		}
		$scope.bsdtData = [];
		function sortData(){
			//办理状态固定排序
	    	var childrenTempArray = $scope.bsdtData;
	    	var toChildrenTempArray = [{"djjg": "150104"},{"djjg": "150105"},{"djjg": "150103"},{"djjg": "150102"}];
	    	for(var j = 0;j<toChildrenTempArray.length;j++){
	    		var toChildrenTemp = toChildrenTempArray[j];
		    	if(childrenTempArray != undefined && childrenTempArray != "" &&  childrenTempArray != null){
		    		for(var i = childrenTempArray.length-1;i>=0;i--){
		    			var childrenTemp = childrenTempArray[i];
		    			if(toChildrenTemp.djjg == childrenTemp.djjg){
		    				toChildrenTempArray.splice(j,1,childrenTemp);
		    				break;
		    			}
		    		}
		    	}		    		
	    	}
	    	$scope.bsdtData = toChildrenTempArray;
		}
		function getBackground(djjg){
			var jsonObj = {};
			jsonObj.bg = require("../theme/img/gate_yuquan.jpg");
			if(djjg == '150102'){
				jsonObj.bg = require("../theme/img/bsdt.png");
			}else if(djjg == '150103'){
				jsonObj.bg = require("../theme/img/gate_huimin.jpg");
			}else if(djjg == '150104'){
				jsonObj.bg = require("../theme/img/gate_yuquan.jpg");
			}else if(djjg == '150105'){
				jsonObj.bg = require("../theme/img/gate_saihan.jpg");
			}
			return jsonObj;
		}
		//处理实景大厅数据，添加跳转URL,添加背景图片，对实景大厅进行排序
		function modifyData(){
			if($scope.bsdtData != undefined && $scope.bsdtData.length>0){
				for(var i = 0;i<$scope.bsdtData.length;i++){
					var bsdtDataItem = $scope.bsdtData[i];
					bsdtDataItem.bg = getBackground(bsdtDataItem.djjg).bg;
				}
			}
		}
		//查询办事大厅数据
		function getData() {
			$dictUtilsService.getBsdtDataByDjjg($scope, function(res) {
				if(res.success) {
					$scope.bsdtData = angular.copy(res.data);
					modifyData();
					sortData();
				}else{
					ionicToast.show('获取大厅数据失败！','middle',false,2000);
				}
			});
		}
		getData();
		
		$scope.gotoVR = function(item){
			window.open(item.vrAddress);
		}
		
		$scope.go = function() {
			$state.go("bsdt");
		}
	}
]);