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
goog.require('axs.constants');
goog.require('axs.utils');

axs.AuditRule.specs.badAriaAttributeValue = {
    name: 'badAriaAttributeValue',
    severity: axs.constants.Severity.Severe,
    relevantNodesSelector: function(scope) {
        var selector = '';
        for (var property in axs.constants.ARIA_PROPERTIES)
            selector += '[aria-' + property + '],';
        selector = selector.substring(0, selector.length - 1);  // trailing comma
        console.log('selector', selector);
        return scope.querySelectorAll(selector);
    },
    test: function(element) {
        console.log('checking', element);
        for (var property in axs.constants.ARIA_PROPERTIES) {
            var ariaProperty = 'aria-' + property;
            console.log('property', ariaProperty);
            if (!element.hasAttribute(ariaProperty))
                continue;
            var propertyValueText = element.getAttribute(ariaProperty);
            var propertyValue = axs.utils.getAriaPropertyValue(ariaProperty, propertyValueText, element);
            console.log('propertyValue', propertyValue, propertyValueText);
            if (!propertyValue.valid)
                return true;
        }
        return false;
    },
    code: 'AX_ARIA_04'
};
