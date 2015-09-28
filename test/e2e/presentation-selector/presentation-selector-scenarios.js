(function() {
  "use strict";

  var chai = require("chai");
  var chaiAsPromised = require("chai-as-promised");
  var helper = require("../helper.js");
  var expect = chai.expect;

  chai.use(chaiAsPromised);
  browser.driver.manage().window().setSize(1024, 768);

  describe("presentation selector", function() {
    beforeEach(function () {
      browser.get("/test/e2e/presentation-selector/presentation-selector-scenarios.html");
    });

    it("Should load", function () {
      expect(element(by.id("addPresentationButton")).isDisplayed()).to.eventually.be.true;
    });

    it("Should show select presentation 1", function () {
      element(by.id("addPresentationButton")).click();
      helper.wait(element(by.css(".modal-dialog .modal-content")), "Presentation modal");


      var presentations = element.all(by.repeater('presentation in presentations.list'));
      presentations.get(0).click();
      browser.sleep(500);

      expect(element(by.id("presentationId")).getText()).to.eventually.equal("id1");
      expect(element(by.id("presentationName")).getText()).to.eventually.equal("presentation1");
    });

    it("Should show select presentation 2", function () {
      element(by.id("addPresentationButton")).click();
      helper.wait(element(by.css(".modal-dialog .modal-content")), "Presentation modal");

      var presentations = element.all(by.repeater('presentation in presentations.list'));
      presentations.get(1).click();
      browser.sleep(500);

      expect(element(by.id("presentationId")).getText()).to.eventually.equal("id2");
      expect(element(by.id("presentationName")).getText()).to.eventually.equal("presentation2");

    });

    it("Should show select presentation 3", function () {
      element(by.id("addPresentationButton")).click();
      helper.wait(element(by.css(".modal-dialog .modal-content")), "Presentation modal");

      var presentations = element.all(by.repeater('presentation in presentations.list'));
      presentations.get(2).click();

      expect(element(by.id("presentationId")).getText()).to.eventually.equal("id3");
      expect(element(by.id("presentationName")).getText()).to.eventually.equal("presentation3");

    });
  });

})();
