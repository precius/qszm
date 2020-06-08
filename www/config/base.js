var GreatMap = {};
var GM = GreatMap;
GM.global = {};
GM.OA = {};
window.GM = GM;
GM.version = '0.2';
var eventsKey = '_leaflet_events';

/**
 * @static
 * @hide
 * @class GM.Util 基类使用的基础函数API
 */
GM.Util = {
	/**
	 * @description 扩展对象
	 * @method extend
	 * @param {Object} dest 任意对象
	 * @return 扩展后的对象
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
	 * @method invokeEach 给指定对象添加对应的方法
	 * @param {Object} obj 要添加方法的对象
	 * @param {Function} method 要添加的方法
	 * @param {Object} context 上下文
	 * @return {boolean} 是否添加成功，是就返回true
	 */
	invokeEach: function(obj, method, context) {
		var i, args;

		if(typeof obj === 'object') {
			args = Array.prototype.slice.call(arguments, 3);

			for(i in obj) {
				method.apply(context, [i, obj[i]].concat(args));
			}
			return true;
		}

		return false;
	},
	falseFn: function() {
		return false;
	},
	/**
	 * @method splitWords 以空格拼接单词
	 * @param {String} str 要处理的字符串
	 * @return {String}  处理好的字符串
	 */
	splitWords: function(str) {
		return GM.Util.trim(str).split(/\s+/);
	},
	/**
	 * @method trim 去掉字符串首尾的空白字符
	 * @param {String} str 要处理的字符串
	 * @return {String}  处理好的字符串
	 */
	trim: function(str) {
		return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
	},
	/**
	 * @method setOptions 设置对象选项
	 * @param {Object} obj 要设置的对象
	 * @param {Object} options 要设置的对象选项
	 * @return {Object}  设置好的对象选项
	 */
	setOptions: function(obj, options) {
		obj.options = GM.Util.extend({}, obj.options, options);
		return obj.options;
	}
};

/**
 * @description 基类
 * @class GM.Class
 */
GM.Class = function() {

};

/**
 * 基类的扩展方法
 * @static
 * @method extend
 * @param {Object} props 包含需要扩展的成员的对象
 * @return {Object} 扩展后的类
 */
GM.Class.extend = function(props) {
	// extended class with the new prototype
	var NewClass = function() {
		// call the constructor
		if(this.initialize) {
			this.initialize.apply(this, arguments);
		}

		// call all constructor hooks
		if(this._initHooks) {
			this.callInitHooks();
		}
	};

	// instantiate class without calling constructor
	var F = function() {};
	F.prototype = this.prototype;

	var proto = new F();
	proto.constructor = NewClass;

	NewClass.prototype = proto;

	// inherit parent's statics
	for(var i in this) {
		if(this.hasOwnProperty(i) && i !== 'prototype') {
			NewClass[i] = this[i];
		}
	}

	// mix static properties into the class
	if(props.statics) {
		GM.Util.extend(NewClass, props.statics);
		delete props.statics;
	}

	// mix includes into the prototype
	if(props.includes) {
		GM.Util.extend.apply(null, [proto].concat(props.includes));
		delete props.includes;
	}

	// merge options
	if(props.options && proto.options) {
		props.options = GM.Util.extend({}, proto.options, props.options);
	}

	// mix given properties into the prototype
	GM.Util.extend(proto, props);

	proto._initHooks = [];

	var parent = this;
	// jshint camelcase: false
	NewClass.__super__ = parent.prototype;

	// add method for calling all hooks
	proto.callInitHooks = function() {
		if(this._initHooksCalled) {
			return;
		}

		if(parent.prototype.callInitHooks) {
			parent.prototype.callInitHooks.call(this);
		}

		this._initHooksCalled = true;

		for(var i = 0, len = proto._initHooks.length; i < len; i++) {
			proto._initHooks[i].call(this);
		}
	};

	return NewClass;
};

/**
 * @description 扩展类的成员
 * @static
 * @method include
 * @param {Object} props 需要扩展的成员的对象
 */
GM.Class.include = function(props) {
	GM.Util.extend(this.prototype, props);
};

/**
 * @description 扩展选项
 * @static
 * @method mergeOptions
 * @param {Object} options 需要扩展的选项对象
 */
GM.Class.mergeOptions = function(options) {
	GM.Util.extend(this.prototype.options, options);
};

/**
 * 需要添加在类里面的基础函数
 * @class GM.Mixin
 */
GM.Mixin = {};
/**
 * @description 事件的基础操作类
 * @class GM.Mixin.Events
 * @static
 */
GM.Mixin.Events = {
	/**
	 * @description 注册事件
	 * @method addEventListener
	 * @param {String|Array{String}} types 事件名称或事件名称集合
	 * @param {Function} fn 事件对应函数
	 * @param {Object} context 上下文
	 */
	addEventListener: function(types, fn, context) {
		// types can be a map of types/handlers
		if(GM.Util.invokeEach(types, this.addEventListener, this, fn,
				context)) {
			return this;
		}
		var events = this[eventsKey] = this[eventsKey] || {};
		var contextId = context && context !== this && L.stamp(context);
		var i;
		var len;
		var event;
		var type;
		var indexKey;
		var indexLenKey;
		var typeIndex;

		// types can be a string of space-separated words
		types = GM.Util.splitWords(types);

		for(i = 0, len = types.length; i < len; i++) {
			event = {
				action: fn,
				context: context || this
			};
			type = types[i];

			if(contextId) {
				// store listeners of a particular context in a separate
				// hash (if it has an id)
				// gives a major performance boost when removing thousands
				// of map layers

				indexKey = type + '_idx';
				indexLenKey = indexKey + '_len';

				typeIndex = events[indexKey] = events[indexKey] || {};

				if(!typeIndex[contextId]) {
					typeIndex[contextId] = [];

					// keep track of the number of keys in the index to
					// quickly check if it's empty
					events[indexLenKey] = (events[indexLenKey] || 0) + 1;
				}

				typeIndex[contextId].push(event);
			} else {
				events[type] = events[type] || [];
				events[type].push(event);
			}
		}
		return this;
	},
	/**
	 * @description 判断是否有这个事件
	 * @method hasEventListeners
	 * @param {String} type 事件名称
	 * @return {boolean} 是否包含事件
	 */
	hasEventListeners: function(type) {
		var events = this[eventsKey];
		return !!events &&
			((type in events && events[type].length > 0) || (type +
				'_idx' in events && events[type + '_idx_len'] > 0));
	},
	/**
	 * @description 注销事件
	 * @method removeEventListener
	 * @param {String|Array{String}} 事件名称或者事件名称集合
	 * @param {Function} fn 事件触发函数
	 * @param {Object} context 上下文
	 */
	removeEventListener: function(types, fn, context) {
		if(!this[eventsKey]) {
			return this;
		}

		if(!types) {
			return this.clearAllEventListeners();
		}

		if(GM.Util.invokeEach(types, this.removeEventListener, this, fn,
				context)) {
			return this;
		}

		var events = this[eventsKey];
		var contextId = context && context !== this && L.stamp(context);
		var i;
		var len;
		var type;
		var listeners;
		var j;
		var indexKey;
		var indexLenKey;
		var typeIndex;
		var removed;

		types = GM.Util.splitWords(types);

		for(i = 0, len = types.length; i < len; i++) {
			type = types[i];
			indexKey = type + '_idx';
			indexLenKey = indexKey + '_len';

			typeIndex = events[indexKey];

			if(!fn) {
				// clear all listeners for a type if function isn't
				// specified
				delete events[type];
				delete events[indexKey];
				delete events[indexLenKey];
			} else {
				listeners = contextId && typeIndex ? typeIndex[contextId] :
					events[type];

				if(listeners) {
					for(j = listeners.length - 1; j >= 0; j--) {
						if((listeners[j].action === fn) &&
							(!context || (listeners[j].context === context))) {
							removed = listeners.splice(j, 1);
							// set the old action to a no-op, because it is
							// possible
							// that the listener is being iterated over as
							// part of a dispatch
							removed[0].action = GM.Util.falseFn;
						}
					}

					if(context && typeIndex && (listeners.length === 0)) {
						delete typeIndex[contextId];
						events[indexLenKey]--;
					}
				}
			}
		}

		return this;
	},
	/**
	 * @method clearAllEventListeners 清除所有的事件
	 */
	clearAllEventListeners: function() {
		delete this[eventsKey];
		return this;
	},
	/**
	 * @description 触发事件
	 * @method fireEvent
	 * @param {String} type 事件名称
	 * @param {Object} data 传入的参数
	 */
	fireEvent: function(type, data) {
		if(!this.hasEventListeners(type)) {
			return this;
		}
		var event = GM.Util.extend({}, data, {
			type: type,
			target: this
		});

		var events = this[eventsKey];
		var listeners;
		var i;
		var len;
		var typeIndex;
		var contextId;

		if(events[type]) {
			// make sure adding/removing listeners inside other listeners
			// won't cause infinite loop
			listeners = events[type].slice();

			for(i = 0, len = listeners.length; i < len; i++) {
				listeners[i].action.call(listeners[i].context, event);
			}
		}

		// fire event for the context-indexed listeners as well
		typeIndex = events[type + '_idx'];

		for(contextId in typeIndex) {
			listeners = typeIndex[contextId].slice();

			if(listeners) {
				for(i = 0, len = listeners.length; i < len; i++) {
					listeners[i].action.call(listeners[i].context, event);
				}
			}
		}

		return this;
	},
	/**
	 * @description 注册一次性事件
	 * @method addOneTimeEventListener
	 * @param {String|Array{String}} types 事件对应的名称或者名称集合
	 * @param {Function} fn 事件对应的函数
	 * @param {Object} context 上下文
	 */
	addOneTimeEventListener: function(types, fn, context) {
		if(GM.Util.invokeEach(types, this.addOneTimeEventListener, this,
				fn, context)) {
			return this;
		}

		var handler = L.bind(function() {
			this.removeEventListener(types, fn, context)
				.removeEventListener(types, handler, context);
		}, this);

		return this.addEventListener(types, fn, context).addEventListener(
			types, handler, context);
	}
};

GM.Mixin.Events.on = GM.Mixin.Events.addEventListener;
GM.Mixin.Events.off = GM.Mixin.Events.removeEventListener;
GM.Mixin.Events.once = GM.Mixin.Events.addOneTimeEventListener;
GM.Mixin.Events.fire = GM.Mixin.Events.fireEvent;

/**
 * 业务基类
 * @class GM.Object
 */
GM.Object = GM.Class.extend({
	//配置项
	options: {}
});