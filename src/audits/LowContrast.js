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
    }
});
