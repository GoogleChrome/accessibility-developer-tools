module('NonExistentRelatedElement');
[
  'aria-activedescendant',  // strictly speaking sometests do not apply to this
  'aria-controls',
  'aria-describedby',
  'aria-flowto',
  'aria-labelledby',
  'aria-owns'].forEach(function(testProp) {
    test('Element exists, single ' + testProp + ' value', function(assert) {
        var fixture = document.getElementById('qunit-fixture');
        var referentElement = document.createElement('div');
        referentElement.textContent = 'label';
        referentElement.id = 'theLabel';
        fixture.appendChild(referentElement);

        var refererElement = document.createElement('div');
        refererElement.setAttribute(testProp, 'theLabel');
        fixture.appendChild(refererElement);

        var config = {
            ruleName: 'nonExistentRelatedElement',
            expected: axs.constants.AuditResult.PASS,
            elements: []
        };
        assert.runRule(config);
    });

    test('Element doesn\'t exist, single ' + testProp + ' value', function(assert) {
        var fixture = document.getElementById('qunit-fixture');

        var refererElement = document.createElement('div');
        refererElement.setAttribute(testProp, 'notALabel');
        fixture.appendChild(refererElement);

        var config = {
            ruleName: 'nonExistentRelatedElement',
            expected: axs.constants.AuditResult.FAIL,
            elements: [refererElement]
        };
        assert.runRule(config);
    });

    test('Element doesn\'t exist, single ' + testProp + ' value with aria-busy', function(assert) {
        var fixture = document.getElementById('qunit-fixture');

        var refererElement = document.createElement('div');
        refererElement.setAttribute(testProp, 'notALabel');
        refererElement.setAttribute('aria-busy', 'true');
        fixture.appendChild(refererElement);

        var config = {
            ruleName: 'nonExistentRelatedElement',
            expected: axs.constants.AuditResult.FAIL,
            elements: [refererElement]
        };
        assert.runRule(config);
    });

    test('Element doesn\'t exist, single ' + testProp + ' value with aria-hidden', function(assert) {
        var fixture = document.getElementById('qunit-fixture');

        var refererElement = document.createElement('div');
        refererElement.setAttribute(testProp, 'notALabel');
        refererElement.setAttribute('aria-hidden', 'true');
        fixture.appendChild(refererElement);

        var config = {
            ruleName: 'nonExistentRelatedElement',
            expected: axs.constants.AuditResult.FAIL,
            elements: [refererElement]
        };
        assert.runRule(config);
    });

    test('Multiple referent elements exist with ' + testProp, function(assert) {
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
        refererElement.setAttribute(testProp, 'theLabel theOtherLabel');
        fixture.appendChild(refererElement);

        var config = {
            ruleName: 'nonExistentRelatedElement',
            expected: axs.constants.AuditResult.PASS,
            elements: []
        };
        assert.runRule(config);

    });

    test('One element doesn\'t exist, multiple ' + testProp, function(assert) {
        var fixture = document.getElementById('qunit-fixture');

        var referentElement = document.createElement('div');
        referentElement.textContent = 'label';
        referentElement.id = 'theLabel';
        fixture.appendChild(referentElement);

        var refererElement = document.createElement('div');
        refererElement.setAttribute(testProp, 'theLabel notALabel');
        fixture.appendChild(refererElement);

        var config = {
            ruleName: 'nonExistentRelatedElement',
            expected: axs.constants.AuditResult.FAIL,
            elements: [refererElement]
        };
        assert.runRule(config);
    });

    test('Using ignoreSelectors with ' + testProp, function(assert) {
        var fixture = document.getElementById('qunit-fixture');

        var referentElement = document.createElement('div');
        referentElement.textContent = 'label2';
        referentElement.id = 'theLabel2';
        fixture.appendChild(referentElement);

        var refererElement = document.createElement('div');
        refererElement.id = 'labelledbyElement2';
        refererElement.setAttribute(testProp, 'theLabel2 notALabel2');
        fixture.appendChild(refererElement);

        var config = {
            ruleName: 'nonExistentRelatedElement',
            expected: axs.constants.AuditResult.NA,
            ignoreSelectors: ['#labelledbyElement2']
        };
        assert.runRule(config);
    });
});
