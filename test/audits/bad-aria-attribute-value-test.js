module('BadAriaAttributeValue');

test('Empty idref value is ok', function() {
    var fixtures = document.getElementById('qunit-fixture');
    var div = document.createElement('div');
    fixtures.appendChild(div);
    div.setAttribute('aria-activedescendant', '');
    deepEqual(
      axs.AuditRules.getRule('badAriaAttributeValue').run([], fixtures),
      { elements: [], result: axs.constants.AuditResult.PASS }
    );
});

test('Bad number value doesn\'t cause crash', function() {
    var fixtures = document.getElementById('qunit-fixture');
    var div = document.createElement('div');
    fixtures.appendChild(div);
    div.setAttribute('aria-valuenow', 'foo');
    deepEqual(
      axs.AuditRules.getRule('badAriaAttributeValue').run([], fixtures),
      { elements: [div], result: axs.constants.AuditResult.FAIL }
    );
});

test('Good number value is good', function() {
    var fixtures = document.getElementById('qunit-fixture');
    var div = document.createElement('div');
    fixtures.appendChild(div);
    div.setAttribute('aria-valuenow', '10');
    deepEqual(
      axs.AuditRules.getRule('badAriaAttributeValue').run([], fixtures),
      { elements: [], result: axs.constants.AuditResult.PASS }
    );
});
