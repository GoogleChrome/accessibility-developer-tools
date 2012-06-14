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
        var focusableElements = this.auditscope_.querySelectorAll(AccessibilityUtils.focusableElementsSelector);
        if (!focusableElements.length)
          return focusableElements;

        var nonvisibleFocusableElements = [];
        for (var i = 0; i < focusableElements.length; i++) {
          var element = focusableElements[i];
          if (AccessibilityUtils.isElementOrAncestorHidden(element))
            continue;
          var overlapping = AccessibilityUtils.overlappingElement(element);
          if (overlapping) {
            var style = window.getComputedStyle(overlapping);
            var overlappingElementBg = AccessibilityUtils.getElementBgColor(style, overlapping);
            if (overlappingElementBg && overlappingElementBg.alpha > 0) {
              nonvisibleFocusableElements.push(element);
              continue;
            }
          }
          if (AccessibilityUtils.elementHasZeroArea(element))
            nonvisibleFocusableElements.push(element);
        }
        return nonvisibleFocusableElements;
    },
    test: function(element) {
        return !element.hasAttribute('aria-hidden') ||
               !element.getAttribute('aria-hidden');
    }
});
