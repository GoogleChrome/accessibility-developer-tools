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
