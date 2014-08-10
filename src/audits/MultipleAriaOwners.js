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

/**
 * @type {axs.AuditRule.Spec}
 */
axs.AuditRule.specs.multipleAriaOwners = {
    name: 'multipleAriaOwners',
    heading: 'an element\'s ID must not be present in more that one aria-owns attribute at any time',
    url: 'https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#-ax_aria_07--an-element-can-have-only-one-explicit-aria-owner',
    severity: axs.constants.Severity.WARNING,
    relevantElementMatcher: function(element) {
        return axs.browserUtils.matchSelector(element, '[aria-owns]');//could instead match every element that has an ID attribute
    },
    test: function(element) {
        var result = false;
        var owns = element.getAttribute('aria-owns');
        var ownsValues = owns.split(/\s+/);
        for (var i = 0; i < ownsValues.length; i++) {
            var ownedElement = document.getElementById(ownsValues[i]);
            if (ownedElement)
            {
                var owners = axs.utils.getIdReferrers("aria-owns", ownedElement);
                if(owners.length > 1)
                {
                    result = true;
                    break;
                }
            }
        }
        return result;
    },
    code: 'AX_ARIA_07'
};