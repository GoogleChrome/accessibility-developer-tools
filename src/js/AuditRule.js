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

goog.require('axs.constants');
goog.require('axs.content');
goog.provide('axs.AuditRule');

/**
 * @constructor
 * @param {Object} spec A spec of the form
 *     { name: string,
 *       severity: Severity,
 *       relevantNodesSelector: function(): Array.<node>|NodeList|XPathResult,
 *       test: function(node): boolean,
 *       code: string,
 *       opt_shouldRunInDevtools: boolean }.
 */
axs.AuditRule = function(spec) {
    var isValid = true;
    var missingFields = [];
    for (var i = 0; i < axs.AuditRule.requiredFields.length; i++) {
        var requiredField = axs.AuditRule.requiredFields[i];
        if (!(requiredField in spec)) {
            isValid = false;
            missingFields.push(requiredField);
        }
    }
    if (!isValid) {
        throw 'Invalid spec; the following fields were not specified: ' + missingFields.join(', ') +
              '\n' + JSON.stringify(spec);
    }

    /** @type {string} */
    this.name = spec.name;

    /** @type {axs.constants.Severity} */
    this.severity = spec.severity;

    /** @type {function(?Node): (Array.<Node>|NodeList|XPathResult)} */
    this.relevantNodesSelector_ = spec.relevantNodesSelector;

    /** @type {function(Node): boolean} */
    this.test_ = spec.test;

    /** @type {boolean} */
    this.shouldRunInDevtools = !!spec.opt_shouldRunInDevtools;

    /** @type {string} */
    this.code = spec.code;
};

/**
 * @const
 */
axs.AuditRule.requiredFields =
    [ 'name', 'severity', 'relevantNodesSelector', 'test', 'code' ];


/**
 * The return value for a non-applicable audit result.
 *
 * @type {{result: string}}
 * @const
 */
axs.AuditRule.NOT_APPLICABLE = { result: axs.constants.AuditResult.NA };

/**
 * @param {?Element} opt_scope The scope in which the node selector should run.
 *     Defaults to `document`.
 * @return {?Object.<string, (axs.constants.AuditResult|?Array.<Node>)>}
 */
axs.AuditRule.prototype.run = function(opt_scope) {
    var scope = opt_scope || document;

    var relevantNodes = this.relevantNodesSelector_(scope);

    var failingNodes = [];
    if (relevantNodes instanceof XPathResult) {
        if (relevantNodes.resultType == XPathResult.ORDERED_NODE_SNAPSHOT_TYPE) {
            if (!relevantNodes.snapshotLength)
                return axs.AuditRule.NOT_APPLICABLE;

            for (var i = 0; i < relevantNodes.snapshotLength; i++) {
                var node = relevantNodes.snapshotItem(i);
                if (this.test_(node))
                    failingNodes.push(axs.content.convertNodeToResult(node));
            }
        } else {
            console.warn('Unknown XPath result type', relevantNodes);
            return null;
        }
    } else {
        if (!relevantNodes.length)
            return { result: axs.constants.AuditResult.NA };
        for (var i = 0; i < relevantNodes.length; i++) {
            var node = relevantNodes[i];
            if (this.test_(node))
                failingNodes.push(axs.content.convertNodeToResult(node));
        }
    }
    var result = failingNodes.length ? axs.constants.AuditResult.FAIL : axs.constants.AuditResult.PASS;
    return { result: result, elements: failingNodes };
};

axs.AuditRule.prototype.runInDevtools = function(resultsCallback) {
    var extensionId = chrome.i18n.getMessage("@@extension_id"); // yes, really.
    var uniqueEventName = extensionId + '-' + this.name;

    function addEventListener(uniqueEventName, test) {
        function handleEventListenersEvent(event) {
            var element = event.target;
            window.relevantNodes.push(element);
            if (test(element))
                window.failingNodes.push(axs.content.convertNodeToResult(event.target));
        }
        window.relevantNodes = [];
        window.failingNodes = [];
        document.addEventListener(uniqueEventName, handleEventListenersEvent, false);
    }
    chrome.devtools.inspectedWindow.eval('(' + addEventListener + ')("'+ uniqueEventName + '", ' + this.test_ + ')',
                                         { useContentScriptContext: true });

    function sendRelevantNodesToContentScript(relevantNodesSelector, eventName) {
        var relevantNodes = relevantNodesSelector(document);
        for (var i = 0; i < relevantNodes.length; i++) {
            var node = relevantNodes[i];
            var event = document.createEvent('Event');
            event.initEvent(eventName, true, false);
            node.dispatchEvent(event);
        }
    }
    var stringToEval = '(function() { var axs = {};\n' +
        'axs.utils = {};\n' +
        // TODO all of axs.utils? Have selected methods in AuditRule?
        'axs.utils.isElementHidden = ' + axs.utils.isElementHidden + ';\n' +
        'axs.utils.isElementOrAncestorHidden = ' + axs.utils.isElementOrAncestorHidden + ';\n' +
        'axs.utils.isElementImplicitlyFocusable = ' + axs.utils.isElementImplicitlyFocusable + ';\n' +
        'var relevantNodesSelector = ' + this.relevantNodesSelector_ + ';\n' +
        'var sendRelevantNodesToContentScript = ' + sendRelevantNodesToContentScript + ';\n' +
        'sendRelevantNodesToContentScript(relevantNodesSelector, "' +
        uniqueEventName + '"); })()';
    chrome.devtools.inspectedWindow.eval(stringToEval);

    function retrieveResults() {
        var result = axs.constants.AuditResult.NA;
        if (window.relevantNodes.length)
            result = window.failingNodes.length ? axs.constants.AuditResult.FAIL : axs.constants.AuditResult.PASS;

        return { result: result, elements: window.failingNodes };
    }
    chrome.devtools.inspectedWindow.eval('(' + retrieveResults + ')()',
                                         { useContentScriptContext: true },
                                         resultsCallback)
};
