import { inherits } from "util";

//预售商品房买卖抵押权预告注销登记-不动产信息
angular.module('bdcxxYdyzxCtrl', []).controller('bdcxxYdyzxCtrl', ["$scope", "ionicToast", "$stateParams", "$state", "$filter", "$ionicHistory", "$ionicActionSheet", "$wysqService", "$dictUtilsService", "$menuService", "$cordovaBarcodeScanner", "$rootScope","$djsqService",
	function ($scope, ionicToast, $stateParams, $state, $filter, $ionicHistory, $ionicActionSheet, $wysqService, $dictUtilsService, $menuService, $cordovaBarcodeScanner, $rootScope,$djsqService) {
		$scope.ywh = $stateParams.ywh;
		//判断是否可以编辑
		if ($wysqService.djsqItemData.step == "NETAPPLYING" || $wysqService.djsqItemData.step == "NETNOPASS") {
			$scope.isShow = true;
		} else {
			$scope.isShow = false;
		}
		if (dyqdj_zxdj_flowCode == $wysqService.djsqItemData.netFlowdefCode) { //抵押权注销登记，显示不动产登记证明号
			$scope.showZmh = true;
		} else {
			$scope.showZmh = false;
		}

			$wysqService.queryApplyByYwh({
				wwywh: $wysqService.djsqItemData.wwywh
			})
				.then(function (res) {
					console.log("res is " + JSON.stringify(res.data.children[0]))
			   $scope.params = {};
			   $scope.params = res;
			   $scope.bdcxx = $scope.params.data.children[0].qlxxExMhs[0];
			   $scope.qlxxEx = $scope.params.data.children[0].qlxxEx;
			   $scope.bdcxxDyxx = $scope.params.data.children[0].qlxxEx;
			   console.log("$scope.qlxxEx is " + JSON.stringify($scope.qlxxEx));
			//    if($scope.bdcxx.qlxxEx.sqdjyy !=null || $scope.bdcxx.qlxxEx.sqdjyy != undefined){
			// 	$scope.bdcxx.qlxxEx.sqdjyy = $scope.params.data.children[0].qlxxEx.sqdjyy;
			//    }
		}),		
			// 使用的测试接口第一条数据

			$scope.getqlxx = function () {
				if ($scope.ywh != null) {
					$wysqService.queryApplyByYwh({
						wwywh: $scope.ywh
					}).then(function (res) {
						if (res.success) {
							$scope.qlxx = res.data;
						} else {
							$scope.showAlert('获取不动产信息失败');
						}
					})
				}
			}
		$scope.getqlxx();
		//跳转到附件列表
		$scope.goFjList = function () {
			var param = {
				qlxxChildDtoList: [{
				  qlxxEx: {
					"sqdjyy": $scope.qlxxEx.sqdjyy,
					"zwlxjssj": $scope.bdcxxDyxx.zwlxjssj,
					"zwlxqssj": $scope.bdcxxDyxx.zwlxqssj
					  },
					ywh: $wysqService.djsqItemData.ywh[0],

				}],
				wwywh: $wysqService.djsqItemData.wwywh
			}

			$wysqService.addbdcxx(param)
			$state.go('fjxz', {
				subFlowcode: $scope.params.data.subFlowcode,
				id: $scope.params.data.id
			}, {
				reload: true
			});
		}

		//下一步按钮
		//		$scope.save = $wysqService.bdcxxNext;

		//返回到申请人信息列表
		$scope.goback = function () {
			$ionicHistory.goBack();
		}

		$scope.showAlert = function (m) {
			ionicToast.show(m, 'middle', false, 2000);
		}

		// 初始化申请登记原因
		// $scope.bdcxx.qlxxEx.sqdjyy = $menuService.sqdjyy;


		//2019.7.15新增悬浮按钮
		$('#touch').on('touchmove', function (e) {

			// 阻止其他事件
			e.preventDefault();

			// 判断手指数量
			if (e.originalEvent.targetTouches.length == 1) {

				// 将元素放在滑动位置
				var touch = e.originalEvent.targetTouches[0];

				$("#touch").css({
					'left': touch.pageX + 'px',
					'top': touch.pageY + 'px'
				});
			}
		});

		//悬浮按钮的点击事件
		$scope.floatingButtonClicked = function () {
			$menuService.id = 0;
			$menuService.level3FlowCode = $scope.qlxx.subFlowcode;
			$state.go('bsznDetail');
		}
		//2019.7.15新增悬浮按钮



	}
]);