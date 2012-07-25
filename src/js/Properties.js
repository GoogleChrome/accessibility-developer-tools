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
 * @param {Element} element
 * @return {Object.<string, string>}
 */
axs.properties.findTextAlternatives = function(element) {
    var controlsSelector = ['input:not([type="hidden"]):not([disabled])',
                            'select:not([disabled])',
                            'textarea:not([disabled])',
                            'button:not([disabled])'].join(', ');
    if (!element.webkitMatchesSelector(controlsSelector))
        return null;

    var labelsForControl = {};

    if (element.hasAttribute('aria-label')) {
        var ariaLabelValue = {};
        ariaLabelValue.type = 'text';
        ariaLabelValue.value = element.getAttribute('aria-label');
        labelsForControl['ariaLabel'] = ariaLabelValue;
    }

    if (element.hasAttribute('aria-labelledby')) {
        var labelledbyAttr = element.getAttribute('aria-labelledby');
        var labelledbyIds = labelledbyAttr.split(/\s+/);
        var labelledbyValue = [];
        for (var i = 0; i < labelledbyIds.length; i++) {
            var labelledby = {};
            labelledby.type = 'element';
            var labelledbyId = labelledbyIds[i];
            labelledby.value = labelledbyId;
            var labelledbyElement = document.getElementById(labelledbyId);
            if (!labelledbyElement) {
                labelledby.valid = false;
                labelledby.errorMessage = chrome.i18n.getMessage('noElementWithId', labelledbyId);
            } else {
                labelledby.valid = true;
                labelledby.text = labelledbyElement.innerText;
                labelledby.element = axs.content.convertNodeToResult(labelledbyElement);
            }
            labelledbyValue.push(labelledby);
        }
        if (labelledbyValue.length > 0) {
            labelledbyValue[labelledbyValue.length - 1].last = true;
            labelsForControl['ariaLabelledby'] = labelledbyValue;
        }
    }

    if (element.hasAttribute('title')) {
        var titleValue = {};
        titleValue.type = 'string';
        titleValue.valid = true;
        titleValue.value =  element.getAttribute('title');
        labelsForControl['title'] = titleValue;
    }

    if (element.hasAttribute('alt')) {
        var altValue = {};
        altValue.type = 'string';
        altValue.valid = true;
        altValue.value =  element.getAttribute('alt');
        labelsForControl['alt'] = altValue;
    }

    if (element.hasAttribute('id')) {
        var labelForQuerySelector = 'label[for=' + element.id + ']';
        var labelsFor = document.querySelectorAll(labelForQuerySelector);
        var labelForValue = [];
        for (var i = 0; i < labelsFor.length; i++) {
            var labelFor = {};
            labelFor.type = 'element';
            var label = labelsFor[i];
            labelFor.text = label.textContent;
            labelFor.element = axs.content.convertNodeToResult(label);
            labelForValue.push(labelFor);
        }
        if (labelForValue.length > 0) {
            labelForValue[labelForValue.length - 1].last = true;
            labelsForControl['labelFor'] = labelForValue;
        }
    }

    var parent = element.parentElement;
    var labelWrappedValue = [];
    while (parent) {
        if (parent.tagName.toLowerCase() == 'label') {
            var parentLabel = /** HTMLLabelElement */ parent;
            if (parentLabel.control == element) {
                var labelWrapped = {};
                labelWrapped.type = 'element';
                labelWrapped.text = parentLabel.innerText;
                labelWrapped.element = axs.content.convertNodeToResult(parentLabel);
                labelWrappedValue.push(labelWrapped);
            }
        }
        parent = parent.parentElement;
    }
    if (labelWrappedValue.length > 0) {
        labelWrappedValue[labelWrappedValue.length - 1].last = true;
        labelsForControl['labelWrapped'] = labelWrappedValue;
    }

    if (!Object.keys(labelsForControl).length)
        labelsForControl['noLabel'] = true;

    return labelsForControl;
};

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
    allProperties['textProperties'] = axs.properties.findTextAlternatives(element);
    allProperties['videoProperties'] = axs.properties.getVideoProperties(element);
    return allProperties;
};
