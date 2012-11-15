// Copyright 2012 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var console = { };
/** @param {...*} vararg */
console.log = function(vararg) { };
/** @param {...*} vararg */
console.warn = function(vararg) { };

var JSON = { };

/** @param {Object} object */
JSON.stringify = function(object) { };

/** @param {Element} element */
var getEventListeners = function(element) { };

var chrome = { };
chrome.i18n = { };
chrome.devtools = { };
chrome.devtools.inspectedWindow = { };
/**
 * @param {string} string
 * @param {Object=} opt_options,
 * @param {Function=} opt_callback
 */
chrome.devtools.inspectedWindow.eval = function(string, opt_options, opt_callback) { };

/**
 * @param {string} id
 * @param {...(boolean|number|Object|string)} var_args
 */
chrome.i18n.getMessage = function(id, var_args) { };

/**
 * @type {Element}
 */
HTMLLabelElement.prototype.control;
