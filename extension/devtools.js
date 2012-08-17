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

function init(result) {
    if (result && 'error' in result) {
        console.warn('Could not initialise extension:' + result.error);
        return;
    }

    var numAuditRules = Object.keys(axs.AuditRules.rules).length;
    var category = chrome.experimental.devtools.audits.addCategory(
        chrome.i18n.getMessage('auditTitle'), numAuditRules + 1);

    category.onAuditStarted.addListener(function callback(auditResults) {
        auditResults.numAuditRules = 0;
        auditResults.resultsPending = 0;
        auditResults.successfulResults = 0;
        auditResults.callbacksPending = 0;
        auditResults.passedRules = [];
        auditResults.notApplicableRules = [];

        for (auditRuleCode in axs.AuditRules.rules) {
            var auditRule = axs.AuditRules.rules[auditRuleCode];
            // TODO batch up results
            if (!auditRule.disabled) {
                console.log('running', auditRule.name);
                var resultsCallback = handleResults.bind(null, auditResults, auditRule, auditRule.severity);
                if (auditRule.shouldRunInDevtools) {
                    auditRule.runInDevtools(resultsCallback);
                } else {
                    chrome.devtools.inspectedWindow.eval(
                        'axs.AuditRules.rules["' + auditRuleCode + '"].run()',
                        { useContentScriptContext: true },
                        resultsCallback);
                }
                auditResults.numAuditRules += 1;
                auditResults.resultsPending += 1;
            }
        }
    });

    chrome.devtools.panels.elements.createSidebarPane(
        chrome.i18n.getMessage('sidebarTitle'),
        function(sidebar) {
            sidebar.setPage("sidebar.html");
            sidebar.onShown.addListener(function(window) {
                window.sidebar = sidebar;
            })
    });
}

if (chrome.devtools.inspectedWindow.tabId)
    chrome.extension.sendRequest({ tabId: chrome.devtools.inspectedWindow.tabId,
                                   command: 'injectContentScripts' }, init);

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
    if (results.result == axs.constants.AuditResult.PASS) {
        auditResults.passedRules.push(auditRule);
    } else if (results.result == axs.constants.AuditResult.NA ) {
        auditResults.notApplicableRules.push(auditRule);
    } else {
        var resultNodes = [];
        for (var i = 0; i < results.elements.length; ++i) {
            var result = results.elements[i];
            if (auditResults.createNode) {
                resultNodes.push(
                    auditResults.createNode('axs.content.getResultNode("' + result + '")',
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
                    'axs.content.getResultNode("' + result + '").outerHTML',
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
    var severity = chrome.i18n.getMessage('auditResult_' + auditRule.severity);
    var ruleName = chrome.i18n.getMessage(auditRule.name + '_name');
    var resultString = '[' + severity + '] ' + ruleName + ' (' + numResults + ')';
    var url = chrome.i18n.getMessage(auditRule.name + '_url');
    if (url) {
        var textNode1 = chrome.i18n.getMessage('auditUrl_before');
        var urlNode = auditResults.createURL(url, auditRule.code);
        var textNode2 = chrome.i18n.getMessage('auditUrl_after');
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
        var passedDetails = auditResults.createResult(chrome.i18n.getMessage('passingTestsTitle'));
        for (var i = 0; i < auditResults.passedRules.length; i++) {
            var auditRule = auditResults.passedRules[i];
            passedDetails.addChild(chrome.i18n.getMessage(auditRule.name + '_name'));
        }
        auditResults.addResult(chrome.i18n.getMessage('passingTestsSubtitle', [auditResults.passedRules.length]),
                               '',
                               auditResults.Severity.Info,
                               passedDetails);
    }
    if (auditResults.notApplicableRules.length) {
        var notApplicableDetails = auditResults.createResult(chrome.i18n.getMessage('notApplicableTestsTitle'));
        for (var i = 0; i < auditResults.notApplicableRules.length; i++) {
            var auditRule = auditResults.notApplicableRules[i];
            notApplicableDetails.addChild(chrome.i18n.getMessage(auditRule.name + '_name'));
        }
        auditResults.addResult(chrome.i18n.getMessage('notApplicableTestsSubtitle', [auditResults.notApplicableRules.length]),
                               '',
                               auditResults.Severity.Info,
                               notApplicableDetails);
    }
    auditResults.done();
}
