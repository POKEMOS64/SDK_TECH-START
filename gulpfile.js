var gulp = require('gulp'),
		browserSync = require('browser-sync'),
		del = require('del'),
		livereload = require('gulp-livereload'),
		
		sass = require('gulp-sass'),
		autoprefixer = require('gulp-autoprefixer'),
		cssnano = require('gulp-cssnano'),
		
		pug = require('gulp-pug'),
		pugBeautify = require('gulp-pug-beautify'),
		
		concat = require('gulp-concat'),
		uglify = require('gulp-uglify'),
		gutil = require('gulp-util'),
		rename = require('gulp-rename'),
		fsize = require('gulp-filesize'),
		
		imgmin = require('gulp-imagemin'),
		imgJpg = require('imagemin-jpegtran'),
		imgPng = require('imagemin-pngquant');
		
//*Собираем js в один*\\
gulp.task('vendor',function(){
	return gulp.src('js/*.js')
		.pipe(concat('app.js'))
		.pipe(gulp.dest('dest/js'))
		.pipe(fsize())//*Размер*\\
		.pipe(uglify())//-----*Сжатие*-----\\
		.pipe(rename('app.min.js'))//-----*Минификация*-----\\
		.pipe(gulp.dest('dest/js'))
		.pipe(fsize())//*Размер*\\
		.on('error'. gutil.log)//-----*Работа с ошибками*---\\
});
//*Собираем js в один*\\

//*Картинко-компрессор*\\
gulp.task('compress',function(){
	return gulp.src('src/img/*')
		.pipe(imgmin(
					imgPng({quality : '40-70'})
			))
		.pipe(gulp.dest('dest/img'))
});
//*Картинко-компрессор*\\

//*Css*\\
gulp.task('sass',function(){
	return gulp.src(['src/sass/**/*.sass','!src/sass/reset.sass'])
		.pipe(sass({
			includePaths: ['node_modules/susy/sass']
			}).on('error', sass.logError))
		.pipe(autoprefixer(
			['last 10 version', '>1%', 'ie 8','IE 9', 'IE 10', 'IE 11', 'Opera 12', 'iOS 7'], {cascade:true}
		))
		.pipe(concat('style.css'))
		.pipe(gulp.dest('src/css'))
		.pipe(fsize())//*Размер*\\
		.pipe(cssnano())
		.pipe(autoprefixer(
			['last 10 version', '>1%', 'ie 8','IE 9', 'IE 10', 'IE 11', 'Opera 12', 'iOS 7'], {cascade:true}
		))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('src/css'))
		.pipe(fsize())//*Размер*\\
		.pipe(browserSync.reload({stream:true}))
})
gulp.task('reset',function(){
	return gulp.src('src/sass/reset.sass')
		.pipe(sass().on('error', sass.logError))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('src/css'))
		
});
//*Css*\\

//* jade-pug*\\
gulp.task('pug', function buildHTML(){
	return gulp.src('src/pug/**/*.pug')
		.pipe(pug({pretty: true}))
		.pipe(pugBeautify({
			fill_tab: true,
			omit_div: true,
			tab_size: 2,
			separator_space: true
		}))
		.pipe(gulp.dest('src'));
})
//* jade-pug*\\

gulp.task('clean',function(){
	return del.sync('dest');
})


gulp.task('browser-sync', function(){
	browserSync({
		server: {baseDir : 'src'},
		port: 4560
	});
});

gulp.task('watch',['browser-sync','compress', 'sass', 'pug'],function(){
	gulp.watch('src/img',['compress']);
	gulp.watch('src/sass/**/*.sass',['sass']);
	gulp.watch('src/pug/**/*.pug',['pug']);
	gulp.watch('src/*.html', browserSync.reload);
	gulp.watch('src/css/*.css', browserSync.reload);
	gulp.watch('src/js/**/*.js', browserSync.reload);
	
});

gulp.task('build', ['reset','clean','compress'], function(){
	var buildCss = gulp.src(['src/css/*.css'])
		.pipe(gulp.dest('dest/css'));
	var buildFonts = gulp.src('src/fonts/**/*')
		.pipe(gulp.dest('dest/fonts'));
	var buildHtml = gulp.src('src/*.html')
		.pipe(gulp.dest('dest/'));
	var buildJs = gulp.src('src/js/**/*.js')
		.pipe(gulp.dest('dest/js'));
});

gulp.task('default',['watch']);