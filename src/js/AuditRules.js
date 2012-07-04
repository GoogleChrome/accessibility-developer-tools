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

goog.provide('axs.AuditRules');

goog.require('axs.AuditRule');

if (!axs.AuditRules.rules) {
    /** @type Object.<string, axs.AuditRule> */
    axs.AuditRules.rules = {};
}

/**
 * Adds an audit rule with the given spec to the list of rules.
 * Throws an exception if a rule with the given name already exists.
 * @param {Object} spec A spec of the form specified in axs.AuditRule.
 */
axs.AuditRules.addRule = function(spec) {
    if (spec.code in axs.AuditRules.rules)
        return;

    var auditRule = new axs.AuditRule(spec);
    axs.AuditRules.rules[spec.code] = auditRule;
};
