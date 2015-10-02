(function() {
  "use strict";

  var expect = require('rv-common-e2e').expect;
  browser.driver.manage().window().setSize(1024, 768);

  describe("modal-lookup-textbox", function() {
    beforeEach(function () {
      browser.get("/test/e2e/tag-selector/tag-textbox-scenarios.html");
    });

    it("Should load", function () {
      expect(element(by.css("#testTagTextBox div")).isPresent())
        .to.eventually.be.true;
    });
    
    it("Should open dialog", function () {
      element(by.css("#testTagTextBox div")).click();
      
      expect(element(by.css(".modal-dialog .modal-content")).isPresent())
        .to.eventually.be.true;
        
      element.all(by.css(".modal-footer .btn")).then(function (elements) {
        expect(elements.length).to.equal(2);

        expect(elements[1].getText()).to.eventually.equal("Cancel");
      });  
    });
    
    describe("Tag selection", function() {
      beforeEach(function() {
        element(by.css("#testTagTextBox div")).click();        
      });
      
      it("Should show correct tags", function () {

        element.all(by.css(".select-tags .label-tag")).then(function (elements) {
          expect(elements.length).to.equal(2);

          expect(elements[1].getText()).to.eventually.equal("tag2: value2");
        });
        
        expect(element(by.css(".selected-tags .label-tag")).isPresent())
          .to.eventually.be.false;
      });
      
      it("Clicking a tag should add it to the top list", function () {
        element.all(by.css(".select-tags .label-tag")).then(function (elements) {
          elements[1].click();

          expect(element.all(by.css(".select-tags .label-tag")).count())
            .to.eventually.equal(1);
    
          expect(element.all(by.css(".selected-tags .label-tag")).count())
            .to.eventually.equal(1);        
        });      
      });
      
      it("Clicking remove tag should add it to the bottom list", function () {
        element.all(by.css(".select-tags .label-tag")).then(function (elements) {
          elements[1].click();

          element(by.css(".selected-tags .label-tag")).click();
          
          expect(element.all(by.css(".select-tags .label-tag")).count())
            .to.eventually.equal(2);
            
          expect(element(by.css(".selected-tags .label-tag")).isPresent())
            .to.eventually.be.false;
        });      
      });
    });
    
    describe("Save tags", function() {
      beforeEach(function() {
        element(by.css("#testTagTextBox div")).click();        

        element.all(by.css(".select-tags .label-tag")).then(function (elements) {
          elements[1].click();
        });
      });
      
      it("Cancel closes dialog", function () {
        element.all(by.css(".modal-footer .btn")).then(function (elements) {
          elements[1].click();
          
          expect(element(by.css(".modal-dialog .modal-content")).isPresent())
            .to.eventually.be.false;

          expect(element(by.css(".label-tag .tag-name")).isPresent())
            .to.eventually.be.false;
        });
      });
      
      it("Save persists tags", function () {
        element.all(by.css(".modal-footer .btn")).then(function (elements) {
          elements[0].click();
          
          expect(element(by.css(".modal-dialog .modal-content")).isPresent())
            .to.eventually.be.false;

          expect(element(by.css(".content-box .label-tag .tag-name")).isPresent())
            .to.eventually.be.true;
            
          expect(element(by.css(".content-box .label-tag .tag-name")).getText())
            .to.eventually.equal("tag2");
        });
      });
    });
  });

})();
