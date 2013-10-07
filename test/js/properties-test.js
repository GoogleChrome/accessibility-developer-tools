module("Text Descendant", {
});

test("Find text descendants in an iframe.", function() {
    // Setup fixture
    var fixture = document.getElementById('qunit-fixture');

    var iframe = document.createElement('iframe');
    var html = '<body><div id="foo">bar</div></body>';
    fixture.appendChild(iframe);
    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(html);
    iframe.contentWindow.document.close();

    var foo = iframe.contentDocument.getElementById("foo");

    equal(axs.properties.hasDirectTextDescendant(foo), true);
});

module('findTextAlternatives', {
    setup: function () {
        this.fixture_ = document.getElementById('qunit-fixture');
    }
});
test('returns the calculated text alternative for the given element', function() {
    var targetNode = document.createElement('select');
    this.fixture_.appendChild(targetNode);

    try {
        equal(axs.properties.findTextAlternatives(targetNode, {}, true), '');
    } catch(e) {
        ok(false, 'Threw exception');
    }
});

module('getTextFromHostLanguageAttributes', {
    setup: function () {
        this.fixture_ = document.getElementById('qunit-fixture');
    }
});
test('does not crash when targetNode has a numeric id attribute', function() {
    var targetNode = document.createElement('input');
    targetNode.setAttribute('id', '123_user');
    this.fixture_.appendChild(targetNode);

    try {
        equal(axs.properties.getTextFromHostLanguageAttributes(targetNode, {}, null), null);
    } catch(e) {
        ok(false, 'Threw exception: ' + e);
    }
});
