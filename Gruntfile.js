'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    closurecompiler: {
      minify: {
        files: {
          "gen/axs_testing.js": [
              "./lib/closure-library/closure/goog/base.js",
              "./src/js/axs.js",
              "./src/js/BrowserUtils.js",
              "./src/js/Constants.js",
              "./src/js/AccessibilityUtils.js",
              "./src/js/Properties.js",
              "./src/js/AuditRule.js",
              "./src/js/AuditRules.js",
              "./src/js/AuditResults.js",
              "./src/js/Audit.js",
              "./src/audits/*"
          ]
        },
        options: {
          "language_in": "ECMASCRIPT5",
          "formatting": "PRETTY_PRINT",
          "summary_detail_level": 3,
          "warning_level": "VERBOSE",
          "compilation_level": "SIMPLE_OPTIMIZATIONS",
          "output_wrapper": "'/*\n" +
                            " * Generated from http://github.com/GoogleChrome/accessibility-developer-tools\n" +
                            " * See project README for build steps.\n" +
                            "*/\n%output%'",
          "externs": "./src/js/externs/externs.js"
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-closurecompiler');

  grunt.registerTask('default', ['closurecompiler:minify']);
};

