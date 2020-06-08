angular.module('myAddressCtrl', []).controller('myAddressCtrl', ["$scope", "$state", "$stateParams", "$ionicHistory", "ionicToast",
	"$menuService", "$bsznService", "$wysqService", "$rootScope","$ionicPopup",
	function ($scope, $state, $stateParams, $ionicHistory, ionicToast, $menuService, $bsznService,$wysqService,$rootScope,$ionicPopup) {
		$scope.goback = function () {
			$ionicHistory.goBack(); //返回上一个页面
		};
		$scope.changeState = function () {
			var radio = document.getElementsById("radio");
			if (radio.checked == true) {
				radio.checked = null;
			} else {
				radio.checked = false;
			}
			console.log(radio.checked);
		}

		//获取邮寄地址信息
		$scope.getYjData = function () {
			$menuService.getAddressByUserId({
				userId: userData.data.id,
			}).then(function (res) {
				$scope.shxx = res.data;
			}, function (error) {
				$scope.showAlert('获取数据失败！')
			}
			);
		}
		$scope.getYjData();
    //删除权利人对话框
    $scope.delAddressDialog = function(item) {
      $scope.showConfirm("提示", "确认", "取消", "是否确认删除该地址?", item);
    }
    //删除权利人/义务人信息对话框
    $scope.showConfirm = function(titel, okText, cancelText, contentText, item) {
      var confirmPopup = $ionicPopup.confirm({
        title: titel,
        okText: okText,
        cancelText: cancelText,
        content: contentText
      });
      confirmPopup.then(function(res) {
        if (res) {
          $scope.delete(item);
        } else {

        }
      });
    };
		$scope.delete = function(item){
			console.log(item.id)
			$menuService.deleteAddress({
				id: item.id,
			}).then(function (res) {
				$scope.getYjData();
				$scope.showAlert('删除地址成功！')
			}, function (error) {
				$scope.showAlert('删除地址失败！')
			}
			);
		}

		$scope.sure = function(item){
			console.log(item)
      $ionicHistory.goBack();
      $rootScope.$broadcast('to-bdcxx', {'address':item});

			// $state.go('bdcxx',{
			// 	'address':item
			// })
		}

		$scope.editAddress = function (item) {
			$state.go('editAddress',{
				item:item
			})
		}

		$scope.goAddress = function () {
			$state.go('address')
		}
		//提示对话框
		$scope.showAlert = function (msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		};
	}
]);
