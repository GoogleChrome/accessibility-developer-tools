// Copyright 2013 Google Inc.
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

module('MainRoleOnInappropriateElement');

test('No role=main -> no relevant elements', function(assert) {
  var fixture = document.getElementById('qunit-fixture');
  var div = document.createElement('div');
  fixture.appendChild(div);

    var config = {
        ruleName: 'mainRoleOnInappropriateElement',
        expected: axs.constants.AuditResult.NA
    };
    assert.runRule(config);
});

test('role=main on empty element === fail', function(assert) {
  var fixture = document.getElementById('qunit-fixture');
  var div = document.createElement('div');
  div.setAttribute('role', 'main');
  fixture.appendChild(div);

    var config = {
        ruleName: 'mainRoleOnInappropriateElement',
        expected: axs.constants.AuditResult.FAIL,
        elements: [div]
    };
    assert.runRule(config);
});

test('role=main on element with textContent < 50 characters === pass', function(assert) {
  var fixture = document.getElementById('qunit-fixture');
  var div = document.createElement('div');
  div.setAttribute('role', 'main');
  div.textContent = 'Lorem ipsum dolor sit amet.';
  fixture.appendChild(div);

    var config = {
        ruleName: 'mainRoleOnInappropriateElement',
        expected: axs.constants.AuditResult.FAIL,
        elements: [div]
    };
    assert.runRule(config);
});

test('role=main on element with textContent >= 50 characters === pass', function(assert) {
  var fixture = document.getElementById('qunit-fixture');
  var div = document.createElement('div');
  div.setAttribute('role', 'main');
  div.textContent = 'Lorem ipsum dolor sit amet, consectetur cras amet.';
  fixture.appendChild(div);

    var config = {
        ruleName: 'mainRoleOnInappropriateElement',
        expected: axs.constants.AuditResult.PASS,
        elements: []
    };
    assert.runRule(config);
});

test('role=main on inline element === fail', function(assert) {
  var fixture = document.getElementById('qunit-fixture');
  var span = document.createElement('span');
  span.setAttribute('role', 'main');
  span.textContent = 'Lorem ipsum dolor sit amet, consectetur cras amet.';
  fixture.appendChild(span);

    var config = {
        ruleName: 'mainRoleOnInappropriateElement',
        expected: axs.constants.AuditResult.FAIL,
        elements: [span]
    };
    assert.runRule(config);
});
