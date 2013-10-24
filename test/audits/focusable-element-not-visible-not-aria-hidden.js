module('FocusableElementNotVisibleNotAriaHidden', {
    setup: function() {
        this.fixture_ = document.getElementById('qunit-fixture');
    }
});

test('Shown on focus = ok', function() {
    var style = document.createElement('style');
    style.innerHTML =
        '#skip a {\n' +
        '    position:absolute;\n' +
        '    left:0px;\n' +
        '    top:-500px;\n' +
        '    width:0px;\n' +
        '    height:0px;\n' +
        '    overflow:hidden;\n' +
        '}\n' +
        '#skip a:active, #skip a:focus {\n' +
        '    position:static;\n' +
        '    width:auto;\n' +
        '    height:auto;\n' +
        '}'
    var skipLink = document.createElement('a');
    skipLink.href = '#';
    skipLink.id = 'skip';
    skipLink.textContent = 'Skip to content';
    console.log('fixture', this.fixture_);
    this.fixture_.appendChild(style);
    this.fixture_.appendChild(skipLink);
    deepEqual(
        axs.AuditRules.getRule('focusableElementNotVisibleAndNotAriaHidden')
            .run({scope: this.fixture_}),
        { elements: [], result: axs.constants.AuditResult.PASS });
});
