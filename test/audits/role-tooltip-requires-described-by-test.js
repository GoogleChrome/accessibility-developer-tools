module('RoleTooltipRequiresDescribedBy');

test('role tooltip with a corresponding aria-describedby should pass', function(assert) {
    var fixture = document.getElementById('qunit-fixture');
    var tooltip = document.createElement('div');
    var trigger = document.createElement('div');
    fixture.appendChild(tooltip);
    fixture.appendChild(trigger);
    tooltip.setAttribute('role', 'tooltip');
    tooltip.setAttribute('id', 'tooltip1');
    trigger.setAttribute('aria-describedby', 'tooltip1');

    var config = {
        ruleName: 'roleTooltipRequiresDescribedby',
        expected: axs.constants.AuditResult.PASS,
        elements: []
    };
    assert.runRule(config);
});

test('role tooltip with multiple corresponding aria-describedby should pass', function(assert) {
    var fixture = document.getElementById('qunit-fixture');
    var tooltip = document.createElement('div');
    var trigger1 = document.createElement('div');
    var trigger2 = document.createElement('div');
    fixture.appendChild(tooltip);
    fixture.appendChild(trigger1);
    fixture.appendChild(trigger2);
    tooltip.setAttribute('role', 'tooltip');
    tooltip.setAttribute('id', 'tooltip1');
    trigger1.setAttribute('aria-describedby', 'tooltip1');
    trigger2.setAttribute('aria-describedby', 'tooltip1');

    var config = {
        ruleName: 'roleTooltipRequiresDescribedby',
        expected: axs.constants.AuditResult.PASS,
        elements: []
    };
    assert.runRule(config);
});

test('role tooltip without a aria-describedby should fail', function(assert) {
    var fixture = document.getElementById('qunit-fixture');
    var tooltip = document.createElement('div');
    fixture.appendChild(tooltip);
    tooltip.setAttribute('role', 'tooltip');
    tooltip.setAttribute('id', 'tooltip1');

    var config = {
        ruleName: 'roleTooltipRequiresDescribedby',
        expected: axs.constants.AuditResult.FAIL,
        elements: [tooltip]
    };
    assert.runRule(config);
});

test('role tooltip without a corresponding aria-describedby should fail', function(assert) {
    var fixture = document.getElementById('qunit-fixture');
    var tooltip = document.createElement('div');
    var trigger = document.createElement('div');
    fixture.appendChild(tooltip);
    fixture.appendChild(trigger);
    tooltip.setAttribute('role', 'tooltip');
    tooltip.setAttribute('id', 'tooltip1');
    trigger.setAttribute('aria-describedby', 'tooltip2');

    var config = {
        ruleName: 'roleTooltipRequiresDescribedby',
        expected: axs.constants.AuditResult.FAIL,
        elements: [tooltip]
    };
    assert.runRule(config);
});

test('a hidden tooltip without a corresponding aria-describedby should not fail', function(assert) {
    var fixture = document.getElementById('qunit-fixture');
    var tooltip = document.createElement('div');
    var trigger = document.createElement('div');
    fixture.appendChild(tooltip);
    fixture.appendChild(trigger);
    tooltip.setAttribute('aria-hidden', true);
    tooltip.setAttribute('role', 'tooltip');
    tooltip.setAttribute('id', 'tooltip1');
    trigger.setAttribute('aria-describedby', 'tooltip2');

    var config = {
        ruleName: 'roleTooltipRequiresDescribedby',
        expected: axs.constants.AuditResult.NA
    };
    assert.runRule(config);
});
