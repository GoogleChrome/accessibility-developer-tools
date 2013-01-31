
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

goog.require('axs.AuditRules');
goog.require('axs.utils');

goog.provide('axs.Audit');
goog.provide('axs.AuditConfiguration');

/**
 * Object to hold configuration for an Audit run.
 * @constructor
 */
axs.AuditConfiguration = function() {
  /**
   * Dictionary of { audit rule name : { rules } } where rules is a dictionary
   * of { rule type : value }.
   * Possible rule types:
   * - ignore: value is a list of CSS selectors representing parts of the page
   *           which can be ignored for this audit rule.
   * @type {Object}
   */
  this.rules_ = {};

  /**
   * Whether this audit run can use the console API.
   * @type {boolean}
   */
  this.withConsoleApi = false;
};

axs.AuditConfiguration.prototype = {
  /**
   * Add the given nodes to the ignore list for the given audit rule.
   * @param {string} auditRuleName The name of the audit rule
   * @param {Array.<string>} selectors Query selectors to match nodes to
   *     ignore
   */
  ignoreSelectors: function(auditRuleName, selectors) {
    if (!(auditRuleName in this.rules_))
        this.rules_[auditRuleName] = {};
    if (!('ignore' in this.rules_[auditRuleName]))
        this.rules_[auditRuleName].ignore = [];
    Array.prototype.push.call(this.rules_[auditRuleName].ignore, selectors);
  },

  getIgnoreSelectors: function(auditRuleName) {
    if ((auditRuleName in this.rules_) &&
        ('ignore' in this.rules_[auditRuleName])) {
        return this.rules_[auditRuleName].ignore;
    }
    return [];
  }
};

/**
 * Runs an audit with all of the audit rules.
 * @param {axs.AuditConfiguration=} opt_configuration
 * @return {Array.<Object>} Array of Object:
 *     {
 *       result,    // @type {axs.constants.AuditResult}
 *       elements,  // @type {Array.<Element>}
 *       rule       // @type {axs.AuditRule} - data only (name, severity, code)
 *     }
 */
axs.Audit.run = function(opt_configuration) {
    var configuration = opt_configuration || new axs.AuditConfiguration();
    var withConsoleApi = configuration.withConsoleApi;
    var results = [];

    for (var auditRuleName in axs.AuditRule.specs) {
        var auditRule = axs.AuditRules.getRule(auditRuleName);
        if (!auditRule)
            continue; // Shouldn't happen, but fail silently if it does.
        if (auditRule.disabled)
            continue;
        if (!withConsoleApi && auditRule.requiresConsoleAPI)
            continue;

        var ignoreSelectors = configuration.getIgnoreSelectors(auditRule.name);
        var result = auditRule.run(ignoreSelectors);
        result.rule = axs.utils.namedValues(auditRule);
        results.push(result);
    }

    return results;
};

/**
 * Create a report based on the results of an Audit.
 * @param {Object} results The results returned from axs.Audit.run();
 */
axs.Audit.createReport = function(results) {
    var message = '*** Begin accessibility audit results ***';
    message += '\nAn accessibility audit found ';

    var numWarnings = 0;
    var warningsMessage = '';
    var numErrors = 0;
    var errorsMessage = '';

    for (var i = 0; i < results.length; i++) {
        var result = results[i];
        if (result.rule.severity == axs.constants.Severity.Severe) {
            numErrors++;
            errorsMessage += '\n\n' +
                             axs.Audit.accessibilityErrorMessage(result);
        } else {
            numWarnings++;
            warningsMessage += '\n\n' +
                               axs.Audit.accessibilityErrorMessage(result);
        }
    }

    if (numErrors > 0) {
        message += numErrors + (numErrors == 1 ? ' error ' : ' errors ');
        if (numWarnings > 0)
             message += 'and ';
    }
    if (numWarnings > 0) {
        message += numWarnings +
            (numWarnings == 1 ? ' warning ' : ' warnings ');
    }
    message += 'on this page.\n';
    message += 'For more information, please see ' +
       'http://chromium.org/developers/accessibility/webui-accessibility-audit';

    message += errorsMessage;
    message += warningsMessage;

    message += '\n*** End accessibility audit results ***';
    return message;
};

/**
 * Creates an error message for a given accessibility audit result object.
 * @param {Object.<string, (string|Array.<Element>)>} result The result
 *     object returned from the audit.
 * @return {string} An error message describing the failure and listing the
 *     query selectors for up to five elements which failed the audit rule.
 */
axs.Audit.accessibilityErrorMessage = function(result) {
    if (result.rule.severity == axs.constants.Severity.Severe)
        var message = 'Error: '
    else
        var message = 'Warning: '
    message += result.rule.name + ' (' + result.rule.code + 
        ') failed on the following ' +
        (result.elements.length == 1 ? 'element' : 'elements');

    if (result.elements.length == 1)
        message += ':'
    else {
        message += ' (1 - ' + Math.min(5, result.elements.length) +
                   ' of ' + result.elements.length + '):';
    }

    var maxElements = Math.min(result.elements.length, 5);
    for (var i = 0; i < maxElements; i++)
        message += '\n' + axs.utils.getQuerySelectorText(result.elements[i]);
    return message;
};
