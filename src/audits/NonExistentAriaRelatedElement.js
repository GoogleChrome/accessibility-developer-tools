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
goog.require('axs.browserUtils');
goog.require('axs.constants.Severity');
goog.require('axs.utils');

/**
 * Attributes which refer to other elements by ID should refer to elements which exist in the DOM'.
 */
axs.AuditRules.addRule({
    name: 'nonExistentRelatedElement',
    heading: 'Attributes which refer to other elements by ID should refer to elements which exist in the DOM',
    url: 'https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#ax_html_03',
    severity: axs.constants.Severity.SEVERE,
    opt_requires: {
        idRefs: true
    },
    relevantElementMatcher: function(element, flags) {
        return flags.idrefs.length > 0;
    },
    test: function(element, flags) {
        var idRefs = flags.idrefs;
        var missing = idRefs.some(function(id) {
            var refElement = document.getElementById(id);
            return !refElement;
        });
        return missing;
    },
    code: 'AX_HTML_03'
});
