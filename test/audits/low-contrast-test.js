module("LowContrast");

test("Opacity is handled", function() {
  // Setup fixture
  var fixtures = document.getElementById('qunit-fixture');
  var elementWithOpacity = document.createElement('div');
  elementWithOpacity.style.opacity = '0.4';
  elementWithOpacity.textContent = 'Some text';
  fixtures.appendChild(elementWithOpacity);
  deepEqual(
    axs.AuditRules.getRule('lowContrastElements').run([], fixtures),
    { elements: [elementWithOpacity], result: axs.constants.AuditResult.FAIL }
  );
});
