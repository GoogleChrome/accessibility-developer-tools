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
    name: 'lowContrastElements',
    severity: Severity.Warning,
    relevantNodesSelector: function() {
      return document.evaluate(
          '/html/body//text()[normalize-space(.)!=""]/parent::*[name()!="script"]',
          this.auditscope_,
          null,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          null);
    },
    test: function(element) {
        var style = window.getComputedStyle(element);
        var contrastRatio =
            AccessibilityUtils.getContrastRatioForElementWithComputedStyle(style, element);
        return (contrastRatio && AccessibilityUtils.isLowContrast(contrastRatio, style));
    },
    code: 'AX_COLOR_01',
    ruleName: 'Text elements should have a reasonable contrast ratio',
    resultsDetails: 'Text with a low contrast ratio between text and background may be ' +
        'unreadable to users with low vision, or on some devices. Text elements should ' +
        'have a minimum contrast ratio of at least 4.5:1, or 3:1 for large fonts',
    url: 'https://code.google.com/p/accessibility-developer-tools/wiki/AuditRules#AX_COLOR_01:_Text_elements_should_have_a_reasonable_contrast_rat'
});
