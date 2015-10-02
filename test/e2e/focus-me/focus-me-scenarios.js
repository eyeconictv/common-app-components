(function() {
  "use strict";

  var expect = require('rv-common-e2e').expect;
  browser.driver.manage().window().setSize(1024, 768);

  describe("last-modified", function() {
    beforeEach(function () {
      browser.get("/test/e2e/focus-me/focus-me-scenarios.html");
    });

    it("Should load", function () {
      expect(element(by.id("firstInput")).isPresent()).to.eventually.be.true;
      expect(element(by.id("secondInput")).isPresent()).to.eventually.be.true;
    });
    
    it("Should focus only on firstInput", function() {
      expect(element(by.id("focusedElement")).getText()).to.eventually.equal("firstInput");
    });
    
    it("Should focus on secondInput", function() {
      element(by.id("focusSecond")).click();
      
      expect(element(by.id("focusedElement")).getText()).to.eventually.equal("secondInput");
    })
  });

})();
