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
goog.require('axs.AuditRule');
goog.require('axs.AuditRules');
goog.require('axs.constants.Severity');

axs.AuditRule.specs.nonExistentAriaLabelledbyElement = {
    name: 'nonExistentAriaLabelledbyElement',
    severity: axs.constants.Severity.Warning,
    relevantNodesSelector: function(scope) {
        return scope.querySelectorAll('[aria-labelledby]');
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
    code: 'AX_ARIA_02'
};
