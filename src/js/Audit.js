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
goog.require('axs.AuditRules');

goog.provide('axs.Audit');
/**
 * Runs an audit with all of the audit rules.
 * @param {boolean=} opt_withConsoleApi Whether to allow the console api.
 * Defaults to false.
 * @return {Array.<Object>} Array of Object: result (boolean) and elements
 * (array of elements).
 */
axs.Audit.run = function(opt_withConsoleApi) {
    var withConsoleApi = !!opt_withConsoleApi;
    var results = [];

    for (var auditRuleName in axs.AuditRule.specs) {
        var auditRule = axs.AuditRules.getRule(auditRuleName);
        if (!auditRule)
            continue; // Shouldn't happen, but fail silently if it does.
        if (auditRule.disabled)
            continue;
        if (!withConsoleApi && auditRule.requiresConsoleAPI)
            continue;

        var result = auditRule.run();
        result.rule = auditRule;
        results.push(result);
    }

    return results;
};
