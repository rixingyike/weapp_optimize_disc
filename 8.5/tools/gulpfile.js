// tools/gulpfile.js
const gulp = require("gulp");
const cleanwxss = require("gulp-cleanwxss");

gulp.task("default", (done) => {
  gulp.src("../miniprogram/index/pages/*/*.wxss")
    .pipe(cleanwxss({
      log: true,
    }))
    .pipe(gulp.dest("./dist"));
  done();
});

gulp.task("goods", (done) => {
  gulp.src("../miniprogram/goods/pages/*/*.wxss")
    .pipe(cleanwxss({
      log: true,
    }))
    .pipe(gulp.dest("./dist"));
  done();
});

gulp.task("user", (done) => {
  gulp.src("../miniprogram/user/pages/*/*.wxss")
    .pipe(cleanwxss({
      log: true,
    }))
    .pipe(gulp.dest("./dist"));
  done();
});