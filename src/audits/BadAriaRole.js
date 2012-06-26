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

AuditRules.addRule({
    name: 'badAriaRole',
    severity: Severity.Severe,
    relevantNodesSelector: function() {
      return this.auditscope_.querySelectorAll("[role]");
    },
    test: function(element) {
      return !ARIA_ROLES[element.getAttribute('role')];
    },
    code: 'AX_ARIA_01',
    ruleName: 'Elements with ARIA roles must use a valid, non-abstract ARIA role',
    resultsDetails: 'Only valid ARIA roles will be interpreted by assistive technology like ' +
        ' screen readers.',
    url: 'https://code.google.com/p/accessibility-developer-tools/wiki/AuditRules#AX_ARIA_01:_Elements_with_ARIA_roles_must_use_a_valid,_non-abstr'
});
