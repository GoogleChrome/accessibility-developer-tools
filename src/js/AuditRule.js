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

goog.provide('axs.AuditRule');

/**
 * @constructor
 * @param {Object} spec A spec of the form
 *     { name: string,
 *       severity: Severity,
 *       relevantNodesSelector: function(): Array.<node>|NodeList|XPathResult,
 *       test: function(node): boolean,
 *       code: string,
 *       opt_requiresConsoleAPI: boolean }.
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

    /** @type {string} */
    this.code = spec.code;

    /** @type {boolean} */
    this.requiresConsoleAPI = !!spec['opt_requiresConsoleAPI'];
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
 * Add the given node to the given array.  This is abstracted so that subclasses
 * can modify the node value as necessary.
 * @param {Array.<Node>} nodes
 * @param {Node} node
 */
axs.AuditRule.prototype.addNode = function(nodes, node) {
    nodes.push(node);
};

/**
 * @param {Array.<string>=} opt_ignoreSelectors
 * @param {Element=} opt_scope The scope in which the node selector should run.
 *     Defaults to `document`.
 * @return {?Object.<string, (axs.constants.AuditResult|?Array.<Node>)>}
 */
axs.AuditRule.prototype.run = function(opt_ignoreSelectors, opt_scope) {
    var ignoreSelectors = opt_ignoreSelectors || [];
    var scope = opt_scope || document;

    var relevantNodes = this.relevantNodesSelector_(scope);

    var failingNodes = [];

    function ignored(node) {
        for (var i = 0; i < ignoreSelectors.length; i++) {
          if (node.webkitMatchesSelector(ignoreSelectors[i]))
            return true;          
        }
        return false;
    }

    if (relevantNodes instanceof XPathResult) {
        if (relevantNodes.resultType == XPathResult.ORDERED_NODE_SNAPSHOT_TYPE) {
            if (!relevantNodes.snapshotLength)
                return axs.AuditRule.NOT_APPLICABLE;

            for (var i = 0; i < relevantNodes.snapshotLength; i++) {
                var node = relevantNodes.snapshotItem(i);
                if (this.test_(node) && !ignored(node))
                    this.addNode(failingNodes, node);
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
            if (this.test_(node) && !ignored(node))
                this.addNode(failingNodes, node);
        }
    }
    var result = failingNodes.length ? axs.constants.AuditResult.FAIL : axs.constants.AuditResult.PASS;
    return { result: result, elements: failingNodes };
};

axs.AuditRule.specs = {};
