/* jshint expr: true */

(function() {

  "use strict";

  var chai = require("chai");
  var chaiAsPromised = require("chai-as-promised");

  chai.use(chaiAsPromised);
  var expect = chai.expect;

  var fs = require("fs");

  browser.driver.manage().window().setSize(1024, 768);

  describe("Repeat Setting Component", function() {
    beforeEach(function (){
      browser.get("/test/e2e/background-image-setting/repeat-setting-test-ng.html");
    });

    describe("** Standard functionality **", function () {

      it("Should correctly load", function () {
        expect(element(by.css("#main select[name='repeat']")).isPresent()).to.eventually.be.true;
        expect(element(by.css("#main select[name='repeat']")).isDisplayed()).to.eventually.be.true;
        expect(element(by.css("#main label")).isPresent()).to.eventually.be.true;
      });

      it("Should update the repeat model value by selecting a different option", function () {
        element(by.css("#main select[name='repeat']")).click();
        element(by.css("#main select[name='repeat'] option[value='repeat-y']")).click();

        // ng-model 'repeat' value should be bound to select element and have the correct value
        expect(element(by.css("#main select[name='repeat']")).getAttribute("value")).to.eventually.equal("repeat-y");
      });
    });

    describe("** Hiding functionality **", function () {

      it("Should hide the label", function () {
        expect(element(by.css("#hiding label")).isPresent()).to.eventually.be.false;
      });

    });

  });

})();
