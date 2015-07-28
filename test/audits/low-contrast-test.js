module("LowContrast");

test("No text = no relevant elements", function() {
  var fixture = document.getElementById('qunit-fixture');
  var div = document.createElement('div');
  div.style.backgroundColor = 'white';
  div.style.color = 'white';
  fixture.appendChild(div);
  deepEqual(
    axs.AuditRules.getRule('lowContrastElements').run({ scope: fixture }),
    { result: axs.constants.AuditResult.NA }
  );
});

test("Black on white = no problem", function() {
  var fixture = document.getElementById('qunit-fixture');
  var div = document.createElement('div');
  div.style.backgroundColor = 'white';
  div.style.color = 'black';
  div.textContent = 'Some text';
  fixture.appendChild(div);
  deepEqual(
    axs.AuditRules.getRule('lowContrastElements').run({ scope: fixture }),
    { elements: [], result: axs.constants.AuditResult.PASS }
  );
});

test("Low contrast = fail", function() {
  var fixture = document.getElementById('qunit-fixture');
  var div = document.createElement('div');
  div.style.backgroundColor = 'white';
  div.style.color = '#aaa';  // Contrast ratio = 2.32
  div.textContent = 'Some text';
  fixture.appendChild(div);
  deepEqual(
    axs.AuditRules.getRule('lowContrastElements').run({ scope: fixture }),
    { elements: [div], result: axs.constants.AuditResult.FAIL }
  );
});

test("Opacity is handled", function() {
  // Setup fixture
  var fixture = document.getElementById('qunit-fixture');
  var elementWithOpacity = document.createElement('div');
  elementWithOpacity.style.opacity = '0.4';
  elementWithOpacity.textContent = 'Some text';
  fixture.appendChild(elementWithOpacity);
  deepEqual(
    axs.AuditRules.getRule('lowContrastElements').run({ scope: fixture }),
    { elements: [elementWithOpacity], result: axs.constants.AuditResult.FAIL }
  );
});

test("Uses tolerance value", function() {
  var fixture = document.getElementById('qunit-fixture');
  var div = document.createElement('div');
  div.style.backgroundColor = 'white';
  div.style.color = '#777'; // Contrast ratio = 4.48
  div.textContent = 'Some text';
  fixture.appendChild(div);
  deepEqual(
    axs.AuditRules.getRule('lowContrastElements').run({ scope: fixture }),
    { elements: [], result: axs.constants.AuditResult.PASS }
  );
});

test("Disabled button = no relevant elements", function() {
  var fixture = document.getElementById('qunit-fixture');
  var button = document.createElement('button');
  button.textContent = "I Can Has Cheezburger?";
  button.setAttribute("disabled", "disabled");
  fixture.appendChild(button);
  deepEqual(axs.AuditRules.getRule('lowContrastElements').run({ scope: fixture }),
    { result: axs.constants.AuditResult.NA });
});

test("Button in disabled fieldset = no relevant elements", function() {
  var fixture = document.getElementById('qunit-fixture');
  var container = document.createElement('fieldset');
  container.setAttribute("disabled", "disabled");
  var legend = container.appendChild(document.createElement('legend'));
  legend.textContent = 'Pointless legend';
  var button = container.appendChild(document.createElement('button'));
  button.textContent = "I Can Has Cheezburger?";
  fixture.appendChild(container);
  deepEqual(axs.AuditRules.getRule('lowContrastElements').run({ scope: fixture }),
    { result: axs.constants.AuditResult.NA });
});

test("Crazy button in disabled fieldset legend test = relevant elements", function() {
  var fixture = document.getElementById('qunit-fixture');
  var container = document.createElement('fieldset');
  container.setAttribute("disabled", "disabled");
  var legend = container.appendChild(document.createElement('legend'));
  legend.textContent = 'Pointless legend';
  var button = legend.appendChild(document.createElement('button'));
  button.textContent = "I Can Has Cheezburger?";
  fixture.appendChild(container);
  deepEqual(
    axs.AuditRules.getRule('lowContrastElements').run({ scope: fixture }),
    { elements: [], result: axs.constants.AuditResult.PASS });
});

test("Even crazier button in disabled fieldset second legend test = no relevant elements", function() {
  var fixture = document.getElementById('qunit-fixture');
  var container = document.createElement('fieldset');
  container.setAttribute("disabled", "disabled");
  var legend = container.appendChild(document.createElement('legend'));
  legend.textContent = 'Pointless legend 1';
  legend = container.appendChild(document.createElement('legend'));
  legend.textContent = 'Pointless legend 2';
  var button = legend.appendChild(document.createElement('button'));
  button.textContent = "I Can Has Cheezburger?";
  fixture.appendChild(container);
  deepEqual(axs.AuditRules.getRule('lowContrastElements').run({ scope: fixture }),
    { result: axs.constants.AuditResult.NA });
});
