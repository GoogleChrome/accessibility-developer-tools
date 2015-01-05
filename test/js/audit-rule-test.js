// Copyright 2014 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
(function(){
    module("collectMatchingElements");

    var DIV_COUNT = 10;
    function matcher(element) {
        var tagName = element.tagName;
        if (!tagName)
            return false;
        return (tagName.toLowerCase() === "div" && element.classList.contains("test"));
    }

    function buildTestDom() {
        var result = document.createDocumentFragment();
        result = result.appendChild(document.createElement("div"));
        for (var i = 0; i < DIV_COUNT; i++) {
            var element = document.createElement("div");
            element.className = "test";
            result.appendChild(element);
        }
        return result;
    }

    test("Simple DOM", function () {
        var container = document.getElementById('qunit-fixture');
        container.appendChild(buildTestDom());
        var matched = [];
        axs.AuditRule.collectMatchingElements(container, matcher, matched);
        equal(matched.length, DIV_COUNT);
    });

    test("With shadow DOM", function () {
        var container = document.getElementById('qunit-fixture');
        container.appendChild(buildTestDom());
        var wrapper = container.firstElementChild;
        if (wrapper.createShadowRoot) {
            var matched = [];
            wrapper.createShadowRoot();
            axs.AuditRule.collectMatchingElements(wrapper, matcher, matched);
            equal(matched.length, DIV_COUNT);
        } else {
            console.warn("Test platform does not support shadow DOM");
            ok(true);
        }
    });

    test("Nodes within shadow DOM", function () {
        var container = document.getElementById('qunit-fixture');
        var wrapper = container.appendChild(document.createElement("div"));
        if (wrapper.createShadowRoot) {
            var root = wrapper.createShadowRoot();
            root.appendChild(buildTestDom());
            var matched = [];
            axs.AuditRule.collectMatchingElements(container, matcher, matched);
            equal(matched.length, DIV_COUNT);
        } else {
            console.warn("Test platform does not support shadow DOM");
            ok(true);
        }
    });

    test("Nodes within DOM and shadow DOM", function () {
        var container = document.getElementById('qunit-fixture');
        var wrapper = container.appendChild(document.createElement("div"));
        if (wrapper.createShadowRoot) {
            var root = wrapper.createShadowRoot();
            root.appendChild(buildTestDom());
            var matched = [];
            wrapper.appendChild(buildTestDom());
            axs.AuditRule.collectMatchingElements(container, matcher, matched);
            equal(matched.length, (DIV_COUNT * 2));
        } else {
            console.warn("Test platform does not support shadow DOM");
            ok(true);
        }
    });

})();
