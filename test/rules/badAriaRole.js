module("BadAriaRole");

test("No elements === no problems.", function() {
  // Setup fixture
  var fixtures = document.getElementById('qunit-fixture');
  deepEqual(
    AuditRules.badAriaRole.run(fixtures),
    { result: AuditResult.NA }
  );
});

test("No roles === no problems.", function() {
  // Setup fixture
  var fixtures = document.getElementById('qunit-fixture');
  for (var i = 0; i < 10; i++)
    fixtures.appendChild(document.createElement('div'));

  deepEqual(
    AuditRules.badAriaRole.run(fixtures),
    { result: AuditResult.NA }
  );
});

test("Good role === no problems.", function() {
  // Setup fixture
  var fixtures = document.getElementById('qunit-fixture');
  for (r in ARIA_ROLES) {
    if (ARIA_ROLES.hasOwnProperty(r)) {
      var div = document.createElement('div');
      div.setAttribute('role', r);
      fixtures.appendChild(div);
    }
  }

  deepEqual(
    AuditRules.badAriaRole.run(fixtures),
    { elements: [], result: AuditResult.PASS }
  );
});
