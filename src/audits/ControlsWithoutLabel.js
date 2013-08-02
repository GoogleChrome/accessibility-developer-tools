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
axs.AuditRule.specs.controlsWithoutLabel = {
    name: 'controlsWithoutLabel',
    heading: 'Controls and media elements should have labels',
    url: 'https://code.google.com/p/accessibility-developer-tools/wiki/AuditRules#AX_TEXT_01:_Controls_and_media_elements_should_have_labels',
    severity: axs.constants.Severity.SEVERE,
    relevantNodesSelector: function(scope) {
        var controlsSelector = ['input:not([type="hidden"]):not([disabled])',
                                'select:not([disabled])',
                                'textarea:not([disabled])',
                                'button:not([disabled])',
                                'video:not([disabled])'].join(', ');
        return scope.querySelectorAll(controlsSelector);
    },
    test: function(control) {
        if (axs.utils.isElementOrAncestorHidden(control))
            return false;
        if (control.tagName.toLowerCase() == 'input' &&
            control.type == 'button' &&
            control.value.length) {
            return false;
        }
        if (control.tagName.toLowerCase() == 'button') {
            var innerText = control.textContent.replace(/^\s+|\s+$/g, '');
            if (innerText.length)
                return false;
        }
        if (!axs.utils.hasLabel(control))
            return true;
        return false;
    },
    code: 'AX_TEXT_01',
    ruleName: 'Controls and media elements should have labels'
};
