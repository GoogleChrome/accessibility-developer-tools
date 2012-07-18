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

/** @type {Object.<string, Object>} */
axs.constants.ARIA_ROLES = {
    "alert": {
        "namefrom": [ "author" ],
        "parent": [ "region" ]
    },
    "alertdialog": {
        "namefrom": [ "author" ],
        "namerequired": true,
        "parent": [ "alert", "dialog" ]
    },
    "application": {
        "namefrom": [ "author" ],
        "namerequired": true,
        "parent": [ "landmark" ]
    },
    "article": {
        "namefrom": [ "author" ],
        "parent": [ "document", "region" ]
    },
    "banner": {
        "namefrom": [ "author" ],
        "parent": [ "landmark" ]
    },
    "button": {
        "childpresentational": true,
        "namefrom": [ "contents", "author" ],
        "namerequired": true,
        "parent": [ "command" ],
        "properties": [ "aria-expanded", "aria-pressed" ]
    },
    "checkbox": {
        "namefrom": [ "contents", "author" ],
        "namerequired": true,
        "parent": [ "input" ],
        "requiredProperties": [ "aria-checked" ],
        "properties": [ "aria-checked" ]
    },
    "columnheader": {
        "namefrom": [ "contents", "author" ],
        "namerequired": true,
        "parent": [ "gridcell", "sectionhead", "widget" ],
        "properties": [ "aria-sort" ]
    },
    "combobox": {
        "mustcontain": [ "listbox", "textbox" ],
        "namefrom": [ "author" ],
        "namerequired": true,
        "parent": [ "select" ],
        "requiredProperties": [ "aria-expanded" ],
        "properties": [ "aria-expanded", "aria-autocomplete", "aria-required" ]
    },
    "command": {
        "abstract": true,
        "namefrom": [ "author" ],
        "parent": [ "widget" ]
    },
    "complementary": {
        "namefrom": [ "author" ],
        "parent": [ "landmark" ]
    },
    "composite": {
        "abstract": true,
        "childpresentational": false,
        "namefrom": [ "author" ],
        "parent": [ "widget" ],
        "properties": [ "aria-activedescendant" ]
    },
    "contentinfo": {
        "namefrom": [ "author" ],
        "parent": [ "landmark" ]
    },
    "definition": {
        "namefrom": [ "author" ],
        "parent": [ "section" ]
    },
    "dialog": {
        "namefrom": [ "author" ],
        "namerequired": true,
        "parent": [ "window" ]
    },
    "directory": {
        "namefrom": [ "contents", "author" ],
        "parent": [ "list" ]
    },
    "document": {
        "namefrom": [ " author" ],
        "namerequired": true,
        "parent": [ "structure" ],
        "properties": [ "aria-expanded" ]
    },
    "form": {
        "namefrom": [ "author" ],
        "parent": [ "landmark" ]
    },
    "grid": {
        "mustcontain": [ "row", "rowgroup" ],
        "namefrom": [ "author" ],
        "namerequired": true,
        "parent": [ "composite", "region" ],
        "properties": [ "aria-level", "aria-multiselectable", "aria-readonly" ]
    },
    "gridcell": {
        "namefrom": [ "contents", "author" ],
        "namerequired": true,
        "parent": [ "section", "widget" ],
        "properties": [ "aria-readonly", "aria-required", "aria-selected" ]
    },
    "group": {
        "namefrom": [ " author" ],
        "parent": [ "section" ],
        "properties": [ "aria-activedescendant" ]
    },
    "heading": {
        "namerequired": true,
        "parent": [ "sectionhead" ],
        "properties": [ "aria-level" ]
    },
    "img": {
        "childpresentational": true,
        "namefrom": [ "author" ],
        "namerequired": true,
        "parent": [ "section" ]
    },
    "input": {
        "abstract": true,
        "namefrom": [ "author" ],
        "parent": [ "widget" ]
    },
    "landmark": {
        "abstract": true,
        "namefrom": [ "contents", "author" ],
        "namerequired": false,
        "parent": [ "region" ]
    },
    "link": {
        "namefrom": [ "contents", "author" ],
        "namerequired": true,
        "parent": [ "command" ],
        "properties": [ "aria-expanded" ]
    },
    "list": {
        "mustcontain": [ "group", "listitem" ],
        "namefrom": [ "author" ],
        "parent": [ "region" ]
    },
    "listbox": {
        "mustcontain": [ "option" ],
        "namefrom": [ "author" ],
        "namerequired": true,
        "parent": [ "list", "select" ],
        "properties": [ "aria-multiselectable", "aria-required" ]
    },
    "listitem": {
        "namefrom": [ "contents", "author" ],
        "namerequired": true,
        "parent": [ "section" ],
        "properties": [ "aria-level", "aria-posinset", "aria-setsize" ]
    },
    "log": {
        "namefrom": [ " author" ],
        "namerequired": true,
        "parent": [ "region" ]
    },
    "main": {
        "namefrom": [ "author" ],
        "parent": [ "landmark" ]
    },
    "marquee": {
        "namerequired": true,
        "parent": [ "section" ]
    },
    "math": {
        "childpresentational": true,
        "namefrom": [ "author" ],
        "parent": [ "section" ]
    },
    "menu": {
        "mustcontain": [
            "group",
            "menuitemradio",
            "menuitem",
            "menuitemcheckbox"
        ],
        "namefrom": [ "author" ],
        "namerequired": true,
        "parent": [ "list", "select" ]
    },
    "menubar": {
        "namefrom": [ "author" ],
        "parent": [ "menu" ]
    },
    "menuitem": {
        "namefrom": [ "contents", "author" ],
        "namerequired": true,
        "parent": [ "command" ]
    },
    "menuitemcheckbox": {
        "namefrom": [ "contents", "author" ],
        "namerequired": true,
        "parent": [ "checkbox", "menuitem" ]
    },
    "menuitemradio": {
        "namefrom": [ "contents", "author" ],
        "namerequired": true,
        "parent": [ "menuitemcheckbox", "radio" ]
    },
    "navigation": {
        "namefrom": [ "author" ],
        "parent": [ "landmark" ]
    },
    "note": {
        "namefrom": [ "author" ],
        "parent": [ "section" ]
    },
    "option": {
        "namefrom": [ "contents", "author" ],
        "namerequired": true,
        "parent": [ "input" ],
        "properties": [
            "aria-checked",
            "aria-posinset",
            "aria-selected",
            "aria-setsize"
        ]
    },
    "presentation": {
        "parent": [ "structure" ]
    },
    "progressbar": {
        "childpresentational": true,
        "namefrom": [ "author" ],
        "namerequired": true,
        "parent": [ "range" ]
    },
    "radio": {
        "namefrom": [ "contents", "author" ],
        "namerequired": true,
        "parent": [ "checkbox", "option" ]
    },
    "radiogroup": {
        "mustcontain": [ "radio" ],
        "namefrom": [ "author" ],
        "namerequired": true,
        "parent": [ "select" ],
        "properties": [ "aria-required" ]
    },
    "range": {
        "abstract": true,
        "namefrom": [ "author" ],
        "parent": [ "widget" ],
        "properties": [
            "aria-valuemax",
            "aria-valuemin",
            "aria-valuenow",
            "aria-valuetext"
        ]
    },
    "region": {
        "namefrom": [ " author" ],
        "parent": [ "section" ]
    },
    "roletype": {
        "abstract": true,
        "properties": [
            "aria-atomic",
            "aria-busy",
            "aria-controls",
            "aria-describedby",
            "aria-disabled",
            "aria-dropeffect",
            "aria-flowto",
            "aria-grabbed",
            "aria-haspopup",
            "aria-hidden",
            "aria-invalid",
            "aria-label",
            "aria-labelledby",
            "aria-live",
            "aria-owns",
            "aria-relevant"
        ]
    },
    "row": {
        "mustcontain": [ "columnheader", "gridcell", "rowheader" ],
        "namefrom": [ "contents", "author" ],
        "parent": [ "group", "widget" ],
        "properties": [ "aria-level", "aria-selected" ]
    },
    "rowgroup": {
        "mustcontain": [ "row" ],
        "namefrom": [ "contents", "author" ],
        "parent": [ "group" ]
    },
    "rowheader": {
        "namefrom": [ "contents", "author" ],
        "namerequired": true,
        "parent": [ "gridcell", "sectionhead", "widget" ],
        "properties": [ "aria-sort" ]
    },
    "search": {
        "namefrom": [ "author" ],
        "parent": [ "landmark" ]
    },
    "section": {
        "abstract": true,
        "namefrom": [ "contents", "author" ],
        "parent": [ "structure" ],
        "properties": [ "aria-expanded" ]
    },
    "sectionhead": {
        "abstract": true,
        "namefrom": [ "contents", "author" ],
        "parent": [ "structure" ],
        "properties": [ "aria-expanded" ]
    },
    "select": {
        "abstract": true,
        "namefrom": [ "author" ],
        "parent": [ "composite", "group", "input" ]
    },
    "separator": {
        "childpresentational": true,
        "namefrom": [ "author" ],
        "parent": [ "structure" ],
        "properties": [ "aria-expanded", "aria-orientation" ]
    },
    "scrollbar": {
        "childpresentational": true,
        "namefrom": [ "author" ],
        "namerequired": false,
        "parent": [ "input", "range" ],
        "requiredProperties": [
            "aria-controls",
            "aria-orientation",
            "aria-valuemax",
            "aria-valuemin",
            "aria-valuenow"
        ],
        "properties": [
            "aria-controls",
            "aria-orientation",
            "aria-valuemax",
            "aria-valuemin",
            "aria-valuenow"
        ]
    },
    "slider": {
        "childpresentational": true,
        "namefrom": [ "author" ],
        "namerequired": true,
        "parent": [ "input", "range" ],
        "requiredProperties": [ "aria-valuemax", "aria-valuemin", "aria-valuenow" ],
        "properties": [
            "aria-valuemax",
            "aria-valuemin",
            "aria-valuenow",
            "aria-orientation"
        ]
    },
    "spinbutton": {
        "namefrom": [ "author" ],
        "namerequired": true,
        "parent": [ "input", "range" ],
        "requiredProperties": [ "aria-valuemax", "aria-valuemin", "aria-valuenow" ],
        "properties": [
            "aria-valuemax",
            "aria-valuemin",
            "aria-valuenow",
            "aria-required"
        ]
    },
    "status": {
        "parent": [ "region" ]
    },
    "structure": {
        "abstract": true,
        "parent": [ "roletype" ]
    },
    "tab": {
        "namefrom": [ "contents", "author" ],
        "parent": [ "sectionhead", "widget" ],
        "properties": [ "aria-selected" ]
    },
    "tablist": {
        "mustcontain": [ "tab" ],
        "namefrom": [ "author" ],
        "parent": [ "composite", "directory" ],
        "properties": [ "aria-level" ]
    },
    "tabpanel": {
        "namefrom": [ "author" ],
        "namerequired": true,
        "parent": [ "region" ]
    },
    "textbox": {
        "namefrom": [ "author" ],
        "namerequired": true,
        "parent": [ "input" ],
        "properties": [
            "aria-activedescendant",
            "aria-autocomplete",
            "aria-multiline",
            "aria-readonly",
            "aria-required"
        ]
    },
    "timer": {
        "namefrom": [ "author" ],
        "namerequired": true,
        "parent": [ "status" ]
    },
    "toolbar": {
        "namefrom": [ "author" ],
        "parent": [ "group" ]
    },
    "tooltip": {
        "namerequired": true,
        "parent": [ "section" ]
    },
    "tree": {
        "mustcontain": [ "group", "treeitem" ],
        "namefrom": [ "author" ],
        "namerequired": true,
        "parent": [ "select" ],
        "properties": [ "aria-multiselectable", "aria-required" ]
    },
    "treegrid": {
        "mustcontain": [ "row" ],
        "namefrom": [ "author" ],
        "namerequired": true,
        "parent": [ "grid", "tree" ]
    },
    "treeitem": {
        "namefrom": [ "contents", "author" ],
        "namerequired": true,
        "parent": [ "listitem", "option" ]
    },
    "widget": {
        "abstract": true,
        "parent": [ "roletype" ]
    },
    "window": {
        "abstract": true,
        "namefrom": [ " author" ],
        "parent": [ "roletype" ],
        "properties": [ "aria-expanded" ]
    }
};

for (var roleName in axs.constants.ARIA_ROLES) {
    var role = axs.constants.ARIA_ROLES[roleName];
    // Inherit all properties and requiredProperties from parent hierarchy.
    function addAllPropertiesToSet(role, propertiesName, propertiesSet) {
        var properties = role[propertiesName]
        if (properties) {
            for (var i = 0; i < properties.length; i++)
                propertiesSet[properties[i]] = true;
        }
        if (role['parent']) {
            var parents = role['parent'];
            for (var j = 0; j < parents.length; j++) {
                var parentRoleName = parents[j];
                addAllPropertiesToSet(axs.constants.ARIA_ROLES[parentRoleName], propertiesName, propertiesSet);
            }
        }
    }
    var propertiesSet = {};
    addAllPropertiesToSet(role, 'properties', propertiesSet);
    role['propertiesSet'] = propertiesSet;

    var requiredPropertiesSet = {};
    addAllPropertiesToSet(role, 'requiredProperties', requiredPropertiesSet);
    role['requiredPropertiesSet'] = requiredPropertiesSet;

    // Squash parent hierarchy on to role object
    function addAllParentRolesToSet(role, set) {
        if (!role['parent'])
            return;

        var parents = role['parent'];
        for (var j = 0; j < parents.length; j++) {
            var parentRoleName = parents[j];
            set[parentRoleName] = true;
            addAllParentRolesToSet(axs.constants.ARIA_ROLES[parentRoleName], set);
        }
    }
    var parentRolesSet = {};
    addAllParentRolesToSet(role, parentRolesSet);
    role['allParentRolesSet'] = parentRolesSet;
}

/** @type {Object.<string, Object>} */
axs.constants.ARIA_PROPERTIES = {
    "activedescendant": {
        "type": "property",
        "valueType": "idref"
    },
    "atomic": {
        "type": "property",
        "valueType": "true-false"
    },
    "autocomplete": {
        "type": "property",
        "valueType": "token",
        "defaultValue": "none",
        "values": [
            "inline",
            "list",
            "both",
            "none"
        ]
    },
    "busy": {
        "type": "state",
        "valueType": "true-false"
    },
    "checked": {
        "type": "state",
        "valueType": "tristate"
    },
    "controls": {
        "type": "property",
        "valueType": "idref_list"
    },
    "describedby": {
        "type": "property",
        "valueType": "idref_list"
    },
    "disabled": {
        "type": "state",
        "valueType": "true-false"
    },
    "dropeffect": {
        "type": "property",
        "valueType": "token_list",
        "defaultValue": "none",
        "values": [
            "copy",
            "move",
            "link",
            "execute",
            "popup",
            "none"
        ]
    },
    "expanded": {
        "type": "state",
        "valueType": "true-false-undefined"
    },
    "flowto": {
        "type": "property",
        "valueType": "idref_list"
    },
    "grabbed": {
        "type": "state",
        "valueType": "true-false-undefined"
    },
    "haspopup": {
        "type": "property",
        "valueType": "true-false"
    },
    "hidden": {
        "type": "state",
        "valueType": "true-false"
    },
    "invalid": {
        "type": "state",
        "valueType": "token",
        "defaultValue": "false",
        "values": [
            "grammar",
            "false",
            "spelling",
            "true"
        ]
    },
    "label": {
        "type": "property",
        "valueType": "string"
    },
    "labelledby": {
        "type": "property",
        "valueType": "idref_list"
    },
    "level": {
        "type": "property",
        "valueType": "integer"
    },
    "live": {
        "type": "property",
        "valueType": "token",
        "defaultValue": "off",
        "values": [
            "off",
            "polite",
            "assertive"
        ]
    },
    "multiline": {
        "type": "property",
        "valueType": "true-false"
    },
    "multiselectable": {
        "type": "property",
        "valueType": "true-false"
    },
    "orientation": {
        "type": "property",
        "valueType": "token",
        "defaultValue": "horizontal",
        "values": [
            "vertical",
            "horizontal"
        ]
    },
    "owns": {
        "type": "property",
        "valueType": "idref_list"
    },
    "posinset": {
        "type": "property",
        "valueType": "integer"
    },
    "pressed": {
        "type": "state",
        "valueType": "tristate"
    },
    "readonly": {
        "type": "property",
        "valueType": "true-false"
    },
    "relevant": {
        "type": "property",
        "valueType": "token_list",
        "defaultValue": "additions",
        "values": [
            "additions",
            "removals",
            "text",
            "all",
            "additions"
        ]
    },
    "required": {
        "type": "property",
        "valueType": "true-false"
    },
    "selected": {
        "type": "state",
        "valueType": "true-false-undefined"
    },
    "setsize": {
        "type": "property",
        "valueType": "integer"
    },
    "sort": {
        "type": "property",
        "valueType": "token",
        "defaultValue": "none",
        "values": [
            "ascending",
            "descending",
            "none",
            "other"
        ]
    },
    "valuemax": {
        "type": "property",
        "valueType": "number"
    },
    "valuemin": {
        "type": "property",
        "valueType": "number"
    },
    "valuenow": {
        "type": "property",
        "valueType": "number"
    },
    "valuetext": {
        "type": "property",
        "valueType": "string"
    }
};

axs.constants.MIXED_VALUES = {
    "true": true,
    "false": true,
    "mixed": true
}

// pull values lists into sets
for (var propertyName in axs.constants.ARIA_PROPERTIES) {
    var propertyDetails = axs.constants.ARIA_PROPERTIES[propertyName];
    if (!propertyDetails.values)
        continue;
    var valuesSet = {};
    for (var i = 0; i < propertyDetails.values.length; i++)
        valuesSet[propertyDetails.values[i]] = true;
    propertyDetails.valuesSet = valuesSet;
}

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

