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
module('RequiredOwnedAriaRoleMissing');

test('Explicit role on container and required elements all explicitly present', function(assert) {
    var fixture = document.getElementById('qunit-fixture');
    var container = fixture.appendChild(document.createElement('div'));
    container.setAttribute('role', 'list');
    for (var i = 0; i < 4; i++) {
        var item = container.appendChild(document.createElement('span'));
        item.setAttribute('role', 'listitem');
    }

    var config = {
        ruleName: 'requiredOwnedAriaRoleMissing',
        expected: axs.constants.AuditResult.PASS,
        elements: []
    };
    assert.runRule(config);
});

test('Explicit role on container and required elements all explicitly present via aria-owns', function(assert) {
    var fixture = document.getElementById('qunit-fixture');
    var container = fixture.appendChild(document.createElement('div'));
    var siblingContainer = fixture.appendChild(document.createElement('div'));
    var ids = [];
    container.setAttribute('role', 'list');
    for (var i = 0; i < 4; i++) {
        var id = ids[i] = 'item' + i;
        var item = siblingContainer.appendChild(document.createElement('span'));
        item.setAttribute('role', 'listitem');
        item.setAttribute('id', id);
    }
    container.setAttribute('aria-owns', ids.join(' '));

    equal(container.childNodes.length, 0);  // paranoid check to ensure the test itself is correct
    var config = {
        ruleName: 'requiredOwnedAriaRoleMissing',
        expected: axs.constants.AuditResult.PASS,
        elements: []
    };
    assert.runRule(config);
});

test('Explicit role on container and required elements missing', function(assert) {
    var fixture = document.getElementById('qunit-fixture');
    var container = fixture.appendChild(document.createElement('div'));
    container.setAttribute('role', 'list');

    var config = {
        ruleName: 'requiredOwnedAriaRoleMissing',
        expected: axs.constants.AuditResult.FAIL,
        elements: [container]
    };
    assert.runRule(config);
});

test('Explicit role on aria-busy container and required elements missing', function(assert) {
    var fixture = document.getElementById('qunit-fixture');
    var container = fixture.appendChild(document.createElement('div'));
    container.setAttribute('role', 'list');
    container.setAttribute('aria-busy', 'true');

    var config = {
        ruleName: 'requiredOwnedAriaRoleMissing',
        expected: axs.constants.AuditResult.PASS,
        elements: []
    };
    assert.runRule(config);
});


test('Explicit role on container and required elements all implicitly present', function(assert) {
    var fixture = document.getElementById('qunit-fixture');
    var container = fixture.appendChild(document.createElement('ul'));
    container.setAttribute('role', 'list');  // This is bad practice (redundant role) but that's a different test
    for (var i = 0; i < 4; i++) {
        container.appendChild(document.createElement('li'));
    }

    var config = {
        ruleName: 'requiredOwnedAriaRoleMissing',
        expected: axs.constants.AuditResult.PASS,
        elements: []
    };
    assert.runRule(config);
});

test('No role', function(assert) {
    var fixture = document.getElementById('qunit-fixture');
    fixture.appendChild(document.createElement('div'));

    var config = {
        ruleName: 'requiredOwnedAriaRoleMissing',
        expected: axs.constants.AuditResult.NA
    };
    assert.runRule(config);
});

test('Role with no required elements', function(assert) {
    var fixture = document.getElementById('qunit-fixture');
    var container = fixture.appendChild(document.createElement('div'));
    container.setAttribute('role', 'checkbox');

    var config = {
        ruleName: 'requiredOwnedAriaRoleMissing',
        expected: axs.constants.AuditResult.NA
    };
    assert.runRule(config);
});
