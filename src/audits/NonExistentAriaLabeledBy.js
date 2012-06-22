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
    name: 'nonExistentAriaLabelledbyElement',
    severity: Severity.Warning,
    relevantNodesSelector: function() {
        return this.auditscope_.querySelectorAll('[aria-labelledby]');
    },
    test: function(element) {
        var labelledBy = element.getAttribute('aria-labelledby');
        var labelledByValues = labelledBy.split(/\s+/);
        for (var i = 0; i < labelledByValues.length; i++) {
            var labelElement = document.getElementById(labelledByValues[i]);
            if (!labelElement)
                return true;
        }
        return false;
    },
    code: 'AX_ARIA_02',
    ruleName: 'aria-labelledby attributes should refer to an element which exists in the DOM',
    resultsDetails: 'When the element that uses the aria-labelledby attribute is accessed by assistive technology ' +
        ' the element id used as the value must exist in the DOM.',
    url: 'https://code.google.com/a/google.com/p/accessibility-developer-tools/wiki/AuditRules#AX_ARIA_02:__aria-labelledby_attributes_should_refer_to_an_eleme'
});
