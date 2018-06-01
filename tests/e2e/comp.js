var comp =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/game-loop.js":
/*!**************************!*\
  !*** ./src/game-loop.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var ObjectPool = __webpack_require__(/*! ./object-pool */ \"./src/object-pool.js\");\n\nvar GameLoop = function (config) {\n  'use strict';\n  config = config || {};\n  this.delta = 0;\n  this.fps = config.fps || 60;\n  this.frame = 0;\n  this.tasks = new ObjectPool({\n    class: function (delay, task) {\n      this.delay = delay;\n      this.task = task;\n    },\n    reset: function (object, delay, task) {\n      this.delay = delay;\n      this.task = task;\n    }\n  });\n};\n\nGameLoop.prototype.tick = function () {\n  this.frame++;\n  var self = this;\n  this.tasks.each(function (task) {\n    if (task.delay === 0) {\n      task.task();\n      self.tasks.dismiss(task);\n    } else {\n      task.delay--;\n    }\n  });\n};\n\nGameLoop.prototype.queueTask = function (delay, task) {\n  this.tasks.use(delay, task);\n};\n\nif (true) {\n  module.exports = GameLoop;\n}\n\n\n//# sourceURL=webpack://comp/./src/game-loop.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var ObjectPool = __webpack_require__(/*! ./object-pool.js */ \"./src/object-pool.js\");\nvar GameLoop = __webpack_require__(/*! ./game-loop.js */ \"./src/game-loop.js\");\n\nvar comp = {\n  ObjectPool: ObjectPool,\n  GameLoop: GameLoop\n};\n\nif (true) {\n  module.exports = comp;\n}\n\n//# sourceURL=webpack://comp/./src/index.js?");

/***/ }),

/***/ "./src/object-pool.js":
/*!****************************!*\
  !*** ./src/object-pool.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var ObjectPool = function ObjectPool (config) {\n  'use strict';\n  this.config = config || {};\n  this.pool = [];\n  this.used = 0;\n};\n\nObjectPool.prototype.clear = function () {\n  this.pool = [];\n  this.used = 0;\n};\n\nObjectPool.prototype.use = function () {\n\n  // get a free object\n  var unusedItem = false;\n  this.pool.forEach(function (item) {\n    if (item.active === false) {\n      unusedItem = item;\n    }\n  });\n\n  // if free object init and reuse it\n  if (unusedItem) {\n    this.config.reset.apply(this, [unusedItem.object].concat(Array.prototype.slice.call(arguments)));\n    unusedItem.active = true;\n    return unusedItem.object;\n  }\n\n  // if no free object creates one\n  var item = {\n    active: true,\n    object: new (Function.prototype.bind.apply(this.config.class, [null].concat(Array.prototype.slice.call(arguments))))()\n  };\n  this.pool.push(item);\n  this.used++;\n  return item.object;\n};\n\nObjectPool.prototype.dismiss = function (obj) {\n  // search o and deactivate it\n  this.pool.forEach(function (item) {\n    if (item.object === obj) {\n      item.active = false;\n    }\n  });\n  this.used--;\n};\n\nObjectPool.prototype.size = function () {\n  return this.pool.length;\n};\n\nObjectPool.prototype.each = function (fn) {\n  var length = this.pool.length;\n  var i;\n  for (i = 0; i < length; i++) {\n    if (this.pool[i].active === true) {\n      fn(this.pool[i].object, i);\n    }\n  }\n};\n\nif (true) {\n  module.exports = ObjectPool;\n}\n\n\n//# sourceURL=webpack://comp/./src/object-pool.js?");

/***/ })

/******/ });