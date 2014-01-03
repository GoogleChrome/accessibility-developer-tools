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

goog.provide('axs.testing.matchers');

/**
 * A custom matcher for Jasmine that checks whether the element and all
 * descendants pass a suite of accessibility checks.
 * Example: expect(element).toBeAccessible();
 *
 * @this {*}
 * @return {boolean}
 */

axs.testing.matchers.toBeAccessible = function() {
  if(typeof jasmine !== "undefined" && typeof beforeEach !== "undefined") {
    var config = new axs.AuditConfiguration();
    config.scope = this.actual;

    var audit = axs.Audit.run(config);
    var results = axs.Audit.auditResults(audit);
    var passing = results.numErrors() === 0;

    if (!this.isNot) {
      this.message = results.toString().bind(results);
    }
    return passing;
  }
};
