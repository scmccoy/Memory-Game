(function() {
	'use strict';
	// this function is strict...

	// Gulp Sass //

	const gulp = require('gulp');
	const sass = require('gulp-sass'); // Sass
	const watch = require('gulp-watch'); // Watch
	const babel = require('gulp-babel'); // Babel
	const uglify = require('gulp-uglify'); // Uglify
	const concat = require('gulp-concat'); // Concat
	const cached = require('gulp-cached'); // Cached
	const moment = require('moment-timer'); // Moment plugin

	gulp.task('sass', function() {
		return gulp.src('./src/styles/**/*.scss')
			.pipe(sass().on('error', sass.logError))
			.pipe(gulp.dest('./lib/styles/'));
	});

	// Gulp Babel
	gulp.task('js', function() {
		gulp.src('./src/js/*.js')
			.pipe(babel({
				presets: ['es2015']
			}))
			// .pipe(uglify())
			.pipe(gulp.dest('./lib/js/'));

		gulp.src('./src/js/vendor/*.js')
			.pipe(cached('vendor-processing'))
			.pipe(uglify())
			.pipe(concat('vendor.min.js'))
			.pipe(gulp.dest('./lib/js/vendor/'));
	});

	// Gulp Watch
	gulp.task('watch', function() {
		gulp.watch('./src/styles/**/*.scss', ['sass']);
		gulp.watch('./src/js/*.js', ['js']);
	});



	// Gulp TASK FORCE
	gulp.task('default', ['watch']);
}());
