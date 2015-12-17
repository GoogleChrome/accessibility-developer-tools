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
QUnit.extend(QUnit.assert, {
    runRule: function(config, message) {
        var ruleName = config.ruleName;
        var auditConfig = new axs.AuditConfiguration({
            auditRulesToRun: [ruleName],
            scope: config.scope || document.getElementById('qunit-fixture'),
            walkDom: false  // In QUnit tests we never need to walk the entire DOM
        });
        if (config.ignoreSelectors)
            auditConfig.ignoreSelectors(ruleName, config.ignoreSelectors);
        var actual = axs.Audit.run(auditConfig);
        this.equal(actual.length, 1, 'Only one rule should have run');
        var result = actual[0];
        this.equal(result.rule.name, ruleName, 'The correct rule should have run');
        if (message)
            this.equal(result.result, config.expected, message);
        else
            this.equal(result.result, config.expected);
        if (config.elements)
            this.deepEqual(result.elements, config.elements, 'The correct number of elements should be included');
    }
});
