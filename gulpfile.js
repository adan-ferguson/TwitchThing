import gulp from 'gulp'
import merge from 'merge-stream'
import gulpSass from 'gulp-sass'
import sass from 'sass'
import concat from 'gulp-concat'
import through from 'through2'
import VinylFile from 'vinyl'
import path from 'path'

const S = gulpSass(sass)
const REGISTRIES = ['items', 'monsters', 'mods', 'skills', 'statusEffects', 'stats', 'actionDefs']
const SERVER_REGISTRIES = ['actions']

function buildStyles(){
  return gulp.src('./client/styles/**/*.*ss')
    .pipe(S().on('error', S.logError))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./client_dist/styles'))
}

function copyAssets(){
  return gulp.src('./client/assets/**/*')
    .pipe(gulp.dest('./client_dist/assets'))
}

function generateRegistries(){
  const pipes = REGISTRIES.map(t => {
    return gulp.src('./game/' + t + '/*/**/*.js')
      .pipe(exporterConcater(t, './game/' + t + '/combined.js'))
      .pipe(gulp.dest('.'))
  })
  const serverPipes = SERVER_REGISTRIES.map(t => {
    return gulp.src('./server/' + t + '/*/**/*.js')
      .pipe(exporterConcater(t, './server/' + t + '/combined.js'))
      .pipe(gulp.dest('.'))
  })
  return merge(...pipes, ...serverPipes)
}

function importComponents(){
  return gulp.src('./client/js/components/**/*.js')
    .pipe(makeComponentImporter('./client/js/'))
    .pipe(gulp.dest('.'))
}

function exporterConcater(itemType, targetFile){
  const files = []

  return through.obj(function(file, encoding, callback){
    if(!file.isNull()){
      const relPath = path.relative(path.dirname(targetFile), file.path).split(path.sep)
      files.push({
        path: relPath.join(path.posix.sep),
        group: relPath[0],
        name: toClassName(path.basename(file.path))
      })
    }
    callback()
  }, function(callback){
    if(!files.length){
      return callback()
    }
    let outputFile = new VinylFile()
    outputFile.path = path.resolve(outputFile.base, targetFile)
    outputFile.contents = Buffer.from(combinedFileContents())
    this.push(outputFile)
    callback()
  })

  function combinedFileContents(){
    let str = ''
    const all = []
    files.forEach(({ name, path, group }) => {
      str += `import ${name} from './${path}'\n`
      all.push(name)
    })
    str += `export default { ${all.join(',')} }\n`
    return str
  }
}

function makeComponentImporter(targetPath){

  const files = []

  return through.obj(function(file, encoding, callback){
    if(!file.isNull()){
      const relPath = path.relative(path.dirname(targetPath), file.path).split(path.sep)
      relPath[0] = '.'
      files.push(relPath.join(path.posix.sep))
    }
    callback()
  }, function(callback){
    if(!files.length){
      return callback()
    }
    let outputFile = new VinylFile()
    outputFile.path = path.resolve(targetPath, 'componentImporter.js')
    outputFile.contents = Buffer.from(combinedFileContents())
    this.push(outputFile)
    callback()
  })

  function combinedFileContents(){
    let str = ''
    files.forEach(file => {
      str += `import '${file}'\n`
    })
    return str
  }
}

function copyFromDeploy(){
  return gulp.src('./deploy/scripts/**/*').pipe(gulp.dest('./client_dist/scripts'))
}

function copyToDeploy(){
  return gulp.src('./client_dist/scripts/**/*').pipe(gulp.dest('./deploy/scripts'))
}

export const watch = () => {
  gulp.watch('./client/js/components/**/*.js', { ignoreInitial: false }, importComponents)
  gulp.watch('./client/styles/**/*.sass', { ignoreInitial: false }, buildStyles)
  gulp.watch('./client/assets/**/*', { ignoreInitial: false }, copyAssets)
  gulp.watch(['./game/*/**/*.js', '!./game/**/combined.js'], { ignoreInitial: false }, generateRegistries)
}

export const prod = gulp.series(importComponents, buildStyles, copyAssets, generateRegistries, copyFromDeploy)
export const deploy = gulp.series(importComponents, buildStyles, copyAssets, generateRegistries, copyToDeploy)
export default gulp.series(importComponents, buildStyles, copyAssets, generateRegistries)

function toClassName(filename){
  return filename.split('.')[0]
}