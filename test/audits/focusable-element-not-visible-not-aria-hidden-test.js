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

module('FocusableElementNotVisibleAndNotAriaHidden');
test('a focusable element that is visible passes the audit', function() {
  var fixture = document.getElementById('qunit-fixture');
  var input = document.createElement('input');

  fixture.style.top = '0';
  fixture.style.left = '0';
  fixture.appendChild(input);

  var rule = axs.AuditRules.getRule('focusableElementNotVisibleAndNotAriaHidden');
  deepEqual(
    rule.run({scope: fixture}),
    { elements: [], result: axs.constants.AuditResult.PASS }
  );
});

test('a focusable element that is hidden fails the audit', function() {
  var fixture = document.getElementById('qunit-fixture');
  var input = document.createElement('input');
  input.style.opacity = '0';

  fixture.style.top = '0';
  fixture.style.left = '0';
  fixture.appendChild(input);

  var rule = axs.AuditRules.getRule('focusableElementNotVisibleAndNotAriaHidden');
  deepEqual(
    rule.run({scope: fixture}),
    { elements: [input], result: axs.constants.AuditResult.FAIL }
  );
});

test('a focusable element that is hidden but shown on focus passes the audit', function() {
  var fixture = document.getElementById('qunit-fixture');
  var style = document.createElement('style');
  var skipLink = document.createElement('a');

  skipLink.href = '#main';
  skipLink.id = 'skip';
  skipLink.textContent = 'Skip to content';

  fixture.style.top = '0';
  fixture.style.left = '0';

  style.appendChild(document.createTextNode("a#skip { position:fixed; top: -1000px; left: -1000px }" +
                                            "a#skip:focus, a#skip:active { top: 10px; left: 10px }"));
  fixture.appendChild(style);
  fixture.appendChild(skipLink);

  var rule = axs.AuditRules.getRule('focusableElementNotVisibleAndNotAriaHidden');
  deepEqual(
    rule.run({scope: fixture}),
    { elements: [], result: axs.constants.AuditResult.PASS });
});
