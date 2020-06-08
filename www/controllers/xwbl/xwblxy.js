//预约须知（预约协议）
angular.module('xwblxyCtrl', []).controller('xwblxyCtrl', ["$scope", "$ionicHistory", "$state", "$stateParams",
    function ($scope, $ionicHistory, $state, $stateParams,) {
       $scope.xwblData = $stateParams.xwblData;
        //返回
        $scope.goback = function () {
            $ionicHistory.goBack();
        }

        //同意协议
        $scope.agree = function () {
            $state.go('xwblqm', {
                xwblData: $scope.xwblData,
            });
        }

        //不同意协议
        $scope.disagree = function () {
            $ionicHistory.goBack();
        }
    }
]);