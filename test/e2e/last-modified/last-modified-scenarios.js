(function() {
  "use strict";

  var chai = require("chai");
  var chaiAsPromised = require("chai-as-promised");
  var expect = chai.expect;
  
  var formatAMPM = function(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour "0" should be "12"
    minutes = minutes < 10 ? "0"+minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  }

  chai.use(chaiAsPromised);
  browser.driver.manage().window().setSize(1024, 768);

  describe("last-modified", function() {
    beforeEach(function () {
      browser.get("/test/e2e/last-modified/last-modified-scenarios.html");
    });

    it("Should load", function () {
      expect(element(by.id("dtv1")).isPresent()).to.eventually.be.true;
      expect(element(by.id("dtv2")).isPresent()).to.eventually.be.true;
      expect(element(by.id("dtv3")).isPresent()).to.eventually.be.true;
    });
    
    it("Should show correct values", function() {
      var changedDate = new Date("2015-02-23T16:40:22.572Z");
      var time = formatAMPM(changedDate);
      var changedDateString = changedDate.getDate() + "-Feb-2015 " + time;
      
      expect(element(by.id("dtv1")).getText()).to.eventually.equal("Saved by N/A");
      expect(element(by.id("dtv2")).getText()).to.eventually.equal("Saved by user.name");
      expect(element(by.id("dtv3")).getText()).to.eventually.equal("Saved " + changedDateString + " by user.name");
    })
  });

})();
