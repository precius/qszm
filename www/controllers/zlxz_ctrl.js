angular.module('zlxzCtrl', []).controller('zlxzCtrl', ["$scope", "ionicToast", "$ionicHistory","$addressService","$rootScope",
	function($scope, ionicToast, $ionicHistory,$addressService,$rootScope) {
		$scope.goback = function() {
			$ionicHistory.goBack(); //返回上一个页面
		};

		$addressService.getTree({currentId:'123'}).then(
			function(res){
			$scope.provinceArray = res.data;
			console.log("$scope.provinceArray is "+JSON.stringify($scope.provinceArray));
		},
			function(error){
			console.log(error);
			showAlert(error.message);
		});

		$scope.provinceArray =[];
		$scope.cityArray =[];
		$scope.areaArray =[];

		$scope.province ={};
		$scope.city ={};
		$scope.area ={};
		$scope.street = {detail:''};
		$scope.provinceIndex = -1;
		$scope.cityIndex =-1;
		$scope.areaIndex =-1;

		$scope.choiceProvince = function(index){
			console.log(index);
			if(index != $scope.provinceIndex ){
				$scope.provinceIndex = index;
				$scope.province = $scope.provinceArray[index];
				$scope.cityArray = $scope.province.childrens;
				$scope.cityIndex =-1;
				$scope.areaIndex = -1;
			}

		};
		$scope.choiceCity = function(index){
			if(index != $scope.cityIndex){
				$scope.cityIndex = index;
				$scope.city = $scope.cityArray[index];
				$scope.areaArray = $scope.city.childrens;
				$scope.areaIndex = -1;
			}


		};
		$scope.choiceArea = function(index){
			$scope.areaIndex = index;
			$scope.area = $scope.areaArray[index];
		};

		$scope.finish = function(){
			if($scope.street.detail==null|| $scope.street.detail ==''){
				showAlert("请输入详细街道地址");
			}else{
				console.log($scope.street.detail);
				$rootScope.$broadcast('zlxz', {
          zlProvince:$scope.province.title,
          zlCity:$scope.city.title,
          zlArea:$scope.area.title,
          zl:$scope.street.detail,
          areaCode:$scope.area.code});
				$ionicHistory.goBack();
			}

		}

		showAlert = function(msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		};



	}
]);
