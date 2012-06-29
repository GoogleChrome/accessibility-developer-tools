Properties = {
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
                labelsForControl["aria-labelledby"] = '!' + chrome.i18n.getMessage('noElementWithId', labelledbyId);
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

