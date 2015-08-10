(function() {
  "use strict";

  var chai = require("chai");
  var chaiAsPromised = require("chai-as-promised");
  var expect = chai.expect;

  chai.use(chaiAsPromised);
  browser.driver.manage().window().setSize(1024, 768);

  describe("distribution selector", function() {
    beforeEach(function () {
      browser.get("/test/e2e/distribution-selector/distribution-selector-scenarios.html");
    });

    it("Should load", function () {
      expect(element(by.model("distributeToAll")).isDisplayed()).to.eventually.be.true;
      expect(element(by.model("distributeToAll")).isSelected()).to.eventually.be.true;
      expect(element(by.id("distributeToAllText")).getText()).to.eventually.equal("All Displays");
    });

    it("Should show the distribution field", function () {
      element(by.model("distributeToAll")).click();

      expect(element(by.css("#distributionField")).isDisplayed())
        .to.eventually.be.true;
    });

    it("Should hide the distribution field", function () {
      element(by.model("distributeToAll")).click();
      element(by.model("distributeToAll")).click();

      expect(element(by.css("#distributionField")).isPresent())
        .to.eventually.be.false;
    });


    it("Should open dialog", function () {
      element(by.model("distributeToAll")).click();
      element(by.css("#distributionField")).click();

      expect(element(by.css(".modal-dialog .modal-content")).isPresent())
        .to.eventually.be.true;

      element.all(by.css(".modal-footer .btn")).then(function (elements) {
        expect(elements.length).to.equal(2);

        expect(elements[0].getText()).to.eventually.equal("Apply");
        expect(elements[1].getText()).to.eventually.equal("Cancel");
      });
    });

    describe("Distribution selection", function() {
      beforeEach(function() {
        element(by.model("distributeToAll")).click();
        element(by.css("#distributionField")).click();
      });

      it("Should show correct displays", function () {

        element.all(by.css(".display .display-name")).then(function (elements) {
          expect(elements.length).to.equal(3);

          expect(elements[1].getText()).to.eventually.equal("display2");
        });

        expect(element(by.css(".display .active")).isPresent())
          .to.eventually.be.false;
      });

      it("Selecting a display and clicking on the Apply Button should add it to distribution", function () {
        element.all(by.css(".display .display-name")).then(function (elements) {
          elements[1].click();
          element(by.id("applyButton")).click();

          expect(element(by.id("distributionFieldText")).getText()).to.eventually.equal('1 Display');
          expect(element(by.id("distributionValue")).getText()).to.eventually.equal('["id2"]');
          expect(element(by.id("distributeToAllValue")).getText()).to.eventually.equal('false');
        });
      });

      it("Selecting two displays and clicking on the Apply Button should add them to distribution", function () {
        element.all(by.css(".display .display-name")).then(function (elements) {
          elements[1].click();
          elements[2].click();
          element(by.id("applyButton")).click();
          browser.sleep(500);
          expect(element(by.id("distributionFieldText")).getText()).to.eventually.equal('2 Displays');
          expect(element(by.id("distributionValue")).getText()).to.eventually.equal('["id2","id3"]');
          expect(element(by.id("distributeToAllValue")).getText()).to.eventually.equal('false');

        });
      });

      it("Deselecting displays should remove displays from the distribution", function () {
        element.all(by.css(".display .display-name")).then(function (elements) {
          elements[1].click();
          elements[2].click();
          element(by.id("applyButton")).click();

          browser.sleep(1000);
          element(by.css("#distributionField")).click();
          browser.sleep(500);
          element.all(by.css(".display .display-name")).then(function (elements) {
            elements[1].click();
            elements[2].click();
            element(by.id("applyButton")).click();
            expect(element(by.id("distributionFieldText")).getText()).to.eventually.equal('0 Displays');
            expect(element(by.id("distributionValue")).getText()).to.eventually.equal('[]');
            expect(element(by.id("distributeToAllValue")).getText()).to.eventually.equal('false');
          });
        });
      });

      it("Checking all displays checkbox should set distributeToAll true", function () {
        element.all(by.css(".display .display-name")).then(function (elements) {
          elements[1].click();
          elements[2].click();
          element(by.id("applyButton")).click();
          browser.sleep(500);
          expect(element(by.id("distributionFieldText")).getText()).to.eventually.equal('2 Displays');
          expect(element(by.id("distributionValue")).getText()).to.eventually.equal('["id2","id3"]');
          expect(element(by.id("distributeToAllValue")).getText()).to.eventually.equal('false');

          element(by.model("distributeToAll")).click();
          expect(element(by.id("distributeToAllValue")).getText()).to.eventually.equal('true');
        });

      });

    });
  });

})();
