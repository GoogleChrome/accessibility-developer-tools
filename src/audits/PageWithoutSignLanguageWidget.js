// Copyright 2013 Google Inc.
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

goog.require("axs.AuditRules");
goog.require("axs.constants.Severity");

axs.AuditRules.addRule({
  name: "pageWithoutSignLanguageWidget",
  heading: "The web page should have a sign language widget",
  url: "https://mindrocketsinc.com/main/",
  severity: axs.constants.Severity.WARNING,
  relevantElementMatcher: function (element) {
    return element.tagName.toLowerCase() == "html";
  },
  test: function (scope) {
    var signLanguageWidget = scope.querySelectorAll("#DeafTranslate");
    if (signLanguageWidget.length) return false;
    signLanguageWidget = scope.querySelectorAll("#SignLanguage");
    if (signLanguageWidget.length) return false;
    signLanguageWidget = scope.querySelectorAll(".sign-language");
    if (signLanguageWidget.length) return false;
    signLanguageWidget = scope.querySelectorAll(".mr-tooltip");
    if (signLanguageWidget.length) return false;
    signLanguageWidget = scope.querySelectorAll("[alt='DEAF']");
    if (signLanguageWidget.length) return false;

    signLanguageWidget = scope.querySelectorAll(
      'script[src*="/integrator.js"],script[src*="/tooltip_add.js"],script[src*="/signsplayer.js"]'
    );
    return !signLanguageWidget.length;
  },
  code: "AX_SIGNLANG_01",
});
