// Copyright 2015 Google Inc.
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
goog.require('axs.constants.Severity');

axs.AuditRules.addRule({
    name: 'pageWithBadTitle',
    heading: 'The web page should have a title less than 66 characters long and does not contain bad characters',
    url: 'https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#TODO-WIKIENTRY',
    severity: axs.constants.Severity.WARNING,
    relevantElementMatcher: function(element) {
        return element.tagName.toLowerCase() == "title";
    },
    test: function(scope) {
        // test length of title
        if (document.title.length >= 66)
          return true;
        // test if last char of title is '.'
        if (document.title.slice(-1) === '.')
          return true;
        // tests if title contains illegal chars
        if (document.title.indexOf('-') === -1)
          return true;
        if (document.title.indexOf('/') === -1)
          return true;
        if (document.title.indexOf('\\') === -1)
          return true;
        return false;
    },
    code: 'AX_TITLE_02'
});
