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

test("> 3:1 and < 4.5:1 contrast for large text passes", function() {
  var fixture = document.getElementById('qunit-fixture');
  var div = document.createElement('div');
  div.style.backgroundColor = '#fafafa';
  div.style.color = '#777';  // Contrast ratio approx 4.3
  div.textContent = 'Some text';
  div.style.fontSize = "19px"
  fixture.appendChild(div);
  deepEqual(
    axs.AuditRules.getRule('lowContrastElements').run({ scope: fixture }),
    { elements: [], result: axs.constants.AuditResult.PASS }
  );
});

test("> 3:1 and < 4.5:1 contrast for bold text passes", function() {
  var fixture = document.getElementById('qunit-fixture');
  var div = document.createElement('div');
  div.style.backgroundColor = '#fafafa';
  div.style.color = '#777';  // Contrast ratio approx 4.3
  div.textContent = 'Some text';
  div.style.fontSize = "15px"
  div.style.fontWeight = "bold"
  fixture.appendChild(div);
  deepEqual(
    axs.AuditRules.getRule('lowContrastElements').run({ scope: fixture }),
    { elements: [], result: axs.constants.AuditResult.PASS }
  );
});

test("< 4.5 contrast for regular text fails", function() {
  var fixture = document.getElementById('qunit-fixture');
  var div = document.createElement('div');
  div.style.backgroundColor = '#fafafa';
  div.style.color = '#777';  // Contrast ratio approx 4.3
  div.textContent = 'Some text';
  div.style.fontSize = "13px"
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
