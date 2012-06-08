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

AuditRules.unfocusableElementsWithOnClick = {
  ruleName: 'unfocusableElementsWithOnClick',
  severity: Severity.Warning,
  runInDevtools: true,
  run: function(resultsCallback) {
      var extensionId = chrome.i18n.getMessage("@@extension_id"); // yes, really.

      function addEventListener(extensionId) {
          function handleEventListenersEvent(event) {
              var element = event.target;
              clickableElements.push(element);
              if (element.getAttribute('tabindex') == null)
                  unfocusableClickableElements.push(convertElementToResult(event.target));
          }
          clickableElements = [];
          unfocusableClickableElements = [];
          document.addEventListener(extensionId, handleEventListenersEvent);
      }
      chrome.devtools.inspectedWindow.eval('(' + addEventListener + ')("'+ extensionId + '")',
                                          { useContentScriptContext: true });

      function getEventListenersForUnfocusableElements(eventName) {
          var potentialOnclickElements = document.querySelectorAll('span, div, img');

          var unfocusableClickableElements = [];
          for (var i = 0; i < potentialOnclickElements.length; i++) {
              var element = potentialOnclickElements[i];

              // TODO: check for element is visible/hidden
              var eventListeners = getEventListeners(element);
              if ('click' in eventListeners) {
                  var event = document.createEvent('Event');
                  event.initEvent(eventName, true, false);
                  element.dispatchEvent(event);
              }
          }
          return spansAndDivs.length;
      }
      chrome.devtools.inspectedWindow.eval(
          '(' + getEventListenersForUnfocusableElements + ')("' + extensionId + '")');

      function retrieveResults() {
          var result = AuditResult.NA;
          if (clickableElements.length)
              var result = unfocusableClickableElements.length ? AuditResult.FAIL : AuditResult.PASS;

          return { result: result, elements: unfocusableClickableElements };
      }
      chrome.devtools.inspectedWindow.eval('(' + retrieveResults + ')()',
                                           { useContentScriptContext: true },
                                           resultsCallback)
  }
};
