var fs = require("fs");

module.exports = function( grunt ) {
	"use strict";

	var banner = fs.readFileSync( "src/banner.txt", "utf8" );

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		clean: [ "dist" ],
		concat: {
			taskName: {
				options: {
					banner: banner
				},
				files: {
					"dist/<%= pkg.name %>.js": [ "src/bselect.js" ],
					"dist/<%= pkg.name %>.css": [ "dist/<%= pkg.name %>.css" ],
					"dist/<%= pkg.name %>.min.css": [ "dist/<%= pkg.name %>.min.css" ]
				}
			}
		},
		uglify: {
			dist: {
				options: {
					banner: banner
				},
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
					"dist/<%= pkg.name %>.css": "src/bselect.less"
				}
			},
			production: {
				options: {
					strictImports: true,
					yuicompress: true
				},
				files: {
					"dist/<%= pkg.name %>.min.css": "src/bselect.less"
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
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-concat");

	grunt.registerTask( "test", [ "jshint", "qunit" ] );
	grunt.registerTask( "default", [ "clean", "jshint", "qunit", "uglify", "less", "concat" ] );
};