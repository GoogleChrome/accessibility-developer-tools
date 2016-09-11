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
    var RULE_NAME = 'requiredAriaAttributeMissing';
    /**
     * Input types that take the role 'spinbutton'.
     *
     * @const
     */
    var SPINBUTTON_TYPES = ['date', 'datetime', 'datetime-local',
                            'month', 'number', 'time', 'week'];

    test('Explicit states required all present', function(assert) {
        var fixture = document.getElementById('qunit-fixture');
        var widget = fixture.appendChild(document.createElement('div'));
        widget.setAttribute('role', 'slider');
        widget.setAttribute('aria-valuemax', '79');
        widget.setAttribute('aria-valuemin', '10');
        widget.setAttribute('aria-valuenow', '50');

        var config = {
            ruleName: RULE_NAME,
            expected: axs.constants.AuditResult.PASS,
            elements: []
        };
        assert.runRule(config);
    });

    test('Explicit states required but none present', function(assert) {
        var fixture = document.getElementById('qunit-fixture');
        var widget = fixture.appendChild(document.createElement('div'));
        widget.setAttribute('role', 'slider');

        var config = {
            ruleName: RULE_NAME,
            expected: axs.constants.AuditResult.FAIL,
            elements: [widget]
        };
        assert.runRule(config);
    });

    test('Explicit states required only supported states present', function(assert) {
        var fixture = document.getElementById('qunit-fixture');
        var widget = fixture.appendChild(document.createElement('div'));
        widget.setAttribute('role', 'slider');
        widget.setAttribute('aria-orientation', 'horizontal');  // supported
        widget.setAttribute('aria-haspopup', 'false');  // global

        var config = {
            ruleName: RULE_NAME,
            expected: axs.constants.AuditResult.FAIL,
            elements: [widget]
        };
        assert.runRule(config);
    });

    test('Explicit states required, one not present', function(assert) {
        var fixture = document.getElementById('qunit-fixture');
        var widget = fixture.appendChild(document.createElement('div'));
        widget.setAttribute('role', 'slider');
        widget.setAttribute('aria-valuemin', '10');
        widget.setAttribute('aria-valuenow', '50');

        var config = {
            ruleName: RULE_NAME,
            expected: axs.constants.AuditResult.FAIL,
            elements: [widget]
        };
        assert.runRule(config);
    });

    /*
     * Elements with the role scrollbar have an implicit aria-orientation value
     * of vertical.
     */
    test('Explicit states present, aria implicit state present', function(assert) {
        var fixture = document.getElementById('qunit-fixture');
        var widget = fixture.appendChild(document.createElement('div'));
        var widget2 = fixture.appendChild(document.createElement('div'));
        widget2.id = 'controlledElement';
        widget.setAttribute('role', 'scrollbar');
        widget.setAttribute('aria-valuemax', '79');
        widget.setAttribute('aria-valuemin', '10');
        widget.setAttribute('aria-valuenow', '50');
        widget.setAttribute('aria-orientation', 'horizontal');
        widget.setAttribute('aria-controls', widget2.id);

        var config = {
            ruleName: RULE_NAME,
            expected: axs.constants.AuditResult.PASS,
            elements: []
        };
        assert.runRule(config);
    });

    /*
     * Elements with the role scrollbar have an implicit aria-orientation value
     * of vertical.
     */
    test('Explicit states present, aria implicit state absent', function(assert) {
        var fixture = document.getElementById('qunit-fixture');
        var widget = fixture.appendChild(document.createElement('div'));
        var widget2 = fixture.appendChild(document.createElement('div'));
        widget2.id = 'controlledElement';
        widget.setAttribute('role', 'scrollbar');
        widget.setAttribute('aria-valuemax', '79');
        widget.setAttribute('aria-valuemin', '10');
        widget.setAttribute('aria-valuenow', '50');
        widget.setAttribute('aria-controls', widget2.id);

        var config = {
            ruleName: RULE_NAME,
            expected: axs.constants.AuditResult.PASS,
            elements: []
        };
        assert.runRule(config);
    });

    test('Required states provided implcitly by html', function(assert) {
        var fixture = document.getElementById('qunit-fixture');
        var widget = fixture.appendChild(document.createElement('input'));
        widget.setAttribute('type', 'range');
        // setting role is redundant but needs to be ignored by this audit
        widget.setAttribute('role', 'slider');

        var config = {
            ruleName: RULE_NAME,
            expected: axs.constants.AuditResult.PASS,
            elements: []
        };
        assert.runRule(config);
    });

    SPINBUTTON_TYPES.forEach(function(type) {
        test('Required states provided implcitly by input type ' + type, function(assert) {
            var fixture = document.getElementById('qunit-fixture');
            var widget = fixture.appendChild(document.createElement('input'));
            widget.setAttribute('type', type);
            // setting role is redundant but needs to be ignored by this audit
            widget.setAttribute('role', 'spinbutton');

            var config = {
                ruleName: RULE_NAME,
                expected: axs.constants.AuditResult.PASS,
                elements: []
            };
            assert.runRule(config);
        });
    });

})();
