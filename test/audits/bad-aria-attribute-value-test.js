module("BadAriaAttributeValue");

test("Empty idref value is ok", function() {
    var fixtures = document.getElementById('qunit-fixture');
    var div = document.createElement('div');
    fixtures.appendChild(div);
    div.setAttribute('aria-activedescendant', '');
    deepEqual(
      axs.AuditRules.getRule('badAriaAttributeValue').run([], fixtures),
      { elements: [], result: axs.constants.AuditResult.PASS }
    );
});
