/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(480);
	__webpack_require__(482);
	var ipc = __webpack_require__(304).ipcRenderer;
	var remote = __webpack_require__(304).remote;
	var hostname = localStorage.getItem('hostname');
	document.getElementById('textcon').value = hostname;
	document.getElementById('save').addEventListener('click', function () {
	    var addr = document.getElementById('textcon').value;
	    localStorage.setItem('hostname', addr);
	    ipc.send('update-hostname');
	    remote.getCurrentWindow().close();
	});
	document.getElementById('cancel').addEventListener('click', function () {
	    remote.getCurrentWindow().close();
	});
	document.getElementById('update').addEventListener('click', function () {
	    ipc.send('asynchronous-update', hostname);
	});

/***/ }),

/***/ 304:
/***/ (function(module, exports) {

	module.exports = require("electron");

/***/ }),

/***/ 436:
/***/ (function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ }),

/***/ 437:
/***/ (function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }),

/***/ 480:
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(481);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(437)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../../node_modules/._css-loader@0.23.1@css-loader/index.js!./ui.css", function() {
				var newContent = require("!!../../../node_modules/._css-loader@0.23.1@css-loader/index.js!./ui.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),

/***/ 481:
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(436)();
	// imports
	
	
	// module
	exports.push([module.id, "/*\r\n  Simple Grid\r\n  Project Page - http://thisisdallas.github.com/Simple-Grid/\r\n  Author - Dallas Bass\r\n  Site - http://dallasbass.com\r\n*/\r\n\r\n\r\n[class*='grid'],\r\n[class*='col-'],\r\n[class*='mobile-'],\r\n.grid:after {\r\n\t-webkit-box-sizing: border-box;\r\n\t-moz-box-sizing: border-box;\r\n\tbox-sizing: border-box;\t\r\n}\r\n\r\n[class*='col-'] {\r\n\tfloat: left;\r\n  \tmin-height: 1px;\r\n\tpadding-right: 20px; /* column-space */\r\n}\r\n\r\n[class*='col-'] [class*='col-']:last-child {\r\n\tpadding-right: 0;\r\n}\r\n\r\n.grid {\r\n\twidth: 100%;\r\n\tmax-width: 1140px;\r\n\tmin-width: 748px; /* when using padded grid on ipad in portrait mode, width should be viewport-width - padding = (768 - 20) = 748. actually, it should be even smaller to allow for padding of grid containing element */\r\n\tmargin: 0 auto;\r\n\toverflow: hidden;\r\n}\r\n\r\n.grid:after {\r\n\tcontent: \"\";\r\n\tdisplay: table;\r\n\tclear: both;\r\n}\r\n\r\n.grid-pad {\r\n\tpadding-top: 20px;\r\n\tpadding-left: 20px; /* grid-space to left */\r\n\tpadding-right: 0; /* grid-space to right: (grid-space-left - column-space) e.g. 20px-20px=0 */\r\n}\r\n\r\n.push-right {\r\n\tfloat: right;\r\n}\r\n\r\n/* Content Columns */\r\n\r\n.col-1-1 {\r\n\twidth: 100%;\r\n}\r\n.col-2-3, .col-8-12 {\r\n\twidth: 66.66%;\r\n}\r\n\r\n.col-1-2, .col-6-12 {\r\n\twidth: 50%;\r\n}\r\n\r\n.col-1-3, .col-4-12 {\r\n\twidth: 33.33%;\r\n}\r\n\r\n.col-1-4, .col-3-12 {\r\n\twidth: 25%;\r\n}\r\n\r\n.col-1-5 {\r\n\twidth: 20%;\r\n}\r\n\r\n.col-1-6, .col-2-12 {\r\n\twidth: 16.667%;\r\n}\r\n\r\n.col-1-7 {\r\n\twidth: 14.28%;\r\n}\r\n\r\n.col-1-8 {\r\n\twidth: 12.5%;\r\n}\r\n\r\n.col-1-9 {\r\n\twidth: 11.1%;\r\n}\r\n\r\n.col-1-10 {\r\n\twidth: 10%;\r\n}\r\n\r\n.col-1-11 {\r\n\twidth: 9.09%;\r\n}\r\n\r\n.col-1-12 {\r\n\twidth: 8.33%\r\n}\r\n\r\n/* Layout Columns */\r\n\r\n.col-11-12 {\r\n\twidth: 91.66%\r\n}\r\n\r\n.col-10-12 {\r\n\twidth: 83.333%;\r\n}\r\n\r\n.col-9-12 {\r\n\twidth: 75%;\r\n}\r\n\r\n.col-5-12 {\r\n\twidth: 41.66%;\r\n}\r\n\r\n.col-7-12 {\r\n\twidth: 58.33%\r\n}\r\n\r\n/* Pushing blocks */\r\n\r\n.push-2-3, .push-8-12 {\r\n\tmargin-left: 66.66%;\r\n}\r\n\r\n.push-1-2, .push-6-12 {\r\n\tmargin-left: 50%;\r\n}\r\n\r\n.push-1-3, .push-4-12 {\r\n\tmargin-left: 33.33%;\r\n}\r\n\r\n.push-1-4, .push-3-12 {\r\n\tmargin-left: 25%;\r\n}\r\n\r\n.push-1-5 {\r\n\tmargin-left: 20%;\r\n}\r\n\r\n.push-1-6, .push-2-12 {\r\n\tmargin-left: 16.667%;\r\n}\r\n\r\n.push-1-7 {\r\n\tmargin-left: 14.28%;\r\n}\r\n\r\n.push-1-8 {\r\n\tmargin-left: 12.5%;\r\n}\r\n\r\n.push-1-9 {\r\n\tmargin-left: 11.1%;\r\n}\r\n\r\n.push-1-10 {\r\n\tmargin-left: 10%;\r\n}\r\n\r\n.push-1-11 {\r\n\tmargin-left: 9.09%;\r\n}\r\n\r\n.push-1-12 {\r\n\tmargin-left: 8.33%\r\n}\r\n\r\n@media handheld, only screen and (max-width: 767px) {\r\n\t.grid {\r\n\t\twidth: 100%;\r\n\t\tmin-width: 0;\r\n\t\tmargin-left: 0;\r\n\t\tmargin-right: 0;\r\n\t\tpadding-left: 20px; /* grid-space to left */\r\n\t\tpadding-right: 10px; /* grid-space to right: (grid-space-left - column-space) e.g. 20px-10px=10px */\r\n\t}\r\n\r\n\t[class*='col-'] {\r\n\t\twidth: auto;\r\n\t\tfloat: none;\r\n\t\tmargin: 10px 0;\r\n\t\tpadding-left: 0;\r\n\t\tpadding-right: 10px; /* column-space */\r\n\t}\r\n\r\n\t[class*='col-'] [class*='col-'] {\r\n\t\tpadding-right: 0;\r\n\t}\r\n\r\n\t/* Mobile Layout */\r\n\r\n\t[class*='mobile-col-'] {\r\n\t\tfloat: left;\r\n\t\tmargin: 0 0 10px;\r\n\t\tpadding-left: 0;\r\n\t\tpadding-right: 10px; /* column-space */\r\n\t\tpadding-bottom: 0;\r\n\t}\r\n\r\n\t.mobile-col-1-1 {\r\n\t\twidth: 100%;\r\n\t}\r\n\t.mobile-col-2-3, .mobile-col-8-12 {\r\n\t\twidth: 66.66%;\r\n\t}\r\n\r\n\t.mobile-col-1-2, .mobile-col-6-12 {\r\n\t\twidth: 50%;\r\n\t}\r\n\r\n\t.mobile-col-1-3, .mobile-col-4-12 {\r\n\t\twidth: 33.33%;\r\n\t}\r\n\r\n\t.mobile-col-1-4, .mobile-col-3-12 {\r\n\t\twidth: 25%;\r\n\t}\r\n\r\n\t.mobile-col-1-5 {\r\n\t\twidth: 20%;\r\n\t}\r\n\r\n\t.mobile-col-1-6, .mobile-col-2-12 {\r\n\t\twidth: 16.667%;\r\n\t}\r\n\r\n\t.mobile-col-1-7 {\r\n\t\twidth: 14.28%;\r\n\t}\r\n\r\n\t.mobile-col-1-8 {\r\n\t\twidth: 12.5%;\r\n\t}\r\n\r\n\t.mobile-col-1-9 {\r\n\t\twidth: 11.1%;\r\n\t}\r\n\r\n\t.mobile-col-1-10 {\r\n\t\twidth: 10%;\r\n\t}\r\n\r\n\t.mobile-col-1-11 {\r\n\t\twidth: 9.09%;\r\n\t}\r\n\r\n\t.mobile-col-1-12 {\r\n\t\twidth: 8.33%\r\n\t}\r\n\r\n\t/* Layout Columns */\r\n\r\n\t.mobile-col-11-12 {\r\n\t\twidth: 91.66%\r\n\t}\r\n\r\n\t.mobile-col-10-12 {\r\n\t\twidth: 83.333%;\r\n\t}\r\n\r\n\t.mobile-col-9-12 {\r\n\t\twidth: 75%;\r\n\t}\r\n\r\n\t.mobile-col-5-12 {\r\n\t\twidth: 41.66%;\r\n\t}\r\n\r\n\t.mobile-col-7-12 {\r\n\t\twidth: 58.33%\r\n\t}\r\n\r\n\t.hide-on-mobile {\r\n\t\tdisplay: none !important;\r\n\t\twidth: 0;\r\n\t\theight: 0;\r\n\t}\r\n}\r\n\r\n/*my custom css*/\r\n*{\r\n\t-webkit-user-select: text;\r\n}\r\n.form-control, label {\r\n    font-size: 12px;\r\n}\r\n.home{\r\n\tbackground-repeat: no-repeat;\r\n\tbackground-position: right bottom;\r\n\tbackground-size:240px 150px;\r\n}\r\n.react-datepicker__input-container{\r\n\tborder: none;\r\n\twidth: 100%;\r\n    min-height: 25px;\r\n    line-height: 1.6;\r\n    outline: 0;\r\n\tfont-size: 12px;\r\n}\r\n.react-datepicker__input-container input{\r\n\twidth: 100%;\r\n    min-height: 25px;\r\n    line-height: 1.6;\r\n    background-color: #fff;\r\n    border: 1px solid #ddd;\r\n    border-radius: 4px;\r\n    outline: 0;\r\n\tfont-size: 12px;\r\n\tpadding: 5px 10px;\r\n}\r\n.react-datepicker__input-container input:focus{\r\n\tborder-color: #6db3fd;\r\n    box-shadow: 3px 3px 0 #6db3fd, -3px -3px 0 #6db3fd, -3px 3px 0 #6db3fd, 3px -3px 0 #6db3fd;\r\n}\r\n\r\nselect{\r\n\t/* -webkit-appearance: none; */\r\n\tborder: none;\r\n\tbackground: transparent;\r\n\tmargin: 0 0 0 5px;\r\n}\r\nselect:focus{\r\n\tbackground: transparent;\r\n\tborder: none;\r\n\toutline: none;\r\n}\r\n\r\n@keyframes rotate{\r\n  from{\r\n    transform: rotateZ(360deg);\r\n  }\r\n  to{\r\n    transform: rotateZ(0deg);\r\n  }\r\n}", ""]);
	
	// exports


/***/ }),

/***/ 482:
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(483);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(437)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../../node_modules/._css-loader@0.23.1@css-loader/index.js!./photon.css", function() {
				var newContent = require("!!../../../node_modules/._css-loader@0.23.1@css-loader/index.js!./photon.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),

/***/ 483:
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(436)();
	// imports
	
	
	// module
	exports.push([module.id, "/*!\r\n * =====================================================\r\n * Photon v0.1.2\r\n * Copyright 2016 Connor Sears\r\n * Licensed under MIT (https://github.com/connors/proton/blob/master/LICENSE)\r\n *\r\n * v0.1.2 designed by @connors.\r\n * =====================================================\r\n */\r\n\r\n @charset \"UTF-8\";\r\n audio,\r\n canvas,\r\n progress,\r\n video {\r\n   vertical-align: baseline;\r\n }\r\n \r\n audio:not([controls]) {\r\n   display: none;\r\n }\r\n \r\n a:active,\r\n a:hover {\r\n   outline: 0;\r\n }\r\n \r\n abbr[title] {\r\n   border-bottom: 1px dotted;\r\n }\r\n \r\n b,\r\n strong {\r\n   font-weight: bold;\r\n }\r\n \r\n dfn {\r\n   font-style: italic;\r\n }\r\n \r\n h1 {\r\n   font-size: 2em;\r\n   margin: 0.67em 0;\r\n }\r\n \r\n small {\r\n   font-size: 80%;\r\n }\r\n \r\n sub,\r\n sup {\r\n   font-size: 75%;\r\n   line-height: 0;\r\n   position: relative;\r\n   vertical-align: baseline;\r\n }\r\n \r\n sup {\r\n   top: -0.5em;\r\n }\r\n \r\n sub {\r\n   bottom: -0.25em;\r\n }\r\n \r\n pre {\r\n   overflow: auto;\r\n }\r\n \r\n code,\r\n kbd,\r\n pre,\r\n samp {\r\n   font-family: monospace, monospace;\r\n   font-size: 1em;\r\n }\r\n \r\n button,\r\n input,\r\n optgroup,\r\n select,\r\n textarea {\r\n   color: inherit;\r\n   font: inherit;\r\n   margin: 0;\r\n }\r\n \r\n input[type=\"number\"]::-webkit-inner-spin-button,\r\n input[type=\"number\"]::-webkit-outer-spin-button {\r\n   height: auto;\r\n }\r\n \r\n input[type=\"search\"] {\r\n   -webkit-appearance: textfield;\r\n   box-sizing: content-box;\r\n }\r\n \r\n input[type=\"search\"]::-webkit-search-cancel-button,\r\n input[type=\"search\"]::-webkit-search-decoration {\r\n   -webkit-appearance: none;\r\n }\r\n \r\n fieldset {\r\n   border: 1px solid #c0c0c0;\r\n   margin: 0 2px;\r\n   padding: 0.35em 0.625em 0.75em;\r\n }\r\n \r\n legend {\r\n   border: 0;\r\n   padding: 0;\r\n }\r\n \r\n table {\r\n   border-collapse: collapse;\r\n   border-spacing: 0;\r\n }\r\n \r\n td,\r\n th {\r\n   padding: 0;\r\n }\r\n \r\n * {\r\n   cursor: default;\r\n   -webkit-user-select: none;\r\n }\r\n \r\n input,\r\n textarea {\r\n   -webkit-user-select: text;\r\n }\r\n \r\n form,\r\n input,\r\n optgroup,\r\n select,\r\n textarea {\r\n   -webkit-user-select: text;\r\n   -webkit-app-region: no-drag;\r\n }\r\n \r\n * {\r\n   -webkit-box-sizing: border-box;\r\n   box-sizing: border-box;\r\n }\r\n \r\n html {\r\n   height: 100%;\r\n   width: 100%;\r\n   overflow: hidden;\r\n }\r\n \r\n body {\r\n   height: 100%;\r\n   padding: 0;\r\n   margin: 0;\r\n   font-family: system, -apple-system, \".SFNSDisplay-Regular\", \"Helvetica Neue\", Helvetica, \"Segoe UI\", sans-serif;\r\n   font-size: 13px;\r\n   line-height: 1.6;\r\n   color: #333;\r\n   background-color: transparent;\r\n }\r\n \r\n hr {\r\n   margin: 15px 0;\r\n   overflow: hidden;\r\n   background: transparent;\r\n   border: 0;\r\n   border-bottom: 1px solid #ddd;\r\n }\r\n \r\n h1, h2, h3, h4, h5, h6 {\r\n   margin-top: 20px;\r\n   margin-bottom: 10px;\r\n   font-weight: 500;\r\n   white-space: nowrap;\r\n   overflow: hidden;\r\n   text-overflow: ellipsis;\r\n }\r\n \r\n h1 {\r\n   font-size: 36px;\r\n }\r\n \r\n h2 {\r\n   font-size: 30px;\r\n }\r\n \r\n h3 {\r\n   font-size: 24px;\r\n }\r\n \r\n h4 {\r\n   font-size: 18px;\r\n }\r\n \r\n h5 {\r\n   font-size: 14px;\r\n }\r\n \r\n h6 {\r\n   font-size: 12px;\r\n }\r\n \r\n .window {\r\n   position: absolute;\r\n   top: 0;\r\n   right: 0;\r\n   bottom: 0;\r\n   left: 0;\r\n   display: flex;\r\n   flex-direction: column;\r\n   background-color: #fff;\r\n }\r\n \r\n .window-content {\r\n   position: relative;\r\n   overflow-y: auto;\r\n   display: flex;\r\n   flex: 1;\r\n }\r\n \r\n .selectable-text {\r\n   cursor: text;\r\n   -webkit-user-select: text;\r\n }\r\n \r\n .text-center {\r\n   text-align: center;\r\n }\r\n \r\n .text-right {\r\n   text-align: right;\r\n }\r\n \r\n .text-left {\r\n   text-align: left;\r\n }\r\n \r\n .pull-left {\r\n   float: left;\r\n }\r\n \r\n .pull-right {\r\n   float: right;\r\n }\r\n \r\n .padded {\r\n   padding: 10px;\r\n }\r\n \r\n .padded-less {\r\n   padding: 5px;\r\n }\r\n \r\n .padded-more {\r\n   padding: 20px;\r\n }\r\n \r\n .padded-vertically {\r\n   padding-top: 10px;\r\n   padding-bottom: 10px;\r\n }\r\n \r\n .padded-vertically-less {\r\n   padding-top: 5px;\r\n   padding-bottom: 5px;\r\n }\r\n \r\n .padded-vertically-more {\r\n   padding-top: 20px;\r\n   padding-bottom: 20px;\r\n }\r\n \r\n .padded-horizontally {\r\n   padding-right: 10px;\r\n   padding-left: 10px;\r\n }\r\n \r\n .padded-horizontally-less {\r\n   padding-right: 5px;\r\n   padding-left: 5px;\r\n }\r\n \r\n .padded-horizontally-more {\r\n   padding-right: 20px;\r\n   padding-left: 20px;\r\n }\r\n \r\n .padded-top {\r\n   padding-top: 10px;\r\n }\r\n \r\n .padded-top-less {\r\n   padding-top: 5px;\r\n }\r\n \r\n .padded-top-more {\r\n   padding-top: 20px;\r\n }\r\n \r\n .padded-bottom {\r\n   padding-bottom: 10px;\r\n }\r\n \r\n .padded-bottom-less {\r\n   padding-bottom: 5px;\r\n }\r\n \r\n .padded-bottom-more {\r\n   padding-bottom: 20px;\r\n }\r\n \r\n .sidebar {\r\n   background-color: #f5f5f4;\r\n }\r\n \r\n .draggable {\r\n   -webkit-app-region: drag;\r\n }\r\n \r\n .not-draggable {\r\n   -webkit-app-region: no-drag;\r\n }\r\n \r\n .clearfix:before, .clearfix:after {\r\n   display: table;\r\n   content: \" \";\r\n }\r\n .clearfix:after {\r\n   clear: both;\r\n }\r\n \r\n .btn {\r\n   display: inline-block;\r\n   padding: 3px 8px;\r\n   margin-bottom: 0;\r\n   font-size: 12px;\r\n   line-height: 1.4;\r\n   text-align: center;\r\n   white-space: nowrap;\r\n   vertical-align: middle;\r\n   cursor: default;\r\n   background-image: none;\r\n   border: 1px solid transparent;\r\n   border-radius: 4px;\r\n   box-shadow: 0 1px 1px rgba(0, 0, 0, 0.06);\r\n   -webkit-app-region: no-drag;\r\n }\r\n .btn:focus {\r\n   outline: none;\r\n   box-shadow: none;\r\n }\r\n \r\n .btn-mini {\r\n   padding: 2px 6px;\r\n }\r\n \r\n .btn-large {\r\n   padding: 6px 12px;\r\n }\r\n \r\n .btn-form {\r\n   padding-right: 20px;\r\n   padding-left: 20px;\r\n }\r\n \r\n .btn-default {\r\n   color: #333;\r\n   border-top-color: #c2c0c2;\r\n   border-right-color: #c2c0c2;\r\n   border-bottom-color: #a19fa1;\r\n   border-left-color: #c2c0c2;\r\n   background-color: #fcfcfc;\r\n   background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #fcfcfc), color-stop(100%, #f1f1f1));\r\n   background-image: -webkit-linear-gradient(top, #fcfcfc 0%, #f1f1f1 100%);\r\n   background-image: linear-gradient(to bottom, #fcfcfc 0%, #f1f1f1 100%);\r\n }\r\n .btn-default:active {\r\n   background-color: #ddd;\r\n   background-image: none;\r\n }\r\n \r\n .btn-primary,\r\n .btn-positive,\r\n .btn-negative,\r\n .btn-warning {\r\n   color: #fff;\r\n   text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);\r\n }\r\n \r\n .btn-primary {\r\n   border-color: #388df8;\r\n   border-bottom-color: #0866dc;\r\n   background-color: #6eb4f7;\r\n   background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #6eb4f7), color-stop(100%, #1a82fb));\r\n   background-image: -webkit-linear-gradient(top, #6eb4f7 0%, #1a82fb 100%);\r\n   background-image: linear-gradient(to bottom, #6eb4f7 0%, #1a82fb 100%);\r\n }\r\n .btn-primary:active {\r\n   background-color: #3e9bf4;\r\n   background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #3e9bf4), color-stop(100%, #0469de));\r\n   background-image: -webkit-linear-gradient(top, #3e9bf4 0%, #0469de 100%);\r\n   background-image: linear-gradient(to bottom, #3e9bf4 0%, #0469de 100%);\r\n }\r\n \r\n .btn-positive {\r\n   border-color: #29a03b;\r\n   border-bottom-color: #248b34;\r\n   background-color: #5bd46d;\r\n   background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #5bd46d), color-stop(100%, #29a03b));\r\n   background-image: -webkit-linear-gradient(top, #5bd46d 0%, #29a03b 100%);\r\n   background-image: linear-gradient(to bottom, #5bd46d 0%, #29a03b 100%);\r\n }\r\n .btn-positive:active {\r\n   background-color: #34c84a;\r\n   background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #34c84a), color-stop(100%, #248b34));\r\n   background-image: -webkit-linear-gradient(top, #34c84a 0%, #248b34 100%);\r\n   background-image: linear-gradient(to bottom, #34c84a 0%, #248b34 100%);\r\n }\r\n \r\n .btn-negative {\r\n   border-color: #fb2f29;\r\n   border-bottom-color: #fb1710;\r\n   background-color: #fd918d;\r\n   background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #fd918d), color-stop(100%, #fb2f29));\r\n   background-image: -webkit-linear-gradient(top, #fd918d 0%, #fb2f29 100%);\r\n   background-image: linear-gradient(to bottom, #fd918d 0%, #fb2f29 100%);\r\n }\r\n .btn-negative:active {\r\n   background-color: #fc605b;\r\n   background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #fc605b), color-stop(100%, #fb1710));\r\n   background-image: -webkit-linear-gradient(top, #fc605b 0%, #fb1710 100%);\r\n   background-image: linear-gradient(to bottom, #fc605b 0%, #fb1710 100%);\r\n }\r\n \r\n .btn-warning {\r\n   border-color: #fcaa0e;\r\n   border-bottom-color: #ee9d02;\r\n   background-color: #fece72;\r\n   background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #fece72), color-stop(100%, #fcaa0e));\r\n   background-image: -webkit-linear-gradient(top, #fece72 0%, #fcaa0e 100%);\r\n   background-image: linear-gradient(to bottom, #fece72 0%, #fcaa0e 100%);\r\n }\r\n .btn-warning:active {\r\n   background-color: #fdbc40;\r\n   background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #fdbc40), color-stop(100%, #ee9d02));\r\n   background-image: -webkit-linear-gradient(top, #fdbc40 0%, #ee9d02 100%);\r\n   background-image: linear-gradient(to bottom, #fdbc40 0%, #ee9d02 100%);\r\n }\r\n \r\n .btn .icon {\r\n   float: left;\r\n   width: 14px;\r\n   height: 14px;\r\n   margin-top: 1px;\r\n   margin-bottom: 1px;\r\n   color: #737475;\r\n   font-size: 14px;\r\n   line-height: 1;\r\n }\r\n \r\n .btn .icon-text {\r\n   margin-right: 5px;\r\n }\r\n \r\n .btn-dropdown:after {\r\n   font-family: \"photon-entypo\";\r\n   margin-left: 5px;\r\n   content: '\\E873';\r\n }\r\n \r\n .btn-group {\r\n   position: relative;\r\n   display: inline-block;\r\n   vertical-align: middle;\r\n   -webkit-app-region: no-drag;\r\n }\r\n .btn-group .btn {\r\n   position: relative;\r\n   float: left;\r\n }\r\n .btn-group .btn:focus, .btn-group .btn:active {\r\n   z-index: 2;\r\n }\r\n .btn-group .btn.active {\r\n   z-index: 3;\r\n }\r\n \r\n .btn-group .btn + .btn,\r\n .btn-group .btn + .btn-group,\r\n .btn-group .btn-group + .btn,\r\n .btn-group .btn-group + .btn-group {\r\n   margin-left: -1px;\r\n }\r\n .btn-group > .btn:first-child {\r\n   border-top-right-radius: 0;\r\n   border-bottom-right-radius: 0;\r\n }\r\n .btn-group > .btn:last-child {\r\n   border-top-left-radius: 0;\r\n   border-bottom-left-radius: 0;\r\n }\r\n .btn-group > .btn:not(:first-child):not(:last-child) {\r\n   border-radius: 0;\r\n }\r\n .btn-group .btn + .btn {\r\n   border-left: 1px solid #c2c0c2;\r\n }\r\n .btn-group .btn + .btn.active {\r\n   border-left: 0;\r\n }\r\n .btn-group .active {\r\n   color: #fff;\r\n   border: 1px solid transparent;\r\n   background-color: #6d6c6d;\r\n   background-image: none;\r\n }\r\n .btn-group .active .icon {\r\n   color: #fff;\r\n }\r\n \r\n .toolbar {\r\n   min-height: 22px;\r\n   box-shadow: inset 0 1px 0 #f5f4f5;\r\n   background-color: #e8e6e8;\r\n   background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #e8e6e8), color-stop(100%, #d1cfd1));\r\n   background-image: -webkit-linear-gradient(top, #e8e6e8 0%, #d1cfd1 100%);\r\n   background-image: linear-gradient(to bottom, #e8e6e8 0%, #d1cfd1 100%);\r\n }\r\n .toolbar:before, .toolbar:after {\r\n   display: table;\r\n   content: \" \";\r\n }\r\n .toolbar:after {\r\n   clear: both;\r\n }\r\n \r\n .toolbar-header {\r\n   border-bottom: 1px solid #c2c0c2;\r\n }\r\n .toolbar-header .title {\r\n   margin-top: 1px;\r\n }\r\n \r\n .toolbar-footer {\r\n   border-top: 1px solid #c2c0c2;\r\n   -webkit-app-region: drag;\r\n }\r\n \r\n .title {\r\n   margin: 0;\r\n   font-size: 12px;\r\n   font-weight: 400;\r\n   text-align: center;\r\n   color: #555;\r\n   cursor: default;\r\n }\r\n \r\n .toolbar-borderless {\r\n   border-top: 0;\r\n   border-bottom: 0;\r\n }\r\n \r\n .toolbar-actions {\r\n   margin-top: 4px;\r\n   margin-bottom: 3px;\r\n   padding-right: 3px;\r\n   padding-left: 3px;\r\n   padding-bottom: 3px;\r\n   -webkit-app-region: drag;\r\n }\r\n .toolbar-actions:before, .toolbar-actions:after {\r\n   display: table;\r\n   content: \" \";\r\n }\r\n .toolbar-actions:after {\r\n   clear: both;\r\n }\r\n .toolbar-actions > .btn,\r\n .toolbar-actions > .btn-group {\r\n   margin-left: 4px;\r\n   margin-right: 4px;\r\n }\r\n \r\n label {\r\n   display: inline-block;\r\n   font-size: 13px;\r\n   margin-bottom: 5px;\r\n   white-space: nowrap;\r\n   overflow: hidden;\r\n   text-overflow: ellipsis;\r\n }\r\n \r\n input[type=\"search\"] {\r\n   box-sizing: border-box;\r\n }\r\n \r\n input[type=\"radio\"],\r\n input[type=\"checkbox\"] {\r\n   margin: 4px 0 0;\r\n   line-height: normal;\r\n }\r\n \r\n .form-control {\r\n   display: inline-block;\r\n   width: 100%;\r\n   min-height: 25px;\r\n   padding: 5px 10px;\r\n   font-size: 13px;\r\n   line-height: 1.6;\r\n   background-color: #fff;\r\n   border: 1px solid #ddd;\r\n   border-radius: 4px;\r\n   outline: none;\r\n }\r\n .form-control:focus {\r\n   border-color: #6db3fd;\r\n   box-shadow: 0 0 0 3px #6db3fd;\r\n }\r\n \r\n textarea {\r\n   height: auto;\r\n }\r\n \r\n .form-group {\r\n   margin-bottom: 10px;\r\n }\r\n \r\n .radio,\r\n .checkbox {\r\n   position: relative;\r\n   display: block;\r\n   margin-top: 10px;\r\n   margin-bottom: 10px;\r\n }\r\n .radio label,\r\n .checkbox label {\r\n   padding-left: 20px;\r\n   margin-bottom: 0;\r\n   font-weight: normal;\r\n }\r\n \r\n .radio input[type=\"radio\"],\r\n .radio-inline input[type=\"radio\"],\r\n .checkbox input[type=\"checkbox\"],\r\n .checkbox-inline input[type=\"checkbox\"] {\r\n   position: absolute;\r\n   margin-left: -20px;\r\n   margin-top: 4px;\r\n }\r\n \r\n .form-actions .btn {\r\n   margin-right: 10px;\r\n }\r\n .form-actions .btn:last-child {\r\n   margin-right: 0;\r\n }\r\n \r\n .pane-group {\r\n   position: absolute;\r\n   top: 0;\r\n   right: 0;\r\n   bottom: 0;\r\n   left: 0;\r\n   display: flex;\r\n }\r\n \r\n .pane {\r\n   position: relative;\r\n   overflow-y: auto;\r\n   flex: 1;\r\n   border-left: 1px solid #ddd;\r\n }\r\n .pane:first-child {\r\n   border-left: 0;\r\n }\r\n \r\n .pane-sm {\r\n   max-width: 220px;\r\n   min-width: 150px;\r\n }\r\n \r\n .pane-mini {\r\n   width: 80px;\r\n   flex: none;\r\n }\r\n \r\n .pane-one-fourth {\r\n   width: 25%;\r\n   flex: none;\r\n }\r\n \r\n .pane-one-third {\r\n   width: 33.3%;\r\n   flex: none;\r\n }\r\n \r\n img {\r\n   -webkit-user-drag: text;\r\n }\r\n \r\n .img-circle {\r\n   border-radius: 50%;\r\n }\r\n \r\n .img-rounded {\r\n   border-radius: 4px;\r\n }\r\n \r\n .list-group {\r\n   width: 100%;\r\n   list-style: none;\r\n   margin: 0;\r\n   padding: 0;\r\n }\r\n .list-group * {\r\n   margin: 0;\r\n   white-space: nowrap;\r\n   overflow: hidden;\r\n   text-overflow: ellipsis;\r\n }\r\n \r\n .list-group-item {\r\n   padding: 10px;\r\n   font-size: 12px;\r\n   color: #414142;\r\n   border-top: 1px solid #ddd;\r\n }\r\n .list-group-item:first-child {\r\n   border-top: 0;\r\n }\r\n .list-group-item.active, .list-group-item.selected {\r\n   color: #fff;\r\n   background-color: #116cd6;\r\n }\r\n \r\n .list-group-header {\r\n   padding: 10px;\r\n }\r\n \r\n .media-object {\r\n   margin-top: 3px;\r\n }\r\n \r\n .media-object.pull-left {\r\n   margin-right: 10px;\r\n }\r\n \r\n .media-object.pull-right {\r\n   margin-left: 10px;\r\n }\r\n \r\n .media-body {\r\n   overflow: hidden;\r\n }\r\n \r\n .nav-group {\r\n   font-size: 14px;\r\n }\r\n \r\n .nav-group-item {\r\n   padding: 2px 10px 2px 25px;\r\n   display: block;\r\n   color: #333;\r\n   text-decoration: none;\r\n   white-space: nowrap;\r\n   overflow: hidden;\r\n   text-overflow: ellipsis;\r\n }\r\n .nav-group-item:active, .nav-group-item.active {\r\n   background-color: #dcdfe1;\r\n }\r\n .nav-group-item .icon {\r\n   width: 19px;\r\n   height: 18px;\r\n   float: left;\r\n   color: #737475;\r\n   margin-top: -3px;\r\n   margin-right: 7px;\r\n   font-size: 18px;\r\n   text-align: center;\r\n }\r\n \r\n .nav-group-title {\r\n   margin: 0;\r\n   padding: 10px 10px 2px;\r\n   font-size: 12px;\r\n   font-weight: 500;\r\n   color: #666666;\r\n }\r\n \r\n /* @font-face {\r\n   font-family: \"photon-entypo\";\r\n   src: url(\"../fonts/photon-entypo.eot\");\r\n   src: url(\"../fonts/photon-entypo.eot?#iefix\") format(\"eot\"), url(\"../fonts/photon-entypo.woff\") format(\"woff\"), url(\"../fonts/photon-entypo.ttf\") format(\"truetype\");\r\n   font-weight: normal;\r\n   font-style: normal;\r\n } */\r\n .icon:before {\r\n   position: relative;\r\n   display: inline-block;\r\n   font-family: \"photon-entypo\";\r\n   speak: none;\r\n   font-size: 100%;\r\n   font-style: normal;\r\n   font-weight: normal;\r\n   font-variant: normal;\r\n   text-transform: none;\r\n   line-height: 1;\r\n   -webkit-font-smoothing: antialiased;\r\n   -moz-osx-font-smoothing: grayscale;\r\n }\r\n \r\n .icon-note:before {\r\n   content: '\\E800';\r\n }\r\n \r\n /* '' */\r\n .icon-note-beamed:before {\r\n   content: '\\E801';\r\n }\r\n \r\n /* '' */\r\n .icon-music:before {\r\n   content: '\\E802';\r\n }\r\n \r\n /* '' */\r\n .icon-search:before {\r\n   content: '\\E803';\r\n }\r\n \r\n /* '' */\r\n .icon-flashlight:before {\r\n   content: '\\E804';\r\n }\r\n \r\n /* '' */\r\n .icon-mail:before {\r\n   content: '\\E805';\r\n }\r\n \r\n /* '' */\r\n .icon-heart:before {\r\n   content: '\\E806';\r\n }\r\n \r\n /* '' */\r\n .icon-heart-empty:before {\r\n   content: '\\E807';\r\n }\r\n \r\n /* '' */\r\n .icon-star:before {\r\n   content: '\\E808';\r\n }\r\n \r\n /* '' */\r\n .icon-star-empty:before {\r\n   content: '\\E809';\r\n }\r\n \r\n /* '' */\r\n .icon-user:before {\r\n   content: '\\E80A';\r\n }\r\n \r\n /* '' */\r\n .icon-users:before {\r\n   content: '\\E80B';\r\n }\r\n \r\n /* '' */\r\n .icon-user-add:before {\r\n   content: '\\E80C';\r\n }\r\n \r\n /* '' */\r\n .icon-video:before {\r\n   content: '\\E80D';\r\n }\r\n \r\n /* '' */\r\n .icon-picture:before {\r\n   content: '\\E80E';\r\n }\r\n \r\n /* '' */\r\n .icon-camera:before {\r\n   content: '\\E80F';\r\n }\r\n \r\n /* '' */\r\n .icon-layout:before {\r\n   content: '\\E810';\r\n }\r\n \r\n /* '' */\r\n .icon-menu:before {\r\n   content: '\\E811';\r\n }\r\n \r\n /* '' */\r\n .icon-check:before {\r\n   content: '\\E812';\r\n }\r\n \r\n /* '' */\r\n .icon-cancel:before {\r\n   content: '\\E813';\r\n }\r\n \r\n /* '' */\r\n .icon-cancel-circled:before {\r\n   content: '\\E814';\r\n }\r\n \r\n /* '' */\r\n .icon-cancel-squared:before {\r\n   content: '\\E815';\r\n }\r\n \r\n /* '' */\r\n .icon-plus:before {\r\n   content: '\\E816';\r\n }\r\n \r\n /* '' */\r\n .icon-plus-circled:before {\r\n   content: '\\E817';\r\n }\r\n \r\n /* '' */\r\n .icon-plus-squared:before {\r\n   content: '\\E818';\r\n }\r\n \r\n /* '' */\r\n .icon-minus:before {\r\n   content: '\\E819';\r\n }\r\n \r\n /* '' */\r\n .icon-minus-circled:before {\r\n   content: '\\E81A';\r\n }\r\n \r\n /* '' */\r\n .icon-minus-squared:before {\r\n   content: '\\E81B';\r\n }\r\n \r\n /* '' */\r\n .icon-help:before {\r\n   content: '\\E81C';\r\n }\r\n \r\n /* '' */\r\n .icon-help-circled:before {\r\n   content: '\\E81D';\r\n }\r\n \r\n /* '' */\r\n .icon-info:before {\r\n   content: '\\E81E';\r\n }\r\n \r\n /* '' */\r\n .icon-info-circled:before {\r\n   content: '\\E81F';\r\n }\r\n \r\n /* '' */\r\n .icon-back:before {\r\n   content: '\\E820';\r\n }\r\n \r\n /* '' */\r\n .icon-home:before {\r\n   content: '\\E821';\r\n }\r\n \r\n /* '' */\r\n .icon-link:before {\r\n   content: '\\E822';\r\n }\r\n \r\n /* '' */\r\n .icon-attach:before {\r\n   content: '\\E823';\r\n }\r\n \r\n /* '' */\r\n .icon-lock:before {\r\n   content: '\\E824';\r\n }\r\n \r\n /* '' */\r\n .icon-lock-open:before {\r\n   content: '\\E825';\r\n }\r\n \r\n /* '' */\r\n .icon-eye:before {\r\n   content: '\\E826';\r\n }\r\n \r\n /* '' */\r\n .icon-tag:before {\r\n   content: '\\E827';\r\n }\r\n \r\n /* '' */\r\n .icon-bookmark:before {\r\n   content: '\\E828';\r\n }\r\n \r\n /* '' */\r\n .icon-bookmarks:before {\r\n   content: '\\E829';\r\n }\r\n \r\n /* '' */\r\n .icon-flag:before {\r\n   content: '\\E82A';\r\n }\r\n \r\n /* '' */\r\n .icon-thumbs-up:before {\r\n   content: '\\E82B';\r\n }\r\n \r\n /* '' */\r\n .icon-thumbs-down:before {\r\n   content: '\\E82C';\r\n }\r\n \r\n /* '' */\r\n .icon-download:before {\r\n   content: '\\E82D';\r\n }\r\n \r\n /* '' */\r\n .icon-upload:before {\r\n   content: '\\E82E';\r\n }\r\n \r\n /* '' */\r\n .icon-upload-cloud:before {\r\n   content: '\\E82F';\r\n }\r\n \r\n /* '' */\r\n .icon-reply:before {\r\n   content: '\\E830';\r\n }\r\n \r\n /* '' */\r\n .icon-reply-all:before {\r\n   content: '\\E831';\r\n }\r\n \r\n /* '' */\r\n .icon-forward:before {\r\n   content: '\\E832';\r\n }\r\n \r\n /* '' */\r\n .icon-quote:before {\r\n   content: '\\E833';\r\n }\r\n \r\n /* '' */\r\n .icon-code:before {\r\n   content: '\\E834';\r\n }\r\n \r\n /* '' */\r\n .icon-export:before {\r\n   content: '\\E835';\r\n }\r\n \r\n /* '' */\r\n .icon-pencil:before {\r\n   content: '\\E836';\r\n }\r\n \r\n /* '' */\r\n .icon-feather:before {\r\n   content: '\\E837';\r\n }\r\n \r\n /* '' */\r\n .icon-print:before {\r\n   content: '\\E838';\r\n }\r\n \r\n /* '' */\r\n .icon-retweet:before {\r\n   content: '\\E839';\r\n }\r\n \r\n /* '' */\r\n .icon-keyboard:before {\r\n   content: '\\E83A';\r\n }\r\n \r\n /* '' */\r\n .icon-comment:before {\r\n   content: '\\E83B';\r\n }\r\n \r\n /* '' */\r\n .icon-chat:before {\r\n   content: '\\E83C';\r\n }\r\n \r\n /* '' */\r\n .icon-bell:before {\r\n   content: '\\E83D';\r\n }\r\n \r\n /* '' */\r\n .icon-attention:before {\r\n   content: '\\E83E';\r\n }\r\n \r\n /* '' */\r\n .icon-alert:before {\r\n   content: '\\E83F';\r\n }\r\n \r\n /* '' */\r\n .icon-vcard:before {\r\n   content: '\\E840';\r\n }\r\n \r\n /* '' */\r\n .icon-address:before {\r\n   content: '\\E841';\r\n }\r\n \r\n /* '' */\r\n .icon-location:before {\r\n   content: '\\E842';\r\n }\r\n \r\n /* '' */\r\n .icon-map:before {\r\n   content: '\\E843';\r\n }\r\n \r\n /* '' */\r\n .icon-direction:before {\r\n   content: '\\E844';\r\n }\r\n \r\n /* '' */\r\n .icon-compass:before {\r\n   content: '\\E845';\r\n }\r\n \r\n /* '' */\r\n .icon-cup:before {\r\n   content: '\\E846';\r\n }\r\n \r\n /* '' */\r\n .icon-trash:before {\r\n   content: '\\E847';\r\n }\r\n \r\n /* '' */\r\n .icon-doc:before {\r\n   content: '\\E848';\r\n }\r\n \r\n /* '' */\r\n .icon-docs:before {\r\n   content: '\\E849';\r\n }\r\n \r\n /* '' */\r\n .icon-doc-landscape:before {\r\n   content: '\\E84A';\r\n }\r\n \r\n /* '' */\r\n .icon-doc-text:before {\r\n   content: '\\E84B';\r\n }\r\n \r\n /* '' */\r\n .icon-doc-text-inv:before {\r\n   content: '\\E84C';\r\n }\r\n \r\n /* '' */\r\n .icon-newspaper:before {\r\n   content: '\\E84D';\r\n }\r\n \r\n /* '' */\r\n .icon-book-open:before {\r\n   content: '\\E84E';\r\n }\r\n \r\n /* '' */\r\n .icon-book:before {\r\n   content: '\\E84F';\r\n }\r\n \r\n /* '' */\r\n .icon-folder:before {\r\n   content: '\\E850';\r\n }\r\n \r\n /* '' */\r\n .icon-archive:before {\r\n   content: '\\E851';\r\n }\r\n \r\n /* '' */\r\n .icon-box:before {\r\n   content: '\\E852';\r\n }\r\n \r\n /* '' */\r\n .icon-rss:before {\r\n   content: '\\E853';\r\n }\r\n \r\n /* '' */\r\n .icon-phone:before {\r\n   content: '\\E854';\r\n }\r\n \r\n /* '' */\r\n .icon-cog:before {\r\n   content: '\\E855';\r\n }\r\n \r\n /* '' */\r\n .icon-tools:before {\r\n   content: '\\E856';\r\n }\r\n \r\n /* '' */\r\n .icon-share:before {\r\n   content: '\\E857';\r\n }\r\n \r\n /* '' */\r\n .icon-shareable:before {\r\n   content: '\\E858';\r\n }\r\n \r\n /* '' */\r\n .icon-basket:before {\r\n   content: '\\E859';\r\n }\r\n \r\n /* '' */\r\n .icon-bag:before {\r\n   content: '\\E85A';\r\n }\r\n \r\n /* '' */\r\n .icon-calendar:before {\r\n   content: '\\E85B';\r\n }\r\n \r\n /* '' */\r\n .icon-login:before {\r\n   content: '\\E85C';\r\n }\r\n \r\n /* '' */\r\n .icon-logout:before {\r\n   content: '\\E85D';\r\n }\r\n \r\n /* '' */\r\n .icon-mic:before {\r\n   content: '\\E85E';\r\n }\r\n \r\n /* '' */\r\n .icon-mute:before {\r\n   content: '\\E85F';\r\n }\r\n \r\n /* '' */\r\n .icon-sound:before {\r\n   content: '\\E860';\r\n }\r\n \r\n /* '' */\r\n .icon-volume:before {\r\n   content: '\\E861';\r\n }\r\n \r\n /* '' */\r\n .icon-clock:before {\r\n   content: '\\E862';\r\n }\r\n \r\n /* '' */\r\n .icon-hourglass:before {\r\n   content: '\\E863';\r\n }\r\n \r\n /* '' */\r\n .icon-lamp:before {\r\n   content: '\\E864';\r\n }\r\n \r\n /* '' */\r\n .icon-light-down:before {\r\n   content: '\\E865';\r\n }\r\n \r\n /* '' */\r\n .icon-light-up:before {\r\n   content: '\\E866';\r\n }\r\n \r\n /* '' */\r\n .icon-adjust:before {\r\n   content: '\\E867';\r\n }\r\n \r\n /* '' */\r\n .icon-block:before {\r\n   content: '\\E868';\r\n }\r\n \r\n /* '' */\r\n .icon-resize-full:before {\r\n   content: '\\E869';\r\n }\r\n \r\n /* '' */\r\n .icon-resize-small:before {\r\n   content: '\\E86A';\r\n }\r\n \r\n /* '' */\r\n .icon-popup:before {\r\n   content: '\\E86B';\r\n }\r\n \r\n /* '' */\r\n .icon-publish:before {\r\n   content: '\\E86C';\r\n }\r\n \r\n /* '' */\r\n .icon-window:before {\r\n   content: '\\E86D';\r\n }\r\n \r\n /* '' */\r\n .icon-arrow-combo:before {\r\n   content: '\\E86E';\r\n }\r\n \r\n /* '' */\r\n .icon-down-circled:before {\r\n   content: '\\E86F';\r\n }\r\n \r\n /* '' */\r\n .icon-left-circled:before {\r\n   content: '\\E870';\r\n }\r\n \r\n /* '' */\r\n .icon-right-circled:before {\r\n   content: '\\E871';\r\n }\r\n \r\n /* '' */\r\n .icon-up-circled:before {\r\n   content: '\\E872';\r\n }\r\n \r\n /* '' */\r\n .icon-down-open:before {\r\n   content: '\\E873';\r\n }\r\n \r\n /* '' */\r\n .icon-left-open:before {\r\n   content: '\\E874';\r\n }\r\n \r\n /* '' */\r\n .icon-right-open:before {\r\n   content: '\\E875';\r\n }\r\n \r\n /* '' */\r\n .icon-up-open:before {\r\n   content: '\\E876';\r\n }\r\n \r\n /* '' */\r\n .icon-down-open-mini:before {\r\n   content: '\\E877';\r\n }\r\n \r\n /* '' */\r\n .icon-left-open-mini:before {\r\n   content: '\\E878';\r\n }\r\n \r\n /* '' */\r\n .icon-right-open-mini:before {\r\n   content: '\\E879';\r\n }\r\n \r\n /* '' */\r\n .icon-up-open-mini:before {\r\n   content: '\\E87A';\r\n }\r\n \r\n /* '' */\r\n .icon-down-open-big:before {\r\n   content: '\\E87B';\r\n }\r\n \r\n /* '' */\r\n .icon-left-open-big:before {\r\n   content: '\\E87C';\r\n }\r\n \r\n /* '' */\r\n .icon-right-open-big:before {\r\n   content: '\\E87D';\r\n }\r\n \r\n /* '' */\r\n .icon-up-open-big:before {\r\n   content: '\\E87E';\r\n }\r\n \r\n /* '' */\r\n .icon-down:before {\r\n   content: '\\E87F';\r\n }\r\n \r\n /* '' */\r\n .icon-left:before {\r\n   content: '\\E880';\r\n }\r\n \r\n /* '' */\r\n .icon-right:before {\r\n   content: '\\E881';\r\n }\r\n \r\n /* '' */\r\n .icon-up:before {\r\n   content: '\\E882';\r\n }\r\n \r\n /* '' */\r\n .icon-down-dir:before {\r\n   content: '\\E883';\r\n }\r\n \r\n /* '' */\r\n .icon-left-dir:before {\r\n   content: '\\E884';\r\n }\r\n \r\n /* '' */\r\n .icon-right-dir:before {\r\n   content: '\\E885';\r\n }\r\n \r\n /* '' */\r\n .icon-up-dir:before {\r\n   content: '\\E886';\r\n }\r\n \r\n /* '' */\r\n .icon-down-bold:before {\r\n   content: '\\E887';\r\n }\r\n \r\n /* '' */\r\n .icon-left-bold:before {\r\n   content: '\\E888';\r\n }\r\n \r\n /* '' */\r\n .icon-right-bold:before {\r\n   content: '\\E889';\r\n }\r\n \r\n /* '' */\r\n .icon-up-bold:before {\r\n   content: '\\E88A';\r\n }\r\n \r\n /* '' */\r\n .icon-down-thin:before {\r\n   content: '\\E88B';\r\n }\r\n \r\n /* '' */\r\n .icon-left-thin:before {\r\n   content: '\\E88C';\r\n }\r\n \r\n /* '' */\r\n .icon-right-thin:before {\r\n   content: '\\E88D';\r\n }\r\n \r\n /* '' */\r\n .icon-up-thin:before {\r\n   content: '\\E88E';\r\n }\r\n \r\n /* '' */\r\n .icon-ccw:before {\r\n   content: '\\E88F';\r\n }\r\n \r\n /* '' */\r\n .icon-cw:before {\r\n   content: '\\E890';\r\n }\r\n \r\n /* '' */\r\n .icon-arrows-ccw:before {\r\n   content: '\\E891';\r\n }\r\n \r\n /* '' */\r\n .icon-level-down:before {\r\n   content: '\\E892';\r\n }\r\n \r\n /* '' */\r\n .icon-level-up:before {\r\n   content: '\\E893';\r\n }\r\n \r\n /* '' */\r\n .icon-shuffle:before {\r\n   content: '\\E894';\r\n }\r\n \r\n /* '' */\r\n .icon-loop:before {\r\n   content: '\\E895';\r\n }\r\n \r\n /* '' */\r\n .icon-switch:before {\r\n   content: '\\E896';\r\n }\r\n \r\n /* '' */\r\n .icon-play:before {\r\n   content: '\\E897';\r\n }\r\n \r\n /* '' */\r\n .icon-stop:before {\r\n   content: '\\E898';\r\n }\r\n \r\n /* '' */\r\n .icon-pause:before {\r\n   content: '\\E899';\r\n }\r\n \r\n /* '' */\r\n .icon-record:before {\r\n   content: '\\E89A';\r\n }\r\n \r\n /* '' */\r\n .icon-to-end:before {\r\n   content: '\\E89B';\r\n }\r\n \r\n /* '' */\r\n .icon-to-start:before {\r\n   content: '\\E89C';\r\n }\r\n \r\n /* '' */\r\n .icon-fast-forward:before {\r\n   content: '\\E89D';\r\n }\r\n \r\n /* '' */\r\n .icon-fast-backward:before {\r\n   content: '\\E89E';\r\n }\r\n \r\n /* '' */\r\n .icon-progress-0:before {\r\n   content: '\\E89F';\r\n }\r\n \r\n /* '' */\r\n .icon-progress-1:before {\r\n   content: '\\E8A0';\r\n }\r\n \r\n /* '' */\r\n .icon-progress-2:before {\r\n   content: '\\E8A1';\r\n }\r\n \r\n /* '' */\r\n .icon-progress-3:before {\r\n   content: '\\E8A2';\r\n }\r\n \r\n /* '' */\r\n .icon-target:before {\r\n   content: '\\E8A3';\r\n }\r\n \r\n /* '' */\r\n .icon-palette:before {\r\n   content: '\\E8A4';\r\n }\r\n \r\n /* '' */\r\n .icon-list:before {\r\n   content: '\\E8A5';\r\n }\r\n \r\n /* '' */\r\n .icon-list-add:before {\r\n   content: '\\E8A6';\r\n }\r\n \r\n /* '' */\r\n .icon-signal:before {\r\n   content: '\\E8A7';\r\n }\r\n \r\n /* '' */\r\n .icon-trophy:before {\r\n   content: '\\E8A8';\r\n }\r\n \r\n /* '' */\r\n .icon-battery:before {\r\n   content: '\\E8A9';\r\n }\r\n \r\n /* '' */\r\n .icon-back-in-time:before {\r\n   content: '\\E8AA';\r\n }\r\n \r\n /* '' */\r\n .icon-monitor:before {\r\n   content: '\\E8AB';\r\n }\r\n \r\n /* '' */\r\n .icon-mobile:before {\r\n   content: '\\E8AC';\r\n }\r\n \r\n /* '' */\r\n .icon-network:before {\r\n   content: '\\E8AD';\r\n }\r\n \r\n /* '' */\r\n .icon-cd:before {\r\n   content: '\\E8AE';\r\n }\r\n \r\n /* '' */\r\n .icon-inbox:before {\r\n   content: '\\E8AF';\r\n }\r\n \r\n /* '' */\r\n .icon-install:before {\r\n   content: '\\E8B0';\r\n }\r\n \r\n /* '' */\r\n .icon-globe:before {\r\n   content: '\\E8B1';\r\n }\r\n \r\n /* '' */\r\n .icon-cloud:before {\r\n   content: '\\E8B2';\r\n }\r\n \r\n /* '' */\r\n .icon-cloud-thunder:before {\r\n   content: '\\E8B3';\r\n }\r\n \r\n /* '' */\r\n .icon-flash:before {\r\n   content: '\\E8B4';\r\n }\r\n \r\n /* '' */\r\n .icon-moon:before {\r\n   content: '\\E8B5';\r\n }\r\n \r\n /* '' */\r\n .icon-flight:before {\r\n   content: '\\E8B6';\r\n }\r\n \r\n /* '' */\r\n .icon-paper-plane:before {\r\n   content: '\\E8B7';\r\n }\r\n \r\n /* '' */\r\n .icon-leaf:before {\r\n   content: '\\E8B8';\r\n }\r\n \r\n /* '' */\r\n .icon-lifebuoy:before {\r\n   content: '\\E8B9';\r\n }\r\n \r\n /* '' */\r\n .icon-mouse:before {\r\n   content: '\\E8BA';\r\n }\r\n \r\n /* '' */\r\n .icon-briefcase:before {\r\n   content: '\\E8BB';\r\n }\r\n \r\n /* '' */\r\n .icon-suitcase:before {\r\n   content: '\\E8BC';\r\n }\r\n \r\n /* '' */\r\n .icon-dot:before {\r\n   content: '\\E8BD';\r\n }\r\n \r\n /* '' */\r\n .icon-dot-2:before {\r\n   content: '\\E8BE';\r\n }\r\n \r\n /* '' */\r\n .icon-dot-3:before {\r\n   content: '\\E8BF';\r\n }\r\n \r\n /* '' */\r\n .icon-brush:before {\r\n   content: '\\E8C0';\r\n }\r\n \r\n /* '' */\r\n .icon-magnet:before {\r\n   content: '\\E8C1';\r\n }\r\n \r\n /* '' */\r\n .icon-infinity:before {\r\n   content: '\\E8C2';\r\n }\r\n \r\n /* '' */\r\n .icon-erase:before {\r\n   content: '\\E8C3';\r\n }\r\n \r\n /* '' */\r\n .icon-chart-pie:before {\r\n   content: '\\E8C4';\r\n }\r\n \r\n /* '' */\r\n .icon-chart-line:before {\r\n   content: '\\E8C5';\r\n }\r\n \r\n /* '' */\r\n .icon-chart-bar:before {\r\n   content: '\\E8C6';\r\n }\r\n \r\n /* '' */\r\n .icon-chart-area:before {\r\n   content: '\\E8C7';\r\n }\r\n \r\n /* '' */\r\n .icon-tape:before {\r\n   content: '\\E8C8';\r\n }\r\n \r\n /* '' */\r\n .icon-graduation-cap:before {\r\n   content: '\\E8C9';\r\n }\r\n \r\n /* '' */\r\n .icon-language:before {\r\n   content: '\\E8CA';\r\n }\r\n \r\n /* '' */\r\n .icon-ticket:before {\r\n   content: '\\E8CB';\r\n }\r\n \r\n /* '' */\r\n .icon-water:before {\r\n   content: '\\E8CC';\r\n }\r\n \r\n /* '' */\r\n .icon-droplet:before {\r\n   content: '\\E8CD';\r\n }\r\n \r\n /* '' */\r\n .icon-air:before {\r\n   content: '\\E8CE';\r\n }\r\n \r\n /* '' */\r\n .icon-credit-card:before {\r\n   content: '\\E8CF';\r\n }\r\n \r\n /* '' */\r\n .icon-floppy:before {\r\n   content: '\\E8D0';\r\n }\r\n \r\n /* '' */\r\n .icon-clipboard:before {\r\n   content: '\\E8D1';\r\n }\r\n \r\n /* '' */\r\n .icon-megaphone:before {\r\n   content: '\\E8D2';\r\n }\r\n \r\n /* '' */\r\n .icon-database:before {\r\n   content: '\\E8D3';\r\n }\r\n \r\n /* '' */\r\n .icon-drive:before {\r\n   content: '\\E8D4';\r\n }\r\n \r\n /* '' */\r\n .icon-bucket:before {\r\n   content: '\\E8D5';\r\n }\r\n \r\n /* '' */\r\n .icon-thermometer:before {\r\n   content: '\\E8D6';\r\n }\r\n \r\n /* '' */\r\n .icon-key:before {\r\n   content: '\\E8D7';\r\n }\r\n \r\n /* '' */\r\n .icon-flow-cascade:before {\r\n   content: '\\E8D8';\r\n }\r\n \r\n /* '' */\r\n .icon-flow-branch:before {\r\n   content: '\\E8D9';\r\n }\r\n \r\n /* '' */\r\n .icon-flow-tree:before {\r\n   content: '\\E8DA';\r\n }\r\n \r\n /* '' */\r\n .icon-flow-line:before {\r\n   content: '\\E8DB';\r\n }\r\n \r\n /* '' */\r\n .icon-flow-parallel:before {\r\n   content: '\\E8DC';\r\n }\r\n \r\n /* '' */\r\n .icon-rocket:before {\r\n   content: '\\E8DD';\r\n }\r\n \r\n /* '' */\r\n .icon-gauge:before {\r\n   content: '\\E8DE';\r\n }\r\n \r\n /* '' */\r\n .icon-traffic-cone:before {\r\n   content: '\\E8DF';\r\n }\r\n \r\n /* '' */\r\n .icon-cc:before {\r\n   content: '\\E8E0';\r\n }\r\n \r\n /* '' */\r\n .icon-cc-by:before {\r\n   content: '\\E8E1';\r\n }\r\n \r\n /* '' */\r\n .icon-cc-nc:before {\r\n   content: '\\E8E2';\r\n }\r\n \r\n /* '' */\r\n .icon-cc-nc-eu:before {\r\n   content: '\\E8E3';\r\n }\r\n \r\n /* '' */\r\n .icon-cc-nc-jp:before {\r\n   content: '\\E8E4';\r\n }\r\n \r\n /* '' */\r\n .icon-cc-sa:before {\r\n   content: '\\E8E5';\r\n }\r\n \r\n /* '' */\r\n .icon-cc-nd:before {\r\n   content: '\\E8E6';\r\n }\r\n \r\n /* '' */\r\n .icon-cc-pd:before {\r\n   content: '\\E8E7';\r\n }\r\n \r\n /* '' */\r\n .icon-cc-zero:before {\r\n   content: '\\E8E8';\r\n }\r\n \r\n /* '' */\r\n .icon-cc-share:before {\r\n   content: '\\E8E9';\r\n }\r\n \r\n /* '' */\r\n .icon-cc-remix:before {\r\n   content: '\\E8EA';\r\n }\r\n \r\n /* '' */\r\n .icon-github:before {\r\n   content: '\\E8EB';\r\n }\r\n \r\n /* '' */\r\n .icon-github-circled:before {\r\n   content: '\\E8EC';\r\n }\r\n \r\n /* '' */\r\n .icon-flickr:before {\r\n   content: '\\E8ED';\r\n }\r\n \r\n /* '' */\r\n .icon-flickr-circled:before {\r\n   content: '\\E8EE';\r\n }\r\n \r\n /* '' */\r\n .icon-vimeo:before {\r\n   content: '\\E8EF';\r\n }\r\n \r\n /* '' */\r\n .icon-vimeo-circled:before {\r\n   content: '\\E8F0';\r\n }\r\n \r\n /* '' */\r\n .icon-twitter:before {\r\n   content: '\\E8F1';\r\n }\r\n \r\n /* '' */\r\n .icon-twitter-circled:before {\r\n   content: '\\E8F2';\r\n }\r\n \r\n /* '' */\r\n .icon-facebook:before {\r\n   content: '\\E8F3';\r\n }\r\n \r\n /* '' */\r\n .icon-facebook-circled:before {\r\n   content: '\\E8F4';\r\n }\r\n \r\n /* '' */\r\n .icon-facebook-squared:before {\r\n   content: '\\E8F5';\r\n }\r\n \r\n /* '' */\r\n .icon-gplus:before {\r\n   content: '\\E8F6';\r\n }\r\n \r\n /* '' */\r\n .icon-gplus-circled:before {\r\n   content: '\\E8F7';\r\n }\r\n \r\n /* '' */\r\n .icon-pinterest:before {\r\n   content: '\\E8F8';\r\n }\r\n \r\n /* '' */\r\n .icon-pinterest-circled:before {\r\n   content: '\\E8F9';\r\n }\r\n \r\n /* '' */\r\n .icon-tumblr:before {\r\n   content: '\\E8FA';\r\n }\r\n \r\n /* '' */\r\n .icon-tumblr-circled:before {\r\n   content: '\\E8FB';\r\n }\r\n \r\n /* '' */\r\n .icon-linkedin:before {\r\n   content: '\\E8FC';\r\n }\r\n \r\n /* '' */\r\n .icon-linkedin-circled:before {\r\n   content: '\\E8FD';\r\n }\r\n \r\n /* '' */\r\n .icon-dribbble:before {\r\n   content: '\\E8FE';\r\n }\r\n \r\n /* '' */\r\n .icon-dribbble-circled:before {\r\n   content: '\\E8FF';\r\n }\r\n \r\n /* '' */\r\n .icon-stumbleupon:before {\r\n   content: '\\E900';\r\n }\r\n \r\n /* '' */\r\n .icon-stumbleupon-circled:before {\r\n   content: '\\E901';\r\n }\r\n \r\n /* '' */\r\n .icon-lastfm:before {\r\n   content: '\\E902';\r\n }\r\n \r\n /* '' */\r\n .icon-lastfm-circled:before {\r\n   content: '\\E903';\r\n }\r\n \r\n /* '' */\r\n .icon-rdio:before {\r\n   content: '\\E904';\r\n }\r\n \r\n /* '' */\r\n .icon-rdio-circled:before {\r\n   content: '\\E905';\r\n }\r\n \r\n /* '' */\r\n .icon-spotify:before {\r\n   content: '\\E906';\r\n }\r\n \r\n /* '' */\r\n .icon-spotify-circled:before {\r\n   content: '\\E907';\r\n }\r\n \r\n /* '' */\r\n .icon-qq:before {\r\n   content: '\\E908';\r\n }\r\n \r\n /* '' */\r\n .icon-instagram:before {\r\n   content: '\\E909';\r\n }\r\n \r\n /* '' */\r\n .icon-dropbox:before {\r\n   content: '\\E90A';\r\n }\r\n \r\n /* '' */\r\n .icon-evernote:before {\r\n   content: '\\E90B';\r\n }\r\n \r\n /* '' */\r\n .icon-flattr:before {\r\n   content: '\\E90C';\r\n }\r\n \r\n /* '' */\r\n .icon-skype:before {\r\n   content: '\\E90D';\r\n }\r\n \r\n /* '' */\r\n .icon-skype-circled:before {\r\n   content: '\\E90E';\r\n }\r\n \r\n /* '' */\r\n .icon-renren:before {\r\n   content: '\\E90F';\r\n }\r\n \r\n /* '' */\r\n .icon-sina-weibo:before {\r\n   content: '\\E910';\r\n }\r\n \r\n /* '' */\r\n .icon-paypal:before {\r\n   content: '\\E911';\r\n }\r\n \r\n /* '' */\r\n .icon-picasa:before {\r\n   content: '\\E912';\r\n }\r\n \r\n /* '' */\r\n .icon-soundcloud:before {\r\n   content: '\\E913';\r\n }\r\n \r\n /* '' */\r\n .icon-mixi:before {\r\n   content: '\\E914';\r\n }\r\n \r\n /* '' */\r\n .icon-behance:before {\r\n   content: '\\E915';\r\n }\r\n \r\n /* '' */\r\n .icon-google-circles:before {\r\n   content: '\\E916';\r\n }\r\n \r\n /* '' */\r\n .icon-vkontakte:before {\r\n   content: '\\E917';\r\n }\r\n \r\n /* '' */\r\n .icon-smashing:before {\r\n   content: '\\E918';\r\n }\r\n \r\n /* '' */\r\n .icon-sweden:before {\r\n   content: '\\E919';\r\n }\r\n \r\n /* '' */\r\n .icon-db-shape:before {\r\n   content: '\\E91A';\r\n }\r\n \r\n /* '' */\r\n .icon-logo-db:before {\r\n   content: '\\E91B';\r\n }\r\n \r\n /* '' */\r\n table {\r\n   width: 100%;\r\n   border: 0;\r\n   border-collapse: separate;\r\n   font-size: 12px;\r\n   text-align: left;\r\n }\r\n \r\n thead {\r\n   background-color: #f5f5f4;\r\n }\r\n \r\n tbody {\r\n   background-color: #fff;\r\n }\r\n \r\n .table-striped tr:nth-child(even) {\r\n   background-color: #f5f5f4;\r\n }\r\n \r\n tr:active,\r\n .table-striped tr:active:nth-child(even) {\r\n   color: #fff;\r\n   background-color: #116cd6;\r\n }\r\n \r\n thead tr:active {\r\n   color: #333;\r\n   background-color: #f5f5f4;\r\n }\r\n \r\n th {\r\n   font-weight: normal;\r\n   border-right: 1px solid #ddd;\r\n   border-bottom: 1px solid #ddd;\r\n }\r\n \r\n th,\r\n td {\r\n   padding: 2px 15px;\r\n   white-space: nowrap;\r\n   overflow: hidden;\r\n   text-overflow: ellipsis;\r\n }\r\n th:last-child,\r\n td:last-child {\r\n   border-right: 0;\r\n }\r\n \r\n .tab-group {\r\n   margin-top: -1px;\r\n   display: flex;\r\n   border-top: 1px solid #989698;\r\n   border-bottom: 1px solid #989698;\r\n }\r\n \r\n .tab-item {\r\n   position: relative;\r\n   flex: 1;\r\n   padding: 3px;\r\n   font-size: 12px;\r\n   text-align: center;\r\n   border-left: 1px solid #989698;\r\n   background-color: #b8b6b8;\r\n   background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #b8b6b8), color-stop(100%, #b0aeb0));\r\n   background-image: -webkit-linear-gradient(top, #b8b6b8 0%, #b0aeb0 100%);\r\n   background-image: linear-gradient(to bottom, #b8b6b8 0%, #b0aeb0 100%);\r\n }\r\n .tab-item:first-child {\r\n   border-left: 0;\r\n }\r\n .tab-item.active {\r\n   background-color: #d4d2d4;\r\n   background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #d4d2d4), color-stop(100%, #cccacc));\r\n   background-image: -webkit-linear-gradient(top, #d4d2d4 0%, #cccacc 100%);\r\n   background-image: linear-gradient(to bottom, #d4d2d4 0%, #cccacc 100%);\r\n }\r\n .tab-item .icon-close-tab {\r\n   position: absolute;\r\n   top: 50%;\r\n   left: 5px;\r\n   width: 15px;\r\n   height: 15px;\r\n   font-size: 15px;\r\n   line-height: 15px;\r\n   text-align: center;\r\n   color: #666;\r\n   opacity: 0;\r\n   transition: opacity .1s linear, background-color .1s linear;\r\n   border-radius: 3px;\r\n   transform: translateY(-50%);\r\n   z-index: 10;\r\n }\r\n .tab-item:after {\r\n   position: absolute;\r\n   top: 0;\r\n   right: 0;\r\n   bottom: 0;\r\n   left: 0;\r\n   content: \"\";\r\n   background-color: rgba(0, 0, 0, 0.08);\r\n   opacity: 0;\r\n   transition: opacity .1s linear;\r\n   z-index: 1;\r\n }\r\n .tab-item:hover:not(.active):after {\r\n   opacity: 1;\r\n }\r\n .tab-item:hover .icon-close-tab {\r\n   opacity: 1;\r\n }\r\n .tab-item .icon-close-tab:hover {\r\n   background-color: rgba(0, 0, 0, 0.08);\r\n }\r\n \r\n .tab-item-fixed {\r\n   flex: none;\r\n   padding: 3px 10px;\r\n }", ""]);
	
	// exports


/***/ })

/******/ });
//# sourceMappingURL=setting.map