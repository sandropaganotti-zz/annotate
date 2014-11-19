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
          frameworks: ['mocha', 'sinon-chai'],
          files: [
            'client/components/platform/platform.js',
            'client/test/karma_init.js',
            'client/test/utils.js',
            'client/test/app.js',

            { pattern: 'client/components/**/*', included: false },
            { pattern: 'client/webcomponents/**/*', included: false }
          ],
          browsers: ['Chrome'],
          reporters: 'spec',
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

    vulcanize: {
      dist: {
        options: {
          inline: true
        },
        files: {
          'client/nn-annotable.html': 'client/webcomponents/nn-annotable.html'
        }
      }
    },

  });

  grunt.registerTask('default', ['karma:test:start','concurrent']);

};
