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
		lint: {
			files: [
				'grunt.js', 
				'lib/**/*.js', 
				'tests/**/*.js',
				'config/**/*.js',
				'app/**/*.js'
			]
		},
		concat: {
			dist: {
				src: ['<banner:meta.banner>', '<file_strip_banner:lib/<%= pkg.name %>.js>'],
				dest: 'dist/<%= pkg.name %>.js'
			}
		},
		min: {
			dist: {
				src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
				dest: 'dist/<%= pkg.name %>.min.js'
			}
		},
		watch: {
			files: '<config:lint.files>',
			tasks: 'lint qunit'
		},
		jshint: {
			options: {
				curly: false,
				eqeqeq: false,
				immed: false,
				latedef: false,
				newcap: false,
				noarg: false,
				sub: false,
				undef: false,
				boss: false,
				eqnull: false,
				browser: false,
				laxcomma: true
			},
			globals: {
				jQuery: true
			}
		},
		uglify: {},
		mocha: {
			index: ['specs/index.html']
		},
	});

	// mocha module
	grunt.loadNpmTasks('grunt-mocha');
	
	// Default task.
	grunt.registerTask('default', 'mocha concat min');

};
