const gulp = require('gulp');
const del = require('del')
const sass = require('gulp-sass');
const pug = require('gulp-pug');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();

function style() {
    return gulp.src('./scss/**/*.scss')
        .pipe(sass.sync({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream())
}

function pugjs() {
    return gulp.src('./**/*.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('./dist/'))
        .pipe(browserSync.stream())
}

function image() {
    return gulp.src('./img/**/*')
        .pipe(imagemin({verbose: true}))
        .pipe(gulp.dest('dist/img/'))
}

function js() {
    return gulp.src('./js/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js/'))
        .pipe(browserSync.stream())
}

function deleteDist() {
    return del('dist/*');
}

function wwatch() {
    gulp.watch('./**/*.pug', pugjs)
    gulp.watch('./scss/**/*.scss', style)
    gulp.watch('./img/**/*', image)
    gulp.watch('./js/**/*.js', js)
    gulp.watch('dist/*').on('change', browserSync.reload)

    browserSync.init({
        server: {
            baseDir: './dist'
        }
    })
}

exports.style = style;
exports.pugjs = pugjs;
exports.image = image;
exports.js = js;
exports.wwatch = wwatch;
exports.deleteDist = deleteDist;

const build = gulp.parallel(deleteDist,pugjs,style,image,js,wwatch);

gulp.task('default', build);