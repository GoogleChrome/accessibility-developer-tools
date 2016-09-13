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

module('LinkWithUnclearPurpose');

test('a link with meaningful text is good', function(assert) {
    var fixture = document.getElementById('qunit-fixture');
    var a = fixture.appendChild(document.createElement('a'));
    a.href = '#main';
    a.textContent = 'Learn more about trout fishing';

    var config = {
        ruleName: 'linkWithUnclearPurpose',
        elements: [],
        expected: axs.constants.AuditResult.PASS
    };
    assert.runRule(config);
});

test('a link with an img with meaningful alt text is good', function(assert) {
    var fixture = document.getElementById('qunit-fixture');
    var a = fixture.appendChild(document.createElement('a'));
    a.href = '#main';
    var img = a.appendChild(document.createElement('img'));
    img.setAttribute('alt', 'Learn more about trout fishing');

    var config = {
        ruleName: 'linkWithUnclearPurpose',
        elements: [],
        expected: axs.constants.AuditResult.PASS
    };
    assert.runRule(config);
});

test('a link with an img with meaningless alt text is bad', function(assert) {
    var fixture = document.getElementById('qunit-fixture');
    var a = fixture.appendChild(document.createElement('a'));
    a.href = '#main';
    var img = a.appendChild(document.createElement('img'));
    img.setAttribute('alt', 'Click here!');

    var config = {
        ruleName: 'linkWithUnclearPurpose',
        elements: [a],
        expected: axs.constants.AuditResult.FAIL
    };
    assert.runRule(config);
});

/*
 * This test will need to be reviewed when issue #214 is addressed.
 */
test('a link with meaningful aria-label is good', function(assert) {
    var fixture = document.getElementById('qunit-fixture');
    // Style our link to be visually meaningful with no descendent nodes at all.
    fixture.innerHTML = '<style>a.trout::after{content: "Learn more about trout fishing"}</style>';
    var a = fixture.appendChild(document.createElement('a'));
    a.href = '#main';
    a.className = 'trout';
    a.setAttribute('aria-label', 'Learn more about trout fishing');

    var config = {
        ruleName: 'linkWithUnclearPurpose',
        elements: [],
        expected: axs.constants.AuditResult.PASS
    };
    assert.runRule(config);
});

/*
 * This test will need to be reviewed when issue #214 is addressed.
 */
test('a link with meaningful aria-labelledby is good', function(assert) {
    var fixture = document.getElementById('qunit-fixture');
    // Style our link to be visually meaningful with no descendent nodes at all.
    fixture.innerHTML = '<style>a.trout::after{content: "Learn more about trout fishing"}</style>';
    var a = fixture.appendChild(document.createElement('a'));
    a.href = '#main';
    a.className = 'trout';
    var label = fixture.appendChild(document.createElement('span'));
    label.textContent = 'Learn more about trout fishing';
    label.id = "trout" + Date.now();
    a.setAttribute('aria-labelledby', label.id);

    var config = {
        ruleName: 'linkWithUnclearPurpose',
        elements: [],
        expected: axs.constants.AuditResult.PASS
    };
    assert.runRule(config);
});

test('a link without meaningful text is bad', function(assert) {
    var fixture = document.getElementById('qunit-fixture');
    var a = fixture.appendChild(document.createElement('a'));
    a.href = '#main';

    var config = {
        ruleName: 'linkWithUnclearPurpose',
        elements: [a],
        expected: axs.constants.AuditResult.FAIL
    };

    var badLinks = ['click here.', 'Click here!', 'Learn more.', 'this page', 'this link', 'here'];
    badLinks.forEach(function(text) {
        a.textContent = text;
        assert.runRule(config);
    });
});

test('a link with bg image and meaningful aria-label is good', function(assert) {
    var fixture = document.getElementById('qunit-fixture');
    // Style our link to be visually meaningful with no descendent nodes at all.
    fixture.innerHTML = '<style>a.trout{background-image: url("/trout.png"); display:block; height:1em}</style>';
    var a = fixture.appendChild(document.createElement('a'));
    a.href = '#main';
    a.className = 'trout';
    a.setAttribute('aria-label', 'Learn more about trout fishing');

    var config = {
        ruleName: 'linkWithUnclearPurpose',
        elements: [],
        expected: axs.constants.AuditResult.PASS
    };
    assert.runRule(config);
});

test('a hidden link should not be run against the audit', function(assert) {
    var fixture = document.getElementById('qunit-fixture');
    var a = fixture.appendChild(document.createElement('a'));
    a.hidden = true;
    a.href = '#main';
    a.textContent = 'Learn more about trout fishing';

    var config = {
        ruleName: 'linkWithUnclearPurpose',
        expected: axs.constants.AuditResult.NA
    };
    assert.runRule(config);
});

test('an anchor tag without href attribute is ignored', function(assert) {
    var fixture = document.getElementById('qunit-fixture');
    fixture.appendChild(document.createElement('a'));

    var config = {
        ruleName: 'linkWithUnclearPurpose',
        expected: axs.constants.AuditResult.NA
    };
    assert.runRule(config);
});
