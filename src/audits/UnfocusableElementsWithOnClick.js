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
    name: 'unfocusableElementsWithOnClick',
    severity: Severity.Warning,
    opt_shouldRunInDevtools: true,
    relevantNodesSelector: function() {
        var potentialOnclickElements = document.querySelectorAll('*');

        var unfocusableClickableElements = [];
        for (var i = 0; i < potentialOnclickElements.length; i++) {
            var element = potentialOnclickElements[i];
            if (element instanceof HTMLBodyElement)
                continue;
            if (AccessibilityUtils.isElementOrAncestorHidden(element))
                continue;
            var eventListeners = getEventListeners(element);
            if ('click' in eventListeners)
                unfocusableClickableElements.push(element);
        }
        return unfocusableClickableElements;
    },
    test: function(element) {
        return !element.hasAttribute('tabindex') &&
               !AccessibilityUtils.isElementImplicitlyFocusable(element);
    },
    code: 'AX_FOCUS_02',
});
