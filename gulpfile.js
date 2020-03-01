'use strict';

const gulp = require('gulp');
const rimraf = require('gulp-rimraf');
const tslint = require('gulp-tslint');
const mocha = require('gulp-mocha');
const shell = require('gulp-shell');
const env = require('gulp-env');

/**
 * Remove build directory.
 */
gulp.task('clean', function () {
	return gulp.src(outDir, { read: false })
		.pipe(rimraf());
});

/**
 * Lint all custom TypeScript files.
 */
gulp.task('tslint', () => {
	return gulp.src('src/**/*.ts')
		.pipe(tslint({
			formatter: 'prose'
		}))
		.pipe(tslint.report());
});

/**
 * Compile TypeScript.
 */

function compileTS(args, cb) {
	return exec(tscCmd + args, (err, stdout, stderr) => {
		console.log(stdout);

		if (stderr) {
			console.log(stderr);
		}
		cb(err);
	});
}

gulp.task('compile', shell.task([
	'npm run tsc',
]));

/**
 * Watch for changes in TypeScript
 */
gulp.task('watch', shell.task([
	'npm run tsc-watch',
]))
/**
 * Copy config files
 */
gulp.task('configs', (cb) => {
	gulp
		.src('./src/core/db/*.json')
		.pipe(gulp.dest('./build/src/core/db'));
	return gulp
		.src("src/server/configs/*.json")
		.pipe(gulp.dest('./build/src/server/configs'));
});
gulp.task('views', (cb) => {
	return gulp.src(".src/public/**/*.*")
		.pipe(gulp.dest('./build/public'));
});
gulp.task('key-configs', (cb) => {
	return gulp.src("./app-keys.json")
		.pipe(gulp.dest('./build'));
});

gulp.task('test-png-images', (cb) => {
	return gulp.src("test/**/*.png")
		.pipe(gulp.dest('./build/test'));
});

gulp.task('test-images', gulp.series('test-png-images'), (cb) => {
	return gulp.src("test/**/*.jpg")
		.pipe(gulp.dest('./build/test'));
});



gulp.task('update-configs', gulp.parallel('configs', 'key-configs'), () => {
	console.log('Updating config files ...');
});

/**
 * Build the project.
 */
gulp.task('build', gulp.series('tslint', 'compile', 'key-configs', 'configs'), () => {
	console.log('Building the project ...');
});

gulp.task('run-tests', (cb) => {
	const envs = env.set({
		NODE_ENV: 'test'
	});

	return gulp.src(['build/test/**/*.js'])
		.pipe(envs)
		.pipe(mocha({
			timeout: 30000,
			exit: true
		}))
		.once('error', (error) => {
			console.log(error);
			process.exit(1);
		});
});


/**
 * Run tests.
 */
gulp.task('test', gulp.series('configs', 'key-configs', 'run-tests'), (cb) => {
});

gulp.task('default', gulp.series('build'));