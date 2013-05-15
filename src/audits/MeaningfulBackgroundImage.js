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

goog.require('axs.AuditRule');
goog.require('axs.AuditRules');
goog.require('axs.constants.Severity');
goog.require('axs.utils');

/**
 * @type {axs.AuditRule.Spec}
 */
axs.AuditRule.specs.elementsWithMeaningfulBackgroundImage = {
    name: 'elementsWithMeaningfulBackgroundImage',
    severity: axs.constants.Severity.WARNING,
    relevantNodesSelector: function(scope) {
        var elements = scope.querySelectorAll('*');
        var relevantNodes = [];
        for (var i = 0; i < elements.length; i++) {
            var el = elements[i];
            if (!axs.utils.isElementOrAncestorHidden(el))
                relevantNodes.push(el);
        }
        return relevantNodes;
    },
    heading: 'Meaningful images should not be used in element backgrounds',
    url: 'https://code.google.com/p/accessibility-developer-tools/wiki/AuditRules?ts=1368336558&updated=AuditRules#AX_IMAGE_01:_Meaningful_images_should_not_be_used_in_element_bac',
    test: function(el) {
        if (el.textContent && el.textContent.length > 0) {
          return false;
        }
        var style = window.getComputedStyle(el, null);
        var bgImage = style.backgroundImage;
        if (!bgImage || (bgImage === 'undefined' || bgImage === 'none')) {
          return false;
        }
        var width = parseInt(style.width, 10);
        var height = parseInt(style.height, 10);
        // TODO(bobbrose): could also check for background repeat and position.
        return width < 150 && height < 150;
    },
    code: 'AX_IMAGE_01'
};
