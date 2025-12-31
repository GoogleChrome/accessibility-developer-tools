// Copyright 2015 Google Inc.
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

(function() {
    module('ImageWithoutAltText');
    var RULE_NAME = 'imagesWithoutAltText';

    test('Image with no text alternative', function(assert) {
        var fixture = document.getElementById('qunit-fixture');
        var img = fixture.appendChild(document.createElement('img'));
        img.src = 'smile.jpg';

        var config = {
            ruleName: RULE_NAME,
            elements: [img],
            expected: axs.constants.AuditResult.FAIL
        };
        assert.runRule(config, 'Image has no text alternative');
    });

    test('Image with no text alternative and presentational role', function(assert) {
        var fixture = document.getElementById('qunit-fixture');
        var img = fixture.appendChild(document.createElement('img'));
        img.src = 'smile.jpg';
        img.setAttribute('role', 'presentation');

        var config = {
            ruleName: RULE_NAME,
            elements: [],
            expected: axs.constants.AuditResult.PASS
        };
        assert.runRule(config, 'Image has presentational role');
    });

    test('Image with alt text', function(assert) {
        var fixture = document.getElementById('qunit-fixture');
        var img = fixture.appendChild(document.createElement('img'));
        img.src = 'smile.jpg';
        img.alt = 'Smile!';

        var config = {
            ruleName: RULE_NAME,
            elements: [],
            expected: axs.constants.AuditResult.PASS
        };
        assert.runRule(config, 'Image has alt text');
    });

    test('Image with empty alt text', function(assert) {
        var fixture = document.getElementById('qunit-fixture');
        var img = fixture.appendChild(document.createElement('img'));
        img.src = 'smile.jpg';
        img.alt = '';

        var config = {
            ruleName: RULE_NAME,
            elements: [],
            expected: axs.constants.AuditResult.PASS
        };
        assert.runRule(config, 'Image has empty alt text');
    });

    test('Image with aria label', function(assert) {
        var fixture = document.getElementById('qunit-fixture');
        var img = fixture.appendChild(document.createElement('img'));
        img.src = 'smile.jpg';
        img.setAttribute('aria-label', 'Smile!');

        var config = {
            ruleName: RULE_NAME,
            elements: [],
            expected: axs.constants.AuditResult.PASS
        };
        assert.runRule(config, 'Image has aria label');
    });

    test('Image with aria labelledby', function(assert) {
        var fixture = document.getElementById('qunit-fixture');
        var img = fixture.appendChild(document.createElement('img'));
        img.src = 'smile.jpg';
        var label = fixture.appendChild(document.createElement('div'));
        label.textContent = 'Smile!';
        label.id = 'label';
        img.setAttribute('aria-labelledby', 'label');

        var config = {
            ruleName: RULE_NAME,
            elements: [],
            expected: axs.constants.AuditResult.PASS
        };
        assert.runRule(config, 'Image has aria labelledby');
    });

    test('Image with title', function(assert) {
        var fixture = document.getElementById('qunit-fixture');
        var img = fixture.appendChild(document.createElement('img'));
        img.src = 'smile.jpg';
        img.setAttribute('title', 'Smile!');

        var config = {
            ruleName: RULE_NAME,
            elements: [],
            expected: axs.constants.AuditResult.PASS
        };
        assert.runRule(config, 'Image has title');
    });
})();
