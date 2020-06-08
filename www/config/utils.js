angular.module('starter.utils', ['ngResource']).provider('$gmRestful',
	/**
	 * Rest请求服务
	 * @class NgModule.utils.$gmRestful
	 * @alias $gmRestful
	 */
	function() {
		//rest服务api
		this.$get = ['$resource', '$q', '$location', '$http', function($resource, $q, $location, $http) {
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

			function HttpFactory() {
				var $gmRestful = {};
				/**
				 * @member NgModule.utils.$gmRestful
				 * @method get get请求
				 * @param {String} url 请求地址
				 * @param {Object} [params] 请求参数
				 * @param {Boolean} [bValidateToken=false] 是否对请求进行令牌验证
				 * @param {Boolean} [bAddToken=true] 是否在请求头中添加令牌值
				 * @return {Object} 返回请求的promise对象
				 */
				$gmRestful.get = function(url, params, bValidateToken, bAddToken) {
					var actions = null;
					if(bAddToken !== false) {
						actions = {
							get: {
								headers: {
									'token': GM.token
								},
								hasBody: false,
								method: 'GET',
								params: params
							}
						};
					}

					//如果是get请求，则加上时间戳，避免缓存
					var strTime = (new Date()).getTime();
					url = GM.LayoutOper.addURLParam(url, 'timestamplp', strTime);
					var request = $resource(url, null, actions);
					var pDefer = $q.defer();
					request.get(params, function(response, headersGetter) {
						var strToken = headersGetter('token');
						if(strToken != null) {
							response.token = strToken;
						}
						if(bValidateToken !== false) {
							$gmRestful.validateToken(response);
						}
						$gmRestful._dealResponse(response, pDefer);
					}, function(error) {
						pDefer.reject(error);
					});
					return pDefer.promise;
				};

				/**
				 * @member NgModule.utils.$gmRestful
				 * @method post post请求
				 * @param {String} url 请求地址
				 * @param {Object} [params] 请求参数
				 * @param {Object} payload 请求体
				 * @param {Boolean} [bAddToken=true] 是否在请求头中添加令牌值
				 * @return {Object} 返回请求的promise对象
				 */
				$gmRestful.post = function(url, params, payload, bAddToken, options) {
					var actions = null;
					options = options || {};
					var contentType = options.contentType === 'json' ? 'application/json;charset=UTF-8' :
						'application/x-www-form-urlencoded';
					actions = {
						save: {
							headers: {
								'Content-Type': contentType
							},
							hasBody: true,
							method: 'POST',
							params: params
						}
					};
					if(bAddToken !== false) {
						actions.save.headers.token = GM.token;
					}
					var request = $resource(url, null, actions);
					var pDefer = $q.defer();
					var strPayload;
					if(options.contentType === 'json') {
						strPayload = JSON.stringify(payload);
					} else {
						strPayload = GM.CommonOper.paramObject(payload);
					}
					GM.CommonOper.paramObject(payload);
					request.save(params, strPayload, function(response, headersGetter) {
						var strToken = headersGetter('token');
						if(strToken != null) {
							response.token = strToken;
						}
						$gmRestful.validateToken(response);
						$gmRestful._dealResponse(response, pDefer);
					}, function(error) {
						pDefer.reject(error);
					});
					return pDefer.promise;
				};

				/**
				 * @member NgModule.utils.$gmRestful
				 * @method ajax ajax请求
				 * @param {String} url 请求地址
				 * @param {Object} payload 请求体
				 * @param {Object} settings ajax请求参数，参考JQuery
				 * @param {Boolean} [bAddToken=true] 是否在请求头中添加令牌值
				 * @return {Object} 返回请求结果
				 */
				$gmRestful.ajax = function(url, payload, settings, bAddToken) {
					var result = GM.CommonOper.ajaxRequest(url, payload, settings, bAddToken);
					return result;
				};

				/**
				 * @member NgModule.utils.$gmRestful
				 * @method multiRequest 分流请求
				 * @param {Function} requestFun 请求函数,函数返回值必须是promise对象
				 * @param {Object} requestData 请求数据
				 * @param {String} multiAttName 分批请求属性名（requestData参数中的一个数组属性）
				 * @param {Number} requestTimes 请求批数
				 * @return {Object} 返回请求promise对象
				 */
				$gmRestful.multiRequest = function(requestFun, requestData, multiAttName, requestTimes) {
					if(!GM.CommonOper.isFunction(requestFun) || requestData == null || !GM.CommonOper.isArray(requestData[multiAttName])) {
						return null;
					}
					if(!GM.CommonOper.isDigital(requestTimes)) {
						requestTimes = 2;
					}

					//拆分数据
					var arrayItems = GM.CommonOper.getMeanArrays(requestData[multiAttName], requestTimes);
					var arrayPromise = [];
					for(var ii = 0; ii < arrayItems.length; ii++) {
						var pItemData = angular.copy(requestData);
						pItemData[multiAttName] = arrayItems[ii];
						var pPromise = requestFun(pItemData);
						arrayPromise.push(pPromise);
					}

					//组织promise数据
					var pDefer = $q.defer();
					var allPromise = $q.all(arrayPromise);
					allPromise.then(function(response) {
						var result = {
							response: response,
							data: []
						};
						if(GM.CommonOper.isArray(response)) {
							var bSuccess = true;
							for(var ii = 0; ii < response.length; ii++) {
								if(response[ii].success === false) {
									bSuccess = false;
								} else {
									if(GM.CommonOper.isArray(response[ii].data)) {
										result.data = result.data.concat(response[ii].data);
									} else {
										result.data.push(response[ii].data);
									}
								}
							}
							result.success = bSuccess;
						} else {
							result.success = false;
						}
						pDefer.resolve(result);
					});
					return pDefer.promise;
				};

				/**
				 * @ignore
				 * @member NgModule.utils.$gmRestful
				 * @method isTokenValid 令牌是否有效
				 * @param {String} url 令牌验证请求地址
				 * @return {Boolean} 是否有效
				 */
				$gmRestful.isTokenValid = function(url) {
					var strToken = GM.CommonOper.getParamFromUrlOrCookie('GMSSO_CLIENT_EC', APP_KEY);
					var bValid = true;

					//先记录地址上的server token
					var strServerToken = GM.CommonOper.getParamFromUrlOrCookie('GMLOGIN_SERVER_EC', 'clientServerToken');

					if(!GM.CommonOper.isStrNullOrEmpty(strServerToken)) {
						GM.CommonOper.addCookie('clientServerToken', strServerToken);
					}

					//验证token
					if(!GM.CommonOper.isStrNullOrEmpty(strToken)) {
						//地址上自带token，先验证该token
						//将可能自动加斜杠的情况排除
						if(/\/$/g.test(strToken)) {
							strToken = strToken.substr(0, strToken.length - 1);
						}
						var response = this.ajax(url, {
							token: strToken,
							appKey: APP_KEY
						}, {
							type: 'get'
						});
						if(response != null && response.tokenInvalid === false) {
							//token可用
							GM.token = strToken;
							bValid = true;
						} else {
							//token不可用,尝试获取新token
							bValid = this._tryGetNewToken();
						}
					} else {
						//地址上不带token
						bValid = this._tryGetNewToken();
					}
					return bValid;
				};

				/**
				 * @ignore
				 * @member NgModule.utils.$gmRestful
				 * @method _tryGetNewToken 尝试获取新的令牌
				 * @return {Boolean} 是否获取成功
				 */
				$gmRestful._tryGetNewToken = function() {
					var bValid = false;
					var strServerToken = GM.CommonOper.getParamFromUrlOrCookie('GMLOGIN_SERVER_EC', 'clientServerToken');
					var strAbsUrl = $location.absUrl();
					bValid = this._getToken(strServerToken, strAbsUrl);
					return bValid;
				};

				/**
				 * @ignore
				 * @member NgModule.utils.$gmRestful
				 * @method _getToken 根据服务令牌获取子系统令牌值
				 * @param {String} serverToken 服务令牌
				 * @param {String} strClientUrl 子系统地址
				 * @return {Boolean} 是否获取成功
				 */
				$gmRestful._getToken = function(serverToken, strClientUrl) {
					var requestData = {
						GMSSO_SERVER_EC: serverToken,
						service: strClientUrl,
						appKey: APP_KEY
					};
					var strUrl = LOGIN_SERVER + 'login';
					var response = this.ajax(strUrl, requestData, 'get');
					if(response && response.success === true && response.data != null) {
						GM.token = response.data.gmsso_cli_ec_key;
						if(GM.CommonOper.isStrNullOrEmpty(GM.token)) {
							return false;
						} else {
							GM.CommonOper.addCookie('clientServerToken', serverToken);
							return true;
						}
					} else {
						return false;
					}
				};

				/**
				 * @ignore
				 * @member NgModule.utils.$gmRestful
				 * @method validateToken 请求返回数据的令牌是否有效
				 * @param {Object} response 请求返回数据
				 */
				$gmRestful.validateToken = function(response) {
					if(response.tokenInvalid === true) {
						//如果不可用则跳转到登录页面
						GM.FrameManager.logout();
					} else {
						//如果可用，记录token
						if(response.token != null) {
							GM.token = response.token;
						}
					}
				};

				/**
				 * @ignore
				 * @member NgModule.utils.$gmRestful
				 * @method analysisToken 解析令牌数据
				 * @return {Object} 用户对象
				 */
				$gmRestful.analysisToken = function() {
					if(RESTURL.token != null || (GM.token != null && GM.token !== 'admin')) {
						var strToken = GM.token;
						if(strToken != null) {
							var strUrl = LOGIN_SERVER + '/decrypt.do';
							var result = GM.UserOper.getUserFromToken(strUrl, strToken);
							return result;
						} else {
							return null;
						}
					}
					return null;
				};

				/**
				 * @ignore
				 * @member NgModule.utils.$gmRestful
				 * @method _dealResponse 根据请求返回值进行拒绝或继续操作
				 * @param {Object} response 请求返回数据
				 * @param {defer} defer对象
				 */
				$gmRestful._dealResponse = function(response, defer) {
					if(response == null) {
						defer.reject(response);
					} else if(response.success === false) {
						defer.reject(response);
					} else {
						defer.resolve(response);
					}
				};
				return $gmRestful;
			}
			return HttpFactory;
		}];
	});