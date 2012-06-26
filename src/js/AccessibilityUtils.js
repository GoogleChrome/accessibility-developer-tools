AccessibilityUtils = {
    focusableElementsSelector: 'input:not([type=hidden]):not([disabled]),' +
                               'select:not([disabled]),' +
                               'textarea:not([disabled]),' +
                               'button:not([disabled]),' +
                               'a[href],' +
                               'iframe,' +
                               '[tabindex]',

    calculateContrastRatio: function (fgColor, bgColor) {
        if (!fgColor || !bgColor)
            return false;

        if (fgColor.alpha < 1)
            fgColor = this.flattenColors(fgColor, bgColor);

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
            !isAncestor(element_at_point, element)) {
            return element_at_point;
        }

        return null;
    },

    elementIsVisible: function(element)
    {
        if (this.elementIsTransparent(element))
            return false;
        if (this.elementHasZeroArea(element))
            return false;
        if (this.elementIsOutsideScrollArea(element))
            return false;
        var overlappingElement = this.overlappingElement(element);
        if (overlappingElement) {
            var overlappingElementStyle = window.getComputedStyle(overlappingElement);
            if (overlappingElementStyle) {
                var overlappingElementBg = this.getBgColor(overlappingElementStyle, overlappingElement);
                if (overlappingElementBg && overlappingElementBg.opacity > 0)
                    return false;
            }
        }

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

        if (style.backgroundImage && style.backgroundImage != "none")
            return false; // too hard

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

    isNativeTextElement: function(element) {
        var tagName = element.tagName.toLowerCase();
        var type = element.type ? element.type.toLowerCase() : "";
        if (tagName == "textarea")
            return true;
        if (tagName != "input")
            return false;

        switch (type) {
            case "email":
            case "number":
            case "password":
            case "search":
            case "text":
            case "tel":
            case "url":
            case "":
                return true;
            default:
                return false;
        }
    },

    isLowContrast: function(contrastRatio, style) {
        return contrastRatio < 3.0 || (!this.isLargeFont(style) && contrastRatio < 4.5);
    },

    hasLabel: function(element) {
        var tagName = element.tagName.toLowerCase();
        var type = element.type ? element.type.toLowerCase() : "";

        if (element.hasAttribute("aria-label"))
            return true;
        if (element.hasAttribute("title"))
            return true;
        if (tagName == "img" && element.hasAttribute("alt"))
            return true;
        if (tagName == "input" && type == "image" && element.hasAttribute("alt"))
            return true;
        if (tagName == "input" && (type == "submit" || type == "reset"))
            return true;

        // There's a separate audit that makes sure this points to an actual element or elements.
        if (element.hasAttribute("aria-labelledby"))
            return true;

        if (this.isNativeTextElement(element) && element.hasAttribute("placeholder"))
            return true;

        // This could be slow! Possible faster solution would be to use querySelector
        // to search for label[for="<id>"] and also check the ancestors of this element
        // to see if any of them is a label element.
        var labels = document.querySelectorAll("label");
        var foundLabel = false;
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

        if (element.hasAttribute('aria-hidden') &&
<<<<<<< HEAD
            element.getAttribute('aria-hidden').toLowerCase() == 'true') {
=======
            element.getAttribute('aria-hidden').toLowerCase() != 'false') {
>>>>>>> 9181204df262497cc19114c9ac6d4978f172f567
            return true;
        }

        return false;
    },

    /**
     * @param {Element} An element to check.
     * @return {boolean} True if the element or one of its ancestors is
     *     hidden from accessibility.
     */
    isElementOrAncestorHidden: function(element) {
        if (this.isElementHidden(element)) {
            return true;
        }

        if (element.parentNode) {
            return this.isElementOrAncestorHidden(element.parentNode);
        } else {
            return false;
        }
    },

    isElementImplicitlyFocusable: function(element) {
        if (element instanceof HTMLAnchorElement || element instanceof HTMLAreaElement)
            return element.hasAttribute('href');
        if (element instanceof HTMLInputElement || element instanceof HTMLSelectElement ||
            element instanceof HTMLTextAreaElement || element instanceof HTMLButtonElement ||
            element instanceof HTMLIFrameElement)
            return !element.disabled;
        return false;
    }
};

