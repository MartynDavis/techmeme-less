/*global module:false*/

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        clean: {
            chrome: {
                src: [ './dist/techmeme-less.zip' ]
            },
            firefox: {
                src: [ './dist/techmeme_less.xpi', './firefox/data/techmeme-less.css', './firefox/data/techmeme-less.js' ]
            },
        },
        jshint: {
            source: {
                src: [ './source/scripts/*.js' ],
            },
            options: {
                curly: true,        // Always put curly braces around blocks in loops and conditionals.
                eqeqeq: true,       // prohibits the use of == and != in favor of === and !==
                immed: true,        // Prohibits the use of immediate function invocations without wrapping them in parentheses
                latedef: true,      // Prohibits the use of a variable before it was defined.
                newcap: true,       // Capitalize names of constructor functions
                noarg: true,        // Prohibits the use of arguments.caller and arguments.callee
                sub: true,          // Suppresses warnings about using [] notation when it can be expressed in dot notation: person['name'] vs. person.name.
                undef: true,        // Prohibits the use of explicitly undeclared variables
                boss: false,        // Suppresses warnings about the use of assignments in cases where comparisons are expected
                eqnull: true,       // Suppresses warnings about == null comparisons.
                browser: true,      // Defines globals exposed by modern browsers (but not alert and console)
                node: false,        // Defines globals available when your code is running inside of the Node runtime environment
                globals: {
            }
          }
        },
        compress: {
            chrome: {
                options: {
                    archive: './dist/techmeme-less.zip',
                    mode: 'zip'
                },
                files: [
                    { src: './**',
                      cwd: 'source/',
                      expand: true
                    }
                ]
            }
        },
        copy: {
            firefox: {
                files: [
                    {
                        expand: true, 
                        flatten: true, 
                        src: [ './source/css/*', './source/scripts/*' ], 
                        dest: './firefox/data', 
                        filter: 'isFile'
                    },
                ]
            }
        },
        "mozilla-addon-sdk": {
            'current': {
                options: {
                    revision: "1.17"
                }
            },
        },
        "mozilla-cfx-xpi": {
            'firefox': {
                options: {
                    "mozilla-addon-sdk": "current",
                    extension_dir: "firefox",
                    dist_dir: "./dist"
                }
            }
        }
    });

    // Load tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-mozilla-addon-sdk');

    // Default task.
    grunt.registerTask('cleanup', [ 'clean' ]);
    grunt.registerTask('default', [ 'clean', 'jshint', 'compress', 'copy', 'mozilla-addon-sdk', 'mozilla-cfx-xpi' ]);
    grunt.registerTask('chrome', [ 'clean.chrome', 'jshint', 'compress.chrome' ]);
    grunt.registerTask('firefox', [ 'clean.firefox', 'jshint', 'copy.firefox', 'mozilla-addon-sdk', 'mozilla-cfx-xpi' ]);
};
