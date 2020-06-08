require('../theme/css/watch3D.min.css');
var watch3D = require('../lib/watch3D.js').default;
angular.module('mCtrl', []).controller('mCtrl', ["$scope", "$wyyyService", "$ionicHistory", "$state",
	function($scope, $wyyyService, $ionicHistory, $state) {
		$scope.goback = function() {
			$ionicHistory.goBack(); //返回上一个页面
		}
		//跳转到我要预约
		$scope.gotoyyxz = function() {
			$wyyyService.yysxChoosable = true;
			$state.go('yyxz');
		}
		//跳转到我要申请
		$scope.gotodjsqxz = function() {
			$state.go('djsqxz');
		}
		//跳转到我要查询
		$scope.gotojdcx = function() {
			$state.go('jdcx');
		}
		var layer = document.querySelector(".layer");

		$scope.to2Floor = function() {
			//2楼扶梯
			var w3d = new watch3D({
				wrapper: ".wrapper",
				autoplay: false,
				reverse: false,
				width: 5000,
				height: 2500,
				num: 12,
				maxY: 25,
				tips: {
					1: {
						styles: {
							"height": "237px",
							"width": "177px",
							"background": "url(" + require('../theme/img/up-background.png') + ")",
							"font-size": "30px",
							"text-align": "center",
							"margin-right": "10px",
							"margin-left": "-150px",
							"margin-top": "300px",
							"text-align": "center",
							"color": "#333333",
							"cursor": "pointer"
						},
						content: "三楼扶梯",
						callback: function(e) {
							//跳转到3楼扶梯
							$scope.to3Floor();
						}
					},
					0: {
						styles: {
							"height": "284px",
							"width": "330px",
							"background": "url(" + require('../theme/img/confirm.png') + ")",
							"font-size": "18px",
							"margin-left": "-150px",
							"margin-top": "100px",
							"color": "#000",
						},
						content: "<p style='width:260px;margin: -100px 10px 0 10px;'>欢迎来到不动产登记大厅，请选择下列你要办理的业务：</p><br/><a href='#/wygh' style='margin-left:100px;height:40px;line-height:40px;color: rgb(45,131,255);'>我要过户</a><br/><a href='#/wydy' style='margin-left:100px;height:40px;line-height:40px;color: rgb(45,131,255);'>我要抵押</a><br/><a href='#/wybg' style='margin-left:100px;height:40px;line-height:40px;color: rgb(45,131,255);'>我要变更</a><br/><a href='#/wyzx' style='margin-left:100px;height:40px;line-height:40px;color: rgb(45,131,255);'>我要注销</a><br/><a href='#/jdcx' style='margin-left:100px;height:40px;line-height:40px;color: rgb(45,131,255);'>进度查询</a>"
					},
					11: {
						styles: {
							"height": "510px",
							"width": "242px",
							"background": "url(" + require('../theme/img/person.png') + ")",
							"margin-left": "-190px",
							"margin-top": "0px",
						},
						content: ""
					}
				},
				resource: require("../theme/img/3D-2floor.jpg"),
				loadstart: function() {
					layer.style.display = "block";
				},
				loadend: function(data) {
					layer.style.display = "none";
				}
			});
		}
		//初始值为2楼扶梯
		$scope.to2Floor();
		$scope.to3Floor = function() {
			//3楼扶梯
			var w3d = new watch3D({
				wrapper: ".wrapper",
				autoplay: false,
				reverse: false,
				width: 5000,
				height: 2500,
				num: 20,
				maxY: 25,
				tips: {
					6: {
						styles: {
							"height": "237px",
							"width": "177px",
							"background": "url(" + require('../theme/img/up-background.png') + ")",
							"font-size": "25px",
							"text-align": "center",
							"margin-right": "10px",
							"margin-left": "-50px",
							"margin-top": "300px",
							"color": "#333333",
							"cursor": "pointer"
						},
						content: "二楼扶梯",
						callback: function(e) {
							$scope.to2Floor();
						}
					},
					8: {
						styles: {
							"height": "237px",
							"width": "177px",
							"background": "url(" + require('../theme/img/up-background.png') + ")",
							"font-size": "25px",
							"text-align": "center",
							"margin-right": "10px",
							"margin-left": "-100px",
							"margin-top": "250px",
							"color": "#333333",
							"cursor": "pointer",
							"transform": "rotate(20deg)"
						},
						content: "排队取号",
						callback: function(e) {
							$scope.toQueue();
						}
					},
					9: {
						styles: {
							"height": "237px",
							"width": "177px",
							"background": "url(" + require('../theme/img/up-background.png') + ")",
							"font-size": "25px",
							"text-align": "center",
							"margin-right": "10px",
							"margin-left": "-60px",
							"margin-top": "140px",
							"color": "#333333",
							"cursor": "pointer",
							"transform": "rotate(50deg)"
						},
						content: "收费发证",
						callback: function(e) {
							$scope.toCharge();
						}
					},
					10: {
						styles: {
							"height": "237px",
							"width": "177px",
							"background": "url(" + require('../theme/img/up-background.png') + ")",
							"font-size": "25px",
							"text-align": "center",
							"margin-right": "10px",
							"margin-left": "-80px",
							"margin-top": "40px",
							"color": "#333333",
							"cursor": "pointer",
							"transform": "rotate(65deg)"
						},
						content: "受理窗口",
						callback: function(e) {
							$scope.toAccept();
						}
					},
					12: {
						styles: {
							"height": "237px",
							"width": "177px",
							"background": "url(" + require('../theme/img/up-background.png') + ")",
							"font-size": "25px",
							"text-align": "center",
							"margin-right": "10px",
							"margin-left": "-90px",
							"margin-top": "300px",
							"color": "#333333",
							"cursor": "pointer",
							"transform": "rotate(-105deg)"
						},
						content: "休息区",
						callback: function(e) {
							$scope.toRest();
						}
					}
				},
				resource: require("../theme/img/3D-3floor.jpg"),
				loadstart: function() {
					layer.style.display = "block";
				},
				loadend: function(data) {
					layer.style.display = "none";
				}
			});
		}

		$scope.toRest = function() {
			//休息区
			var w3d = new watch3D({
				wrapper: ".wrapper",
				autoplay: false,
				reverse: false,
				width: 5000,
				height: 2500,
				num: 12,
				maxY: 25,
				tips: {
					8: {
						styles: {
							"height": "237px",
							"width": "177px",
							"background": "url(" + require('../theme/img/up-background.png') + ")",
							"font-size": "25px",
							"text-align": "center",
							"margin-right": "10px",
							"margin-left": "-50px",
							"margin-top": "500px",
							"text-align": "center",
							"color": "#333333",
							"cursor": "pointer",
							"transform": "rotate(105deg)"
						},
						content: "三楼扶梯",
						callback: function(e) {
							//跳转到3楼扶梯
							$scope.to3Floor();
						}
					}
				},
				resource: require("../theme/img/3D-rest.jpg"),
				loadstart: function() {
					layer.style.display = "block";
				},
				loadend: function(data) {
					layer.style.display = "none";
				}
			});
		};
		$scope.toQueue = function() {
			//排队取号
			var w3d = new watch3D({
				wrapper: ".wrapper",
				autoplay: false,
				reverse: false,
				width: 5000,
				height: 2500,
				num: 12,
				maxY: 25,
				tips: {
					6: {
						styles: {
							"height": "237px",
							"width": "177px",
							"background": "url(" + require('../theme/img/up-background.png') + ")",
							"font-size": "25px",
							"text-align": "center",
							"margin-right": "10px",
							"margin-left": "20px",
							"margin-top": "180px",
							"text-align": "center",
							"color": "#333333",
							"cursor": "pointer",
							"transform": "rotate(60deg)"
						},
						content: "三楼扶梯",
						callback: function(e) {
							//跳转到3楼扶梯
							$scope.to3Floor();
						}
					}
				},
				resource: require("../theme/img/3D-queue.jpg"),
				loadstart: function() {
					layer.style.display = "block";
				},
				loadend: function(data) {
					layer.style.display = "none";
				}
			});
		};
		$scope.toCharge = function() {
			//收费发证
			var w3d = new watch3D({
				wrapper: ".wrapper",
				autoplay: false,
				reverse: false,
				width: 5000,
				height: 2500,
				num: 12,
				maxY: 25,
				tips: {
					5: {
						styles: {
							"height": "237px",
							"width": "177px",
							"background": "url(" + require('../theme/img/up-background.png') + ")",
							"font-size": "25px",
							"text-align": "center",
							"margin-right": "10px",
							"margin-left": "20px",
							"margin-top": "300px",
							"text-align": "center",
							"color": "#333333",
							"cursor": "pointer"
						},
						content: "三楼扶梯",
						callback: function(e) {
							//跳转到3楼扶梯
							$scope.to3Floor();
						}
					}
				},
				resource: require("../theme/img/3D-charge.jpg"),
				loadstart: function() {
					layer.style.display = "block";
				},
				loadend: function(data) {
					layer.style.display = "none";
				}
			});
		};
		$scope.toAccept = function() {
			//受理窗口
			var w3d = new watch3D({
				wrapper: ".wrapper",
				autoplay: false,
				reverse: false,
				width: 5000,
				height: 2500,
				num: 12,
				maxY: 25,
				tips: {
					3: {
						styles: {
							"height": "237px",
							"width": "177px",
							"background": "url(" + require('../theme/img/up-background.png') + ")",
							"font-size": "30px",
							"text-align": "center",
							"margin-right": "10px",
							"margin-left": "0px",
							"margin-top": "200px",
							"text-align": "center",
							"color": "#333333",
							"cursor": "pointer",
							"transform": "rotate(-65deg)"
						},
						content: "三楼扶梯",
						callback: function(e) {
							//跳转到3楼扶梯
							$scope.to3Floor();
						}
					}
				},
				resource: require("../theme/img/3D-accept.jpg"),
				loadstart: function() {
					layer.style.display = "block";
				},
				loadend: function(data) {
					layer.style.display = "none";
				}
			});
		};
	}
]);