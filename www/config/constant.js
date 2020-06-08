//项目差分
window.projectName = 'hebei'; //河北
//window.projectName = 'lingbao';//灵宝

//UUMS用户登录信息
window.userData = {};
//MongoDb用户信息信息父级别，用来判断是否进行了实名认证
window.mongoDbUserInfoFather = {};
//用来判断是否进行了人脸识别
window.faceVerify = "";
//MongoDb用户信息
window.mongoDbUserInfo = {};
//用户或者区域权限
window.permissionInfoServers = [];
//我要预约，我要预约-实名认证，我要预约-免登录，我要申请，证书证明核实，进度查询，权属证明,权属证明真伪核实,土地类-个人,房屋类,林木类-个人
window.permissionInfoApps = [{
		vpermValue: "IEBDC:WYYY",
		isShow: true
	}, {
		vpermValue: "IEBDC:WYYY:SMRZ",
		isShow: true
	},
	{
		vpermValue: "IEBDC:WYYY:MDL",
		isShow: true
	}, {
		vpermValue: "IEBDC:WYSQ",
		isShow: true
	},
	{
		vpermValue: "IEBDC:ZSHS:ZSZMHS",
		isShow: true
	}, {
		vpermValue: "IEBDC:JDCX",
		isShow: true
	},
	{
		vpermValue: "IEBDC:QSZM",
		isShow: true
	}, {
		vpermValue: "IEBDC:ZSHS:QSZMZWHS:GR",
		isShow: true
	}
];

//首页显示定位
window.province = {
	title: '湖北省',
	code: '420000',
	areaType: '2'
};
window.city = {
	title: '孝感市',
	code: '420900',
	areaType: '3'
};
window.county = {
	title: '孝南区',
	code: '420902',
	areaType: '4'
};

if(projectName == 'lingbao') {
	window.province = {
		title: '河南省',
		code: '410000',
		areaType: '2'
	};
	window.city = {
		title: '三门峡市',
		code: '411200',
		areaType: '3'
	};
	window.county = {
		title: '灵宝市',
		code: '411282',
		areaType: '4'
	};
}
//所有区域数据
window.areaData = {};
window.qlrlist = [];
window.ywrlist = [];
//获取字典参数
window.dictParam = {
	currentId: 'null'
};
//保存字典数据
window.dictInfos = [];
//保存全国区域树
window.areaTree = [];

//土地_国有建设用地使用权_首次登记
window.gyjsydsyq_scdj_flowCode = 'F100101';
//土地_国有建设用地使用权_转移登记
window.gyjsydsyq_zydj_flowCode = 'N200103';
//土地_国有建设用地使用权_变更登记
window.gyjsydsyq_bgdj_flowCode = 'N300103';
//土地_国有建设用地使用权_注销登记
window.gyjsydsyq_zxdj_flowCode = 'N400103';

//房屋_国有建设用地使用权及房屋所有权_变更登记
window.gyjsydsyqjfwsyq_bgdj_flowCode = 'N300104';
//房屋_国有建设用地使用权及房屋所有权_转移登记
window.gyjsydsyqjfwsyq_zydj_flowCode = 'N200104';
//房屋_国有建设用地使用权及房屋所有权_注销登记
window.gyjsydsyqjfwsyq_zxdj_flowCode = 'N400104';
//房屋_国有建设用地使用权及房屋所有权_更正登记
window.gyjsydsyqjfwsyq_gzdj_flowCode = 'N500104';
//房屋_国有建设用地使用权及房屋所有权_证书补证登记
window.gyjsydsyqjfwsyq_bzdj_flowCode = 'N900101';
//房屋_国有建设用地使用权及房屋所有权_证书换证登记
window.gyjsydsyqjfwsyq_hzdj_flowCode = 'N900102';
//房屋_国有建设用地使用权及房屋所有权_异议设立登记
window.gyjsydsyqjfwsyq_yysldj_flowCode = 'N100501';
//房屋_国有建设用地使用权及房屋所有权_异议注销登记
window.gyjsydsyqjfwsyq_yyzxdj_flowCode = 'N400502';
//房屋_抵押权登记_首次登记
window.dyqdj_scdj_flowCode = 'N100301';
//抵押权变更登记
window.dyqdj_bgdj_flowCode = 'N300301';
//抵押权登记_注销登记
window.dyqdj_zxdj_flowCode = 'N400301';


//房屋_预告登记_预售商品房买卖预告登记
window.ygdj_ysspfmmygdj_flowCode = 'N100201';
//房屋_预告登记_预售商品房抵押权预告登记
window.ygdj_ysspfdyqygdj_flowCode = 'N100203';

//林地_林权_林权首次登记
window.lq_lqscdj_flowCode = 'N100111';
window.formJson =[/* {
    "name": "土地_国有建设用地使用权_首次登记",
    "code": "F100101",
    "applyReason":"土地使用权首次登记"
},
{
    "name": "土地_国有建设用地使用权_转移登记",
    "code": "N200103",
    "applyReason":"土地使用权转移"
},
{
    "name": "土地_国有建设用地使用权_变更登记",
    "code": "N300103",
    "applyReason":"土地使用权变更"
},
{
    "name": "土地_国有建设用地使用权_注销登记",
    "code": "N400103",
    "applyReason":"土地使用权注销"
}, */
{
    "name": "土地_国有建设用地使用权及房屋所有权_变更登记",
    "code": "N300104",
    "applyReason":"土地及房屋所有权登记"
},
{
    "name": "土地_国有建设用地使用权及房屋所有权_转移登记",
    "code": "N200104",
    "applyReason":"土地及房屋所有权转移"
},
{
    "name": "土地_国有建设用地使用权及房屋所有权_注销登记",
    "code": "N400104",
    "applyReason":"土地及房屋所有权注销"
},
{
    "name": "土地_国有建设用地使用权及房屋所有权_更正登记",
    "code": "N500104",
    "applyReason":"土地及房屋所有权更正"
},
{
    "name": "土地_国有建设用地使用权及房屋所有权_证书补证登记",
    "code": "N900101",
    "applyReason":"补证"
},
{
    "name": "土地_国有建设用地使用权及房屋所有权_证书换证登记",
    "code": "N900102",
    "applyReason":"换证"
},
{
    "name": "土地_国有建设用地使用权及房屋所有权_异议设立登记",
    "code": "N100501",
    "applyReason":"异议设立"
},
{
    "name": "土地_国有建设用地使用权及房屋所有权_异议注销登记",
    "code": "N400502",
    "applyReason":"异议注销"
},
{
    "name": "房屋_抵押权登记_首次登记",
    "code": "N100301",
    "applyReason":"抵押"
},
{
    "name": "抵押权变更登记",
    "code": "N300301",
    "applyReason":"抵押变更"
},
{
    "name": "抵押权登记_注销登记",
    "code": "N400301",
    "applyReason":"抵押注销"
},
{
    "name": "房屋_预告登记_预售商品房买卖预告登记",
    "code": "N100201",
    "applyReason":"预售商品房买卖预告"
},
{
    "name": "房屋_预告登记_预售商品房抵押权预告登记",
    "code": "N100203",
    "applyReason":"预售商品房抵押预告"
}/* ,
{
    "name": "林地_林权_林权首次登记",
    "code": "N100111",
    "applyReason":"林权首次登记"
} */];
//平台
window.platform = "weixin";
// window.platform = "mobile";
window.isFirstLocation = true;

//控制微信公众号网上预约的变量
window.wxyy = true;

//控制是否需要进行微信人脸识别
window.needWxFaceVerify = false;
//控制是否需要进行公安部身份验证
window.needPoliceVerify = false;
//控制是否支持苹果用户
window.supportAppleUser = true;
//控制是否需要邮寄服务功能
window.supportZsyj = false;
//控制【申请须知】和【预约须知】文字阅读的倒计时
window.timeCount = 10;
//如果是从宁夏政务注册的账号需要修改密码再登录
window.passwordOld = ['af1p9iwsasdffa','aq1234'];
