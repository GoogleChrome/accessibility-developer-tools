var request = require('superagent');

module.exports = function(grunt) {
  'use strict';

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    changelog: 'CHANGELOG.md',

    'gh-release': {},

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
        prereleaseName: 'rc',
        files: ['package.json', 'bower.json'],
        updateConfigs: ['pkg'],
        pushTo: "<%= grunt.config.get('gh-release.remote') %>",
        commitFiles: ['package.json', "<%= grunt.config.get('changelog') %>", 'bower.json', 'dist']
      }
    },

    prompt: {
      'gh-release': {
        options: {
          questions: [
            {
              config: 'gh-release.remote',
              type: 'input',
              message: 'Git Remote (usually upstream or origin)',
              default: 'upstream',
              validate: function(val) {
                return (grunt.util._.size(val) > 0);
              }
            },
            {
              config: 'gh-release.repo',
              type: 'input',
              message: 'Github Repository',
              default: 'GoogleChrome/accessibility-developer-tools',
              validate: function(val) {
                return (grunt.util._.size(val) > 0);
              }
            },
            {
              config: 'gh-release.username',
              type: 'input',
              message: 'Github Username',
              validate: function(val) {
                return (grunt.util._.size(val) > 0);
              }
            },
            {
              config: 'gh-release.password',
              type: 'password',
              message: 'Github Password or Token',
              validate: function(val) {
                return (grunt.util._.size(val) > 0);
              }
            }
          ]
        }
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

    grunt.config.set("gh-release.release-notes", releaseNotes);

    grunt.file.write(dest, "" + header + contents);
    grunt.log.ok("Changelog updated, and release notes extracted.");
  });

  grunt.registerTask('gh-release', function() {
    var config = grunt.config.get('gh-release');
    var pkg = grunt.config.get('pkg');
    var done = this.async();

    request
      .post('https://api.github.com/repos/' + config.repo + '/releases')
      .auth(config.username, config.password)
      .set('Accept', 'application/vnd.github.v3')
      .set('User-Agent', 'grunt')
      .send({
        'tag_name': 'v' + pkg.version,
        name: pkg.version,
        body: config['release-notes'],
        draft: true
      })
      .end(function(err, res){
        if (typeof err !== "undefined" && err !== null) {
          grunt.fail.warn('Error encountered while creating Github release.', err);
        }

        if (res.statusCode === 201){
          grunt.log.ok('Github release created');
          done();
        } else {
          grunt.fail.warn('Unable to create github release.', res.text);
        }
      });
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

  grunt.registerTask('release', function(releaseType) {
    if (typeof releaseType === 'undefined' || releaseType === null) {
      grunt.fail.fatal('You must specify a release type. i.e. grunt release:prerelease');
    }

    grunt.task.run([
      'prompt:gh-release',
      'build',
      'test:unit',
      'copy:dist',
      'bump-only:' + releaseType,
      'changelog:' + releaseType,
      'bump-commit',
      'gh-release'
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
  grunt.registerTask('dist', ['build', 'copy:dist']);
  grunt.registerTask('travis', ['closurecompiler:minify', 'test:unit']);
  grunt.registerTask('default', ['build', 'test:unit']);
};
