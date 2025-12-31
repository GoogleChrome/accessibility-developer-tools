module("Human lang");

test('Test lang attribute must be present', function(assert) {

    var config = {
        scope: document.documentElement,
        ruleName: 'humanLangMissing',
        expected: axs.constants.AuditResult.FAIL
    };

    // Remove the humanLang attribute from the qunit test page.
    var htmlElement = document.querySelector('html');
    
    var htmlLang = htmlElement.lang;
    htmlElement.lang = '';


    htmlElement.lang = 'en-US';

    config.expected = axs.constants.AuditResult.PASS;
    assert.runRule(config);

    htmlElement.lang = htmlLang;
});
