angular.module('ysqgzCtrl', []).controller('ysqgzCtrl', ["$scope", "ionicToast", "$ionicHistory", "$state", "$menuService", "$ionicPopup", "$wysqService", "$bsznService", "$wyyyService", "$dictUtilsService", "$loginService", "$ionicActionSheet",
	function($scope, ionicToast, $ionicHistory, $state, $menuService, $ionicPopup, $wysqService, $bsznService, $wyyyService, $dictUtilsService, $loginService, $ionicActionSheet) {
		//调用微信人脸识别之前进行签名
    
        




        $scope.goback = function() {
			$ionicHistory.goBack();
		};
	}
]);