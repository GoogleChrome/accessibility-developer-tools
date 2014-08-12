module('NonExistentAriaRelatedElement');
[
  'aria-activedescendant',//strictly speaking some of the tests do not apply to this one
  'aria-controls',
  'aria-describedby',
  'aria-flowto',
  'aria-labelledby',
  'aria-owns'].forEach(function(ariaPropUnderTest){
    test('Element exists, single ' + ariaPropUnderTest + ' value', function() {
        var fixture = document.getElementById('qunit-fixture');
        var referentElement = document.createElement('div');
        referentElement.textContent = 'label';
        referentElement.id = 'theLabel';
        fixture.appendChild(referentElement);

        var refererElement = document.createElement('div');
        refererElement.setAttribute(ariaPropUnderTest, 'theLabel');
        fixture.appendChild(refererElement);

        var rule = axs.AuditRules.getRule('nonExistentAriaRelatedElement');
        deepEqual(rule.run({ scope: fixture }),
                  { elements: [], result: axs.constants.AuditResult.PASS });
    });

    test('Element doesn\'t exist, single ' + ariaPropUnderTest + ' value', function() {
        var fixture = document.getElementById('qunit-fixture');

        var refererElement = document.createElement('div');
        refererElement.setAttribute(ariaPropUnderTest, 'notALabel');
        fixture.appendChild(refererElement);
        var rule = axs.AuditRules.getRule('nonExistentAriaRelatedElement');
        var result = rule.run({ scope: fixture });
        equal(result.result, axs.constants.AuditResult.FAIL);
        equal(result.elements.length, 1);
    });

    test('Multiple referent elements exist with ' + ariaPropUnderTest, function() {
        var fixture = document.getElementById('qunit-fixture');
        var referentElement = document.createElement('div');
        referentElement.textContent = 'label';
        referentElement.id = 'theLabel';
        fixture.appendChild(referentElement);

        var referentElement2 = document.createElement('div');
        referentElement2.textContent = 'label2';
        referentElement2.id = 'theOtherLabel';
        fixture.appendChild(referentElement2);

        var refererElement = document.createElement('div');
        refererElement.setAttribute(ariaPropUnderTest, 'theLabel theOtherLabel');
        fixture.appendChild(refererElement);

        var rule = axs.AuditRules.getRule('nonExistentAriaRelatedElement');
        deepEqual(rule.run({ scope: fixture }),
                  { elements: [], result: axs.constants.AuditResult.PASS });

    });

    test('One element doesn\'t exist, multiple '  + ariaPropUnderTest +  ' value', function() {
        var fixture = document.getElementById('qunit-fixture');

        var referentElement = document.createElement('div');
        referentElement.textContent = 'label';
        referentElement.id = 'theLabel';
        fixture.appendChild(referentElement);

        var refererElement = document.createElement('div');
        refererElement.setAttribute(ariaPropUnderTest, 'theLabel notALabel');
        fixture.appendChild(refererElement);
        var rule = axs.AuditRules.getRule('nonExistentAriaRelatedElement');
        var result = rule.run({ scope: fixture });
        equal(result.result, axs.constants.AuditResult.FAIL);
        equal(result.elements.length, 1);
    });

    test('Using ignoreSelectors with ' + ariaPropUnderTest, function() {
        var fixture = document.getElementById('qunit-fixture');

        var referentElement = document.createElement('div');
        referentElement.textContent = 'label2';
        referentElement.id = 'theLabel2';
        fixture.appendChild(referentElement);

        var refererElement = document.createElement('div');
        refererElement.id = 'labelledbyElement2';
        refererElement.setAttribute(ariaPropUnderTest, 'theLabel2 notALabel2');
        fixture.appendChild(refererElement);

        var rule = axs.AuditRules.getRule('nonExistentAriaRelatedElement');
        var ignoreSelectors = ['#labelledbyElement2'];
        var result = rule.run({ ignoreSelectors: ignoreSelectors, scope: fixture });
        equal(result.result, axs.constants.AuditResult.PASS);
    });
});