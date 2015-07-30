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

      expect(factory.timeline.timeDefined).to.be.false;

      expect(factory.timeline.everyDay).to.be.true;
      expect(factory.timeline.allDay).to.be.true;

      expect(factory.timeline.startTime).to.be.ok;
      expect(factory.timeline.endTime).to.be.ok;
      
      expect(factory.timeline.recurrenceType).to.equal("Daily");
      expect(factory.timeline.recurrenceFrequency).to.equal(1);
    });

    it('should save timeline correctly',function(){
      var factory = new TimelineFactory({});
      factory.timeline.timeDefined = true;
      factory.timeline.hasRecurrence = true;
      factory.timeline.recurrenceType = "Weekly";
      factory.recurrence.weekly.tuesday = true;
      factory.save();
      
      expect(factory.timeline.timeDefined).to.be.true;

      expect(factory.timeline.startTime).to.not.be.ok;
      expect(factory.timeline.endTime).to.not.be.ok;
      
      expect(factory.timeline.recurrenceType).to.equal("Weekly");
      expect(factory.timeline.recurrenceDaysOfWeek).to.deep.equal(["Tue"]);
    });
  });

  describe('New timeline: ' ,function () {
    it('should default to timeDefined is false if no recurrence is entered',function(){
      var factory = new TimelineFactory({});
      
      factory.timeline.timeDefined = true;
      factory.timeline.hasRecurrence = false;
      factory.timeline.recurrenceType = "Weekly";
      factory.recurrence.weekly.tuesday = true;

      factory.save();

      expect(factory.timeline.timeDefined).to.be.false;

      expect(factory.timeline.recurrenceType).to.equal("Daily");
      expect(factory.timeline.recurrenceFrequency).to.equal(1);
    });

    it('should load absolute recurrence correctly',function(){
      var factory = new TimelineFactory({
        timeDefined: true,
        recurrenceType: "Monthly",
        recurrenceAbsolute: true
      });
      factory.save();
      
      expect(factory.timeline.timeDefined).to.be.true;

      expect(factory.timeline.recurrenceType).to.equal("Monthly");
      expect(factory.timeline.recurrenceAbsolute).to.be.true;
    });

  });
});
