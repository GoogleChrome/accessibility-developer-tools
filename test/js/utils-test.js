module("Contrast Ratio", {
  setup: function () {
    this.fixture_ = document.getElementById('fixture');
    this.black_ = {"red": 0, "green": 0, "blue": 0, "alpha": 1};
    this.white_ = {"red": 255, "green": 255, "blue": 255, "alpha": 1};
  }
});
test("Black and white.", function () {
  equal(axs.utils.calculateContrastRatio(this.white_, this.black_), 21);
  equal(axs.utils.calculateContrastRatio(this.black_, this.white_), 21);
});
test("Same color === no contrast.", function () {
  equal(axs.utils.calculateContrastRatio(this.white_, this.white_), 1);
  equal(axs.utils.calculateContrastRatio(this.black_, this.black_), 1);
});
test("Transparent foreground === no contrast.", function () {
  equal(axs.utils.calculateContrastRatio({"red": 0, "green": 0, "blue": 0, "alpha": 0}, this.white_), 1);
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
  equal(axs.utils.elementHasZeroArea(this.fixture_), false);
});
test("Small element has non-zero area.", function () {
  this.fixture_.style.display = "block";
  this.fixture_.style.width = "1px";
  this.fixture_.style.height = "1px";
  equal(axs.utils.elementHasZeroArea(this.fixture_), false);
});
test("Empty element has zero area.", function () {
  equal(axs.utils.elementHasZeroArea(this.fixture_), true);
});
test("Inline element has non-zero area.", function () {
  this.fixture_.style.display = "inline";
  this.fixture_.appendChild(document.createTextNode('Size!'));
  equal(axs.utils.elementHasZeroArea(this.fixture_), false);
});

module("Transparency", {
  setup: function () {
    this.fixture_ = document.getElementById('fixture');
  }
});
test("Transparent elements are transparent.", function () {
  this.fixture_.style.opacity = 0;
  equal(axs.utils.elementIsTransparent(this.fixture_), true);
});
test("Hidden, but opaque elements are not transparent.", function () {
  this.fixture_.style.display = 'none';
  this.fixture_.style.opacity = 1;
  equal(axs.utils.elementIsTransparent(this.fixture_), false);
});
test("Non-transparent elements are non-transparent.", function () {
  for (var i = 0.001; i <= 1; i += 0.001) {
    this.fixture_.style.opacity = i;
    equal(axs.utils.elementIsTransparent(this.fixture_), false);
  }
});

module("Control labels", {
  setup: function () {
  }
});
test("Input type=submit has a label.", function() {
  var element = document.createElement("input");
  element.type = "submit";
  equal(axs.utils.hasLabel(element), true);
});
test("A placeholder counts a label.", function() {
  var element0 = document.createElement("textarea");
  element0.placeholder = "Your life story";
  equal(axs.utils.hasLabel(element0), true);

  var element1 = document.createElement("input");
  element1.placeholder = "First name";
  equal(axs.utils.hasLabel(element1), true);

  var element2 = document.createElement("input");
  element2.type = "url";
  element2.placeholder = "Homepage";
  equal(axs.utils.hasLabel(element2), true);

  // This one fails, a checkbox can't have a placeholder.
  var element3 = document.createElement("input");
  element3.type = "checkbox";
  element3.placeholder = "Add me to your mailing list";
  equal(axs.utils.hasLabel(element3), false);
});
