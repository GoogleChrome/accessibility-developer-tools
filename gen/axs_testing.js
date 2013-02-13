var axs = {};
axs.constants = {};
axs.constants.ARIA_ROLES = {alert:{namefrom:["author"], parent:["region"]}, alertdialog:{namefrom:["author"], namerequired:!0, parent:["alert", "dialog"]}, application:{namefrom:["author"], namerequired:!0, parent:["landmark"]}, article:{namefrom:["author"], parent:["document", "region"]}, banner:{namefrom:["author"], parent:["landmark"]}, button:{childpresentational:!0, namefrom:["contents", "author"], namerequired:!0, parent:["command"], properties:["aria-expanded", "aria-pressed"]}, checkbox:{namefrom:["contents", 
"author"], namerequired:!0, parent:["input"], requiredProperties:["aria-checked"], properties:["aria-checked"]}, columnheader:{namefrom:["contents", "author"], namerequired:!0, parent:["gridcell", "sectionhead", "widget"], properties:["aria-sort"]}, combobox:{mustcontain:["listbox", "textbox"], namefrom:["author"], namerequired:!0, parent:["select"], requiredProperties:["aria-expanded"], properties:["aria-expanded", "aria-autocomplete", "aria-required"]}, command:{"abstract":!0, namefrom:["author"], 
parent:["widget"]}, complementary:{namefrom:["author"], parent:["landmark"]}, composite:{"abstract":!0, childpresentational:!1, namefrom:["author"], parent:["widget"], properties:["aria-activedescendant"]}, contentinfo:{namefrom:["author"], parent:["landmark"]}, definition:{namefrom:["author"], parent:["section"]}, dialog:{namefrom:["author"], namerequired:!0, parent:["window"]}, directory:{namefrom:["contents", "author"], parent:["list"]}, document:{namefrom:[" author"], namerequired:!0, parent:["structure"], 
properties:["aria-expanded"]}, form:{namefrom:["author"], parent:["landmark"]}, grid:{mustcontain:["row", "rowgroup"], namefrom:["author"], namerequired:!0, parent:["composite", "region"], properties:["aria-level", "aria-multiselectable", "aria-readonly"]}, gridcell:{namefrom:["contents", "author"], namerequired:!0, parent:["section", "widget"], properties:["aria-readonly", "aria-required", "aria-selected"]}, group:{namefrom:[" author"], parent:["section"], properties:["aria-activedescendant"]}, 
heading:{namerequired:!0, parent:["sectionhead"], properties:["aria-level"]}, img:{childpresentational:!0, namefrom:["author"], namerequired:!0, parent:["section"]}, input:{"abstract":!0, namefrom:["author"], parent:["widget"]}, landmark:{"abstract":!0, namefrom:["contents", "author"], namerequired:!1, parent:["region"]}, link:{namefrom:["contents", "author"], namerequired:!0, parent:["command"], properties:["aria-expanded"]}, list:{mustcontain:["group", "listitem"], namefrom:["author"], parent:["region"]}, 
listbox:{mustcontain:["option"], namefrom:["author"], namerequired:!0, parent:["list", "select"], properties:["aria-multiselectable", "aria-required"]}, listitem:{namefrom:["contents", "author"], namerequired:!0, parent:["section"], properties:["aria-level", "aria-posinset", "aria-setsize"]}, log:{namefrom:[" author"], namerequired:!0, parent:["region"]}, main:{namefrom:["author"], parent:["landmark"]}, marquee:{namerequired:!0, parent:["section"]}, math:{childpresentational:!0, namefrom:["author"], 
parent:["section"]}, menu:{mustcontain:["group", "menuitemradio", "menuitem", "menuitemcheckbox"], namefrom:["author"], namerequired:!0, parent:["list", "select"]}, menubar:{namefrom:["author"], parent:["menu"]}, menuitem:{namefrom:["contents", "author"], namerequired:!0, parent:["command"]}, menuitemcheckbox:{namefrom:["contents", "author"], namerequired:!0, parent:["checkbox", "menuitem"]}, menuitemradio:{namefrom:["contents", "author"], namerequired:!0, parent:["menuitemcheckbox", "radio"]}, navigation:{namefrom:["author"], 
parent:["landmark"]}, note:{namefrom:["author"], parent:["section"]}, option:{namefrom:["contents", "author"], namerequired:!0, parent:["input"], properties:["aria-checked", "aria-posinset", "aria-selected", "aria-setsize"]}, presentation:{parent:["structure"]}, progressbar:{childpresentational:!0, namefrom:["author"], namerequired:!0, parent:["range"]}, radio:{namefrom:["contents", "author"], namerequired:!0, parent:["checkbox", "option"]}, radiogroup:{mustcontain:["radio"], namefrom:["author"], 
namerequired:!0, parent:["select"], properties:["aria-required"]}, range:{"abstract":!0, namefrom:["author"], parent:["widget"], properties:["aria-valuemax", "aria-valuemin", "aria-valuenow", "aria-valuetext"]}, region:{namefrom:[" author"], parent:["section"]}, roletype:{"abstract":!0, properties:"aria-atomic aria-busy aria-controls aria-describedby aria-disabled aria-dropeffect aria-flowto aria-grabbed aria-haspopup aria-hidden aria-invalid aria-label aria-labelledby aria-live aria-owns aria-relevant".split(" ")}, 
row:{mustcontain:["columnheader", "gridcell", "rowheader"], namefrom:["contents", "author"], parent:["group", "widget"], properties:["aria-level", "aria-selected"]}, rowgroup:{mustcontain:["row"], namefrom:["contents", "author"], parent:["group"]}, rowheader:{namefrom:["contents", "author"], namerequired:!0, parent:["gridcell", "sectionhead", "widget"], properties:["aria-sort"]}, search:{namefrom:["author"], parent:["landmark"]}, section:{"abstract":!0, namefrom:["contents", "author"], parent:["structure"], 
properties:["aria-expanded"]}, sectionhead:{"abstract":!0, namefrom:["contents", "author"], parent:["structure"], properties:["aria-expanded"]}, select:{"abstract":!0, namefrom:["author"], parent:["composite", "group", "input"]}, separator:{childpresentational:!0, namefrom:["author"], parent:["structure"], properties:["aria-expanded", "aria-orientation"]}, scrollbar:{childpresentational:!0, namefrom:["author"], namerequired:!1, parent:["input", "range"], requiredProperties:["aria-controls", "aria-orientation", 
"aria-valuemax", "aria-valuemin", "aria-valuenow"], properties:["aria-controls", "aria-orientation", "aria-valuemax", "aria-valuemin", "aria-valuenow"]}, slider:{childpresentational:!0, namefrom:["author"], namerequired:!0, parent:["input", "range"], requiredProperties:["aria-valuemax", "aria-valuemin", "aria-valuenow"], properties:["aria-valuemax", "aria-valuemin", "aria-valuenow", "aria-orientation"]}, spinbutton:{namefrom:["author"], namerequired:!0, parent:["input", "range"], requiredProperties:["aria-valuemax", 
"aria-valuemin", "aria-valuenow"], properties:["aria-valuemax", "aria-valuemin", "aria-valuenow", "aria-required"]}, status:{parent:["region"]}, structure:{"abstract":!0, parent:["roletype"]}, tab:{namefrom:["contents", "author"], parent:["sectionhead", "widget"], properties:["aria-selected"]}, tablist:{mustcontain:["tab"], namefrom:["author"], parent:["composite", "directory"], properties:["aria-level"]}, tabpanel:{namefrom:["author"], namerequired:!0, parent:["region"]}, textbox:{namefrom:["author"], 
namerequired:!0, parent:["input"], properties:["aria-activedescendant", "aria-autocomplete", "aria-multiline", "aria-readonly", "aria-required"]}, timer:{namefrom:["author"], namerequired:!0, parent:["status"]}, toolbar:{namefrom:["author"], parent:["group"]}, tooltip:{namerequired:!0, parent:["section"]}, tree:{mustcontain:["group", "treeitem"], namefrom:["author"], namerequired:!0, parent:["select"], properties:["aria-multiselectable", "aria-required"]}, treegrid:{mustcontain:["row"], namefrom:["author"], 
namerequired:!0, parent:["grid", "tree"]}, treeitem:{namefrom:["contents", "author"], namerequired:!0, parent:["listitem", "option"]}, widget:{"abstract":!0, parent:["roletype"]}, window:{"abstract":!0, namefrom:[" author"], parent:["roletype"], properties:["aria-expanded"]}};
axs.constants.WIDGET_ROLES = {};
for(var roleName in axs.constants.ARIA_ROLES) {
  var role = axs.constants.ARIA_ROLES[roleName], addAllPropertiesToSet = function(a, c, b) {
    var d = a[c];
    if(d) {
      for(var e = 0;e < d.length;e++) {
        b[d[e]] = !0
      }
    }
    if(a.parent) {
      a = a.parent;
      for(d = 0;d < a.length;d++) {
        addAllPropertiesToSet(axs.constants.ARIA_ROLES[a[d]], c, b)
      }
    }
  }, propertiesSet = {};
  addAllPropertiesToSet(role, "properties", propertiesSet);
  role.propertiesSet = propertiesSet;
  var requiredPropertiesSet = {};
  addAllPropertiesToSet(role, "requiredProperties", requiredPropertiesSet);
  role.requiredPropertiesSet = requiredPropertiesSet;
  var addAllParentRolesToSet = function(a, c) {
    if(a.parent) {
      for(var b = a.parent, d = 0;d < b.length;d++) {
        var e = b[d];
        c[e] = !0;
        addAllParentRolesToSet(axs.constants.ARIA_ROLES[e], c)
      }
    }
  }, parentRolesSet = {};
  addAllParentRolesToSet(role, parentRolesSet);
  role.allParentRolesSet = parentRolesSet;
  "widget" in parentRolesSet && (axs.constants.WIDGET_ROLES[roleName] = role)
}
axs.constants.ARIA_PROPERTIES = {activedescendant:{type:"property", valueType:"idref"}, atomic:{type:"property", valueType:"true-false"}, autocomplete:{type:"property", valueType:"token", defaultValue:"none", values:["inline", "list", "both", "none"]}, busy:{type:"state", valueType:"true-false"}, checked:{type:"state", valueType:"tristate"}, controls:{type:"property", valueType:"idref_list"}, describedby:{type:"property", valueType:"idref_list"}, disabled:{type:"state", valueType:"true-false"}, dropeffect:{type:"property", 
valueType:"token_list", defaultValue:"none", values:"copy move link execute popup none".split(" ")}, expanded:{type:"state", valueType:"true-false-undefined"}, flowto:{type:"property", valueType:"idref_list"}, grabbed:{type:"state", valueType:"true-false-undefined"}, haspopup:{type:"property", valueType:"true-false"}, hidden:{type:"state", valueType:"true-false"}, invalid:{type:"state", valueType:"token", defaultValue:"false", values:["grammar", "false", "spelling", "true"]}, label:{type:"property", 
valueType:"string"}, labelledby:{type:"property", valueType:"idref_list"}, level:{type:"property", valueType:"integer"}, live:{type:"property", valueType:"token", defaultValue:"off", values:["off", "polite", "assertive"]}, multiline:{type:"property", valueType:"true-false"}, multiselectable:{type:"property", valueType:"true-false"}, orientation:{type:"property", valueType:"token", defaultValue:"horizontal", values:["vertical", "horizontal"]}, owns:{type:"property", valueType:"idref_list"}, posinset:{type:"property", 
valueType:"integer"}, pressed:{type:"state", valueType:"tristate"}, readonly:{type:"property", valueType:"true-false"}, relevant:{type:"property", valueType:"token_list", defaultValue:"additions", values:["additions", "removals", "text", "all", "additions"]}, required:{type:"property", valueType:"true-false"}, selected:{type:"state", valueType:"true-false-undefined"}, setsize:{type:"property", valueType:"integer"}, sort:{type:"property", valueType:"token", defaultValue:"none", values:["ascending", 
"descending", "none", "other"]}, valuemax:{type:"property", valueType:"number"}, valuemin:{type:"property", valueType:"number"}, valuenow:{type:"property", valueType:"number"}, valuetext:{type:"property", valueType:"string"}};
axs.constants.GLOBAL_PROPERTIES = "aria-atomic aria-busy aria-controls aria-describedby aria-disabled aria-dropeffect aria-flowto aria-grabbed aria-haspopup aria-hidden aria-invalid aria-label aria-labelledby aria-live aria-owns aria-relevant".split(" ");
axs.constants.NO_ROLE_NAME = " ";
axs.constants.WIDGET_ROLE_TO_NAME = {alert:"aria_role_alert", alertdialog:"aria_role_alertdialog", button:"aria_role_button", checkbox:"aria_role_checkbox", columnheader:"aria_role_columnheader", combobox:"aria_role_combobox", dialog:"aria_role_dialog", grid:"aria_role_grid", gridcell:"aria_role_gridcell", link:"aria_role_link", listbox:"aria_role_listbox", log:"aria_role_log", marquee:"aria_role_marquee", menu:"aria_role_menu", menubar:"aria_role_menubar", menuitem:"aria_role_menuitem", menuitemcheckbox:"aria_role_menuitemcheckbox", 
menuitemradio:"aria_role_menuitemradio", option:axs.constants.NO_ROLE_NAME, progressbar:"aria_role_progressbar", radio:"aria_role_radio", radiogroup:"aria_role_radiogroup", rowheader:"aria_role_rowheader", scrollbar:"aria_role_scrollbar", slider:"aria_role_slider", spinbutton:"aria_role_spinbutton", status:"aria_role_status", tab:"aria_role_tab", tabpanel:"aria_role_tabpanel", textbox:"aria_role_textbox", timer:"aria_role_timer", toolbar:"aria_role_toolbar", tooltip:"aria_role_tooltip", treeitem:"aria_role_treeitem"};
axs.constants.STRUCTURE_ROLE_TO_NAME = {article:"aria_role_article", application:"aria_role_application", banner:"aria_role_banner", columnheader:"aria_role_columnheader", complementary:"aria_role_complementary", contentinfo:"aria_role_contentinfo", definition:"aria_role_definition", directory:"aria_role_directory", document:"aria_role_document", form:"aria_role_form", group:"aria_role_group", heading:"aria_role_heading", img:"aria_role_img", list:"aria_role_list", listitem:"aria_role_listitem", 
main:"aria_role_main", math:"aria_role_math", navigation:"aria_role_navigation", note:"aria_role_note", region:"aria_role_region", rowheader:"aria_role_rowheader", search:"aria_role_search", separator:"aria_role_separator"};
axs.constants.ATTRIBUTE_VALUE_TO_STATUS = [{name:"aria-autocomplete", values:{inline:"aria_autocomplete_inline", list:"aria_autocomplete_list", both:"aria_autocomplete_both"}}, {name:"aria-checked", values:{"true":"aria_checked_true", "false":"aria_checked_false", mixed:"aria_checked_mixed"}}, {name:"aria-disabled", values:{"true":"aria_disabled_true"}}, {name:"aria-expanded", values:{"true":"aria_expanded_true", "false":"aria_expanded_false"}}, {name:"aria-invalid", values:{"true":"aria_invalid_true", 
grammar:"aria_invalid_grammar", spelling:"aria_invalid_spelling"}}, {name:"aria-multiline", values:{"true":"aria_multiline_true"}}, {name:"aria-multiselectable", values:{"true":"aria_multiselectable_true"}}, {name:"aria-pressed", values:{"true":"aria_pressed_true", "false":"aria_pressed_false", mixed:"aria_pressed_mixed"}}, {name:"aria-readonly", values:{"true":"aria_readonly_true"}}, {name:"aria-required", values:{"true":"aria_required_true"}}, {name:"aria-selected", values:{"true":"aria_selected_true", 
"false":"aria_selected_false"}}];
axs.constants.INPUT_TYPE_TO_INFORMATION_TABLE_MSG = {button:"input_type_button", checkbox:"input_type_checkbox", color:"input_type_color", datetime:"input_type_datetime", "datetime-local":"input_type_datetime_local", date:"input_type_date", email:"input_type_email", file:"input_type_file", image:"input_type_image", month:"input_type_month", number:"input_type_number", password:"input_type_password", radio:"input_type_radio", range:"input_type_range", reset:"input_type_reset", search:"input_type_search", 
submit:"input_type_submit", tel:"input_type_tel", text:"input_type_text", url:"input_type_url", week:"input_type_week"};
axs.constants.TAG_TO_INFORMATION_TABLE_VERBOSE_MSG = {A:"tag_link", BUTTON:"tag_button", H1:"tag_h1", H2:"tag_h2", H3:"tag_h3", H4:"tag_h4", H5:"tag_h5", H6:"tag_h6", LI:"tag_li", OL:"tag_ol", SELECT:"tag_select", TEXTAREA:"tag_textarea", UL:"tag_ul", SECTION:"tag_section", NAV:"tag_nav", ARTICLE:"tag_article", ASIDE:"tag_aside", HGROUP:"tag_hgroup", HEADER:"tag_header", FOOTER:"tag_footer", TIME:"tag_time", MARK:"tag_mark"};
axs.constants.TAG_TO_INFORMATION_TABLE_BRIEF_MSG = {BUTTON:"tag_button", SELECT:"tag_select", TEXTAREA:"tag_textarea"};
axs.constants.MIXED_VALUES = {"true":!0, "false":!0, mixed:!0};
for(var propertyName in axs.constants.ARIA_PROPERTIES) {
  var propertyDetails = axs.constants.ARIA_PROPERTIES[propertyName];
  if(propertyDetails.values) {
    for(var valuesSet = {}, i = 0;i < propertyDetails.values.length;i++) {
      valuesSet[propertyDetails.values[i]] = !0
    }
    propertyDetails.valuesSet = valuesSet
  }
}
axs.constants.Severity = {Info:"Info", Warning:"Warning", Severe:"Severe"};
axs.constants.AuditResult = {PASS:"PASS", FAIL:"FAIL", NA:"NA"};
axs.utils = {};
axs.utils.FOCUSABLE_ELEMENTS_SELECTOR = "input:not([type=hidden]):not([disabled]),select:not([disabled]),textarea:not([disabled]),button:not([disabled]),a[href],iframe,[tabindex]";
axs.utils.Color = function(a, c, b, d) {
  this.red = a;
  this.green = c;
  this.blue = b;
  this.alpha = d
};
axs.utils.calculateContrastRatio = function(a, c) {
  if(!a || !c) {
    return null
  }
  1 > a.alpha && (a = axs.utils.flattenColors(a, c));
  var b = axs.utils.calculateLuminance(a), d = axs.utils.calculateLuminance(c);
  return(Math.max(b, d) + 0.05) / (Math.min(b, d) + 0.05)
};
axs.utils.elementIsTransparent = function(a) {
  return"0" == a.style.opacity
};
axs.utils.elementHasZeroArea = function(a) {
  a = a.getBoundingClientRect();
  var c = a.top - a.bottom;
  return!(a.right - a.left) || !c ? !0 : !1
};
axs.utils.elementIsOutsideScrollArea = function(a) {
  a = a.getBoundingClientRect();
  var c = document.body.scrollWidth, b = document.body.scrollTop, d = document.body.scrollLeft;
  return a.top >= document.body.scrollHeight || a.bottom <= -b || a.left >= c || a.right <= -d ? !0 : !1
};
axs.utils.overlappingElement = function(a) {
  function c(a, b) {
    return null == b ? !1 : b === a ? !0 : c(a, b.parentNode)
  }
  if(axs.utils.elementHasZeroArea(a)) {
    return null
  }
  var b = a.getBoundingClientRect(), b = document.elementFromPoint((b.left + b.right) / 2, (b.top + b.bottom) / 2);
  return null != b && b != a && !c(b, a) ? b : null
};
axs.utils.elementIsHtmlControl = function(a) {
  return a instanceof HTMLButtonElement || a instanceof HTMLInputElement || a instanceof HTMLSelectElement || a instanceof HTMLTextAreaElement ? !0 : !1
};
axs.utils.elementIsAriaWidget = function(a) {
  if(a.hasAttribute("role") && (a = a.getAttribute("role"))) {
    if((a = axs.constants.ARIA_ROLES[a]) && "widget" in a.allParentRolesSet) {
      return!0
    }
  }
  return!1
};
axs.utils.elementIsVisible = function(a) {
  if(axs.utils.elementIsTransparent(a) || axs.utils.elementHasZeroArea(a) || axs.utils.elementIsOutsideScrollArea(a)) {
    return!1
  }
  if(a = axs.utils.overlappingElement(a)) {
    var c = window.getComputedStyle(a, null);
    if(c && (a = axs.utils.getBgColor(c, a)) && 0 < a.alpha) {
      return!1
    }
  }
  return!0
};
axs.utils.isLargeFont = function(a) {
  var c = a.fontSize;
  a = "bold" == a.fontWeight;
  var b = c.match(/(\d+)px/);
  if(b) {
    return c = parseInt(b[1], 10), a && 19.2 <= c || 24 <= c ? !0 : !1
  }
  if(b = c.match(/(\d+)em/)) {
    return c = parseInt(b[1], 10), a && 1.2 <= c || 1.5 <= c ? !0 : !1
  }
  if(b = c.match(/(\d+)%/)) {
    return c = parseInt(b[1], 10), a && 120 <= c || 150 <= c ? !0 : !1
  }
  if(b = c.match(/(\d+)pt/)) {
    if(c = parseInt(b[1], 10), a && 14 <= c || 14 <= c) {
      return!0
    }
  }
  return!1
};
axs.utils.getBgColor = function(a, c) {
  var b = axs.utils.parseColor(a.backgroundColor);
  if(!b || a.backgroundImage && "none" != a.backgroundImage) {
    return null
  }
  if(1 > b.alpha) {
    var d = c, e = [];
    e.push(b);
    for(b = null;d = d.parentElement;) {
      var f = window.getComputedStyle(d, null);
      if(f) {
        if(f.backgroundImage && "none" != f.backgroundImage) {
          return null
        }
        if((f = axs.utils.parseColor(f.backgroundColor)) && 0 != f.alpha) {
          if(e.push(f), 1 == f.alpha) {
            b = null;
            break
          }
        }
      }
    }
    b || e.push(new axs.utils.Color(255, 255, 255, 1));
    for(d = e.pop();e.length;) {
      b = e.pop(), d = axs.utils.flattenColors(b, d)
    }
    b = d
  }
  return b
};
axs.utils.getFgColor = function(a, c) {
  var b = axs.utils.parseColor(a.color);
  if(!b) {
    return null
  }
  1 > b.alpha && (b = axs.utils.flattenColors(b, c));
  return b
};
axs.utils.parseColor = function(a) {
  var c = a.match(/^rgb\((\d+), (\d+), (\d+)\)$/);
  if(c) {
    a = parseInt(c[1], 10);
    var b = parseInt(c[2], 10), c = parseInt(c[3], 10), d;
    return new axs.utils.Color(a, b, c, 1)
  }
  return(c = a.match(/^rgba\((\d+), (\d+), (\d+), (\d+(\.\d+)?)\)/)) ? (d = parseInt(c[4], 10), a = parseInt(c[1], 10), b = parseInt(c[2], 10), c = parseInt(c[3], 10), new axs.utils.Color(a, b, c, d)) : null
};
axs.utils.colorToString = function(a) {
  return"rgba(" + [a.red, a.green, a.blue, a.alpha].join() + ")"
};
axs.utils.flattenColors = function(a, c) {
  var b = a.alpha;
  return new axs.utils.Color((1 - b) * c.red + b * a.red, (1 - b) * c.green + b * a.green, (1 - b) * c.blue + b * a.blue, 1)
};
axs.utils.calculateLuminance = function(a) {
  var c = a.red / 255, b = a.green / 255;
  a = a.blue / 255;
  c = 0.03928 >= c ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  b = 0.03928 >= b ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  a = 0.03928 >= a ? a / 12.92 : Math.pow((a + 0.055) / 1.055, 2.4);
  return 0.2126 * c + 0.7152 * b + 0.0722 * a
};
axs.utils.getContrastRatioForElement = function(a) {
  var c = window.getComputedStyle(a, null);
  return axs.utils.getContrastRatioForElementWithComputedStyle(c, a)
};
axs.utils.getContrastRatioForElementWithComputedStyle = function(a, c) {
  if(!axs.utils.elementIsVisible(c)) {
    return null
  }
  var b = axs.utils.getBgColor(a, c);
  if(!b) {
    return null
  }
  var d = axs.utils.getFgColor(a, b);
  return!d ? null : axs.utils.calculateContrastRatio(d, b)
};
axs.utils.isNativeTextElement = function(a) {
  var c = a.tagName.toLowerCase();
  a = a.type ? a.type.toLowerCase() : "";
  if("textarea" == c) {
    return!0
  }
  if("input" != c) {
    return!1
  }
  switch(a) {
    case "email":
    ;
    case "number":
    ;
    case "password":
    ;
    case "search":
    ;
    case "text":
    ;
    case "tel":
    ;
    case "url":
    ;
    case "":
      return!0;
    default:
      return!1
  }
};
axs.utils.isLowContrast = function(a, c) {
  return 3 > a || !axs.utils.isLargeFont(c) && 4.5 > a
};
axs.utils.hasLabel = function(a) {
  var c = a.tagName.toLowerCase(), b = a.type ? a.type.toLowerCase() : "";
  if(a.hasAttribute("aria-label") || a.hasAttribute("title") || "img" == c && a.hasAttribute("alt") || "input" == c && "image" == b && a.hasAttribute("alt") || "input" == c && ("submit" == b || "reset" == b) || a.hasAttribute("aria-labelledby") || axs.utils.isNativeTextElement(a) && a.hasAttribute("placeholder") || a.hasAttribute("id") && 0 < document.querySelectorAll("label[for=" + a.id + "]").length) {
    return!0
  }
  for(c = a.parentElement;c;) {
    if("label" == c.tagName.toLowerCase() && c.control == a) {
      return!0
    }
    c = c.parentElement
  }
  return!1
};
axs.utils.isElementHidden = function(a) {
  if(!(a instanceof HTMLElement)) {
    return!1
  }
  if(a.hasAttribute("chromevoxignoreariahidden")) {
    var c = !0
  }
  var b = window.getComputedStyle(a, null);
  return"none" == b.display || "hidden" == b.visibility ? !0 : a.hasAttribute("aria-hidden") && "true" == a.getAttribute("aria-hidden").toLowerCase() ? !c : !1
};
axs.utils.isElementOrAncestorHidden = function(a) {
  return axs.utils.isElementHidden(a) ? !0 : a.parentElement ? axs.utils.isElementOrAncestorHidden(a.parentElement) : !1
};
axs.utils.getRole = function(a) {
  if(!a.hasAttribute("role")) {
    return!1
  }
  a = a.getAttribute("role");
  return axs.constants.ARIA_ROLES[a] ? {name:a, details:axs.constants.ARIA_ROLES[a], valid:!0} : {name:a, valid:!1}
};
axs.utils.getAriaPropertyValue = function(a, c, b) {
  var d = a.replace(/^aria-/, ""), e = axs.constants.ARIA_PROPERTIES[d], d = {name:a, rawValue:c};
  if(!e) {
    return d.valid = !1, d.reason = '"' + a + '" is not a valid ARIA property', d
  }
  e = e.valueType;
  if(!e) {
    return d.valid = !1, d.reason = '"' + a + '" is not a valid ARIA property', d
  }
  switch(e) {
    case "idref":
      a = axs.utils.isValidIDRefValue(c, b), d.valid = a.valid, d.reason = a.reason, d.idref = a.idref;
    case "idref_list":
      a = c.split(/\s+/);
      d.valid = !0;
      for(c = 0;c < a.length;c++) {
        e = axs.utils.isValidIDRefValue(a[c], b), e.valid || (d.valid = !1), d.values ? d.values.push(e) : d.values = [e]
      }
      return d;
    case "integer":
      b = axs.utils.isValidNumber(c);
      if(!b.valid) {
        return d.valid = !1, d.reason = b.reason, d
      }
      Math.floor(b.value) != b.value ? (d.valid = !1, d.reason = "" + c + " is not a whole integer") : (d.valid = !0, d.value = b.value);
      return d;
    case "number":
      b = axs.utils.isValidNumber(c), b.valid && (d.valid = !0, d.value = b.value);
    case "string":
      return d.valid = !0, d.value = c, d;
    case "token":
      return b = axs.utils.isValidTokenValue(a, c.toLowerCase()), b.valid ? (d.valid = !0, d.value = b.value) : (d.valid = !1, d.value = c, d.reason = b.reason), d;
    case "token_list":
      e = c.split(/\s+/);
      d.valid = !0;
      for(c = 0;c < e.length;c++) {
        b = axs.utils.isValidTokenValue(a, e[c].toLowerCase()), b.valid || (d.valid = !1, d.reason ? (d.reason = [d.reason], d.reason.push(b.reason)) : (d.reason = b.reason, d.possibleValues = b.possibleValues)), d.values ? d.values.push(b.value) : d.values = [b.value]
      }
      return d;
    case "tristate":
      return b = axs.utils.isPossibleValue(c.toLowerCase(), axs.constants.MIXED_VALUES, a), b.valid ? (d.valid = !0, d.value = b.value) : (d.valid = !1, d.value = c, d.reason = b.reason), d;
    case "true-false":
      return b = axs.utils.isValidBoolean(c), b.valid ? (d.valid = !0, d.value = b.value) : (d.valid = !1, d.value = c, d.reason = b.reason), d;
    case "true-false-undefined":
      return b = axs.utils.isValidBoolean(c), b.valid ? (d.valid = !0, d.value = b.value) : (d.valid = !1, d.value = c, d.reason = b.reason), d
  }
  d.valid = !1;
  d.reason = "Not a valid ARIA property";
  return d
};
axs.utils.isValidTokenValue = function(a, c) {
  var b = a.replace(/^aria-/, "");
  return axs.utils.isPossibleValue(c, axs.constants.ARIA_PROPERTIES[b].valuesSet, a)
};
axs.utils.isPossibleValue = function(a, c, b) {
  return!c[a] ? {valid:!1, value:a, reason:'"' + a + '" is not a valid value for ' + b, possibleValues:Object.keys(c)} : {valid:!0, value:a}
};
axs.utils.isValidBoolean = function(a) {
  try {
    var c = JSON.parse(a)
  }catch(b) {
    c = ""
  }
  return"boolean" != typeof c ? {valid:!1, value:a, reason:'"' + a + '" is not a true/false value'} : {valid:!0, value:c}
};
axs.utils.isValidIDRefValue = function(a, c) {
  return!c.ownerDocument.getElementById(a) ? {valid:!1, idref:a, reason:'No element with ID "' + a + '"'} : {valid:!0, idref:a}
};
axs.utils.isValidNumber = function(a) {
  var c = JSON.parse(a);
  return"number" != typeof c ? {valid:!1, value:a, reason:'"' + a + '" is not a number'} : {valid:!0, value:c}
};
axs.utils.isElementImplicitlyFocusable = function(a) {
  return a instanceof HTMLAnchorElement || a instanceof HTMLAreaElement ? a.hasAttribute("href") : a instanceof HTMLInputElement || a instanceof HTMLSelectElement || a instanceof HTMLTextAreaElement || a instanceof HTMLButtonElement || a instanceof HTMLIFrameElement ? !a.disabled : !1
};
axs.utils.values = function(a) {
  var c = [], b;
  for(b in a) {
    a.hasOwnProperty(b) && "function" != typeof a[b] && c.push(a[b])
  }
  return c
};
axs.utils.namedValues = function(a) {
  var c = {}, b;
  for(b in a) {
    a.hasOwnProperty(b) && "function" != typeof a[b] && (c[b] = a[b])
  }
  return c
};
axs.utils.getQuerySelectorText = function(a) {
  if(null == a || "HTML" == a.tagName) {
    return"html"
  }
  if("BODY" == a.tagName) {
    return"body"
  }
  if(a.hasAttribute) {
    if(a.id) {
      return"#" + a.id
    }
    if(a.className) {
      for(var c = "", b = 0;b < a.classList.length;b++) {
        c += "." + a.classList[b]
      }
      var d = 0;
      if(a.parentNode) {
        for(b = 0;b < a.parentNode.children.length;b++) {
          var e = a.parentNode.children[b];
          e.webkitMatchesSelector(c) && d++;
          if(e === a) {
            break
          }
        }
      }else {
        d = 1
      }
      return 1 == d ? axs.utils.getQuerySelectorText(a.parentNode) + " > " + c : axs.utils.getQuerySelectorText(a.parentNode) + " > " + c + ":nth-of-type(" + d + ")"
    }
    if(a.parentNode) {
      c = a.parentNode.children;
      d = 1;
      for(b = 0;c[b] !== a;) {
        c[b].tagName == a.tagName && d++, b++
      }
      b = "";
      "BODY" != a.parentNode.tagName && (b = axs.utils.getQuerySelectorText(a.parentNode) + " > ");
      return 1 == d ? b + a.tagName : b + a.tagName + ":nth-of-type(" + d + ")"
    }
  }else {
    if(a.selectorText) {
      return a.selectorText
    }
  }
  return""
};
axs.AuditRule = function(a) {
  for(var c = !0, b = [], d = 0;d < axs.AuditRule.requiredFields.length;d++) {
    var e = axs.AuditRule.requiredFields[d];
    e in a || (c = !1, b.push(e))
  }
  if(!c) {
    throw"Invalid spec; the following fields were not specified: " + b.join(", ") + "\n" + JSON.stringify(a);
  }
  this.name = a.name;
  this.severity = a.severity;
  this.relevantNodesSelector_ = a.relevantNodesSelector;
  this.test_ = a.test;
  this.code = a.code;
  this.requiresConsoleAPI = !!a.opt_requiresConsoleAPI
};
axs.AuditRule.requiredFields = ["name", "severity", "relevantNodesSelector", "test", "code"];
axs.AuditRule.NOT_APPLICABLE = {result:axs.constants.AuditResult.NA};
axs.AuditRule.prototype.addNode = function(a, c) {
  a.push(c)
};
axs.AuditRule.prototype.run = function(a, c) {
  function b(a) {
    for(var b = 0;b < d.length;b++) {
      if(a.webkitMatchesSelector(d[b])) {
        return!0
      }
    }
    return!1
  }
  var d = a || [], e = this.relevantNodesSelector_(c || document), f = [];
  if(e instanceof XPathResult) {
    if(e.resultType == XPathResult.ORDERED_NODE_SNAPSHOT_TYPE) {
      if(!e.snapshotLength) {
        return axs.AuditRule.NOT_APPLICABLE
      }
      for(var g = 0;g < e.snapshotLength;g++) {
        var h = e.snapshotItem(g);
        this.test_(h) && !b(h) && this.addNode(f, h)
      }
    }else {
      return console.warn("Unknown XPath result type", e), null
    }
  }else {
    if(!e.length) {
      return{result:axs.constants.AuditResult.NA}
    }
    for(g = 0;g < e.length;g++) {
      h = e[g], this.test_(h) && !b(h) && this.addNode(f, h)
    }
  }
  return{result:f.length ? axs.constants.AuditResult.FAIL : axs.constants.AuditResult.PASS, elements:f}
};
axs.AuditRule.specs = {};
axs.AuditRules = {};
axs.AuditRules.getRule = function(a) {
  if(!axs.AuditRules.rules) {
    axs.AuditRules.rules = {};
    for(var c in axs.AuditRule.specs) {
      var b = axs.AuditRule.specs[c], d = new axs.AuditRule(b);
      axs.AuditRules.rules[b.name] = d
    }
  }
  return axs.AuditRules.rules[a]
};
axs.Audit = {};
axs.AuditConfiguration = function() {
  this.rules_ = {};
  this.scope = null;
  this.withConsoleApi = !1
};
axs.AuditConfiguration.prototype = {ignoreSelectors:function(a, c) {
  a in this.rules_ || (this.rules_[a] = {});
  "ignore" in this.rules_[a] || (this.rules_[a].ignore = []);
  Array.prototype.push.call(this.rules_[a].ignore, c)
}, getIgnoreSelectors:function(a) {
  return a in this.rules_ && "ignore" in this.rules_[a] ? this.rules_[a].ignore : []
}};
axs.Audit.run = function(a) {
  a = a || new axs.AuditConfiguration;
  var c = a.withConsoleApi, b = [], d;
  for(d in axs.AuditRule.specs) {
    var e = axs.AuditRules.getRule(d);
    if(e && !e.disabled && (c || !e.requiresConsoleAPI)) {
      var f = [], g = a.getIgnoreSelectors(e.name);
      (0 < g.length || a.scope) && f.push(g);
      a.scope && f.push(a.scope);
      f = e.run.apply(e, f);
      f.rule = axs.utils.namedValues(e);
      b.push(f)
    }
  }
  return b
};
axs.Audit.createReport = function(a, c) {
  var b;
  b = "*** Begin accessibility audit results ***\nAn accessibility audit found ";
  for(var d = 0, e = "", f = 0, g = "", h = 0;h < a.length;h++) {
    var j = a[h];
    j.result == axs.constants.AuditResult.FAIL && (j.rule.severity == axs.constants.Severity.Severe ? (f++, g += "\n\n" + axs.Audit.accessibilityErrorMessage(j)) : (d++, e += "\n\n" + axs.Audit.accessibilityErrorMessage(j)))
  }
  0 < f && (b += f + (1 == f ? " error " : " errors "), 0 < d && (b += "and "));
  0 < d && (b += d + (1 == d ? " warning " : " warnings "));
  b = b + "on this page.\n" + ("For more information, please see " + (void 0 != c ? c : "https://code.google.com/p/accessibility-developer-tools/wiki/AuditRules"));
  b += g;
  b += e;
  return b += "\n*** End accessibility audit results ***"
};
axs.Audit.accessibilityErrorMessage = function(a) {
  for(var c = a.rule.severity == axs.constants.Severity.Severe ? "Error: " : "Warning: ", c = c + (a.rule.name + " (" + a.rule.code + ") failed on the following " + (1 == a.elements.length ? "element" : "elements")), c = 1 == a.elements.length ? c + ":" : c + (" (1 - " + Math.min(5, a.elements.length) + " of " + a.elements.length + "):"), b = Math.min(a.elements.length, 5), d = 0;d < b;d++) {
    c += "\n" + axs.utils.getQuerySelectorText(a.elements[d])
  }
  return c
};
axs.AuditRule.specs.badAriaAttributeValue = {name:"badAriaAttributeValue", severity:axs.constants.Severity.Severe, relevantNodesSelector:function(a) {
  var c = "", b;
  for(b in axs.constants.ARIA_PROPERTIES) {
    c += "[aria-" + b + "],"
  }
  c = c.substring(0, c.length - 1);
  return a.querySelectorAll(c)
}, test:function(a) {
  for(var c in axs.constants.ARIA_PROPERTIES) {
    var b = "aria-" + c;
    if(a.hasAttribute(b)) {
      var d = a.getAttribute(b);
      if(!axs.utils.getAriaPropertyValue(b, d, a).valid) {
        return!0
      }
    }
  }
  return!1
}, code:"AX_ARIA_04"};
axs.AuditRule.specs.badAriaRole = {name:"badAriaRole", severity:axs.constants.Severity.Severe, relevantNodesSelector:function(a) {
  return a.querySelectorAll("[role]")
}, test:function(a) {
  return!axs.utils.getRole(a).valid
}, code:"AX_ARIA_01"};
axs.AuditRule.specs.controlsWithoutLabel = {name:"controlsWithoutLabel", severity:axs.constants.Severity.Severe, relevantNodesSelector:function(a) {
  return a.querySelectorAll('input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), video:not([disabled])')
}, test:function(a) {
  return axs.utils.isElementOrAncestorHidden(a) || "button" == a.tagName.toLowerCase() && a.innerText.replace(/^\s+|\s+$/g, "").length ? !1 : !axs.utils.hasLabel(a) ? !0 : !1
}, code:"AX_TEXT_01", ruleName:"Controls and media elements should have labels"};
axs.AuditRule.specs.focusableElementNotVisibleAndNotAriaHidden = {name:"focusableElementNotVisibleAndNotAriaHidden", severity:axs.constants.Severity.Warning, relevantNodesSelector:function(a) {
  return a.querySelectorAll(axs.utils.FOCUSABLE_ELEMENTS_SELECTOR)
}, test:function(a) {
  return axs.utils.isElementOrAncestorHidden(a) ? !1 : !axs.utils.elementIsVisible(a)
}, code:"AX_FOCUS_01"};
axs.AuditRule.specs.imagesWithoutAltText = {name:"imagesWithoutAltText", severity:axs.constants.Severity.Warning, relevantNodesSelector:function(a) {
  a = a.querySelectorAll("img");
  for(var c = [], b = 0;b < a.length;b++) {
    var d = a[b];
    axs.utils.isElementOrAncestorHidden(d) || c.push(d)
  }
  return c
}, test:function(a) {
  return!a.hasAttribute("alt") && "presentation" != a.getAttribute("role")
}, code:"AX_TEXT_02"};
axs.AuditRule.specs.lowContrastElements = {name:"lowContrastElements", severity:axs.constants.Severity.Warning, relevantNodesSelector:function(a) {
  return document.evaluate('/html/body//text()[normalize-space(.)!=""]/parent::*[name()!="script"]', a, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
}, test:function(a) {
  var c = window.getComputedStyle(a, null);
  return(a = axs.utils.getContrastRatioForElementWithComputedStyle(c, a)) && axs.utils.isLowContrast(a, c)
}, code:"AX_COLOR_01"};
axs.AuditRule.specs.nonExistentAriaLabelledbyElement = {name:"nonExistentAriaLabelledbyElement", severity:axs.constants.Severity.Warning, relevantNodesSelector:function(a) {
  return a.querySelectorAll("[aria-labelledby]")
}, test:function(a) {
  a = a.getAttribute("aria-labelledby").split(/\s+/);
  for(var c = 0;c < a.length;c++) {
    if(!document.getElementById(a[c])) {
      return!0
    }
  }
  return!1
}, code:"AX_ARIA_02"};
axs.AuditRule.specs.requiredAriaAttributeMissing = {name:"requiredAriaAttributeMissing", severity:axs.constants.Severity.Severe, relevantNodesSelector:function(a) {
  return a.querySelectorAll("[role]")
}, test:function(a) {
  var c = axs.utils.getRole(a);
  if(!c.valid) {
    return!1
  }
  var c = c.details.requiredPropertiesSet, b;
  for(b in c) {
    if(!a.hasAttribute(b)) {
      return!0
    }
  }
}, code:"AX_ARIA_03"};
axs.AuditRule.specs.unfocusableElementsWithOnClick = {name:"unfocusableElementsWithOnClick", severity:axs.constants.Severity.Warning, opt_requiresConsoleAPI:!0, relevantNodesSelector:function(a) {
  a = a.querySelectorAll("*");
  for(var c = [], b = 0;b < a.length;b++) {
    var d = a[b];
    d instanceof HTMLBodyElement || axs.utils.isElementOrAncestorHidden(d) || "click" in getEventListeners(d) && c.push(d)
  }
  return c
}, test:function(a) {
  return!a.hasAttribute("tabindex") && !axs.utils.isElementImplicitlyFocusable(a)
}, code:"AX_FOCUS_02"};
axs.AuditRule.specs.videoWithoutCaptions = {name:"videoWithoutCaptions", severity:axs.constants.Severity.Warning, relevantNodesSelector:function(a) {
  return a.querySelectorAll("video")
}, test:function(a) {
  return!a.querySelectorAll("track[kind=captions]").length
}, code:"AX_VIDEO_01"};

