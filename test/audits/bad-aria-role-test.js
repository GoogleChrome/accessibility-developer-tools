module("BadAriaRole");

test("No elements === no problems.", function() {
  // Setup fixture
  var fixtures = document.getElementById('qunit-fixture');
  deepEqual(
    axs.AuditRules.getRule('badAriaRole').run([], fixtures),
    { result: axs.constants.AuditResult.NA }
  );
});

test("No roles === no problems.", function() {
  // Setup fixture
  var fixtures = document.getElementById('qunit-fixture');
  for (var i = 0; i < 10; i++)
    fixtures.appendChild(document.createElement('div'));

  deepEqual(
    axs.AuditRules.getRule('badAriaRole').run([], fixtures),
    { result: axs.constants.AuditResult.NA }
  );
});

test("Good role === no problems.", function() {
  // Setup fixture
  var fixtures = document.getElementById('qunit-fixture');
  for (r in axs.constants.ARIA_ROLES) {
    if (axs.constants.ARIA_ROLES.hasOwnProperty(r)) {
      var div = document.createElement('div');
      div.setAttribute('role', r);
      fixtures.appendChild(div);
    }
  }

  deepEqual(
    axs.AuditRules.getRule('badAriaRole').run([], fixtures),
    { elements: [], result: axs.constants.AuditResult.PASS }
  );
});

test("Bad role == problem", function() {
  // Setup fixture
  var fixtures = document.getElementById('qunit-fixture');
  var div = document.createElement('div');
  div.setAttribute('role', 'not-an-aria-role');
  fixtures.appendChild(div);
  deepEqual(
    axs.AuditRules.getRule('badAriaRole').run([], fixtures),
    { elements: [div], result: axs.constants.AuditResult.FAIL }
  );

});
