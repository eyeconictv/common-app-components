(function() {
  "use strict";

  var chai = require("chai");
  var chaiAsPromised = require("chai-as-promised");
  var expect = chai.expect;

  chai.use(chaiAsPromised);
  browser.driver.manage().window().setSize(1024, 768);

  describe("scrolling list", function() {
    beforeEach(function () {
      browser.get("/test/e2e/scrolling-list/scrolling-list-scenarios.html");
    });
    
    it("Should load rows", function() {
      expect(element.all(by.css(".table-2 .list-row")).count())
        .to.eventually.equal(10);      
    });

    describe("large list: ", function() {
      beforeEach(function (done) {
        element(by.id("scrollBottom")).click();
    
        setTimeout(function() {
          done();
        }, 250);
      });
      
      it("Should load more rows on scroll", function() {
        expect(element.all(by.css(".table-2 .list-row")).count())
          .to.eventually.equal(20);
      });
    });
    
    describe("small list: ", function() {
      beforeEach(function(done) {
        element(by.id("toggleReturnItems")).click();
        element(by.id("scrollBottom")).click();
        
        setTimeout(function() {
          done();
        }, 250);
      });

      it("Should not load more rows on scroll", function() {
        expect(element.all(by.css(".table-2 .list-row")).count())
          .to.eventually.equal(10);            
      });
    });
    
    describe("clear list: ", function() {
      beforeEach(function(done) {
        element(by.id("toggleReturnItems")).click();
        element(by.id("clearList")).click();
        
        setTimeout(function() {
          done();
        }, 250);
      });

      it("Should not load more rows on scroll", function() {
        expect(element.all(by.css(".table-2 .list-row")).count())
          .to.eventually.equal(0);        
      });
    });    
  });

})();