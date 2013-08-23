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
goog.require('axs.browserUtils');

goog.provide('axs.AuditRule');
goog.provide('axs.AuditRule.Spec');

/**
 * @constructor
 * @param {axs.AuditRule.Spec} spec
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

    /** @type {function(Element): boolean} */
    this.relevantElementMatcher_ = spec.relevantElementMatcher;

    /** @type {function(Element): boolean} */
    this.test_ = spec.test;

    /** @type {string} */
    this.code = spec.code;

    /** @type {string} */
    this.heading = spec.heading || '';

    /** @type {string} */
    this.url = spec.url || '';

    /** @type {boolean} */
    this.requiresConsoleAPI = !!spec['opt_requiresConsoleAPI'];
};

/** @typedef {{ name: string,
 *              heading: string,
 *              url: string,
 *              severity: axs.constants.Severity,
 *              relevantElementMatcher: function(Element): boolean,
 *              test: function(Element): boolean,
 *              code: string,
 *              opt_requiresConsoleAPI: boolean }} */
axs.AuditRule.SpecWithConsoleAPI;

/** @typedef {{ name: string,
 *              heading: string,
 *              url: string,
 *              severity: axs.constants.Severity,
 *              relevantElementMatcher: function(Element): boolean,
 *              test: function(Element): boolean,
 *              code: string }} */
axs.AuditRule.SpecWithoutConsoleAPI;

/** @typedef {(axs.AuditRule.SpecWithConsoleAPI|axs.AuditRule.SpecWithoutConsoleAPI)} */
axs.AuditRule.Spec;

/**
 * @const
 */
axs.AuditRule.requiredFields =
    [ 'name', 'severity', 'relevantElementMatcher', 'test', 'code', 'heading' ];


/**
 * The return value for a non-applicable audit result.
 *
 * @type {{result: string}}
 * @const
 */
axs.AuditRule.NOT_APPLICABLE = { result: axs.constants.AuditResult.NA };

/**
 * Add the given element to the given array.  This is abstracted so that subclasses
 * can modify the element value as necessary.
 * @param {Array.<Element>} elements
 * @param {Element} element
 */
axs.AuditRule.prototype.addElement = function(elements, element) {
    elements.push(element);
};

/**
 * Recursively collect elements which match |matcher| into |collection|,
 * starting at |node|.
 * @param {Node} node
 * @param {function(Element): boolean} matcher
 * @param {Array.<Element>} collection
 */
axs.AuditRule.collectMatchingElements = function(node, matcher, collection) {
    if (node.nodeType == Node.ELEMENT_NODE)
        var element = /** @type {Element} */ (node);

    if (element && matcher.call(null, element))
        collection.push(element);

    var child = node.firstChild;
    while (child != null) {
        axs.AuditRule.collectMatchingElements(child,
                                              matcher,
                                              collection);
        child = child.nextSibling;
    }
}

/**
 * @param {Array.<string>=} opt_ignoreSelectors
 * @param {Element=} opt_scope The scope in which the element selector should run.
 *     Defaults to `document`.
 * @return {?Object.<string, (axs.constants.AuditResult|?Array.<Element>)>}
 */
axs.AuditRule.prototype.run = function(opt_ignoreSelectors, opt_scope) {
    var ignoreSelectors = opt_ignoreSelectors || [];
    var scope = opt_scope || document;

    var relevantElements = [];
    axs.AuditRule.collectMatchingElements(scope, this.relevantElementMatcher_, relevantElements);

    var failingElements = [];

    function ignored(element) {
        for (var i = 0; i < ignoreSelectors.length; i++) {
          if (axs.browserUtils.matchSelector(element, ignoreSelectors[i]))
            return true;
        }
        return false;
    }

    if (!relevantElements.length)
        return { result: axs.constants.AuditResult.NA };
    for (var i = 0; i < relevantElements.length; i++) {
        var element = relevantElements[i];
        if (!ignored(element) && this.test_(element))
            this.addElement(failingElements, element);
    }

    var result = failingElements.length ? axs.constants.AuditResult.FAIL : axs.constants.AuditResult.PASS;
    return { result: result, elements: failingElements };
};

axs.AuditRule.specs = {};
