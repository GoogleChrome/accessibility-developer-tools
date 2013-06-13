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

/**
 * @type {axs.AuditRule.Spec}
 */
axs.AuditRule.specs.unfocusableElementsWithOnClick = {
    name: 'unfocusableElementsWithOnClick',
    heading: 'Elements with onclick handlers must be focusable',
    url: 'https://code.google.com/p/accessibility-developer-tools/wiki/AuditRules#AX_FOCUS_02:_Elements_with_onclick_handlers_must_be_focusable',
    severity: axs.constants.Severity.WARNING,
    opt_requiresConsoleAPI: true,
    relevantNodesSelector: function(scope) {
        var potentialOnclickElements = scope.querySelectorAll('*');

        var unfocusableClickableElements = [];
        for (var i = 0; i < potentialOnclickElements.length; i++) {
            var element = potentialOnclickElements[i];
            if (element instanceof element.ownerDocument.defaultView.HTMLBodyElement)
                continue;
            if (axs.utils.isElementOrAncestorHidden(element))
                continue;
            var eventListeners = getEventListeners(element);
            if ('click' in eventListeners)
                unfocusableClickableElements.push(element);
        }
        return unfocusableClickableElements;
    },
    test: function(element) {
        return !element.hasAttribute('tabindex') &&
               !axs.utils.isElementImplicitlyFocusable(element);
    },
    code: 'AX_FOCUS_02'
};
