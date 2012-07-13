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

goog.provide('axs.utils');
goog.provide('axs.utils.Color');

/**
 * @constant
 * @type {string}
 */
axs.utils.FOCUSABLE_ELEMENTS_SELECTOR =
    'input:not([type=hidden]):not([disabled]),' +
    'select:not([disabled]),' +
    'textarea:not([disabled]),' +
    'button:not([disabled]),' +
    'a[href],' +
    'iframe,' +
    '[tabindex]';

/**
 * @constructor
 * @param {number} red
 * @param {number} green
 * @param {number} blue
 * @param {number} alpha
 */
axs.utils.Color = function(red, green, blue, alpha) {
    /** @type {number} */
    this.red = red;

    /** @type {number} */
    this.green = green;

    /** @type {number} */
    this.blue = blue;

    /** @type {number} */
    this.alpha = alpha;
};

/**
 * Calculate the contrast ratio between the two given colors. Returns the ratio
 * to 1, for example for two two colors with a contrast ratio of 21:1, this
 * function will return 21.
 * @param {axs.utils.Color} fgColor
 * @param {axs.utils.Color} bgColor
 * @return {?number}
 */
axs.utils.calculateContrastRatio = function(fgColor, bgColor) {
    if (!fgColor || !bgColor)
        return null;

    if (fgColor.alpha < 1)
        fgColor = axs.utils.flattenColors(fgColor, bgColor);

    var fgLuminance = axs.utils.calculateLuminance(fgColor);
    var bgLuminance = axs.utils.calculateLuminance(bgColor);
    var contrastRatio = (Math.max(fgLuminance, bgLuminance) + 0.05) /
        (Math.min(fgLuminance, bgLuminance) + 0.05);
    return contrastRatio;
};

/**
 * @param {Element} element
 * @return {boolean}
 */
axs.utils.elementIsTransparent = function(element) {
    return element.style.opacity == '0';
};

/**
 * @param {Element} element
 * @return {boolean}
 */
axs.utils.elementHasZeroArea = function(element) {
    var rect = element.getBoundingClientRect();
    var width = rect.right - rect.left;
    var height = rect.top - rect.bottom;
    if (!width || !height)
        return true;
    return false;
};

/**
 * @param {Element} element
 * @return {boolean}
 */
axs.utils.elementIsOutsideScrollArea = function(element) {
    var rect = element.getBoundingClientRect();
    var scroll_height = document.body.scrollHeight;
    var scroll_width = document.body.scrollWidth;
    var scroll_top = document.body.scrollTop;
    var scroll_left = document.body.scrollLeft;

    if (rect.top >= scroll_height || rect.bottom <= -scroll_top ||
        rect.left >= scroll_width || rect.right <= -scroll_left)
        return true;
    return false;
};

/**
 * @param {Element} element
 * @return {?Element}
 */
axs.utils.overlappingElement = function(element) {
    if (axs.utils.elementHasZeroArea(element))
        return null;

    var rect = element.getBoundingClientRect();
    var center_x = (rect.left + rect.right) / 2;
    var center_y = (rect.top + rect.bottom) / 2;
    var element_at_point = document.elementFromPoint(center_x, center_y);

    function isAncestor(ancestor, node) {
        if (node == null)
            return false;
        if (node === ancestor)
            return true;

        return isAncestor(ancestor, node.parentNode);
    }

    if (element_at_point != null && element_at_point != element &&
        !isAncestor(element_at_point, element)) {
        return element_at_point;
    }

    return null;
};

/**
 * @param {Element} element
 * @return boolean
 */
axs.utils.elementIsControl = function(element) {
    // TODO
    return false;
};

/**
 * @param {Element} element
 * @return {boolean}
 */
axs.utils.elementIsVisible = function(element) {
    if (axs.utils.elementIsTransparent(element))
        return false;
    if (axs.utils.elementHasZeroArea(element))
        return false;
    if (axs.utils.elementIsOutsideScrollArea(element))
        return false;
    var overlappingElement = axs.utils.overlappingElement(element);
    if (overlappingElement) {
        var overlappingElementStyle = window.getComputedStyle(overlappingElement, null);
        if (overlappingElementStyle) {
            var overlappingElementBg = axs.utils.getBgColor(overlappingElementStyle, overlappingElement);
            if (overlappingElementBg && overlappingElementBg.alpha > 0)
                return false;
        }
    }
    return true;
};

/**
 * @param {CSSStyleDeclaration} style
 * @return {boolean}
 */
axs.utils.isLargeFont = function(style) {
    var fontSize = style.fontSize;
    var bold = style.fontWeight == 'bold';
    var matches = fontSize.match(/(\d+)px/);
    if (matches) {
        var fontSizePx = parseInt(matches[1], 10);
        if (bold && fontSizePx >= 19.2 || fontSizePx >= 24) // fudged!
            return true;
        return false;
    }
    matches = fontSize.match(/(\d+)em/);
    if (matches) {
        var fontSizeEm = parseInt(matches[1], 10);
        if (bold && fontSizeEm >= 1.2 || fontSizeEm >= 1.5)
            return true;
        return false;
    }
    matches = fontSize.match(/(\d+)%/);
    if (matches) {
        var fontSizePercent = parseInt(matches[1], 10);
        if (bold && fontSizePercent >= 120 || fontSizePercent >= 150)
            return true;
        return false;
    }
    matches = fontSize.match(/(\d+)pt/);
    if (matches) {
        var fontSizePt = parseInt(matches[1], 10);
        if (bold && fontSizePt >= 14 || fontSizePt >= 14)
            return true;
        return false;
    }
    return false;
};

/**
 * @param {CSSStyleDeclaration} style
 * @param {Element} element
 * @return {?axs.utils.Color}
 */
axs.utils.getBgColor = function(style, element) {
    var bgColorString = style.backgroundColor;
    var bgColor = axs.utils.parseColor(bgColorString);
    if (!bgColor)
        return null;

    if (style.backgroundImage && style.backgroundImage != 'none')
        return null; // too hard

    if (bgColor.alpha < 1) {
        var parent = element;
        var bgStack = [];
        bgStack.push(bgColor);
        var foundSolidColor = null;
        while (parent = parent.parentElement) {
            var computedStyle = window.getComputedStyle(parent, null);
            if (!computedStyle)
                continue;

            if (computedStyle.backgroundImage &&
                computedStyle.backgroundImage != 'none')
                return null; // too hard

            var parentBg = axs.utils.parseColor(computedStyle.backgroundColor);
            if (!parentBg)
                continue;
            if (parentBg.alpha == 0)
                continue;

            bgStack.push(parentBg);

            if (parentBg.alpha == 1) {
                foundSolidColor = null;
                break;
            }
        }

        if (!foundSolidColor)
            bgStack.push(new axs.utils.Color(255, 255, 255, 1));

        var bg = bgStack.pop();
        while (bgStack.length) {
            var fg = bgStack.pop();
            bg = axs.utils.flattenColors(fg, bg);
        }
        bgColor = bg;
    }
    return bgColor;
};

/**
 * @param {CSSStyleDeclaration} style
 * @param {axs.utils.Color} bgColor The background color, which may come from
 *    another element (such as a parent element), for flattening into the
 *    foreground color.
 * @return {?axs.utils.Color}
 */
axs.utils.getFgColor = function(style, bgColor) {
    var fgColorString = style.color;
    var fgColor = axs.utils.parseColor(fgColorString);
    if (!fgColor)
        return null;

    if (fgColor.alpha < 1)
        fgColor = axs.utils.flattenColors(fgColor, bgColor);
    return fgColor;
};

/**
 * @param {string} colorString The color string from CSS.
 * @return {?axs.utils.Color}
 */
axs.utils.parseColor = function(colorString) {
    var rgbRegex = /^rgb\((\d+), (\d+), (\d+)\)$/;
    var match = colorString.match(rgbRegex);

    if (match) {
        var r = parseInt(match[1], 10);
        var g = parseInt(match[2], 10);
        var b = parseInt(match[3], 10);
        var a = 1
        return new axs.utils.Color(r, g, b, a);
    }

    var rgbaRegex = /^rgba\((\d+), (\d+), (\d+), (\d+(\.\d+)?)\)/;
    match = colorString.match(rgbaRegex);
    if (match) {
        var a = parseInt(match[4], 10);
        var r = parseInt(match[1], 10);
        var g = parseInt(match[2], 10);
        var b = parseInt(match[3] ,10);
        return new axs.utils.Color(r, g, b, a);
    }

    return null;
};

/**
 * @param {axs.utils.Color} color
 * @return {string}
 */
axs.utils.colorToString = function(color) {
    return 'rgba(' + [color.red, color.green, color.blue, color.alpha].join(',') + ')';
};

/**
 * Combine the two given color according to alpha blending.
 * @param {axs.utils.Color} fgColor
 * @param {axs.utils.Color} bgColor
 * @return {axs.utils.Color}
 */
axs.utils.flattenColors = function(fgColor, bgColor) {
    var alpha = fgColor.alpha;
    var r = ((1 - alpha) * bgColor.red) + (alpha * fgColor.red);
    var g  = ((1 - alpha) * bgColor.green) + (alpha * fgColor.green);
    var b = ((1 - alpha) * bgColor.blue) + (alpha * fgColor.blue);
    var a = 1;

    return new axs.utils.Color(r, g, b, a);
};

/**
 * Calculate the luminance of the given color using the WCAG algorithm.
 * @param {axs.utils.Color} color
 * @return {number}
 */
axs.utils.calculateLuminance = function(color) {
    var rSRGB = color.red / 255;
    var gSRGB = color.green / 255;
    var bSRGB = color.blue / 255;

    var r = rSRGB <= 0.03928 ? rSRGB / 12.92 : Math.pow(((rSRGB + 0.055)/1.055), 2.4);
    var g = gSRGB <= 0.03928 ? gSRGB / 12.92 : Math.pow(((gSRGB + 0.055)/1.055), 2.4);
    var b = bSRGB <= 0.03928 ? bSRGB / 12.92 : Math.pow(((bSRGB + 0.055)/1.055), 2.4);

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/**
 * @param {Element} element
 * @return {?number}
 */
axs.utils.getContrastRatioForElement = function(element) {
    var style = window.getComputedStyle(element, null);
    return axs.utils.getContrastRatioForElementWithComputedStyle(style, element);
};

/**
 * @param {CSSStyleDeclaration} style
 * @param {Element} element
 * @return {?number}
 */
axs.utils.getContrastRatioForElementWithComputedStyle = function(style, element) {
    if (!axs.utils.elementIsVisible(element))
        return null;

    var bgColor = axs.utils.getBgColor(style, element);
    if (!bgColor)
        return null;

    var fgColor = axs.utils.getFgColor(style, bgColor);
    if (!fgColor)
        return null;

    return axs.utils.calculateContrastRatio(fgColor, bgColor);
};

/**
 * @param {Element} element
 * @return {boolean}
 */
axs.utils.isNativeTextElement = function(element) {
    var tagName = element.tagName.toLowerCase();
    var type = element.type ? element.type.toLowerCase() : '';
    if (tagName == 'textarea')
        return true;
    if (tagName != 'input')
        return false;

    switch (type) {
    case 'email':
    case 'number':
    case 'password':
    case 'search':
    case 'text':
    case 'tel':
    case 'url':
    case '':
        return true;
    default:
        return false;
    }
};

/**
 * @param {number} contrastRatio
 * @param {CSSStyleDeclaration} style
 * @return {boolean}
 */
axs.utils.isLowContrast = function(contrastRatio, style) {
    return contrastRatio < 3.0 || (!axs.utils.isLargeFont(style) && contrastRatio < 4.5);
};

/**
 * @param {Element} element
 * @return {boolean}
 */
axs.utils.hasLabel = function(element) {
    var tagName = element.tagName.toLowerCase();
    var type = element.type ? element.type.toLowerCase() : '';

    if (element.hasAttribute('aria-label'))
        return true;
    if (element.hasAttribute('title'))
        return true;
    if (tagName == 'img' && element.hasAttribute('alt'))
        return true;
    if (tagName == 'input' && type == 'image' && element.hasAttribute('alt'))
        return true;
    if (tagName == 'input' && (type == 'submit' || type == 'reset'))
        return true;

    // There's a separate audit that makes sure this points to an actual element or elements.
    if (element.hasAttribute('aria-labelledby'))
        return true;

    if (axs.utils.isNativeTextElement(element) && element.hasAttribute('placeholder'))
        return true;

    if (element.hasAttribute('id')) {
        var labelsFor = document.querySelectorAll('label[for=' + element.id + ']');
        if (labelsFor.length > 0)
            return true;
    }

    var parent = element.parentElement;
    while (parent) {
        if (parent.tagName.toLowerCase() == 'label') {
            var parentLabel = /** HTMLLabelElement */ parent;
            if (parentLabel.control == element)
                return true;
        }
        parent = parent.parentElement;
    }
    return false;
};

/**
 * @param {Element} element An element to check.
 * @return {boolean} True if the element is hidden from accessibility.
 */
axs.utils.isElementHidden = function(element) {
    if (!(element instanceof HTMLElement))
        return false;

    var style = window.getComputedStyle(element, null);
    if (style.display == 'none' || style.visibility == 'hidden')
        return true;

    if (element.hasAttribute('aria-hidden') &&
        element.getAttribute('aria-hidden').toLowerCase() != 'false') {
        return true;
    }

    return false;
};

/**
 * @param {Element} element An element to check.
 * @return {boolean} True if the element or one of its ancestors is
 *     hidden from accessibility.
 */
axs.utils.isElementOrAncestorHidden = function(element) {
    if (axs.utils.isElementHidden(element))
        return true;

    if (element.parentElement)
        return axs.utils.isElementOrAncestorHidden(element.parentElement);
    else
        return false;
};

/**
 * @param {!string} propertyName
 * @param {!string} value
 * @param {!Element} element
 * @return {!Object}
 */
axs.utils.isValidPropertyValue = function(propertyName, value, element) {
    var propertyKey = propertyName.replace(/^aria-/, '');
    var property = axs.constants.ARIA_PROPERTIES[propertyKey];
    var result = { 'name': propertyName, 'rawValue': value };
    if (!property) {
        result.valid = false;
        result.reason = '"' + propertyName + '" is not a valid ARIA property';
        return result;
    }

    var propertyType = property.valueType;
    if (!propertyType) {
        result.valid = false;
        result.reason = '"' + propertyName + '" is not a valid ARIA property';
        return result;
    }

    switch (propertyType) {
    case "idref":
        var validIDRefValue = axs.utils.isValidIDRefValue(value, element);
        if (validIDRefValue.valid) {
            result.valid = true;
            result.value = validIDRefValue.value;
        } else {
            result.valid = false;
            result.reason = validIDRefValue.reason;
        }
        return result;
    case "idref_list":
        var idrefValues = value.split(/\s+/);
        result.valid = true;
        for (var i = 0; i < idrefValues.length; i++) {
            var refIsValid = axs.utils.isValidIDRefValue(idrefValues[i],  element);
            if (!refIsValid.valid) {
                result.valid = false;
                if (result.reason) {
                    var reason = result.reason;
                    result.reason = [ reason ];
                    result.reason.push(refIsValid.reason);
                } else
                    result.reason = refIsValid.reason;
            } else {
                if (result.values)
                    result.values.push(refIsValid.value);
                else
                    result.values = [refIsValid.value];
            }
        }
        return result;
    case "integer":
        var validNumber = axs.utils.isValidNumber(value);
        if (!validNumber.valid) {
            result.valid = false;
            result.reason = validNumber.reason;
            return result;
        }
        if (Math.floor(validNumber.value) != validNumber.value) {
            result.valid = false;
            result.reason = '' + value + ' is not a whole integer';
        } else {
            result.valid = true;
            result.value = validNumber.value;
        }
        return result;
    case "number":
        var validNumber = axs.utils.isValidNumber(value);
        if (validNumber.valid) {
            result.valid = true;
            result.value = validNumber.value;
        }
    case "string":
        result.valid = true;
        result.value = value;
        return result;
    case "token":
        var validTokenValue = axs.utils.isValidTokenValue(propertyName, value.toLowerCase());
        if (validTokenValue.valid) {
            result.valid = true;
            result.value = validTokenValue.value;
            return result;
        } else {
            result.valid = false;
            result.reason = validTokenValue.reason;
            return result;
        }
    case "token_list":
        var tokenValues = value.split(/\s+/);
        result.valid = true;
        for (var i = 0; i < tokenValues.length; i++) {
            var validTokenValue = axs.utils.isValidTokenValue(propertyName, tokenValues[i].toLowerCase());
            if (!validTokenValue.valid) {
                result.valid = false;
                if (result.reason) {
                    result.reason = [ result.reason ];
                    result.reason.push(validTokenValue.reason);
                } else {
                    result.reason = validTokenValue.reason;
                    result.possibleValues = validTokenValue.possibleValues;
                }
            } else {
                if (result.values)
                    result.values.push(validTokenValue.value);
                else
                    result.values = [validTokenValue.value];
            }
        }
        return result;
    case "tristate":
        var validTristate = axs.utils.isPossibleValue(value.toLowerCase(), axs.constants.MIXED_VALUES, propertyName);
        if (validTristate.valid) {
            result.valid = true;
            result.value = validTristate.value;
        } else {
            result.valid = false;
            result.reason = validTristate.reason;
        }
        return result;
    case "true-false":
        var validBoolean = axs.utils.isValidBoolean(value);
        if (validBoolean.valid) {
            result.valid = true;
            result.value = validBoolean.value;
        } else {
            result.valid = false;
            result.reason = validBoolean.reason;
        }
        return result;
    case "true-false-undefined":
        var validBoolean = axs.utils.isValidBoolean(value);
        if (validBoolean.valid) {
            result.valid = true;
            result.value = validBoolean.value;
        } else {
            result.valid = false;
            result.reason = validBoolean.reason;
        }
        return result;
    }
    result.valid = false
    result.reason = 'Not a valid ARIA property';
    return result;
};

/**
 * @param {string} propertyName The name of the property.
 * @param {string} value The value to check.
 * @return {!Object}
 */
axs.utils.isValidTokenValue = function(propertyName, value) {
    var propertyKey = propertyName.replace(/^aria-/, '');
    var propertyDetails = axs.constants.ARIA_PROPERTIES[propertyKey];
    var possibleValues = propertyDetails.valuesSet;
    return axs.utils.isPossibleValue(value, possibleValues, propertyName);
};

/**
 * @param {string} value
 * @param {Object.<string, boolean>} possibleValues
 * @return {!Object}
 */
axs.utils.isPossibleValue = function(value, possibleValues, propertyName) {
    if (!possibleValues[value])
        return { 'valid': false,
                 'reason': '"' + value + '" is not a valid value for ' + propertyName,
                 'possibleValues': Object.keys(possibleValues) };
    return { 'valid': true, 'value': value };
};

/**
 * @param {string} value
 * @return {!Object}
 */
axs.utils.isValidBoolean = function(value) {
    var parsedValue = JSON.parse(value);
    if (!(parsedValue instanceof Boolean))
        return { 'valid': false, 'reason': '"' + value + '" is not a true/false value' };
    return { 'valid': true, 'value': parsedValue };
};

/**
 * @param {string} value
 * @param {!Element} element
 * @return {!Object}
 */
axs.utils.isValidIDRefValue = function(value, element) {
    if (!element.ownerDocument.getElementById(value))
        return { 'valid': false, 'reason': 'No element with ID "' + value + '"' };
    return { 'valid': true, 'value': value };
};

/**
 * @param {string} value
 * @return {!Object}
 */
axs.utils.isValidNumber = function(value) {
    var parsedValue = JSON.parse(value);
    if (typeof(parsedValue) != 'number')
        return { 'valid': false, 'reason': '"' + value + '" is not a number' };
    return { 'valid': true, 'value': parsedValue };
};

/**
 * @param {Element} element
 * @return {boolean}
 */
axs.utils.isElementImplicitlyFocusable = function(element) {
    if (element instanceof HTMLAnchorElement || element instanceof HTMLAreaElement)
        return element.hasAttribute('href');
    if (element instanceof HTMLInputElement || element instanceof HTMLSelectElement ||
        element instanceof HTMLTextAreaElement || element instanceof HTMLButtonElement ||
        element instanceof HTMLIFrameElement)
        return !element.disabled;
    return false;
};
