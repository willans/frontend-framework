var
	paths = require('../utils/paths')('static'),

	changed = require('gulp-changed'),
	gulp = require('gulp'),
	gutil = require('gulp-util'),

	task = function() {
		return gulp
			.src(paths.src)
			.pipe(changed(paths.dest))
			.pipe(gulp.dest(paths.dest));
	};

gulp.task('static', task);
module.exports = task;
