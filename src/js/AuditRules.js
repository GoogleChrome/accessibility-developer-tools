var AuditRules = {
    /** @type Object.<string, AuditRule> */
    rules: {},

    /**
     * Adds an audit rule with the given spec to the list of rules.
     * Throws an exception if a rule with the given name already exists.
     * @param {Object} spec A spec of the form
     *     { name: string,
     *       severity: Severity,
     *       relevantNodesSelector: function(): Array.<node>|NodeList|XPathResult,
     *       test: function(node): boolean }
     */
    addRule: function(spec) {
        if (spec.code in this.rules)
            throw spec.code + ' audit rule already exists';

        var auditRule = new AuditRule(spec);
        this.rules[spec.code] = auditRule;
    }
};
