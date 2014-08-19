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

test('No duplicate IDs', function() {
    var rule = axs.AuditRules.getRule('duplicateId');
    var fixture = document.getElementById('qunit-fixture');

    var element = fixture.appendChild(document.createElement('div'));
    element.setAttribute('id', 'kungfu');

    var element2 = fixture.appendChild(document.createElement('div'));
    element2.setAttribute('id', 'fukung');

    var actual = rule.run({ scope: fixture });
    equal(actual.result, axs.constants.AuditResult.PASS);
    deepEqual(actual.elements, []);
});

test('Single duplicate ID', function() {
    var rule = axs.AuditRules.getRule('duplicateId');
    var fixture = document.getElementById('qunit-fixture');

    var element = fixture.appendChild(document.createElement('div'));
    element.setAttribute('id', 'kungfu');
    var element2 = fixture.appendChild(element.cloneNode());

    var actual = rule.run({ scope: fixture });
    equal(actual.result, axs.constants.AuditResult.FAIL);
    deepEqual(actual.elements, [element, element2]);
});

test('Single duplicate ID but it\'s in shadow DOM', function() {
    // Perhaps this test is overly paranoid...
    var rule = axs.AuditRules.getRule('duplicateId');
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

    var actual = rule.run({ scope: fixture });
    equal(actual.result, axs.constants.AuditResult.PASS);
    deepEqual(actual.elements, []);
});
