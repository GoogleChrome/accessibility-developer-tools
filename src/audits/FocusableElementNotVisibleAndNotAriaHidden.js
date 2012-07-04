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
goog.require('axs.constants.Severity');
goog.require('axs.utils');

axs.AuditRules.addRule({
    name: 'focusableElementNotVisibleAndNotAriaHidden',
    severity: axs.constants.Severity.Warning,
    relevantNodesSelector: function(scope) {
        return scope.querySelectorAll(axs.utils.FOCUSABLE_ELEMENTS_SELECTOR);
    },
    test: function(element) {
        if (axs.utils.isElementOrAncestorHidden(element))
            return false;
        var overlapping = axs.utils.overlappingElement(element);
        if (overlapping) {
            var style = window.getComputedStyle(overlapping, null);
            var overlappingElementBg = axs.utils.getBgColor(style, overlapping);
            if (overlappingElementBg && overlappingElementBg.alpha > 0)
                return true;
        }
        if (axs.utils.elementHasZeroArea(element))
            return true;
        var style = window.getComputedStyle(element, null);
        if (style.opacity == 0)
            return true;
        return false;
    },
    code: 'AX_FOCUS_01'
});
