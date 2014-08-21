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
axs.AuditRule.specs.ariaRoleNotScoped = {
    name: 'ariaRoleNotScoped',
    heading: 'Elements with ARIA roles must be in the correct scope',
    url: '',
    severity: axs.constants.Severity.SEVERE,
    relevantElementMatcher: function(element) {
        return axs.browserUtils.matchSelector(element, '[role]');
    },
    test: function(element) {
        /*
         * Checks that this element is in the required scope for its role.
         */
        var elementRole = axs.utils.getRoles(element, {first:true, valid:true});
        if (!elementRole)
            return false;

        var ariaRole = elementRole.details;
        var requiredScope = ariaRole['scope'];
        if (!requiredScope || requiredScope.length === 0) {
            return false;
        }
        var parent = element;
        while ((parent = parent.parentNode)) {
            var parentRole = axs.utils.getRoles(parent, {first:true, valid:true, implicit:true});
            if(parentRole && requiredScope.indexOf(parentRole.name) >= 0) {  // if this ancestor role is one of the required roles
                return false;
            }
        }
        // If we made it this far then no DOM ancestor has a required scope role.
        // Now we need to check if anything aria-owns this element.
        var owners = axs.utils.getIdReferrers('aria-owns', element);  // there can only be ONE explicit owner but that's a different test
        if (owners) {
            for (var i = owners.length; i >= 0; i--) {
                var ownerRole = axs.utils.getRoles(owners[i], {first:true, valid:true, implicit:true});
                if(ownerRole && requiredScope.indexOf(ownerRole.name) >= 0) {  // if the owner role is one of the required roles
                    return false;
                }
            }
        }
        return true;
    },
    code: 'AX_ARIA_09'
};
