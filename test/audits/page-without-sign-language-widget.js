module("Page Sign Language");
/*
  test: function (scope) {
    var signLanguageWidget = scope.querySelectorAll("#DeafTranslate");
    if (signLanguageWidget.length) return false;
    var signLanguageWidget = scope.querySelectorAll("#SignLanguage");
    if (signLanguageWidget.length) return false;
    var signLanguageWidget = scope.querySelectorAll(".sign-language");
    if (signLanguageWidget.length) return false;
    var signLanguageWidget = scope.querySelectorAll(".mr-tooltip");
    return !signLanguageWidget.length;
*/
test("Page must have a sign language widget", function (assert) {
  // Remove the title element from the qunit test page.
  var deaf = document.querySelector("#DeafTranslate");
  if (deaf && deaf.parentNode) deaf.parentNode.removeChild(deaf);

  var config = {
    scope: document.documentElement,
    ruleName: "pageWithoutSignLanguageWidget",
    expected: axs.constants.AuditResult.FAIL,
  };

  var deafElm = document.createElement("div");
  deafElm.id = "DeafTranslate";
  var config = {
    scope: document.documentElement,
    ruleName: "pageWithoutSignLanguageWidget",
    expected: axs.constants.AuditResult.PASS,
  };
  // This one fails because there is no title element.
  assert.runRule(config);
  var deaf = document.querySelector("#DeafTranslate");
  if (deaf && deaf.parentNode) deaf.parentNode.removeChild(deaf);
});
