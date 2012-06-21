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
    name: 'focusableElementNotVisibleAndNotAriaHidden',
    severity: Severity.Warning,
    relevantNodesSelector: function() {
        return this.auditscope_.querySelectorAll(AccessibilityUtils.focusableElementsSelector);
    },
    test: function(element) {
        if (AccessibilityUtils.isElementOrAncestorHidden(element))
            return false;
        var overlapping = AccessibilityUtils.overlappingElement(element);
        if (overlapping) {
            var style = window.getComputedStyle(overlapping);
            var overlappingElementBg = AccessibilityUtils.getElementBgColor(style, overlapping);
            if (overlappingElementBg && overlappingElementBg.alpha > 0)
                return true;
        }
        if (AccessibilityUtils.elementHasZeroArea(element))
            return true;
        var style = window.getComputedStyle(element);
        if (style.opacity == 0)
            return true;
    },
    code: 'AX_CLICK_01',
    ruleName: 'These elements are focusable but either invisible or obscured by another element.',
    resultsDetails: 'The aria-hidden ARIA attribute hides elements from assistive technology ' +
        'like screen readers.',
    url: 'https://code.google.com/a/google.com/p/accessibility-developer-tools/wiki/AuditRules#AX_FOCUS_01:_These_elements_are_focusable_but_either_invisible_o'
});
