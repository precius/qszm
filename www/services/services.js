angular.module('starter.services', ['menuService', 'wdbdcService', 'ngResource', 'zcfgService', 'loginService', 'registerService', 'wyyyService', 'wysqService', 'bsznService', 'meService', 'addressService', 'dictUtilsService', 'fjxzUtilsService', 'qszmService', 'qyglService', 'ocrService', 'zfyService', 'searchService', 'fmsService', 'evaluationService', 'djsqService', 'faceVerificationService'])

	.factory('djsq', function() {
		// Might use a resource here that returns a JSON array
		// Some fake testing data
		var djsq = [{
			number: 'A110100020010170331143322',
			address: '蒙房权证新城区字第***号',
			area: '123㎡',
			time: '2018-04-02 14:57:07',
			remark: '新房登记',
			status: true,
			value: 0
		}, {
			number: 'A110100020010170331143322',
			address: '蒙房权证新城区字第***号',
			area: '123㎡',
			time: '2018-04-02 14:57:07',
			remark: '房产已经提交',
			status: false,
			value: 1
		}, {
			number: 'A110100020010170331143322',
			address: '蒙房权证新城区字第***号',
			area: '123㎡',
			time: '2018-04-02 14:57:07',
			remark: '房产已经提交',
			status: false,
			value: 2
		}]

		return {
			all: function() {
				return djsq;
			},
			remove: function(chat) {
				chats.splice(chats.indexOf(chat), 1);
			},
			get: function(chatId) {
				for(var i = 0; i < djsq.length; i++) {
					if(djsq[i].value === parseInt(chatId)) {
						return djsq[i];
					}
				}
				return null;
			}
		};
	});