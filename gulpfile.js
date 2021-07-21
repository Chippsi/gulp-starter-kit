import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import sassDart from 'sass'
import prefix from 'gulp-autoprefixer';
import uglify from 'gulp-uglify-es';
import concat from 'gulp-concat';
import babel from 'gulp-babel';
import rename from 'gulp-rename';
import del from 'del';
import gulpif from 'gulp-if';
import plumber from 'gulp-plumber';
import sync from 'browser-sync';
import changed from 'gulp-changed';
import { setup as emittySetup } from "@zoxon/emitty";
import imagemin from 'gulp-imagemin';
import imageminPngquant from 'imagemin-pngquant';
import convertWebP from 'gulp-webp';
import svgSprite from 'gulp-svg-sprite';
import fs from 'fs';
import include from 'gulp-file-include';

const sass = gulpSass(sassDart);
// pug__bem--on
import pug from 'gulp-pug';
import pugbem from 'gulp-pugbem';
pugbem.b = true;

//webp to css
import webpcss from 'gulp-webpcss';
import media_concat from 'gulp-group-css-media-queries';

let isProd = false; // Продакшен или нет?
let fontsReady = false;


//-->@zoxon/emitty Ускорение компиляции (.pug, ) --------------------------
const emittyPug = emittySetup("app/pug", "pug", {
    makeVinylFile: true
});

global.watch = false;
global.emittyChangedFile = {
    path: "",
    stats: null
};

//-->HTML -----------------------------------------------------------------
export const html = () => {
    return gulp.src('app/pug/pages/*.pug')
        .pipe(plumber())
        .pipe(
            gulpif(
                global.watch,
                emittyPug.stream(
                    global.emittyChangedFile.path,
                    global.emittyChangedFile.stats
                )
            )
        )
        .pipe(pug({
            pretty: true,
            plugins: [pugbem]
        }))
        .pipe(gulp.dest('build'))
        .pipe(sync.stream());
}

//-->Стили ----------------------------------------------------------------
export const style = () => {
    return gulp.src('app/sass/style.sass')
        .pipe(sass({ outputStyle: 'expanded' }))
        .pipe(prefix({
            grid: true,
            cascade: false,
        }))
        .pipe(webpcss({
            webpClass: "._webp",
            noWebpClass: "._no-webp"
        }))
        .pipe(media_concat())
        .pipe(gulp.dest('build/css'))
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(rename({
            suffix: '.min',
            extname: '.css'
        }))
        .pipe(gulp.dest('build/css'))
        .pipe(sync.stream());
}

//-->JavaScript ------------------------------------------------------------
export const vendorsJs = () => {
    return gulp.src('./app/js/vendors.js')
        .pipe(include())
        .pipe(concat('vendors.js'))
        .pipe(gulp.dest('build/js'))
        .pipe(concat('vendors.min.js'))
        .pipe(uglify.default())
        .pipe(gulp.dest('build/js'))
        .pipe(sync.stream());
}

export const mainJs = () => {
    return gulp.src('./app/js/scripts.js')
        .pipe(include())
        .pipe(concat('main.js'))
        .pipe(babel({
            presets: [
                [
                        "@babel/preset-env"
                ]
            ]
        }))
        .pipe(gulp.dest('build/js'))
        .pipe(concat('main.min.js'))
        .pipe(uglify.default())
        .pipe(gulp.dest('build/js'))
        .pipe(sync.stream());
}

//-->Изображения ------------------------------------------------------------
export const images = () => {
    return gulp.src(['app/img/**/*'])
        .pipe(changed('build/img'))
        .pipe(gulpif(isProd, imagemin([
            imagemin.mozjpeg({ quality: 70 }),
            imagemin.svgo(),
            imageminPngquant({ quality: [0.5, 0.7] })
        ], {
            verbose: true,
        }
        )))
        .pipe(gulp.dest('build/img'))
        .pipe(sync.stream());
}

export const webp = () => {
    return gulp.src(['app/img/**/*.{jpg,jpeg,png}'])
        .pipe(changed('build/img', { extension: '.webp' }))
        .pipe(convertWebP({ quality: 70 }))
        .pipe(gulp.dest('build/img'))
        .pipe(sync.stream());
}

//-->SVG --------------------------------------------------------------------
export const svgMono = () => {
    return gulp.src(['app/icons-sprite/iconsMono/**/*.svg'])
        .pipe(svgSprite({
            mode: {
                symbol: {
                    sprite: '../sprites/sprite-mono.svg',
                },
            },
            shape: {
                transform: [
                    {
                        svgo: {
                            plugins: [
                                {
                                    removeAttrs: {
                                        attrs: ['class', 'data-name', 'fill', 'stroke.*']
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        }))
        .pipe(gulp.dest('build/img/'))
        .pipe(sync.stream());
}
export const svgMulti = () => {
    return gulp.src(['app/icons-sprite/iconsMulti/**/*.svg'])
        .pipe(svgSprite({
            mode: {
                symbol: {
                    sprite: '../sprites/sprite-multi.svg',
                },
            },
            shape: {
                transform: [
                    {
                        svgo: {
                            plugins: [
                                {
                                    removeAttrs: {
                                        attrs: ['class', 'data-name'],
                                    },
                                },
                                {
                                    removeUselessStrokeAndFill: false,
                                },
                                {
                                    inlineStyles: true,
                                }
                            ],
                        },
                    },
                ],
            },
        }))
        .pipe(gulp.dest('build/img/'))
        .pipe(sync.stream());
}

//-->Шрифты -----------------------------------------------------------------
export const fonts = () => {
    return gulp.src(['app/fonts/**/*.{woff,woff2}'])
        .pipe(gulp.dest('build/fonts'))
        .pipe(sync.stream());
}


const cb = () => { } //! Не удалять!
export const fontstyle = (done) => {
    if (fontsReady) {
        let file_content = fs.readFileSync('./app/sass/default/fonts.sass');

        fs.writeFile('./app/sass/default/fonts.sass', '', cb);
        fs.readdir('./build/fonts/', function (err, items) {
            if (items) {
                let c_fontname;
                for (var i = 0; i < items.length; i++) {
                    let fontname = items[i].split('.');
                    fontname = fontname[0];
                    if (c_fontname != fontname) {
                        fs.appendFile('./app/sass/default/fonts.sass', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
                    }
                    c_fontname = fontname;
                }
            }
        })
    }
    done()
}

//-->Лайв-сервер ------------------------------------------------------------
export const server = () => {
    sync.init({
        ui: false,
        notify: false,
        server: {
            baseDir: "build/"
        }
    });
}

//-->Чистка папки с проектом ----------------------------------------------
export const clean = () => {
    return del('build');
}

//-->Отслеживание изменений в файлах ----------------------------------------
export const watch = () => {
    global.watch = true;
    gulp.watch('app/pug/**/*.pug', html).on('all', (event, filepath, stats) => {
        global.emittyChangedFile = {
            path: filepath,
            stats
        };
    });
    gulp.watch('app/sass/**/*.sass', gulp.series(style));
    gulp.watch(['app/js/vendors.js', 'app/js/libs/**/*.js'], gulp.series(vendorsJs));
    gulp.watch(['app/js/scripts.js', 'app/js/components/**/*.js'], gulp.series(mainJs));
    gulp.watch('app/fonts/**/*.{woff,woff2}', gulp.series(fonts, fontstyle));
    gulp.watch('app/img/**/*', gulp.series(images, webp));
    gulp.watch('app/icons-sprite/iconsMono/**/*', gulp.series(svgMono));
    gulp.watch('app/icons-sprite/iconsMulti/**/*', gulp.series(svgMulti));
}

//-->Начальные инструкции при запуске gulp -----------------------------------
export default gulp.series(
    clean,
    gulp.parallel(
        html,
        style,
        vendorsJs,
        mainJs,
        fonts,
        images,
        svgMono,
        svgMulti
    ),
    gulp.parallel(
        webp,
        fontstyle
    ),
    gulp.parallel(
        watch,
        server
    ),
)