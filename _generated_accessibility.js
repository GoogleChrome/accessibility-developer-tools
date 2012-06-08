var ARIA_ROLES = {
    'alert': true,
    'alertdialog': true,
    'application': true,
    'article': true,
    'banner': true,
    'button': true,
    'checkbox': true,
    'columnheader': true,
    'combobox': true,
    'complementary': true,
    'contentinfo': true,
    'definition': true,
    'dialog': true,
    'directory': true,
    'document': true,
    'form': true,
    'grid': true,
    'gridcell': true,
    'group': true,
    'heading': true,
    'img': true,
    'link': true,
    'list': true,
    'listbox': true,
    'log': true,
    'main': true,
    'marquee': true,
    'math': true,
    'menu': true,
    'menubar': true,
    'menuitem': true,
    'menuitemcheckbox': true,
    'menuitemradio': true,
    'navigation': true,
    'note': true,
    'option': true,
    'presentation': true,
    'progressbar': true,
    'radio': true,
    'radiogroup': true,
    'region': true,
    'row': true,
    'rowgroup': true,
    'rowheader': true,
    'scrollbar': true,
    'search': true,
    'separator': true,
    'slider': true,
    'spinbutton': true,
    'status': true,
    'tab': true,
    'tablist': true,
    'tabpanel': true,
    'textbox': true,
    'timer': true,
    'toolbar': true,
    'tooltip': true,
    'tree': true,
    'treegrid': true,
    'treeitem': true
};

var ARIA_PROPERTIES = {
    'aria-activedescendant': true,
    'aria-atomic': true,
    'aria-autocomplete': true,
    'aria-busy': true, // (state)
    'aria-checked': true, // (state)
    'aria-controls': true,
    'aria-describedby': true,
    'aria-disabled': true, // (state)
    'aria-dropeffect': true,
    'aria-expanded': true, // (state)
    'aria-flowto': true,
    'aria-grabbed': true, // (state)
    'aria-haspopup': true,
    'aria-hidden': true, // (state)
    'aria-invalid': true, // (state)
    'aria-label': true,
    'aria-labelledby': true,
    'aria-level': true,
    'aria-live': true,
    'aria-multiline': true,
    'aria-multiselectable': true,
    'aria-orientation': true,
    'aria-owns': true,
    'aria-posinset': true,
    'aria-pressed': true, // (state)
    'aria-readonly': true,
    'aria-relevant': true,
    'aria-required': true,
    'aria-selected': true, // (state)
    'aria-setsize': true,
    'aria-sort': true,
    'aria-valuemax': true,
    'aria-valuemin': true,
    'aria-valuenow': true,
    'aria-valuetext': true,
};

var Severity =  {
    Info: 'Info',
    Warning: 'Warning',
    Severe: 'Severe'
};

var AuditResult = {
    PASS: "PASS",
    FAIL: "FAIL",
    NA: "NA"
};

var AccessibilityUtils = {
    focusableElementsSelector: 'input:not([type=hidden]),select,textarea,button,a[href],iframe,[tabindex]',

    calculateContrastRatio: function (fgColor, bgColor) {
        if (!fgColor || !bgColor)
            return false;

        var fgLuminance = this.calculateLuminance(fgColor);
        var bgLuminance = this.calculateLuminance(bgColor);
        var contrastRatio = (Math.max(fgLuminance, bgLuminance) + 0.05) /
                            (Math.min(fgLuminance, bgLuminance) + 0.05);
        return contrastRatio;
    },

    elementIsTransparent: function(element)
    {
        return element.style.opacity == "0";
    },

    elementHasZeroArea: function(element)
    {
        var rect = element.getBoundingClientRect();
        var width = rect.right - rect.left;
        var height = rect.top - rect.bottom;
        if (!width || !height)
            return true;
        return false;
    },

    elementIsOutsideScrollArea: function(element)
    {
        var rect = element.getBoundingClientRect();
        var scroll_height = document.body.scrollHeight;
        var scroll_width = document.body.scrollWidth;
        var scroll_top = document.body.scrollTop;
        var scroll_left = document.body.scrollLeft;

        if (rect.top > scroll_height || rect.bottom < -scroll_top ||
            rect.left > scroll_width || rect.right < -scroll_left)
            return true;
        return false;
    },

    overlappingElement: function(element)
    {
        if (this.elementHasZeroArea(element))
            return null;

        var rect = element.getBoundingClientRect();
        var center_x = (rect.left + rect.right) / 2;
        var center_y = (rect.top + rect.bottom) / 2;
        var element_at_point = document.elementFromPoint(center_x, center_y);

        function isAncestor(ancestor, node) {
            if (node == null) {
                return false;
            }
            if (node === ancestor) {
                return true;
            }

            return isAncestor(ancestor, node.parentNode);
        }

        if (element_at_point != null && element_at_point != element &&
            !isAncestor(element, element_at_point)) {
            console.log(element, 'is overlapped by', element_at_point);
            return element_at_point;
        }

        return null
    },

    elementIsVisible: function(element)
    {
        if (this.elementIsTransparent(element))
            return false;
        if (this.elementHasZeroArea(element))
            return false;
        if (this.elementIsOutsideScrollArea(element))
            return false;
        if (this.overlappingElement(element))
            return false;

        return true;
    },

    isLargeFont: function(style) {
        var fontSize = style.fontSize;
        var bold = style.fontWeight == "bold";
        var matches = fontSize.match(/(\d+)px/);
        if (matches) {
            var fontSizePx = parseInt(matches[1]);
            if (bold && fontSizePx >= 19.2 || fontSizePx >= 24) // fudged!
                return true;
            return false;
        }
        matches = fontSize.match(/(\d+)em/);
        if (matches) {
            var fontSizeEm = parseInt(matches[1]);
            if (bold && fontSizeEm >= 1.2 || fontSizeEm >= 1.5)
                return true;
            return false;
        }
        matches = fontSize.match(/(\d+)%/);
        if (matches) {
            var fontSizePercent = parseInt(matches[1]);
            if (bold && fontSizePercent >= 120 || fontSizePercent >= 150)
                return true;
            return false;
        }
        matches = fontSize.match(/(\d+)pt/);
        if (matches) {
            var fontSizePt = parseInt(matches[1]);
            if (bold && fontSizePt >= 14 || fontSizePt >= 14)
                return true;
            return false;
        }
    },

    getBgColor: function(style, element) {
        var bgColorString = style.backgroundColor;
        var bgColor = this.parseColor(bgColorString);
        if (!bgColor)
            return false;

        if (bgColor.alpha < 1) {
            var parent = element;
            var bgStack = [];
            bgStack.push(bgColor);
            var foundSolidColor = false;
            while (parent = parent.parentNode) {
                var style = window.getComputedStyle(parent);
                if (!style)
                    continue;

                if (style.backgroundImage && style.backgroundImage != "none")
                    return false; // too hard

                var parentBg = this.parseColor(style.backgroundColor);
                if (!parentBg)
                    continue;
                if (parentBg.alpha == 0)
                    continue;

                bgStack.push(parentBg);

                if (parentBg.alpha == 1) {
                    foundSolidColor = true;
                    break;
                }
            }

            if (!foundSolidColor) {
                bgStack.push({"red": 255, "green": 255, "blue": 255, "alpha": 1});
            }

            bg = bgStack.pop();
            while (bgStack.length) {
                var fg = bgStack.pop();
                bg = this.flattenColors(fg, bg);
            }
            bgColor = bg;
        }
        return bgColor;
    },

    getFgColor: function(style, bgColor) {
        var fgColorString = style.color;
        var fgColor = this.parseColor(fgColorString);
        if (!fgColor)
            return false;

        if (fgColor.alpha < 1)
            fgColor = this.flattenColors(fgColor, bgColor);
        return fgColor;
    },

    parseColor: function(colorString) {
        var rgbRegex = /^rgb\((\d+), (\d+), (\d+)\)$/;
        var match = colorString.match(rgbRegex);
        var color = {
            "red": 0,
            "green": 0,
            "blue": 0,
            "alpha": 0
        };

        if (match) {
            color["red"] = parseInt(match[1]);
            color["green"] = parseInt(match[2]);
            color["blue"] = parseInt(match[3]);
            color["alpha"] = 1
            return color;
        }

        var rgbaRegex = /^rgba\((\d+), (\d+), (\d+), (\d+)\)/;
        match = colorString.match(rgbaRegex);
        if (match) {
            var alpha = parseInt(match[4]);
            color["red"] = parseInt(match[1]);
            color["green"] = parseInt(match[2]);
            color["blue"] = parseInt(match[3]);
            return color;
        }
    },

    colorToString: function(color) {
        return "rgba(" + [color.red, color.green, color.blue, color.alpha].join(",") + ")";
    },

    flattenColors: function(fgColor, bgColor) {
        var alpha = fgColor.alpha;
        var color = {};
        color["red"] = ((1 - alpha) * bgColor.red) + (alpha * fgColor.red);
        color["green"] = ((1 - alpha) * bgColor.green) + (alpha * fgColor.green);
        color["blue"] = ((1 - alpha) * bgColor.blue) + (alpha * fgColor.blue);
        color["alpha"] = 1;

        return color;
    },

    calculateLuminance: function(color) {
        var rSRGB = color.red / 255;
        var gSRGB = color.green / 255;
        var bSRGB = color.blue / 255;

        var r = rSRGB <= 0.03928 ? rSRGB / 12.92 : Math.pow(((rSRGB + 0.055)/1.055), 2.4);
        var g = gSRGB <= 0.03928 ? gSRGB / 12.92 : Math.pow(((gSRGB + 0.055)/1.055), 2.4);
        var b = bSRGB <= 0.03928 ? bSRGB / 12.92 : Math.pow(((bSRGB + 0.055)/1.055), 2.4);

        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    },

    getContrastRatioForElement: function(element) {
        var style = window.getComputedStyle(element);
        return this.getContrastRatioForElementWithComputedStyle(style, element);
    },

    getContrastRatioForElementWithComputedStyle: function(style, element) {
        if (!this.elementIsVisible(element))
            return false;

        var bgColor = this.getBgColor(style, element);
        if (!bgColor)
            return false;

        var fgColor = this.getFgColor(style, bgColor);
        if (!fgColor)
            return false;

        return this.calculateContrastRatio(fgColor, bgColor).toFixed(2);

    },

    isLowContrast: function(contrastRatio, style) {
        return contrastRatio < 3.0 || (!this.isLargeFont(style) && contrastRatio < 4.5);
    },

    hasLabel: function(element) {
        if (element.hasAttribute("aria-label"))
            return true;
        if (element.hasAttribute("aria-labelledby"))
            return true;
        if (element.hasAttribute("title"))
            return true;
        if (element.hasAttribute("alt"))
            return true;

        var labels = document.querySelectorAll("label");
        var foundLabel;
        for (var j = 0; j < labels.length; j++) {
            var label = labels[j];
            if (label.control == element) {
                foundLabel = true;
                break;
            }
        }
        return foundLabel;
    },

    /**
     * @param {Element} element An element to check.
     * @return {boolean} True if the element is hidden from accessibility.
     */
    isElementHidden: function(element) {
        if (!(element instanceof HTMLElement))
            return false;

        var style = window.getComputedStyle(element, null);
        if (style.display == 'none' || style.visibility == 'hidden')
            return true;

        if (element.getAttribute('aria-hidden') == 'true')
            return true;

        return false;
    },

    /**
     * @param {Element} An element to check.
     * @return {boolean} True if the element or one of its ancestors is
     *     hidden from accessibility.
     */
    isElementOrAncestorHidden: function(element) {
        if (this.isElementHidden(element))
            return true;

        if (element.parentNode) {
            return this.isElementOrAncestorHidden(element.parentNode);
        } else {
            return false;
        }
    }
};

/**
 * @constructor
 * @param {string} name
 * @param {Severity} severity
 * @param {function(): Array.<node>|NodeList|XPathResult} relevantNodesSelector
 * @param {function(node): boolean} test A function which returns True if the
 *     given node fails the audit, and False otherwise.
 */
function AuditRule(name, severity, relevantNodesSelector, test) {
    this.name = name;
    this.severity = severity;
    this.relevantNodesSelector_ = relevantNodesSelector;
    this.test_ = test;
};

/**
 * The return value for a non-applicable audit result.
 *
 * @type {{result: string}}
 * @const
 */
AuditRule.NOT_APPLICABLE = { result: AuditResult.NA };

/**
 * @return {Object.<AuditResult, ?Array.<node>>}
 */
AuditRule.prototype.run = function() {
  var relevantNodes = this.relevantNodesSelector_();

  var failingNodes = [];
  if (relevantNodes instanceof XPathResult) {
    if (relevantNodes.resultType == XPathResult.ORDERED_NODE_SNAPSHOT_TYPE) {
      if (!relevantNodes.snapshotLength)
        return AuditRule.NOT_APPLICABLE;

      for (var i = 0; i < relevantNodes.snapshotLength; i++) {
        var node = relevantNodes.snapshotItem(i);
        if (this.test_(node))
          failingNodes.push(convertElementToResult(node));
      }
    } else {
      console.warn('Unknown XPath result type', relevantNodes);
      return;
    }
  } else {
    if (!relevantNodes.length)
      return { result: AuditResult.NA };
    for (var i = 0; i < relevantNodes.length; i++) {
      var node = relevantNodes[i];
      if (this.test_(node))
        failingNodes.push(convertElementToResult(node));
    }
  }
  var result = failingNodes.length ? AuditResult.FAIL : AuditResult.PASS;
  return { result: result, elements: failingNodes };
}
var AuditRules = {};
var auditResultElements = {};
var lastElementId = 0;
function convertElementToResult(element) {
    var elementId = '' + lastElementId++;
    auditResultElements[elementId] = element;
    return elementId;
}

function getResultElement(elementId) {
    var resultElement = auditResultElements[elementId];
    delete auditResultElements[elementId];
    return resultElement;
}
var Properties = {
    textContentXPath: 'text()[normalize-space(.)!=""]/parent::*[name()!="script"]',

    getColorProperties: function(element) {
        var colorProperties = {};
        colorProperties['contrast-ratio'] = this.getContrastRatioProperties(element);
        if (!colorProperties['contrast-ratio'])  // FIXME this is awful
            return false;
        return colorProperties;
    },

    getContrastRatioProperties: function(element) {
        var selectorResults = document.evaluate(this.textContentXPath, element, null, XPathResult.ANY_TYPE, null);
        var resultElement = selectorResults.iterateNext();
        if (!resultElement || resultElement != element)
            return;

        var contrastRatioProperties = {};
        var style = window.getComputedStyle(element);
        var bgColor = AccessibilityUtils.getBgColor(style, element);
        if (!bgColor)
            return;

        contrastRatioProperties['background-color'] = AccessibilityUtils.colorToString(bgColor);
        var fgColor = AccessibilityUtils.getFgColor(style, bgColor);
        contrastRatioProperties['foreground-color'] = AccessibilityUtils.colorToString(fgColor);
        var value = AccessibilityUtils.getContrastRatioForElementWithComputedStyle(style, element);
        if (!value)
            return;
        contrastRatioProperties['value'] = value;
        if (AccessibilityUtils.isLowContrast(value, style))
            contrastRatioProperties['alert'] = true;
        return contrastRatioProperties;
    },

    findLabelsForControl: function(element) {
        var controlsSelector = ["input:not([type='hidden']):not([disabled])",
                                "select:not([disabled])",
                                "textarea:not([disabled])",
                                "button:not([disabled])"].join(", ");
        if (!element.webkitMatchesSelector(controlsSelector))
            return;

        var labelsForControl = {};

        if (element.hasAttribute("aria-label"))
            labelsForControl["aria-label"] = element.getAttribute("aria-label");

        if (element.hasAttribute("aria-labelledby")) {
            var labelledbyId = element.getAttribute("aria-labelledby");
            var labelledby = document.getElementById(labelledbyId);
            if (!labelledby)
                labelsForControl["aria-labelledby"] = "!No element with ID " + labelledbyId;
            else
                labelsForControl["aria-labelledby"] = convertElementToResult(labelledby);
        }

        if (element.hasAttribute("title"))
            labelsForControl["title"] =  element.getAttribute("title");

        if (element.hasAttribute("alt"))
            labelsForControl["alt"] = element.getAttribute("alt");

        var labelsInDocument = document.querySelectorAll("label");
        for (var i = 0; i < labelsInDocument.length; i++) {
            var label = labelsInDocument[i];

            if (label.control == element) {
                if (label.hasAttribute("for") && label.htmlFor == element.id)
                    labelsForControl["label-for"] = convertElementToResult(label);

                function isAncestor(ancestor, element) {
                    if (element == null)
                        return false;
                    if (element === ancestor)
                        return true;

                    return isAncestor(ancestor, element.parentElement);
                }

                if (isAncestor(label, element))
                    labelsForControl["label-wrapped"] = convertElementToResult(label);
            }
        }

        if (!Object.keys(labelsForControl).length)
            labelsForControl['no-label'] = true;

        return labelsForControl;
    },

    getAriaProperties: function(element) {
        var ariaProperties = {};
        ariaProperties['role'] = this.getRole(element);
        return ariaProperties;
    },

    getRole: function(element) {
        if (!element.hasAttribute('role'))
            return false;
        var role = element.getAttribute('role');
        if (!ARIA_ROLES[role])
            return '!' + role;
        return role;
    },

    getVideoProperties: function(element) {
        var videoSelector = 'video';
        if (!element.webkitMatchesSelector(videoSelector))
            return;
        var videoProperties = {};
        videoProperties['caption-tracks'] = this.getTrackElements(element, 'captions');
        videoProperties['description-tracks'] = this.getTrackElements(element, 'descriptions');
        videoProperties['chapter-tracks'] = this.getTrackElements(element, 'chapters');
        videoProperties['fallback-content'] = this.getFallbackContent(element);
        // error if no text alternatives?
        return videoProperties;
    },

    getTrackElements: function(element, kind) {
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
    },

    getFallbackContent: function(element) {
        var clonedElement = element.cloneNode(true);
        var clonedElementChildren = Array.prototype.slice.call(clonedElement.children);
        for (var i = 0; i < clonedElementChildren.length; i++) {
            var child = clonedElementChildren[i];
            if (child.tagName == 'TRACK' || child.tagName == 'SOURCE')
                clonedElement.removeChild(child);
        }
        if (clonedElement.innerHTML.trim() == '')
            return '!No fallback content';
        return clonedElement.innerHTML;
    },

    getAllProperties: function(node) {
        var element;
        if (node.nodeType == Node.ELEMENT_NODE)
            element = node;
        if (node.nodeType == Node.TEXT_NODE)
            element = node.parentElement;
        if (!element)
            return {};

        var allProperties = {};
        allProperties['aria-properties'] = this.getAriaProperties(element);
        allProperties['color-properties'] = this.getColorProperties(element);
        allProperties['label-properties'] = this.findLabelsForControl(element);
        allProperties['video-properties'] = this.getVideoProperties(element);
        return allProperties;
    }
};

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

AuditRules.badAriaRole = new AuditRule(
    'badAriaRole',
    Severity.Severe,
    function() {
      return document.querySelectorAll("[role]");
    },
    function(element) {
      return !ARIA_ROLES[element.getAttribute('role')];
    });
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

AuditRules.controlsWithoutLabel = new AuditRule(
    'controlsWithoutLabel',
    Severity.Severe,
    function() {
      var controlsSelector = ['input:not([type="hidden"]):not([disabled])',
                              'select:not([disabled])',
                              'textarea:not([disabled])',
                              'button:not([disabled])'].join(', ');
      return document.querySelectorAll(controlsSelector);
    },
    function(control) {
      if (AccessibilityUtils.isElementOrAncestorHidden(control))
        return false;

      if (!AccessibilityUtils.hasLabel(control))
        return true;
    });
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

AuditRules.focusableElementNotVisibleAndNotAriaHidden = new AuditRule(
    'focusableElementNotVisibleAndNotAriaHidden',
    Severity.Warning,
    function() {
        var focusableElements = document.querySelectorAll(AccessibilityUtils.focusableElementsSelector);
        if (!focusableElements.length)
          return focusableElements;

        var nonvisibleFocusableElements = [];
        for (var i = 0; i < focusableElements.length; i++) {
          var element = focusableElements[i];
          if (AccessibilityUtils.isElementOrAncestorHidden(element))
            continue;
          var overlapping = AccessibilityUtils.overlappingElement(element);
          if (overlapping) {
            var style = window.getComputedStyle(overlapping);
            var overlappingElementBg = AccessibilityUtils.getElementBgColor(style, overlapping);
            if (overlappingElementBg && overlappingElementBg.alpha > 0) {
              nonvisibleFocusableElements.push(element);
              continue;
            }
          }
          if (AccessibilityUtils.elementHasZeroArea(element))
            nonvisibleFocusableElements.push(element);
        }
        return nonvisibleFocusableElements;
    },
    function(element) {
        return !element.hasAttribute('aria-hidden') ||
               !element.getAttribute('aria-hidden');
    });
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

AuditRules.imagesWithoutAltText = new AuditRule(
    'imagesWithoutAltText',
     Severity.Warning,
     function() {
       return document.querySelectorAll('img');
     },
     function(image) {
       return (!image.hasAttribute('alt') && image.getAttribute('role') != 'presentation');
     });

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

AuditRules.lowContrastElements = new AuditRule(
    'lowContrastElements',
    Severity.Warning,
    function() {
      return document.evaluate(
          '/html/body//text()[normalize-space(.)!=""]/parent::*[name()!="script"]',
          window.document,
          null,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          null);
    },
    function(element) {
      var style = window.getComputedStyle(element);
      var contrastRatio =
          AccessibilityUtils.getContrastRatioForElementWithComputedStyle(style, element);
      return (contrastRatio && AccessibilityUtils.isLowContrast(contrastRatio, style));
    });
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

AuditRules.nonExistentAriaLabelledbyElement =
    new AuditRule('nonExistentAriaLabelledbyElement',
                  Severity.Warning,
                  function() {
                      return document.querySelectorAll('[aria-labelledby]');
                  },
                  function(element) {
                      var labelledBy = element.getAttribute('aria-labelledby');
                      var labelElement = document.getElementById(labelledBy);
                      return !labelElement;
                  });
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

AuditRules.unfocusableElementsWithOnClick = {
  ruleName: 'unfocusableElementsWithOnClick',
  severity: Severity.Warning,
  runInDevtools: true,
  run: function(resultsCallback) {
      var extensionId = chrome.i18n.getMessage("@@extension_id"); // yes, really.

      function addEventListener(extensionId) {
          function handleEventListenersEvent(event) {
              var element = event.target;
              clickableElements.push(element);
              if (element.getAttribute('tabindex') == null)
                  unfocusableClickableElements.push(convertElementToResult(event.target));
          }
          clickableElements = [];
          unfocusableClickableElements = [];
          document.addEventListener(extensionId, handleEventListenersEvent);
      }
      chrome.devtools.inspectedWindow.eval('(' + addEventListener + ')("'+ extensionId + '")',
                                          { useContentScriptContext: true });

      function getEventListenersForUnfocusableElements(eventName) {
          var potentialOnclickElements = document.querySelectorAll('span, div, img');

          var unfocusableClickableElements = [];
          for (var i = 0; i < potentialOnclickElements.length; i++) {
              var element = potentialOnclickElements[i];

              // TODO: check for element is visible/hidden
              var eventListeners = getEventListeners(element);
              if ('click' in eventListeners) {
                  var event = document.createEvent('Event');
                  event.initEvent(eventName, true, false);
                  element.dispatchEvent(event);
              }
          }
          return spansAndDivs.length;
      }
      chrome.devtools.inspectedWindow.eval(
          '(' + getEventListenersForUnfocusableElements + ')("' + extensionId + '")');

      function retrieveResults() {
          var result = AuditResult.NA;
          if (clickableElements.length)
              var result = unfocusableClickableElements.length ? AuditResult.FAIL : AuditResult.PASS;

          return { result: result, elements: unfocusableClickableElements };
      }
      chrome.devtools.inspectedWindow.eval('(' + retrieveResults + ')()',
                                           { useContentScriptContext: true },
                                           resultsCallback)
  }
};
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

AuditRules.videoWithoutCaptions =
    new AuditRule('videoWithoutCaptions',
                  Severity.Warning,
                  function() {
                    return document.querySelectorAll('video');
                  },
                  function(video) {
                    var captions = video.querySelectorAll('track[kind=captions]');
                    return !captions.length;
                  });
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

AuditRules.videoWithoutFallbackContent =
    new AuditRule('videoWithoutFallbackContent',
                  Severity.Warning,
                  function() {
                    return document.querySelectorAll('video');
                  },
                  function(video) {
                    if (AccessibilityUtils.isElementOrAncestorHidden(video))
                      return false;

                    return video.textContent.trim() == '';
                  });
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

AuditRules.videoWithoutLabels =
    new AuditRule('videoWithoutLabels',
                  Severity.Warning,
                  function() {
                    return document.querySelectorAll('video');
                  },
                  function(video) {
                    return !AccessibilityUtils.hasLabel(video);
                  });
