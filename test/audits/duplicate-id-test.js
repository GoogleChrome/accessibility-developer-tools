// Copyright 2014 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
module('DuplicateId');

test('No duplicate ID, no used IDREF', function(assert) {
    var fixture = document.getElementById('qunit-fixture');

    var element = fixture.appendChild(document.createElement('div'));
    element.setAttribute('id', 'kungfu');

    var element2 = fixture.appendChild(document.createElement('div'));
    element2.setAttribute('id', 'fukung');

    var config = {
        scope: fixture,
        ruleName: 'duplicateId',
        expected: axs.constants.AuditResult.NA
    };
    assert.runRule(config);
});

test('No duplicate ID with IDREF', function(assert) {
    var fixture = document.getElementById('qunit-fixture');

    var element = fixture.appendChild(document.createElement('input'));
    element.setAttribute('id', 'kungfu');
    var element2 = fixture.appendChild(element.cloneNode());
    element2.setAttribute('id', 'kungfutoo');
    fixture.appendChild(document.createElement('label')).setAttribute('for', element.id);
    fixture.appendChild(document.createElement('label')).setAttribute('for', element2.id);

    var config = {
        scope: fixture,
        ruleName: 'duplicateId',
        expected: axs.constants.AuditResult.PASS,
        elements: []
    };
    assert.runRule(config);
});

test('Single duplicate ID, not used', function(assert) {
    var fixture = document.getElementById('qunit-fixture');

    var element = fixture.appendChild(document.createElement('div'));
    element.setAttribute('id', 'kungfu');
    fixture.appendChild(element.cloneNode());

    var config = {
        scope: fixture,
        ruleName: 'duplicateId',
        expected: axs.constants.AuditResult.NA
    };
    assert.runRule(config);
});

test('Single unused duplicate ID but it\'s in shadow DOM', function(assert) {
    // Perhaps this test is overly paranoid...
    var fixture = document.getElementById('qunit-fixture');
    if (!fixture.createShadowRoot) {
        expect(0);  // even Chrome (36 on Mac) seems to end up here...
        return false;
    }

    var element = fixture.appendChild(document.createElement('div'));
    element.setAttribute('id', 'kungfu');

    var element2 = fixture.appendChild(document.createElement('div'));
    var shadowRoot = element2.createShadowRoot();
    shadowRoot.appendChild(element.cloneNode());

    var config = {
        scope: fixture,
        ruleName: 'duplicateId',
        expected: axs.constants.AuditResult.NA
    };
    assert.runRule(config);
});

test('Single used duplicate ID but it\'s in shadow DOM', function(assert) {
    var fixture = document.getElementById('qunit-fixture');
    if (!fixture.createShadowRoot) {
        expect(0);  // even Chrome (36 on Mac) seems to end up here...
        return false;
    }

    var element = fixture.appendChild(document.createElement('div'));
    element.setAttribute('id', 'kungfu');
    var referrer = document.createElement('span');
    referrer.setAttribute('aria-labelledby', element.id);
    fixture.appendChild(referrer);

    var element2 = fixture.appendChild(document.createElement('div'));
    var shadowRoot = element2.createShadowRoot();
    shadowRoot.appendChild(element.cloneNode());

    var config = {
        scope: fixture,
        ruleName: 'duplicateId',
        expected: axs.constants.AuditResult.PASS,
        elements: []
    };

    assert.runRule(config);
});

test('Single duplicate ID, used in html idref', function(assert) {
    var fixture = document.getElementById('qunit-fixture');

    var element = fixture.appendChild(document.createElement('input'));
    element.setAttribute('id', 'kungfu');
    var element2 = fixture.appendChild(element.cloneNode());
    var referrer = fixture.appendChild(document.createElement('label'));
    referrer.setAttribute('for', element.id);

    var config = {
        scope: fixture,
        ruleName: 'duplicateId',
        expected: axs.constants.AuditResult.FAIL,
        elements: [element, element2]
    };

    assert.runRule(config);

    config = {
        scope: fixture,
        ruleName: 'duplicateId',
        expected: axs.constants.AuditResult.NA
    };

    referrer.setAttribute('aria-hidden', 'true');
    assert.runRule(config, 'aria-hidden elements should be ignored');

    referrer.removeAttribute('aria-hidden');

    referrer.setAttribute('hidden', 'hidden');
    assert.runRule(config, 'hidden elements should be ignored');
});

test('Single duplicate ID, used in html idrefs', function(assert) {
    var fixture = document.getElementById('qunit-fixture');

    var element = fixture.appendChild(document.createElement('input'));
    element.setAttribute('id', 'kungfu');
    var element2 = fixture.appendChild(element.cloneNode());
    var element3 = fixture.appendChild(document.createElement('input'));
    element3.setAttribute('id', 'el3');
    var idrefs = element3.id + ' ' + element.id;
    var referrer = fixture.appendChild(document.createElement('output'));
    referrer.setAttribute('for', idrefs);

    var config = {
        scope: fixture,
        ruleName: 'duplicateId',
        expected: axs.constants.AuditResult.FAIL,
        elements: [element, element2]
    };

    assert.runRule(config);

    config = {
        scope: fixture,
        ruleName: 'duplicateId',
        expected: axs.constants.AuditResult.NA
    };

    referrer.setAttribute('aria-hidden', 'true');
    assert.runRule(config, 'aria-hidden elements should be ignored');

    referrer.removeAttribute('aria-hidden');

    referrer.setAttribute('hidden', 'hidden');
    assert.runRule(config, 'hidden elements should be ignored');
});

test('Single duplicate ID, used in ARIA idref', function(assert) {
    var fixture = document.getElementById('qunit-fixture');
    var container = fixture.appendChild(document.createElement('div'));
    var element = container.appendChild(document.createElement('span'));
    element.setAttribute('id', 'kungfu');
    var element2 = container.appendChild(element.cloneNode());
    container.setAttribute('aria-activedescendant', element.id);

    var config = {
        scope: fixture,
        ruleName: 'duplicateId',
        expected: axs.constants.AuditResult.FAIL,
        elements: [element, element2]
    };

    assert.runRule(config);

    config = {
        scope: fixture,
        ruleName: 'duplicateId',
        expected: axs.constants.AuditResult.NA
    };

    container.setAttribute('aria-hidden', 'true');
    assert.runRule(config, 'aria-hidden elements should be ignored');

    container.removeAttribute('aria-hidden');

    container.setAttribute('hidden', 'hidden');
    assert.runRule(config, 'hidden elements should be ignored');
});

test('Single duplicate ID, used in ARIA idrefs', function(assert) {
    var fixture = document.getElementById('qunit-fixture');
    var container = fixture.appendChild(document.createElement('div'));
    var element = fixture.appendChild(document.createElement('span'));
    element.setAttribute('id', 'kungfu');
    var element2 = fixture.appendChild(element.cloneNode());
    var element3 = fixture.appendChild(document.createElement('input'));
    element3.setAttribute('id', 'el3');
    var idrefs = element3.id + ' ' + element.id;
    container.setAttribute('aria-owns', idrefs);

    var config = {
        scope: fixture,
        ruleName: 'duplicateId',
        expected: axs.constants.AuditResult.FAIL,
        elements: [element, element2]
    };

    assert.runRule(config);

    config = {
        scope: fixture,
        ruleName: 'duplicateId',
        expected: axs.constants.AuditResult.NA
    };

    container.setAttribute('aria-hidden', 'true');
    assert.runRule(config, 'aria-hidden elements should be ignored');

    container.removeAttribute('aria-hidden');

    container.setAttribute('hidden', 'hidden');
    assert.runRule(config, 'hidden elements should be ignored');
});
