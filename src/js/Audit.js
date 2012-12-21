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

goog.provide('axs.Audit');
goog.provide('axs.AuditConfiguration');

/**
 * Object to hold configuration for an Audit run.
 * @constructor
 */
axs.AuditConfiguration = function() {
};

axs.AuditConfiguration.prototype = {
  rules_: {},
  withConsoleApi: false,

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
 * @return {Array.<Object>} Array of Object: result (boolean) and elements
 * (array of elements).
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
        result.rule = auditRule;
        results.push(result);
    }

    return results;
};
