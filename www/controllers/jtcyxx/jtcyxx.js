angular.module('jtcyxxCtrl', []).controller('jtcyxxCtrl', ["$scope", "$stateParams", "ionicToast", "$state", "$ionicHistory",
    "$wysqService", "$ionicPopup", "$ionicLoading", "$dictUtilsService", "$menuService", "$ionicActionSheet", "$rootScope",
    function ($scope, $stateParams, ionicToast, $state, $ionicHistory, $wysqService, $ionicPopup, $ionicLoading, $dictUtilsService,
        $menuService, $ionicActionSheet, $rootScope) {
        //返回上一页
        $scope.goback = function () {
          // 这里给个判断，只有所有的必填填写完毕，才能进行返回
          let isValid = validatorItem();
          if (isValid) {
            $ionicHistory.goBack();
          }
        };
        $scope.pdym = $stateParams.pdym

        $scope.init = function () {
            $scope.familyRelationshipEnum = [{
                label: '本人',
                value: 'SELF'
            }, {
                label: '子女',
                value: 'CHILDREN'
            }, {
                label: '夫妻',
                value: 'SPOUSE'
            }]
            $scope.zjzlData = $dictUtilsService.getDictinaryByType("证件种类").childrens;

            $scope.familyMemberList = $stateParams.familyMemberList
            $scope.familyMemberList.push({
                isConfirm: false
            });
        }
        $scope.init();

        $scope.addfamilymember = function (item) {
          let isValid = validatorItem();
          if (isValid) {
            item.isConfirm = true;
            showAlert("添加成功");
            console.log($scope.pdym)
            console.log($scope.familyMemberList);
            if ($scope.pdym == 'qlr') {
              $rootScope.$broadcast('jtcyxx', {
                familyMemberList: $scope.familyMemberList,
              });
            } else if ($scope.pdym == 'ywr') {
              $rootScope.$broadcast('jtcyxxYwr', {
                familyMemberList: $scope.familyMemberList,
              });
            }
            $ionicHistory.goBack();
          }
        };



        // 统一验证必填，证件验证
        const validatorItem = () => {
          // 取出工具函数中的证件验证对象
          const cardObj = $dictUtilsService.cardValidator;
          let flag = true;
          for (const item of $scope.familyMemberList) {
            if (!item.name || $dictUtilsService.hasNum(item.name)) {
              showAlert("请输入正确的成员姓名");
              return flag = false;
            }
            if (!item.menberRelationship) {
              showAlert("请选择成员关系");
              return flag = false;
            }
            if (!item.menberZjzl) {
              showAlert("请选择证件种类");
              return flag = false;
            }
            if (!item.zjh) {
              showAlert("请输入证件号码");
              return flag = false;
            }
            if (!cardObj[item.menberZjzl.value].valid(item.zjh)) {
              showAlert(cardObj[item.menberZjzl.value].errInfo);
              return flag = false;
            }
            if (!item.phone || !$dictUtilsService.phone(item.phone)) {
              showAlert("请输入正确的联系电话");
              return flag = false;
            }
          }
          return flag;
        };

        //弹出框
        function showAlert(msg) {
            ionicToast.show(msg, 'middle', false, 2000);
        }
    }

]);
