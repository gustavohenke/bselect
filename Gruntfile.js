module.exports = function( grunt ) {
	"use strict";

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		uglify: {
			dist: {
				files: {
					"dist/<%= pkg.name %>.min.js": [ "src/bselect.js" ]
				}
			}
		},
		less: {
			development: {
				options: {
					strictImports: true
				},
				files: {
					"src/bselect.less": "dist/<%= pkg.name %>.css"
				}
			},
			production: {
				options: {
					strictImports: true,
					yuicompress: true
				},
				files: {
					"src/bselect.less": "dist/<%= pkg.name %>.min.css"
				}
			}
		},
		qunit: {
			files: [ "tests/index.html" ]
		},
		jshint: {
			files: [ "grunt.js", "src/*.js", "test/**/*.js" ],
			options: {
				globals: {
					jQuery: true,
					document: true
				}
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-qunit");
	grunt.loadNpmTasks("grunt-contrib-less");

	grunt.registerTask( "test", [ "jshint", "qunit" ] );
	grunt.registerTask( "default", [ "jshint", "qunit", "uglify", "less" ] );
};