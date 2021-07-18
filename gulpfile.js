import gulp from 'gulp'
import gulpSass from 'gulp-sass'
import sass from 'sass'
import concat from 'gulp-concat'

const S = gulpSass(sass)

function buildStyles() {
  return gulp.src('./client/styles/**/*.sass')
    .pipe(S().on('error', S.logError))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./client_dist/styles'))
}

function copyAssets(){
  return gulp.src('./client/assets/**/*')
    .pipe(gulp.dest('./client_dist/assets'))
}

export const watch =  () => {
  gulp.watch('./client/styles/**/*.sass', { ignoreInitial: false },function(cb){
    console.log('build')
    buildStyles()
    cb()
  })
  gulp.watch('./client/assets/**/*', { ignoreInitial: false },function(cb){
    copyAssets()
    cb()
  })
}

export const build = gulp.series(buildStyles, copyAssets)