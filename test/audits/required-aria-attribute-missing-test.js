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
    module('RequiredAriaAttributeMissing');
    var rule = axs.AuditRules.getRule('requiredAriaAttributeMissing');
    /**
     * Input types that take the role 'spinbutton'.
     *
     * @const
     */
    var SPINBUTTON_TYPES = ['date', 'datetime', 'datetime-local',
                            'month', 'number', 'time', 'week'];

    test('Explicit states required all present', function() {
        var actual,
            fixture = document.getElementById('qunit-fixture'),
            widget = fixture.appendChild(document.createElement('div')),
            expected = { elements: [], result: axs.constants.AuditResult.PASS };
        widget.setAttribute('role', 'slider');
        widget.setAttribute('aria-valuemax', '79');
        widget.setAttribute('aria-valuemin', '10');
        widget.setAttribute('aria-valuenow', '50');
        actual = rule.run({ scope: fixture });
        deepEqual(actual, expected);
    });

    test('Explicit states required but none present', function() {
        var actual,
            fixture = document.getElementById('qunit-fixture'),
            widget = fixture.appendChild(document.createElement('div')),
            expected = {
                elements: [widget],
                result: axs.constants.AuditResult.FAIL };
        widget.setAttribute('role', 'slider');
        actual = rule.run({ scope: fixture });
        deepEqual(actual, expected);
    });

    test('Explicit states required only supported states present', function() {
        var actual,
            fixture = document.getElementById('qunit-fixture'),
            widget = fixture.appendChild(document.createElement('div')),
            expected = {
                elements: [widget],
                result: axs.constants.AuditResult.FAIL };
        widget.setAttribute('role', 'slider');
        widget.setAttribute('aria-orientation', 'horizontal');//supported
        widget.setAttribute('aria-haspopup', 'false');//global
        actual = rule.run({ scope: fixture });
        deepEqual(actual, expected);
    });

    test('Explicit states required, one not present', function() {
        var actual,
            fixture = document.getElementById('qunit-fixture'),
            widget = fixture.appendChild(document.createElement('div')),
            expected = {
                elements: [widget],
                result: axs.constants.AuditResult.FAIL };
        widget.setAttribute('role', 'slider');
        widget.setAttribute('aria-valuemin', '10');
        widget.setAttribute('aria-valuenow', '50');
        actual = rule.run({ scope: fixture });
        deepEqual(actual, expected);
    });

    /*
     * Elements with the role scrollbar have an implicit aria-orientation value
     * of vertical.
     */
    test('Explicit states present, aria implicit state present', function() {
        var actual,
            fixture = document.getElementById('qunit-fixture'),
            widget = fixture.appendChild(document.createElement('div')),
            widget2 = fixture.appendChild(document.createElement('div')),
            expected = { elements: [], result: axs.constants.AuditResult.PASS };
        widget2.id = 'controlledElement';
        widget.setAttribute('role', 'scrollbar');
        widget.setAttribute('aria-valuemax', '79');
        widget.setAttribute('aria-valuemin', '10');
        widget.setAttribute('aria-valuenow', '50');
        widget.setAttribute('aria-orientation', 'horizontal');
        widget.setAttribute('aria-controls', widget2.id);
        actual = rule.run({ scope: fixture });
        deepEqual(actual, expected);
    });

    /*
     * Elements with the role scrollbar have an implicit aria-orientation value
     * of vertical.
     */
    test('Explicit states present, aria implicit state absent', function() {
        var actual,
            fixture = document.getElementById('qunit-fixture'),
            widget = fixture.appendChild(document.createElement('div')),
            widget2 = fixture.appendChild(document.createElement('div')),
            expected = { elements: [], result: axs.constants.AuditResult.PASS };
        widget2.id = 'controlledElement';
        widget.setAttribute('role', 'scrollbar');
        widget.setAttribute('aria-valuemax', '79');
        widget.setAttribute('aria-valuemin', '10');
        widget.setAttribute('aria-valuenow', '50');
        widget.setAttribute('aria-controls', widget2.id);
        actual = rule.run({ scope: fixture });
        deepEqual(actual, expected);
    });

    /*
     * TDD - the tests below won't pass - yet.
     * They should start to pass when we have support for implicit sematics.
     * TODO Port from aria-toolkit.
     */
    if (false) {

    test('Role and states provided implcitly by html', function() {
        var actual,
            fixture = document.getElementById('qunit-fixture'),
            widget = fixture.appendChild(document.createElement('input')),
            expected = { elements: [], result: axs.constants.AuditResult.PASS };
        widget.setAttribute('type', 'range');//role is slider
        actual = rule.run({ scope: fixture });
        deepEqual(actual, expected);
    });

    test('Role provided implcitly by html, redundant states', function() {
        var actual,
            fixture = document.getElementById('qunit-fixture'),
            widget = fixture.appendChild(document.createElement('input')),
            expected = { elements: [], result: axs.constants.AuditResult.PASS };
        widget.setAttribute('type', 'range');//role is slider
        //below props shouldn't be provided explicitly, that's a different test.
        widget.setAttribute('aria-valuemax', '79');
        widget.setAttribute('aria-valuemin', '10');
        widget.setAttribute('aria-valuenow', '50');
        actual = rule.run({ scope: fixture });
        deepEqual(actual, expected);
    });

    test('Required states provided implcitly by html', function() {
        var actual,
            fixture = document.getElementById('qunit-fixture'),
            widget = fixture.appendChild(document.createElement('input')),
            expected = { elements: [], result: axs.constants.AuditResult.PASS };
        widget.setAttribute('type', 'range');
        //setting role is redundant but needs to be ignored by this audit
        widget.setAttribute('role', 'slider');
        actual = rule.run({ scope: fixture });
        deepEqual(actual, expected);
    });

    SPINBUTTON_TYPES.forEach(function(type) {
        test('Required states provided implcitly by input type ' + type, function() {
            var actual,
                fixture = document.getElementById('qunit-fixture'),
                widget = fixture.appendChild(document.createElement('input')),
                expected = {
                    elements: [],
                    result: axs.constants.AuditResult.PASS };
            widget.setAttribute('type', type);
            //setting role is redundant but needs to be ignored by this audit
            widget.setAttribute('role', 'spinbutton');
            actual = rule.run({ scope: fixture });
            deepEqual(actual, expected);
        });
    });
    }
})();
