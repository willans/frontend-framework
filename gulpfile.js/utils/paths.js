// var
// 	config = require('../config'),
// 	path = require('path'),

// 	src = function(task, glob) {
// 		return path.join(
// 			config.root.src,
// 			config.tasks[task].src,
// 			glob + '.+(' + config.tasks[task].extensions.join('|') + ')'
// 		);
// 	};

// module.exports = function(task) {
// 	return {
// 		src: src(task, ['/**/*']),
// 		dest: path.join(
// 			config.root.public,
// 			config.root.dest,
// 			config.tasks[task].dest
// 		),
// 		public: path.join(
// 			'/',
// 			config.root.dest,
// 			config.tasks[task].dest,
// 			'/'
// 		),
// 		entries: function() {
// 			return src(task, config.tasks.scripts.entries);
// 		},
// 	};
// };






var
	config = require('../config'),
	path = require('path');

	src = function(task, glob) {
		return path.join(
			config.root.src,
			config.tasks[task].src,
			glob + '.+(' + config.tasks[task].extensions.join('|') + ')'
		);
	};

module.exports = function(task) {
	return {
		src: src(task, ['/**/*']),
		dest: path.join(
			config.root.public,
			config.root.dest,
			config.tasks[task].dest
		),
		scripts: function(name, lintOnly) {
			return config.tasks.scripts.files
				.filter(function(file) { return file.name === name; })
				.filter(function(file) { return !lintOnly || file.lint; })
				.map(function(file) { return file.src; })
				.reduce(function(a, b) { return a.concat(b); }, [])
				.map(function(src) {
					return path.join(
						config.root.src,
						config.tasks.scripts.src,
						name,
						src + '.+(' + config.tasks.scripts.extensions.join('|') + ')'
					);
				});
		},
	};
};
