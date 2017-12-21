// 引入 gulpvar gulp = require('gulp');// 引入组// sassvar sass = require('gulp-sass');// postcssvar postcss = require('gulp-postcss');var autoprefixer = require('autoprefixer');var vmin = require('postcss-vmin');var cssnext = require('cssnext');var cssnano = require('cssnano');var browserSync = require('browser-sync').create();var reload = browserSync.reload;// JSvar uglify = require('gulp-uglify');var rename = require('gulp-rename');var babel = require('gulp-babel');var jsmin = require('gulp-jsmin');// imagevar imagemin = require('gulp-imagemin');var pngquant = require('imagemin-pngquant');var cache = require('gulp-cache');var plumber = require('gulp-plumber'); // 检测错误var gutil = require('gulp-util'); // 如果有自定义方法，会用到var fileinclude = require('gulp-file-include');// 变化监控var changed = require('gulp-changed'); // 过滤改变过的文件// 合并文件var useref = require('gulp-useref');// replacevar replace = require('gulp-replace');// 清空var clean = require('gulp-clean');// distvar dist = 'src';// devvar dev = 'dev';function errorHandler(e) {    // 控制台发声,错误时beep一下    gutil.beep();    gutil.log(e);    this.emit('end');}// 清除缓存gulp.task('cleanCash', function(done) {    return cache.clearAll(done);});// Sass && Postcssgulp.task('sass', function() {    var processors = [        autoprefixer({            browsers: ['Android >= 4.3', 'iOS >= 9.3', 'Chrome >= 42', 'ff >= 49', 'ie > 8', 'Opera >= 42', 'safari >= 10']        }),        cssnext,        vmin,        cssnano({ zindex: false })    ];    return gulp.src(dev + '/**/**/*.scss')        .pipe(plumber({ errorHandler: errorHandler }))        .pipe(sass())        .pipe(postcss(processors))        .pipe(rename(function(path) {            path.basename = path.basename.replace(/\.debug/gi, ''); // 去掉编译后文件名中的debug        }))        .pipe(rename({            suffix: '.min'        }))        .pipe(gulp.dest(dist + '/test/'))        .pipe(gulp.dest(dist + '/line/'))});// browser-syncgulp.task('browser-sync', function() {    browserSync.init({        server: './',        ghostMode: false // 点击，滚动和表单在任何设备上输入将被镜像到所有设备里    });    browserSync.watch(dist + '/**/**/*.html').on('change', reload);});// jsgulp.task('js', function() {    return gulp.src(dev + '/**/**/*.js')        //.pipe(changed(dist, { extension: '.min.js' }))        .pipe(plumber({ errorHandler: errorHandler }))        .pipe(babel({            "presets": [                "es2015"            ]        }))        .pipe(rename({ suffix: '.min' }))        .pipe(gulp.dest(dist + '/test/'))        .pipe(jsmin())        .pipe(gulp.dest(dist + '/line/'))});// imagegulp.task('image', function() {    return gulp.src(dev + '/**/**/*.{png,jpg,jpeg,gif,ico}')        .pipe(plumber({ errorHandler: errorHandler }))        .pipe(cache(imagemin({            use: [pngquant()]        })))        .pipe(gulp.dest(dist + '/test/'))        .pipe(gulp.dest(dist + '/line/'));});// htmlgulp.task('html', function() {    return gulp.src(dev + '/**/**/*.html')        .pipe(fileinclude({            prefix: '@@',            basepath: '@file'        }))        .pipe(plumber({ errorHandler: errorHandler }))        .pipe(gulp.dest(dist + '/test/'))        .pipe(replace(/\.\.\/\.\.\//ig, '/'))        .pipe(replace(/\.\.\/\.\.\//ig, '/'))        .pipe(replace(/<!--[\d\D\f\n\r\s\S\t\v\w\W]*?-->/ig, ' '))        .pipe(replace(/>\s+?</ig, '><'))        .pipe(gulp.dest(dist + '/line/'))        .pipe(reload({ stream: true }));});// // extras// gulp.task('extras', function() {//     return gulp.src([//             dev + '/**/*.*',//             '!' + dev + '/**/**/*.scss',//             '!' + dev + '/**/**/*.js'//         ])//         .pipe(gulp.dest(dist + '/test/'))//         .pipe(gulp.dest(dist + '/line/'));// });// cleangulp.task('clean', function() {    return gulp.src(dist)        .pipe(plumber({ errorHandler: errorHandler }))        .pipe(clean({            read: false,            force: true        }));});// watchgulp.task('watch', function() {    gulp.watch(dev + '/**/**/*.scss', ['sass']);    gulp.watch(dev + '/**/**/*.js', ['js']);    gulp.watch(dev + '/**/**/*.{png,jpg,jpeg,gif,ico}', ['image']);    gulp.watch(dev + '/**/**/*.html', ['html']);});// 默认任务 清空图片、样式、js并重建 运行语句 gulpgulp.task('default', ['clean'], function() {    gulp.start('sass', 'js', 'image', 'watch', 'html', 'extras', 'browser-sync');});