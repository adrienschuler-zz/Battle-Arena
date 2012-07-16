	/*global module:false*/
module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: '<json:package.json>',
		meta: {
			banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
				'<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
				'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
				' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
		},
		concat: {
			dist: {
				src: ['<banner:meta.banner>', '<file_strip_banner:lib/<%= pkg.name %>.js>',
					'public/javascripts/jquery-1.7.2.min.js',
					'public/javascripts/jquery.mobile-1.1.0.min.js',
					'public/javascripts/jquery.tmpl.min.js',
					'public/javascripts/jquery.mobile.simpledialog2.min.js',
					'public/javascripts/underscore.min.js',
					'public/javascripts/socket.io.min.js',
					'public/javascripts/inheritance.js',
					'public/javascripts/client.js',
					'public/javascripts/tchat.js',
					'public/javascripts/game.js',
				],
				dest: 'public/javascripts/<%= pkg.name %>.js'
			}
		},
		min: {
			dist: {
				src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
				dest: 'public/javascripts/<%= pkg.name %>.min.js',
				separator: ';'
			}
		},
		uglify: {
    	// mangle: {toplevel: true},
    },
		watch: {},
	});

	// mocha module
	// grunt.loadNpmTasks('grunt-mocha');
	
	// Default task.
	grunt.registerTask('default', 'concat min');

};
