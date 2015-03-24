(function () {
  "use strict";

  var es = require("event-stream");
  var fs = require("fs");
  var html2js = require("gulp-html2js");
  var gulp = require("gulp");
  var watch = require("gulp-watch");
  var rename = require("gulp-rename");
  var prettify = require("gulp-jsbeautifier");
  var jshint = require("gulp-jshint");
  var runSequence = require("run-sequence");
  var path = require("path");
  var uglify = require("gulp-uglify");
  var concat = require("gulp-concat");
  var del = require("del");
  var factory = require("widget-tester").gulpTaskFactory;
  var e2ePort = process.env.E2E_PORT || 8099;

  var scriptsPath = "./src/";

  var folders = fs.readdirSync(scriptsPath)
    .filter(function(file) {
      return fs.statSync(path.join(scriptsPath, file)).isDirectory();
    });

  /*---- tooling ---*/
  gulp.task("pretty", function() {
    return gulp.src("./js/**/*.js")
      .pipe(prettify({config: ".jsbeautifyrc", mode: "VERIFY_AND_WRITE"}))
      .pipe(gulp.dest("./js"))
      .on("error", function (error) {
        console.error(String(error));
      });
  });
  
  gulp.task("lint", function() {
    return gulp.src("./src/**/*.js")
      .pipe(jshint())
      .pipe(jshint.reporter("jshint-stylish"));
  });
  
  gulp.task("clean-dist", function (cb) {
    del(['./dist/**'], cb);
  });

  gulp.task("clean-tmp", function (cb) {
    del(['./tmp/**'], cb);
  });

  gulp.task("clean", ["clean-dist", "clean-tmp"]);

  var unitTestFiles = [
    "bower_components/angular/angular.js",
    "bower_components/q/q.js",
    "bower_components/angular-mocks/angular-mocks.js",
    "bower_components/angular-spinner/angular-spinner.js",
    "bower_components/rv-loading/loading.js",
    "bower_components/angular-bootstrap/ui-bootstrap-tpls.js",
    "bower_components/ng-gapi-loader/src/js/svc-gapi.js",
    "src/config.js",
    "src/**/app.js",
    "src/**/ctr-*.js",
    "src/**/svc-*.js",
    "src/**/dtv-*.js",
    "src/**/ftr-*.js",
    "test/unit/**/*.tests.js"
  ];
  gulp.task("test:unit", factory.testUnitAngular({testFiles: unitTestFiles}));

  gulp.task("test",  function (cb) {
    runSequence("build", ["test:unit", "test:e2e"], cb);
  });
  gulp.task("server", factory.testServer({https: false}));
  gulp.task("server-close", factory.testServerClose());
  gulp.task("test:webdrive_update", factory.webdriveUpdate());
  gulp.task("test:e2e:core", ["test:webdrive_update"], factory.testE2EAngular({
    src: ["test/e2e/**/*-scenarios.js"],
    browser: "chrome"
  }));
  gulp.task("test:e2e", function (cb) {
    runSequence("server", "test:e2e:core", "server-close", cb);
  });
  
  gulp.task("html2js", function() {
    var tasks = folders.map(function(folder) {
      return gulp.src(path.join(scriptsPath, folder, "**/*.html"))
        .pipe(html2js({
        outputModuleName: "risevision.common.components." + folder,
        useStrict: true,
        base: "src"
      }))
      .pipe(rename({extname: ".js"}))
      .pipe(gulp.dest(path.join("tmp/templates/", folder)));
    });
      return es.concat.apply(null, tasks);
  });
  
  gulp.task("concat", function () { //copy angular files
    var tasks = folders.map(function(folder) {
      return gulp.src([
        path.join(scriptsPath, folder, "/app.js"),
        path.join(scriptsPath, folder, "/svc-*.js"),
        path.join(scriptsPath, folder, "/dtv-*.js"),
        path.join(scriptsPath, folder, "/ctr-*.js"),
        path.join(scriptsPath, folder, "/ftr-*.js"),
        path.join("tmp/templates/", folder, "**/*.js")
      ])
      .pipe(concat(folder + ".js"))
      .pipe(gulp.dest("dist/js"))
      .pipe(uglify())
      .pipe(rename(folder + ".min.js"))
      .pipe(gulp.dest("dist/js"));
    });
    return es.concat.apply(null, tasks);
  });

  gulp.task("build", function(cb) {
    runSequence(["clean", "pretty", "lint"], "html2js", "concat", cb);
  });

})();
