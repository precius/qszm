angular.module('qlrxxZydyCtrl', []).controller('qlrxxZydyCtrl', ["$scope", "ionicToast", "$stateParams", "$state", "$ionicHistory", "$wysqService", "$dictUtilsService", "$rootScope", "$menuService",
	function($scope, ionicToast, $stateParams, $state, $ionicHistory, $wysqService, $dictUtilsService, $rootScope, $menuService) {
		/**
		 * 权利人接口    （删除、新增、编辑）
		 * 所有权人-0   
		 * 使用权人-2  
		 * 抵押权人-4    
		 * 预告权利人-7
		 * 预告抵押权人-9
		 * 
		 * 
		 * 义务人接口    （删除、新增、编辑）
		 * 原所有权人 -1
		 * 抵押人-5    
		 * 债务人-6
		 * 预告义务人-8
		 * 预告抵押人-10
		 * 预告债务人-11
		 * 
		 */
		$scope.action = $stateParams.action; //分3种状态 查看 编辑 新增
		$scope.id = $stateParams.id;
		$scope.category = $stateParams.category;

		if($scope.category == '0') {
			$scope.title = '权利人';
		} else if($scope.category == '1') {
			$scope.title = '义务人';
		} else if($scope.category == '4') {
			$scope.title = '抵押权人';
		} else if($scope.category == '5') {
			$scope.title = '抵押人';
		} else if($scope.category == '6') {
			$scope.title = '债务人';
		}

		$scope.qlrmc = {
			name: $scope.title + '名称',
			placeholder: '请输入' + $scope.title + '名称'
		}
		//证件种类
		$scope.zjzlData = $dictUtilsService.getDictinaryByType("证件种类").childrens;

		//共有方式
		$scope.gyfsData = $dictUtilsService.getDictinaryByType("共有方式").childrens;

		//权利人类型
		$scope.qlrlxData = $dictUtilsService.getDictinaryByType("权利人类型").childrens;

		//权利人分类
		$scope.qlrflDataAll = $dictUtilsService.getDictinaryByType("权利人分类").childrens;

		if($scope.action == '新增') {
			initAdd(); //新增状态
		} else {
			initEdit(); //编辑状态
		};

		//新增权利人初始化
		function initAdd() {
			$scope.qlr = {};
			//初始化证件类型
			if($scope.category == '9'||$scope.category == '4') {
				$scope.zjzl = $scope.zjzlData[6];
			} else {
				$scope.zjzl = $scope.zjzlData[0];
			}
			$scope.qlr.zjzl = $scope.zjzl.value;
			//初始化共有方式
			$scope.gyfs = $scope.gyfsData[0];
			$scope.qlr.gyfs = $scope.gyfs.value;
			$scope.qlr.gyqk = $scope.gyfs.label;

			if($scope.category == "9"||$scope.category == '4') {
				$scope.qlrlx = $scope.qlrlxData[1];
			} else {
				$scope.qlrlx = $scope.qlrlxData[0];
			}
			$scope.qlr.qlrlx = $scope.qlrlx.value;
			$scope.qlr.category = $scope.category;

			//初始化家庭成员
			$scope.qlr.familyGroup = {
				familyMemberList: []
			}
		}

		//编辑权利人初始化
		function initEdit() {
			$wysqService.getqlrByqlrId({
				id: $stateParams.id
			}).then(function(res) {
				if(res.success) {
					$scope.qlr = res.data;
					//初始化证件类型
					for(var i = 0; i < $scope.zjzlData.length; i++) {
						if($scope.zjzlData[i].value == $scope.qlr.zjzl) {
							$scope.zjzl = $scope.zjzlData[i];
						}
					}
					//初始化共有方式
					for(var i = 0; i < $scope.gyfsData.length; i++) {
						if($scope.gyfsData[i].value == $scope.qlr.gyfs) {
							$scope.gyfs = $scope.gyfsData[i];
						}
					}
					$scope.qlr.gyqk = $scope.gyfs.label;
					if("按份共有" == $scope.gyfs.label) {
						$scope.canEditQlbl = true;
					} else {
						$scope.canEditQlbl = false;
					}
					//初始化权利人类型
					for(var i = 0; i < $scope.qlrlxData.length; i++) {
						if($scope.qlrlxData[i].value == $scope.qlr.qlrlx) {
							$scope.qlrlx = $scope.qlrlxData[i];
						}
					}
					//初始化家庭成员
					if($scope.qlr.familyGroup == null) {
						$scope.qlr.familyGroup = {
							familyMemberList: []
						}
					} else {
						if($scope.qlr.familyGroup.familyMemberList === null) {
							$scope.qlr.familyGroup.familyMemberList = [];
						} else {
							for(var i = 0; i < $scope.qlr.familyGroup.familyMemberList.length; i++) {
								$scope.qlr.familyGroup.familyMemberList[i].isConfirm = true;
								for(var j = 0; j < $scope.familyRelationshipEnum.length; j++) {
									if($scope.qlr.familyGroup.familyMemberList[i].familyRelationshipEnum == $scope.familyRelationshipEnum[j].value) {
										$scope.qlr.familyGroup.familyMemberList[i].menberRelationship = $scope.familyRelationshipEnum[j];
									}
								}
								for(var k = 0; k < $scope.zjzlData.length; k++) {
									if($scope.qlr.familyGroup.familyMemberList[i].zjzl == $scope.zjzlData[k].value) {
										$scope.qlr.familyGroup.familyMemberList[i].menberZjzl = $scope.zjzlData[k];
									}
								}
							}
						}
					}
					//初始化代理人
					if($scope.qlr.dlrlx != null) {
						if($scope.qlr.dlrlx == '0') { //代理人为个人
							$scope.dlr.dljg = null;
							$scope.dlr.dljgdh = null;
							$scope.dlr.dlrlx = $scope.qlr.dlrlx;
							$scope.dlr.dlrmc = $scope.qlr.dlrmc;
							$scope.dlr.dlrdh = $scope.qlr.dlrdh;
							$scope.dlr.dlrzjzl = $scope.qlr.dlrzjzl;
							$scope.dlr.dlrzjh = $scope.qlr.dlrzjh;
							$scope.dlrlxlSelected = $scope.dlrflData[1];
						}
						if($scope.qlr.dlrlx == '1') { //代理人为组织
							$scope.dlr.dljg = $scope.qlr.dljg;
							$scope.dlr.dljgdh = $scope.qlr.dljgdh;
							$scope.dlr.dlrlx = $scope.qlr.dlrlx;
							$scope.dlr.dlrmc = $scope.qlr.dlrmc;
							$scope.dlr.dlrdh = $scope.qlr.dlrdh;
							$scope.dlr.dlrzjzl = $scope.qlr.dlrzjzl;
							$scope.dlr.dlrzjh = $scope.qlr.dlrzjh;
							$scope.dlrlxlSelected = $scope.dlrflData[2];
						}
						/*for(var i = 0; i < $scope.zjzlData.length; i++) {
							if($scope.zjzlData[i].value == $scope.dlr.dlrzjzl) {
								$scope.dlrzjzlSelected = $scope.zjzlData[i];
							}
						}*/
					}
				} else {
					showAlert(res.message);
				}
			}, function(res) {
				showAlert(res.message);
			});
		}

		//选择证件类型
		$scope.checkZjlx = function(value) {
			$scope.qlr.zjzl = value;
		}

		//选择共有方式
		$scope.checkGyfs = function(item) {
			$scope.qlr.gyfs = item.value;
			$scope.qlr.gyqk = item.label;
			if("按份共有" == item.label) {
				$scope.canEditQlbl = true;
			} else {
				$scope.canEditQlbl = false;
				$scope.qlr.qlbl = null;
			}
		}

		//选择权利人类型
		$scope.checkQlrlx = function(value) {
			$scope.qlr.qlrlx = value;
		}

		//代理人相关信息
		$scope.dlrflData = [{
				value: '-1',
				label: '无代理人'
			},
			{
				value: '0',
				label: '个人'
			},
			{
				value: '1',
				label: '机构'
			}
		];
		$scope.dlr = {

		};

		$scope.dlrlxlSelected = $scope.dlrflData[0]; //默认代理人类型是个人
		$scope.dlr.dlrlx = '-1';
		$scope.checkDlr = function(dlrlxlSelected) {
			$scope.dlr.dlrlx = dlrlxlSelected.value;
			if(dlrlxlSelected.value != '1') {
				$scope.dlr.dljg = null;
				$scope.dlr.dljgdh = null;
			}
		}
		//选择代理人证件类型
		//		$scope.dlrzjzlSelected = $scope.zjzlData[0];
		$scope.dlr.dlrzjzl = '1'; //默认为身份证
		//		$scope.checkDlrZjlx = function(value) {
		//			$scope.dlr.dlrzjzl = value;
		//			
		//		}

		//选择成员关系
		$scope.checkRelationship = function(item) {
			item.familyRelationshipEnum = item.menberRelationship.value;
		}

		//选择成员证件类型
		$scope.checkFamilyZjzl = function(item) {
			item.zjzl = item.menberZjzl.value;
		}

		//弹出框
		function showAlert(msg) {
			ionicToast.show(msg, 'middle', false, 2000);
		}

		//返回上一页
		$scope.goback = function() {
			$ionicHistory.goBack();
		}

		//OCR获取信息返回并且刷新
		$rootScope.$on('ocr-back', function(event, args) {
			//从OCR返回
			if(args.index == 0) {
				$scope.qlr = args.jsonObj;
				$scope.qlr.qlrmc = args.name;
				$scope.qlr.zjh = args.num;
			} else if(args.index == 1) {
				$scope.qlr = args.jsonObj;
				$scope.qlr.dlrmc = args.name;
				$scope.qlr.dlrzjh = args.num;
			}
			//			$scope.initZjlx();
			//			$scope.initGyfs();
			//			$scope.getQlrflByValue($scope.qlr.category);
			//			$scope.getQlrlxByValue($scope.qlr.qlrlx); //权利人类型
		});

		//使用ocr获取权利人信息
		$scope.qlrtoocr = function() {
			$state.go('ocr', {
				"index": 0,
				"jsonObj": $scope.qlr
			}, {
				reload: true
			});
		}

		//编辑
		$scope.qlrBjtoocr = function() {
			$state.go('ocr', {
				"id": $scope.id,
				"index": 0,
				"jsonObj": $scope.qlr
			}, {
				reload: true
			});
		}

		//验证数据保存信息
		function verifyYwData() {
			var canSave = false;
			$scope.verify = true;
			if($scope.qlr.frdh == undefined || $scope.qlr.frdh == null || $scope.qlr.frdh == "") {
				$scope.verify = false;
			}
			if($scope.qlr.qlrmc == undefined || $scope.qlr.qlrmc === null || $scope.qlr.qlrmc === "" || $dictUtilsService.hasNum($scope.qlr.qlrmc)) {
				showAlert("请输入正确的" + $scope.title + "名称");
			} else if($scope.qlr.zjzl == undefined || $scope.qlr.zjzl === null || $scope.qlr.zjzl === "") {
				showAlert("请选择证件种类");
			} else if($scope.qlr.zjh == undefined || $scope.qlr.zjh === null || $scope.qlr.zjh === "") {
				showAlert("请输入证件号码");
			} else if(!($scope.qlr.zjh == undefined || $scope.qlr.zjh === null || $scope.qlr.zjh === "") && !$dictUtilsService.idcard($scope.qlr.zjh) && $scope.qlr.zjzl == 1) {
				showAlert("请输入正确的证件号码");
			} else if(!($scope.qlr.zjh == undefined || $scope.qlr.zjh === null || $scope.qlr.zjh === "") && !$dictUtilsService.gaIdcard($scope.qlr.zjh) && $scope.qlr.zjzl == 2) {
				showAlert("请输入正确的港澳台证件号");
			} else if(!($scope.qlr.zjh == undefined || $scope.qlr.zjh === null || $scope.qlr.zjh === "") && !$dictUtilsService.isPassPortCard($scope.qlr.zjh) && $scope.qlr.zjzl == 3) {
				showAlert("请输入正确的护照号码");
			} else if(!($scope.qlr.zjh == undefined || $scope.qlr.zjh === null || $scope.qlr.zjh === "") && !$dictUtilsService.isAccountCard($scope.qlr.zjh) && $scope.qlr.zjzl == 4) {
				showAlert("请输入正确的户口簿号码");
			} else if(!($scope.qlr.zjh == undefined || $scope.qlr.zjh === null || $scope.qlr.zjh === "") && !$dictUtilsService.isOfficerCard($scope.qlr.zjh) && $scope.qlr.zjzl == 5) {
				showAlert("请输入正确的军官证号码");
			} else if(!($scope.qlr.zjh == undefined || $scope.qlr.zjh === null || $scope.qlr.zjh === "") && !$dictUtilsService.orgcodevalidate($scope.qlr.zjh) && $scope.qlr.zjzl == 6) {
				showAlert("请输入正确的组织机构代码");
			} else if(!($scope.qlr.zjh == undefined || $scope.qlr.zjh === null || $scope.qlr.zjh === "") && !$dictUtilsService.checkLicense($scope.qlr.zjh) && $scope.qlr.zjzl == 7) {
				showAlert("请输入正确的营业执照号码");
			} else if($scope.qlr.dh == undefined || !$dictUtilsService.phone($scope.qlr.dh)) {
				showAlert("请输入正确的联系电话");
			} else if($scope.qlr.gyfs == undefined || $scope.qlr.gyfs != $scope.qlr.gyfs) {
				showAlert("请选择共有方式");
			} else if($scope.qlr.qlrlx != "1" && ($scope.qlr.frmc == undefined || $scope.qlr.frmc == null || $scope.qlr.frmc == "")) {
				showAlert("请输入法人名称");
			} else if($scope.qlr.qlrlx != "1" && ($scope.qlr.frdh == undefined || $scope.qlr.frdh == null || $scope.qlr.frdh == "" || $scope.verify && !$dictUtilsService.phone($scope.qlr.frdh))) {
				showAlert("请输入正确的法人电话");
			} else {
				canSave = true;
			}
			return canSave;
		}

		//判断没有人员重复
		function isNotDuplicate() {
			if($wysqService.qlrlist != null && $wysqService.qlrlist.length > 0) {
				for(var i = 0; i < $wysqService.qlrlist.length; i++) {
					var person = $wysqService.qlrlist[i];
					if($scope.id != null && $scope.id == person.id) { //这种情况说明是取出的person是正在编辑的人员信息，不跟自己做比较
						continue;
					}
					if(person.zjh == $scope.qlr.zjh) {
						showAlert('证件号已经被添加过，不可重复添加！');
						return false; //证件号相同，说明人员重复
					}
				}
			}
			if($wysqService.ywrlist != null && $wysqService.ywrlist.length > 0) {
				for(var i = 0; i < $wysqService.ywrlist.length; i++) {
					var person = $wysqService.ywrlist[i];
					if($scope.id != null && $scope.id == person.id) { //这种情况说明是取出的person是正在编辑的人员信息，不跟自己做比较
						continue;
					}
					if(person.zjh == $scope.qlr.zjh) {
						showAlert('证件号已经被添加过，不可重复添加！');
						return false; //证件号相同，说明人员重复
					}
				}
			}
			return true;
		}

		//判断共有方式是否合理(当有多个人员时，共有方式不能为“单独所有”)
		function checkOwnedRegular() {
			if($wysqService.qlrlist == null || $wysqService.qlrlist.length == 0) {
				// 1 新增一个权利人
				if($scope.qlr.gyqk == '按份共有' && (!$dictUtilsService.number($scope.qlr.qlbl) || $scope.qlr.qlbl == undefined || parseFloat($scope.qlr.qlbl) <= 0 || parseFloat($scope.qlr.qlbl) >= 100)) {
					showAlert("请输入正确的权利比例!");
					return false;
				}
				return true;
			} else if($wysqService.qlrlist.length == 1 && $scope.id == $wysqService.qlrlist[0].id) {
				// 2 只有一个正在编辑状态的权利人，与1情况一样
				if($scope.qlr.gyqk == '按份共有' && (!$dictUtilsService.number($scope.qlr.qlbl) || $scope.qlr.qlbl == undefined || parseFloat($scope.qlr.qlbl) <= 0 || parseFloat($scope.qlr.qlbl) >= 100)) {
					showAlert("请输入正确的权利比例!");
					return false;
				}
				return true;
			} else {
				if($scope.qlr.gyqk == "单独所有") {
					showAlert('已经存在共有人，不能设置为单独所有！');
					return false;
				}
				var gyfs = '';
				if($scope.id != null) { //说明是编辑状态，获取"共有方式"时要避开当前编辑人
					gyfs = $scope.id == $wysqService.qlrlist[0].id ? $wysqService.qlrlist[1].gyqk : $wysqService.qlrlist[0].gyqk;
				} else {
					gyfs = $wysqService.qlrlist[0].gyqk;
				}
				if($scope.qlr.gyqk != gyfs) {
					showAlert('不能选择' + $scope.qlr.gyqk + '，共有方式需保持一致！');
					return false;
				} else { //共有方式一样时切 共有方式是 “按份共有时，还要判断权利比例不能超过100”
					if(gyfs == '按份共有' && (!$dictUtilsService.number($scope.qlr.qlbl) || $scope.qlr.qlbl == undefined || parseFloat($scope.qlr.qlbl) <= 0 || parseFloat($scope.qlr.qlbl) >= 100)) {
						showAlert("请输入正确的权利比例!");
						return false;
					}
					if(gyfs == '按份共有' && (parseFloat($scope.qlr.qlbl) + $wysqService.num > 100)) {
						showAlert("多人比例总和不能大于100！");
						return false;
					}
					return true;
				}
			}
			return true;
		}

		//检查代理人信息填写是否完成
		$scope.verifyDlrInfo = function() {
			if($scope.dlr.dlrlx == '-1') { //代理人类型为无
				$scope.qlr.dljg = null;
				$scope.qlr.dljgdh = null;
				$scope.qlr.dlrlx = null;
				$scope.qlr.dlrmc = null;
				$scope.qlr.dlrdh = null;
				$scope.qlr.dlrzjzl = null;
				$scope.qlr.dlrzjh = null;
			}
			if($scope.dlr.dlrlx == '0') { //代理人类型为个人
				if($scope.dlr.dlrmc == undefined || $scope.dlr.dlrmc == null || $scope.dlr.dlrmc == '') {
					showAlert("代理人名称未填写！");
					return false;
				}
				if($scope.dlr.dlrdh == undefined || !$dictUtilsService.phone($scope.dlr.dlrdh)) {
					showAlert("请输入正确的代理人电话！");
					return false;
				}
				if($scope.dlr.dlrzjh == undefined || $scope.dlr.dlrzjh === null || $scope.dlr.dlrzjh === "") {
					showAlert("请输入代理人证件号码");
					return false;
				}
				if(!$dictUtilsService.idcard($scope.dlr.dlrzjh) && $scope.dlr.dlrzjzl == '1') {
					showAlert("请输入正确的代理人身份证号码");
					return false;
				}
				/*if(!$dictUtilsService.gaIdcard($scope.dlr.dlrzjh) && $scope.dlr.dlrzjzl == '2') {
					showAlert("请输入正确的代理人港澳台证件号");
					return false;
				}
				if(!$dictUtilsService.isPassPortCard($scope.dlr.dlrzjh) && $scope.dlr.dlrzjzl == '3') {
					showAlert("请输入正确的代理人护照号码");
					return false;
				}
				if(!$dictUtilsService.isAccountCard($scope.dlr.dlrzjh) && $scope.dlr.dlrzjzl == '4') {
					showAlert("请输入正确的代理人户口簿号码");
					return false;
				}
				if(!$dictUtilsService.isOfficerCard($scope.dlr.dlrzjh) && $scope.dlr.dlrzjzl == '5') {
					showAlert("请输入正确的代理人军官证号码");
					return false;
				}
				if(!$dictUtilsService.orgcodevalidate($scope.dlr.dlrzjh) && $scope.dlr.dlrzjzl == '6') {
					showAlert("请输入正确的代理人组织机构代码");
					return false;
				}
				if(!$dictUtilsService.checkLicense($scope.dlr.dlrzjh) && $scope.dlr.dlrzjzl == '7') {
					showAlert("请输入正确的代理人营业执照号码");
					return false;
				}*/
				$scope.qlr.dljg = null;
				$scope.qlr.dljgdh = null;
				$scope.qlr.dlrlx = $scope.dlr.dlrlx;
				$scope.qlr.dlrmc = $scope.dlr.dlrmc;
				$scope.qlr.dlrdh = $scope.dlr.dlrdh;
				$scope.qlr.dlrzjzl = $scope.dlr.dlrzjzl;
				$scope.qlr.dlrzjh = $scope.dlr.dlrzjh;
			}
			if($scope.dlr.dlrlx == '1') { //代理人类型为组织
				if($scope.dlr.dljg == undefined || $scope.dlr.dljg == null || $scope.dlr.dljg == '') {
					showAlert("代理人机构名称未填写！");
					return false;
				}
				if($scope.dlr.dljgdh == undefined || $scope.dlr.dljgdh == null || $scope.dlr.dljgdh == '') {
					showAlert("代理人机构电话未填写！");
					return false;
				}
				if($scope.dlr.dlrmc == undefined || $scope.dlr.dlrmc == null || $scope.dlr.dlrmc == '') {
					showAlert("代理人法人名称未填写！");
					return false;
				}
				if($scope.dlr.dlrdh == undefined || !$dictUtilsService.phone($scope.dlr.dlrdh)) {
					showAlert("请输入正确的代理人法人电话！");
					return false;
				}
				if($scope.dlr.dlrzjh == undefined || $scope.dlr.dlrzjh === null || $scope.dlr.dlrzjh === "") {
					showAlert("请输入代理人法人证件号码");
					return false;
				}
				if(!$dictUtilsService.idcard($scope.dlr.dlrzjh) && $scope.dlr.dlrzjzl == '1') {
					showAlert("请输入正确的代理人法人身份证号码");
					return false;
				}
				/*if(!$dictUtilsService.gaIdcard($scope.dlr.dlrzjh) && $scope.dlr.dlrzjzl == '2') {
					showAlert("请输入正确的代理人法人港澳台证件号");
					return false;
				}
				if(!$dictUtilsService.isPassPortCard($scope.dlr.dlrzjh) && $scope.dlr.dlrzjzl == '3') {
					showAlert("请输入正确的代理人法人护照号码");
					return false;
				}
				if(!$dictUtilsService.isAccountCard($scope.dlr.dlrzjh) && $scope.dlr.dlrzjzl == '4') {
					showAlert("请输入正确的代理人法人户口簿号码");
					return false;
				}
				if(!$dictUtilsService.isOfficerCard($scope.dlr.dlrzjh) && $scope.dlr.dlrzjzl == '5') {
					showAlert("请输入正确的代理人法人军官证号码");
					return false;
				}
				if(!$dictUtilsService.orgcodevalidate($scope.dlr.dlrzjh) && $scope.dlr.dlrzjzl == '6') {
					showAlert("请输入正确的代理人法人组织机构代码");
					return false;
				}
				if(!$dictUtilsService.checkLicense($scope.dlr.dlrzjh) && $scope.dlr.dlrzjzl == '7') {
					showAlert("请输入正确的代理人法人营业执照号码");
					return false;
				}*/
				$scope.qlr.dljg = $scope.dlr.dljg;
				$scope.qlr.dljgdh = $scope.dlr.dljgdh;
				$scope.qlr.dlrlx = $scope.dlr.dlrlx;
				$scope.qlr.dlrmc = $scope.dlr.dlrmc;
				$scope.qlr.dlrdh = $scope.dlr.dlrdh;
				$scope.qlr.dlrzjzl = $scope.dlr.dlrzjzl;
				$scope.qlr.dlrzjh = $scope.dlr.dlrzjh;
			}

			return true;
		}
		//添加家庭成员
		$scope.addfamilymember = function() {
			$scope.qlr.familyGroup.familyMemberList.push({
				isConfirm: false
			});
		}

		//验证家庭成员模块信息
		$scope.confirmfamilymember = function(item) {
			if(item.name == undefined || item.name === null || item.name === "" || $dictUtilsService.hasNum(item.name)) {
				showAlert("请输入正确的成员姓名");
			} else if(item.familyRelationshipEnum == undefined || item.familyRelationshipEnum === null || item.familyRelationshipEnum === "") {
				showAlert("请选择成员关系");
			} else if(item.zjzl == undefined || item.zjzl === null || item.zjzl === "") {
				showAlert("请选择证件种类");
			} else if(item.zjh == undefined || item.zjh === null || item.zjh === "") {
				showAlert("请输入证件号码");
			} else if(!(item.zjh == undefined || item.zjh === null || item.zjh === "") && !$dictUtilsService.idcard(item.zjh) && item.zjzl.value == 1) {
				showAlert("请输入正确的证件号码");
			} else if(!(item.zjh == undefined || item.zjh === null || item.zjh === "") && !$dictUtilsService.gaIdcard(item.zjh) && item.zjzl.value == 2) {
				showAlert("请输入正确的港澳台证件号");
			} else if(!(item.zjh == undefined || item.zjh === null || item.zjh === "") && !$dictUtilsService.isPassPortCard(item.zjh) && item.zjzl.value == 3) {
				showAlert("请输入正确的护照号码");
			} else if(!(item.zjh == undefined || item.zjh === null || item.zjh === "") && !$dictUtilsService.isAccountCard(item.zjh) && item.zjzl.value == 4) {
				showAlert("请输入正确的户口簿号码");
			} else if(!(item.zjh == undefined || item.zjh === null || item.zjh === "") && !$dictUtilsService.isOfficerCard(item.zjh) && item.zjzl.value == 5) {
				showAlert("请输入正确的军官证号码");
			} else if(!(item.zjh == undefined || item.zjh === null || item.zjh === "") && !$dictUtilsService.orgcodevalidate(item.zjh) && item.zjzl.value == 6) {
				showAlert("请输入正确的组织机构代码");
			} else if(!(item.zjh == undefined || item.zjh === null || item.zjh === "") && !$dictUtilsService.checkLicense(item.zjh) && item.zjzl.value == 7) {
				showAlert("请输入正确的营业执照号码");
			} else if(item.phone == undefined || !$dictUtilsService.phone(item.phone)) {
				showAlert("请输入正确的联系电话");
			} else {
				item.isConfirm = true;
				showAlert("添加成功");
			}
		}

		//删除家庭成员
		$scope.deletefamily = function(index) {
			$scope.qlr.familyGroup.familyMemberList.splice(index, 1);
		}

		//添加或者更新是判断家庭成员是否都确认添加了，没有添加的删除掉
		function checkFamily() {
			var familyMemberSize = $scope.qlr.familyGroup.familyMemberList.length;
			if(familyMemberSize > 0) {
				for(var i = 0; i < familyMemberSize; i++) {
					if(!$scope.qlr.familyGroup.familyMemberList[i].isConfirm) {
						$scope.qlr.familyGroup.familyMemberList.splice(i, 1);
					}
				}
			}
		}

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

		//添加权利人
		$scope.addQlr = function() {
			if($scope.category == '0'||$scope.category == '1') {
				$scope.qlr.ywh = $wysqService.djsqItemData.ywh[0];
			} else if($scope.category == '4'||$scope.category == '5'||$scope.category == '6') {
				$scope.qlr.ywh = $wysqService.djsqItemData.ywh[1];
			} 
			
			$scope.qlr.qllx = $wysqService.djsqItemData.qllx; //将权利信息中的权利类型保存到权利人的权利类型中
			$scope.qlr.sfczr = 1; //是否持证人

			if(verifyYwData() && isNotDuplicate() && checkOwnedRegular()) {
				checkFamily();
				if(!$scope.verifyDlrInfo()) { //检查代理人信息，如果合法将代理人信息赋到权利人中提交
					return;
				}
				$wysqService.addqlr($scope.qlr).then(function(res) {
					if(res.success) {
						if($scope.category == '0'){//如果是第一部分流程（转移）的权利人添加，那就再当做第二部分流程（抵押）的抵押人再添加一次
							$scope.qlr.ywh = $wysqService.djsqItemData.ywh[1];
							$scope.qlr.ywrmc = $scope.qlr.qlrmc;
							$scope.qlr.qlrmc = null;
							$scope.qlr.category = '5';
							$scope.addYwr();
						}else{
							$ionicHistory.goBack();
						}
					} else {
						showAlert(res.message);
					}
				}, function(res) {
					showAlert(res.message);
				});
			}
		}
		$scope.addYwr = function(){
			$wysqService.addywr($scope.qlr).then(function(res) {
				if(res.success) {
					$ionicHistory.goBack();
				} else {
					showAlert(res.message);
				}
			}, function(res) {
				showAlert(res.message);
			});
		}
		//更新权利人信息
		$scope.updateQlr = function() {
			$scope.qlr.qllx = $wysqService.djsqItemData.qllx; //将权利信息中的权利类型保存到权利人的权利类型中
			$scope.qlr.sfczr = 1; //是否持证人

			if(verifyYwData() && isNotDuplicate() && checkOwnedRegular()) {
				checkFamily();
				if(!$scope.verifyDlrInfo()) { //检查代理人信息，如果合法将代理人信息赋到权利人中提交
					return;
				}
				$wysqService.updateQlr($scope.qlr).then(function(res) {
					if(res.success) {
						showAlert("更新成功");
						$ionicHistory.goBack();
					} else {
						showAlert(res.message);
					}
				}, function(res) {
					showAlert(res.message);
				});
			}
		}

		//解决苹果虚拟键盘弹起遮住输入框的问题
		$("input").on("click", function() {
			console.log("success!");
			var target = this;
			window.setTimeout(function() {
				target.scrollIntoView(true);
			}, 100);
		});
	}
]);