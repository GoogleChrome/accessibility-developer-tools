module('BadAriaRole');

test('No elements === no problems.', function(assert) {
    var config = {
        ruleName: 'badAriaRole',
        expected: axs.constants.AuditResult.NA
    };
    assert.runRule(config);
});

test('No roles === no problems.', function(assert) {
  // Setup fixture
  var fixture = document.getElementById('qunit-fixture');
  for (var i = 0; i < 10; i++)
    fixture.appendChild(document.createElement('div'));

    var config = {
        ruleName: 'badAriaRole',
        expected: axs.constants.AuditResult.NA
    };
    assert.runRule(config);
});

test('Good role === no problems.', function(assert) {
  // Setup fixture
  var fixture = document.getElementById('qunit-fixture');
  for (var r in axs.constants.ARIA_ROLES) {
    if (axs.constants.ARIA_ROLES.hasOwnProperty(r) && !axs.constants.ARIA_ROLES[r].abstract) {
      var div = document.createElement('div');
      div.setAttribute('role', r);
      fixture.appendChild(div);
    }
  }

    var config = {
        ruleName: 'badAriaRole',
        expected: axs.constants.AuditResult.PASS,
        elements: []
    };
    assert.runRule(config);
});

test('Bad role == problem', function(assert) {
  // Setup fixture
  var fixture = document.getElementById('qunit-fixture');
  var div = document.createElement('div');
  div.setAttribute('role', 'not-an-aria-role');
  fixture.appendChild(div);

    var config = {
        ruleName: 'badAriaRole',
        expected: axs.constants.AuditResult.FAIL,
        elements: [div]
    };
    assert.runRule(config);
});

test('Abstract role == problem', function(assert) {
  // Setup fixture
  var fixture = document.getElementById('qunit-fixture');
  var div = document.createElement('div');
  div.setAttribute('role', 'input');
  fixture.appendChild(div);

    var config = {
        ruleName: 'badAriaRole',
        expected: axs.constants.AuditResult.FAIL,
        elements: [div]
    };
    assert.runRule(config);
});
