module('ControlsWithoutLabel');

test('Button with type="submit" or type="reset" has label', function() {
    // Setup fixture
    var fixture = document.getElementById('qunit-fixture');

    var submitInput = document.createElement('input');
    submitInput.type = 'submit';
    fixture.appendChild(submitInput);
    var resetInput = document.createElement('input');
    resetInput.type = 'reset';
    fixture.appendChild(resetInput);

    var rule = axs.AuditRules.getRule('controlsWithoutLabel');
    equal(rule.run({scope: fixture}).result,
          axs.constants.AuditResult.PASS);
});

test('Button element with inner text needs no label', function() {
    // Setup fixture
    var fixture = document.getElementById('qunit-fixture');

    var button = document.createElement('button');
    button.textContent = 'Click me!';
    fixture.appendChild(button);

    var rule = axs.AuditRules.getRule('controlsWithoutLabel');
    equal(rule.run({ scope: fixture }).result,
          axs.constants.AuditResult.PASS);
});

test('Button element with empty inner text does need a label', function() {
    // Setup fixture
    var fixture = document.getElementById('qunit-fixture');

    var button = document.createElement('button');
    button.innerHTML = '<span></span>';
    fixture.appendChild(button);

    var rule = axs.AuditRules.getRule('controlsWithoutLabel');
    equal(rule.run({ scope: fixture }).result,
          axs.constants.AuditResult.FAIL);
});

test('Input type button with value needs no label', function() {
    // Setup fixture
    var fixture = document.getElementById('qunit-fixture');

    var input = document.createElement('input');
    input.type = 'button';
    input.value = 'Click me!';
    fixture.appendChild(input);

    var rule = axs.AuditRules.getRule('controlsWithoutLabel');
    equal(rule.run({ scope: fixture }).result,
          axs.constants.AuditResult.PASS);
});
