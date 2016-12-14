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

goog.require('axs.AuditResults');
goog.require('axs.AuditRules');
goog.require('axs.utils');

goog.provide('axs.Audit');
goog.provide('axs.AuditConfiguration');


/**
 * Object to hold configuration for an Audit run.
 * @constructor
 * @param {?Object=} config Configuration object
 *   The following configuration options are supported:
 *   - scope
 *   - auditRulesToRun
 *   - auditRulesToIgnore
 *   - maxResults
 *   - withConsoleApi
 *   - walkDom
 *   - showUnsupportedRulesWarning
 */
axs.AuditConfiguration = function(config) {
    if (config == null) {
        config = {};
    }

    /**
     * Dictionary of { audit rule name : { rules } } where rules is a dictionary
     * of { rule type : value }.
     * Possible rule types:
     * - ignore: value is a list of CSS selectors representing parts of the page
     *           which can be ignored for this audit rule.
     * - config: value is an object containing configuration for this audit
     *           rule. It will be passed to the test() method.
     * @type {Object}
     * @private
     */
    this.rules_ = {};

    /**
     * The "start point" for the audit: the element which contains the portion of
     * the page which should be audited.
     * If null, the document will be used as the scope.
     * @type {?Element}
     */
    this.scope = null;

    /**
     * A list of rule names representing the audit rules to be run. If this is
     * empty or |null|, all audit rules will be run.
     * @type {Array.<String>}
     */
    this.auditRulesToRun = null;

    /**
     * A list of rule names representing the audit rules which should not be run.
     * If this is empty or |null|, all audit rules will be run.
     * @type {Array.<String>}
     */
    this.auditRulesToIgnore = null;

    /**
     * The maximum number of results to collect for each audit rule. If more
     * than this number of results is found, 'resultsTruncated' is set to true
     * in the result object. If this is null, all results will be returned.
     */
    this.maxResults = null;

    /**
     * Whether this audit run can use the console API.
     * @type {boolean}
     */
    this.withConsoleApi = false;

    /**
     * By default the entire DOM tree is traversed regardless of the scope set in the configuration.
     * This is to ensure that idrefs are collected and that disabled ancestors are considered.
     *
     * Setting this flag to false means that only the scope will be traversed and therefore only disabled
     * ancestors, hidden ancestors and idrefs within the scope will be found.
     *
     * Examples of when to set this to `false` are:
     *  - You are running unit tests in a browser and KNOW that the only part of the DOM you care about is
     *  contiained within a particular fixture element.
     *  - You are auditing a web app where you know for sure that everything you are interested in is scoped
     *  within a particular container.
     *
     * @type {boolean}
     */
    this.walkDom = true;

    /**
     * Do we want to show a warning that there are audit rules which are not supported in this configuration?
     * @type {boolean}
     */
    this.showUnsupportedRulesWarning = true;

    for (var prop in this) {
        if ((this.hasOwnProperty(prop)) && (prop in config)) {
            this[prop] = config[prop];
        }
    }

    goog.exportProperty(this, 'scope', this.scope);
    goog.exportProperty(this, 'auditRulesToRun', this.auditRulesToRun);
    goog.exportProperty(this, 'auditRulesToIgnore', this.auditRulesToIgnore);
    goog.exportProperty(this, 'withConsoleApi', this.withConsoleApi);
    goog.exportProperty(this, 'walkDom', this.walkDom);
    goog.exportProperty(this, 'showUnsupportedRulesWarning', this.showUnsupportedRulesWarning);
};
goog.exportSymbol('axs.AuditConfiguration', axs.AuditConfiguration);

axs.AuditConfiguration.prototype = {
    /**
     * Add the given selectors to the ignore list for the given audit rule.
     * @param {string} auditRuleName The name of the audit rule
     * @param {Array.<string>} selectors Query selectors to match nodes to
     *     ignore
     */
    ignoreSelectors: function(auditRuleName, selectors) {
        if (!(auditRuleName in this.rules_))
            this.rules_[auditRuleName] = {};
        if (!('ignore' in this.rules_[auditRuleName]))
            this.rules_[auditRuleName].ignore = [];
        Array.prototype.push.call(this.rules_[auditRuleName].ignore, selectors);
    },

    /**
     * Gets the selectors which have been added to the ignore list for the given
     * audit rule.
     * @param {string} auditRuleName The name of the audit rule
     * @return {Array.<string>} A list of query selector strings which match nodes
     * to be ignored for the given rule.
     */
    getIgnoreSelectors: function(auditRuleName) {
        if ((auditRuleName in this.rules_) &&
            ('ignore' in this.rules_[auditRuleName])) {
            return this.rules_[auditRuleName].ignore;
        }
        return [];
    },

    /**
     * Sets the user-specified severity for the given audit rule. This will
     * replace the default severity for that audit rule in the audit results.
     * @param {string} auditRuleName
     * @param {axs.constants.Severity} severity
     */
    setSeverity: function(auditRuleName, severity) {
        if (!(auditRuleName in this.rules_))
            this.rules_[auditRuleName] = {};
        this.rules_[auditRuleName].severity = severity;
    },

    getSeverity: function(auditRuleName) {
        if (!(auditRuleName in this.rules_))
            return null;
        if (!('severity' in this.rules_[auditRuleName]))
            return null;
        return this.rules_[auditRuleName].severity;
    },

    /**
     * Sets the user-specified configuration for the given audit rule. This will
     * vary in structure from rule to rule; see individual rules for
     * configuration options.
     * @param {string} auditRuleName
     * @param {Object} config
     */
    setRuleConfig: function(auditRuleName, config) {
        if (!(auditRuleName in this.rules_))
            this.rules_[auditRuleName] = {};
        this.rules_[auditRuleName].config = config;
    },

    /**
     * Gets the user-specified configuration for the given audit rule.
     * @param {string} auditRuleName
     * @return {Object?} The configuration object for the given audit rule.
     */
    getRuleConfig: function(auditRuleName) {
        if (!(auditRuleName in this.rules_))
            return null;
        if (!('config' in this.rules_[auditRuleName]))
            return null;
        return this.rules_[auditRuleName].config;
    }
};
goog.exportProperty(axs.AuditConfiguration.prototype, 'ignoreSelectors',
                    axs.AuditConfiguration.prototype.ignoreSelectors);
goog.exportProperty(axs.AuditConfiguration.prototype, 'getIgnoreSelectors',
                    axs.AuditConfiguration.prototype.getIgnoreSelectors);

axs.Audit.unsupportedRulesWarningShown = false;

/**
 * Returns the rules that cannot run.
 * For example, if the current configuration requires the console API, these
 * consist of the rules that require it.
 * @param {axs.AuditConfiguration=} opt_configuration
 * @return {Array.<String>}  A list of rules that cannot be run
 */
axs.Audit.getRulesCannotRun = function(opt_configuration) {
    if (opt_configuration.withConsoleApi) {
        return [];
    }
    return axs.AuditRules.getRules().filter(function(rule) {
            return rule.requiresConsoleAPI;
        }).map(function(rule) {
            return rule.code;
        });
};

/**
 * Runs an audit with all of the audit rules.
 * @param {axs.AuditConfiguration=} opt_configuration
 * @return {Array.<Object>} Array of Object:
 *     {
 *       result,    // @type {axs.constants.AuditResult}
 *       elements,  // @type {Array.<Element>}
 *       rule       // @type {axs.AuditRule} - data only (name, severity, code)
 *     }
 */
axs.Audit.run = function(opt_configuration) {
    var configuration = opt_configuration || new axs.AuditConfiguration();

    if (!axs.Audit.unsupportedRulesWarningShown && configuration.showUnsupportedRulesWarning) {
        var unsupportedRules = axs.Audit.getRulesCannotRun(configuration);
        if (unsupportedRules.length > 0) {
            console.warn("Some rules cannot be checked using the axs.Audit.run() method call. Use the Chrome plugin to check these rules: " + unsupportedRules.join(", "));
            console.warn("To remove this message, pass an AuditConfiguration object to axs.Audit.run() and set configuration.showUnsupportedRulesWarning = false.");
        }

        axs.Audit.unsupportedRulesWarningShown = true;
    }

    var auditRules = axs.AuditRules.getActiveRules(configuration);

    // As a performance optimization set the collectIdRefs flag to false if none of the rules needs it.
    configuration.collectIdRefs = auditRules.some(function(auditRule) {
        return auditRule.collectIdRefs;
    });

    if (!configuration.scope) {
        configuration.scope = document.documentElement;
    }

    axs.Audit.collectMatchingElements(configuration, auditRules);

    var results = [];
    for (var i = 0; i < auditRules.length; i++) {
        var auditRule = auditRules[i];
        if (!auditRule.canRun(configuration))
            continue;
        results.push(auditRule.run(configuration));
    }
    return results;
};
goog.exportSymbol('axs.Audit.run', axs.Audit.run);

(function() {
    /**
     * Runs the element collection phase of the audit.
     * This performs a complete traversal of the relevant DOM tree.
     *    Each registered AudtRule is given the opportunity to examine each DOM element
     *    to determine if it is "relevant" or "interesting".
     *
     * Since the DOM may change over time it is recommended to run the Audits in the same event loop as this call.
     * @param {axs.AuditConfiguration} configuration Configuration for this run.
     * @param {Array.<axs.AuditRule>} auditRules The active audit rules.
     */
    axs.Audit.collectMatchingElements = function(configuration, auditRules) {
        var rootFlags = {
            walkDom: configuration.walkDom,
            collectIdRefs: configuration.collectIdRefs,
            level: 0,
            ignoring: {},
            disabled: false,
            hidden: false
        };
        var root = configuration.walkDom ? document.documentElement : configuration.scope;
        // Because 'related elements' could occur anywhere in the DOM we need to start at document.documentElement
        axs.dom.composedTreeSearch(root, null, { preorder: function(element, flags) {
            if (!flags.inScope)
                flags.inScope = element === configuration.scope;
            for (var i = 0; i < auditRules.length; i++) {
                var auditRule = auditRules[i];
                if (!auditRule.canRun(configuration))
                    continue;
                auditRule._options = new AuditOptions(configuration, auditRule);  // always rebuild this, it could change each run
                var ignore = flags.ignoring[auditRule.name] ||
                        (flags.ignoring[auditRule.name] = auditRule._options.shouldIgnore(element));
                if (!ignore) {
                    auditRule.collectMatchingElement(element, flags);
                }
            }
            return true;
        } }, rootFlags);
    };

    /**
     * Represents options pertaining to a specific AuditRule.
     * Instances may have the following optional named parameters:
     *     ignoreSelectors: Selectors for parts of the page to ignore for this rule.
     *     config: Any per-rule configuration.
     * @param {axs.AuditConfiguration} configuration Config for the audits.
     * @param {axs.AuditRule} auditRule The AuditRule whose options we want.
     * @constructor
     */
    function AuditOptions(configuration, auditRule) {
        var ignoreSelectors = configuration.getIgnoreSelectors(auditRule.name);
        if (ignoreSelectors.length > 0 || configuration.scope)
            this.ignoreSelectors = ignoreSelectors;
        var ruleConfig = configuration.getRuleConfig(auditRule.name);
        if (ruleConfig)
            this.config = ruleConfig;
    }

    /**
     * Determine if this element should be ignored by the AuditRule.
     * @param {Element} element An audit candidate.
     * @returns {boolean} true if this element should be ignored by this AuditRule.
     */
    AuditOptions.prototype.shouldIgnore = function(element) {
        var ignoreSelectors = this.ignoreSelectors;
        if (ignoreSelectors) {
            for (var i = 0; i < ignoreSelectors.length; i++) {
                if (axs.browserUtils.matchSelector(element, ignoreSelectors[i]))
                    return true;
            }
        }
        return false;
    };
})();
/**
 * Create an AuditResults object citing failures and warnings, for use in
 * continuous builds.
 * @param {Array.<Object>} results The results returned from the audit run.
 * @return  {axs.AuditResults} a report of the audit results.
 */
axs.Audit.auditResults = function(results) {
    var auditResults = new axs.AuditResults();
    for (var i = 0; i < results.length; i++) {
        var result = results[i];
        if (result.result != axs.constants.AuditResult.FAIL)
            continue;

        if (result.rule.severity == axs.constants.Severity.SEVERE) {
            auditResults.addError(
                axs.Audit.accessibilityErrorMessage(result));
        } else {
            auditResults.addWarning(
                axs.Audit.accessibilityErrorMessage(result));
        }
    }
    return auditResults;
};
goog.exportSymbol('axs.Audit.auditResults', axs.Audit.auditResults);

/**
 * Create a report based on the results of an Audit.
 * @param {Array.<Object>} results The results returned from axs.Audit.run();
 * @param {?string} opt_url A URL to visit for more information.
 * @return {string} A report of the audit results.
 */
axs.Audit.createReport = function(results, opt_url) {
    var message = '*** Begin accessibility audit results ***';
    message += '\nAn accessibility audit found ';

    message += axs.Audit.auditResults(results).toString();

    if (opt_url) {
        message += '\nFor more information, please see ' ;
        message += opt_url;
    }

    message += '\n*** End accessibility audit results ***';
    return message;
};
goog.exportSymbol('axs.Audit.createReport', axs.Audit.createReport);

/**
 * Creates an error message for a given accessibility audit result object.
 * @param {Object.<string, (string|Array.<Element>)>} result The result
 *     object returned from the audit.
 * @return {string} An error message describing the failure and listing the
 *     query selectors for up to five elements which failed the audit rule.
 */
axs.Audit.accessibilityErrorMessage = function(result) {
    if (result.rule.severity == axs.constants.Severity.SEVERE)
        var message = 'Error: ';
    else
        var message = 'Warning: ';
    message += result.rule.code + ' (' + result.rule.heading +
        ') failed on the following ' +
        (result.elements.length == 1 ? 'element' : 'elements');

    if (result.elements.length == 1)
        message += ':';
    else {
        message += ' (1 - ' + Math.min(5, result.elements.length) +
                   ' of ' + result.elements.length + '):';
    }

    var maxElements = Math.min(result.elements.length, 5);
    for (var i = 0; i < maxElements; i++) {
        var element = result.elements[i];
        message += '\n';
        // Get query selector not browser independent. catch any errors and
        // default to simple tagName.
        try {
            message += axs.utils.getQuerySelectorText(element);
        } catch (err) {
            message += ' tagName:' + element.tagName;
            message += ' id:' + element.id;
        }
    }
    if (result.rule.url != '')
        message += '\nSee ' + result.rule.url + ' for more information.';
    return message;
};
goog.exportSymbol('axs.Audit.accessibilityErrorMessage', axs.Audit.accessibilityErrorMessage);
