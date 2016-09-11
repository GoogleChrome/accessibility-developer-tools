module('BadAriaAttributeValue');

test('Empty idref value is ok', function(assert) {
    var fixture = document.getElementById('qunit-fixture');
    var div = document.createElement('div');
    fixture.appendChild(div);
    div.setAttribute('aria-activedescendant', '');
    var config = {
        ruleName: 'badAriaAttributeValue',
        expected: axs.constants.AuditResult.PASS,
        elements: []
    };
    assert.runRule(config);
});

test('Bad number value doesn\'t cause crash', function(assert) {
    var fixture = document.getElementById('qunit-fixture');
    var div = document.createElement('div');
    fixture.appendChild(div);
    div.setAttribute('aria-valuenow', 'foo');
    var config = {
        ruleName: 'badAriaAttributeValue',
        expected: axs.constants.AuditResult.FAIL,
        elements: [div]
    };
    assert.runRule(config);
});

test('Good number value is good', function(assert) {
    var fixture = document.getElementById('qunit-fixture');
    var div = document.createElement('div');
    fixture.appendChild(div);
    div.setAttribute('aria-valuenow', '10');
    var config = {
        ruleName: 'badAriaAttributeValue',
        expected: axs.constants.AuditResult.PASS,
        elements: []
    };
    assert.runRule(config);
});

test('Good decimal number value is good', function(assert) {
    var fixture = document.getElementById('qunit-fixture');
    var div = document.createElement('div');
    fixture.appendChild(div);
    div.setAttribute('aria-valuenow', '0.5');
    var config = {
        ruleName: 'badAriaAttributeValue',
        expected: axs.constants.AuditResult.PASS,
        elements: []
    };
    assert.runRule(config);
});

test('Good negative number value is good', function(assert) {
    var fixture = document.getElementById('qunit-fixture');
    var div = document.createElement('div');
    fixture.appendChild(div);
    div.setAttribute('aria-valuenow', '-10');
    var config = {
        ruleName: 'badAriaAttributeValue',
        expected: axs.constants.AuditResult.PASS,
        elements: []
    };
    assert.runRule(config);
});
