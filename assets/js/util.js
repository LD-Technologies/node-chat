/* Listener Object 
 * For event registration and unregistration
 */
var listener = (function() {
	function listenerAdd(elm, evt, func) {
		if( elm.addEventListener ) {
			elm.addEventListener(evt, func, false);
		} else if( elm.attachEvent ) {
			elm.attachEvent('on'+evt, func);
		}
	};
	function listenerRemove(elm, evt, func) {
		if( elm.removeEventListener ) {
			elm.removeEventListener(evt, func, false);
		} else if( elm.detachEvent ) {
			elm.detachEvent('on'+evt, func);
		}
	};
	return {
		add: listenerAdd,
		remove: listenerRemove
	}
}());

/* because it's easier to write */
var By = (function() {
	function byId(id) {
		return document.getElementById(id);
	};
	function byTag(tag, context) {
		return (context || document).getElementsByTagName(tag);
	};
	function byClass(klass, context) {
		return (context || document).getElementsByClassName(klass);
	}
	function byName(name) {
		return document.getElementsByName(name);
	};
	function byQuery(query, context) {
		return (context || document).querySelectorAll(query);
	};
	function byQueryOne(query, context) {
		return (context || document).querySelector(query);
	};
	return {
		id: byId,
		tag: byTag,
		'class': byClass,
		name: byName,
		qsa: byQuery,
		qs: byQueryOne
	}
}());
/* Little XHR
 * by: rlemon        http://github.com/rlemon/
 * see README for useage.
 * */
var xhr = {
	xmlhttp: (function() {
		var xmlhttp;
		try {
			xmlhttp = new XMLHttpRequest();
		} catch (e) {
			try {
				xmlhttp = new ActiveXObject('Msxml2.XMLHTTP');
			} catch (er) {
				try {
					xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
				} catch (err) {
					xmlhttp = false;
				}
			}
		}
		return xmlhttp;
	}()),
	 /* https://github.com/Titani/SO-ChatBot/blob/ccf6cfe827aee2af7b2832e48720a8e24a8feeed/source/bot.js#L110 */
	urlstringify: (function() {
		var simplies = {
			'number': true,
			'string': true,
			'boolean': true
		};
		var singularStringify = function(thing) {
			if (typeof thing in simplies) {
				return encodeURIComponent(thing.toString());
			}
			return '';
		};
		var arrayStringify = function(array, keyName) {
			keyName = singularStringify(keyName);
			return array.map(function(thing) {
				return keyName + '=' + singularStringify(thing);
			});
		};
		return function(obj) {
			return Object.keys(obj).map(function(key) {
				var val = obj[key];
				if (Array.isArray(val)) {
					return arrayStringify(val, key);
				} else {
					return singularStringify(key) + '=' + singularStringify(val);
				}
			}).join('&');
		};
	}()),
	post: function(options) {
		this.request.apply(this, ['POST', options]);
	},
	get: function(options) {
		this.request.apply(this, ['GET', options]);
	},
	request: function(type, options) {
		if (this.xmlhttp && options && 'url' in options) {
			var xhr = this.xmlhttp,
				enctype = ('enctype' in options) ? options.enctype : 'application/x-www-form-urlencoded';
			xhr.open(type, options.url, true);
			xhr.setRequestHeader('Content-Type', enctype);
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					if (xhr.status == 200) {
						if ('success' in options && options.success.apply) {
							options.success.apply(this, [xhr]);
						}
					} else if (xhr.status && xhr.status != 200) {
						if ('failure' in options && options.failure.apply) {
							options.failure.apply(this, [xhr]);
						}
					}
				}
			};
			var data = null;
			if ('data' in options) {
				data = this.urlstringify.apply(this, [options.data]);
			}
			xhr.send(data);
		}
	}
};
