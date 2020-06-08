/**
 * @description 基础操作API
 * @class GM.CommonOper
 * @author LP
 * @static
 */
GM.CommonOper = {
	/**
	 * @description 扩展对象
	 * @static
	 * @method extend
	 * @param {Object} dest 任意对象
	 * @return {Object} 扩展后的对象
	 */
	extend: function(dest) { // (Object[, Object, ...]) ->
		var sources = Array.prototype.slice.call(arguments, 1);
		var i;
		var j;
		var len;
		var src;

		for(j = 0, len = sources.length; j < len; j++) {
			src = sources[j] || {};
			for(i in src) {
				if(src.hasOwnProperty(i)) {
					dest[i] = src[i];
				}
			}
		}
		return dest;
	},
	/**
	 * des加密
	 * @param  {String} strMessage 待加密字符串
	 * @param  {String} key        加密Key
	 * @return {String}            加密后结果
	 */
	encryptByDES: function(strMessage, key) {
		key = key || '\u0067\u0072\u0065\u0061\u0074\u006d\u0061\u0070';
		var keyHex = CryptoJS.enc.Utf8.parse(key);
		var encrypted = CryptoJS.DES.encrypt(strMessage, keyHex, {
			mode: CryptoJS.mode.ECB,
			padding: CryptoJS.pad.Pkcs7
		});
		return encrypted.toString();
	},
	/**
	 * des解密 
	 * @param  {String} strMessage 待解密字符串
	 * @param  {String} key        解密Key
	 * @return {String}            解密后结果
	 */
	decryptByDES: function(strMessage, key) {
		key = key || '\u0067\u0072\u0065\u0061\u0074\u006d\u0061\u0070';
		var keyHex = CryptoJS.enc.Utf8.parse(key);
		var decrypted = CryptoJS.DES.decrypt({
			ciphertext: CryptoJS.enc.Base64.parse(strMessage)
		}, keyHex, {
			mode: CryptoJS.mode.ECB,
			padding: CryptoJS.pad.Pkcs7
		});
		return decrypted.toString(CryptoJS.enc.Utf8);
	},

	/**
	 * @description 删除数组中的指定元素
	 * @method removeItemFromArray
	 * @static
	 * @param {Array} pArray 数组啊
	 * @param {Object} pItem 需要删除元素
	 * @param {String} attName 属性名称
	 * @return {boolean} 失败返回false，成功返回true
	 */
	removeItemFromArray: function(pArray, pItem, attName) {
		if(pArray == null) {
			return false;
		}
		for(var ii = 0; ii < pArray.length; ii++) {
			var pArrayItem = pArray[ii];
			if(!this.isStrNullOrEmpty(attName)) {
				if(pItem[attName] === pArrayItem[attName]) {
					pArray.splice(ii, 1);
					return true;
				}
			} else {
				if(pItem === pArrayItem) {
					pArray.splice(ii, 1);
					return true;
				}
			}
		}

		return false;
	},
	/**
	 * @description 去除数组中为null元素
	 * @method removeNullItemFromArray
	 * @static
	 * @param {Array} pArray 要处理的数组
	 */
	removeNullItemFromArray: function(pArray) {
		if(pArray == null) {
			return;
		}
		while(this.isArrayContainsEle(pArray, null)) {
			this.removeItemFromArray(pArray, null);
		}
	},
	/**
	 * @description 判断数组中是否包含该元素
	 * @method isArrayContainsEle
	 * @param {Array} pArray 数组
	 * @param {Object} pEle 数组元素
	 * @return {boolean} 是否包含
	 */
	isArrayContainsEle: function(pArray, pEle) {
		if(pArray == null) {
			return false;
		}
		for(var ii = 0; ii < pArray.length; ii++) {
			if(pEle === pArray[ii]) {
				return true;
			}
		}
		return false;
	},
	/**
	 * @description 根据字段名称和值获取数组元素
	 * @method getArrayEleByAtt
	 * @param {Array} pArray 数组
	 * @param {String} attName 元素名称
	 * @param {Object} value 数值
	 * @return {Object} 节点对象
	 */
	getArrayEleByAtt: function(pArray, attName, value) {
		if(pArray == null || this.isStrNullOrEmpty(attName)) {
			return null;
		}
		for(var ii = 0; ii < pArray.length; ii++) {
			if(pArray[ii][attName] === value) {
				return pArray[ii];
			}
		}
		return null;
	},
	/**
	 * @description 获取数组元素索引
	 * @method getArrayEleIndex
	 * @param {Array} pArray 数组
	 * @param {object} pEle 数组元素
	 * @returns {number} 数组元素的索引
	 */
	getArrayEleIndex: function(pArray, pEle) {
		if(pArray == null || pEle == null) {
			return -1;
		}
		for(var ii = 0; ii < pArray.length; ii++) {
			if(pArray[ii] === pEle) {
				return ii;
			}
		}
		return -1;
	},
	/**
	 * @description 判断一个集合是否包含另一个集合
	 * @method isArrayContainsArray
	 * @param {Array} arrayBig 包含数组
	 * @param {Array} arraySmall 被包含数组
	 * @return {Boolean} 是否包含
	 */
	isArrayContainsArray: function(arrayBig, arraySmall) {
		if(arrayBig == null || arraySmall == null) {
			return false;
		}
		for(var ii = 0; ii < arraySmall.length; ii++) {
			var bContains = GM.CommonOper.isArrayContainsEle(arrayBig,
				arraySmall[ii]);
			if(bContains === false) {
				return false;
			}
		}
		return true;
	},
	/**
	 * @description 向数组中添加一个元素，如果该元素已经存在则不添加
	 * @method addUniqueEle
	 * @param {Array} pArray 数组
	 * @param {Object} pEle 数组元素
	 * @return {Boolean} 是否添加成功
	 */
	addUniqueEle: function(pArray, pEle) {
		if(pArray == null || pEle == null) {
			return false;
		}
		if(!GM.CommonOper.isArrayContainsEle(pArray, pEle)) {
			pArray.push(pEle);
			return true;
		}
		return false;
	},
	/**
	 * @description 去除数组中重复元素
	 * @method getUniqueArray
	 * @param {Array} pArray 数组
	 * @returns {Array} 没有重复元素的数组
	 */
	getUniqueArray: function(pArray) {
		if(pArray == null) {
			return null;
		}
		var result = [];
		for(var ii = 0; ii < pArray.length; ii++) {
			var pItem = pArray[ii];
			if(!this.isArrayContainsEle(result, pItem)) {
				result.push(pItem);
			}
		}
		return result;
	},
	/**
	 * @description 将数组均分为多个数组
	 * @method getMeanArrays
	 * @param {Array} pArray 数据
	 * @param {Number} numMean 均分个数
	 * @return {Array} 均分后数组结果
	 */
	getMeanArrays: function(pArray, numMean) {
		if(!this.isArray(pArray) || numMean == null || Number.isNaN(numMean)) {
			return null;
		}
		var result = [];
		if(pArray.length <= numMean) {
			for(var ii = 0; ii < pArray.length; ii++) {
				result.push([pArray[ii]]);
			}
		} else {
			var nBase = Math.floor(pArray.length / numMean);
			var nRemainder = pArray.length % numMean; //余数
			var nArrayIndex = 0;
			for(var jj = 0; jj < numMean; jj++) {
				var itemArrayLength = nBase;
				var itemArray = [];
				if(result.length + 1 <= nRemainder) {
					itemArrayLength += 1;
				}
				for(var kk = 0; kk < itemArrayLength; kk++) {
					itemArray.push(pArray[nArrayIndex]);
					nArrayIndex++;
				}
				result.push(itemArray);
			}
		}
		return result;
	},
	/**
	 * @description 将一个数字四舍五入
	 * @method roundDigiter
	 * @param {Number} fDigiter 目标数字
	 * @param {Number} nNumber 小树位数
	 * @return {Number}
	 */
	roundDigiter: function(fDigiter, nNumber) {
		if(fDigiter == null || Number.isNaN(fDigiter) || nNumber == null) {
			return null;
		}
		var nTempNumber;
		if(this.isDigital(nNumber)) {
			nTempNumber = Number(nNumber);
			var digit = Math.round(fDigiter * Math.pow(10, nTempNumber)) / Math.pow(10, nTempNumber);
			return digit;
		} else {
			return 0;
		}
	},
	/**
	 * @description 获取小数位数固定的数值字符串
	 * @method formatDigiter
	 * @param {Number} fDigiter 目标数字
	 * @param {Number} nNumber 小树位数
	 * @return {String}
	 */
	formatDigiter: function(fDigiter, nNumber) {
		if(fDigiter == null || nNumber == null) {
			return null;
		}
		var nTempNumber = this.roundDigiter(fDigiter, nNumber);
		//固定小数位数
		var strNumber = String(nTempNumber);
		if(strNumber.indexOf('.') < 0) {
			var strDecimal = '.';
			for(var ii = 0; ii < nNumber; ii++) {
				strDecimal += '0';
			}
			strNumber += strDecimal;
		} else {
			var nCount = strNumber.length - strNumber.indexOf('.') - 1;
			nCount = nNumber - nCount;
			for(var jj = 0; jj < nCount; jj++) {
				strNumber += '0';
			}
		}
		return strNumber;
	},
	/**
	 * @description 判断字符串是否为空
	 * @method isStringEmpty
	 * @param {String} str 字符串
	 * @return {boolean} 是否为空
	 */
	isStringEmpty: function(str) {
		if(!str) {
			return true;
		}
		var bEmpty = true;
		var strTemp = String(str);
		for(var ii = 0; ii < strTemp.length; ii++) {
			if(strTemp.charAt(ii) !== ' ') {
				bEmpty = false;
				break;
			}
		}
		return bEmpty;
	},
	/**
	 * @description 判断字符串以另一个字符串开头
	 * @method isStartsWith
	 * @param {String} str 字符串
	 * @param {String} start 字符串
	 * @return {boolean} 是否
	 */
	isStartsWith: function(str, start) {
		if(!str || str.length < start.length) {
			return false;
		}
		var strTemp = String(start);
		for(var ii = 0; ii < strTemp.length; ii++) {
			if(strTemp[ii] !== str[ii]) {
				return false;
			}
		}
		return true;
	},
	/**
	 * @description 将字符串数组合并成为一个字符串
	 * @method combineStrings
	 * @param {Array} arryStrings 字符串数组
	 * @return {String} 结果字符串
	 */
	combineStrings: function(arryStrings) {
		if(arryStrings == null) {
			return null;
		}
		var strResult = arryStrings.join('');
		return strResult;
	},
	/**
	 * @description 格式化字符串
	 * @method formatString
	 * @param {String} str 需要格式化的字符串，其中参数为：{0}、{1}...
	 * @param {Array} args 传入的参数
	 * @return {String} 格式化后的字符串
	 */
	formatString: function(str, args) {
		if(str == null || args == null) {
			return null;
		}
		for(var ii = 0; ii < args.length; ii++) {
			var strReg = '{' + ii + '}';
			str = this.replaceAll(str, strReg, args[ii]);
		}
		return str;
	},
	/**
	 * @description 替换字符串中所有的字符串
	 * @method replaceAll
	 * @param {String} str 要替换的总字符串
	 * @param {String} strReplace 要替换的子字符串（str的子字符串）
	 * @param {String} strDes 要替换的目的子字符串
	 * @return {String} str
	 */
	replaceAll: function(str, strReplace, strDes) {
		if(str == null) {
			return null;
		}
		while(str.indexOf(strReplace) >= 0) {
			str = str.replace(strReplace, strDes);
		}
		return str;
	},
	/**
	 * @description 判断参数是否是函数
	 * @method isFunction
	 * @param {Object} pObj 参数
	 * @return {Boolean} 是否是一个函数
	 */
	isFunction: function(pObj) {
		if(!pObj) {
			return false;
		}
		var bMethod = Object.prototype.toString.call(pObj) === '[object Function]';
		return bMethod;
	},
	/**
	 * @description 判断参数是否为数组
	 * @method isArray
	 * @param {Object} obj 参数
	 * @return {Boolean} 是否是一个数组
	 */
	isArray: function(obj) {
		if(!obj) {
			return false;
		}
		var bArray = Object.prototype.toString.call(obj) === '[object Array]';
		return bArray;
	},
	/**
	 * @description 判断参数是否为对象
	 * @method isObject
	 * @param {Object} obj 参数
	 * @return {Boolean} 是否是一个对象
	 */
	isObject: function(obj) {
		if(!obj) {
			return false;
		}
		return Object.prototype.toString.call(obj) === '[object Object]';
	},
	/**
	 * @description 判断参数是否为字符串
	 * @method isString
	 * @param {Object} obj
	 * @return {Boolean} 是否为字符串
	 */
	isString: function(obj) {
		if(obj == null) {
			return false;
		}
		return Object.prototype.toString.call(obj) === '[object String]';
	},
	/**
	 * @description 判断参数是否为数字
	 * @method isDigital
	 * @param {String} str
	 * @return {Boolean} 是否为数字
	 */
	isDigital: function(str) {
		if(Object.prototype.toString.call(str) === '[object Number]') {
			return true;
		}
		if(this.isStrNullOrEmpty(str)) {
			return false;
		}
		if(String(Number(str)) === 'NaN') {
			//非数字
			return false;
		} else {
			//数字
			return true;
		}
	},
	/**
	 * @description 添加一个cookie
	 * @method addCookie
	 * @param {String} name cookie名称
	 * @param {String} value cookie值
	 * @param {Number} expiresDays 多少天后会过期
	 */
	addCookie: function(name, value, expiresDays) {
		var cookieString = name + '=' + escape(value);
		if(expiresDays > 0) {
			var date = new Date();
			date.setTime(date.getTime() + expiresDays * 24 * 3600 * 1000);
			cookieString = cookieString + ';expires=' + date.toGMTString();
		}
		cookieString += ';path=/';
		document.cookie = cookieString;
	},
	/**
	 * @method removeCookie
	 * @param {String} name 要删除的cookie名称
	 */
	removeCookie: function(name) {
		var date = new Date();
		date.setTime(date.getTime() - 1);
		var cookieString = name + '=temp' + ';expires=' + date.toGMTString();
		cookieString += ';path=/';
		document.cookie = cookieString;
	},
	/**
	 * @description 获取指定名称的cookie值
	 * @method getCookie
	 * @param {String} name cookie名称
	 * @return {String} cookie值
	 */
	getCookie: function(name) {
		var strCookie = document.cookie;
		var arrCookie = strCookie.split('; ');
		for(var i = 0; i < arrCookie.length; i++) {
			var arr = arrCookie[i].split('=');
			if(arr[0] === name) {
				return unescape(arr[1]);
			}
		}
		return '';
	},
	/**
	 * @description 从url地址中获取参数，没有则从cookie中获取
	 * @method getParamFromUrlOrCookie
	 * @param {String} strName url参数名称
	 * @param {String} strCookieName cookie参数名称
	 * @return {String} 值
	 */
	getParamFromUrlOrCookie: function(strName, strCookieName) {
		var strValue = null;
		strCookieName = strCookieName == null ? strName : strCookieName;
		//先从url上获取
		var strUrl = window.location.href;
		var pParams = GM.LayoutOper.getURLParams(strUrl);
		if(pParams[strName]) {
			strValue = pParams[strName];
		} else {
			//从cookie中取
			strValue = this.getCookie(strCookieName);
		}
		return strValue;
	},
	/**
	 * @description 在容差范围内判断两个数值是否相等
	 * @method isTwoValueEqual
	 * @param {Number} pValue1 {Int|Long|Float|Double} 值1
	 * @param {Number} pValue2 {Int|Long|Float|Double} 值2
	 * @param {Number} pTolarance {Int|Long|Float|Double} 容差
	 * @return {Boolean} 是否相等
	 */
	isTwoValueEqual: function(pValue1, pValue2, pTolarance) {
		if(pTolarance == null) {
			return(pValue1 === pValue2);
		} else {
			if(Math.abs(pValue1 - pValue2) > pTolarance) {
				return false;
			} else {
				return true;
			}
		}
	},
	/**
	 * @description 获取对象的值的集合
	 * @method getObjectValues
	 * @param {Object} pObj 对象
	 * @return {Array} 值数组
	 */
	getObjectValues: function(pObj) {
		if(!pObj) {
			return null;
		}
		var pValues = [];
		for(var key in pObj) {
			pValues.push(pObj[key]);
		}
		return pValues;
	},
	/**
	 * @description 获取对象的键的集合
	 * @method getObjectKeys
	 * @param {Object} pObj 对象
	 * @return {Array} 键数组
	 */
	getObjectKeys: function(pObj) {
		if(!pObj) {
			return null;
		}
		var pKeys = [];
		for(var key in pObj) {
			pKeys.push(key);
		}
		return pKeys;
	},
	/**
	 * @description 获取对象的元素个数
	 * @method getLengthFromObj
	 * @param {Object} pObject 集合
	 * @return {Number} 长度
	 */
	getLengthFromObj: function(pObject) {
		if(pObject == null) {
			return 0;
		}
		var nLength = 0;
		for(var key in pObject) {
			if(!this.isStrNullOrEmpty(key)) {
				nLength++;
			}
		}
		return nLength;
	},
	/**
	 * @description 复制集合(不能复制自己申明的对象)
	 * @method copyObject
	 * @param {Object} pObject 集合
	 * @return {Object} 复制之后的集合
	 */
	copyObject: function(pObject) {
		var pCopyObject = {};
		var bObject = this.isObject(pObject);
		if(bObject === true) {
			for(var key in pObject) {
				pCopyObject[key] = this.copyObject(pObject[key]);
			}
		} else {
			pCopyObject = pObject;
		}
		return pCopyObject;
	},
	/**
	 * @description 合并集合
	 * @method mergeObject
	 * @param {Object} pSrcObject 集合
	 * @param {Object} pDesObject 集合
	 * @return {Object} 合并之后的集合
	 */
	mergeObject: function(pSrcObject, pDesObject) {
		var bSrcObject = this.isObject(pSrcObject);
		var bDesObject = this.isObject(pDesObject);
		if(bSrcObject === true && bDesObject === true) {
			for(var key in pSrcObject) {
				pDesObject[key] = pSrcObject[key];
			}
			return pDesObject;
		} else {
			return pDesObject;
		}
	},
	/**
	 * @description 获取集合的第一个元素
	 * @method getFirstEleFromObj
	 * @param {Object} pObj 集合
	 * @return 集合的第一个元素
	 */
	getFirstEleFromObj: function(pObj) {
		if(pObj == null) {
			return;
		}
		for(var key in pObj) {
			return pObj[key];
		}
	},
	/**
	 * @description 把任意对象转换为数组（如果本身已经是数组则不处理）
	 * @method convertToArray
	 * @param {object} pObj 任意对象
	 * @return {Array} 返回数组
	 */
	convertToArray: function(pObj) {
		var bArray = GM.CommonOper.isArray(pObj);
		if(pObj == null || bArray) {
			return pObj;
		} else {
			return [pObj];
		}
	},
	/**
	 * @description 比较两个对象是否相同（只是比较简单的数据类型，不比较值为对象的）
	 * @param {object} pObj1 对象1
	 * @param {object} pObj2 对象2
	 * @return {Boolean} 是否相同
	 */
	compareObject: function(pObj1, pObj2) {
		var pResult = true;
		for(var key in pObj1) {
			if(pObj1[key] !== pObj2[key]) {
				pResult = false;
				break;
			}
		}
		return pResult;
	},
	/**
	 * @description 判断字符串是否为空
	 * @method isStrNullOrEmpty
	 * @param {String} str 字符串
	 * @return {Boolean} 是否为空
	 */
	isStrNullOrEmpty: function(str) {
		if(str == null) {
			return true;
		}
		if(!this.isString(str)) {
			return false;
		}
		var bEmpty = true;
		var pTempStr = GM.CommonOper.trimStr(str);
		for(var ii = 0; ii < pTempStr.length; ii++) {
			var pTempChar = pTempStr[ii];
			if(pTempChar !== ' ' && pTempChar !== '↵') {
				bEmpty = false;
				break;
			}
		}
		return bEmpty;
	},
	/**
	 * @description 去除字符串的前后空格，包含回车字符
	 * @method trimStr
	 * @param {String} str 字符串
	 * @return {String} 处理后的字符串
	 */
	trimStr: function(str) {
		if(str == null || !this.isString(str)) {
			return str;
		}

		var pTempStr = str.replace(/(^\r\n*)|(\r\n*$)/g, '');
		pTempStr = pTempStr.replace(/(^\n*)|(\n*$)/g, '');
		pTempStr = pTempStr.replace(/(^\s*)|(\s*$)/g, '');
		pTempStr = pTempStr.replace(/(^\r*)|(\r*$)/g, '');
		return pTempStr;
	},
	/**
	 * 去除字符串前后指定字符
	 * @method trimStrWithChar
	 * @param {String} strValue 要处理的字符串
	 * @param {String} removeChar 要删除的指定字符
	 * @return {String} 处理后的字符串
	 */
	trimStrWithChar: function(strValue, removeChar) {
		if(strValue == null || strValue.length < 1 || removeChar == null) {
			return strValue;
		}
		for(var ii = 0; ii < strValue.length; ii++) {
			if(strValue[ii] === removeChar) {
				strValue = strValue.substring(1);
			} else {
				break;
			}
		}
		for(var jj = strValue.length - 1; jj >= 0; jj--) {
			if(strValue[jj] === removeChar) {
				strValue = strValue.substring(0, strValue.length - 1);
			} else {
				break;
			}
		}
		return strValue;
	},
	/**
	 * @description 截取字符串数组中的字符串元素
	 * @method trimArrayStr
	 * @param {Array} strArray 字符串数组
	 */
	trimArrayStr: function(strArray) {
		if(GM.CommonOper.isArray(strArray)) {
			for(var ii = 0; ii < strArray.length; ii++) {
				strArray[ii] = GM.CommonOper.trimStr(strArray[ii]);
			}
		}
	},
	/**
	 * @description 简化数组，将数组元素中的数组拆分开
	 * @method simplifyArray
	 * @param {Array} pArray 数组
	 * @return {Array} 简化后的数组
	 */
	simplifyArray: function(pArray) {
		if(pArray == null) {
			return null;
		}
		var pResult = [];
		for(var ii = 0; ii < pArray.length; ii++) {
			var pItem = pArray[ii];
			var bArray = GM.CommonOper.isArray(pItem);
			if(bArray === true) {
				var pTempResult = GM.CommonOper.simplifyArray(pItem);
				if(pTempResult) {
					pResult = pResult.concat(pTempResult);
				}
			} else {
				if(pItem) {
					pResult.push(pItem);
				}
			}
		}
		return pResult;
	},
	/**
	 * @description 获取文件中的字符串
	 * @method getFileString
	 * @param {String} strPath 文件路径
	 * @return {String} 文件中的字符串
	 */
	getFileString: function(strPath) {
		var strResult = '';
		var url = _ctx + '/getFileString';
		$.ajax({
			type: 'get',
			url: url,
			data: {
				'strPath': strPath
			},
			async: false,
			success: function(data) {
				strResult = data;
			}
		});
		return strResult;
	},
	/**
	 * @description 获取当前日期
	 * @method getCurData
	 * @return {String} 当前日期，格式为“xxxx-xx-xx”
	 */
	getCurData: function() {
		var strResult = '';
		var url = _ctx + '/oa/land/utils/currentDate';
		$.ajax({
			type: 'get',
			url: url,
			async: false,
			success: function(data) {
				strResult = data;
			}
		});
		var pCurData = new Date(strResult);
		return pCurData.getFullYear() + '-' + (pCurData.getMonth() + 1) + '-' + pCurData.getDate();
	},
	/**
	 * @description 将日期字符串转换为 2016-10-1 的格式字符串
	 * @method getFormatData
	 * @param {String} strData 日期字符串
	 * @return {String} 正确格式的日期字符串
	 */
	getFormatData: function(strData) {
		if(this.isStrNullOrEmpty(strData)) {
			return null;
		}
		try {
			var pCurData = new Date(strData);
			return pCurData.getFullYear() + '-' + (pCurData.getMonth() + 1) + '-' + pCurData.getDate();
		} catch(e) {
			return null;
		}
	},
	/**
	 * @description 将日期字符串转换为 2016-10-1 12:03:32的格式字符串
	 * @method getFormatDataContainSec
	 * @param {String} strData 日期字符串
	 * @return {String} 正确格式的日期字符串
	 */
	getFormatDataContainSec: function(strData) {
		if(this.isStrNullOrEmpty(strData)) {
			return null;
		}
		try {
			var pCurData = new Date(strData);
			return pCurData.format('yyyy-MM-dd hh:mm:ss');
			//return pCurData.getFullYear()+"-"+(pCurData.getMonth()+1)+"-"+pCurData.getDate()+" "+pCurData.getHours()+":"+pCurData.getMinutes()+":"+pCurData.getSeconds();
		} catch(e) {
			return null;
		}
	},
	/**
	 * @description 获取UUID
	 * @method getUUID
	 * @return {String} 获取到的UUID
	 */
	getUUID: function() {
		var strResult = '';
		var url = _ctx + '/oa/land/utils/getUUID';

		//给url添加时间戳
		var strTimestamp = Date.parse(new Date());
		url += '?' + strTimestamp;

		$.ajax({
			type: 'post',
			url: url,
			async: false,
			success: function(data) {
				strResult = data;
			}
		});
		return strResult;
	},
	/**
	 * @description 创建一个二维数组
	 * @method getTwoDimenitionArray
	 * @param {Number} nX 第一个维度的长度
	 * @param {Number} nY 第二个维度的长度
	 * @param {object} defaultValue 数组元素默认值
	 * @return {Array} 创建好的二维数组
	 */
	getTwoDimenitionArray: function(nX, nY, defaultValue) {
		var result = [];
		for(var ii = 0; ii < nX; ii++) {
			result[ii] = new Array(nY);
			for(var jj = 0; jj < nY; jj++) {
				result[ii][jj] = defaultValue;
			}
		}
		return result;
	},
	/**
	 * @description 获取非空值
	 * @method getNotNullValue
	 * @param {String} strValue
	 * @param {String} strReplace
	 */
	getNotNullValue: function(strValue, strReplace) {
		if(this.isStrNullOrEmpty(strValue)) {
			if(this.isStrNullOrEmpty(strReplace)) {
				return strReplace;
			} else {
				return '';
			}
		} else {
			return strValue;
		}
	},
	/**
	 * @description 按顺序获取字典键数组
	 * @method getSortDic
	 * @param {Array} 要处理的数组
	 * @return {Array} 处理好的数组
	 */
	getSortDic: function(pDic) {
		var pResult = [];
		if(pDic) {
			for(var key in pDic) {
				pResult.push(key);
			}
		} else {
			return null;
		}
		return pResult.sort(function(ele1, ele2) {
			try {
				if(!GM.CommonOper.isStartsWith(ele1, '0') && GM.CommonOper.isDigital(ele1) &&
					!GM.CommonOper.isStartsWith(ele2, '0') && GM.CommonOper.isDigital(ele2)) {
					return Number(ele1) - Number(ele2);
				} else {
					return ele1 - ele2;
				}
			} catch(ex) {
				return -1;
			}
		});
	},
	/**
	 * @description 转化字符串为JSON对象
	 * @method parseToJSON
	 * @param {String} strValue 字符串数值
	 * @return {Object} 转换好的JSON对象
	 */
	parseToJSON: function(strValue) {
		if(this.isStrNullOrEmpty(strValue)) {
			return null;
		} else {
			var pResult = null;
			try {
				pResult = JSON.parse(strValue);
			} catch(e) {
				//				var strMessage = "数值不是标准JSON格式，转换失败";
				pResult = null;
			}
			return pResult;
		}
	},
	/**
	 * @description 编码url中的参数（这个不能编码整个url，只是编码参数段字符串）
	 * @method encodeStr
	 * @param {String} str 需要编码的字符串
	 * @return {String} 编码好的字符串
	 */
	encodeStr: function(str) {
		var strResult = null;
		if(!this.isStrNullOrEmpty(str)) {
			//先替换比较特殊的%
			str = this.replaceAll(str, '%', '%25');

			//编码非ascII字符
			str = encodeURI(str);

			//手动编码特殊字符
			str = this.replaceAll(str, '+', '%2B');
			str = this.replaceAll(str, ' ', '%20');
			str = this.replaceAll(str, '/', '%2F');
			str = this.replaceAll(str, '?', '%3F');
			str = this.replaceAll(str, '#', '%23');
			str = this.replaceAll(str, '&', '%26');
			str = this.replaceAll(str, '=', '%3D');

			strResult = str;
		}
		return strResult;
	},
	/**
	 * @description 同步Ajax请求
	 * @method ajaxRequest
	 * @param {String} strUrl 访问路径
	 * @param {Object} pData 请求数据
	 * @param {Object} settings 其他配置，同JQuery里面的setting参数
	 * @param {Boolean} bAddToken 是否在header上添加token值
	 * @return {Object} 服务器响应返回的数据
	 */
	ajaxRequest: function(strUrl, pData, settings, bAddToken) {
		var result = null;
		var header = {};

		//请求头添加令牌
		if(bAddToken !== false) {
			header.token = GM.token;
		}

		//如果是get请求，则加上时间戳，避免缓存
		if(settings && settings.type && settings.type.toUpperCase() === 'GET') {
			var strTime = (new Date()).getTime();
			strUrl = GM.LayoutOper.addURLParam(strUrl, 'timestamplp', strTime);
		}

		var defaultSettings = {
			type: 'post',
			url: strUrl,
			data: pData,
			async: false,
			headers: header,
			dataType: 'json',
			success: function(response, status, request) {
				var strToken = request.getResponseHeader('token');
				if(strToken != null) {
					response.token = strToken;
					GM.token = strToken;
				}
				result = response;
			}
		};

		defaultSettings = GM.Util.extend(defaultSettings, settings);
		$.ajax(defaultSettings);
		return result;
	},
	/**
	 * @description 上传文件请求函数
	 * @method uploadRequest
	 * @param {String} strUrl 请求地址
	 * @param {FormData} formData 表单数据
	 * @param {Function} success 成功回调函数
	 * @param {Function} error 失败回调函数
	 */
	uploadRequest: function(strUrl, formData, success, error) {
		if(GM.CommonOper.isStrNullOrEmpty(strUrl) || formData == null ||
			!GM.CommonOper.isFunction(success)) {
			return;
		}
		$.ajax({
			url: strUrl,
			type: 'POST',
			cache: false,
			data: formData,
			processData: false,
			contentType: false,
			success: function(response) {
				success(response);
			},
			error: function(response) {
				error(response);
			}
		});
	},
	/**
	 * @description 获取对象值
	 * @method getObjectValue
	 * @param {Object} pObject 要获取的对象
	 * @param {Array||String} strName 要获取的对象属性
	 * @return {Array||String} 获取的值
	 */
	getObjectValue: function(pObject, strName) {
		if(pObject != null && !this.isStrNullOrEmpty(strName)) {
			try {
				var arrayName = strName.split('.');
				var pResult = null;
				if(arrayName.length === 1) {
					pResult = pObject[arrayName[0]];
				} else if(arrayName.length === 2) {
					pResult = pObject[arrayName[0]][arrayName[1]];
				} else if(arrayName.length === 3) {
					pResult = pObject[arrayName[0]][arrayName[1]][arrayName[2]];
				}
				return pResult;
			} catch(ex) {
				return null;
			}
		} else {
			return null;
		}
	},
	/**
	 * @description 设置对象值（支持name中带'.'符号的）
	 * @method setObjectValue
	 * @param {Object} pObject 要设置的对象
	 * @param {Array||String} strName 要设置的对象属性
	 * @param {String} pValue 要设置的值
	 * @return {Boolean} 设置是否成功，成功返回true
	 */
	setObjectValue: function(pObject, strName, pValue) {
		if(pObject != null && !this.isStrNullOrEmpty(strName)) {
			try {
				var arrayName = strName.split('.');
				if(arrayName.length === 1) {
					pObject[arrayName[0]] = pValue;
				} else if(arrayName.length === 2) {
					pObject[arrayName[0]][arrayName[1]] = pValue;
				} else if(arrayName.length === 3) {
					pObject[arrayName[0]][arrayName[1]][arrayName[2]] = pValue;
				}
				return true;
			} catch(ex) {
				return false;
			}
		} else {
			return false;
		}
	},
	/**
	 * @description 将JSON对象解析为url参数（用于POST后台提交）
	 * @method paramObject
	 * @param {Object} 要解析的JSON对象
	 * @return {String} 解析好的url参数
	 */
	paramObject: function(obj) {
		if(obj == null) {
			return '';
		}
		var query = '';
		var name;
		var value;
		var fullSubName;
		var subName;
		var subValue;
		var innerObj;
		var i;
		var strTempQuery;

		for(name in obj) {
			value = obj[name];

			if(value instanceof Array) {
				for(i = 0; i < value.length; ++i) {
					subValue = value[i];
					if(subValue instanceof Object) {
						fullSubName = name + '[' + i + ']';
					} else {
						fullSubName = name;
					}
					innerObj = {};
					innerObj[fullSubName] = subValue;
					strTempQuery = this.paramObject(innerObj);
					if(!this.isStrNullOrEmpty(strTempQuery)) {
						query += strTempQuery + '&';
					}
				}
			} else if(value instanceof Object) {
				for(subName in value) {
					subValue = value[subName];
					fullSubName = name + '.' + subName;
					//fullSubName = name + '[' + subName + ']';
					innerObj = {};
					innerObj[fullSubName] = subValue;
					strTempQuery = this.paramObject(innerObj);
					if(!this.isStrNullOrEmpty(strTempQuery)) {
						query += strTempQuery + '&';
					}
				}
			} else if(value !== undefined && value !== null) {
				query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
			}
		}

		return query.length ? query.substr(0, query.length - 1) : query;
	},
	/**
	 * @description 将字符串转化为数值
	 * @method parseToNumber
	 * @param {String} str 字符串
	 * @return {Number} 转换后的数值
	 */
	parseToNumber: function(str) {
		var result = 0;
		try {
			result = Number(str);
		} catch(ex) {
			window.console.error(ex);
		}
		return result;
	},
	/**
	 * @description 延迟执行，一直到能够成功执行一次才会停止
	 * @method delayExcute
	 * @param {Function} callback
	 */
	delayExcute: function(callback, bindThis) {
		if(!this.isFunction(callback)) {
			return;
		}
		bindThis = bindThis == null ? this : bindThis;
		setTimeout(function() {
			if(GM.CommonOper.isFunction(callback)) {
				var bRt = callback(this);
				if(bRt === false) {
					GM.CommonOper.delayExcute(callback, bindThis);
				}
			}
		}.bind(bindThis), 10);
	},
	/**
	 * 获取指定字符串的实际长度，中文字符算两个长度（JS默认中文字符算一个长度）
	 * @method getCharLength
	 * @param {String} strValue 要获取实际长度的字符串
	 * @return {Number} 字符串的实际长度
	 */
	getCharLength: function(strValue) {
		if(this.isStrNullOrEmpty(strValue)) {
			return 0;
		}
		var result = strValue.replace(/[\u0391-\uFFE5]/g, 'aa').length;
		return result;
	}
};

/**
 * @description JavaScript中的路径基础操作
 * @class GM.FilePath
 * @static
 */
GM.FilePath = {
	/**
	 * @description 获取文件名称
	 * @method getFileName
	 * @param {String} strFileName 文件路径
	 * @return {String} 文件名称
	 */
	getFileName: function(strFileName) {
		var nIndex = strFileName.lastIndexOf('\\');
		if(nIndex < 0) {
			nIndex = strFileName.lastIndexOf('/');
		}
		if(nIndex < 0) {
			return null;
		}
		return strFileName.substr(nIndex + 1);
	},
	/**
	 * @description 获取后缀名称
	 * @method getExtention
	 * @param {String} strFileName 文件路径
	 * @return {String} 文件后缀名称
	 */
	getExtention: function(strFileName) {
		var nIndex = strFileName.lastIndexOf('.');
		if(nIndex < 0) {
			return null;
		}
		return strFileName.substr(nIndex + 1);
	},
	/**
	 * @description 获取文件夹名称
	 * @method getDirName
	 * @param {String} strFileName 文件路径
	 * @return {String} 文件夹名称
	 */
	getDirName: function(strFileName) {
		var nIndex = strFileName.lastIndexOf('\\');
		if(nIndex < 0) {
			nIndex = strFileName.lastIndexOf('/');
		}
		if(nIndex < 0) {
			return null;
		}
		return strFileName.substr(0, nIndex);
	},
	/**
	 * @description 获取没有后缀的名称
	 * @method getNameWithOutExtention
	 * @param {String} strFileName
	 * @return {String} 获取到的没有后缀的名称
	 */
	getNameWithOutExtention: function(strFileName) {
		var strName = this.getFileName(strFileName);
		if(strName) {
			var nIndex = strName.lastIndexOf('.');
			if(nIndex < 0) {
				return null;
			}
			return strName.substr(0, nIndex);
		}
		return null;
	},
	/**
	 * @description 获取文件类型
	 * @method getFileType
	 * @param {String} strFileName  文件全路径
	 * @return {string} 文件类型名称 图片返回img；pdf返回pdf；其他返回unkown
	 */
	getFileType: function(strFileName) {
		var strType = 'unkown';
		if(GM.CommonOper.isStrNullOrEmpty(strFileName)) {
			return strType;
		}
		if(strFileName.match(/\.png|\.img|\.ico|\.jpg|\.jpeg|\.bmp/gi)) {
			strType = 'img';
		} else if(strFileName.match(/\.pdf/gi)) {
			strType = 'pdf';
		}

		return strType;
	}
};

/**
 * @description JavaScript中的界面操作类
 * @class GM.LayoutOper
 * @static
 */
GM.LayoutOper = {
	/**
	 * @description 选择select控件中的选项
	 * @method selectOption
	 * @param {JQuery} $pSelect jquery对象
	 * @param {String} strValue 值
	 */
	selectOption: function($pSelect, strValue) {
		if($pSelect) {
			$pSelect.find('option').each(function() {
				if($(this).val() === strValue) {
					$(this).prop('selected', 'selected');
				}
			});
		}
	},
	/**
	 * @method getElementTop 获取对象距离文档顶部的距离
	 * @param {Object} $pEle jquery对象
	 * @return {Number} 距离文档顶部的距离
	 */
	getElementTop: function($pEle) {
		var pEle = $pEle[0];
		var offset = pEle.offsetTop;
		var pParent = pEle.offsetParent;
		while(pParent) {
			offset += pParent.offsetTop;
			pParent = pParent.offsetParent;
		}
		return offset;
	},
	/**
	 * @method getElementLeft 获取对象距离文档左部的距离
	 * @param {Object} $pEle jquery对象
	 * @return {Number} 距离文档左部的距离
	 */
	getElementLeft: function($pEle) {
		var pEle = $pEle[0];
		var offset = pEle.offsetLeft;
		var pParent = pEle.offsetParent;
		while(pParent) {
			offset += pParent.offsetLeft;
			pParent = pParent.offsetParent;
		}
		return offset;
	},
	/**
	 * @method getElementBottom 获取对象距离文档底部的距离
	 * @param {Object} $pEle jquery对象
	 * @return {Number} 距离文档底部的距离
	 */
	getElementBottom: function($pEle) {
		var nTop = this.getElementTop($pEle);
		var nResult = nTop + $pEle.outerHeight();
		return nResult;
	},
	/**
	 * @method getElementRight 获取对象距离文档右部的距离
	 * @param {Object} $pEle jquery对象
	 * @return {Number} 距离文档右部的距离
	 */
	getElementRight: function($pEle) {
		var nLeft = this.getElementLeft($pEle);
		var nTotalWidth = $(document).width();
		var nRight = nTotalWidth - nLeft - $pEle.outerWidth();
		return nRight;
	},
	/**
	 * @description 获取有参数的URL
	 * @method getURLParams
	 * @param {String} strURL URL路径
	 * @return {String} 获取到的URL
	 */
	getURLParams: function(strURL) {
		if(GM.CommonOper.isStrNullOrEmpty(strURL)) {
			return null;
		}
		var result = {};
		if(strURL.indexOf('?') < 0) {
			return result;
		}
		var strPath = strURL.slice(strURL.indexOf('?') + 1);
		if(strPath.indexOf('#!') > 0) {
			strPath = strPath.slice(0, strPath.indexOf('#!'));
		}
		var arrayParam = strPath.split('&');
		for(var ii = 0; ii < arrayParam.length; ii++) {
			var pParam = arrayParam[ii];
			var arrayKeyValue = pParam.split('=');
			result[arrayKeyValue[0]] = arrayKeyValue[1];
		}
		return result;
	},
	/**
	 * @description 获取没有参数的URL
	 * @method getURLWithoutParams
	 * @param {String} strAbsUrl 页面全路径
	 * @return {String} 获取到的URL
	 */
	getURLWithoutParams: function(strAbsUrl) {
		var strPath = strAbsUrl;
		if(strAbsUrl.indexOf('?') > 0) {
			strPath = strAbsUrl.slice(0, strAbsUrl.indexOf('?'));
		}
		if(strPath.indexOf('#!') > 0) {
			strPath = strPath.slice(0, strPath.indexOf('#!'));
		}
		return strPath;
	},
	/**
	 * @description 添加URL参数
	 * @method addURLParam
	 * @param {String} strUrl URL
	 * @param {String} strName 参数名
	 * @param {String} strValue 参数值
	 * @return {String} 添加参数后的全路径
	 */
	addURLParam: function(strUrl, strName, strValue) {
		if(GM.CommonOper.isStrNullOrEmpty(strUrl)) {
			return strUrl;
		}
		if(strUrl.indexOf('?') >= 0) {
			strUrl += '&' + strName + '=' + strValue;
		} else {
			strUrl += '?' + strName + '=' + strValue;
		}
		return strUrl;
	},
	/**
	 * 删除URL地址上的参数
	 * @method removeURLParam
	 * @param {String} strUrl URL
	 * @param {String} strName 要删除的参数名
	 * @return {String} 删除参数后的全路径
	 */
	removeURLParam: function(strUrl, strName) {
		var pParams = this.getURLParams(strUrl);
		delete pParams[strName];
		var strResult = this.getURLWithoutParams(strUrl);
		for(var key in pParams) {
			strResult = this.addURLParam(strResult, key, pParams[key]);
		}
		return strResult;
	},
	/**
	 * @description 修证textarea的值（将前导空格用空字符串代替）
	 * @method modifyTextareaText
	 * @param {Object} $pTextarea jquery对象
	 */
	modifyTextareaText: function($pTextarea) {
		if($pTextarea.length > 0) {
			for(var ii = 0; ii < $pTextarea.length; ii++) {
				var $pItem = $($pTextarea[ii]);
				var text = $pItem.text();
				text = text.replace(/^\s*/g, '');
				$pItem.text(text);
			}
		}
	},
	/**
	 * @decription 获取项目最上层Window
	 * @method getTopWindow
	 * @return {Object} 项目最上层的Windows对象
	 */
	getTopWindow: function() {
		var pWindow = top;
		return pWindow;
	},
	/**
	 * @description 验证表单
	 * @method validateForm
	 * @param {Object} $validation 表单验证服务,jquery对象
	 * @param {Object} pData 表单数据
	 * @param {Function} successFun 验证成功回调函数
	 * @param {Function} faileFun 是否展示提示，默认展示
	 * @return {Boolean} 是否验证成功
	 */
	validateForm: function($validation, pData, successFun, faileFun) {
		if($validation == null || pData == null) {
			//表单存在问题
			if(GM.CommonOper.isFunction(faileFun)) {
				faileFun();
			} else {
				GM.Alert.show('提示', '表单验证失败，请检查代码！', {
					type: 'warning'
				});
			}
		}
		var pPromise = $validation.validate(pData);
		pPromise.then(function() {
			//表单验证成功
			if(GM.CommonOper.isFunction(successFun)) {
				successFun();
			}
		}, function() {
			//表单存在问题
			if(GM.CommonOper.isFunction(faileFun)) {
				faileFun();
			} else {
				GM.Alert.show('提示', '请先完善表单！', {
					type: 'warning'
				});
			}
		});
	},
	/**
	 * 简化URL地址，将URL的参数存入cookie中
	 * @method simplyURL
	 * @param {Object} pData url参数名称和cookie记录名称键值对
	 * @param {String} strUrl 需要简化的地址
	 */
	simplyURL: function(pData, strUrl) {
		if(pData == null) {
			return null;
		}
		strUrl = strUrl == null ? window.location.href : strUrl;
		var pParams = GM.LayoutOper.getURLParams(strUrl);
		var bReload = false;
		for(var key in pData) {
			if(pParams[key] != null) {
				if(key === 'GMSSO_CLIENT_EC') {
					//客户端令牌直接对应appkey
					GM.CommonOper.addCookie(APP_KEY, pParams[key], 1);
				} else {
					//服务端令牌
					GM.CommonOper.addCookie(pData[key], pParams[key], 1);
				}
				strUrl = GM.LayoutOper.removeURLParam(strUrl, key);
				bReload = true;
			}
		}

		//跳转
		if(bReload === true) {
			window.location.href = strUrl;
		}
	},
	/**
	 * 清空登录缓存值
	 * @method clearCookie
	 * @static
	 */
	clearCookie: function() {
		var strCookie = document.cookie;
		var arrCookie = strCookie.split('; ');
		for(var i = 0; i < arrCookie.length; i++) {
			var arr = arrCookie[i].split('=');
			GM.CommonOper.removeCookie(arr[0]);
		}
	}
};

/**
 * @description 数据字典操作
 * @class GM.SysDicOper
 * @static
 */
GM.SysDicOper = {
	/**
	 * @description 获取数据字典值
	 * @method getSysdic
	 * @param {String} strUrl 后台服务地址
	 * @param {String} strAppId 通用后台管理中子系统对应的ID值
	 */
	getSysdic: function(strUrl, strAppId) {
		var pResponse = GM.CommonOper.ajaxRequest(strUrl, {
			appId: strAppId
		});
		if(pResponse && pResponse.data) {
			this.recordDic(pResponse.data);
		}
	},
	/**
	 * @description 记录数据字典
	 * @method recordDic
	 * @param {Array} pData 要记录的数据数组
	 */
	recordDic: function(pData) {
		if(!GM.SysDicOper.dicData) {
			GM.SysDicOper.dicData = {};
			for(var ii = 0; ii < pData.length; ii++) {
				this._getLeafNodes(pData[ii], GM.SysDicOper.dicData);
			}
		}
	},
	/**
	 * @description 获取数据字典对应的label值
	 * @method getLabel
	 * @param {String} strType 数据字典类型
	 * @param {String} strValue 数据字典值
	 * @return {String} 数据字典显示值
	 */
	getLabel: function(strType, strValue) {
		if(GM.SysDicOper.dicData) {
			var arrayData = GM.SysDicOper.dicData[strType];
			if(arrayData) {
				for(var ii = 0; ii < arrayData.length; ii++) {
					if(String(arrayData[ii].value) === String(strValue)) {
						return arrayData[ii].label;
					}
				}
			}
		}
		return null;
	},
	/**
	 * @method _getLeafNodes 向指定对象添加数组数据（函数名有点问题）
	 * @param {Array} pData 要添加的数据数组
	 * @param {Object} pResult 要添加数据的对象
	 */
	_getLeafNodes: function(pData, pResult) {
		if(pData.childrens) {
			for(var ii = 0; ii < pData.childrens.length; ii++) {
				var pChildItem = pData.childrens[ii];
				if(pChildItem.childrens != null) {
					this._getLeafNodes(pChildItem, pResult);
				} else {
					if(pChildItem.type != null && pChildItem.value != null) {
						if(!pResult[pChildItem.type]) {
							pResult[pChildItem.type] = [];
						}
						pResult[pChildItem.type].push(pChildItem);
					}
				}
			}
		}
		if(pData.type != null && pData.value != null) {
			if(!pResult[pData.type]) {
				pResult[pData.type] = [];
			}
			pResult[pData.type].push(pData);
		}
	}
};

/**
 * @description 日期操作对象
 * @author 罗盼 2017-06-12
 * @class GM.DateOper
 * @static
 */
GM.DateOper = {
	/**
	 * @description 获取前一天
	 * @method getLastDay
	 * @param {Number} timestamp 时间戳
	 * @return {Object} 包含“start”和“end”属性的对象，对应的值都是时间戳
	 */
	getLastDay: function(timestamp) {
		var result = this._getTimesByDay(timestamp, 1);
		return result;
	},
	/**
	 * @description 获取前一周
	 * @method getLastWeek
	 * @param {Number} timestamp 时间戳
	 * @return {Object} 包含“start”和“end”属性的对象，对应的值都是时间戳
	 */
	getLastWeek: function(timestamp) {
		var result = this._getTimesByDay(timestamp, 7);
		return result;
	},
	/**
	 * @description 获取前一月(一月按30天算)
	 * @method getLastMonth
	 * @param {Number} timestamp 时间戳
	 * @return {Object} 包含“start”和“end”属性的对象，对应的值都是时间戳
	 */
	getLastMonth: function(timestamp) {
		var result = this._getTimesByDay(timestamp, 30);
		return result;
	},
	/**
	 * @description 获取前半年（半年按183天算）
	 * @method getLastHalfyear
	 * @param {Number} timestamp 时间戳
	 * @return {Object} 包含“start”和“end”属性的对象，对应的值都是时间戳
	 */
	getLastHalfyear: function(timestamp) {
		var result = this._getTimesByDay(timestamp, 183);
		return result;
	},
	/**
	 * @description 获取前一年（一年按365天算）
	 * @method getLastYear
	 * @param {Number} timestamp 时间戳
	 * @return {Object} 包含“start”和“end”属性的对象，对应的值都是时间戳
	 */
	getLastYear: function(timestamp) {
		var result = this._getTimesByDay(timestamp, 365);
		return result;
	},
	/**
	 * @description 根据天数获取时间段（按天计算，今天的时间不算）
	 * @method _getTimesByDay
	 * @param {Number} timestamp 时间戳
	 * @param {Number} nDays 天数
	 * @return {Object} 包含“start”和“end”属性的对象，对应的值都是时间戳
	 * @private
	 */
	_getTimesByDay: function(timestamp, nDays) {
		var result = {};
		var pDate = this.getDate(timestamp);
		if(pDate == null) {
			return null;
		} else {
			pDate.clearTime();
			var nEndTime = pDate.getTime();
			var nStartTime = nEndTime - 86400000 * nDays;
			result.end = nEndTime;
			result.start = nStartTime;
			return result;
		}
	},
	/**
	 * @description 根据时间戳获取日期对象
	 * @method getDate
	 * @param {Number} timestamp 时间戳
	 * @return {Date} 日期对象
	 */
	getDate: function(timestamp) {
		if(GM.CommonOper.isString(timestamp)) {
			timestamp = GM.CommonOper.parseToNumber(timestamp);
		}
		if(!GM.CommonOper.isDigital(timestamp)) {
			return null;
		}
		try {
			var pCurDate = new Date(timestamp);
			return pCurDate;
		} catch(e) {
			return null;
		}
	}
};

/**
 * @description 用户操作
 * @class GM.UserOper
 * @type {{}}
 */
GM.UserOper = {
	/**
	 * @description 通过令牌值获取用户ID信息
	 * @param {String} strUrl 请求的URL字符串
	 * @param {String} strToken 令牌值
	 * @return {String} 用户ID
	 */
	getUserFromToken: function(strUrl, strToken) {
		var pResponse = GM.CommonOper.ajaxRequest(strUrl, {
			token: strToken
		}, {
			type: 'get'
		});
		var result = null;
		if(pResponse != null) {
			result = pResponse.data;
		}
		return result;
	},
	/**
	 * @description 获取用户信息
	 * @method getUserInfo
	 * @param {String} strUserId
	 * @param {String} strGetUserUrl
	 * @param {String} strGetAreaUrl
	 * @return {null}
	 */
	getUserInfo: function(strUserId, strGetUserUrl, strGetAreaUrl, strGetRoleUrl, strOrganizationUrl) {
		var pResponse = GM.CommonOper.ajaxRequest(strGetUserUrl, {
			userId: strUserId
		}, {
			type: 'get'
		});
		if(pResponse == null) {
			return null;
		}
		var userInfo = pResponse.data;
		var organizations = userInfo.organizations;
		var arrayAreas = [];
		var strWhereSql = '';
		var arrayCodes = [];
		for(var ii = 0; ii < organizations.length; ii++) {
			var pOrgnization = organizations[ii];
			var strAreaId = pOrgnization.areaId;
			var pAreaData = this._getAreaData(strAreaId, strGetAreaUrl);
			if(pAreaData != null) {
				arrayAreas.push(pAreaData);
			}

			//获取查询辖区代码
			var arrayTemp = this._getArrayCodesFromArea(pAreaData);
			if(arrayTemp != null) {
				arrayCodes = arrayCodes.concat(arrayTemp);
			}
		}
		strWhereSql += arrayCodes.join(',');
		userInfo.whereSql = strWhereSql;
		userInfo.arrayCodes = arrayCodes;
		userInfo.areas = arrayAreas;
		GM.userInfo = userInfo;
		if(GM.userInfo.areas != null && GM.userInfo.areas[0] != null && GM.userInfo.areas[0].childrens != null) {
			GM.userInfo.regions = [GM.userInfo.areas[0]];
			GM.userInfo.regions = GM.userInfo.regions.concat(GM.userInfo.areas[0].childrens);
		} else {
			GM.userInfo.regions = GM.userInfo.areas;
		}
		this._setAreaSql(userInfo.areas);

		//获取用户权限
		this._setPermission(strGetRoleUrl);

		//维护机构数据
		this._setOrganization(strOrganizationUrl);
	},
	/**
	 * @description 设置组织机构信息
	 * @method _setOrganization
	 * @param {String} strOrganizationUrl URL地址
	 * @private
	 */
	_setOrganization: function(strOrganizationUrl) {
		var pResponse = GM.CommonOper.ajaxRequest(strOrganizationUrl, {}, {
			type: 'get'
		});
		if(pResponse == null) {
			return;
		}
		var pData = pResponse.data;
		var arrayAllData = GM.TreeOper.getAllNodes(pData, 'childrens');
		var arrayOrganizations = [];
		for(var ii = 0; ii < GM.userInfo.organizations.length; ii++) {
			var strId = GM.userInfo.organizations[ii].id;
			for(var jj = 0; jj < arrayAllData.length; jj++) {
				if(arrayAllData[jj].id === strId) {
					arrayOrganizations.push(arrayAllData[jj]);
					break;
				}
			}
		}
		GM.userInfo.organizations = arrayOrganizations;
	},
	/**
	 * @description 设置权限信息
	 * @method _setPermission
	 * @param {String} strGetRoleUrl 获取权限地址
	 * @private
	 */
	_setPermission: function(strGetRoleUrl) {
		GM.userInfo.permissions = [];
		if(GM.userInfo.roles) {
			var roles = GM.userInfo.roles;
			for(var ii = 0; ii < roles.length; ii++) {
				var pRole = roles[ii];

				//获取角色信息
				var pResponse = GM.CommonOper.ajaxRequest(strGetRoleUrl, {
					roleId: pRole.id
				}, {
					type: 'get'
				});
				if(pResponse) {
					var roleData = pResponse.data;
					pRole.roleData = roleData;

					//获取权限标识符
					if(roleData.permissions) {
						for(var jj = 0; jj < roleData.permissions.length; jj++) {
							GM.userInfo.permissions.push(roleData.permissions[jj].permValue);
						}
					}
				}
			}
		}
	},
	/**
	 * @description 设置区域对应的SQL
	 * @method _setAreaSql
	 * @param {Array} areas 要设置的区域数组
	 * @private
	 */
	_setAreaSql: function(areas) {
		if(areas == null || areas.length <= 0) {
			return;
		}
		for(var ii = 0; ii < areas.length; ii++) {
			var pArea = areas[ii];
			var arrayTemp = this._getArrayCodesFromArea(pArea);
			if(arrayTemp != null) {
				pArea.whereSql = arrayTemp.join(',');
			}
			if(pArea.childrens) {
				this._setAreaSql(pArea.childrens);
			}
		}
	},
	/**
	 * @description 使用ajax获取辖区数据
	 * @method _getAreaData
	 * @param {String} strAreaId 辖区ID
	 * @param {String} strGetAreaUrl 后天服务路径
	 * @return {object||null} 成功返回辖区数据，不成功返回null
	 * @private
	 */
	_getAreaData: function(strAreaId, strGetAreaUrl) {
		var pResponse = GM.CommonOper.ajaxRequest(strGetAreaUrl, {
			type: 'get'
		});
		if(pResponse == null) {
			return null;
		}
		var pAreaData = this._getDataFromAreaId(strAreaId, pResponse.data);
		return pAreaData;
	},
	/**
	 * @description 根据辖区ID获取辖区数据
	 * @method _getDataFromAreaId
	 * @param {String} strAreaId
	 * @param {Array} arrayData
	 * @return {object||null} 成功返回辖区数据，不成功返回null
	 * @private
	 */
	_getDataFromAreaId: function(strAreaId, arrayData) {
		if(arrayData == null) {
			return null;
		}
		for(var ii = 0; ii < arrayData.length; ii++) {
			var pData = arrayData[ii];
			if(pData.id === strAreaId) {
				return pData;
			} else {
				if(pData.childrens) {
					var result = this._getDataFromAreaId(strAreaId, pData.childrens);
					if(result != null) {
						return result;
					}
				}
			}
		}
	},
	/**
	 * @description 根据辖区数据获取相应的sql
	 * @param {Object} pAreaData 辖区数据
	 * @return {String||null} 成功就返回相应的sql,不成功返回null
	 * @private
	 */
	_getArrayCodesFromArea: function(pAreaData) {
		if(pAreaData == null) {
			return null;
		}
		if(pAreaData.code.substring(2) === '0000') {
			//省级不做筛选
			return;
		}
		var result = null;
		if(pAreaData.childrens) {
			//市级，如果有子辖区，则拼接子辖区对应的代码
			var arrayCode = [];
			for(var ii = 0; ii < pAreaData.childrens.length; ii++) {
				arrayCode.push("'" + pAreaData.childrens[ii].code + "'");
			}
			result = arrayCode;
		} else {
			result = ["'" + pAreaData.code + "'"];
		}
		return result;
	}
};

/**
 * @description 辖区操作类
 * @class GM.RegionOper
 * @type {{}}
 */
GM.RegionOper = {
	/**
	 * @description 辖区类型
	 */
	RegionType: {
		province: 0,
		city: 1,
		county: 2
	},
	/**
	 * @description 获取辖区数据
	 * @method getRegion
	 * @param {String} strUrl 请求地址
	 * @return {Object} 辖区对象
	 */
	getRegion: function(strUrl) {
		if(this.region == null) {
			strUrl = strUrl == null ? UUMS_SERVER + 'area/tree' : strUrl;
			var pResponse = GM.CommonOper.ajaxRequest(strUrl, {
				type: 'get'
			});
			if(pResponse && pResponse.data) {
				this.region = pResponse.data;
			}
		}
	},
	/**
	 * @description 获取辖区代码
	 * @method getCode
	 * @param {String} strCaption 辖区名称
	 * @return {String} 辖区代码
	 */
	getCode: function(strCaption) {
		this.getRegion();
		var arrayNodes = GM.TreeOper.getAllNodes(this.region, 'childrens');
		var result = null;
		if(arrayNodes) {
			for(var ii = 0; ii < arrayNodes.length; ii++) {
				var pNode = arrayNodes[ii];
				if(pNode.title === strCaption) {
					result = pNode.code;
					break;
				}
			}
		}
		return result;
	},
	/**
	 * @description 获取辖区名称
	 * @method getCaption
	 * @param {String} strCode 辖区代码
	 * @return {String} 辖区名称
	 */
	getCaption: function(strCode) {
		this.getRegion();
		var arrayNodes = GM.TreeOper.getAllNodes(this.region, 'childrens');
		var result = null;
		if(arrayNodes) {
			for(var ii = 0; ii < arrayNodes.length; ii++) {
				var pNode = arrayNodes[ii];
				if(pNode.code === strCode) {
					result = pNode.title;
					break;
				}
			}
		}
		return result;
	},
	/**
	 * @description 获取辖区类型
	 * @method getRegionType
	 * @param {String} strCode 辖区代码
	 * @return {GM.RegionOper.RegionType} 辖区类型
	 */
	getRegionType: function(strCode) {
		if(GM.CommonOper.isStrNullOrEmpty(strCode)) {
			return null;
		}
		var str4Code = strCode.substr(2);
		var str2Code = strCode.substr(4);
		if(str4Code === '0000') {
			return this.RegionType.province;
		} else if(str2Code === '00') {
			return this.RegionType.city;
		} else {
			return this.RegionType.county;
		}
	},
	/**
	 * @description 获取级别更高的行政区划代码
	 * @method getHigherCode
	 * @param {String} strCode1 行政区划代码
	 * @param {String} strCode2 行政区划代码
	 * @return {String} 高级别的行政区划代码
	 */
	getHigherCode: function(strCode1, strCode2) {
		var regionType1 = this.getRegionType(strCode1);
		var regionType2 = this.getRegionType(strCode2);
		if(regionType1 == null || regionType2 == null) {
			return strCode1;
		}
		if(regionType1 < regionType2) {
			return strCode1;
		} else {
			return strCode2;
		}
	}
};
/**
 * @description 树节点操作类
 * @class GM.TreeOper
 * @type {{}}
 */
GM.TreeOper = {
	/**
	 * @description 获取树形节点所有节点集合
	 * @method getAllNodes
	 * @param {Array} arrayNodes 节点集合
	 * @param {String} attChildren 子节点属性名称,默认为‘children’
	 * @return {Array} 节点集合
	 */
	getAllNodes: function(arrayNodes, attChildren) {
		if(arrayNodes == null) {
			return [];
		}
		attChildren = attChildren == null ? 'children' : attChildren;
		var result = [];
		for(var ii = 0; ii < arrayNodes.length; ii++) {
			var pNode = arrayNodes[ii];
			result.push(pNode);
			if(pNode[attChildren]) {
				var arrayTempNodes = this.getAllNodes(pNode[attChildren], attChildren);
				result = result.concat(arrayTempNodes);
			}
		}
		return result;
	},
	/**
	 * @description 根据参数获取节点集合
	 * @method getNodesByParam
	 * @param {Array} arrayNodes 节点集合
	 * @param {String} strName 属性名称
	 * @param {Object} pValue 属性值
	 * @param {String} attChildren 子节点属性名称,默认为‘children’
	 * @return {Array} 节点集合
	 */
	getNodesByParam: function(arrayNodes, strName, pValue, attChildren) {
		var result = [];
		attChildren = attChildren == null ? 'children' : attChildren;
		var listNodes = this.getAllNodes(arrayNodes, attChildren);
		for(var ii = 0; ii < listNodes.length; ii++) {
			var pNode = listNodes[ii];
			if(pNode[strName] === pValue) {
				result.push(pNode);
			}
		}
		return result;
	},
	/**
	 * @description 根据参数获取节点集合(不完全匹配)
	 * @method getNodesLikeParam
	 * @param {Array} arrayNodes 节点集合
	 * @param {String} strName 属性名称
	 * @param {Object} pValue 属性值
	 * @param {String} attChildren 子节点属性名称,默认为‘children’
	 * @return {Array} 节点集合
	 */
	getNodesLikeParam: function(arrayNodes, strName, pValue, attChildren) {
		var result = [];
		attChildren = attChildren == null ? 'children' : attChildren;
		var listNodes = this.getAllNodes(arrayNodes, attChildren);
		for(var ii = 0; ii < listNodes.length; ii++) {
			var pNode = listNodes[ii];
			if(pNode[strName] && pNode[strName].indexOf(pValue) >= 0) {
				result.push(pNode);
			}
		}
		return result;
	},
	/**
	 * @description 设置节点的父节点
	 * @method setParentNode
	 * @param {Array} arrayNodes 节点集合
	 * @param {Object} pParent 父节点
	 * @param {String} attChildren 子节点属性名称,默认为‘children’
	 */
	setParentNode: function(arrayNodes, pParent, attChildren) {
		if(arrayNodes == null) {
			return;
		}
		attChildren = attChildren == null ? 'children' : attChildren;
		for(var ii = 0; ii < arrayNodes.length; ii++) {
			var pItem = arrayNodes[ii];
			if(pItem[attChildren]) {
				this.setParentNode(pItem[attChildren], pItem, attChildren);
			}
		}
	},
	/**
	 * @description 获取父节点
	 * @method getParentNode
	 * @param {Array} arrayNodes 节点集合
	 * @param {Object} pNode 当前节点
	 * @param {String} attChildren 子节点属性名称,默认为‘children’
	 * @return {Object} 父节点对象
	 */
	getParentNode: function(arrayNodes, pNode, attChildren) {
		if(arrayNodes == null) {
			return null;
		}
		var arrayChildrenNodes = [];
		attChildren = attChildren == null ? 'children' : attChildren;
		if(GM.CommonOper.isArray(arrayNodes)) {
			arrayChildrenNodes = arrayNodes;
		} else {
			arrayChildrenNodes = arrayNodes[attChildren];
		}
		for(var ii = 0; ii < arrayChildrenNodes.length; ii++) {
			var pItemNode = arrayChildrenNodes[ii];
			if(pNode === pItemNode) {
				if(GM.CommonOper.isArray(arrayNodes)) {
					return null;
				} else {
					return arrayNodes;
				}
			}
			if(pItemNode[attChildren]) {
				var pTempParentNode = this.getParentNode(pItemNode, pNode, attChildren);
				if(pTempParentNode != null) {
					return pTempParentNode;
				}
			}
		}
		return null;
	},
	/**
	 * @description 删除树结点
	 * @method removeNode
	 * @param {Array} arrayNodes 节点集合
	 * @param {Object} pNode	 树结点
	 * @param {String} attChildren 子节点属性字符串
	 * @return {Boolean} 是否删除成功
	 */
	removeNode: function(arrayNodes, pNode, attChildren) {
		var pParentNode = this.getParentNode(arrayNodes, pNode, attChildren);
		attChildren = attChildren == null ? 'children' : attChildren;
		var bRt = true;
		if(pParentNode) {
			bRt = GM.CommonOper.removeItemFromArray(pParentNode[attChildren], pNode);
		} else {
			bRt = GM.CommonOper.removeItemFromArray(arrayNodes, pNode);
		}
		return bRt;
	},
	/**
	 * @description 更新树结点的勾选状态
	 * @method updateNodeChecked
	 * @param {Array} arrayNodes 节点集合
	 * @param {String} attChildren 子节点属性名称
	 * @param {String} attCheck 勾选状态属性名称
	 */
	updateNodeChecked: function(arrayNodes, attChildren, attCheck) {
		if(arrayNodes == null) {
			return;
		}
		attChildren = attChildren == null ? 'children' : attChildren;
		attCheck = attCheck == null ? 'check' : attCheck;
		for(var ii = 0; ii < arrayNodes.length; ii++) {
			var pNode = arrayNodes[ii];
			if(pNode[attChildren]) {
				//先维护子节点的勾选状态
				this.updateNodeChecked(pNode[attChildren], attChildren, attCheck);

				//再依据子节点的选中状态更新自身的选中状态
				var bChecked = null;
				for(var jj = 0; jj < pNode[attChildren].length; jj++) {
					var pChildNode = pNode[attChildren][jj];
					pChildNode[attCheck] = pChildNode[attCheck] == null ? false : pChildNode[attCheck];
					if(bChecked == null) {
						bChecked = pChildNode[attCheck];
					} else if(bChecked !== pChildNode[attCheck]) {
						bChecked = null;
						pNode.checkMix = true;
						break;
					}
				}
				if(bChecked != null) {
					pNode.checkMix = false;
					pNode[attCheck] = bChecked;
				}
			}
		}
	},
	/**
	 * @method setNodesLevel 设置树节点的等级值
	 * @param  {Array} arrayNodes 树节点集合
	 * @param {String} attChildren="children" 子节点属性名称
	 * @param {String} strLevelName="level" 等级属性名称
	 * @param {Number} nLevel=0 设置当前节点等级
	 * @return {Boolean} 是否设置成功
	 */
	setNodesLevel: function(arrayNodes, attChildren, strLevelName, nLevel) {
		strLevelName = strLevelName == null ? 'level' : strLevelName;
		attChildren = attChildren == null ? 'children' : attChildren;
		nLevel = nLevel == null ? 0 : nLevel;
		if(arrayNodes == null) {
			return false;
		}
		for(var ii = 0; ii < arrayNodes.length; ii++) {
			var pNode = arrayNodes[ii];
			pNode[strLevelName] = nLevel;
			var childrenNodes = pNode[attChildren];
			this.setNodesLevel(childrenNodes, attChildren, strLevelName, pNode[strLevelName] + 1);
		}
	}
};

//先简化地址
GM.LayoutOper.simplyURL({
	'GMLOGIN_SERVER_EC': 'clientServerToken',
	'GMSSO_CLIENT_EC': 'clientAppToken'
});