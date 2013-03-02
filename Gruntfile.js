var fs = require("fs");

module.exports = function( grunt ) {
	"use strict";

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		clean: {
			pre: [ "dist" ],
			post: [ "dist/pre" ]
		},
		uglify: {
			dist: {
				files: {
					"dist/pre/<%= pkg.name %>.min.js": [ "src/bselect.js" ]
				}
			}
		},
		less: {
			development: {
				options: {
					strictImports: true
				},
				files: {
					"dist/pre/<%= pkg.name %>.css": "src/bselect.less"
				}
			},
			production: {
				options: {
					strictImports: true,
					yuicompress: true
				},
				files: {
					"dist/pre/<%= pkg.name %>.min.css": "src/bselect.less"
				}
			}
		},
		qunit: {
			files: [ "tests/index.html" ]
		},
		jshint: {
			files: [ "Gruntfile.js", "src/**/*.js", "tests/**/*.js" ],
			options: {
				globals: {
					jQuery: true,
					document: true
				}
			}
		},
		copy: {
			dist: {
				src: [
					"README.md",
					"package.json",
					"src/i18n/*.js",
					"src/bselect.js",
					"dist/pre/*"
				],
				strip: /^(src|dist\/pre)/,
				dest: "dist"
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-qunit");
	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadTasks("build");

	grunt.registerTask( "test", [ "jshint", "qunit" ] );
	grunt.registerTask( "default", [ "clean:pre", "jshint", "qunit", "uglify", "less", "copy", "clean:post" ] );
};