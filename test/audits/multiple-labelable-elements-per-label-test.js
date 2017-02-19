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

module("multipleLabelableElementsPerLabel");

test("one labelable element within a label tag", function(assert) {
  var fixture = document.getElementById("qunit-fixture");
  var label = document.createElement("label");
  var input = document.createElement("input");

  fixture.appendChild(label);
  label.appendChild(input);

  var config = {
    ruleName: "multipleLabelableElementsPerLabel",
    expected: axs.constants.AuditResult.PASS,
    elements: []
  };
  assert.runRule(config, "passes the audit with no matching elements");
});

test("multiple labelable elements within a label tag", function(assert) {
  var fixture = document.getElementById("qunit-fixture");
  var label = document.createElement("label");
  var input1 = document.createElement("input");
  var input2 = document.createElement("input");

  fixture.appendChild(label);
  label.appendChild(input1);
  label.appendChild(input2);

  var config = {
    ruleName: "multipleLabelableElementsPerLabel",
    expected: axs.constants.AuditResult.FAIL,
    elements: [label]
  };
  assert.runRule(config, "fails the audit on that label");
});
