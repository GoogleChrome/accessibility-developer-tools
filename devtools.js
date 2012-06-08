function init(result) {

    if (result && 'error' in result) {
        console.warn('Could not initialise extension:' + result.error);
        return;
    }

    var numAuditRules = Object.keys(AuditRules).length;
    var category = chrome.experimental.devtools.audits.addCategory('Accessibility', numAuditRules + 1);

    category.onAuditStarted.addListener(function callback(auditResults) {
        auditResults.numAuditRules = 0;
        auditResults.resultsPending = 0;
        auditResults.successfulResults = 0;
        auditResults.callbacksPending = 0;
        auditResults.passedRules = [];
        auditResults.notApplicableRules = [];

        for (auditRuleName in AuditRules) {
            var auditRule = AuditRules[auditRuleName];
            var ruleSeverity = auditResults.Severity[auditRule.severity];
            // TODO batch up results
            if (!auditRule.disabled) {
                console.log('running', auditRuleName);
                var resultsCallback = handleResults.bind(null, auditResults, auditRuleName, ruleSeverity);
                if (auditRule.runInDevtools) {
                    auditRule.run(resultsCallback);
                } else {
                    chrome.devtools.inspectedWindow.eval(
                        'AuditRules["' + auditRuleName + '"].run()',
                        { useContentScriptContext: true },
                        resultsCallback);
                }
                auditResults.numAuditRules += 1;
                auditResults.resultsPending += 1;
            }
        }
    });

    chrome.devtools.panels.elements.createSidebarPane(
        'Accessibility Properties',
        function(sidebar) {
            sidebar.setPage("sidebar.html");
            sidebar.onShown.addListener(function(window) {
                window.sidebar = sidebar;
            })
    });
}

if (chrome.devtools.inspectedWindow.tabId)
    chrome.extension.sendRequest({ tabId: chrome.devtools.inspectedWindow.tabId,
                                   command: 'injectContentScript' }, init);

// TODO: use closure and goog.getMsg?
var auditMsgs = {
    badAriaRole: {
        ruleName: 'Elements with ARIA roles must use a valid, non-abstract ARIA role',
        resultsDetails: 'Only valid ARIA roles will be interpreted by assistive technology like ' +
            ' screen readers. '
    },

    controlsWithoutLabel: {
        ruleName: 'Controls should have labels',
        resultsDetails: 'Unlabelled controls may not be useable for users of assistive technology. ',
/*            '<a href="http://www.w3.org/TR/WCAG20-TECHS/H44.html">WCAG Technique H44</a> gives ' +
            'more information.', */
    },

    focusableElementNotVisibleAndNotAriaHidden: {
        ruleName: 'Focusable elements which are hidden from view should use aria-hidden',
        resultsDetails: 'The aria-hidden ARIA attribute hides elements from assistive technology ' +
            ' like screen readers.'
    },

    imagesWithoutAltText: {
        ruleName: 'Images should have an alt attribute',
        resultsDetails: 'Images should have an alt attribute, unless they have an ARIA role of "presentation". '
/*            '<a href="http://www.w3.org./TR/WCAG20-TECHS/H37.html">WCAG technique H37</a> ' +
            'gives more information.',  // FIXME */
    },

    lowContrastElements: {
        ruleName: 'Text elements should have a minimum contrast ratio of at least 4.5:1, or 3:1 for large fonts',
        resultsDetails: 'Text with a low contrast ratio between text and background may be ' +
            'unreadable to users with low vision, or on some devices. '
/*            '<a href="http://www.w3.org/TR/WCAG20-TECHS/G18.html">WCAG Technique G18</a> gives ' +
            'more information.', */
    },

    nonExistentAriaLabelledbyElement: {
        ruleName: 'aria-labelledby attributes should refer to an element which exists in the DOM',
        resultsDetails: 'When the element that uses the aria-labelledby attribute is accessed by assistive technology ' +
            ' the element id used as the value must exist in the DOM.'
    },

    unfocusableElementsWithOnClick: {
        ruleName: 'Elements with onclick handlers must be focusable',
        resultsDetails: 'Interactive elements that are not keyboard focusable are inaccessible ' +
            ' to users who cannot use a mouse. Enable keyboard focus by setting the tabindex ' +
            ' attribute.'
    },

    videoWithoutCaptions: {
        ruleName: 'Video elements should use <track> elements to provide captions',
        resultsDetails: 'TODO'
    },

    videoWithoutLabels: {
        ruleName: 'Video elements should be labeled',
        resultsDetails: 'TODO'
    },

    videoWithoutFallbackContent: {
        ruleName: 'Video elements should use fallback content',
        resultsDetails: 'TODO'
    },

    generic: {
        ruleName: '',
        resultsDetails: ''
    }
};

function handleResults(auditResults, auditRule, severity, results, isException) {
    auditResults.resultsPending--;
    if (isException) {
        console.warn(auditRule, 'had an error: ', results);
        finalizeAuditResultsIfNothingPending(auditResults);
        return;
    } else if (!results) {
        console.warn(auditRule, 'had no results')
        finalizeAuditResultsIfNothingPending(auditResults);
        return;
    }
    if (results.error) {
        console.warn(auditRule, 'had an error:', results.error);
        finalizeAuditResultsIfNothingPending(auditResults);
        return;
    }
    auditResults.successfulResults++;
    var resultCallbacksPending = 0;
    var msgs = auditMsgs[auditRule];
    if (!msgs)
        msgs = auditMsgs['generic'];
    if (results.result == AuditResult.PASS) {
        auditResults.passedRules.push(auditRule);
    } else if (results.result == AuditResult.NA ) {
        auditResults.notApplicableRules.push(auditRule);
    } else {
        var resultNodes = [];

        for (var i = 0; i < results.elements.length; ++i) {
            var result = results.elements[i];
            if (auditResults.createNode) {
                resultNodes.push(
                    auditResults.createNode('getResultElement("' + result + '")',
                                            { useContentScriptContext: true }));
            } else {
                function addChild(auditResults, result) {
                    resultNodes.push(auditResults.createSnippet(result));
                    auditResults.callbacksPending--;
                    resultCallbacksPending--;
                    if (!resultCallbacksPending) {
                        auditResults.addResult(msgs.ruleName + ' (' + results.elements.length + ')',
                                               msgs.resultsDetails,
                                               severity,
                                               auditResults.createResult(resultNodes));
                    }

                    if (auditResults.resultsPending == 0 && !auditResults.callbacksPending)
                        finalizeAuditResults(auditResults);
                }
                auditResults.callbacksPending++;
                resultCallbacksPending++;
                chrome.devtools.inspectedWindow.eval(
                    'getResultElement("' + result + '").outerHTML',
                    { useContentScriptContext: true },
                    addChild.bind(null, auditResults));
            }
        }
        if (!resultCallbacksPending) {
            auditResults.addResult(msgs.ruleName + ' (' + results.elements.length + ')',
                                   msgs.resultsDetails,
                                   severity,
                                   auditResults.createResult(resultNodes));
        }
    }
    if (auditResults.resultsPending == 0 && !auditResults.callbacksPending && !resultCallbacksPending)
        finalizeAuditResults(auditResults);
}


function finalizeAuditResultsIfNothingPending(auditResults) {
    if (auditResults.resultsPending == 0 &&
        auditResults.successfulResults < auditResults.numAuditRules &&
        !auditResults.callbacksPending)
        finalizeAuditResults(auditResults);
}

function finalizeAuditResults(auditResults) {
    if (auditResults.passedRules.length) {
        var passedDetails = auditResults.createResult('The following tests passed:');
        for (var i = 0; i < auditResults.passedRules.length; i++) {
            var auditRule = auditResults.passedRules[i];
            var msgs = auditMsgs[auditRule];
            passedDetails.addChild(msgs.ruleName);
        }
        auditResults.addResult('Passing tests (' + auditResults.passedRules.length + ')',
                               '',
                               auditResults.Severity.Info,
                               passedDetails);
    }
    if (auditResults.notApplicableRules.length) {
        var notApplicableDetails = auditResults.createResult('The following tests were not applicable:');
        for (var i = 0; i < auditResults.notApplicableRules.length; i++) {
            var auditRule = auditResults.notApplicableRules[i];
            var msgs = auditMsgs[auditRule];
            notApplicableDetails.addChild(msgs.ruleName);
        }
        auditResults.addResult('Not applicable tests (' + auditResults.notApplicableRules.length + ')',
                               '',
                               auditResults.Severity.Info,
                               notApplicableDetails);
    }
    auditResults.done();
}
