goog.provide('axs.testing.matchers');

/**
 * A custom matcher for Jasmine that checks whether the element and all
 * descendants pass a suite of accessibility checks.
 *
 * Example:
 *
 *   expect(element).toBeAccessible();
 *
 *
 * @this {*}
 * @return {boolean}
 */

axs.testing.matchers.toBeAccessible = function() {
  if(typeof jasmine !== "undefined" && typeof beforeEach !== "undefined") {
    var config = new axs.AuditConfiguration();
    config.scope = this.actual;

    var audit = axs.Audit.run(config);
    var results = axs.Audit.auditResults(audit);
    var passing = results.numErrors() === 0;

    if (!this.isNot) {
      this.message = results.toString().bind(results);
    }

    return passing;
  }
};
