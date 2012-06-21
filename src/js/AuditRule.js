AuditRule.requiredFields = [ 'name', 'severity', 'relevantNodesSelector', 'test', 'code', 'ruleName', 'resultsDetails' ];

/**
 * @constructor
 * @param {Object} spec A spec of the form
 *     { name: string,
 *       severity: Severity,
 *       relevantNodesSelector: function(): Array.<node>|NodeList|XPathResult,
 *       test: function(node): boolean
 *       opt_shouldRunInDevtools: boolean
 * }
 */
function AuditRule(spec) {
    var isValid = true;
    var missingFields = [];
    for (var i = 0; i < AuditRule.requiredFields.length; i++) {
        var requiredField = AuditRule.requiredFields[i];
        if (!(requiredField in spec)) {
            isValid = false;
            missingFields.push(requiredField);
        }
    }
    if (!isValid) {
        throw 'Invalid spec; the following fields were not specified: ' + missingFields.join(', ') +
              '\n' + JSON.stringify(spec);
    }
    this.name = spec.name;
    this.severity = spec.severity;
    this.relevantNodesSelector_ = spec.relevantNodesSelector;
    this.test_ = spec.test;
    this.shouldRunInDevtools = !!spec.opt_shouldRunInDevtools;
    this.code = spec.code;
    this.ruleName = spec.ruleName;
    this.resultsDetails = spec.resultsDetails;
    if (spec.url)
        this.url = spec.url;
};


/**
 * The return value for a non-applicable audit result.
 *
 * @type {{result: string}}
 * @const
 */
AuditRule.NOT_APPLICABLE = { result: AuditResult.NA };

/**
 * @param {?Element} scope The scope in which the node selector should run.
 *     Defaults to `document`.
 * @return {Object.<AuditResult, ?Array.<node>>}
 */
AuditRule.prototype.run = function(scope) {
    this.auditscope_ = scope || document;

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
};

AuditRule.prototype.runInDevtools = function(resultsCallback) {
    this.auditscope_ = document;

    var extensionId = chrome.i18n.getMessage("@@extension_id"); // yes, really.
    var uniqueEventName = extensionId + '-' + this.name;

    function addEventListener(uniqueEventName, test) {
        function handleEventListenersEvent(event) {
            var element = event.target;
            relevantNodes.push(element);
            if (test(element))
                failingNodes.push(convertElementToResult(event.target));
        }
        relevantNodes = [];
        failingNodes = [];
        document.addEventListener(uniqueEventName, handleEventListenersEvent);
    }
    chrome.devtools.inspectedWindow.eval('(' + addEventListener + ')("'+ uniqueEventName + '", ' + this.test_ + ')',
                                         { useContentScriptContext: true });

    function sendRelevantNodesToContentScript(relevantNodesSelector, eventName) {
        var relevantNodes = relevantNodesSelector();
        for (var i = 0; i < relevantNodes.length; i++) {
            var node = relevantNodes[i];
            var event = document.createEvent('Event');
            event.initEvent(eventName, true, false);
            node.dispatchEvent(event);
        }
    }
    var stringToEval = '(function() { var AccessibilityUtils = {};\n' +
        // TODO all of AccessibilityUtils? Have selected methods in AuditRule?
        'AccessibilityUtils.isElementHidden = ' + AccessibilityUtils.isElementHidden + ';\n' +
        'AccessibilityUtils.isElementOrAncestorHidden = ' + AccessibilityUtils.isElementOrAncestorHidden + ';\n' +
        'AccessibilityUtils.isElementImplicitlyFocusable = ' + AccessibilityUtils.isElementImplicitlyFocusable + ';\n' +
        'var relevantNodesSelector = ' + this.relevantNodesSelector_ + ';\n' +
        sendRelevantNodesToContentScript + ';\n sendRelevantNodesToContentScript(relevantNodesSelector, "' +
        uniqueEventName + '"); })()';
    chrome.devtools.inspectedWindow.eval(stringToEval);

    function retrieveResults() {
        var result = AuditResult.NA;
        if (relevantNodes.length)
            var result = failingNodes.length ? AuditResult.FAIL : AuditResult.PASS;

        return { result: result, elements: failingNodes };
    }
    chrome.devtools.inspectedWindow.eval('(' + retrieveResults + ')()',
                                         { useContentScriptContext: true },
                                         resultsCallback)
};
