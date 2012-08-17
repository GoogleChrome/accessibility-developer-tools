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

    equal(axs.AuditRules.rules.controlsWithoutLabel.run(fixture).result,
          axs.constants.AuditResult.PASS);
});

test('Button element with inner text needs no label', function() {
    // Setup fixture
    var fixture = document.getElementById('qunit-fixture');

    var button = document.createElement('button');
    button.innerText = 'Click me!';
    fixture.appendChild(button);

    equal(axs.AuditRules.rules.controlsWithoutLabel.run(fixture).result,
          axs.constants.AuditResult.PASS);
});

test('Button element with empty inner text does need a label', function() {
    // Setup fixture
    var fixture = document.getElementById('qunit-fixture');

    var button = document.createElement('button');
    button.innerHTML = '<span></span>';
    fixture.appendChild(button);

    equal(axs.AuditRules.rules.controlsWithoutLabel.run(fixture).result,
          axs.constants.AuditResult.FAIL);
});
