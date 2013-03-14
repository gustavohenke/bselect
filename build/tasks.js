module.exports = function( grunt ) {
	"use strict";
	var banner = grunt.file.read("src/banner.txt");

	// Original by the jQuery UI Team http://jqueryui.com
	// https://github.com/jquery/jquery-ui/blob/1.10.0/build/tasks/build.js#L87
	grunt.registerMultiTask( "copy", "Copy files to destination folder, bannerify them and replace @VERSION with pkg.version", function() {
		function replaceVersion( source ) {
			return source.replace( /@VERSION/g, grunt.config("pkg.version") );
		}
		function bannerify( source ) {
			// If already bannerified, don't do that again
			if ( /^\/\*!/.test( source ) ) {
				return source;
			}

			return grunt.template.process( banner, grunt.config() ) + source;
		}
		function copyFile( src, dest ) {
			var options = {};
			if ( /\.(js|css|less)$/.test( src ) ) {
				options.process = bannerify;
			} else if ( /json$/.test( src ) ) {
				options.process = replaceVersion;
			}

			grunt.file.copy( src, dest, options );
		}
		var files = grunt.file.expand( this.data.src ),
			target = this.data.dest + "/",
			strip = this.data.strip,
			renameCount = 0,
			fileName;

		if ( typeof strip === "string" ) {
			strip = new RegExp( "^" + grunt.template.process( strip, grunt.config() ).replace( /[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&" ) );
		}

		files.forEach(function( fileName ) {
			var targetFile = strip ? fileName.replace( strip, "" ) : fileName;
			copyFile( fileName, target + targetFile );
		});
		grunt.log.writeln( "Copied " + files.length + " files." );

		for ( fileName in this.data.renames ) {
			renameCount += 1;
			copyFile( fileName, target + grunt.template.process( this.data.renames[ fileName ], grunt.config() ) );
		}
		if ( renameCount ) {
			grunt.log.writeln( "Renamed " + renameCount + " files." );
		}
	});
};