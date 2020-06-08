angular.module('xwblqmCtrl', []).controller('xwblqmCtrl', ["$scope", "$state", "$stateParams", "$ionicHistory",
    "ionicToast",
    "$menuService", "$bsznService", "$rootScope", "$dictUtilsService", "$ionicLoading", "$wysqService",
    function ($scope, $state, $stateParams, $ionicHistory, ionicToast, $menuService, $bsznService, $rootScope,
        $dictUtilsService, $ionicLoading, $wysqService, ) {
        $scope.goback = function () {
            $ionicHistory.goBack(); //返回上一个页面
        };

        $scope.xwblData = $stateParams.xwblData;
        var apiInstance;
        var api_res;
        var b = document.getElementById("sign3")
        b.style.display = "none";

        var apiCallback = function (callback_type, index, data) {
            if (callback_type == CALLBACK_TYPE_SIGNATURE) {
                //签名回显
                document.getElementById("sign3").src = "data:image/png;base64," + data;
            }
            // alert("收到浏览器回调：" + "callback_type：" + callback_type + " index：" + index + " data：" + data);
            $scope.baseData = data;
        };


        $scope.initApi = function () {
            apiInstance = new TrustSignAPI();
            apiInstance.singleSignCanvas();
            api_res = apiInstance.initTrustSignAPI(apiCallback);
            var businessId = "FV91knBmCbCROHg4"; //商户号，由我们提供，请咨询项目经理
            /**
             * 设置商户号
             * @param businessId 商户号
             * @returns {int} 商户号是否设置成功
             * @errorCode ERROR_API_NOT_INITED 接口未初始化错误
             * @errorCode ERROR_BUSINESSID_INVALID 检测到未设置商户号或者商户号不符合要求
             * @errorCode RESULT_OK：操作成功
             */
            api_res = apiInstance.setTBusiness(businessId);

            //设置证书公钥,由湖北CA公司提供，请咨询项目经理
            var certPubKey =
                "af634ebf6c1a1401fff01753ffff9c790b574a3fe3c41ccc37647d88f53892a0cffc9d4d93886eb323dfc24502dccdc4317a3d6ac5cb99c6d29fd0314ef3ac42835282a7fc1ecaa94f7ca5f6aa26444c7eab12f127c1e5feeb29c49c37c0afe0493d1b73414e86203c261a70089a4921d2af298ab24ff87bfdb06469be171b53";
            //                var certPubKey = "9d0eff07c47a27a898c18fc89fd25b21898885b5a97054e81684e22bf13cd8725e7ff03ba2f8c1ad8c998952a30a65ff61ecbdb042661b8813e7a936de3474a51eb8a05458f7b357d95bb4f55741380403c1148108dfab4399af45d351deebaabffff552c10c6cd1599bc87642d37af5d474138a37fb60cdb7dcb3dbb9872a29";
            /**
             * 设置证书公钥
             * @param certPubKey 证书公钥
             * @returns {int} 证书公钥是否设置成功
             * @errorCode ERROR_API_NOT_INITED 接口未初始化错误
             * @errorCode ERROR_SERVERCERT_INVALID 证书公钥未设置或格式不对
             * @errorCode RESULT_OK：操作成功
             */
            api_res = apiInstance.setTServerCert(certPubKey);

            //配置原文数据
            var originalConfig = new OriginalConfig();
            originalConfig.originalType = OriginalType.HTML; //OriginalType.HTML/OriginalType.PDF
            //originalConfig.originalBase64Str 为BASE64编码后的数据
            originalConfig.originalBase64Str = "1111111";
            /**
             * 设置原文数据
             * @param originalConfig 配置签字相应属性，具体参考demo或者文档
             * @returns {int} 是否设置成功
             * @errorCode ERROR_API_NOT_INITED 接口未初始化错误
             * @errorCode ERROR_ORIGINAL_CONFIG_INVALID  原文配置对象错误或者为空
             * @errorCode ERROR_ORIGINAL_TYPE_INVALID    原文类型错误或者为空
             * @errorCode ERROR_ORIGINAL_CONTENT_INVALID 原文类型错误或者为空
             * @errorCode ERROR_ORIGINAL_XSLTID_INVALID  当原文类型为XML时，模板号配置错误或者未配置
             * @errorCode RESULT_OK 操作成功
             */
            //api_res = apiInstance.setTOriginal(originalConfig);
            //if(api_res!=RESULT_OK){
            //    alert("setTOriginal result : " + api_res);
            //}else{
            //	alert("setTOriginal result : OK");
            //}

            //注册第一个单字签字对象
            /**
             * 签名人信息
             * @param name 签名人姓名
             * @param number 签名人证件号码
             * @param type 签名人证件类型
             * @constructor
             */
            var signer = new Signer("张珊", "1001001", SignCardType.ID_CARD);

            //                /**
            //                 *根据关键字定位签名位置,两种规则选择一种即可
            //                 * @param keyWord 关键字字面值
            //                 * @param xOffset X轴偏移量
            //                 * @param yOffset Y轴偏移量
            //                 * @param KWIndex 第几个关键字
            //                 */
            var signerRule = new SignRule_KeyWord("j", 100, 0, 1);

            /**
             * 根据坐标定位签名方式,两种规则选择一种即可
             * @param left 签名图片最左边坐标值，相对于PDF当页最左下角(0,0)点，向上和向右分别为X轴、Y轴正方向
             * @param top 签名图片顶边坐标值，相对于PDF当页最左下角(0,0)点，向上和向右分别为X轴、Y轴正方向
             * @param right 签名图片最右边坐标值，相对于PDF当页最左下角(0,0)点，向上和向右分别为X轴、Y轴正方向
             * @param bottom 签名图片底边坐标值，相对于PDF当页最左下角(0,0)点，向上和向右分别为X轴、Y轴正方向
             * @param pageNo 签名在PDF中的页码，从1开始
             */
            //                var signerRule = new SignRule_XYZ(20.0, 750.1, 80.2, 650.3, 4);

            var signConfig = new UserSignConfig(signer, signerRule);
            signConfig.signAreaWidth = 40;
            signConfig.signAreaHeight = 40;
            /**
             * 配置一个签名对象
             * @param signIndex 签名的索引值，代表第几个签名
             * @param userSignConfig 配置签字相应属性，具体参考demo或者文档
             * @returns {int} 是否设置成功
             * @errorCode ERROR_API_NOT_INITED 接口未初始化错误
             * @errorCode ERROR_USERSIGN_CONFIG_INVALID  配置用户签名时，配置对象有误或者为空
             * @errorCode ERROR_USERSIGN_SIGNER_INVALID  配置用户签名时，签名人信息有误或者为空
             * @errorCode ERROR_USERSIGN_SIGNRULE_INVALID  配置用户签名时，签名规则信息有误或者为空
             * @errorCode RESULT_OK 操作成功
             */
            api_res = apiInstance.addTUserSign(0, signConfig);


        }

        $(document).ready(function () {
            $scope.initApi();
            let a = document.getElementById("dialog")
            a.style.position = "relative";
            clear_canvas();
            api_res = apiInstance.showTSignBoard(0);
        });

        $scope.sign = function () {
            /**
             * 弹出手写签名框
             * @param signIndex 之前配置的签名索引值
             * @return {int} 是否成功弹出
             * @errorCode ERROR_API_NOT_INITED 接口未初始化错误
             * @errorCode ERROR_SHOWSIGNBOARD_SIGNCONFIG_INVALID 显示签名框时，获取签名配置信息失败或者未配置签名
             * @errorCode RESULT_OK 操作成功
             */
            let a = document.getElementById("dialog")
            a.style.position = "relative";
            let b = document.getElementById("sign3")
            b.style.display = "none";
            clear_canvas();
            api_res = apiInstance.showTSignBoard(0);
            if (api_res != RESULT_OK) {
                alert("showTSignBoard result : " + api_res);
            } else {
                //					alert("showTSignBoard result : OK");
            }
        }

        // 确认按钮
        $scope.sign_confirm = function () {
            if (!isDrawn) {
                custom_alert("请手写签名", "确认");
                return;
            }
            let b = document.getElementById("sign3")
            b.style.display = "block";
            var canvas = document.getElementById('trustCanvas');
            var ctx = canvas.getContext('2d');
            var width = maxX - minX + paste_padding + paste_padding;
            var height = maxY - minY + paste_padding + paste_padding;
            imageDataTmp = ctx.getImageData(minX - paste_padding, minY - paste_padding, width + paste_padding, height +
                paste_padding);
            if (signResCallback) {
                var signData = getSigData();
                var canvas = document.getElementById('trustCanvas');
                signResCallback(signObjTmp.signIndex, signData[0].substr(22, signData[0].length), signData[1].substr(22,
                    signData[1].length), signTrack, signTrachPointCount, canvas.width, canvas.height)
            }
            document.body.parentNode.style.overflow = "scroll"; //显示且可用
            $rootScope.$broadcast('xwbl', {
                baseData: $scope.baseData,
                xwblData: $scope.xwblData
            });
            $ionicHistory.goBack(-2);
        }


        // 清屏
        $scope.clear_canvas = function () {
            var canvas = document.getElementById('trustCanvas');
            var ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.closePath();
            var w = canvas.width;
            var h = canvas.height; // save old width/height
            canvas.width = canvas.height = 0; //set width/height to zero
            canvas.width = w;
            canvas.height = h; //restore old width/height
            calculatedSigWidth = 0; //reset output signature's dimensions
            calculatedSigHeight = 0;
            signTrack = "";
            signTrachPointCount = 0;
            firstPointTime = 0;
            points = [];
            minX = 9999, minY = 9999, maxX = 0, maxY = 0;
            imageDataTmp = null;
            isDrawn = false;

        }
        // 取消
        $scope.cancelSign = function () {
            var dlg = document.getElementById("dialog");
            dlg.style.display = 'none';

            document.body.scroll = "yes";
            let b = document.getElementById("sign3")
            b.style.display = "block";
            $ionicHistory.goBack(-2);
        }


        //提示对话框
        $scope.showAlert = function (msg) {
            ionicToast.show(msg, 'middle', false, 2000);
        };
    }
]);
