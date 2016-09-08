module.exports = function(grunt) {

    var srcDir = 'src',
        distDir = 'parse/public/assets',
        jsFileConfig = [
            {
                src: [
                    srcDir + '/js/initialize.js',
                    srcDir + '/js/models/*.js',
                    srcDir + '/js/collections/*.js',
                    srcDir + '/js/router.js'
                ],
                dest: distDir + '/js/main.js'
            },
            {
                cwd: srcDir + '/js',
                src: 'views/*.js',
                dest: distDir + '/js/',
                expand: true
            },
            {
                cwd: srcDir + '/js',
                src: 'libs/*.js',
                dest: distDir + '/js/',
                expand: true
            }
        ],
        gruntConfig = {

            pkg: grunt.file.readJSON('package.json'),

            compass: {
                dist: {
                    options: {
                        environment: 'production',
                        outputStyle: 'compressed',
                        sassDir: srcDir + '/sass',
                        cssDir: distDir + '/css',
                        noLineComments: true
                    }
                },
                dev: {
                    options: {
                        environment: 'development',
                        outputStyle: 'expanded',
                        sassDir: srcDir + '/sass',
                        cssDir: distDir + '/css',
                        noLineComments: false
                    }
                }
            },

            uglify: {
                dist: {
                    options: {
                        mangle: true,
                        preserveComments: false,
                        drop_console: true,
                        compress: {
                            global_defs: {
                                DEBUG: false
                            }
                        }
                    },
                    files: jsFileConfig
                },
                dev: {
                    options: {
                        mangle: false,
                        preserveComments: true,
                        drop_console: false,
                        compress: false,
                        beautify: true,
                        report: 'min'
                    },
                    files: jsFileConfig
                }

            },
            imagemin: {
                dynamic: {
                    options: {
                        optimizationLevel: 7,
                        progressive: true,
                        interlaced: true
                    },
                    files: [{
                        expand: true,
                        cwd: srcDir + '/img',
                        src: ['**/*.{png,jpg,gif}'],
                        dest: distDir + '/img'
                    }]
                }
            },
            clean: {
                dist: [distDir]
            },
            copy: {
                // copy all fonts
                fonts: {
                    files: [{
                        expand: true,
                        cwd: srcDir + '/fonts',
                        src: '**/*.{eot,svg,ttf,woff,otf}',
                        dest: distDir + '/fonts/',
                        filter: 'isFile'
                    }]
                },
                // copy all backbone templates
                templates: {
                    files: [{
                        expand: true,
                        cwd: srcDir + '/js/templates',
                        src: '**/*.tpl',
                        dest: distDir + '/js/templates',
                        filter: 'isFile'
                    }]
                }
            },
            watch: {
                sass: {
                    files: [srcDir + '/sass/**/*'],
                    tasks: ['compass:dev']
                },
                scripts: {
                    files: [srcDir + '/js/**/*'],
                    tasks: ['uglify:dev']
                },
                images: {
                    files: [srcDir + '/img/**/*.{jpg,png,gif}'],
                    tasks: ['newer:imagemin:dynamic']
                },
                fonts: {
                    files: [srcDir + '/fonts/**/*'],
                    tasks: ['newer:copy:fonts', 'notify:watch']
                },
                templates: {
                    files: [srcDir + '/js/templates/**/*'],
                    tasks: ['newer:copy:templates', 'notify:watch']
                }
            },

            notify: {
                watch: {
                    options: {
                        title: 'Build Complete',  // optional
                        message: 'All files have compiled and been moved' //required
                    }
                }
            },
            cachebuster: {
                build: {
                    options: {
                        format: 'json',
                        basedir: 'parse/public/'
                    },
                    src: [ distDir + '/js/main.js', distDir + '/css/main.css' ],
                    dest: 'cachebusters.json'
                }
            },
            shell: {
                deploy: {
                    command: [
                        'cd parse',
                        'parse deploy'
                    ].join('&&')
                }
            }
        };

    grunt.initConfig(gruntConfig);

    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-cachebuster');
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('dist', ['clean:dist', 'compass:dist', 'imagemin:dynamic', 'copy', 'uglify:dist', 'cachebuster', 'notify:watch', 'shell:deploy']);
    grunt.registerTask('dev', ['compass:dev', 'imagemin:dynamic', 'copy', 'uglify:dev', 'cachebuster', 'notify:watch']);

};