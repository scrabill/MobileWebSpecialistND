// Include gulp
var gulp = require('gulp');

// Include plug-ins
var gutil 		= require('gulp-util');
var uglify 		= require('gulp-uglify-es').default;
var imagemin	= require('gulp-imagemin');
var cache 		= require('gulp-cache');
var webp 		= require('gulp-webp');
var htmlmin		= require('gulp-htmlmin');
var cleancss	= require('gulp-clean-css');
var browserSync	= require('browser-sync').create();
var del 		= require('del');

// Watch
gulp.task('watch', () => {
	var reload = browserSync.reload
	// JS
	gulp.watch('app/sw.js', 	['sw', reload]);
	gulp.watch('app/js/*.js', 	['scripts', reload]);
	// Images
	gulp.watch('app/img/*.jpg', ['images', reload]);
	// HTML
	gulp.watch('app/*.html', 	['html', reload]);
	// CSS
	gulp.watch('app/css/styles.css', ['css', reload]);
	// Manifest
	gulp.watch('app/manifest.json', ['manifest', reload]);
	// Icons
	gulp.watch(['app/favicon.ico','app/apple-touch-icon.png'], ['icons-main', reload]);
	gulp.watch('app/img/icons/*',  ['icons-folder', reload]);
});

// Serve
gulp.task('serve', ['build'], () => {
	browserSync.init({
		notify: false,
		port: 8080,
		server: {
			baseDir: ["dist"]
		}
	})
});

// Minify JS
gulp.task('sw', () => {
	return gulp.src('app/sw.js')
		.pipe(uglify())
		.pipe(gulp.dest('dist'));
});

gulp.task('scripts', () => {
	return gulp.src('app/js/*.js')
		.pipe(uglify())
		// .on('error', function (err) { 
		// 	gutil.log(gutil.colors.red('[Error]'), err.toString()); 
		// })
		.pipe(gulp.dest('dist/js'));
});

// Optimize images
gulp.task('images', () => {
	return gulp.src('app/img/*.jpg')
		.pipe(cache(imagemin( {
			optimizationLevel: 5, progressive: true, interlaced: true
		})))
		.pipe(webp())
		.pipe(gulp.dest('dist/img'));
});

// Minify HTML
gulp.task('html', () => {
	return gulp.src('app/*.html')
		.pipe(htmlmin( { 
			removeComments: true, collapseWhitespace: true 
		}))
		.pipe(gulp.dest('dist'));
});

// Clean CSS
gulp.task('css', () => {
	return gulp.src('app/css/styles.css')
		.pipe(cleancss())
		.pipe(gulp.dest('dist/css'));
});

// Move over remaining files to dist
gulp.task('manifest', () => {
	return gulp.src('app/manifest.json')
		.pipe(gulp.dest('dist'));
});

gulp.task('icons-main', () => {
	return gulp.src(['app/favicon.ico','app/apple-touch-icon.png'])
		.pipe(gulp.dest('dist'));
});

gulp.task('icons-folder', () => {
	return gulp.src('app/img/icons/*')
		.pipe(gulp.dest('dist/img/icons'));
});

// Build - just for building app for dist
gulp.task('build', [
	'sw', 
	'scripts', 
	'images', 
	'html', 
	'css', 
	'manifest', 
	'icons-main', 
	'icons-folder'
]);

// Dev task - Builds for dist, spins up server and activates watch 
// for continuous update during dev.
gulp.task('dev', ['serve', 'watch']);

// Clean out dist folder
gulp.task('clean-dist', () => {
	return del.sync('dist');
});

// Clean out image cahce
gulp.task('cache-clear', (callback) => {
	return cache.clearAll(callback);
});