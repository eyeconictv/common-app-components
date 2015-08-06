'use strict';
describe('service: TimelineFactory ', function() {
  beforeEach(module("risevision.common.components.timeline.services"));
  var TimelineFactory;

  beforeEach(function(){
    inject(function($injector){
      TimelineFactory = $injector.get('TimelineFactory');
    });
  });
  
  it('should exist',function(){
    var factory = new TimelineFactory({});
    
    expect(factory).to.be.truely;

    expect(factory.save).to.be.a('function');
    expect(factory.recurrence).to.be.a('object');
    expect(factory.timeline).to.be.a('object');

  });

  describe('New timeline: ' ,function () {
    it('should initialize timeline correctly',function(){
      var factory = new TimelineFactory({});

      expect(factory.timeline.everyDay).to.be.true;
      expect(factory.timeline.allDay).to.be.true;

      expect(factory.timeline.startTime).to.be.ok;
      expect(factory.timeline.endTime).to.be.ok;
      
      expect(factory.timeline.recurrenceType).to.equal("Daily");
      expect(factory.timeline.recurrenceFrequency).to.equal(1);
    });

    it('should save timeline correctly',function(){
      var factory = new TimelineFactory({});
      factory.timeline.hasRecurrence = true;
      factory.timeline.recurrenceType = "Weekly";
      factory.recurrence.weekly.tuesday = true;
      factory.save();
      
      expect(factory.timeline.startTime).to.not.be.ok;
      expect(factory.timeline.endTime).to.not.be.ok;
      
      expect(factory.timeline.recurrenceType).to.equal("Weekly");
      expect(factory.timeline.recurrenceDaysOfWeek).to.deep.equal(["Tue"]);
    });
  });

  describe('Existing timeline: ' ,function () {
    it('should load startDate correctly',function(){
      var factory = new TimelineFactory({
        startDate: new Date()
      });
      
      expect(factory.timeline.everyDay).to.be.false;
    });

    it('should load startTime/endTime correctly',function(){
      var factory = new TimelineFactory({
        startTime: new Date(),
        endTime: new Date()
      });
      
      expect(factory.timeline.allDay).to.be.false;
    });

    it('should load monthly recurrence defaults correctly',function(){
      var factory = new TimelineFactory({
        recurrenceType: "Monthly"
      });
      
      expect(factory.recurrence.monthly.recurrenceAbsolute).to.be.true;
      expect(factory.recurrence.monthly.absolute.recurrenceFrequency).to.equal(1);
      expect(factory.recurrence.monthly.absolute.recurrenceDayOfMonth).to.equal(1);
      
      factory.save();
      
      expect(factory.timeline.recurrenceType).to.equal("Monthly");
      expect(factory.timeline.recurrenceAbsolute).to.be.true;
      expect(factory.timeline.recurrenceFrequency).to.equal(1);
      expect(factory.timeline.recurrenceDayOfMonth).to.equal(1);
    });
    
    it('should load monthly relative recurrence defaults correctly',function(){
      var factory = new TimelineFactory({
        recurrenceType: "Monthly",
        recurrenceAbsolute: false
      });
      
      expect(factory.recurrence.monthly.recurrenceAbsolute).to.be.false;
      expect(factory.recurrence.monthly.relative.recurrenceFrequency).to.equal(1);
      expect(factory.recurrence.monthly.relative.recurrenceWeekOfMonth).to.equal(0);
      expect(factory.recurrence.monthly.relative.recurrenceDayOfWeek).to.equal(0);

      factory.save();
      
      expect(factory.timeline.recurrenceType).to.equal("Monthly");
      expect(factory.timeline.recurrenceAbsolute).to.be.false;
      expect(factory.timeline.recurrenceFrequency).to.equal(1);
      expect(factory.timeline.recurrenceWeekOfMonth).to.equal(0);
      expect(factory.timeline.recurrenceDayOfWeek).to.equal(0);
    });
    
    it('should load yearly recurrence defaults correctly',function(){
      var factory = new TimelineFactory({
        recurrenceType: "Yearly"
      });
      
      expect(factory.recurrence.yearly.recurrenceAbsolute).to.be.true;
      expect(factory.recurrence.yearly.absolute.recurrenceMonthOfYear).to.equal(0);
      expect(factory.recurrence.yearly.absolute.recurrenceDayOfMonth).to.equal(1);
      
      factory.save();
      
      expect(factory.timeline.recurrenceType).to.equal("Yearly");
      expect(factory.timeline.recurrenceAbsolute).to.be.true;
      expect(factory.timeline.recurrenceMonthOfYear).to.equal(0);
      expect(factory.timeline.recurrenceDayOfMonth).to.equal(1);
    });
    
    it('should load yearly relative recurrence defaults correctly',function(){
      var factory = new TimelineFactory({
        recurrenceType: "Yearly",
        recurrenceAbsolute: false
      });
      
      expect(factory.recurrence.yearly.recurrenceAbsolute).to.be.false;
      expect(factory.recurrence.yearly.relative.recurrenceDayOfWeek).to.equal(0);
      expect(factory.recurrence.yearly.relative.recurrenceWeekOfMonth).to.equal(0);
      expect(factory.recurrence.yearly.relative.recurrenceMonthOfYear).to.equal(0);

      factory.save();
      
      expect(factory.timeline.recurrenceType).to.equal("Yearly");
      expect(factory.timeline.recurrenceAbsolute).to.be.false;
      expect(factory.timeline.recurrenceDayOfWeek).to.equal(0);
      expect(factory.timeline.recurrenceWeekOfMonth).to.equal(0);
      expect(factory.timeline.recurrenceMonthOfYear).to.equal(0);
    });
    
    
  });
});
