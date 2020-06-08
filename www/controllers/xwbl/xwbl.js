angular.module('xwblCtrl', []).controller('xwblCtrl', ["$scope", "$state", "$stateParams", "$ionicHistory", "ionicToast",
    "$menuService", "$bsznService", "$rootScope", "$dictUtilsService", "$ionicLoading", "$wysqService",
    function ($scope, $state, $stateParams, $ionicHistory, ionicToast, $menuService, $bsznService, $rootScope, $dictUtilsService, $ionicLoading, $wysqService, ) {
        $scope.goback = function () {
            $ionicHistory.goBack(); //返回上一个页面
        };
        var userData = mongoDbUserInfo;
        $scope.djsx = $wysqService.djsqItemData.subFlowname
        $scope.id = $wysqService.getMineYwInfo().id;
        $scope.ywh = $wysqService.djsqItemData.wwywh;
        $scope.name = userData.name;
        $scope.qtdjShow = false;
        $scope.dydjShow = false;
        $scope.showImg1 = true;


        $scope.init = function () {
            $scope.xwxx = {
                problem1: '',
                problem2: '',
                problem3: '',
                problem4: '',
                problem5: '',
                problem6: '',
                problem7: '',
                problem8: '',
                zyProblem1: '',
                zyProblem2: '',
                dyProblem5: '',
                dyProblem6: '',
                dyProblem7: '',
                dyProblem8: '',
                xzxqlsm: '',
                dysw: '',
                swqr: '',
                swqr: '',
                qt: '',
                xwr: '',
            };
            // 判断是抵押登记还是其他登记
            if ($wysqService.djsqItemData.netFlowdefCode == dyqdj_scdj_flowCode ||
                $wysqService.djsqItemData.netFlowdefCode == dyqdj_bgdj_flowCode ||
                $wysqService.djsqItemData.netFlowdefCode == dyqdj_zxdj_flowCode ||
                $wysqService.djsqItemData.netFlowdefCode == ygdj_ysspfdyqygdj_flowCode
            ) {
                $scope.dydjShow = true;
            } else {
                $scope.qtdjShow = true;
            }

            // 判断是否是异议登记
            if ($wysqService.djsqItemData.netFlowdefCode == gyjsydsyqjfwsyq_yysldj_flowCode ||
                $wysqService.djsqItemData.netFlowdefCode == gyjsydsyqjfwsyq_yyzxdj_flowCode) {
                $scope.yydjShow = false;;
            } else {
                $scope.yydjShow = true;
            }

            // 判断是否是转移登记
            if ($wysqService.djsqItemData.netFlowdefCode == gyjsydsyqjfwsyq_zydj_flowCode) {
                $scope.zydjShow = false;;
            } else {
                $scope.zydjShow = true;
            }

            if ($scope.baseData != null && $scope.baseData != '' && $scope.baseData != undefined) {
                $scope.showImg1 = false;
                $scope.ddsyShow = false;
                console.log(JSON.stringify($scope.xwblData));
                $scope.zsyt = $scope.xwblData.zsyt;
                $scope.gyfs = $scope.xwblData.gyfs;
                $scope.sfbtygzdj = $scope.xwblData.sfbtygzdj;
                $scope.sfzxyyzr = $scope.xwblData.sfzxyyzr;
                $scope.anfyrsfty = $scope.xwblData.anfyrsfty;
                $scope.gyqk = $scope.xwblData.gyqk;
                $scope.xwxx.xwr = $scope.xwblData.xwr;
                $scope.xwxx.qt = $scope.xwblData.qt
                // 第一个问题
                if ($scope.zsyt == '1' || $scope.zsyt == 1) {
                    $scope.xwxx.problem1 = '是';
                    $scope.radiobutton1 = true;
                } else if ($scope.zsyt == '0' || $scope.zsyt == 0) {
                    $scope.xwxx.problem1 = '否';
                    $scope.radiobutton11 = true;
                }
                //  第二个问题
                if ($scope.gyfs == '1' || $scope.gyfs == 1) {
                    $scope.xwxx.problem2 = '共有';
                    $scope.radiobutton2 = true;
                    $scope.ddsyShow = false;
                } else if ($scope.gyfs == '0' || $scope.gyfs == 0) {
                    $scope.xwxx.problem2 = '单独所有';
                    $scope.radiobutton22 = true;
                    $scope.ddsyShow = true;
                }
                // 第三个问题
                if ($scope.gyqk == '1' || $scope.gyqk == 1) {
                    $scope.xwxx.problem3 = '是';
                    $scope.radiobutton3 = true;
                    let mainDiv4 = document.getElementById('mainDiv4');
                    $scope.xwxx.problem3 = '共同共有'
                    mainDiv4.disabled = true;
                    $scope.xwxx.problem4 = '';
                } else if ($scope.gyqk == '0' || $scope.gyqk == 0) {
                    $scope.xwxx.problem3 = '否';
                    $scope.radiobutton33 = true;
                    let mainDiv4 = document.getElementById('mainDiv4');
                    $scope.xwxx.problem3 = '按份共有'
                    mainDiv4.disabled = false;
                }
                // 第四个问题
                $scope.xwxx.problem4 = $scope.xwblData.gyfe;

                // 第五个问题
                if ($scope.sfbtygzdj == '1' || $scope.sfbtygzdj == 1) {
                    $scope.xwxx.problem5 = '是';
                    $scope.radiobutton5 = true;
                } else if ($scope.sfbtygzdj == '0' || $scope.sfbtygzdj == 0) {
                    $scope.xwxx.problem5 = '否';
                    $scope.radiobutton55 = true;
                }

                // 第六个问题
                if ($scope.sfzxyyzr == '1' || $scope.sfzxyyzr == 1) {
                    $scope.xwxx.problem6 = '是';
                    $scope.radiobutton6 = true;
                } else if ($scope.sfzxyyzr == '0' || $scope.sfzxyyzr == 0) {
                    $scope.xwxx.problem6 = '否';
                    $scope.radiobutton66 = true;
                }

                // 第七个问题
                if ($scope.anfyrsfty == '1' || $scope.anfyrsfty == 1) {
                    $scope.xwxx.problem7 = '是';
                    $scope.radiobutton7 = true;
                } else if ($scope.anfyrsfty == '0' || $scope.anfyrsfty == 0) {
                    $scope.xwxx.problem7 = '否';
                    $scope.radiobutton77 = true;
                }

                //抵押登记
                // 第五个问题
                if ($scope.sfxzxql == '1' || $scope.sfxzxql == 1) {
                    $scope.xwxx.dyProblem5 = '有';
                    $scope.dyButton55 = true;
                    $scope.smqkShow = true;
                    $scope.xwxx.xzxqlsm = $scope.xwblData.xzxqlsm
                } else if ($scope.sfxzxql == '0' || $scope.sfxzxql == 0) {
                    $scope.xwxx.dyProblem5 = '无';
                    $scope.dyButton5 = true;
                    $scope.smqkShow = false;
                    $scope.xwxx.xzxqlsm = "";
                }

                // 第六个问题
                if ($scope.sfswdy == '1' || $scope.sfswdy == 1) {
                    $scope.xwxx.dyProblem6 = '是';
                    $scope.dyButton6 = true;
                    $scope.swqrShow = true;
                    $scope.xwxx.dysw = $scope.xwblData.dysw;
                    $scope.xwxx.swqr = $scope.xwblData.swqr;
                } else if ($scope.sfswdy == '0' || $scope.sfswdy == 0) {
                    $scope.xwxx.dyProblem6 = '否';
                    $scope.dyButton66 = true;
                    $scope.swqrShow = false;
                    $scope.xwxx.swqr = "";
                    $scope.xwxx.dysw = "";
                }

                // 第七个问题
                if ($scope.dyfs == '1' || $scope.dyfs == 1) {
                    $scope.xwxx.dyProblem7 = '最高额抵押';
                    $scope.dyButton7 = true;
                } else if ($scope.dyfs == '0' || $scope.dyfs == 0) {
                    $scope.xwxx.dyProblem7 = ' 一般抵押';
                    $scope.dyButton77 = true;
                }

                // 第八个问题
                if ($scope.sfymss == '1' || $scope.sfymss == 1) {
                    $scope.xwxx.dyProblem8 = '是';
                    $scope.dyButton8 = true;
                } else if ($scope.sfymss == '0' || $scope.sfymss == 0) {
                    $scope.xwxx.dyProblem8 = '否';
                    $scope.dyButton88 = true;
                }


            } else {
                $scope.showImg1 = true;
                $scope.gyfeShow = true;
                $scope.smqkShow = false;
                $scope.swqrShow = false;
                $scope.ddsyShow = true;
            }

        }
        $scope.init();

        // 第一个问题
        $scope.insure1 = function (value) {
            $scope.zsyt = value;
            if (value == '1' || value == 1) {
                $scope.xwxx.problem1 = '是'
            } else if (value == '0' || value == 0) {
                $scope.xwxx.problem1 = '否'
            }
        }

        $scope.insure2 = function (value) {
            $scope.gyfs = value;
            // console.log($scope.questionData.pro1)
            if (value == '1' || value == 1) {
                $scope.xwxx.problem2 = '共有'
                $scope.ddsyShow = false;
            } else if (value == '0' || value == 0) {
                $scope.xwxx.problem3 = '';
                $scope.xwxx.problem4 = '';
                $scope.gyqk = null;
                $scope.xwxx.problem2 = '单独所有'
                $scope.radiobutton3 = false;
                $scope.radiobutton33 = false;
                $scope.ddsyShow = true;
                $scope.gyfeShow = true;
            }
        }

        $scope.insure3 = function (value) {
            $scope.gyqk = value;
            if (value == '1' || value == 1) {
                $scope.xwxx.problem3 = '共同共有'
                $scope.gyfeShow = true;
                $scope.xwxx.problem4 = "";
            } else if (value == '0' || value == 0) {
                $scope.xwxx.problem3 = '按份共有'
                $scope.gyfeShow = false;
            }
        }

        $scope.insure5 = function (value) {
            $scope.sfbtygzdj = value;
            if (value == '1' || value == 1) {
                $scope.xwxx.problem5 = '是'
            } else if (value == '0' || value == 0) {
                $scope.xwxx.problem5 = '否'
            }
        }

        $scope.insure6 = function (value) {
            $scope.sfzxyyzr = value;
            if (value == '1' || value == 1) {
                $scope.xwxx.problem6 = '是'
            } else if (value == '0' || value == 0) {
                $scope.xwxx.problem6 = '否'
            }
        }

        $scope.insure7 = function (value) {
            $scope.anfyrsfty = value;
            if (value == '1' || value == 1) {
                $scope.xwxx.problem7 = '是'
            } else if (value == '0' || value == 0) {
                $scope.xwxx.problem7 = '否'
            }
        }

        $scope.insure8 = function (value) {
            if (value == '1' || value == 1) {
                $scope.xwxx.problem8 = '是'
            } else if (value == '0' || value == 0) {
                $scope.xwxx.problem8 = '否'
            }
        }

        $scope.insureDydj = function (value) {
            $scope.sfxzxql = value;
            if (value == '1' || value == 1) {
                $scope.xwxx.dyProblem5 = '有'
                $scope.smqkShow = true;
            } else if (value == '0' || value == 0) {
                $scope.xwxx.dyProblem5 = '无'
                $scope.smqkShow = false;
                $scope.xwxx.xzxqlsm = "";
            }
        }

        $scope.insureDydj2 = function (value) {
            $scope.sfswdy = value
            if (value == '1' || value == 1) {
                $scope.xwxx.dyProblem6 = '是'
                $scope.swqrShow = true;
            } else if (value == '0' || value == 0) {
                $scope.xwxx.dyProblem6 = '否'
                $scope.swqrShow = false;
                $scope.xwxx.swqr = "";
                $scope.xwxx.dysw = "";
            }
        }

        $scope.insureDydj3 = function (value) {
            $scope.dyfs = value;
            if (value == '1' || value == 1) {
                $scope.xwxx.dyProblem7 = '最高额抵押'
            } else if (value == '0' || value == 0) {
                $scope.xwxx.dyProblem7 = '一般抵押'
            }
        }

        $scope.insureDydj4 = function (value) {
            $scope.sfymss = value;
            if (value == '1' || value == 1) {
                $scope.xwxx.dyProblem8 = '是'
            } else if (value == '0' || value == 0) {
                $scope.xwxx.dyProblem8 = '否'
            }
        }


        // 验证信息是否输入完整
        $scope.confirmfamilymember = function () {
            var canSave = false;
            if ($scope.zsyt == undefined || $scope.zsyt === null || $scope.zsyt === "") {
                showAlert("申请登记事项是否为申请人的真实意思表示");
            } else if ($scope.gyfs == undefined || $scope.gyfs === null || $scope.gyfs === "") {
                showAlert("请选择申请登记的不动产是共有，还是单独所有");
            } else if ($scope.baseData == null || $scope.baseData == undefined) {
                showAlert("请绘制签名");
            } else {
                canSave = true;
            }
            return canSave;
        }

        // 上传数据
        $scope.submit = function () {
            if ($scope.confirmfamilymember()) {
                if ($scope.gyfs == "0" || $scope.gyfs == 0) {
                    $scope.xwxx.problem3 = '';
                    $scope.xwxx.problem4 = '';
                    $scope.gyqk = "";
                    console.log($scope.gyqk);
                    console.log($scope.xwxx.problem4);
                }
                show();
                console.log($scope.xwxx.xwr)
                $menuService.saveInquiryRecord({
                    sqrId: $scope.id,
                    ywh: $scope.ywh,
                    zsyt: $scope.zsyt,
                    gyfs: $scope.gyfs,
                    gyqk: $scope.gyqk,
                    gyfe: $scope.xwxx.problem4,
                    sfbtygzdj: $scope.sfbtygzdj,
                    sfzxyyzr: $scope.sfzxyyzr,
                    anfyrsfty: $scope.anfyrsfty,
                    sfxzxql: $scope.sfxzxql,
                    sfswdy: $scope.sfswdy,
                    dyfs: $scope.dyfs,
                    sfymss: $scope.sfymss,
                    djsx: $scope.djsx,
                    xzxqlsm: $scope.xwxx.xzxqlsm,
                    dysw: $scope.xwxx.dysw,
                    swqr: $scope.xwxx.swqr,
                    contactPhone: userData.tel,
                    signName: userData.name,
                    signIdCard: userData.zjh,
                    qt: $scope.xwxx.qt,
                    xwr: $scope.xwxx.xwr,
                    sign: "data:image/gif;base64," + $scope.baseData,
                }).then(function (res) {
                    console.log(JSON.stringify(res));
                    // $scope.checkDjsq();
                    showAlert("提交成功");
                    hide();
                    // const { userAgent: UA } = navigator;
                    // const UA_L = UA.toLowerCase();
                    // const Device = {
                    //     trident: UA.includes('Trident'), //IE内核
                    //     presto: UA.includes('Presto'), //opera内核
                    //     iPad: UA.includes('iPad'), //是否iPad
                    //     iPhone: UA.includes('iPhone'), //是否为iPhone或者QQHD浏览器
                    //     webKit: UA.includes('AppleWebKit'), //苹果、谷歌内核
                    //     webApp: UA.indexOf('Safari') === -1, //是否web应该程序，没有头部与底部
                    //     mobile: !!UA.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                    //     ios: !!UA.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                    //     android: UA.includes('Android') || UA.includes('Linux'), //android终端或uc浏览器
                    //     gecko: UA.includes('Gecko') && UA.indexOf('KHTML') === -1, //火狐内核
                    //     wechat: UA_L.toLowerCase().match(/MicroMessenger/i) == 'micromessenger', // 微信
                    //     is: key => Device[key]
                    // };

                    /* if (Device.is('wechat') && Device.is('android')) {
                        $state.go('recordVideo');
                    }
                    if (Device.is('wechat') && Device.is('ios')) {
                        $state.go('recordVideoApp');
                    } */
                    //河北目前只有http环境,需要https环境才能启动摄像头录制,目前暂时就用系统相机录制
                    $state.go('recordVideoApp');

                }, function (error) {
                    $scope.showAlert('提交失败！')
                    hide();
                    console.log(JSON.stringify(error))
                }
                );
            }
        }

        // 签名
        $scope.sign = function () {
            let xwblData = {
                sqrId: $scope.id,
                ywh: $scope.ywh,
                zsyt: $scope.zsyt,
                gyfs: $scope.gyfs,
                gyqk: $scope.gyqk,
                gyfe: $scope.xwxx.problem4,
                sfbtygzdj: $scope.sfbtygzdj,
                sfzxyyzr: $scope.sfzxyyzr,
                anfyrsfty: $scope.anfyrsfty,
                sfxzxql: $scope.sfxzxql,
                sfswdy: $scope.sfswdy,
                dyfs: $scope.dyfs,
                sfymss: $scope.sfymss,
                djsx: $scope.djsx,
                xzxqlsm: $scope.xwxx.xzxqlsm,
                dysw: $scope.xwxx.dysw,
                swqr: $scope.xwxx.swqr,
                contactPhone: userData.tel,
                signName: userData.name,
                signIdCard: userData.zjh,
                qt: $scope.xwxx.qt,
                xwr: $scope.xwxx.xwr,
            }
            console.log(JSON.stringify(xwblData))
            $state.go('xwblxy', {
                xwblData: xwblData,
            });
        }

        // 广播
        $rootScope.$on('xwbl', function (event, data) {
            $scope.baseData = data.baseData;
            $scope.xwblData = data.xwblData;
            $scope.init();
        });

        // 提交进度条
        show = function () {
            $ionicLoading.show({
                template: '<ion-spinner icon="lines" class="spinner-calm"></ion-spinner><p>正在提交询问笔录</p>',
                duration: 10000
            });
        };

        hide = function () {
            $ionicLoading.hide();
        };

        //提示对话框
        $scope.showAlert = function (msg) {
            ionicToast.show(msg, 'middle', false, 2000);
        };
    }
]);
