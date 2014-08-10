(function(){//scope to avoid leaking shared helpers and variables to global namespace
    var RULE_NAME = "multipleAriaOwners";

    module("MultipleAriaOwners");

    test("Element owned once only", function() {
        var fixture = addOwnedAndGetContainer(["theOwned"]);
        var rule = axs.AuditRules.getRule(RULE_NAME);
        deepEqual(rule.run({ scope: fixture }),
                  { elements: [], result: axs.constants.AuditResult.PASS });
    });

    test("Multiple elements owned once only", function() {
        var fixture = addOwnedAndGetContainer(["theOwnedElement", "theOtherOwnedElement"]);
        var rule = axs.AuditRules.getRule(RULE_NAME);
        deepEqual(rule.run({ scope: fixture }),
                  { elements: [], result: axs.constants.AuditResult.PASS });
    });

    test("Element owned once only but not found in DOM", function() {
        var id = "theOwnedElement",
            fixture = addOwnedAndGetContainer([id]),
            element = document.getElementById(id);
        element.parentNode.removeChild(element);
        var rule = axs.AuditRules.getRule(RULE_NAME);
        deepEqual(rule.run({ scope: fixture }),
                  { elements: [], result: axs.constants.AuditResult.PASS });
    });

    test("Element owned multiple times", function() {
        var fixture = addOwnedAndGetContainer(["theOwned"], ["owner1","owner2"]);
        var rule = axs.AuditRules.getRule(RULE_NAME);
        var result = rule.run({ scope: fixture });
        equal(result.result, axs.constants.AuditResult.FAIL);
        equal(result.elements.length, 2);
    });

    test("Multiple elements owned multiple times", function() {
        var fixture = addOwnedAndGetContainer(["theOwnedElement", "theOtherOwnedElement"], ["owner1","owner2", "owner3"]);
        var rule = axs.AuditRules.getRule(RULE_NAME);
        var result = rule.run({ scope: fixture });
        equal(result.result, axs.constants.AuditResult.FAIL);
        equal(result.elements.length, 3);
    });


    test("Multiple elements one owned multiple times", function() {
        var ownedElements = ["theOwnedElement", "theOtherOwnedElement"];
        var fixture = addOwnedAndGetContainer(ownedElements, ["owner1","owner2"], ownedElements[0]);
        var rule = axs.AuditRules.getRule(RULE_NAME);
        var result = rule.run({ scope: fixture });
        equal(result.result, axs.constants.AuditResult.FAIL);
        equal(result.elements.length, 2);
    });

    test("Using ignoreSelectors", function() {
        var fixture = addOwnedAndGetContainer(["theOwned"], ["owner1","owner2"]);
        var rule = axs.AuditRules.getRule(RULE_NAME);
        var ignoreSelectors = ["#owner1","#owner2"];
        var result = rule.run({ ignoreSelectors: ignoreSelectors, scope: fixture });
        equal(result.result, axs.constants.AuditResult.PASS);
    });

    /**
     * Helper for aria-owns testing:
     *  - adds owned elements to the fixture
     *  - creates owner element/s
     *  - sets aria-owns on owners
     *  - returns the fixture
     * @param {!Array.<string>} ownedIds The ids that will be 'owned'.
     * @param {Array.<string>} ownerIds An id for each 'owner' element.
     * @param {string=} attributeValue Optionally provide the value of 'aria-owns' otherwise the ownedIds will be used.
     * @return {!Element} The test container (qunit fixture).
     */
    function addOwnedAndGetContainer(ownedIds, ownerIds, attributeValue)
    {
        var fixture = document.getElementById("qunit-fixture");
        var value = attributeValue || ownedIds.join(" ");
        ownedIds.forEach(function(id){
            var element = document.createElement("div");
            element.id = id;
            fixture.appendChild(element);
        });
        ownerIds = ownerIds || [""];
        ownerIds.forEach(function(id){
            var element = document.createElement("div");
            if(id)//could be an empty string, that is legit here
            {
                element.id = id;
            }
            element.setAttribute("aria-owns", value);
            fixture.appendChild(element);
        });
        return fixture;
    }
})();