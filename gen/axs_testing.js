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
  var role = axs.constants.ARIA_ROLES[roleName], addAllPropertiesToSet = function(a, b, c) {
    var d = a[b];
    if(d) {
      for(var e = 0;e < d.length;e++) {
        c[d[e]] = !0
      }
    }
    if(a.parent) {
      a = a.parent;
      for(d = 0;d < a.length;d++) {
        addAllPropertiesToSet(axs.constants.ARIA_ROLES[a[d]], b, c)
      }
    }
  }, propertiesSet = {};
  addAllPropertiesToSet(role, "properties", propertiesSet);
  role.propertiesSet = propertiesSet;
  var requiredPropertiesSet = {};
  addAllPropertiesToSet(role, "requiredProperties", requiredPropertiesSet);
  role.requiredPropertiesSet = requiredPropertiesSet;
  var addAllParentRolesToSet = function(a, b) {
    if(a.parent) {
      for(var c = a.parent, d = 0;d < c.length;d++) {
        var e = c[d];
        b[e] = !0;
        addAllParentRolesToSet(axs.constants.ARIA_ROLES[e], b)
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
axs.utils.Color = function(a, b, c, d) {
  this.red = a;
  this.green = b;
  this.blue = c;
  this.alpha = d
};
axs.utils.calculateContrastRatio = function(a, b) {
  if(!a || !b) {
    return null
  }
  1 > a.alpha && (a = axs.utils.flattenColors(a, b));
  var c = axs.utils.calculateLuminance(a), d = axs.utils.calculateLuminance(b);
  return(Math.max(c, d) + 0.05) / (Math.min(c, d) + 0.05)
};
axs.utils.elementIsTransparent = function(a) {
  return"0" == a.style.opacity
};
axs.utils.elementHasZeroArea = function(a) {
  var a = a.getBoundingClientRect(), b = a.top - a.bottom;
  return!(a.right - a.left) || !b ? !0 : !1
};
axs.utils.elementIsOutsideScrollArea = function(a) {
  var a = a.getBoundingClientRect(), b = document.body.scrollWidth, c = document.body.scrollTop, d = document.body.scrollLeft;
  return a.top >= document.body.scrollHeight || a.bottom <= -c || a.left >= b || a.right <= -d ? !0 : !1
};
axs.utils.overlappingElement = function(a) {
  function b(a, c) {
    return null == c ? !1 : c === a ? !0 : b(a, c.parentNode)
  }
  if(axs.utils.elementHasZeroArea(a)) {
    return null
  }
  var c = a.getBoundingClientRect(), c = document.elementFromPoint((c.left + c.right) / 2, (c.top + c.bottom) / 2);
  return null != c && c != a && !b(c, a) ? c : null
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
    var b = window.getComputedStyle(a, null);
    if(b && (a = axs.utils.getBgColor(b, a)) && 0 < a.alpha) {
      return!1
    }
  }
  return!0
};
axs.utils.isLargeFont = function(a) {
  var b = a.fontSize, a = "bold" == a.fontWeight, c = b.match(/(\d+)px/);
  if(c) {
    return b = parseInt(c[1], 10), a && 19.2 <= b || 24 <= b ? !0 : !1
  }
  if(c = b.match(/(\d+)em/)) {
    return b = parseInt(c[1], 10), a && 1.2 <= b || 1.5 <= b ? !0 : !1
  }
  if(c = b.match(/(\d+)%/)) {
    return b = parseInt(c[1], 10), a && 120 <= b || 150 <= b ? !0 : !1
  }
  if(c = b.match(/(\d+)pt/)) {
    if(b = parseInt(c[1], 10), a && 14 <= b || 14 <= b) {
      return!0
    }
  }
  return!1
};
axs.utils.getBgColor = function(a, b) {
  var c = axs.utils.parseColor(a.backgroundColor);
  if(!c || a.backgroundImage && "none" != a.backgroundImage) {
    return null
  }
  if(1 > c.alpha) {
    var d = b, e = [];
    e.push(c);
    for(c = null;d = d.parentElement;) {
      var f = window.getComputedStyle(d, null);
      if(f) {
        if(f.backgroundImage && "none" != f.backgroundImage) {
          return null
        }
        if((f = axs.utils.parseColor(f.backgroundColor)) && 0 != f.alpha) {
          if(e.push(f), 1 == f.alpha) {
            c = null;
            break
          }
        }
      }
    }
    c || e.push(new axs.utils.Color(255, 255, 255, 1));
    for(d = e.pop();e.length;) {
      c = e.pop(), d = axs.utils.flattenColors(c, d)
    }
    c = d
  }
  return c
};
axs.utils.getFgColor = function(a, b) {
  var c = axs.utils.parseColor(a.color);
  if(!c) {
    return null
  }
  1 > c.alpha && (c = axs.utils.flattenColors(c, b));
  return c
};
axs.utils.parseColor = function(a) {
  var b = a.match(/^rgb\((\d+), (\d+), (\d+)\)$/);
  if(b) {
    var a = parseInt(b[1], 10), c = parseInt(b[2], 10), b = parseInt(b[3], 10), d;
    return new axs.utils.Color(a, c, b, 1)
  }
  return(b = a.match(/^rgba\((\d+), (\d+), (\d+), (\d+(\.\d+)?)\)/)) ? (d = parseInt(b[4], 10), a = parseInt(b[1], 10), c = parseInt(b[2], 10), b = parseInt(b[3], 10), new axs.utils.Color(a, c, b, d)) : null
};
axs.utils.colorToString = function(a) {
  return"rgba(" + [a.red, a.green, a.blue, a.alpha].join() + ")"
};
axs.utils.flattenColors = function(a, b) {
  var c = a.alpha;
  return new axs.utils.Color((1 - c) * b.red + c * a.red, (1 - c) * b.green + c * a.green, (1 - c) * b.blue + c * a.blue, 1)
};
axs.utils.calculateLuminance = function(a) {
  var b = a.red / 255, c = a.green / 255, a = a.blue / 255, b = 0.03928 >= b ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4), c = 0.03928 >= c ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4), a = 0.03928 >= a ? a / 12.92 : Math.pow((a + 0.055) / 1.055, 2.4);
  return 0.2126 * b + 0.7152 * c + 0.0722 * a
};
axs.utils.getContrastRatioForElement = function(a) {
  var b = window.getComputedStyle(a, null);
  return axs.utils.getContrastRatioForElementWithComputedStyle(b, a)
};
axs.utils.getContrastRatioForElementWithComputedStyle = function(a, b) {
  if(!axs.utils.elementIsVisible(b)) {
    return null
  }
  var c = axs.utils.getBgColor(a, b);
  if(!c) {
    return null
  }
  var d = axs.utils.getFgColor(a, c);
  return!d ? null : axs.utils.calculateContrastRatio(d, c)
};
axs.utils.isNativeTextElement = function(a) {
  var b = a.tagName.toLowerCase(), a = a.type ? a.type.toLowerCase() : "";
  if("textarea" == b) {
    return!0
  }
  if("input" != b) {
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
axs.utils.isLowContrast = function(a, b) {
  return 3 > a || !axs.utils.isLargeFont(b) && 4.5 > a
};
axs.utils.hasLabel = function(a) {
  var b = a.tagName.toLowerCase(), c = a.type ? a.type.toLowerCase() : "";
  if(a.hasAttribute("aria-label") || a.hasAttribute("title") || "img" == b && a.hasAttribute("alt") || "input" == b && "image" == c && a.hasAttribute("alt") || "input" == b && ("submit" == c || "reset" == c) || a.hasAttribute("aria-labelledby") || axs.utils.isNativeTextElement(a) && a.hasAttribute("placeholder") || a.hasAttribute("id") && 0 < document.querySelectorAll("label[for=" + a.id + "]").length) {
    return!0
  }
  for(b = a.parentElement;b;) {
    if("label" == b.tagName.toLowerCase() && b.control == a) {
      return!0
    }
    b = b.parentElement
  }
  return!1
};
axs.utils.isElementHidden = function(a) {
  if(!(a instanceof HTMLElement)) {
    return!1
  }
  var b = window.getComputedStyle(a, null);
  return"none" == b.display || "hidden" == b.visibility || a.hasAttribute("aria-hidden") && "true" == a.getAttribute("aria-hidden").toLowerCase() ? !0 : !1
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
axs.utils.getAriaPropertyValue = function(a, b, c) {
  var d = a.replace(/^aria-/, ""), e = axs.constants.ARIA_PROPERTIES[d], d = {name:a, rawValue:b};
  if(!e) {
    return d.valid = !1, d.reason = '"' + a + '" is not a valid ARIA property', d
  }
  e = e.valueType;
  if(!e) {
    return d.valid = !1, d.reason = '"' + a + '" is not a valid ARIA property', d
  }
  switch(e) {
    case "idref":
      return axs.utils.isValidIDRefValue(b, c);
    case "idref_list":
      a = b.split(/\s+/);
      d.valid = !0;
      for(b = 0;b < a.length;b++) {
        e = axs.utils.isValidIDRefValue(a[b], c), e.valid || (d.valid = !1), d.values ? d.values.push(e) : d.values = [e]
      }
      return d;
    case "integer":
      a = axs.utils.isValidNumber(b);
      if(!a.valid) {
        return d.valid = !1, d.reason = a.reason, d
      }
      Math.floor(a.value) != a.value ? (d.valid = !1, d.reason = "" + b + " is not a whole integer") : (d.valid = !0, d.value = a.value);
      return d;
    case "number":
      a = axs.utils.isValidNumber(b), a.valid && (d.valid = !0, d.value = a.value);
    case "string":
      return d.valid = !0, d.value = b, d;
    case "token":
      return c = axs.utils.isValidTokenValue(a, b.toLowerCase()), c.valid ? (d.valid = !0, d.value = c.value) : (d.valid = !1, d.value = b, d.reason = c.reason), d;
    case "token_list":
      e = b.split(/\s+/);
      d.valid = !0;
      for(b = 0;b < e.length;b++) {
        c = axs.utils.isValidTokenValue(a, e[b].toLowerCase()), c.valid || (d.valid = !1, d.reason ? (d.reason = [d.reason], d.reason.push(c.reason)) : (d.reason = c.reason, d.possibleValues = c.possibleValues)), d.values ? d.values.push(c.value) : d.values = [c.value]
      }
      return d;
    case "tristate":
      return a = axs.utils.isPossibleValue(b.toLowerCase(), axs.constants.MIXED_VALUES, a), a.valid ? (d.valid = !0, d.value = a.value) : (d.valid = !1, d.value = b, d.reason = a.reason), d;
    case "true-false":
      return a = axs.utils.isValidBoolean(b), a.valid ? (d.valid = !0, d.value = a.value) : (d.valid = !1, d.value = b, d.reason = a.reason), d;
    case "true-false-undefined":
      return a = axs.utils.isValidBoolean(b), a.valid ? (d.valid = !0, d.value = a.value) : (d.valid = !1, d.value = b, d.reason = a.reason), d
  }
  d.valid = !1;
  d.reason = "Not a valid ARIA property";
  return d
};
axs.utils.isValidTokenValue = function(a, b) {
  var c = a.replace(/^aria-/, ""), c = axs.constants.ARIA_PROPERTIES[c], d = c.valuesSet;
  console.log("isValidTokenValue", a, b, c, d);
  return axs.utils.isPossibleValue(b, d, a)
};
axs.utils.isPossibleValue = function(a, b, c) {
  return!b[a] ? {valid:!1, value:a, reason:'"' + a + '" is not a valid value for ' + c, possibleValues:Object.keys(b)} : {valid:!0, value:a}
};
axs.utils.isValidBoolean = function(a) {
  console.log("isValidBoolean", a);
  try {
    var b = JSON.parse(a)
  }catch(c) {
    b = ""
  }
  console.log("isValidBoolean", a, b);
  return"boolean" != typeof b ? {valid:!1, value:a, reason:'"' + a + '" is not a true/false value'} : {valid:!0, value:b}
};
axs.utils.isValidIDRefValue = function(a, b) {
  return!b.ownerDocument.getElementById(a) ? {valid:!1, idref:a, reason:'No element with ID "' + a + '"'} : {valid:!0, idref:a}
};
axs.utils.isValidNumber = function(a) {
  var b = JSON.parse(a);
  return"number" != typeof b ? {valid:!1, value:a, reason:'"' + a + '" is not a number'} : {valid:!0, value:b}
};
axs.utils.isElementImplicitlyFocusable = function(a) {
  return a instanceof HTMLAnchorElement || a instanceof HTMLAreaElement ? a.hasAttribute("href") : a instanceof HTMLInputElement || a instanceof HTMLSelectElement || a instanceof HTMLTextAreaElement || a instanceof HTMLButtonElement || a instanceof HTMLIFrameElement ? !a.disabled : !1
};
axs.utils.values = function(a) {
  console.log("axs.utils.values", a);
  var b = [], c;
  for(c in a) {
    a.hasOwnProperty(c) && "function" != typeof a[c] && b.push(a[c])
  }
  console.log("values", b, a);
  return b
};
axs.AuditRule = function(a) {
  for(var b = !0, c = [], d = 0;d < axs.AuditRule.requiredFields.length;d++) {
    var e = axs.AuditRule.requiredFields[d];
    e in a || (b = !1, c.push(e))
  }
  if(!b) {
    throw"Invalid spec; the following fields were not specified: " + c.join(", ") + "\n" + JSON.stringify(a);
  }
  this.name = a.name;
  this.severity = a.severity;
  this.relevantNodesSelector_ = a.relevantNodesSelector;
  this.test_ = a.test;
  this.code = a.code
};
axs.AuditRule.requiredFields = ["name", "severity", "relevantNodesSelector", "test", "code"];
axs.AuditRule.NOT_APPLICABLE = {result:axs.constants.AuditResult.NA};
axs.AuditRule.prototype.addNode = function(a, b) {
  a.push(b)
};
axs.AuditRule.prototype.run = function(a) {
  var a = this.relevantNodesSelector_(a || document), b = [];
  if(a instanceof XPathResult) {
    if(a.resultType == XPathResult.ORDERED_NODE_SNAPSHOT_TYPE) {
      if(!a.snapshotLength) {
        return axs.AuditRule.NOT_APPLICABLE
      }
      for(var c = 0;c < a.snapshotLength;c++) {
        var d = a.snapshotItem(c);
        this.test_(d) && this.addNode(b, d)
      }
    }else {
      return console.warn("Unknown XPath result type", a), null
    }
  }else {
    if(!a.length) {
      return{result:axs.constants.AuditResult.NA}
    }
    for(c = 0;c < a.length;c++) {
      d = a[c], this.test_(d) && this.addNode(b, d)
    }
  }
  return{result:b.length ? axs.constants.AuditResult.FAIL : axs.constants.AuditResult.PASS, elements:b}
};
axs.AuditRule.specs = {};
axs.AuditRules = {};
axs.AuditRules.getRule = function(a) {
  if(!axs.AuditRules.rules) {
    axs.AuditRules.rules = {};
    for(var b in axs.AuditRule.specs) {
      var c = axs.AuditRule.specs[b];
      if(!c.opt_requiresConsoleAPI) {
        var d = new axs.AuditRule(c);
        axs.AuditRules.rules[c.name] = d
      }
    }
  }
  return axs.AuditRules.rules[a]
};
axs.AuditRule.specs.badAriaAttributeValue = {name:"badAriaAttributeValue", severity:axs.constants.Severity.Severe, relevantNodesSelector:function(a) {
  var b = "", c;
  for(c in axs.constants.ARIA_PROPERTIES) {
    b += "[aria-" + c + "],"
  }
  b = b.substring(0, b.length - 1);
  console.log("selector", b);
  return a.querySelectorAll(b)
}, test:function(a) {
  console.log("checking", a);
  for(var b in axs.constants.ARIA_PROPERTIES) {
    var c = "aria-" + b;
    console.log("property", c);
    if(a.hasAttribute(c)) {
      var d = a.getAttribute(c), c = axs.utils.getAriaPropertyValue(c, d, a);
      console.log("propertyValue", c, d);
      if(!c.valid) {
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
  for(var a = a.querySelectorAll("img"), b = [], c = 0;c < a.length;c++) {
    var d = a[c];
    axs.utils.isElementOrAncestorHidden(d) || b.push(d)
  }
  return b
}, test:function(a) {
  return!a.hasAttribute("alt") && "presentation" != a.getAttribute("role")
}, code:"AX_TEXT_02"};
axs.AuditRule.specs.lowContrastElements = {name:"lowContrastElements", severity:axs.constants.Severity.Warning, relevantNodesSelector:function(a) {
  return document.evaluate('/html/body//text()[normalize-space(.)!=""]/parent::*[name()!="script"]', a, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
}, test:function(a) {
  var b = window.getComputedStyle(a, null);
  return(a = axs.utils.getContrastRatioForElementWithComputedStyle(b, a)) && axs.utils.isLowContrast(a, b)
}, code:"AX_COLOR_01"};
axs.AuditRule.specs.nonExistentAriaLabelledbyElement = {name:"nonExistentAriaLabelledbyElement", severity:axs.constants.Severity.Warning, relevantNodesSelector:function(a) {
  return a.querySelectorAll("[aria-labelledby]")
}, test:function(a) {
  for(var a = a.getAttribute("aria-labelledby").split(/\s+/), b = 0;b < a.length;b++) {
    if(!document.getElementById(a[b])) {
      return!0
    }
  }
  return!1
}, code:"AX_ARIA_02"};
axs.AuditRule.specs.requiredAriaAttributeMissing = {name:"requiredAriaAttributeMissing", severity:axs.constants.Severity.Severe, relevantNodesSelector:function(a) {
  return a.querySelectorAll("[role]")
}, test:function(a) {
  var b = axs.utils.getRole(a).details.requiredPropertiesSet, c;
  for(c in b) {
    if(!a.hasAttribute(c)) {
      return!0
    }
  }
}, code:"AX_ARIA_03"};
axs.AuditRule.specs.unfocusableElementsWithOnClick = {name:"unfocusableElementsWithOnClick", severity:axs.constants.Severity.Warning, opt_requiresConsoleAPI:!0, relevantNodesSelector:function(a) {
  for(var a = a.querySelectorAll("*"), b = [], c = 0;c < a.length;c++) {
    var d = a[c];
    d instanceof HTMLBodyElement || axs.utils.isElementOrAncestorHidden(d) || "click" in getEventListeners(d) && b.push(d)
  }
  return b
}, test:function(a) {
  return!a.hasAttribute("tabindex") && !axs.utils.isElementImplicitlyFocusable(a)
}, code:"AX_FOCUS_02"};
axs.AuditRule.specs.videoWithoutCaptions = {name:"videoWithoutCaptions", severity:axs.constants.Severity.Warning, relevantNodesSelector:function(a) {
  return a.querySelectorAll("video")
}, test:function(a) {
  return!a.querySelectorAll("track[kind=captions]").length
}, code:"AX_VIDEO_01"};

