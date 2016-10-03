var
	config = require('../config'),
	notification = require('../utils/notification'),
	paths = require('../utils/paths')('scripts'),

	changed = require('gulp-changed'),
	concat = require('gulp-concat'),
	eslint = require('gulp-eslint'),
	gulp = require('gulp'),
	gutil = require('gulp-util'),
	include = require('gulp-include'),
	sourcemaps = require('gulp-sourcemaps'),
	summary = require('engage-eslint-summary'),
	uglify = require('gulp-uglify'),

	options = {
		notification: {
			title: 'JavaScript Error',
			subtitle: [
				'<%= options.relative(options.cwd, error.fileName) %>',
				'<%= error.lineNumber %>',
			].join(':'),
			message: '<%= error.message %>',
			open: 'file://<%= error.fileName %>',
		},
	},

	lintSummary = function(name) {
		return function() {
			return gulp
				.src(paths.scripts(name, true))
				.pipe(eslint())
				.pipe(eslint.format(summary))
				.pipe(eslint.failOnError().on('error', notification(options.notification)))
				.pipe(eslint.failOnError().on('error', function() { done(); }))
				.pipe(eslint.failAfterError());
		};
	},

	lint = function(name) {
		return function() {
			return gulp
				.src(paths.scripts(name, true))
				.pipe(eslint())
				.pipe(eslint.format())
				.pipe(eslint.failAfterError());
		};
	},

	compile = function(name) {
		return function() {
			return gulp
				.src(paths.scripts(name))
				.pipe(sourcemaps.init())
				.pipe(concat(name + '.js'))
				.pipe(include({
					hardFail: true,
					includePaths: config.tasks.scripts.includePaths,
				}))
				.pipe(changed(paths.dest))
				.pipe(uglify())
				.pipe(sourcemaps.write('.'))
				.pipe(gulp.dest(paths.dest));
		};
	};

config.tasks.scripts.files.forEach(function(file) {
	var
		tasks = [],
		prefix = 'scripts.' + file.name;

	if (file.lint) {
		task = prefix + '.lint';
		tasks.push(task);
		gulp.task(task, lintSummary(file.name));
		gulp.task(task + '.full', lint(file.name));
	}

	task = prefix + '.compile';
	tasks.push(task);
	gulp.task(task, compile(file.name));

	gulp.task(prefix, gulp.series(tasks));
});

task = gulp.parallel(config.tasks.scripts.files.map(function(file) {
	return 'scripts.' + file.name;
}));
gulp.task('scripts', task);
module.exports = task;

gulp.task('scripts.lint', gulp.series('scripts.site.lint')); // legacy alias
gulp.task('scripts.lint.full', gulp.series('scripts.site.lint.full')); // legacy alias
