'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    'git-describe': {
      options: {

      },
      'run': {}
    },
    closurecompiler: {
      minify: {
        requiresConfig: 'git-revision',
        files: {
          "gen/axs_testing.js": [
              "./lib/closure/base.js",
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
          "output_wrapper": "'<%= grunt.file.read('scripts/output_wrapper.txt') %>'",
          "externs": "./src/js/externs/externs.js"
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-closurecompiler');

  grunt.registerTask('git-describe', function() {
    var _spawn = require("grunt-util-spawn")(grunt);

    // Start async task
    var done = this.async();

    _spawn({
      "cmd" : "git",
      "args" : [ "rev-parse", "HEAD" ],
      "opts" : {
        "cwd" : "."
      }
      }, function(err, result) {
      if (err) {
          grunt.log.error(err).verbose.error(result);
          done();
          return;
      }

      grunt.event.emit('git-describe', result.stdout);
      done();
    });
  });

  grunt.registerTask('save-revision', function() {
    grunt.event.once('git-describe', function (rev) {
      grunt.log.writeln("Git Revision: " + rev);
      grunt.config.set('git-revision', rev);
    });
    grunt.task.run('git-describe');
  });

  grunt.registerTask('default', ['save-revision', 'closurecompiler:minify']);
};

