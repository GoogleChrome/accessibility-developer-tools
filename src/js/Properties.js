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

goog.require('axs.content');
goog.require('axs.utils');

goog.provide('axs.properties');

/**
 * @const
 * @type {string}
 */
axs.properties.TEXT_CONTENT_XPATH = 'text()[normalize-space(.)!=""]/parent::*[name()!="script"]'

/**
 * @param {Element} element
 * @return {Object.<string, Object>}
 */
axs.properties.getColorProperties = function(element) {
    var colorProperties = {};
    colorProperties['contrastRatio'] = axs.properties.getContrastRatioProperties(element);
    if (!colorProperties['contrastRatio'])  // FIXME this is awful
        return null;
    return colorProperties;
};

/**
 * @param {Element} element
 * @return {Object.<string, Object>}
 */
axs.properties.getContrastRatioProperties = function(element) {
    var selectorResults = document.evaluate(axs.properties.TEXT_CONTENT_XPATH,
                                            element,
                                            null,
                                            XPathResult.ANY_TYPE,
                                            null);
    var resultElement = selectorResults.iterateNext();
    if (!resultElement || resultElement != element)
        return null;

    var contrastRatioProperties = {};
    var style = window.getComputedStyle(element, null);
    var bgColor = axs.utils.getBgColor(style, element);
    if (!bgColor)
        return null;

    contrastRatioProperties['backgroundColor'] = axs.utils.colorToString(bgColor);
    var fgColor = axs.utils.getFgColor(style, bgColor);
    contrastRatioProperties['foregroundColor'] = axs.utils.colorToString(fgColor);
    var value = axs.utils.getContrastRatioForElementWithComputedStyle(style, element);
    if (!value)
        return null;
    contrastRatioProperties['value'] = value.toFixed(2);
    if (axs.utils.isLowContrast(value, style))
        contrastRatioProperties['alert'] = true;
    return contrastRatioProperties;
};

/**
 * @param {Node} node
 * @param {!Object} textAlternatives The properties object to fill in
 * @param {boolean=} opt_recursive Whether this is a recursive call or not
 * @return {?string} The calculated text alternative for the given element
 */
axs.properties.findTextAlternatives = function(node, textAlternatives, opt_recursive) {
    var recursive = opt_recursive || false;

    /** @type {Element} */ var element;
    switch (node.nodeType) {
    case Node.COMMENT_NODE:
        return null;  // Skip comments
    case Node.ELEMENT_NODE:
        element = /** @type {Element} */ node;
        console.log('findTextAlternatives for', element);
        if (element.tagName == 'script') {
            console.log('skipping script element');
            return null;  // Skip script elements
        }
        break;
    case Node.TEXT_NODE:
        element = node.parentElement;
        console.log('findTextAlternatives for', node);
        break;
    default:
        console.warn('Unhandled node type: ', node.nodeType);
        return null;
    }

    // 1. Skip hidden elements unless the author specifies to use them via an aria-labelledby or
    // aria-describedby being used in the current computation.
    if (!recursive && axs.utils.isElementOrAncestorHidden(element))
        return null;

    // if this is a text node, just return text content.
    if (node.nodeType == Node.TEXT_NODE) {
        console.log('textNode', node);
        var textContentValue = {};
        textContentValue.type = 'text';
        textContentValue.text = node.textContent;
        textContentValue.lastWord = axs.properties.getLastWord(textContentValue.text);
        textAlternatives['content'] = textContentValue;

        return node.textContent;
    }

    var computedText = null;

    if (!recursive) {
        // 2A. The aria-labelledby attribute takes precedence as the element's text alternative
        // unless this computation is already occurring as the result of a recursive aria-labelledby
        // declaration.
        computedText = axs.properties.getTextFromAriaLabelledby(element, textAlternatives);
    }

    // 2A. If aria-labelledby is empty or undefined, the aria-label attribute, which defines an
    // explicit text string, is used.
    if (element.hasAttribute('aria-label')) {
        var ariaLabelValue = {};
        ariaLabelValue.type = 'text';
        ariaLabelValue.text = element.getAttribute('aria-label');
        ariaLabelValue.lastWord = axs.properties.getLastWord(ariaLabelValue.text);
        if (computedText)
            ariaLabelValue.unused = true;
        else if (!(recursive && axs.utils.elementIsControl(element)))
            computedText = ariaLabelValue.text;
        textAlternatives['ariaLabel'] = ariaLabelValue;
    }

    // 2A. If aria-labelledby and aria-label are both empty or undefined, and if the element is not
    // marked as presentational (role="presentation", check for the presence of an equivalent host
    // language attribute or element for associating a label, and use those mechanisms to determine
    // a text alternative.
    if (!element.hasAttribute('role') || element.getAttribute('role') != 'presentation') {
        computedText = axs.properties.getTextFromHostLangaugeAttributes(element, textAlternatives, computedText);
    }

    // 2B.
    // TODO: ARIA widget roles
    if (recursive && axs.utils.elementIsControl(element)) {
        // include the value of the embedded control as part of the text alternative in the
        // following manner:
        try {
        if (element instanceof HTMLInputElement) {
            // If the embedded control is a text field, use its value.
            var inputElement = /** @type {HTMLInputElement} */ element;
            if (inputElement.type == 'text') {
                if (inputElement.value && inputElement.value.length > 0)
                    textAlternatives['controlValue'] = { 'text': inputElement.value };
            }
            // If the embedded control is a range (e.g. a spinbutton or slider), use the value of the
            // aria-valuetext attribute if available, or otherwise the value of the aria-valuenow
            // attribute.
            if (inputElement.type == 'range')
                textAlternatives['controlValue'] = { 'text': inputElement.value };
        }
        // If the embedded control is a menu, use the text alternative of the chosen menu item.
        // If the embedded control is a select or combobox, use the chosen option.
        if (element instanceof HTMLSelectElement) {
            textAlternatives['controlValue'] = { 'text': inputElement.value };
        }

        if (textAlternatives['controlValue']) {
            var controlValue = textAlternatives['controlValue'];
            if (computedText)
                controlValue.unused = true;
            else
                computedText = controlValue.text;
        }
        } catch (e) {
            console.warn('exception', e, e.getMessage, e.stack);
        }
    }

    // 2C. Otherwise, if the attributes checked in rules A and B didn't provide results, text is
    // collected from descendant content if the current element's role allows "Name From: contents."
    var textFromContent = axs.properties.getTextFromDescendantContent(element);
    if (textFromContent) {
        var textFromContentValue = {};
        textFromContentValue.type = 'text';
        textFromContentValue.text = textFromContent;
        textFromContentValue.lastWord = axs.properties.getLastWord(textFromContentValue.text);
        if (computedText)
            textFromContentValue.unused = true;
        else
            computedText = textFromContent;
        textAlternatives['content'] = textFromContentValue;
    }

    // 2D. The last resort is to use text from a tooltip attribute (such as the title attribute in
    // HTML). This is used only if nothing else, including subtree content, has provided results.
    if (element.hasAttribute('title')) {
        var titleValue = {};
        titleValue.type = 'string';
        titleValue.valid = true;
        titleValue.text =  element.getAttribute('title');
        titleValue.lastWord = axs.properties.getLastWord(titleValue.lastWord);
        if (computedText)
            titleValue.unused = true;
        else
            computedText = titleValue.text;
        textAlternatives['title'] = titleValue;
    }

    if (Object.keys(textAlternatives).length == 0 && computedText == null)
        return null;

    return computedText;
};

/**
 * @param {Element} element
 * @return {?string}
 */
axs.properties.getTextFromDescendantContent = function(element) {
    console.log('getTextFromDescendantContent', element);
    var hasRole = element.hasAttribute('role');
    if (hasRole) {
        var roleName = element.getAttribute('role');
        // if element has a role, check that it allows "Name From: contents"
        var role = axs.constants.ARIA_ROLES[roleName];
        if (role && (!role.namefrom || role.namefrom.indexOf('contents') < 0))
            return null;
    }
    // Also get text from descendant contents if there is no role - e.g. p, span or div
    var children = element.childNodes;
    var childrenTextContent = [];
    for (var i = 0; i < children.length; i++) {
        var childTextContent = axs.properties.findTextAlternatives(children[i], {}, true);
        if (childTextContent && childTextContent.trim().length > 0)
            childrenTextContent.push(childTextContent.trim());
    }
    if (childrenTextContent.length)
        return childrenTextContent.join(' ');

    return null;
};

/**
 * @param {Element} element
 * @param {Object} textAlternatives
 * @return {?string}
 */
axs.properties.getTextFromAriaLabelledby = function(element, textAlternatives) {
    var computedText = null;
    if (!element.hasAttribute('aria-labelledby'))
        return computedText;

    var labelledbyAttr = element.getAttribute('aria-labelledby');
    var labelledbyIds = labelledbyAttr.split(/\s+/);
    var labelledbyValue = {};
    labelledbyValue.valid = true;
    var labelledbyText = [];
    var labelledbyValues = [];
    for (var i = 0; i < labelledbyIds.length; i++) {
        var labelledby = {};
        labelledby.type = 'element';
        var labelledbyId = labelledbyIds[i];
        labelledby.value = labelledbyId;
        var labelledbyElement = document.getElementById(labelledbyId);
        if (!labelledbyElement) {
            labelledby.valid = false;
            labelledbyValue.valid = false;
            labelledby.errorMessage = chrome.i18n.getMessage('noElementWithId', labelledbyId);
        } else {
            labelledby.valid = true;
            labelledby.text = axs.properties.findTextAlternatives(labelledbyElement, {}, true);
            labelledby.lastWord = axs.properties.getLastWord(labelledby.text);
            labelledbyText.push(labelledbyElement.innerText.trim());
            labelledby.element = axs.content.convertNodeToResult(labelledbyElement);
        }
        labelledbyValues.push(labelledby);
    }
    if (labelledbyValues.length > 0) {
        labelledbyValues[labelledbyValues.length - 1].last = true;
        labelledbyValue.values = labelledbyValues;
        labelledbyValue.text = labelledbyText.join(' ');
        labelledbyValue.lastWord = axs.properties.getLastWord(labelledbyValue.text);
        computedText = labelledbyValue.text;
        textAlternatives['ariaLabelledby'] = labelledbyValue;
    }

    return computedText;
};
axs.properties.getTextFromHostLangaugeAttributes = function(element, textAlternatives, existingComputedText) {
    var computedText = existingComputedText;
    if (element.webkitMatchesSelector('img')) {
        if (element.hasAttribute('alt')) {
            var altValue = {};
            altValue.type = 'string';
            altValue.valid = true;
            altValue.text =  element.getAttribute('alt');
            if (computedText)
                altValue.unused = true;
            else
                computedText = altValue.text;
            textAlternatives['alt'] = altValue;
        } else {
            var altValue = {};
            altValue.valid = false;
            altValue.errorMessage = 'No alt value provided';
            textAlternatives['alt'] = altValue;
        }
    }

    var controlsSelector = ['input:not([type="hidden"]):not([disabled])',
                            'select:not([disabled])',
                            'textarea:not([disabled])',
                            'button:not([disabled])',
                            'video:not([disabled])'].join(', ');
    if (element.webkitMatchesSelector(controlsSelector)) {
        if (element.hasAttribute('id')) {
            var labelForQuerySelector = 'label[for=' + element.id + ']';
            var labelsFor = document.querySelectorAll(labelForQuerySelector);
            var labelForValue = {};
            var labelForValues = [];
            var labelForText = [];
            for (var i = 0; i < labelsFor.length; i++) {
                var labelFor = {};
                labelFor.type = 'element';
                var label = labelsFor[i];
                var labelText = axs.properties.findTextAlternatives(label, {}, true);
                if (labelText && labelText.trim().length > 0) {
                    labelFor.text = labelText.trim();
                    labelForText.push(labelText.trim());
                }
                labelFor.element = axs.content.convertNodeToResult(label);
                labelForValues.push(labelFor);
            }
            if (labelForValues.length > 0) {
                labelForValues[labelForValues.length - 1].last = true;
                labelForValue.values = labelForValues;
                labelForValue.text = labelForText.join(' ');
                labelForValue.lastWord = axs.properties.getLastWord(labelForValue.text);
                if (computedText)
                    labelForValue.unused = true;
                else
                    computedText = labelForValue.text;
                textAlternatives['labelFor'] = labelForValue;
            }
        }

        var parent = element.parentElement;
        var labelWrappedValue = {};
        while (parent) {
            if (parent.tagName.toLowerCase() == 'label') {
                var parentLabel = /** HTMLLabelElement */ parent;
                if (parentLabel.control == element) {
                    labelWrappedValue.type = 'element';
                    labelWrappedValue.text = axs.properties.findTextAlternatives(parentLabel, {}, true);
                    labelWrappedValue.lastWord = axs.properties.getLastWord(labelWrappedValue.text);
                    labelWrappedValue.element = axs.content.convertNodeToResult(parentLabel);
                    break;
                }
            }
            parent = parent.parentElement;
        }
        if (labelWrappedValue.text) {
            if (computedText)
                labelWrappedValue.unused = true;
            else
                computedText = labelWrappedValue.text;
            textAlternatives['labelWrapped'] = labelWrappedValue;
        }
        if (!Object.keys(textAlternatives).length)
            textAlternatives['noLabel'] = true;
    }
    return computedText;
};

/**
 * @param {?string} text
 * @return {?string}
 */
axs.properties.getLastWord = function(text) {
    if (!text)
        return null;

    // TODO: this makes a lot of assumptions.
    var lastSpace = text.lastIndexOf(' ');
    var MAXLENGTH = 10;
    var cutoff = text.length - MAXLENGTH;
    var wordStart = lastSpace > cutoff ? lastSpace : cutoff;
    return text.substring(wordStart);
};

/**
 * @param {Node} node
 * @return {Object}
 */
axs.properties.getTextProperties = function(node) {
    var textProperties = {};
    var computedText = axs.properties.findTextAlternatives(node, textProperties);
    if (Object.keys(textProperties).length == 0) {
        if (!computedText)
            return null;
        textProperties.hasProperties = false;
    } else {
        textProperties.hasProperties = true;
    }

    textProperties.computedText = computedText;
    textProperties.lastWord = axs.properties.getLastWord(computedText);
    return textProperties;
};

/**
 * @param {Element} element
 * @return {Object}
 */
axs.properties.getAriaProperties = function(element) {
    var ariaProperties = {};
    var role = axs.properties.getRole(element);
    if (!role)
        return null;
    ariaProperties['role'] = role;
    if (!role.valid) {
        return ariaProperties;
    }
    if (!role.details || !role.details.propertiesSet) {
        return ariaProperties;
    }

    var statesAndProperties = [];
    for (var property in role.details.propertiesSet) {
        if (element.hasAttribute(property)) {
            // check valid
            var propertyValue = element.getAttribute(property);
            statesAndProperties.push(axs.utils.isValidPropertyValue(property, propertyValue, element));
        } else if (role.details.requiredPropertiesSet[property]) {
            statesAndProperties.push({ 'name': property, 'valid': false, 'reason': 'Required property not set' });
        }
    }
    if (Object.keys(statesAndProperties).length > 0)
        ariaProperties['properties'] = statesAndProperties;
    if (Object.keys(ariaProperties).length > 0)
        return ariaProperties;
    return null;
};

/**
 * @param {Element} element
 * @return {Object|boolean}
 */
axs.properties.getRole = function(element) {
    if (!element.hasAttribute('role'))
        return false;
    var role = element.getAttribute('role');
    if (axs.constants.ARIA_ROLES[role])
        return { 'name': role, 'details': axs.constants.ARIA_ROLES[role], 'valid': true };
    return { 'name': role, 'valid': false };
};

/**
 * @param {Element} element
 * @return {Object.<string, Object>}
 */
axs.properties.getVideoProperties = function(element) {
    var videoSelector = 'video';
    if (!element.webkitMatchesSelector(videoSelector))
        return null;
    var videoProperties = {};
    videoProperties['captionTracks'] = axs.properties.getTrackElements(element, 'captions');
    videoProperties['descriptionTracks'] = axs.properties.getTrackElements(element, 'descriptions');
    videoProperties['chapterTracks'] = axs.properties.getTrackElements(element, 'chapters');
    // error if no text alternatives?
    return videoProperties;
};

/**
 * @param {Element} element
 * @param {string} kind
 * @return {Object}
 */
axs.properties.getTrackElements = function(element, kind) {
    // error if resource is not available
    var trackElements = element.querySelectorAll('track[kind=' + kind + ']');
    var result = {};
    if (!trackElements.length) {
        result.valid = false;
        result.reason = chrome.i18n.getMessage('noTracksProvided', [kind]);
        return result;
    }
    result.valid = true;
    var values = [];
    for (var i = 0; i < trackElements.length; i++) {
        var trackElement = {};
        var src = trackElements[i].getAttribute('src');
        var srcLang = trackElements[i].getAttribute('srcLang');
        var label = trackElements[i].getAttribute('label');
        if (!src) {
            trackElement.valid = false;
            trackElement.reason = chrome.i18n.getMessage('noSrcProvided');
        } else {
            trackElement.valid = true;
            trackElement.src = src;
        }
        var name = '';
        if (label) {
            name += label;
            if (srcLang)
                name += ' ';
        }
        if (srcLang)
            name += '(' + srcLang + ')';
        if (name == '')
            name = '[' + chrome.i18n.getMessage('unnamed') + ']';
        trackElement.name = name;
        values.push(trackElement);
    }
    result.values = values;
    return result;
};

/**
 * @param {Node} node
 * @return {Object.<string, Object>}
 */
axs.properties.getAllProperties = function(node) {
    /** @type {Element} */ var element;
    if (node.nodeType == Node.ELEMENT_NODE)
        element = /** @type {Element} */ node;
    if (node.nodeType == Node.TEXT_NODE)
        element = node.parentElement;
    if (!element)
        return {};

    var allProperties = {};
    allProperties['ariaProperties'] = axs.properties.getAriaProperties(element);
    allProperties['colorProperties'] = axs.properties.getColorProperties(element);
    allProperties['textProperties'] = axs.properties.getTextProperties(node);
    allProperties['videoProperties'] = axs.properties.getVideoProperties(element);
    return allProperties;
};
