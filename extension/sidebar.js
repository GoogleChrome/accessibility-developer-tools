// Copyright 2012 Google Inc.
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

function updateView(result) {
    if (!result) {
        console.warn('no result');
        result = {};
    }
    console.log('result', result);

    var main = document.getElementById('main');
    main.innerHTML = '';
    var foundProperty = false;

    for (var sectionName in result) {
        var section = result[sectionName];
        if (!section)
            continue;

        try {
            var template = new Handlebar(getTemplate(sectionName));
            template.render(section,
                            { 'heading': chrome.i18n.getMessage(sectionName),
                              'ariaPartial': new Handlebar(getTemplate('ariaProperty'))
                            }).appendTo(main);
            foundProperty = true;
        } catch (ex) {
            console.error('Could not render results section', section, ex);
        }
    }

    if (!foundProperty) {
        var empty = new Handlebar(getTemplate('empty'));
        empty.render({ 'noAccessibilityInformation': chrome.i18n.getMessage('noAccessibilityInformation') }).appendTo(main);
    }
    insertMessages();
    insertIdrefEventListeners();
    updateHeight();
}

function getTemplate(template) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", chrome.extension.getURL('templates/' + template + '.html'), false);
    xhr.send();
    return xhr.responseText;
}

function updateHeight() {
    var styleHeightPx = window.getComputedStyle(document.body).height;
    var matches = styleHeightPx.match(/((\d+)(\.\d+)?)px/);
    var styleHeight = parseInt(matches[1]);
    var calculatedScrollHeight = styleHeight + 5; // not sure why 5 but it works

    window.sidebar.setHeight(calculatedScrollHeight + "px");
}

function insertIdrefEventListeners() {
    var elementsWithIdref = document.querySelectorAll('[idref]');
    for (var i = 0; i < elementsWithIdref.length; i++) {
        var element = elementsWithIdref[i];
        var idref = element.getAttribute('idref');
        addEventListener(element, idref);
    }
}

function addEventListener(element, idref) {
    element.addEventListener('click',
                             function() {
        chrome.devtools.inspectedWindow.eval(
            'var element = document.getElementById("' + idref + '");\n' +
            'if (element) inspect(element);'
        );
    });
}

function onSelectionChanged() {
    if (!chrome.devtools.inspectedWindow.tabId) {
        return;
    }
    chrome.devtools.inspectedWindow.eval(
        'axs.extensionProperties.getAllProperties($0);',
        { useContentScriptContext: true },
        updateView);
}

function insertMessages() {
    var nodesWithMsg = document.querySelectorAll('[msg]');
    for (var i = 0; i < nodesWithMsg.length; i++) {
        var node = nodesWithMsg[i];
        node.innerText = chrome.i18n.getMessage(node.getAttribute('msg'));
    }
}

chrome.devtools.panels.elements.onSelectionChanged.addListener(onSelectionChanged);
insertMessages();
onSelectionChanged();
