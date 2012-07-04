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

goog.provide('axs.constants');
goog.provide('axs.constants.Severity');
goog.provide('axs.constants.AuditResult');

/** @type {Object.<string, boolean>} */
axs.constants.ARIA_ROLES = {
    'alert': true,
    'alertdialog': true,
    'application': true,
    'article': true,
    'banner': true,
    'button': true,
    'checkbox': true,
    'columnheader': true,
    'combobox': true,
    'complementary': true,
    'contentinfo': true,
    'definition': true,
    'dialog': true,
    'directory': true,
    'document': true,
    'form': true,
    'grid': true,
    'gridcell': true,
    'group': true,
    'heading': true,
    'img': true,
    'link': true,
    'list': true,
    'listbox': true,
    'log': true,
    'main': true,
    'marquee': true,
    'math': true,
    'menu': true,
    'menubar': true,
    'menuitem': true,
    'menuitemcheckbox': true,
    'menuitemradio': true,
    'navigation': true,
    'note': true,
    'option': true,
    'presentation': true,
    'progressbar': true,
    'radio': true,
    'radiogroup': true,
    'region': true,
    'row': true,
    'rowgroup': true,
    'rowheader': true,
    'scrollbar': true,
    'search': true,
    'separator': true,
    'slider': true,
    'spinbutton': true,
    'status': true,
    'tab': true,
    'tablist': true,
    'tabpanel': true,
    'textbox': true,
    'timer': true,
    'toolbar': true,
    'tooltip': true,
    'tree': true,
    'treegrid': true,
    'treeitem': true
};

/** @type {Object.<string, boolean>} */
axs.constants.ARIA_PROPERTIES = {
    'aria-activedescendant': true,
    'aria-atomic': true,
    'aria-autocomplete': true,
    'aria-busy': true, // (state)
    'aria-checked': true, // (state)
    'aria-controls': true,
    'aria-describedby': true,
    'aria-disabled': true, // (state)
    'aria-dropeffect': true,
    'aria-expanded': true, // (state)
    'aria-flowto': true,
    'aria-grabbed': true, // (state)
    'aria-haspopup': true,
    'aria-hidden': true, // (state)
    'aria-invalid': true, // (state)
    'aria-label': true,
    'aria-labelledby': true,
    'aria-level': true,
    'aria-live': true,
    'aria-multiline': true,
    'aria-multiselectable': true,
    'aria-orientation': true,
    'aria-owns': true,
    'aria-posinset': true,
    'aria-pressed': true, // (state)
    'aria-readonly': true,
    'aria-relevant': true,
    'aria-required': true,
    'aria-selected': true, // (state)
    'aria-setsize': true,
    'aria-sort': true,
    'aria-valuemax': true,
    'aria-valuemin': true,
    'aria-valuenow': true,
    'aria-valuetext': true
};

/** @enum {string} */
axs.constants.Severity =  {
    Info: 'Info',
    Warning: 'Warning',
    Severe: 'Severe'
};

/** @enum {string} */
axs.constants.AuditResult = {
    PASS: 'PASS',
    FAIL: 'FAIL',
    NA: 'NA'
};

