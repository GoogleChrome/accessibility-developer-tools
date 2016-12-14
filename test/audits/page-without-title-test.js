module("Page titles");

test("Page titles must be present and non-empty", function(assert) {

    // Remove the title element from the qunit test page.
    var title = document.querySelector('title');
    if (title && title.parentNode)
        title.parentNode.removeChild(title);

    var config = {
        scope: document.documentElement,
        ruleName: 'pageWithoutTitle',
        expected: axs.constants.AuditResult.FAIL
    };

    // This one fails because there is no title element.
    assert.runRule(config);

    var head = document.querySelector('head');
    var blankTitle = document.createElement('title');
    head.appendChild(blankTitle);

    // This one fails because the title element is blank.
    assert.runRule(config);

    blankTitle.textContent = 'foo';
    config.expected = axs.constants.AuditResult.PASS;
    assert.runRule(config);

    // Put it back the way it was...
    blankTitle.parentNode.replaceChild(title, blankTitle);

});