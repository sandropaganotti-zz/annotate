module.exports = function(grunt){

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    nodemon: {
      dev: {
        script: 'server/app.js',
        options: {
          watch: ['server'],
          callback: function(nodemon){
            nodemon.on('restart', function(){
              require('fs').writeFileSync('tmp/.rebooted','rebooted');
            });
          }
        }
      },
      dist: {
        script: 'server/app.js',
        options: {
          env: {
            NODE_ENV: 'dist'
          }
        }
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['server/test/**/*.js']
      }
    },

    karma: {
      test: {
        options: {
          frameworks: ['mocha', 'chai'],
          files: [
            'client/components/platform/platform.js',
            'client/test/karma_init.js',
            'client/test/app.js',

            { pattern: 'client/components/**/*', included: false },
            { pattern: 'client/webcomponents/**/*', included: false }
          ],
          browsers: ['Chrome'],
          background: true,
          singleRun: false
        }
      }
    },

    watch: {
      serverTest: {
        files: ['server/**/*'],
        tasks: ['mochaTest']
      },
      clientTest: {
        files: ['client/**/*{.html,.js}'],
        tasks: ['karma:test:run']
      },
      buildSass: {
        files: ['client/scss/*'],
        tasks: ['sass:dev']
      },
      livereload: {
        files: ['client/**/*','tmp/.rebooted','tmp/css/*'],
        options: {
          livereload: true
        }
      }
    },

    concurrent: {
      dev: {
        tasks: ['nodemon:dev','watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },

    sass: {
      dev: {
        files: {
          'client/css/app.css': 'client/scss/app.scss'
        },
        options: {
          sourcemap: true
        }
      },
      dist: {
        files: {
          'client-dist/app.css': 'client/scss/app.scss'
        },
        options: {
          style: 'compressed'
        }
      }
    },

    ngAnnotate: {
      dist: {
        files: {
          'tmp/client/app.js': [
            'client/js/app.js',
            'client/js/factories/*.js',
            'client/js/directives/*.js',
            'client/js/controllers/*.js'
          ]
        }
      }
    },

    uglify: {
      dist: {
        files: {
          'client-dist/app.js': [
            'client/components/angular/angular.js',
            'client/components/angular-resource/angular-resource.js',
            'tmp/client/app.js'
          ]
        }
      }
    },

    processhtml: {
      dist: {
        files: {
          'client-dist/index.html': ['client/index.html']
        }
      }
    }

  });

   grunt.registerTask('default', ['karma:test:start','concurrent']);
   grunt.registerTask('build', ['ngAnnotate', 'sass:dist', 'uglify', 'processhtml']);

};
