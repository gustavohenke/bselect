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

	grunt.registerTask( "test", [ "jshint", "qunit" ] );
	grunt.registerTask( "default", [ "jshint", "qunit", "uglify" ] );
};