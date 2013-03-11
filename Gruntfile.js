module.exports = function( grunt ) {
	"use strict";

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		clean: {
			pre: [ "dist" ],
			post: [ "dist/*.less", "dist/*.js", "dist/*.css" ]
		},
		uglify: {
			dist: {
				files: {
					"dist/js/<%= pkg.name %>.min.js": [ "src/bselect.js" ]
				}
			}
		},
		less: {
			development: {
				options: {
					strictImports: true
				},
				files: {
					"dist/css/<%= pkg.name %>.css": "src/bselect.less"
				}
			},
			production: {
				options: {
					strictImports: true,
					yuicompress: true
				},
				files: {
					"dist/css/<%= pkg.name %>.min.css": "src/bselect.less"
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
			first: {
				src: [
					"README.md",
					"*.json",
					"src/i18n/*.js",
					"src/bselect.js",
					"src/*.less"
				],
				renames: {
					"dist/bselect.less":   "less/bselect.less",
					"dist/mixins.less":    "less/mixins.less",
					"dist/variables.less": "less/variables.less",
					"dist/bselect.js":     "js/bselect.js"
				},
				strip: /^src/,
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