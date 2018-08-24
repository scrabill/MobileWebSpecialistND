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

// Watch
gulp.task('watch', function() {
	var reload = browserSync.reload
	// JS
	gulp.watch('app/sw.js', ['sw', reload]);
	gulp.watch('app/js/*.js', ['scripts', reload]);
	// Images
	gulp.watch('app/img/*.jpg', ['images', reload]);
	// HTML
	gulp.watch('app/*.html', ['html', reload]);
	// CSS
	gulp.watch('app/css/styles.css', ['css', reload]);

})

// Serve
gulp.task('serve', ['build'], function() {
	browserSync.init({
		notify: false,
		port: 8080,
		server: {
			baseDir: ["dist"]
		}
	})
})


// Minify JS
gulp.task('sw', function() {
	return gulp.src('app/sw.js')
		.pipe(uglify())
		.pipe(gulp.dest('dist'));
});

gulp.task('scripts', function() {
	return gulp.src('app/js/*.js')
		// .pipe(babel())
		.pipe(uglify())
		// .on('error', function (err) { 
		// 	gutil.log(gutil.colors.red('[Error]'), err.toString()); 
		// })
		.pipe(gulp.dest('dist/js'));
});

// Optimize images
gulp.task('images', function() {
	return gulp.src('app/img/*.jpg')
		.pipe(cache(imagemin( {
			optimizationLevel: 5, progressive: true, interlaced: true
		})))
		.pipe(webp())
		.pipe(gulp.dest('dist/img'));
});

// Minify HTML
gulp.task('html', function() {
	return gulp.src('app/*.html')
		.pipe(htmlmin( { 
			removeComments: true, collapseWhitespace: true 
		}))
		.pipe(gulp.dest('dist'));
})

// Clean CSS
gulp.task('css', function() {
	return gulp.src('app/css/styles.css')
		.pipe(cleancss())
		.pipe(gulp.dest('dist/css'));
})

// Build - just for building app for dist
// *** NEEDS Manifest and icon tasks
gulp.task('build', ['sw', 'scripts', 'images', 'html', 'css'])

// Dev task - Builds for dist, spinns up server and actvates watch 
// for continuous update during dev.
gulp.task('dev', ['serve', 'watch']);