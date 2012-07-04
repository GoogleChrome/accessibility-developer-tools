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
    colorProperties['contrast-ratio'] = axs.properties.getContrastRatioProperties(element);
    if (!colorProperties['contrast-ratio'])  // FIXME this is awful
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

    contrastRatioProperties['background-color'] = axs.utils.colorToString(bgColor);
    var fgColor = axs.utils.getFgColor(style, bgColor);
    contrastRatioProperties['foreground-color'] = axs.utils.colorToString(fgColor);
    var value = axs.utils.getContrastRatioForElementWithComputedStyle(style, element);
    if (!value)
        return null;
    contrastRatioProperties['value'] = value;
    if (axs.utils.isLowContrast(value, style))
        contrastRatioProperties['alert'] = true;
    return contrastRatioProperties;
};

/**
 * @param {Element} element
 * @return {Object.<string, string>}
 */
axs.properties.findLabelsForControl = function(element) {
    var controlsSelector = ['input:not([type="hidden"]):not([disabled])',
                            'select:not([disabled])',
                            'textarea:not([disabled])',
                            'button:not([disabled])'].join(', ');
    if (!element.webkitMatchesSelector(controlsSelector))
        return null;

    var labelsForControl = {};

    if (element.hasAttribute('aria-label'))
        labelsForControl['aria-label'] = element.getAttribute('aria-label');

    if (element.hasAttribute('aria-labelledby')) {
        var labelledbyId = element.getAttribute('aria-labelledby');
        var labelledby = document.getElementById(labelledbyId);
        if (!labelledby)
            labelsForControl["aria-labelledby"] = '!' + chrome.i18n.getMessage('noElementWithId', labelledbyId);
        else
            labelsForControl['aria-labelledby'] = axs.content.convertNodeToResult(labelledby);
    }

    if (element.hasAttribute('title'))
        labelsForControl['title'] =  element.getAttribute('title');

    if (element.hasAttribute('alt'))
        labelsForControl['alt'] = element.getAttribute('alt');

    var labelsInDocument = document.querySelectorAll('label');
    for (var i = 0; i < labelsInDocument.length; i++) {
        var label = labelsInDocument[i];

        if (label.control == element) {
            if (label.hasAttribute('for') && label.htmlFor == element.id)
                labelsForControl['label-for'] = axs.content.convertNodeToResult(label);

            function isAncestor(ancestor, element) {
                if (element == null)
                    return false;
                if (element === ancestor)
                    return true;

                return isAncestor(ancestor, element.parentElement);
            }

            if (isAncestor(label, element))
                labelsForControl['label-wrapped'] = axs.content.convertNodeToResult(label);
        }
    }

    if (!Object.keys(labelsForControl).length)
        labelsForControl['no-label'] = true;

    return labelsForControl;
};

/**
 * @param {Element} element
 * @return {Object.<string, Object>}
 */
axs.properties.getAriaProperties = function(element) {
    var ariaProperties = {};
    ariaProperties['role'] = axs.properties.getRole(element);
    return ariaProperties;
};

/**
 * @param {Element} element
 * @return {?string}
 */
axs.properties.getRole = function(element) {
    if (!element.hasAttribute('role'))
        return null;
    var role = element.getAttribute('role');
    if (!axs.constants.ARIA_ROLES[role])
        return '!' + role;
    return role;
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
    videoProperties['caption-tracks'] = axs.properties.getTrackElements(element, 'captions');
    videoProperties['description-tracks'] = axs.properties.getTrackElements(element, 'descriptions');
    videoProperties['chapter-tracks'] = axs.properties.getTrackElements(element, 'chapters');
    // error if no text alternatives?
    return videoProperties;
};

/**
 * @param {Element} element
 * @param {string} kind
 * @return {Array.<Object>|string}
 */
axs.properties.getTrackElements = function(element, kind) {
    // error if resource is not available
    var trackElements = element.querySelectorAll('track[kind=' + kind + ']');
    if (!trackElements.length)
        return 'No ' + kind;
    var results = [];
    for (var i = 0; i < trackElements.length; i++) {
        var trackElement = {};
        trackElement['src'] = trackElements[i].getAttribute('src');
        trackElement['srclang'] = trackElements[i].getAttribute('srcLang');
        trackElement['label'] = trackElements[i].getAttribute('label');
        results.push(trackElement);
    }
    return results;
};

/**
 * @param {Node} node
 * @return {Object.<string, Object>}
 */
axs.properties.getAllProperties = function(node) {
    console.log('getAllProperties for', node);
    /** @type {Element} */ var element;
    if (node.nodeType == Node.ELEMENT_NODE)
        element = /** @type {Element} */ node;
    if (node.nodeType == Node.TEXT_NODE)
        element = node.parentElement;
    if (!element)
        return {};

    var allProperties = {};
    allProperties['aria-properties'] = axs.properties.getAriaProperties(element);
    allProperties['color-properties'] = axs.properties.getColorProperties(element);
    allProperties['label-properties'] = axs.properties.findLabelsForControl(element);
    allProperties['video-properties'] = axs.properties.getVideoProperties(element);
    return allProperties;
};
