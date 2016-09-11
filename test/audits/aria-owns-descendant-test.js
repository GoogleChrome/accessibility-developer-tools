(function() {  // scope to avoid leaking helpers and variables to global namespace
    module('AriaOwnsDescendant');

    var RULE_NAME = 'ariaOwnsDescendant';

    test('Element owns a sibling', function(assert) {
        var fixture = document.getElementById('qunit-fixture');
        var owned = fixture.appendChild(document.createElement('div'));
        owned.id = 'ownedElement';
        var owner = fixture.appendChild(document.createElement('div'));
        owner.setAttribute('aria-owns', owned.id);

        var config = {
            ruleName: RULE_NAME,
            expected: axs.constants.AuditResult.PASS,
            elements: []
        };
        assert.runRule(config);
    });

    test('Element owns multiple siblings', function(assert) {
        var fixture = document.getElementById('qunit-fixture');
        var owned = fixture.appendChild(document.createElement('div'));
        owned.id = 'ownedElement';
        var owned2 = fixture.appendChild(document.createElement('div'));
        owned2.id = 'ownedElement2';
        var owner = fixture.appendChild(document.createElement('div'));
        owner.setAttribute('aria-owns', owned.id + ' ' + owned2.id);

        var config = {
            ruleName: RULE_NAME,
            expected: axs.constants.AuditResult.PASS,
            elements: []
        };
        assert.runRule(config);
    });

    test('Element owns a descendant', function(assert) {
        var fixture = document.getElementById('qunit-fixture');
        var owner = fixture.appendChild(document.createElement('div'));
        var owned = owner.appendChild(document.createElement('div'));
        for (var i = 0; i < 9; i++)  // ensure it works on descendants, not just children
            owned = owned.appendChild(document.createElement('div'));
        owned.id = 'ownedElement';
        owner.setAttribute('aria-owns', owned.id);

        var config = {
            ruleName: RULE_NAME,
            expected: axs.constants.AuditResult.FAIL,
            elements: [owner]
        };
        assert.runRule(config);
    });

    test('Element owns multiple descendants', function(assert) {
        var fixture = document.getElementById('qunit-fixture');
        var owner = fixture.appendChild(document.createElement('div'));
        var owned = owner.appendChild(document.createElement('div'));
        for (var i = 0; i < 9; i++)  // ensure it works on descendants, not just children
            owned = owned.appendChild(document.createElement('div'));
        owned.id = 'ownedElement';
        var owned2 = owner.appendChild(document.createElement('div'));
        owned2.id = 'ownedElement2';
        owner.setAttribute('aria-owns', owned.id + ' ' + owned2.id);

        var config = {
            ruleName: RULE_NAME,
            expected: axs.constants.AuditResult.FAIL,
            elements: [owner]
        };
        assert.runRule(config);
    });

    test('Element owns one sibling one descendant', function(assert) {
        var fixture = document.getElementById('qunit-fixture');
        var owner = fixture.appendChild(document.createElement('div'));
        var owned = owner.appendChild(document.createElement('div'));
        for (var i = 0; i < 9; i++)  // ensure it works on descendants, not just children
            owned = owned.appendChild(document.createElement('div'));
        owned.id = 'ownedElement';
        var owned2 = fixture.appendChild(document.createElement('div'));
        owned2.id = 'ownedElement2';
        owner.setAttribute('aria-owns', owned.id + ' ' + owned2.id);

        var config = {
            ruleName: RULE_NAME,
            expected: axs.constants.AuditResult.FAIL,
            elements: [owner]
        };
        assert.runRule(config);
    });

    test('Using ignoreSelectors - element owns a descendant', function(assert) {
        var fixture = document.getElementById('qunit-fixture');
        var owner = fixture.appendChild(document.createElement('div'));
        var owned = owner.appendChild(document.createElement('div'));
        for (var i = 0; i < 9; i++)  // ensure it works on descendants, not just children
            owned = owned.appendChild(document.createElement('div'));
        owned.id = 'ownedElement';
        owner.setAttribute('aria-owns', owned.id);

        var config = {
            ruleName: RULE_NAME,
            expected: axs.constants.AuditResult.NA,
            ignoreSelectors: ['#' + (owner.id = 'ownerElement')]
        };
        assert.runRule(config, 'ignoreSelectors should skip this failing element');
    });
})();
