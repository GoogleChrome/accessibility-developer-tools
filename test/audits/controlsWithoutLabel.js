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

    deepEqual(AuditRules.rules.controlsWithoutLabel.run(fixture),
              { elements: [], result: AuditResult.PASS });
});
