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
(function() {
    module('AriaOnReservedElement');
    var RULE_NAME = 'ariaOnReservedElement';

    test('Non-reserved element with role and aria- attributes', function(assert) {
        var fixture = document.getElementById('qunit-fixture');
        var widget = fixture.appendChild(document.createElement('div'));
        widget.setAttribute('role', 'spinbutton');
        widget.setAttribute('aria-hidden', 'false');  // global
        widget.setAttribute('aria-required', 'true');  // supported
        widget.setAttribute('aria-valuemax', '79');  // required
        widget.setAttribute('aria-valuemin', '10');  // required
        widget.setAttribute('aria-valuenow', '50');  // required

        var config = {
            ruleName: RULE_NAME,
            expected: axs.constants.AuditResult.NA
        };
        assert.runRule(config, 'Non-reserved elements are not applicable to this test');
    });

    test('Non-reserved element with role only', function(assert) {
        var fixture = document.getElementById('qunit-fixture');
        var widget = fixture.appendChild(document.createElement('div'));
        widget.setAttribute('role', 'spinbutton');

        var config = {
            ruleName: RULE_NAME,
            expected: axs.constants.AuditResult.NA
        };
        assert.runRule(config, 'Non-reserved elements are not applicable to this test');
    });

    test('Non-reserved element with aria-attributes only', function(assert) {
        var fixture = document.getElementById('qunit-fixture');
        var widget = fixture.appendChild(document.createElement('div'));
        widget.setAttribute('aria-hidden', 'false');  // global

        var config = {
            ruleName: RULE_NAME,
            expected: axs.constants.AuditResult.NA
        };
        assert.runRule(config, 'Non-reserved elements are not applicable to this test');
    });

    test('Reserved element with role and aria- attributes', function(assert) {
        var fixture = document.getElementById('qunit-fixture');
        var widget = fixture.appendChild(document.createElement('meta'));
        widget.setAttribute('role', 'spinbutton');
        widget.setAttribute('aria-hidden', 'false');  // global
        widget.setAttribute('aria-required', 'true');  // supported
        widget.setAttribute('aria-valuemax', '79');  // required
        widget.setAttribute('aria-valuemin', '10');  // required
        widget.setAttribute('aria-valuenow', '50');  // required

        var config = {
            ruleName: RULE_NAME,
            expected: axs.constants.AuditResult.FAIL,
            elements: [widget]
        };
        assert.runRule(config, 'Reserved elements can\'t take any ARIA attributes.');
    });

    test('Reserved element with role only', function(assert) {
        var fixture = document.getElementById('qunit-fixture');
        var widget = fixture.appendChild(document.createElement('meta'));
        widget.setAttribute('role', 'spinbutton');

        var config = {
            ruleName: RULE_NAME,
            expected: axs.constants.AuditResult.FAIL,
            elements: [widget]
        };
        assert.runRule(config, 'Reserved elements can\'t take any ARIA attributes.');
    });

    test('Reserved element with aria-attributes only', function(assert) {
        var fixture = document.getElementById('qunit-fixture');
        var widget = fixture.appendChild(document.createElement('meta'));
        widget.setAttribute('aria-hidden', 'false');  // global

        var config = {
            ruleName: RULE_NAME,
            expected: axs.constants.AuditResult.FAIL,
            elements: [widget]
        };
        assert.runRule(config, 'Reserved elements can\'t take any ARIA attributes.');
    });

    test('Using ignoreSelectors, reserved element with aria-attributes only', function(assert) {
        var fixture = document.getElementById('qunit-fixture');
        var widget = fixture.appendChild(document.createElement('meta'));
        widget.setAttribute('aria-hidden', 'false');  // global

        var config = {
            ruleName: RULE_NAME,
            expected: axs.constants.AuditResult.NA,
            ignoreSelectors: ['#' + (widget.id = 'ignoreMe')]
        };
        assert.runRule(config, 'ignoreSelectors should skip this failing element');
    });

    test('Reserved element with no ARIA attributes', function(assert) {
        var fixture = document.getElementById('qunit-fixture');
        fixture.appendChild(document.createElement('meta'));

        var config = {
            ruleName: RULE_NAME,
            expected: axs.constants.AuditResult.PASS,
            elements: []
        };
        assert.runRule(config, 'A reserved element with no ARIA attributes should pass');
    });

})();
