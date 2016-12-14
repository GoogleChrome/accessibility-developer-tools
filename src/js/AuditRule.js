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

goog.require('axs.browserUtils');
goog.require('axs.constants');
goog.require('axs.dom');

goog.provide('axs.AuditRule');
goog.provide('axs.AuditRule.Spec');

/**
 * @constructor
 * @param {axs.AuditRule.Spec} spec
 */
axs.AuditRule = function(spec) {
    var requires = spec.opt_requires || {};
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

    /**
     * Is this element relevant to this audit?
     * @param {Element} element A potential audit candidate.
     * @param {Object} flags
     * @return {boolean} true if this element is relevant to this audit.
     */
    this.relevantElementMatcher_ = spec.relevantElementMatcher;

    /**
     * If the relevantElementMatcher is not enough to determine whether or not this rule should run
     * then this function can be called (after DOM traversal is finished).
     * @param {Element} element A potential audit candidate.
     * @param {Object} flags
     * @return {boolean} true if this element is relevant to this audit.
     */
    this.isRelevant_ = spec.isRelevant || function(element, flags) {  // eslint-disable-line no-unused-vars
        return true;
    };

    /**
     * The actual audit function.
     * @param {Element} element The element under test.
     * @param {Object} flags
     * @param {Object=} config
     * @return {boolean} true if this audit finds a problem.
     */
    this.test_ = spec.test;

    /** @type {string} */
    this.code = spec.code;

    /** @type {string} */
    this.heading = spec.heading || '';

    /** @type {string} */
    this.url = spec.url || '';

    /** @type {boolean} */
    this.requiresConsoleAPI = !!requires.consoleAPI;

    /** @type {Array.<axs.AuditRule.RelevantElement>} */
    this.relevantElements = [];

    /** @type {Array.<axs.AuditRule.RelevantElement>} */
    this.relatedElements = [];

    /**
     * An audit can indicate that the DOM traversal should capture ID refs on its behalf.
     * This is a performance enhancement which prevents multiple audits from having to call
     * `axs.utils.getReferencedIds` on the same element during DOM traversal.
     *
     * @type {boolean}
     */
    this.collectIdRefs = requires.idRefs || false;
};

/**
 * Note that opt_requires may have any of the following optional properties:
 *    idRefs: boolean, (true if the rule needs idRefs collected for it)
 *    consoleAPI: boolean (true if the rule needs the console API)
 *
 * @typedef {{ name: string,
 *              heading: string,
 *              url: string,
 *              severity: axs.constants.Severity,
 *              relevantElementMatcher: function(Element, Object): boolean,
 *              test: function(Element, Object, Object=): boolean,
 *              code: string,
 *              opt_requires: Object }} */
axs.AuditRule.SpecWithRequires;

/** @typedef {{ name: string,
 *              heading: string,
 *              url: string,
 *              severity: axs.constants.Severity,
 *              relevantElementMatcher: function(Element, Object): boolean,
 *              test: function(Element, Object, Object=): boolean,
 *              code: string }} */
axs.AuditRule.SpecWithoutRequires;

/** @typedef {(axs.AuditRule.SpecWithRequires|axs.AuditRule.SpecWithoutRequires)} */
axs.AuditRule.Spec;

/**
 * When storing "relevant" or "related" elements during the DOM traversal phase
 * also hold the flags for that element.
 * @typedef {{element: Element, flags: Object}}
 * */
axs.AuditRule.RelevantElement;

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
  * Collect elements relevant to this rule.
  * @param {Element} element
  * @param {Object} flags Fast lookup for various element states.
  */
axs.AuditRule.prototype.collectMatchingElement = function(element, flags) {
    if (this.relevantElementMatcher_(element, flags) && flags.inScope) {
        this.relevantElements.push({
            element: element,
            flags: flags
        });
        return true;
    }
    return false;
};

/**
 * Determine if the current rule can be run based on the current configuration.
 * @param {axs.AuditConfiguration} configuration Used to determine if this rule can run.
 * @returns {boolean} true if the rule can run.
 */
axs.AuditRule.prototype.canRun = function(configuration) {
    if (this.disabled) {
        return false;
    }
    if (!configuration.withConsoleApi && this.requiresConsoleAPI) {
        return false;
    }
    return true;
};

/**
 * Represents the result of an AuditRule.
 * @constructor
 */
axs.AuditRule.Result = function(configuration, auditRule) {
    var ruleValues = axs.utils.namedValues(auditRule);
    ruleValues.severity = configuration.getSeverity(auditRule.name) || ruleValues.severity;
    this.rule = ruleValues;
    this.maxResults = configuration.maxResults;
    this.update(axs.constants.AuditResult.NA);
};

/**
 * Process a new audit result and update the overall state consistent with the following constraints:
 *    NA > PASS > FAIL
 * In other words:
 *    NA can become PASS or FAIL
 *    PASS can become FAIL
 *    FAIL cannot be changed
 * @param {axs.constants.AuditResult} auditResult The result of the current test.
 * @param {Element=} element The element responsible for the test result, required if the result is FAIL.
 */
axs.AuditRule.Result.prototype.update = function(auditResult, element) {
    var result = this;
    if (auditResult === axs.constants.AuditResult.FAIL) {
        var failingElements = result.elements || (result.elements = []);
        result.result = auditResult;  // If FAIL then we change the result to FAIL no matter what it is
        if (this.maxResults && result.elements.length >= this.maxResults) {
            result.resultsTruncated = true;
        } else if (element) {
            // element should always be defined here but testing first avoids pushing undefined onto the array
            failingElements.push(element);
        }
    } else if (auditResult === axs.constants.AuditResult.PASS) {
        if (!result.elements)
            result.elements = [];
        if (result.result !== axs.constants.AuditResult.FAIL)
            result.result = auditResult;  // If PASS then we change result only if it is not already FAIL
    } else if (!result.result) {
        result.result = auditResult;
    }
};

/**
 * Run this AuditRule against any relevant elements it has collected during the DOM traversal phase.
 * @param {axs.AuditConfiguration} configuration Configuration for this run.
 * @return {axs.AuditRule.Result}
 */
axs.AuditRule.prototype.run = function(configuration) {
    try {
        var options = this._options || {};
        var result = new axs.AuditRule.Result(configuration, this);
        var next;
        while ((next = this.relevantElements.shift())) {
            var element = next.element;
            var flags = next.flags;
            if (this.isRelevant_(element, flags)) {
                if (this.test_(element, flags, options.config)) {
                    result.update(axs.constants.AuditResult.FAIL, element);
                } else {
                    result.update(axs.constants.AuditResult.PASS, element);
                }
            }
        }
        return result;
    } finally {
        this.relatedElements.length = 0;
    }
};
