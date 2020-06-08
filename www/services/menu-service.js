angular.module('menuService', ['ngResource']).factory('$menuService', ['$gmRestful', function ($gmRestful) {

	var result = {
		//三级流程详细信息
		ywdata: {},
		//三级流程id
		id: '',
		//所选区域code
		code: '',
		//办事大厅相关数据
		bsdt: {},
		//上门预约事项
		yysx: '',

		//房产买卖数据
		fcmm: [],
		//根据区域获取的菜单树数据
		level1MenuArray: [],
		//菜单树1级菜单数据
		level1Menu: {},
		//菜单树二级菜单数据
		level2Menu: {},
		//三级流程集合
		level3FlowArray: [],

		//0表示办事指南，1表示申请材料
		flag: -1,
		//上门预约电话
		applicantPhone: null,
		//0表示新增，1表示修改
		tag: 0,
		//要修改的登陆信息
		item: null,

		flowCode: "",

		jsonobj: {
			bdcxx: [{
				"bdcqzh": "111111",
				"bdcdyh": "2222222222",
				"zl": "汉阳区",
				"bdcmj": "30",
				"fwjyjg": "100万",
				"xmmc": "项目名称",
				"zh": "17幢",
				"shbw": "厨房",
				"jzmj": "100",
				"tnjzmj": "80",
				"ftjzmj": "20",
				"fwyt": "家用"
			}],
			participants: [{
				"catetory": "0",
				"dyqrmc": "杨文华",
				"dyqrdh": "12345678901",
				"dyqrzjlx": "身份证",
				"dyqrzjh": "12345678901",
				"sqrlx": "个人",
				"zwrmc": "褚万江",//法人名称
				"zwrdh": "12345678910",//法人电话
				"zwrzjh": "10010",
				"gyfs": "个人共有",
				"qlbl": "80",
				"dyrmc": "yin",
				"dyrdh": "13133445566",
				"dyrzjh": "10086",
				"dyjg": "???",
				"tzrdh":"15871003132",
				"tzrmc":"何文"
			}],
		},
		level3FlowCode: '',
		//根据区域获取菜单树
		getmenu: function (params) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.get(RESTURL.me.menu, params);
			return pPromise;
		},
		//根据最后一级菜单id和区域code查询对应的流程信息id
		matchSubflow: function (params) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.get(RESTURL.me.matchSubflow, params);
			return pPromise;
		},
		//根据流程信息id查询三级流程详细信息
		getSubFlowConfigInfo: function (params) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.get(RESTURL.me.getSubFlowConfigInfo, params);
			return pPromise;
		},
		getChildMenu: function () {
			var menu =
				[{
					name: '网上申请',
					enable: true,
					src: require('../theme/img_menu/menu-wssq.png')
				},
				/* {
					name: '网上预约',
					enable: true,
					src: require('../theme/img_menu/menu-wsyy.png')
				}, */
				{
					name: '办事指南',
					enable: true,
					src: require('../theme/img_menu/menu-bszn.png')
				},
				{
					name: '申请材料',
					enable: true,
					src: require('../theme/img_menu/menu-sqcl.png')
				}];
			return menu;
		},
		//发起上门服务申请
		initiate: function (payload) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.post(RESTURL.me.initiate, null, payload, false, {
				contentType: 'json'
			});
			return pPromise;
		},
		//修改办事大厅
		changeBsdt: function (payload) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.post(RESTURL.me.changeBsdt, null, payload, false);
			return pPromise;
		},
		//查询上门服务申请列表
		getsmyylist: function (params) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.get(RESTURL.me.getsmyylist, params);
			return pPromise;
		},
		//根据id查看上门服务详情
		getdetailsById: function (params) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.get(RESTURL.me.getdetailsById, params);
			return pPromise;
		},
		//取消上门服务申请
		cancel: function (payload) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.post(RESTURL.me.cancel, null, payload);
			return pPromise;
		},
		//更新上门服务申请
		update: function (payload) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.post(RESTURL.me.update, null, payload, false, {
				contentType: 'json'
			});
			return pPromise;
		},
		//提交建议
		suggest: function (payload) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.post(RESTURL.me.suggest, null, payload);
			return pPromise;
		},
		//查询投诉建议列表
		getGuestNoteList: function (params) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.get(RESTURL.me.getGuestNoteList, params);
			return pPromise;
		},
		//邮寄地址
		//保存修改地址信息
		saveOrUpdateAddress:function(payload){
			var pRestful = new $gmRestful();
			var pPromise = pRestful.post(RESTURL.yj.saveOrUpdateAddress, null, payload);
			return pPromise;
		},
		//删除地址信息
		deleteAddress:function(payload){
			var pRestful = new $gmRestful();
			var pPromise = pRestful.post(RESTURL.yj.deleteAddress, null, payload);
			return pPromise;
		},
		//根据用户id获取收获地址列表
		getAddressByUserId: function (params) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.get(RESTURL.yj.getAddressByUserId, params);
			return pPromise;
		},
    //根据外网业务号和邮寄类型获取邮寄信息详情
		findByYwhAndPostType: function (params) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.get(RESTURL.yj.findByYwhAndPostType, params);
			return pPromise;
		},
    //保存快递信息
    saveExpressInfo: function (payload) {
    	var pRestful = new $gmRestful();
    	var pPromise = pRestful.post(RESTURL.yj.saveExpressInfo, null,payload);
    	return pPromise;
    },
		getInquiryRecordByYwh:function (params) {
			var pRestful = new $gmRestful();
			var pPromise = pRestful.get(RESTURL.xwbl.getInquiryRecordByYwh, params);
			return pPromise;
		},
		saveInquiryRecord:function(payload){
			var pRestful = new $gmRestful();
			var pPromise = pRestful.post(RESTURL.xwbl.saveInquiryRecord, null, payload, false, {
				contentType: 'json'
			});
			return pPromise;
		},
	};
	return result;
}]);
