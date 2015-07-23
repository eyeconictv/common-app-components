(function() {
  "use strict";

  var chai = require("chai");
  var chaiAsPromised = require("chai-as-promised");
  var expect = chai.expect;

  chai.use(chaiAsPromised);
  browser.driver.manage().window().setSize(1024, 768);

  describe("modal-lookup-textbox", function() {
    beforeEach(function () {
      browser.get("/test/e2e/timeline/timeline-textbox-scenarios.html");
    });
    
    beforeEach(function() {
      element(by.id("timelineTextbox")).click();
      
      browser.sleep(500);
    });

    it("Should load", function () {
      expect(element(by.id("timelineTextbox")).isPresent())
        .to.eventually.be.true;
    });
    
    it("Should open dialog", function (done) {
      
      expect(element(by.css(".modal-body .timeline")).isPresent())
        .to.eventually.be.true;
        
      element.all(by.css(".modal-footer .btn")).then(function (elements) {
        expect(elements.length).to.equal(2);

        expect(elements[1].getText()).to.eventually.equal("Cancel");
        
        done();
      });
    });
    
    it("Should intitialize defaults", function() {

      expect(element(by.model("timeline.everyDay")).isPresent())
        .to.eventually.be.true;
      expect(element(by.model("timeline.everyDay")).isSelected())
        .to.eventually.be.true;

      expect(element(by.model("timeline.allDay")).isPresent())
        .to.eventually.be.true;
      expect(element(by.model("timeline.allDay")).isSelected())
        .to.eventually.be.true;
        
      expect(element(by.model("timeline.hasRecurrence")).isPresent())
        .to.eventually.be.true;
      expect(element(by.model("timeline.hasRecurrence")).isSelected())
        .to.eventually.be.false;
        
      expect(element(by.id("Daily")).isDisplayed())
        .to.eventually.be.false;
      
      expect(element(by.model("recurrence.daily.recurrenceFrequency")).isDisplayed())
        .to.eventually.be.false;

    });
    
    it("Should show date fields if everyday is checked off", function() {
      element(by.model("timeline.everyDay")).click();

      expect(element(by.id("startDate")).isPresent())
        .to.eventually.be.true;
      expect(element(by.id("startDate")).getAttribute('value'))
        .to.eventually.be.ok;
          
      expect(element(by.id("endDate")).isPresent())
        .to.eventually.be.true;
      expect(element(by.id("endDate")).getAttribute('value'))
        .to.eventually.not.be.ok;

    });

    it("Should show time fields if allday is checked off", function() {
      element(by.model("timeline.allDay")).click();

      expect(element(by.id("startTime")).isPresent())
        .to.eventually.be.true;
      expect(element(by.id("endTime")).isPresent())
        .to.eventually.be.true;

    });
    
    describe("Recurrence: ", function() {
      beforeEach(function() {
        element(by.model("timeline.hasRecurrence")).click();
      });
      
      it("Should show daily fields", function() {
        expect(element(by.id("Daily")).isDisplayed()).to.eventually.be.true;
        expect(element(by.id("Daily")).isSelected()).to.eventually.be.true;
        
        expect(element(by.model("recurrence.daily.recurrenceFrequency")).isPresent())
          .to.eventually.be.true;
        expect(element(by.model("recurrence.daily.recurrenceFrequency")).getAttribute('value'))
          .to.eventually.equal("1");

      });
      
      it("Should show weekly fields", function() {
        element(by.id("Weekly")).click();

        expect(element(by.model("recurrence.weekly.recurrenceFrequency")).isPresent())
          .to.eventually.be.true;
        expect(element(by.model("recurrence.weekly.recurrenceFrequency")).getAttribute('value'))
          .to.eventually.equal("1");
          
        expect(element.all(by.css(".timelineWeekdays input")).count())
          .to.eventually.equal(7);

      });
      
      it("Should show monthly fields", function() {
        element(by.id("Monthly")).click();

        expect(element(by.model("recurrence.monthly.absolute.recurrenceFrequency")).isPresent())
          .to.eventually.be.true;
        expect(element(by.model("recurrence.monthly.absolute.recurrenceFrequency")).getAttribute('value'))
          .to.eventually.equal("1");
          
        expect(element(by.model("recurrence.monthly.relative.recurrenceFrequency")).isPresent())
          .to.eventually.be.true;
        expect(element(by.model("recurrence.monthly.relative.recurrenceFrequency")).isEnabled())
          .to.eventually.be.false;
        expect(element(by.model("recurrence.monthly.relative.recurrenceFrequency")).getAttribute('value'))
          .to.eventually.equal("1");

      });

      it("Should show yearly fields", function() {
        element(by.id("Yearly")).click();

        expect(element(by.model("recurrence.yearly.absolute.recurrenceDayOfMonth")).isPresent())
          .to.eventually.be.true;
        expect(element(by.model("recurrence.yearly.absolute.recurrenceDayOfMonth")).getAttribute('value'))
          .to.eventually.equal("1");
          
      });


    });

  
  });

})();
