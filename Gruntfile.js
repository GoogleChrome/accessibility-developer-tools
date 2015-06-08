module.exports = function(grunt) {
  'use strict';

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    changelog: 'CHANGELOG.md',

    closurecompiler: {
      minify: {
        requiresConfig: 'git-revision',
        files: {
          '.tmp/build/axs_testing.js': [
              './lib/closure-library/closure/goog/base.js',
              './src/js/axs.js',
              './src/js/BrowserUtils.js',
              './src/js/Constants.js',
              './src/js/AccessibilityUtils.js',
              './src/js/Properties.js',
              './src/js/AuditRule.js',
              './src/js/AuditRules.js',
              './src/js/AuditResults.js',
              './src/js/Audit.js',
              './src/audits/*'
          ]
        },
        options: {
          'language_in': 'ECMASCRIPT5',
          'formatting': 'PRETTY_PRINT',
          'summary_detail_level': 3,
          'warning_level': 'VERBOSE',
          'compilation_level': 'SIMPLE_OPTIMIZATIONS',
          'output_wrapper': "<%= grunt.file.read('scripts/output_wrapper.txt') %>",
          'externs': './src/js/externs/externs.js'
        }
      }
    },

    qunit: {
      all: ['test/index.html']
    },

    copy: {
      dist: {
        expand: true,
        cwd: '.tmp/build',
        src: '**/*',
        dest: 'dist/js'
      }
    },

    clean: {
      all: ['.tmp', 'dist']
    },

    bump: {
      options: {
        files: ['package.json', 'bower.json'],
        updateConfigs: ['pkg'],
        pushTo: 'GoogleChrome',
        commitFiles: ['package.json', grunt.config.get('changelog'), 'bower.json', 'dist']
      }
    }
  });

  grunt.registerTask('changelog', function(type) {
    grunt.task.requires('bump-only:' + type);

    var config = {
      data: {
        version: grunt.config.get('pkg.version'),
        releaseDate: grunt.template.today("yyyy-mm-dd")
      }
    };

    var stopRegex = /^\#\#\ [0-9]+.*$/m;
    var stopIndex = 0;
    var releaseNotes = '';
    var dest = grunt.config.get('changelog');
    var contents = grunt.file.read(dest);
    var headerTpl = "## <%= version %> - <%= releaseDate %>\n\n";
    var header = grunt.template.process(headerTpl, config);

    if (contents.length > 0) {
      if ((stopIndex = contents.search(stopRegex)) !== -1) {
        releaseNotes = contents.slice(0, stopIndex);
      }
    }

    grunt.config.set("release-notes", releaseNotes);

    grunt.file.write(dest, "" + header + contents);
    grunt.log.ok("Changelog updated, and release notes extracted.");
  });

  grunt.registerTask('git-describe', function() {
    // Start async task
    var done = this.async();

    grunt.util.spawn({
      'cmd' : 'git',
      'args' : [ 'rev-parse', 'HEAD' ],
      'opts' : {
        'cwd' : '.'
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

  grunt.registerTask('release', function(type) {
    grunt.task.run([
      'build',
      'test:unit',
      'copy:dist',
      'bump-only:' + type,
      'changelog:' + type,
      'bump-commit'
    ]);
  });

  grunt.registerTask('save-revision', function() {
    grunt.event.once('git-describe', function (rev) {
      grunt.log.writeln('Git Revision: ' + rev);
      grunt.config.set('git-revision', rev);
    });
    grunt.task.run('git-describe');
  });

  grunt.registerTask('build', ['clean:all', 'save-revision', 'closurecompiler:minify']);
  grunt.registerTask('test:unit', ['qunit']);

  grunt.registerTask('travis', ['closurecompiler:minify', 'test:unit']);
  grunt.registerTask('default', ['build', 'test:unit']);
};
