/**
 * Created by seven on 15/6/21.
 */

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        browserify: {
            dev: {
                src: ['lib/exports.js'],
                dest: 'dist/cdnkit.js'
            }
        },

        uglify: {
            options: {
                compress: {
                    drop_console: true
                }
            },
            prod: {
                files: {'dist/cdnkit.min.js': ['dist/cdnkit.js']}
            }
        },

        concat: {
            dev: {
                options: {
                    banner: '/*! <%= pkg.name %> build:<%= pkg.version %>, development. ' +
                    'Copyright(c) 2015 Seven Chen <humen1@gmail.com> */'
                },
                src: 'dist/cdnkit.js',
                dest: 'dist/cdnkit.js'
            },
            prod: {
                options: {
                    banner: '/*! <%= pkg.name %> build:<%= pkg.version %>, production. ' +
                    'Copyright(c) 2015 Seven Chen <humen1@gmail.com> */'
                },
                src: 'dist/cdnkit.min.js',
                dest: 'dist/cdnkit.min.js',
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default', ['browserify', 'uglify', 'concat']);
}
