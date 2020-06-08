/**
 * Created by han on 16-4-15.
 */


document.write("<link href=\"./css/canvas_css.css\" rel=\"stylesheet\">");
document.write("<link href=\"./css/trust.css\" rel=\"stylesheet\">");

document.write("<link media=\"screen and (max-width: 480px)\" href=\"./css/mw480Portrait.css\" rel=\"stylesheet\">");
document.write("<link media=\"screen and (min-width: 480px) and (max-width: 1024px)\" href=\"./css/mw480Portrait.css\" rel=\"stylesheet\">");
document.write("<link media=\"screen and (min-width: 1024px)\" href=\"./css/sw1024.css\" rel=\"stylesheet\">");

document.write("<script language=javascript src=\"./libs/zlib/deflate.min.js\" charset=\"utf-8\"></script>");

document.write("<script language=javascript src=\"./libs/CryptoJS/components/core-min.js\" charset=\"utf-8\"></script>");
document.write("<script language=javascript src=\"./libs/CryptoJS/rollups/sha1.js\" charset=\"utf-8\"></script>");
document.write("<script language=javascript src=\"./libs/CryptoJS/rollups/tripledes.js\" charset=\"utf-8\"></script>");
document.write("<script language=javascript src=\"./libs/CryptoJS/components/mode-ecb.js\" charset=\"utf-8\"></script>");

document.write("<script language=javascript src=\"./libs/trustAPI.js\" charset=\"utf-8\"></script>");

var core;

function TrustSignAPI()
{
	/**
	 * 初始化签名对象，通常从打开客户端到关闭客户端，中间只需要初始化一次。
	 * 要求回调函数至少有3个参数，参数定义如下面callback参数定义
	 * @param apiCallback Function with 3 params(int callback_type, int index, String data)
	 * @returns {int} 是否初始化成功以及是否回调函数参数满足要求
     * @errorCode ERROR_CALLBACK_EXCEPTION 初始化时，回调函数不满足要求
     * @errorCode RESULT_OK 操作成功
	 */
	this.initTrustSignAPI = function(apiCallback)
	{
        core = new trustWebImpl();
        return core._initTrustSignApi(apiCallback);
    };

    this.singleSignCanvas = function()
	{
        return _singleSignCanvas();
	};

    /**
     * 设置商户号
     * @param businessId 商户号
     * @returns {int} 商户号是否设置成功
     * @errorCode ERROR_API_NOT_INITED 接口未初始化错误
     * @errorCode ERROR_BUSINESSID_INVALID 检测到未设置商户号或者商户号不符合要求
     * @errorCode RESULT_OK：操作成功
     */
    this.setTBusiness = function(business)
    {
        return core._setTBusiness(business);
    };


    /**
     * 设置短信签名码接口，与showTSignBoard()可叠加使用，也可单独使用，但二者至少有一个
     * @param signIndex 之前配置的签名索引值
     * @param msgCode 短信签名码
     * @param phoneNum 手机号
     * @return {int} 是否成功
     * @errorCode ERROR_API_NOT_INITED 接口未初始化错误
     * @errorCode ERROR_MESSAGE_CODE_INVALID 短信验证码不正确
     * @errorCode ERROR_MESSAGE_PHONE_INVALID 手机号格式不正确
     * @errorCode ERROR_MESSAGE_SIGNCONFIG_INVALID 获取短信签名码相关的签名配置信息有误
     * @errorCode RESULT_OK 操作成功
     */
    this.setTMsgSignCode = function(signIndex,msgCode,phoneNum)
    {
        return core._setTMsgSignCode(signIndex,msgCode,phoneNum);
    };


    /**
     * 设置证书公钥
     * @param certPubKey 证书公钥
     * @returns {int} 证书公钥是否设置成功
     * @errorCode ERROR_API_NOT_INITED 接口未初始化错误
     * @errorCode ERROR_SERVERCERT_INVALID 证书公钥未设置或格式不对
     * @errorCode RESULT_OK：操作成功
     */
    this.setTServerCert = function(certPubKey)
    {
        return core._setTServerCert(certPubKey);
    };



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
    this.setTOriginal = function(originalConfig)
    {
        return core._setTOriginal(originalConfig);
    };


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
    this.addTUserSign = function(signIndex, userSignConfig)
    {
        return core._addTUserSign(signIndex, userSignConfig);
    };


    /**
     * 配置一个签章对象
     * @param unitSignConfig 配置公章相应属性，具体参考demo或者文档
     * @returns {int} 是否设置成功
     * @errorCode ERROR_API_NOT_INITED 接口未初始化错误
     * @errorCode ERROR_UNITSIGN_CONFIG_INVALID  配置单位章时，配置对象有误或者为空
     * @errorCode ERROR_UNITSIGN_SIGNRULE_INVALID  配置单位章时，签名规则信息有误或者为空
     * @errorCode RESULT_OK 操作成功
     */
    this.addTUnitSign = function(unitSignConfig)
    {
        return core._addTUnitSign(unitSignConfig);
    };


    /**
     * 添加身份鉴别方式
     * @param signIndex  对应的签名的索引值
     * @param mode  鉴别手段类型: 1:见面审核 2：身份证联网核查 3:人脸 4:手机号验证 5：邮箱验证 6:银行卡验证 7:第三方支付验证 8：第三方CA验证 100:其他验证
     * @param contentBase64Str
     *         type = 1时，contentBase64Str是姓名（UTF8编码）+证件类型+证件号码——>base64编码
     *         type = 2时，contentBase64Str是姓名（UTF8编码）+证件类型+证件号码——>base64编码
     *         type = 3时，contentBase64Str为空
     *         type = 4时，contentBase64Str是手机号码——>base64编码
     *         type = 5时，contentBase64Str是邮箱地址——>base64编码
     *         type = 6时，contentBase64Str是姓名（UTF8编码）+银行卡号——>base64编码
     *         type = 7时，contentBase64Str是集成商输入字符串——>base64编码
     *         type = 8时，contentBase64Str是集成商输入字符串——>base64编码
     *         type = 100时，contentBase64Str是集成商输入字符串——>base64编码，原文的BASE64编码数据
     * @returns {int} 是否配置成功
     * @errorCode ERROR_API_NOT_INITED 接口未初始化错误
     * @errorCode ERROR_IDMODE_SIGNCONFIG_INVALID 配置身份鉴别手段时，获取签名配置信息失败或者未配置签名
     * @errorCode RESULT_OK 操作成功
     */
    this.addTIdentificationMethod = function(signIndex, mode,contentBase64Str)
    {
        return core._addTIdentificationMethod(signIndex,mode,contentBase64Str);
    };


    /**
     * 添加签名证据
     * @param signIndex  对应的签名的索引值，代表向第几个签名添加证据
     * @param contentBase64Str 证据内容，原文的BASE64编码数据
     * @param evidenceType 证据类型，枚举类型 ，参考EvidenceType
     * @returns {int} 是否配置成功
     * @errorCode ERROR_API_NOT_INITED 接口未初始化错误
     * @errorCode ERROR_EVIDENCE_SIGNCONFIG_INVALID 配置证据数据时，获取签名配置信息失败或者未配置签名
     * @errorCode RESULT_OK 操作成功
     */
    this.addTEvidence = function(signIndex,contentBase64Str,evidenceType)
    {
        return core._addTEvidence(signIndex,contentBase64Str,evidenceType);
    };


    /**
     * 弹出手写签名框
     * @param signIndex 之前配置的签名索引值
     * @return {int} 是否成功弹出
     * @errorCode ERROR_API_NOT_INITED 接口未初始化错误
     * @errorCode ERROR_SHOWSIGNBOARD_SIGNCONFIG_INVALID 显示签名框时，获取签名配置信息失败或者未配置签名
     * @errorCode RESULT_OK 操作成功
     */
	this.showTSignBoard = function(signIndex)
	{
		return core._showTSignBoard(signIndex);
	};


    /**
     * 一次业务完成后，调用此接口判断上传数据是否准备就绪
     * @return {int} 是否准备就绪
     * @errorCode ERROR_API_NOT_INITED 接口未初始化错误
     * @errorCode ERROR_ISREADY_BUSINESS_INVALID 上传是否就绪时，检测到未设置商户号
     * @errorCode ERROR_ISREADY_SERVERCERT_INVALID 上传是否就绪时，证书公钥未设置或格式不对
     * @errorCode ERROR_ISREADY_ATLEASTONESIGN 上传是否就绪时，至少要有一个签名
     * @errorCode RESULT_OK 操作成功
     */
    this.isReadyToGen = function()
    {
        return core._isReadyToGen();
    };


    /**
     * 一次业务完成后，调用此接口获取加密数据
     * @return {} 是否准备就绪
     * @errorCode ERROR_API_NOT_INITED 接口未初始化错误
     * @errorCode ERROR_ISREADY_BUSINESS_INVALID 上传是否就绪时，商户号为空或格式不证书
     * @errorCode ERROR_ISREADY_SERVERCERT_INVALID 上传是否就绪时，证书公钥未设置或格式不对
     * @errorCode ERROR_ISREADY_ATLEASTONESIGN 上传是否就绪时，至少要有一个签名
     * @errorCode RESULT_OK 操作成功
     */
    this.genTEncData = function()
    {
        return core._GenTEncData();
    };


    /**
     * 重置API，开始一次新业务
     * 前一次业务的签名、拍照等数据会被清空
     * @returns {boolean} 是否重置成功
     */
	this.resetTAPI = function()
	{
		return core._resetTAPI();
	};


    /**
     * 销毁API
     * 所有数据会被清空，包括API
     * @returns {boolean} 是否销毁成功
     */
    this.finalizeTAPI = function()
    {
        core._finalizeTAPI();
        core = null;
        return true;
    };


    /**
     * 获得版本信息
     * @returns {String} 版本信息
     */
    this.getVersion = function()
    {
        return "Trust_V1.0_Web_1.0.0.828";
    };

}



/**
 * 原文数据容器，用于存放原文及相关配置
 * @constructor
 */
function OriginalConfig()
{
    this.originalType = 0;//取值范围为OriginalType.HTML/OriginalType.XML/OriginalType.PDF
    this.originalBase64Str = null;//base64后的数据原文
    this.xsltID = null;//如originalType为OriginalType.XML时需要设置此项，具体值请联系我们
}

 /**
 * 签名配置
 * @param signer 签名人，参考Signer定义，必填
 * @param signRule 签名规则，参考signRule定义，必填
 * @constructor
 */
function UserSignConfig(signer, signRule)
{

    if(!signer)
    {
        throw "UserSignConfig constructor parameter signer invalid";
    }

    if(!(signRule instanceof SignRule_KeyWord) && !(signRule instanceof SignRule_ServerConfig) && !(signRule instanceof SignRule_XYZ))
    {
        throw  "UserSignConfig constructor parameter signRule invalid";
    }

    this.signIndex = 0;
    this.signer = signer;//签名人信息，为必填项
    this.signRule = signRule;//签名放置到文档中的规则，如位置，大小等，为必填项
    this.title = "请签名";//签字输入有效，签字框标题
    this.titleHighLightStart = -1;//当为普通签名时有效，表示title中需要放大显示字体的数组起始index，从0开始
    this.titleHighLightEnd = -1;//当为普通签名时有效，表示title中需要放大显示字体的数组结束index，从0开始
    this.signAreaWidth = 200;//(只针对签名)生成PDF上签字图片区域的最大宽度(不排除实际签名宽度小于此值)，单位pt
    this.signAreaHeight = 160;//(只针对签名)生成PDF上签字图片区域的最大高度(不排除实际签名高度小于此值)，单位pt
    this.penColor = "#000000";//RGB，默认为黑色，每通道为0~255的16进制值，如#ffffff为白色
    // 目前改为回显用户图片，现在处理逻辑为，后台统一处理签名区域，前端不再进行处理，该signImgRatio属性，作用为回显放大图片，但是给发送后台图片只是经过压缩的图片
    //（修改前注释，以上面为准）保存到加密包中的图片 相对于设置大小的倍数 如设置为100*160，该值为2.0时，则保存图片为100*2.0 *160*2.0，该值越大，则生成PDF中的签名越清晰，并且所占空间越大
    this.signImgRatio = 2.0;
}

/**
 * 单位签章对象
 * @param signRule 签名规则，参考SignRule_KeyWord、SignRule_RuleId，SignRule_XYZ
 * @constructor
 */
function UnitSignConfig(signRule)
{

    if(!(signRule instanceof SignRule_KeyWord) && !(signRule instanceof SignRule_ServerConfig) && !(signRule instanceof SignRule_XYZ))
    {
        throw  "UnitSignConfig constructor parameter signRule invalid";
    }
    this.signRule = signRule;

    this.AppName = "";//AppName 移动端暂时没用
    this.openTSS = true;//是否加盖时间戳，true,请不要更改此项设置
}


/**
 *根据关键字定位签名位置
 * @param keyWord 关键字字面值
 * @param xOffset X轴偏移量，单位pt
 * @param yOffset Y轴偏移量，单位pt
 * @param KWIndex 第几个关键字,0标识所有关键字旁边签名
 * @constructor
 */
function SignRule_KeyWord(keyword, xOffset, yOffset, KWIndex){

    if(!keyword)
    {
        throw "SignRule_KeyWord constructor parameter invalid";
    }
    this.KW = keyword;
    this.XOffset = xOffset;
    this.YOffset = yOffset;
    this.KWIndex = KWIndex;
    this.SigWidth = 100.0;
    this.SigHeight = 80.0;
}

/**
 * 使用服务器规则配置签名
 * @param configId 服务器端生成的配置规则
 * @constructor
 */
var SignRule_ServerConfig = function(configId)
{
    if(!configId)
    {
        throw "SignRule_RuleId constructor parameter invalid";
    }
    this.ruleId = configId;
}

/**
 * 根据坐标定位签名方式（竖版的PDF:top,bottom必须在[0,842]之间，left,right[0,595]之间，right-left和top-bottom必须在[25,350]之间；横板的PDF:top,bottom必须在[0,595]之间，left,right[0,842]之间，right-left和top-bottom必须在[25,350]之间）
 * @param left 签名图片最左边坐标值，相对于PDF当页最左下角(0,0)点，向上和向右分别为X轴、Y轴正方向,单位pt
 * @param top 签名图片顶边坐标值，相对于PDF当页最左下角(0,0)点，向上和向右分别为X轴、Y轴正方向,单位pt
 * @param right 签名图片最右边坐标值，相对于PDF当页最左下角(0,0)点，向上和向右分别为X轴、Y轴正方向,单位pt
 * @param bottom 签名图片底边坐标值，相对于PDF当页最左下角(0,0)点，向上和向右分别为X轴、Y轴正方向,单位pt
 * @param pageNo 签名在PDF中的页码，从1开始
 * @constructor
 */
var SignRule_XYZ = function(left, top, right, bottom, pageNo)
{
    if(isNaN(left) || isNaN(top) || isNaN(right) || isNaN(bottom) || isNaN(pageNo))
    {
        throw "SignRule_XYZ constructor parameter invalid";
    }
    if(left<0 || right <0 || left > 842 || right> 842 || right-left<25 || right-left>350)
    {
        throw "SignRule_XYZ constructor parameter invalid";
    }
    if(top<0 || bottom <0 || top > 842 || bottom> 842 || top-bottom<25 || top-bottom>350)
    {
        throw "SignRule_XYZ constructor parameter invalid";
    }

    this.Left = left;
    this.Top = top;
    this.Right = right;
    this.Bottom = bottom;
    this.Pageno = pageNo;
}

/**
 * 签名人信息
 * @param name 签名人姓名
 * @param number 签名人证件号码
 * @param type 签名人证件类型
 * @constructor
 */
var Signer = function(name, number,type)
{
    if(!name || !number || !type || name.length > 256)
    {
        throw "Signer constructor parameter invalid";
    }

    this.UName = name;
    this.CredNumber = number;
    this.CredType = type;

}



/**
 * 原文类型
 * @param HTML HTML格式
 * @param XML XML格式
 * @param PDF PDF格式
 */
var OriginalType =
{
    HTML : 1,
    XML : 2,
    PDF : 3
};

/**
 * 证件类型
 * @param ID_CARD 身份证
 * @param OFFICE_CARD 军官证
 * @param PASSPORT_CARD 护照
 * @param RESIDENT_CARD 户口本
 */
var SignCardType =
{
    ID_CARD : 1,
    OFFICE_CARD : 2,
    PASSPORT_CARD : 3,
    RESIDENT_CARD : 4
};


/**
 * 证据类型
 * @param TYPE_PHOTO 拍照
 * @param TYPE_AUDIO录音
 * @param TYPE_VIDEO 录像
 * @param TYPE_HANDWRITE 手写签名
 * @param TYPE_MESSAGE 短信挑战吗
 * @param TYPE_OTHER 其他类型
 */
var EvidenceType =
{
    TYPE_PHOTO : 1,
    TYPE_AUDIO : 2,
    TYPE_VIDEO : 3,
    TYPE_HANDWRITE : 4,
    TYPE_MESSAGE : 5,
    TYPE_OTHER : 100
};
