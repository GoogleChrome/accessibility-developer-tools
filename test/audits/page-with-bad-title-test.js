module("Page titles");

test("Page title must be less than 66 characters in length", function() {
    var rule = axs.AuditRules.getRule('pageWithBadTitle');

    // Save the existing title for later use
    var originalTitle = document.title;

    // Text that will replace the existing title for testing needs
    var badTitle = "Hello, i am a text that is used for testing of this page, 12345678";

    // Replace title with the bad title
    document.title = badTitle;

    // This test fails because title is longer than 65 characters
    equal(rule.run().result,
      axs.constants.AuditResult.FAIL);

    // Tidy up, revert the title to its original state
    document.title = originalTitle;

});

test("Page title must not end with '.'", function() {
    var rule = axs.AuditRules.getRule('pageWithBadTitle');

    // Save the existing title for later use
    var originalTitle = document.title;

    // Text that will replace the existing title for testing needs
    var badTitle = "Hello, i am a text that is used for testing of this page, 123456.";

    // Replace title with the bad title
    document.title = badTitle;

    // This test fails because the title ends with '.' (a full stop)
    equal(rule.run().result,
      axs.constants.AuditResult.FAIL);

    // Tidy up, revert the title to its original state
    document.title = originalTitle;

});

test("Page title must not contain '/', '\\' or '-' (slash, backslash or hyphen)", function() {
    var rule = axs.AuditRules.getRule('pageWithBadTitle');

    // Save the existing title for later use
    var originalTitle = document.title;

    // Text that will replace the existing title for testing needs
    var badTitle = "Hello - i am a text \\ that is used for testing of this page / 12";

    // Replace title with the bad title
    document.title = badTitle;

    // This test fails because the title contains '/', '\' or '-' (slash, backslash or hyphen)
    equal(rule.run().result,
      axs.constants.AuditResult.FAIL);

    // Tidy up, revert the title to its original state
    document.title = originalTitle;

});

