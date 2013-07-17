module("NonExistentAriaLabelledby");

test("Element exists, single aria-labelledby value", function() {
    var fixture = document.getElementById('fixture');
    var labelElement = document.createElement('div');
    labelElement.textContent = 'label';
    labelElement.id = 'theLabel';
    fixture.appendChild(labelElement);

    var labelledByElement = document.createElement('div');
    labelledByElement.setAttribute('aria-labelledby', 'theLabel');
    fixture.appendChild(labelledByElement);

    var rule = axs.AuditRules.getRule('nonExistentAriaLabelledbyElement');
    deepEqual(rule.run([], fixture),
              { elements: [], result: axs.constants.AuditResult.PASS });
});

test("Element doesn't exist, single aria-labelledby value", function() {
    var fixture = document.getElementById('fixture');

    var labelledByElement = document.createElement('div');
    labelledByElement.setAttribute('aria-labelledby', 'notALabel');
    fixture.appendChild(labelledByElement);
    console.log('fixture', fixture);
    var rule = axs.AuditRules.getRule('nonExistentAriaLabelledbyElement');
    var result = rule.run([], fixture);
    equal(result.result, axs.constants.AuditResult.FAIL);
    equal(result.elements.length, 1);
});

test("Multiple label elements exist", function() {
    var fixture = document.getElementById('fixture');
    var labelElement = document.createElement('div');
    labelElement.textContent = 'label';
    labelElement.id = 'theLabel';
    fixture.appendChild(labelElement);

    var labelElement2 = document.createElement('div');
    labelElement2.textContent = 'label2';
    labelElement2.id = 'theOtherLabel';
    fixture.appendChild(labelElement2);

    var labelledByElement = document.createElement('div');
    labelledByElement.setAttribute('aria-labelledby', 'theLabel theOtherLabel');
    fixture.appendChild(labelledByElement);

    var rule = axs.AuditRules.getRule('nonExistentAriaLabelledbyElement');
    deepEqual(rule.run([], fixture),
              { elements: [], result: axs.constants.AuditResult.PASS });

});

test("One element doesn't exist, multiple aria-labelledby value", function() {
    var fixture = document.getElementById('fixture');

    var labelElement = document.createElement('div');
    labelElement.textContent = 'label';
    labelElement.id = 'theLabel';
    fixture.appendChild(labelElement);

    var labelledByElement = document.createElement('div');
    labelledByElement.setAttribute('aria-labelledby', 'theLabel notALabel');
    fixture.appendChild(labelledByElement);
    var rule = axs.AuditRules.getRule('nonExistentAriaLabelledbyElement');
    var result = rule.run([], fixture);
    equal(result.result, axs.constants.AuditResult.FAIL);
    equal(result.elements.length, 1);
});

test("Using ignoreSelectors", function() {
    var fixture = document.getElementById('fixture');

    var labelElement = document.createElement('div');
    labelElement.textContent = 'label2';
    labelElement.id = 'theLabel2';
    fixture.appendChild(labelElement);

    var labelledByElement = document.createElement('div');
    labelledByElement.id = 'labelledbyElement2';
    labelledByElement.setAttribute('aria-labelledby', 'theLabel2 notALabel2');
    fixture.appendChild(labelledByElement);

    var rule = axs.AuditRules.getRule('nonExistentAriaLabelledbyElement');
    var ignoreSelectors = ['#labelledbyElement2'];
    var result = rule.run(ignoreSelectors, fixture);
    equal(result.result, axs.constants.AuditResult.PASS);
});

