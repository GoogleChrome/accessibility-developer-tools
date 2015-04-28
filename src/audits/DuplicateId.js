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

goog.require('axs.AuditRules');
goog.require('axs.browserUtils');
goog.require('axs.constants.Severity');

/**
 * This audit checks for duplicate IDs in the DOM.
 */
axs.AuditRules.addRule({
    name: 'duplicateId',
    heading: 'An element\'s ID must be unique in the DOM',
    url: 'https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#ax_html_02',
    severity: axs.constants.Severity.SEVERE,
    relevantElementMatcher: function(element) {
        return axs.browserUtils.matchSelector(element, '[id]');
    },
    test: function(element) {
        /*
         * Checks for duplicate IDs within the context of this element.
         * This is not a pure a11y check however IDREF attributes in ARIA and HTML (label 'for', td 'headers)
         *    depend on IDs being correctly implemented.
         * While we could limit this audit to IDs which are actually referred to via any IDREF attribute
         *    that would be incomplete, because naturally many of these attributes change over time e.g.
         *    'aria-activedescendant' is likely to change over time and therefore safer to vet them all.
         */
        var id = element.id;
        if (!id) {
            return false;  // Is an empty ID even an ID? I think not.
        }
        var selector = "[id='" + id.replace(/'/g, "\\'") + "']";
        var elementsWithId = element.ownerDocument.querySelectorAll(selector);
        return (elementsWithId.length > 1);
    },
    code: 'AX_HTML_02'
});
