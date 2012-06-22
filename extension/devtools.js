function init(result) {

    if (result && 'error' in result) {
        console.warn('Could not initialise extension:' + result.error);
        return;
    }

    var numAuditRules = Object.keys(AuditRules.rules).length;
    var category = chrome.experimental.devtools.audits.addCategory('Accessibility', numAuditRules + 1);

    category.onAuditStarted.addListener(function callback(auditResults) {
        auditResults.numAuditRules = 0;
        auditResults.resultsPending = 0;
        auditResults.successfulResults = 0;
        auditResults.callbacksPending = 0;
        auditResults.passedRules = [];
        auditResults.notApplicableRules = [];

        for (auditRuleCode in AuditRules.rules) {
            var auditRule = AuditRules.rules[auditRuleCode];
            // TODO batch up results
            if (!auditRule.disabled) {
                console.log('running', auditRule.name);
                var resultsCallback = handleResults.bind(null, auditResults, auditRule, auditRule.severity);
                if (auditRule.shouldRunInDevtools) {
                    auditRule.runInDevtools(resultsCallback);
                } else {
                    chrome.devtools.inspectedWindow.eval(
                        'AuditRules.rules["' + auditRuleCode + '"].run()',
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

function handleResults(auditResults, auditRule, severity, results, isException) {
    auditResults.resultsPending--;
    if (isException) {
        console.warn(auditRule.name, 'had an error: ', results);
        finalizeAuditResultsIfNothingPending(auditResults);
        return;
    } else if (!results) {
        console.warn(auditRule.name, 'had no results')
        finalizeAuditResultsIfNothingPending(auditResults);
        return;
    }
    if (results.error) {
        console.warn(auditRule.name, 'had an error:', results.error);
        finalizeAuditResultsIfNothingPending(auditResults);
        return;
    }
    auditResults.successfulResults++;
    var resultCallbacksPending = 0;
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
                        addResult(auditResults, auditRule, results.elements.length, resultNodes);
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
        if (!resultCallbacksPending)
            addResult(auditResults, auditRule, results.elements.length, resultNodes);
    }
    if (auditResults.resultsPending == 0 && !auditResults.callbacksPending && !resultCallbacksPending)
        finalizeAuditResults(auditResults);
}

function addResult(auditResults, auditRule, numResults, resultNodes) {
    var resultString = '[' + auditRule.severity + '] ' + auditRule.ruleName + ' (' + numResults + ')';
    if (auditRule.url) {
        var textNode1 = 'See ';
        var urlNode = auditResults.createURL(auditRule.url, auditRule.code);
        var textNode2 = ' for more information.';
        resultNodes.unshift(textNode2);
        resultNodes.unshift(urlNode);
        resultNodes.unshift(textNode1);
    }
    auditResults.addResult(resultString,
                           '',
                           auditResults.Severity[auditRule.severity],
                           auditResults.createResult(resultNodes));
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
            passedDetails.addChild(auditRule.ruleName);
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
            notApplicableDetails.addChild(auditRule.ruleName);
        }
        auditResults.addResult('Not applicable tests (' + auditResults.notApplicableRules.length + ')',
                               '',
                               auditResults.Severity.Info,
                               notApplicableDetails);
    }
    auditResults.done();
}
