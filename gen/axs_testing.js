var COMPILED = !0, goog = goog || {};
goog.global = this;
goog.exportPath_ = function(a, b, c) {
  a = a.split(".");
  c = c || goog.global;
  a[0] in c || !c.execScript || c.execScript("var " + a[0]);
  for(var d;a.length && (d = a.shift());) {
    a.length || void 0 === b ? c = c[d] ? c[d] : c[d] = {} : c[d] = b
  }
};
goog.define = function(a, b) {
  var c = b;
  COMPILED || goog.global.CLOSURE_DEFINES && Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_DEFINES, a) && (c = goog.global.CLOSURE_DEFINES[a]);
  goog.exportPath_(a, c)
};
goog.DEBUG = !0;
goog.LOCALE = "en";
goog.TRUSTED_SITE = !0;
goog.provide = function(a) {
  if(!COMPILED) {
    if(goog.isProvided_(a)) {
      throw Error('Namespace "' + a + '" already declared.');
    }
    delete goog.implicitNamespaces_[a];
    for(var b = a;(b = b.substring(0, b.lastIndexOf("."))) && !goog.getObjectByName(b);) {
      goog.implicitNamespaces_[b] = !0
    }
  }
  goog.exportPath_(a)
};
goog.setTestOnly = function(a) {
  if(COMPILED && !goog.DEBUG) {
    throw a = a || "", Error("Importing test-only code into non-debug environment" + a ? ": " + a : ".");
  }
};
COMPILED || (goog.isProvided_ = function(a) {
  return!goog.implicitNamespaces_[a] && !!goog.getObjectByName(a)
}, goog.implicitNamespaces_ = {});
goog.getObjectByName = function(a, b) {
  for(var c = a.split("."), d = b || goog.global, e;e = c.shift();) {
    if(goog.isDefAndNotNull(d[e])) {
      d = d[e]
    }else {
      return null
    }
  }
  return d
};
goog.globalize = function(a, b) {
  var c = b || goog.global, d;
  for(d in a) {
    c[d] = a[d]
  }
};
goog.addDependency = function(a, b, c) {
  if(goog.DEPENDENCIES_ENABLED) {
    var d;
    a = a.replace(/\\/g, "/");
    for(var e = goog.dependencies_, f = 0;d = b[f];f++) {
      e.nameToPath[d] = a, a in e.pathToNames || (e.pathToNames[a] = {}), e.pathToNames[a][d] = !0
    }
    for(d = 0;b = c[d];d++) {
      a in e.requires || (e.requires[a] = {}), e.requires[a][b] = !0
    }
  }
};
goog.ENABLE_DEBUG_LOADER = !0;
goog.require = function(a) {
  if(!COMPILED && !goog.isProvided_(a)) {
    if(goog.ENABLE_DEBUG_LOADER) {
      var b = goog.getPathFromDeps_(a);
      if(b) {
        goog.included_[b] = !0;
        goog.writeScripts_();
        return
      }
    }
    a = "goog.require could not find: " + a;
    goog.global.console && goog.global.console.error(a);
    throw Error(a);
  }
};
goog.basePath = "";
goog.nullFunction = function() {
};
goog.identityFunction = function(a, b) {
  return a
};
goog.abstractMethod = function() {
  throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(a) {
  a.getInstance = function() {
    if(a.instance_) {
      return a.instance_
    }
    goog.DEBUG && (goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = a);
    return a.instance_ = new a
  }
};
goog.instantiatedSingletons_ = [];
goog.DEPENDENCIES_ENABLED = !COMPILED && goog.ENABLE_DEBUG_LOADER;
goog.DEPENDENCIES_ENABLED && (goog.included_ = {}, goog.dependencies_ = {pathToNames:{}, nameToPath:{}, requires:{}, visited:{}, written:{}}, goog.inHtmlDocument_ = function() {
  var a = goog.global.document;
  return"undefined" != typeof a && "write" in a
}, goog.findBasePath_ = function() {
  if(goog.global.CLOSURE_BASE_PATH) {
    goog.basePath = goog.global.CLOSURE_BASE_PATH
  }else {
    if(goog.inHtmlDocument_()) {
      for(var a = goog.global.document.getElementsByTagName("script"), b = a.length - 1;0 <= b;--b) {
        var c = a[b].src, d = c.lastIndexOf("?"), d = -1 == d ? c.length : d;
        if("base.js" == c.substr(d - 7, 7)) {
          goog.basePath = c.substr(0, d - 7);
          break
        }
      }
    }
  }
}, goog.importScript_ = function(a) {
  var b = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
  !goog.dependencies_.written[a] && b(a) && (goog.dependencies_.written[a] = !0)
}, goog.writeScriptTag_ = function(a) {
  if(goog.inHtmlDocument_()) {
    var b = goog.global.document;
    if("complete" == b.readyState) {
      if(/\bdeps.js$/.test(a)) {
        return!1
      }
      throw Error('Cannot write "' + a + '" after document load');
    }
    b.write('<script type="text/javascript" src="' + a + '">\x3c/script>');
    return!0
  }
  return!1
}, goog.writeScripts_ = function() {
  function a(e) {
    if(!(e in d.written)) {
      if(!(e in d.visited) && (d.visited[e] = !0, e in d.requires)) {
        for(var g in d.requires[e]) {
          if(!goog.isProvided_(g)) {
            if(g in d.nameToPath) {
              a(d.nameToPath[g])
            }else {
              throw Error("Undefined nameToPath for " + g);
            }
          }
        }
      }
      e in c || (c[e] = !0, b.push(e))
    }
  }
  var b = [], c = {}, d = goog.dependencies_, e;
  for(e in goog.included_) {
    d.written[e] || a(e)
  }
  for(e = 0;e < b.length;e++) {
    if(b[e]) {
      goog.importScript_(goog.basePath + b[e])
    }else {
      throw Error("Undefined script input");
    }
  }
}, goog.getPathFromDeps_ = function(a) {
  return a in goog.dependencies_.nameToPath ? goog.dependencies_.nameToPath[a] : null
}, goog.findBasePath_(), goog.global.CLOSURE_NO_DEPS || goog.importScript_(goog.basePath + "deps.js"));
goog.typeOf = function(a) {
  var b = typeof a;
  if("object" == b) {
    if(a) {
      if(a instanceof Array) {
        return"array"
      }
      if(a instanceof Object) {
        return b
      }
      var c = Object.prototype.toString.call(a);
      if("[object Window]" == c) {
        return"object"
      }
      if("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) {
        return"array"
      }
      if("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) {
        return"function"
      }
    }else {
      return"null"
    }
  }else {
    if("function" == b && "undefined" == typeof a.call) {
      return"object"
    }
  }
  return b
};
goog.isDef = function(a) {
  return void 0 !== a
};
goog.isNull = function(a) {
  return null === a
};
goog.isDefAndNotNull = function(a) {
  return null != a
};
goog.isArray = function(a) {
  return"array" == goog.typeOf(a)
};
goog.isArrayLike = function(a) {
  var b = goog.typeOf(a);
  return"array" == b || "object" == b && "number" == typeof a.length
};
goog.isDateLike = function(a) {
  return goog.isObject(a) && "function" == typeof a.getFullYear
};
goog.isString = function(a) {
  return"string" == typeof a
};
goog.isBoolean = function(a) {
  return"boolean" == typeof a
};
goog.isNumber = function(a) {
  return"number" == typeof a
};
goog.isFunction = function(a) {
  return"function" == goog.typeOf(a)
};
goog.isObject = function(a) {
  var b = typeof a;
  return"object" == b && null != a || "function" == b
};
goog.getUid = function(a) {
  return a[goog.UID_PROPERTY_] || (a[goog.UID_PROPERTY_] = ++goog.uidCounter_)
};
goog.removeUid = function(a) {
  "removeAttribute" in a && a.removeAttribute(goog.UID_PROPERTY_);
  try {
    delete a[goog.UID_PROPERTY_]
  }catch(b) {
  }
};
goog.UID_PROPERTY_ = "closure_uid_" + (1E9 * Math.random() >>> 0);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(a) {
  var b = goog.typeOf(a);
  if("object" == b || "array" == b) {
    if(a.clone) {
      return a.clone()
    }
    var b = "array" == b ? [] : {}, c;
    for(c in a) {
      b[c] = goog.cloneObject(a[c])
    }
    return b
  }
  return a
};
goog.bindNative_ = function(a, b, c) {
  return a.call.apply(a.bind, arguments)
};
goog.bindJs_ = function(a, b, c) {
  if(!a) {
    throw Error();
  }
  if(2 < arguments.length) {
    var d = Array.prototype.slice.call(arguments, 2);
    return function() {
      var c = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(c, d);
      return a.apply(b, c)
    }
  }
  return function() {
    return a.apply(b, arguments)
  }
};
goog.bind = function(a, b, c) {
  Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? goog.bind = goog.bindNative_ : goog.bind = goog.bindJs_;
  return goog.bind.apply(null, arguments)
};
goog.partial = function(a, b) {
  var c = Array.prototype.slice.call(arguments, 1);
  return function() {
    var b = Array.prototype.slice.call(arguments);
    b.unshift.apply(b, c);
    return a.apply(this, b)
  }
};
goog.mixin = function(a, b) {
  for(var c in b) {
    a[c] = b[c]
  }
};
goog.now = goog.TRUSTED_SITE && Date.now || function() {
  return+new Date
};
goog.globalEval = function(a) {
  if(goog.global.execScript) {
    goog.global.execScript(a, "JavaScript")
  }else {
    if(goog.global.eval) {
      if(null == goog.evalWorksForGlobals_ && (goog.global.eval("var _et_ = 1;"), "undefined" != typeof goog.global._et_ ? (delete goog.global._et_, goog.evalWorksForGlobals_ = !0) : goog.evalWorksForGlobals_ = !1), goog.evalWorksForGlobals_) {
        goog.global.eval(a)
      }else {
        var b = goog.global.document, c = b.createElement("script");
        c.type = "text/javascript";
        c.defer = !1;
        c.appendChild(b.createTextNode(a));
        b.body.appendChild(c);
        b.body.removeChild(c)
      }
    }else {
      throw Error("goog.globalEval not available");
    }
  }
};
goog.evalWorksForGlobals_ = null;
goog.getCssName = function(a, b) {
  var c = function(a) {
    return goog.cssNameMapping_[a] || a
  }, d = function(a) {
    a = a.split("-");
    for(var b = [], d = 0;d < a.length;d++) {
      b.push(c(a[d]))
    }
    return b.join("-")
  }, d = goog.cssNameMapping_ ? "BY_WHOLE" == goog.cssNameMappingStyle_ ? c : d : function(a) {
    return a
  };
  return b ? a + "-" + d(b) : d(a)
};
goog.setCssNameMapping = function(a, b) {
  goog.cssNameMapping_ = a;
  goog.cssNameMappingStyle_ = b
};
!COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING && (goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING);
goog.getMsg = function(a, b) {
  var c = b || {}, d;
  for(d in c) {
    var e = ("" + c[d]).replace(/\$/g, "$$$$");
    a = a.replace(RegExp("\\{\\$" + d + "\\}", "gi"), e)
  }
  return a
};
goog.getMsgWithFallback = function(a, b) {
  return a
};
goog.exportSymbol = function(a, b, c) {
  goog.exportPath_(a, b, c)
};
goog.exportProperty = function(a, b, c) {
  a[b] = c
};
goog.inherits = function(a, b) {
  function c() {
  }
  c.prototype = b.prototype;
  a.superClass_ = b.prototype;
  a.prototype = new c;
  a.prototype.constructor = a
};
goog.base = function(a, b, c) {
  var d = arguments.callee.caller;
  if(goog.DEBUG && !d) {
    throw Error("arguments.caller not defined.  goog.base() expects not to be running in strict mode. See http://www.ecma-international.org/ecma-262/5.1/#sec-C");
  }
  if(d.superClass_) {
    return d.superClass_.constructor.apply(a, Array.prototype.slice.call(arguments, 1))
  }
  for(var e = Array.prototype.slice.call(arguments, 2), f = !1, g = a.constructor;g;g = g.superClass_ && g.superClass_.constructor) {
    if(g.prototype[b] === d) {
      f = !0
    }else {
      if(f) {
        return g.prototype[b].apply(a, e)
      }
    }
  }
  if(a[b] === d) {
    return a.constructor.prototype[b].apply(a, e)
  }
  throw Error("goog.base called from a method of one name to a method of a different name");
};
goog.scope = function(a) {
  a.call(goog.global)
};
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
axs.constants.addAllParentRolesToSet_ = function(a, b) {
  if(a.parent) {
    for(var c = a.parent, d = 0;d < c.length;d++) {
      var e = c[d];
      b[e] = !0;
      axs.constants.addAllParentRolesToSet_(axs.constants.ARIA_ROLES[e], b)
    }
  }
};
axs.constants.addAllPropertiesToSet_ = function(a, b, c) {
  var d = a[b];
  if(d) {
    for(var e = 0;e < d.length;e++) {
      c[d[e]] = !0
    }
  }
  if(a.parent) {
    for(a = a.parent, d = 0;d < a.length;d++) {
      axs.constants.addAllPropertiesToSet_(axs.constants.ARIA_ROLES[a[d]], b, c)
    }
  }
};
for(var roleName in axs.constants.ARIA_ROLES) {
  var role = axs.constants.ARIA_ROLES[roleName], propertiesSet = {};
  axs.constants.addAllPropertiesToSet_(role, "properties", propertiesSet);
  role.propertiesSet = propertiesSet;
  var requiredPropertiesSet = {};
  axs.constants.addAllPropertiesToSet_(role, "requiredProperties", requiredPropertiesSet);
  role.requiredPropertiesSet = requiredPropertiesSet;
  var parentRolesSet = {};
  axs.constants.addAllParentRolesToSet_(role, parentRolesSet);
  role.allParentRolesSet = parentRolesSet;
  "widget" in parentRolesSet && (axs.constants.WIDGET_ROLES[roleName] = role)
}
axs.constants.ARIA_PROPERTIES = {activedescendant:{type:"property", valueType:"idref"}, atomic:{defaultValue:"false", type:"property", valueType:"boolean"}, autocomplete:{defaultValue:"none", type:"property", valueType:"token", values:["inline", "list", "both", "none"]}, busy:{defaultValue:"false", type:"state", valueType:"boolean"}, checked:{defaultValue:"undefined", type:"state", valueType:"token", values:["true", "false", "mixed", "undefined"]}, controls:{type:"property", valueType:"idref_list"}, 
describedby:{type:"property", valueType:"idref_list"}, disabled:{defaultValue:"false", type:"state", valueType:"boolean"}, dropeffect:{defaultValue:"none", type:"property", valueType:"token_list", values:"copy move link execute popup none".split(" ")}, expanded:{defaultValue:"undefined", type:"state", valueType:"token", values:["true", "false", "undefined"]}, flowto:{type:"property", valueType:"idref_list"}, grabbed:{defaultValue:"undefined", type:"state", valueType:"token", values:["true", "false", 
"undefined"]}, haspopup:{defaultValue:"false", type:"property", valueType:"boolean"}, hidden:{defaultValue:"false", type:"state", valueType:"boolean"}, invalid:{defaultValue:"false", type:"state", valueType:"token", values:["grammar", "false", "spelling", "true"]}, label:{type:"property", valueType:"string"}, labelledby:{type:"property", valueType:"idref_list"}, level:{type:"property", valueType:"integer"}, live:{defaultValue:"off", type:"property", valueType:"token", values:["off", "polite", "assertive"]}, 
multiline:{defaultValue:"false", type:"property", valueType:"boolean"}, multiselectable:{defaultValue:"false", type:"property", valueType:"boolean"}, orientation:{defaultValue:"vertical", type:"property", valueType:"token", values:["horizontal", "vertical"]}, owns:{type:"property", valueType:"idref_list"}, posinset:{type:"property", valueType:"integer"}, pressed:{defaultValue:"undefined", type:"state", valueType:"token", values:["true", "false", "mixed", "undefined"]}, readonly:{defaultValue:"false", 
type:"property", valueType:"boolean"}, relevant:{defaultValue:"additions text", type:"property", valueType:"token_list", values:["additions", "removals", "text", "all"]}, required:{defaultValue:"false", type:"property", valueType:"boolean"}, selected:{defaultValue:"undefined", type:"state", valueType:"token", values:["true", "false", "undefined"]}, setsize:{type:"property", valueType:"integer"}, sort:{defaultValue:"none", type:"property", valueType:"token", values:["ascending", "descending", "none", 
"other"]}, valuemax:{type:"property", valueType:"decimal"}, valuemin:{type:"property", valueType:"decimal"}, valuenow:{type:"property", valueType:"decimal"}, valuetext:{type:"property", valueType:"string"}};
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
axs.constants.Severity = {INFO:"Info", WARNING:"Warning", SEVERE:"Severe"};
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
  a = a.getBoundingClientRect();
  var b = a.top - a.bottom;
  return a.right - a.left && b ? !1 : !0
};
axs.utils.elementIsOutsideScrollArea = function(a) {
  a = a.getBoundingClientRect();
  var b = document.body.scrollWidth, c = document.body.scrollTop, d = document.body.scrollLeft;
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
  return null == c || c == a || b(c, a) ? null : c
};
axs.utils.elementIsHtmlControl = function(a) {
  var b = a.ownerDocument.defaultView;
  return a instanceof b.HTMLButtonElement || a instanceof b.HTMLInputElement || a instanceof b.HTMLSelectElement || a instanceof b.HTMLTextAreaElement ? !0 : !1
};
axs.utils.elementIsAriaWidget = function(a) {
  return a.hasAttribute("role") && (a = a.getAttribute("role")) && (a = axs.constants.ARIA_ROLES[a]) && "widget" in a.allParentRolesSet ? !0 : !1
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
  var b = a.fontSize;
  a = "bold" == a.fontWeight;
  var c = b.match(/(\d+)px/);
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
        if((f = axs.utils.parseColor(f.backgroundColor)) && 0 != f.alpha && (e.push(f), 1 == f.alpha)) {
          c = null;
          break
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
    a = parseInt(b[1], 10);
    var c = parseInt(b[2], 10), b = parseInt(b[3], 10), d;
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
  var b = a.red / 255, c = a.green / 255;
  a = a.blue / 255;
  b = 0.03928 >= b ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  c = 0.03928 >= c ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  a = 0.03928 >= a ? a / 12.92 : Math.pow((a + 0.055) / 1.055, 2.4);
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
  return d ? axs.utils.calculateContrastRatio(d, c) : null
};
axs.utils.isNativeTextElement = function(a) {
  var b = a.tagName.toLowerCase();
  a = a.type ? a.type.toLowerCase() : "";
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
  if(!(a instanceof a.ownerDocument.defaultView.HTMLElement)) {
    return!1
  }
  if(a.hasAttribute("chromevoxignoreariahidden")) {
    var b = !0
  }
  var c = window.getComputedStyle(a, null);
  return"none" == c.display || "hidden" == c.visibility ? !0 : a.hasAttribute("aria-hidden") && "true" == a.getAttribute("aria-hidden").toLowerCase() ? !b : !1
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
      a = axs.utils.isValidIDRefValue(b, c), d.valid = a.valid, d.reason = a.reason, d.idref = a.idref;
    case "idref_list":
      a = b.split(/\s+/);
      d.valid = !0;
      for(b = 0;b < a.length;b++) {
        e = axs.utils.isValidIDRefValue(a[b], c), e.valid || (d.valid = !1), d.values ? d.values.push(e) : d.values = [e]
      }
      return d;
    case "integer":
      c = axs.utils.isValidNumber(b);
      if(!c.valid) {
        return d.valid = !1, d.reason = c.reason, d
      }
      Math.floor(c.value) != c.value ? (d.valid = !1, d.reason = "" + b + " is not a whole integer") : (d.valid = !0, d.value = c.value);
      return d;
    case "number":
      c = axs.utils.isValidNumber(b), c.valid && (d.valid = !0, d.value = c.value);
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
      return c = axs.utils.isPossibleValue(b.toLowerCase(), axs.constants.MIXED_VALUES, a), c.valid ? (d.valid = !0, d.value = c.value) : (d.valid = !1, d.value = b, d.reason = c.reason), d;
    case "boolean":
      return c = axs.utils.isValidBoolean(b), c.valid ? (d.valid = !0, d.value = c.value) : (d.valid = !1, d.value = b, d.reason = c.reason), d
  }
  d.valid = !1;
  d.reason = "Not a valid ARIA property";
  return d
};
axs.utils.isValidTokenValue = function(a, b) {
  var c = a.replace(/^aria-/, "");
  return axs.utils.isPossibleValue(b, axs.constants.ARIA_PROPERTIES[c].valuesSet, a)
};
axs.utils.isPossibleValue = function(a, b, c) {
  return b[a] ? {valid:!0, value:a} : {valid:!1, value:a, reason:'"' + a + '" is not a valid value for ' + c, possibleValues:Object.keys(b)}
};
axs.utils.isValidBoolean = function(a) {
  try {
    var b = JSON.parse(a)
  }catch(c) {
    b = ""
  }
  return"boolean" != typeof b ? {valid:!1, value:a, reason:'"' + a + '" is not a true/false value'} : {valid:!0, value:b}
};
axs.utils.isValidIDRefValue = function(a, b) {
  return b.ownerDocument.getElementById(a) ? {valid:!0, idref:a} : {valid:!1, idref:a, reason:'No element with ID "' + a + '"'}
};
axs.utils.isValidNumber = function(a) {
  var b = JSON.parse(a);
  return"number" != typeof b ? {valid:!1, value:a, reason:'"' + a + '" is not a number'} : {valid:!0, value:b}
};
axs.utils.isElementImplicitlyFocusable = function(a) {
  var b = a.ownerDocument.defaultView;
  return a instanceof b.HTMLAnchorElement || a instanceof b.HTMLAreaElement ? a.hasAttribute("href") : a instanceof b.HTMLInputElement || a instanceof b.HTMLSelectElement || a instanceof b.HTMLTextAreaElement || a instanceof b.HTMLButtonElement || a instanceof b.HTMLIFrameElement ? !a.disabled : !1
};
axs.utils.values = function(a) {
  var b = [], c;
  for(c in a) {
    a.hasOwnProperty(c) && "function" != typeof a[c] && b.push(a[c])
  }
  return b
};
axs.utils.namedValues = function(a) {
  var b = {}, c;
  for(c in a) {
    a.hasOwnProperty(c) && "function" != typeof a[c] && (b[c] = a[c])
  }
  return b
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
      for(var b = "", c = 0;c < a.classList.length;c++) {
        b += "." + a.classList[c]
      }
      var d = 0;
      if(a.parentNode) {
        for(c = 0;c < a.parentNode.children.length;c++) {
          var e = a.parentNode.children[c];
          axs.browserUtils.matchSelector(e, b) && d++;
          if(e === a) {
            break
          }
        }
      }else {
        d = 1
      }
      return 1 == d ? axs.utils.getQuerySelectorText(a.parentNode) + " > " + b : axs.utils.getQuerySelectorText(a.parentNode) + " > " + b + ":nth-of-type(" + d + ")"
    }
    if(a.parentNode) {
      b = a.parentNode.children;
      d = 1;
      for(c = 0;b[c] !== a;) {
        b[c].tagName == a.tagName && d++, c++
      }
      c = "";
      "BODY" != a.parentNode.tagName && (c = axs.utils.getQuerySelectorText(a.parentNode) + " > ");
      return 1 == d ? c + a.tagName : c + a.tagName + ":nth-of-type(" + d + ")"
    }
  }else {
    if(a.selectorText) {
      return a.selectorText
    }
  }
  return""
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
  this.code = a.code;
  this.heading = a.heading || "";
  this.url = a.url || "";
  this.requiresConsoleAPI = !!a.opt_requiresConsoleAPI
};
axs.AuditRule.requiredFields = ["name", "severity", "relevantNodesSelector", "test", "code"];
axs.AuditRule.NOT_APPLICABLE = {result:axs.constants.AuditResult.NA};
axs.AuditRule.prototype.addNode = function(a, b) {
  a.push(b)
};
axs.AuditRule.prototype.run = function(a, b) {
  function c(a) {
    for(var b = 0;b < d.length;b++) {
      if(axs.browserUtils.matchSelector(a, d[b])) {
        return!0
      }
    }
    return!1
  }
  var d = a || [], e = this.relevantNodesSelector_(b || document), f = [];
  if(e instanceof XPathResult) {
    if(e.resultType == XPathResult.ORDERED_NODE_SNAPSHOT_TYPE) {
      if(!e.snapshotLength) {
        return axs.AuditRule.NOT_APPLICABLE
      }
      for(var g = 0;g < e.snapshotLength;g++) {
        var h = e.snapshotItem(g);
        this.test_(h) && !c(h) && this.addNode(f, h)
      }
    }else {
      return console.warn("Unknown XPath result type", e), null
    }
  }else {
    if(!e.length) {
      return{result:axs.constants.AuditResult.NA}
    }
    for(g = 0;g < e.length;g++) {
      h = e[g], this.test_(h) && !c(h) && this.addNode(f, h)
    }
  }
  return{result:f.length ? axs.constants.AuditResult.FAIL : axs.constants.AuditResult.PASS, elements:f}
};
axs.AuditRule.specs = {};
axs.AuditRules = {};
axs.AuditRules.getRule = function(a) {
  if(!axs.AuditRules.rules) {
    axs.AuditRules.rules = {};
    for(var b in axs.AuditRule.specs) {
      var c = axs.AuditRule.specs[b], d = new axs.AuditRule(c);
      axs.AuditRules.rules[c.name] = d
    }
  }
  return axs.AuditRules.rules[a]
};
axs.AuditResults = function() {
  this.errors_ = [];
  this.warnings_ = []
};
goog.exportSymbol("axs.AuditResults", axs.AuditResults);
axs.AuditResults.prototype.addError = function(a) {
  "" != a && this.errors_.push(a)
};
goog.exportProperty(axs.AuditResults.prototype, "addError", axs.AuditResults.prototype.addError);
axs.AuditResults.prototype.addWarning = function(a) {
  "" != a && this.warnings_.push(a)
};
goog.exportProperty(axs.AuditResults.prototype, "addWarning", axs.AuditResults.prototype.addWarning);
axs.AuditResults.prototype.numErrors = function() {
  return this.errors_.length
};
goog.exportProperty(axs.AuditResults.prototype, "numErrors", axs.AuditResults.prototype.numErrors);
axs.AuditResults.prototype.numWarnings = function() {
  return this.warnings_.length
};
goog.exportProperty(axs.AuditResults.prototype, "numWarnings", axs.AuditResults.prototype.numWarnings);
axs.AuditResults.prototype.getErrors = function() {
  return this.errors_
};
goog.exportProperty(axs.AuditResults.prototype, "getErrors", axs.AuditResults.prototype.getErrors);
axs.AuditResults.prototype.getWarnings = function() {
  return this.warnings_
};
goog.exportProperty(axs.AuditResults.prototype, "getWarnings", axs.AuditResults.prototype.getWarnings);
axs.AuditResults.prototype.toString = function() {
  for(var a = "", b = 0;b < this.errors_.length;b++) {
    0 == b && (a += "\nErrors:\n");
    var c = this.errors_[b], a = a + (c + "\n\n")
  }
  for(b = 0;b < this.warnings_.length;b++) {
    0 == b && (a += "\nWarnings:\n"), c = this.warnings_[b], a += c + "\n\n"
  }
  return a
};
goog.exportProperty(axs.AuditResults.prototype, "toString", axs.AuditResults.prototype.toString);
axs.Audit = {};
axs.AuditConfiguration = function() {
  this.rules_ = {};
  this.auditRulesToIgnore = this.auditRulesToRun = this.scope = null;
  this.withConsoleApi = !1;
  goog.exportProperty(this, "scope", this.scope);
  goog.exportProperty(this, "auditRulesToRun", this.auditRulesToRun);
  goog.exportProperty(this, "auditRulesToIgnore", this.auditRulesToIgnore);
  goog.exportProperty(this, "withConsoleApi", this.withConsoleApi)
};
goog.exportSymbol("axs.AuditConfiguration", axs.AuditConfiguration);
axs.AuditConfiguration.prototype = {ignoreSelectors:function(a, b) {
  a in this.rules_ || (this.rules_[a] = {});
  "ignore" in this.rules_[a] || (this.rules_[a].ignore = []);
  Array.prototype.push.call(this.rules_[a].ignore, b)
}, getIgnoreSelectors:function(a) {
  return a in this.rules_ && "ignore" in this.rules_[a] ? this.rules_[a].ignore : []
}};
goog.exportProperty(axs.AuditConfiguration.prototype, "ignoreSelectors", axs.AuditConfiguration.prototype.ignoreSelectors);
goog.exportProperty(axs.AuditConfiguration.prototype, "getIgnoreSelectors", axs.AuditConfiguration.prototype.getIgnoreSelectors);
axs.Audit.run = function(a) {
  a = a || new axs.AuditConfiguration;
  var b = a.withConsoleApi, c = [], d;
  d = a.auditRulesToRun && 0 < a.auditRulesToRun.length ? a.auditRulesToRun : Object.keys(axs.AuditRule.specs);
  if(a.auditRulesToIgnore) {
    for(var e = 0;e < a.auditRulesToIgnore.length;e++) {
      var f = a.auditRulesToIgnore[e];
      0 > d.indexOf(f) || d.splice(d.indexOf(f), 1)
    }
  }
  for(e = 0;e < d.length;e++) {
    if((f = axs.AuditRules.getRule(d[e])) && !f.disabled && (b || !f.requiresConsoleAPI)) {
      var g = [], h = a.getIgnoreSelectors(f.name);
      (0 < h.length || a.scope) && g.push(h);
      a.scope && g.push(a.scope);
      g = f.run.apply(f, g);
      g.rule = axs.utils.namedValues(f);
      c.push(g)
    }
  }
  return c
};
goog.exportSymbol("axs.Audit.run", axs.Audit.run);
axs.Audit.auditResults = function(a) {
  for(var b = new axs.AuditResults, c = 0;c < a.length;c++) {
    var d = a[c];
    d.result == axs.constants.AuditResult.FAIL && (d.rule.severity == axs.constants.Severity.SEVERE ? b.addError(axs.Audit.accessibilityErrorMessage(d)) : b.addWarning(axs.Audit.accessibilityErrorMessage(d)))
  }
  return b
};
goog.exportSymbol("axs.Audit.auditResults", axs.Audit.auditResults);
axs.Audit.createReport = function(a, b) {
  var c;
  c = "*** Begin accessibility audit results ***\nAn accessibility audit found " + axs.Audit.auditResults(a).toString();
  b && (c += "\nFor more information, please see ", c += b);
  return c += "\n*** End accessibility audit results ***"
};
goog.exportSymbol("axs.Audit.createReport", axs.Audit.createReport);
axs.Audit.accessibilityErrorMessage = function(a) {
  for(var b = a.rule.severity == axs.constants.Severity.SEVERE ? "Error: " : "Warning: ", b = b + (a.rule.code + " (" + a.rule.heading + ") failed on the following " + (1 == a.elements.length ? "element" : "elements")), b = 1 == a.elements.length ? b + ":" : b + (" (1 - " + Math.min(5, a.elements.length) + " of " + a.elements.length + "):"), c = Math.min(a.elements.length, 5), d = 0;d < c;d++) {
    var e = a.elements[d], b = b + "\n";
    try {
      b += axs.utils.getQuerySelectorText(e)
    }catch(f) {
      b += " tagName:" + e.tagName, b += " id:" + e.id
    }
  }
  "" != a.rule.url && (b += "\nSee " + a.rule.url + " for more information.");
  return b
};
goog.exportSymbol("axs.Audit.accessibilityErrorMessage", axs.Audit.accessibilityErrorMessage);
axs.browserUtils = {};
axs.browserUtils.matchSelector = function(a, b) {
  return a.webkitMatchesSelector ? a.webkitMatchesSelector(b) : a.mozMatchesSelector(b)
};
axs.AuditRule.specs.audioWithoutControls = {name:"audioWithoutControls", heading:"Audio elements should have controls", url:"", severity:axs.constants.Severity.WARNING, relevantNodesSelector:function(a) {
  return a.querySelectorAll("audio[autoplay]")
}, test:function(a) {
  return!a.querySelectorAll("[controls]").length && 3 < a.duration
}, code:"AX_AUDIO_01"};
axs.AuditRule.specs.badAriaAttributeValue = {name:"badAriaAttributeValue", heading:"ARIA state and property values must be valid", url:"", severity:axs.constants.Severity.SEVERE, relevantNodesSelector:function(a) {
  var b = "", c;
  for(c in axs.constants.ARIA_PROPERTIES) {
    b += "[aria-" + c + "],"
  }
  b = b.substring(0, b.length - 1);
  return a.querySelectorAll(b)
}, test:function(a) {
  for(var b in axs.constants.ARIA_PROPERTIES) {
    var c = "aria-" + b;
    if(a.hasAttribute(c)) {
      var d = a.getAttribute(c);
      if(!axs.utils.getAriaPropertyValue(c, d, a).valid) {
        return!0
      }
    }
  }
  return!1
}, code:"AX_ARIA_04"};
axs.AuditRule.specs.badAriaRole = {name:"badAriaRole", heading:"Elements with ARIA roles must use a valid, non-abstract ARIA role", url:"https://code.google.com/p/accessibility-developer-tools/wiki/AuditRules#AX_ARIA_01:_Elements_with_ARIA_roles_must_use_a_valid,_non-abstr", severity:axs.constants.Severity.SEVERE, relevantNodesSelector:function(a) {
  return a.querySelectorAll("[role]")
}, test:function(a) {
  return!axs.utils.getRole(a).valid
}, code:"AX_ARIA_01"};
axs.AuditRule.specs.controlsWithoutLabel = {name:"controlsWithoutLabel", heading:"Controls and media elements should have labels", url:"https://code.google.com/p/accessibility-developer-tools/wiki/AuditRules#AX_TEXT_01:_Controls_and_media_elements_should_have_labels", severity:axs.constants.Severity.SEVERE, relevantNodesSelector:function(a) {
  return a.querySelectorAll('input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), video:not([disabled])')
}, test:function(a) {
  return axs.utils.isElementOrAncestorHidden(a) || "button" == a.tagName.toLowerCase() && a.textContent.replace(/^\s+|\s+$/g, "").length ? !1 : axs.utils.hasLabel(a) ? !1 : !0
}, code:"AX_TEXT_01", ruleName:"Controls and media elements should have labels"};
axs.AuditRule.specs.focusableElementNotVisibleAndNotAriaHidden = {name:"focusableElementNotVisibleAndNotAriaHidden", heading:"These elements are focusable but either invisible or obscured by another element", url:"https://code.google.com/p/accessibility-developer-tools/wiki/AuditRules#AX_FOCUS_01:_These_elements_are_focusable_but_either_invisible_o", severity:axs.constants.Severity.WARNING, relevantNodesSelector:function(a) {
  return a.querySelectorAll(axs.utils.FOCUSABLE_ELEMENTS_SELECTOR)
}, test:function(a) {
  return axs.utils.isElementOrAncestorHidden(a) ? !1 : !axs.utils.elementIsVisible(a)
}, code:"AX_FOCUS_01"};
axs.AuditRule.specs.imagesWithoutAltText = {name:"imagesWithoutAltText", heading:"Images should have an alt attribute", url:"https://code.google.com/p/accessibility-developer-tools/wiki/AuditRules#AX_TEXT_02:_Images_should_have_an_alt_attribute,_unless_they_hav", severity:axs.constants.Severity.WARNING, relevantNodesSelector:function(a) {
  a = a.querySelectorAll("img");
  for(var b = [], c = 0;c < a.length;c++) {
    var d = a[c];
    axs.utils.isElementOrAncestorHidden(d) || b.push(d)
  }
  return b
}, test:function(a) {
  return!a.hasAttribute("alt") && "presentation" != a.getAttribute("role")
}, code:"AX_TEXT_02"};
axs.AuditRule.specs.linkWithUnclearPurpose = {name:"linkWithUnclearPurpose", heading:"The purpose of each link should be clear from the link text", url:"", severity:axs.constants.Severity.WARNING, relevantNodesSelector:function(a) {
  return a.querySelectorAll("a")
}, test:function(a) {
  return/^\s*click\s*here\s*[^a-z]?$/i.test(a.textContent)
}, code:"AX_TITLE_01"};
axs.AuditRule.specs.lowContrastElements = {name:"lowContrastElements", heading:"Text elements should have a reasonable contrast ratio", url:"https://code.google.com/p/accessibility-developer-tools/wiki/AuditRules#AX_COLOR_01:_Text_elements_should_have_a_reasonable_contrast_rat", severity:axs.constants.Severity.WARNING, relevantNodesSelector:function(a) {
  return document.evaluate('/html/body//text()[normalize-space(.)!=""]/parent::*[name()!="script"]', a, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
}, test:function(a) {
  var b = window.getComputedStyle(a, null);
  return(a = axs.utils.getContrastRatioForElementWithComputedStyle(b, a)) && axs.utils.isLowContrast(a, b)
}, code:"AX_COLOR_01"};
axs.AuditRule.specs.elementsWithMeaningfulBackgroundImage = {name:"elementsWithMeaningfulBackgroundImage", severity:axs.constants.Severity.WARNING, relevantNodesSelector:function(a) {
  a = a.querySelectorAll("*");
  for(var b = [], c = 0;c < a.length;c++) {
    var d = a[c];
    axs.utils.isElementOrAncestorHidden(d) || b.push(d)
  }
  return b
}, heading:"Meaningful images should not be used in element backgrounds", url:"https://code.google.com/p/accessibility-developer-tools/wiki/AuditRules?ts=1368336558&updated=AuditRules#AX_IMAGE_01:_Meaningful_images_should_not_be_used_in_element_bac", test:function(a) {
  if(a.textContent && 0 < a.textContent.length) {
    return!1
  }
  a = window.getComputedStyle(a, null);
  var b = a.backgroundImage;
  if(!b || "undefined" === b || "none" === b) {
    return!1
  }
  b = parseInt(a.width, 10);
  a = parseInt(a.height, 10);
  return 150 > b && 150 > a
}, code:"AX_IMAGE_01"};
axs.AuditRule.specs.nonExistentAriaLabelledbyElement = {name:"nonExistentAriaLabelledbyElement", heading:"aria-labelledby attributes should refer to an element which exists in the DOM", url:"https://code.google.com/p/accessibility-developer-tools/wiki/AuditRules#AX_ARIA_02:__aria-labelledby_attributes_should_refer_to_an_eleme", severity:axs.constants.Severity.WARNING, relevantNodesSelector:function(a) {
  return a.querySelectorAll("[aria-labelledby]")
}, test:function(a) {
  a = a.getAttribute("aria-labelledby").split(/\s+/);
  for(var b = 0;b < a.length;b++) {
    if(!document.getElementById(a[b])) {
      return!0
    }
  }
  return!1
}, code:"AX_ARIA_02"};
axs.AuditRule.specs.pageWithoutTitle = {name:"pageWithoutTitle", heading:"The web page should have a title that describes topic or purpose", url:"", severity:axs.constants.Severity.WARNING, relevantNodesSelector:function(a) {
  return a
}, test:function(a) {
  a = a.querySelector("head");
  if(!a) {
    return!0
  }
  a = a.querySelector("title");
  return!a.length || !a[0].textContent
}, code:"AX_TITLE_01"};
axs.AuditRule.specs.requiredAriaAttributeMissing = {name:"requiredAriaAttributeMissing", heading:"Elements with ARIA roles must have all required attributes for that role", url:"", severity:axs.constants.Severity.SEVERE, relevantNodesSelector:function(a) {
  return a.querySelectorAll("[role]")
}, test:function(a) {
  var b = axs.utils.getRole(a);
  if(!b.valid) {
    return!1
  }
  var b = b.details.requiredPropertiesSet, c;
  for(c in b) {
    b = c.replace(/^aria-/, "");
    if("defaultValue" in axs.constants.ARIA_PROPERTIES[b]) {
      return!1
    }
    if(!a.hasAttribute(c)) {
      return!0
    }
  }
}, code:"AX_ARIA_03"};
axs.AuditRule.specs.unfocusableElementsWithOnClick = {name:"unfocusableElementsWithOnClick", heading:"Elements with onclick handlers must be focusable", url:"https://code.google.com/p/accessibility-developer-tools/wiki/AuditRules#AX_FOCUS_02:_Elements_with_onclick_handlers_must_be_focusable", severity:axs.constants.Severity.WARNING, opt_requiresConsoleAPI:!0, relevantNodesSelector:function(a) {
  a = a.querySelectorAll("*");
  for(var b = [], c = 0;c < a.length;c++) {
    var d = a[c];
    d instanceof d.ownerDocument.defaultView.HTMLBodyElement || axs.utils.isElementOrAncestorHidden(d) || "click" in getEventListeners(d) && b.push(d)
  }
  return b
}, test:function(a) {
  return!a.hasAttribute("tabindex") && !axs.utils.isElementImplicitlyFocusable(a)
}, code:"AX_FOCUS_02"};
axs.AuditRule.specs.videoWithoutCaptions = {name:"videoWithoutCaptions", heading:"Video elements should use <track> elements to provide captions", url:"https://code.google.com/p/accessibility-developer-tools/wiki/AuditRules#AX_VIDEO_01:_Video_elements_should_use_<track>_elements_to", severity:axs.constants.Severity.WARNING, relevantNodesSelector:function(a) {
  return a.querySelectorAll("video")
}, test:function(a) {
  return!a.querySelectorAll("track[kind=captions]").length
}, code:"AX_VIDEO_01"};

