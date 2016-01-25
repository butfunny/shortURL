var gulp = require('gulp');

var nodemon = require('gulp-nodemon');
gulp.task('start-server', function () {

    nodemon({
        script: 'app.js',
        ext: 'js',
        "ignore": [
            ".idea/",
            ".git/",
            "build/",
            "doc/",
            "node_modules/",
            "src/public",
            "src/common/public"
        ],
        env: { 'NODE_ENV': 'development' }
    });

});