module("toBeAccessible");

test("does not run if jasmine is not defined", function() {
  expect(2);

  this.spy(axs.Audit, "run");
  axs.testing.matchers.toBeAccessible();
  equal(typeof jasmine, "undefined", "jasmine is not defined");
  equal(axs.Audit.run.callCount, 0, "does not run the audit");
});

module("with jasmine", {
  setup: function() {
    jasmine = {};
    beforeEach = {};
  },
  teardown: function() {
    jasmine = undefined;
    beforeEach = undefined;
  }
});

test("runs the audit and returns true if there are no errors", function() {
  expect(2);

  jasmine = {};
  beforeEach = {};

  var fakeResults = {
    numErrors: function() {
      return 0;
    },
    toString: function() {
      return {
        bind: function() {}
      };
    }
  };

  this.spy(axs.Audit, "run");
  this.stub(axs.Audit, "auditResults").returns(fakeResults);

  ok(axs.testing.matchers.toBeAccessible(), "returns true");
  ok(axs.Audit.run.calledOnce, "ran the audit");
});
