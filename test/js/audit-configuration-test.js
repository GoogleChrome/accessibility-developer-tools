module("AuditConfiguration", {
  setup: function() {
    this.auditRules_ = [];
    for (var auditRuleName in axs.AuditRule.specs) {
      var spec = axs.AuditRule.specs[auditRuleName];
      if (!spec.opt_requiresConsoleAPI)
        this.auditRules_.push(auditRuleName);
    }
  }
});

test("Basic AuditConfiguration with no customisation", function() {
  // Setup fixture
  var fixtures = document.getElementById('qunit-fixture');
  var auditConfig = new axs.AuditConfiguration();
  auditConfig.scope = fixtures;  // limit scope to just fixture element
  var results = axs.Audit.run(auditConfig);
  equal(this.auditRules_.length, results.length);
  var sortedAuditRules = this.auditRules_.sort();
  var sortedResults = results.sort(function(r1, r2) {
    var r1Name = r1.rule.name;
    var r2Name = r2.rule.name;
    return r1Name.localeCompare(r2Name);
  });
  for (var i = 0; i < sortedAuditRules.length; i++)
      equal(sortedAuditRules[i], sortedResults[i].rule.name);
});

test("Configure severity of an audit rule", function() {
  // Setup fixture
  var fixtures = document.getElementById('qunit-fixture');
  var div = document.createElement('div');
  div.setAttribute('role', 'not-an-aria-role');
  fixtures.appendChild(div);

  var auditConfig = new axs.AuditConfiguration();
  auditConfig.scope = fixtures;  // limit scope to just fixture element
  auditConfig.setSeverity('badAriaRole', axs.constants.Severity.WARNING);
  var results = axs.Audit.run(auditConfig);
  for (var i = 0; i < results.length; i++) {
    if (results[i].rule.name != 'badAriaRole')
      continue;
    var result = results[i];
    equal(result.rule.severity, axs.constants.Severity.WARNING);
    notEqual(result.rule.severity, axs.AuditRule.specs['badAriaRole'].severity);
    return;
  }
});

test("Configure the number of results returned", function() {
  var fixture = document.getElementById('qunit-fixture');
  var div = document.createElement('div');
  div.setAttribute('role', 'not-an-aria-role');
  fixture.appendChild(div);
  var div2 = document.createElement('div');
  div2.setAttribute('role', 'also-not-an-aria-role');
  fixture.appendChild(div2);
  var auditConfig = new axs.AuditConfiguration();
  auditConfig.auditRulesToRun = ['badAriaRole'];
  auditConfig.scope = fixture;  // limit scope to just fixture element

  var results = axs.Audit.run(auditConfig);
  equal(results.length, 1);
  equal(results[0].elements.length, 2)

  auditConfig.maxResults = 1;
  results = axs.Audit.run(auditConfig);
  equal(results.length, 1);
  equal(results[0].elements.length, 1)
});

test('Configure audit rules to ignore', function() {
  var fixture = document.getElementById('qunit-fixture');
  var div = document.createElement('div');
  div.setAttribute('role', 'not-an-aria-role');
  fixture.appendChild(div);

  var auditConfig = new axs.AuditConfiguration();
  auditConfig.scope = fixture;  // limit scope to just fixture element

  var results = axs.Audit.run(auditConfig);
  equal(true, results.some(function(result) {
    return result.rule.name == 'badAriaRole' &&
           result.result == 'FAIL';
  }));

  auditConfig.auditRulesToIgnore = ['badAriaRole']
  var results = axs.Audit.run(auditConfig);
  equal(false, results.some(function(result) {
    return result.rule.name == 'badAriaRole';
  }));

});
