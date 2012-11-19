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

goog.require('axs.AuditRule');
goog.require('base');

goog.provide('axs.ExtensionAuditRule');


/**
 * @extends {axs.AuditRule}
 * @constructor
 * @param {Object} spec A spec of the form
 *     { name: string,
 *       severity: Severity,
 *       relevantNodesSelector: function(): Array.<node>|NodeList|XPathResult,
 *       test: function(node): boolean,
 *       code: string,
 *       opt_requiresConsoleAPI: boolean }.
 */
axs.ExtensionAuditRule = function(spec) {
    axs.AuditRule.call(this, spec);

    /** @type {boolean} */
    this.shouldRunInDevtools = !!spec['opt_requiresConsoleAPI'];
};
base.inherits(axs.ExtensionAuditRule, axs.AuditRule);

/**
 * Add the given node to the given array. This is to abstract calls to
 * convertNodeToResult() away from the main code.
 * @param {Array.<Node>} nodes
 * @param {Node} node
 */
axs.ExtensionAuditRule.prototype.addNode = function(nodes, node) {
    nodes.push(axs.content.convertNodeToResult(node));
};

axs.ExtensionAuditRule.prototype.runInDevtools = function(resultsCallback) {
    var extensionId = chrome.i18n.getMessage("@@extension_id"); // yes, really.
    var uniqueEventName = extensionId + '-' + this.name;

    function addEventListener(uniqueEventName, test) {
        function handleEventListenersEvent(event) {
            var element = event.target;
            window.relevantNodes.push(element);
            if (test(element))
                this.addNode(window.failingNodes, element);
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
