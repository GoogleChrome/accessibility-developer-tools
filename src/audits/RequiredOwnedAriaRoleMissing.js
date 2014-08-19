// Copyright 2014 Google Inc.
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
goog.require('axs.constants');

/**
 * @type {axs.AuditRule.Spec}
 */
axs.AuditRule.specs.requiredOwnedAriaRoleMissing = {
    name: 'requiredOwnedAriaRoleMissing',
    heading: 'Elements with ARIA roles must ensure required owned elements are present',
    url: '',
    severity: axs.constants.Severity.SEVERE,
    relevantElementMatcher: function(element) {
        return axs.browserUtils.matchSelector(element, '[role]');
    },
    test: function(element) {
        /*
         * Checks that this element contains everything it "must contain".
         * TODO(RickSBrown): cater for ownership by another container? For example this case:
         *    menu > menu > menuitem
         *    both menus will pass because they contain a menuitem but should the outer menu fail?
         *    Handling this would require a significant rewrite of this audit.
         */
        var role = axs.utils.getAriaRole(element);
        if (!role) {  // if it does not have a role (impossible) or the role is an empty string (possible)
            return false;
        }
        var ariaRole = axs.constants.ARIA_ROLES[role];
        if (!ariaRole) {  // if this is not a known ARIA role
            return false;
        }
        var busy = element.getAttribute('aria-busy');
        if (busy === 'true') {  // In future this will lower the severity of the warning instead
            return false;  // https://github.com/GoogleChrome/accessibility-developer-tools/issues/101
        }
        var required = ariaRole['mustcontain'];
        if (!required || required.length === 0) {  // if there are no 'required owned elements' for this role
            return false;
        }
        for (var i = required.length - 1; i >= 0; i--) {
             var descendants = axs.utils.findDescendantsWithRole(element, required[i]);
             if (descendants && descendants.length) {  // if we found at least one descendant with a required role
                 return false;
             }
         }
         // if we get to this point our element has 'required owned elements' but it does not own them implicitly in the DOM
         var ownedElements = axs.utils.getIdReferents('aria-owns', element);
         for (var i = ownedElements.length - 1; i >= 0; i--) {
             var ownedElement = ownedElements[i];
             var ownedElementRole = axs.utils.getAriaRole(ownedElement, true);
             for (var j = required.length - 1; j >= 0; j--) {
                 if(ownedElementRole === required[j]) {  // if this explicitly owned element has a required role
                     return false;
                 }
             }
         }
         return true;  // if we made it here then we did not find the required owned elements in the DOM
    },
    code: 'AX_ARIA_08'
};
