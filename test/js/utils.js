module("Contrast Ratio", {
  setup: function () {
    this.fixture_ = document.getElementById('fixture');
    this.black_ = {"red": 0, "green": 0, "blue": 0, "alpha": 1};
    this.white_ = {"red": 255, "green": 255, "blue": 255, "alpha": 1};
  }
});
test("Black and white.", function () {
  equal(AccessibilityUtils.calculateContrastRatio(this.white_, this.black_), 21);
  equal(AccessibilityUtils.calculateContrastRatio(this.black_, this.white_), 21);
});
test("Same color === no contrast.", function () {
  equal(AccessibilityUtils.calculateContrastRatio(this.white_, this.white_), 1);
  equal(AccessibilityUtils.calculateContrastRatio(this.black_, this.black_), 1);
});
test("Transparent foreground === no contrast.", function () {
  equal(AccessibilityUtils.calculateContrastRatio({"red": 0, "green": 0, "blue": 0, "alpha": 0}, this.white_), 1);
});

module("Zero Area", {
  setup: function () {
    this.fixture_ = document.getElementById('fixture');
  }
});
test("Large element has non-zero area.", function () {
  this.fixture_.style.display = "block";
  this.fixture_.style.width = "500px";
  this.fixture_.style.height = "500px";
  equal(AccessibilityUtils.elementHasZeroArea(this.fixture_), false);
});
test("Small element has non-zero area.", function () {
  this.fixture_.style.display = "block";
  this.fixture_.style.width = "1px";
  this.fixture_.style.height = "1px";
  equal(AccessibilityUtils.elementHasZeroArea(this.fixture_), false);
});
test("Empty element has zero area.", function () {
  equal(AccessibilityUtils.elementHasZeroArea(this.fixture_), true);
});
test("Inline element has non-zero area.", function () {
  this.fixture_.style.display = "inline";
  this.fixture_.appendChild(document.createTextNode('Size!'));
  equal(AccessibilityUtils.elementHasZeroArea(this.fixture_), false);
});

module("Transparency", {
  setup: function () {
    this.fixture_ = document.getElementById('fixture');
  }
});
test("Transparent elements are transparent.", function () {
  this.fixture_.style.opacity = 0;
  equal(AccessibilityUtils.elementIsTransparent(this.fixture_), true);
});
test("Hidden, but opaque elements are not transparent.", function () {
  this.fixture_.style.display = 'none';
  this.fixture_.style.opacity = 1;
  equal(AccessibilityUtils.elementIsTransparent(this.fixture_), false);
});
test("Non-transparent elements are non-transparent.", function () {
  for (var i = 0.001; i <= 1; i += 0.001) {
    this.fixture_.style.opacity = i;
    equal(AccessibilityUtils.elementIsTransparent(this.fixture_), false);
  }
});
