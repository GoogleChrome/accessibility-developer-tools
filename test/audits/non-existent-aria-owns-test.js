module("NonExistentAriaOwns");

test("Element exists, single aria-owns value", function() {
    var fixture = document.getElementById('qunit-fixture');
    var ownedElement = document.createElement('div');
    ownedElement.id = 'theOwned';
    fixture.appendChild(ownedElement);

    var ownerElement = document.createElement('div');
    ownerElement.setAttribute('aria-owns', 'theOwned');
    fixture.appendChild(ownerElement);

    var rule = axs.AuditRules.getRule('nonExistentAriaRelatedElement');
    deepEqual(rule.run({ scope: fixture }),
              { elements: [], result: axs.constants.AuditResult.PASS });
});

test("Element doesn't exist, single aria-owns value", function() {
    var fixture = document.getElementById('qunit-fixture');
    var ownerElement = document.createElement('div');
    ownerElement.setAttribute('aria-owns', 'notPresentInDom');
    fixture.appendChild(ownerElement);

    var rule = axs.AuditRules.getRule('nonExistentAriaRelatedElement');
    var result = rule.run({ scope: fixture });
    equal(result.result, axs.constants.AuditResult.FAIL);
    equal(result.elements.length, 1);
});

test("Multiple owned elements exist", function() {
    var fixture = document.getElementById('qunit-fixture');
    var ownedElement = document.createElement('div');
    ownedElement.id = 'theOwnedElement';
    fixture.appendChild(ownedElement);

    var ownedElement2 = document.createElement('div');
    ownedElement2.id = 'theOtherOwnedElement';
    fixture.appendChild(ownedElement2);

    var ownerElement = document.createElement('div');
    ownerElement.setAttribute('aria-owns', 'theOwnedElement theOtherOwnedElement');
    fixture.appendChild(ownerElement);

    var rule = axs.AuditRules.getRule('nonExistentAriaRelatedElement');
    deepEqual(rule.run({ scope: fixture }),
              { elements: [], result: axs.constants.AuditResult.PASS });

});

test("One element doesn't exist, multiple aria-owns value", function() {
    var fixture = document.getElementById('qunit-fixture');

    var ownedElement = document.createElement('div');
    ownedElement.id = 'theOwned';
    fixture.appendChild(ownedElement);

    var ownsElement = document.createElement('div');
    ownsElement.setAttribute('aria-owns', 'theOwned notPresentInDom');
    fixture.appendChild(ownsElement);

    var rule = axs.AuditRules.getRule('nonExistentAriaRelatedElement');
    var result = rule.run({ scope: fixture });
    equal(result.result, axs.constants.AuditResult.FAIL);
    equal(result.elements.length, 1);
});

test("Using ignoreSelectors", function() {
    var fixture = document.getElementById('qunit-fixture');

    var ownedElement = document.createElement('div');
    ownedElement.id = 'theOwned2';
    fixture.appendChild(ownedElement);

    var ownerElement = document.createElement('div');
    ownerElement.id = 'ownerElement2';
    ownerElement.setAttribute('aria-owns', 'theOwned2 notPresentInDom');
    fixture.appendChild(ownerElement);

    var rule = axs.AuditRules.getRule('nonExistentAriaRelatedElement');
    var ignoreSelectors = ['#ownerElement2'];
    var result = rule.run({ ignoreSelectors: ignoreSelectors, scope: fixture });
    equal(result.result, axs.constants.AuditResult.PASS);
});

