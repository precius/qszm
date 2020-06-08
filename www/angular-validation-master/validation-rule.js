 angular
        .module('validation.rule', ['validation'])
        .config(['$validationProvider', function ($validationProvider) {
            var expression = {
                /**
                 * @member NgModule.validation.rule
                 * @method required 必填验证
                 */
                required: function (value) {
                    return !!value;
                },
                /**
                 * @member NgModule.validation.rule
                 * @method url 网址验证
                 */
                url: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/,
                /**
                 * @member NgModule.validation.rule
                 * @method email 邮箱验证
                 */
                email: /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
                /**
                 * @member NgModule.validation.rule
                 * @method number 数值验证
                 * @param {Number} param 数值
                 */
                number: function (value, scope, element, attrs, param) {
                    if (GM.CommonOper.isStrNullOrEmpty(value)) {
                        return true;
                    }
                    var re = /^\d*(\.\d+)?$/g;
                    var bRt = re.test(value);
                    return bRt;
                },
                /**
                 * @member NgModule.validation.rule
                 * @method minlength 最小长度验证（字符串长度）
                 * @param {Number} param 最小长度值
                 */
                minlength: function (value, scope, element, attrs, param) {
                    return value && value.length >= param;
                },
                /**
                 * @member NgModule.validation.rule
                 * @method maxlength 最大长度验证（字符串长度）
                 * @param {Number} param 最大长度值
                 */
                maxlength: function (value, scope, element, attrs, param) {
                    if (GM.CommonOper.isStrNullOrEmpty(value)) {
                        return true;
                    }
                    return !value || value.length <= param;
                },
                /**
                 * @member NgModule.validation.rule
                 * @method maxcharlength 最大字符长度验证
                 * @param {Number} param 最大长度值
                 */
                maxcharlength: function (value, scope, element, attrs, param) {
                    if (GM.CommonOper.isStrNullOrEmpty(value)) {
                        return true;
                    }
                    if (Number.isNaN(Number(param))) {
                        return false;
                    }
                    var nLength = GM.CommonOper.getCharLength(value);
                    return nLength <= Number(param);
                },
                /**
                 * @member NgModule.validation.rule
                 * @method mincharlength 最小字符长度验证
                 * @param {Number} param 最小长度值
                 */
                mincharlength: function (value, scope, element, attrs, param) {
                    if (Number.isNaN(Number(param))) {
                        return false;
                    }
                    var nLength = GM.CommonOper.getCharLength(value);
                    return nLength >= Number(param);
                },
                /**
                 * @member NgModule.validation.rule
                 * @method numberleter 数字字母验证
                 * @param {String} param 数字字母
                 */
                numberleter: function (value, scope, element, attrs, param) {
                    if (GM.CommonOper.isStrNullOrEmpty(value)) {
                        return true;
                    }
                    var re = /^(\d|[a-z]|[A-Z])+$/g;
                    var bRt = re.test(value);
                    return bRt;
                },
                /**
                 * @member NgModule.validation.rule
                 * @method maxnum 最大值验证
                 * @param {Number} param 最大值
                 */
                maxnum: function (value, scope, element, attrs, param) {
                    if (GM.CommonOper.isStrNullOrEmpty(value) || Number.isNaN(Number(param))) {
                        return true;
                    }
                    var bRt = Number(value) <= Number(param);
                    return bRt;
                },
                /**
                 * @member NgModule.validation.rule
                 * @method minnum 最小值验证
                 * @param {Number} param 最小值
                 */
                minnum: function (value, scope, element, attrs, param) {
                    if (GM.CommonOper.isStrNullOrEmpty(value) || Number.isNaN(Number(param))) {
                        return true;
                    }
                    var bRt = Number(value) >= Number(param);
                    return bRt;
                },
                /**
                 * @member NgModule.validation.rule
                 * @method dlength 长度验证（字符串长度）
                 * @param {Number} param 长度值
                 */
                dlength: function (value, scope, element, attrs, param) {
                    if (value == null) {
                        return true;
                    }
                    var bRt = String(value).length === Number(param);
                    return bRt;
                },
                /**
                 * @member NgModule.validation.rule
                 * @method normalchar 汉字字母验证
                 * @param {String} param 汉字字母
                 */
                normalchar: function (value, scope, element, attrs, param) {
                    if (GM.CommonOper.isStrNullOrEmpty(value)) {
                        return true;
                    }
                    var re = /([\u4e00-\u9fa5]|\w)+$/g;
                    var bRt = re.test(value);
                    return bRt;
                },
                /**
                 * @member NgModule.validation.rule
                 * @method chinese 汉字验证
                 * @param {String} param 汉字
                 */
                chinese: function (value, scope, element, attrs, param) {
                    if (GM.CommonOper.isStrNullOrEmpty(value)) {
                        return true;
                    }
                    var re = /[\u4e00-\u9fa5]+$/g;
                    var bRt = re.test(value);
                    return bRt;
                },
                /**
                 * @member NgModule.validation.rule
                 * @method phone 电话号码，包括座机和手机验证
                 * @param {String} param 电话号码
                 */
                phone: function (value, scope, element, attrs, param) {
                    if (GM.CommonOper.isStrNullOrEmpty(value)) {
                        return true;
                    }
                    var re = /^\d+-?\d+$/g;
                    var bRt = re.test(value);
                    return bRt;
                },
                /**
                 * @member NgModule.validation.rule
                 * @method ip ip地址验证
                 * @param {String} ip地址
                 */
                ip: function (value, scope, element, attrs, param) {
                    if (GM.CommonOper.isStrNullOrEmpty(value)) {
                        return true;
                    }
                    var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/g;
                    var bRt = re.test(value);
                    return bRt;
                },
                /**
                 * @member NgModule.validation.rule
                 * @method idcard 身份证验证
                 * @param {String} param
                 */
                idcard: function (value, scope, element, attrs, param) {
                    if (GM.CommonOper.isStrNullOrEmpty(value)) {
                        return true;
                    }
                    var idcard, Y, JYM;
                    idcard = value;
                    if (idcard == null || idcard === '') {
                        return false;
                    }
                    var Errors = [true, false, false, false, false];
                    var S, M;
                    var idcardArray = [];
                    idcardArray = idcard.split('');
                    //地区检验
                    //if(area[parseInt(idcard.substr(0,2))]==null) return Errors[4];
                    //身份号码位数及格式检验
                    switch (idcard.length) {
                    case 15:
                        if ((parseInt(idcard.substr(6, 2)) + 1900) % 4 === 0 || ((parseInt(idcard.substr(6, 2)) + 1900) % 100 === 0 && (parseInt(idcard.substr(6, 2)) + 1900) % 4 === 0)) {
                            ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;//测试出生日期的合法性
                        } else {
                            ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;//测试出生日期的合法性
                        }
                        if (ereg.test(idcard)) return Errors[0];
                        else return Errors[2];
                    case 18:
                        //18 位身份号码检测
                        //出生日期的合法性检查
                        //闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
                        //平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
                        if (parseInt(idcard.substr(6, 4)) % 4 === 0 || (parseInt(idcard.substr(6, 4)) % 100 === 0 && parseInt(idcard.substr(6, 4)) % 4 === 0)) {
                            ereg = /^[1-9][0-9]{7}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;//闰年出生日期的合法性正则表达式
                        } else {
                            ereg = /^[1-9][0-9]{7}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;//平年出生日期的合法性正则表达式
                        }
                        if (ereg.test(idcard)) { //测试出生日期的合法性
                            //计算校验位
                            S = (parseInt(idcardArray[0]) + parseInt(idcardArray[10])) * 7 +
                                    (parseInt(idcardArray[1]) + parseInt(idcardArray[11])) * 9 +
                                    (parseInt(idcardArray[2]) + parseInt(idcardArray[12])) * 10 +
                                    (parseInt(idcardArray[3]) + parseInt(idcardArray[13])) * 5 +
                                    (parseInt(idcardArray[4]) + parseInt(idcardArray[14])) * 8 +
                                    (parseInt(idcardArray[5]) + parseInt(idcardArray[15])) * 4 +
                                    (parseInt(idcardArray[6]) + parseInt(idcardArray[16])) * 2 +
                                    parseInt(idcardArray[7]) * 1 +
                                    parseInt(idcardArray[8]) * 6 +
                                    parseInt(idcardArray[9]) * 3;
                            Y = S % 11;
                            M = 'F';
                            JYM = '10X98765432';
                            M = JYM.substr(Y, 1);//判断校验位
                            if (M === idcardArray[17]) return Errors[0]; //检测ID的校验位
                            else return Errors[3];
                        } else return Errors[2];
                    case 10:
                        //香港身份证
                        ereg = /^[A-Z]\d{6}[(|（]\d[)|）]$/g;
                        if (ereg.test(idcard)) {
                            return Errors[0];
                        } else {
                            return false;
                        }
                    default:
                        return Errors[1];
                    }
                },
                none: function () {
                    return true;
                }
            };

            var defaultMsg = {
                required: {
                    error: '必填'
                },
                url: {
                    error: '不是合法的网址'
                },
                email: {
                    error: '不是合法的邮箱地址'
                },
                number: {
                    error: '不是合法的数字'
                },
                minlength: {
                    error: '没有达到最小长度'
                },
                maxlength: {
                    error: '超过最大长度'
                },
                maxcharlength: {
                    error: '超过最大字符长度'
                },
                mincharlength: {
                    error: '小于最小字符长度'
                },
                maxnum: {
                    error: '超过最大值'
                },
                minnum: {
                    error: '没有达到最小值'
                },
                dlength: {
                    error: '长度错误'
                },
                normalchar: {
                    error: '只能为汉字数字字母'
                },
                numberleter: {
                    error: '只能为字母加数字'
                },
                chinese: {
                    error: '只能为中文内容'
                },
                phone: {
                    error: '必须为合法电话'
                },
                ip: {
                    error: 'ip地址不合法'
                },
                idcard: {
                    error: '身份证不合法'
                },
                none: {
                    error: '不验证'
                }
            };
            $validationProvider.setExpression(expression).setDefaultMsg(defaultMsg);
        }]);
