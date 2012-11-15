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
goog.require('axs.constants.Severity');
goog.require('axs.utils');

axs.AuditRule.specs.focusableElementNotVisibleAndNotAriaHidden = {
    name: 'focusableElementNotVisibleAndNotAriaHidden',
    severity: axs.constants.Severity.Warning,
    relevantNodesSelector: function(scope) {
        return scope.querySelectorAll(axs.utils.FOCUSABLE_ELEMENTS_SELECTOR);
    },
    test: function(element) {
        if (axs.utils.isElementOrAncestorHidden(element))
            return false;
        return !axs.utils.elementIsVisible(element)
    },
    code: 'AX_FOCUS_01'
};
