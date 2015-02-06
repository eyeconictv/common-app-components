var path = require("path");
module.exports = function(config){
	var pre = {};
    pre[path.join(__dirname,'../../src/**/ctr-*.js')] = 'coverage';
    pre[path.join(__dirname,'../../src/**/svc-*.js')] = 'coverage';
  pre[path.join(__dirname,'../../src/**/flt-*.js')] = 'coverage';
	config.set({

    autoWatch : false,

    frameworks: ["mocha", "chai", "chai-as-promised"],

    browsers : ["PhantomJS"],

    preprocessors : pre,

    reporters: ["progress", "junit", "coverage"],

    plugins : [
            "karma-mocha",
            "karma-chai",
            "karma-junit-reporter",
            "karma-coverage",
            "karma-chai-plugins",
            "karma-phantomjs-launcher"
            ],

    junitReporter : {
      outputFile: path.join(__dirname, "../../reports/karma-xunit.xml")
    },

    // optionally, configure the reporter
    coverageReporter: {
      type : "cobertura",//for jenkins to read and display the coverage repor
    //type:'html',//set this to html for a nice human report
      dir : path.join(__dirname, "../../reports/coverage")
    },

    // web server port
    port: 9876,
    logLevel: config.LOG_INFO,

    // enable / disable colors in the output (reporters and logs)
    colors: true

  });
};
