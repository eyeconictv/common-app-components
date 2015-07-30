"use strict";

angular.module("risevision.common.components.timeline.services")
  .factory("TimelineFactory", [

    function () {
      return function (timeline) {
        var RECURRENCE = {
          DAILY: "Daily",
          WEEKLY: "Weekly",
          MONTHLY: "Monthly",
          YEARLY: "Yearly"
        };
        var _getDateTime = function (hour, minute) {
          var d = new Date();

          if (_timeline.useLocaldate) {
            d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(),
              hour, minute, 0));
          } else {
            d.setHours(hour);
            d.setMinutes(minute);
            d.setSeconds(0);

            d = d.toLocaleDateString("en-US") + " " +
              d.toLocaleTimeString("en-US");
          }

          return d;
        };

        var _timeline = timeline;
        var _recurrence = {
          daily: {
            recurrenceFrequency: 1
          },
          weekly: {
            recurrenceFrequency: 1
          },
          monthly: {
            recurrenceAbsolute: true,
            absolute: {
              recurrenceFrequency: 1,
              recurrenceDayOfMonth: 1
            },
            relative: {
              recurrenceFrequency: 1,
              recurrenceWeekOfMonth: 0,
              recurrenceDayOfWeek: 0
            }
          },
          yearly: {
            recurrenceAbsolute: true,
            absolute: {
              recurrenceMonthOfYear: 0,
              recurrenceDayOfMonth: 1
            },
            relative: {
              recurrenceDayOfWeek: 0,
              recurrenceWeekOfMonth: 0,
              recurrenceMonthOfYear: 0
            }
          },
        };

        var _updateRecurrence = function () {
          _timeline.hasRecurrence = _timeline.timeDefined;

          if (_timeline.recurrenceType === RECURRENCE.DAILY) {
            if (_timeline.recurrenceFrequency === 1) {
              _timeline.hasRecurrence = false;
            }

            _recurrence.daily.recurrenceFrequency = _timeline.recurrenceFrequency;

          } else if (_timeline.recurrenceType === RECURRENCE.WEEKLY) {
            _recurrence.weekly.recurrenceFrequency = _timeline.recurrenceFrequency;

            for (var i = 0; i < _timeline.recurrenceDaysOfWeek.length; i++) {
              if (_timeline.recurrenceDaysOfWeek[i] === "Mon") {
                _recurrence.weekly.monday = true;
              } else if (_timeline.recurrenceDaysOfWeek[i] === "Tue") {
                _recurrence.weekly.tuesday = true;
              } else if (_timeline.recurrenceDaysOfWeek[i] === "Wed") {
                _recurrence.weekly.wednesday = true;
              } else if (_timeline.recurrenceDaysOfWeek[i] === "Thu") {
                _recurrence.weekly.thursday = true;
              } else if (_timeline.recurrenceDaysOfWeek[i] === "Fri") {
                _recurrence.weekly.friday = true;
              } else if (_timeline.recurrenceDaysOfWeek[i] === "Sat") {
                _recurrence.weekly.saturday = true;
              } else if (_timeline.recurrenceDaysOfWeek[i] === "Sun") {
                _recurrence.weekly.sunday = true;
              }
            }
          } else if (_timeline.recurrenceType === RECURRENCE.MONTHLY) {
            _recurrence.monthly.recurrenceAbsolute = _timeline.recurrenceAbsolute;
            if (_timeline.recurrenceAbsolute) {
              _recurrence.monthly.absolute.recurrenceFrequency =
                _timeline.recurrenceFrequency;
              _recurrence.monthly.absolute.recurrenceDayOfMonth =
                _timeline.recurrenceDayOfMonth;
            } else {
              _recurrence.monthly.relative.recurrenceFrequency =
                _timeline.recurrenceFrequency;
              _recurrence.monthly.relative.recurrenceWeekOfMonth =
                _timeline.recurrenceWeekOfMonth;
              _recurrence.monthly.relative.recurrenceDayOfWeek =
                _timeline.recurrenceDayOfWeek;
            }
          } else if (_timeline.recurrenceType === RECURRENCE.YEARLY) {
            _recurrence.yearly.recurrenceAbsolute = _timeline.recurrenceAbsolute;
            if (_timeline.recurrenceAbsolute) {
              _recurrence.yearly.absolute.recurrenceMonthOfYear =
                _timeline.recurrenceMonthOfYear;
              _recurrence.yearly.absolute.recurrenceDayOfMonth =
                _timeline.recurrenceDayOfMonth;
            } else {
              _recurrence.yearly.relative.recurrenceDayOfWeek =
                _timeline.recurrenceDayOfWeek;
              _recurrence.yearly.relative.recurrenceWeekOfMonth =
                _timeline.recurrenceWeekOfMonth;
              _recurrence.yearly.relative.recurrenceMonthOfYear =
                _timeline.recurrenceMonthOfYear;
            }
          }
        };

        var _init = function () {
          _timeline.timeDefined = _timeline.timeDefined || false;
          _timeline.startDate = _timeline.startDate || _getDateTime(0, 0);
          _timeline.endDate = _timeline.endDate || null;
          _timeline.startTime = _timeline.startTime || null;
          _timeline.endTime = _timeline.endTime || null;
          _timeline.recurrenceType = _timeline.recurrenceType ||
            RECURRENCE.DAILY;
          _timeline.recurrenceFrequency = _timeline.recurrenceFrequency ||
            1;
          _timeline.recurrenceAbsolute =
            _timeline.hasOwnProperty("recurrenceAbsolute") ?
            _timeline.recurrenceAbsolute : true;
          _timeline.recurrenceDayOfWeek = _timeline.recurrenceDayOfWeek ||
            0;
          _timeline.recurrenceDayOfMonth = _timeline.recurrenceDayOfMonth ||
            1;
          _timeline.recurrenceWeekOfMonth = _timeline.recurrenceWeekOfMonth ||
            0;
          _timeline.recurrenceMonthOfYear = _timeline.recurrenceMonthOfYear ||
            0;
          _timeline.recurrenceDaysOfWeek = _timeline.recurrenceDaysOfWeek || [];

          _timeline.everyDay = !_timeline.timeDefined ||
            true && (!_timeline.endDate || false);

          _timeline.allDay = !_timeline.timeDefined ||
            true && (!_timeline.startTime && !_timeline.endTime || false);

          if (_timeline.allDay) {
            _timeline.startTime = _getDateTime(8, 0);
            _timeline.endTime = _getDateTime(17, 30);
          }

          _updateRecurrence();
        };

        _init();

        var _saveRecurrence = function () {
          if (_timeline.recurrenceType === RECURRENCE.DAILY ||
            !_timeline.hasRecurrence) {
            _timeline.recurrenceType = RECURRENCE.DAILY;
            _timeline.recurrenceFrequency = _recurrence.daily.recurrenceFrequency;
          } else if (_timeline.recurrenceType === RECURRENCE.WEEKLY) {
            _timeline.recurrenceFrequency = _recurrence.weekly.recurrenceFrequency;

            _timeline.recurrenceDaysOfWeek = [];
            if (_recurrence.weekly.monday) {
              _timeline.recurrenceDaysOfWeek.push("Mon");
            }
            if (_recurrence.weekly.tuesday) {
              _timeline.recurrenceDaysOfWeek.push("Tue");
            }
            if (_recurrence.weekly.wednesday) {
              _timeline.recurrenceDaysOfWeek.push("Wed");
            }
            if (_recurrence.weekly.thursday) {
              _timeline.recurrenceDaysOfWeek.push("Thu");
            }
            if (_recurrence.weekly.friday) {
              _timeline.recurrenceDaysOfWeek.push("Fri");
            }
            if (_recurrence.weekly.saturday) {
              _timeline.recurrenceDaysOfWeek.push("Sat");
            }
            if (_recurrence.weekly.sunday) {
              _timeline.recurrenceDaysOfWeek.push("Sun");
            }

          } else if (_timeline.recurrenceType === RECURRENCE.MONTHLY) {
            _timeline.recurrenceAbsolute = _recurrence.monthly.recurrenceAbsolute;
            if (_timeline.recurrenceAbsolute) {
              _timeline.recurrenceFrequency =
                _recurrence.monthly.absolute.recurrenceFrequency;
              _timeline.recurrenceDayOfMonth =
                _recurrence.monthly.absolute.recurrenceDayOfMonth;
            } else {
              _timeline.recurrenceFrequency =
                _recurrence.monthly.relative.recurrenceFrequency;
              _timeline.recurrenceWeekOfMonth =
                _recurrence.monthly.relative.recurrenceWeekOfMonth;
              _timeline.recurrenceDayOfWeek =
                _recurrence.monthly.relative.recurrenceDayOfWeek;
            }
          } else if (_timeline.recurrenceType === RECURRENCE.YEARLY) {
            _timeline.recurrenceAbsolute = _recurrence.yearly.recurrenceAbsolute;
            if (_timeline.recurrenceAbsolute) {
              _timeline.recurrenceMonthOfYear =
                _recurrence.yearly.absolute.recurrenceMonthOfYear;
              _timeline.recurrenceDayOfMonth =
                _recurrence.yearly.absolute.recurrenceDayOfMonth;
            } else {
              _timeline.recurrenceDayOfWeek =
                _recurrence.yearly.relative.recurrenceDayOfWeek;
              _timeline.recurrenceWeekOfMonth =
                _recurrence.yearly.relative.recurrenceWeekOfMonth;
              _timeline.recurrenceMonthOfYear =
                _recurrence.yearly.relative.recurrenceMonthOfYear;
            }
          }
        };

        this.save = function () {
          _timeline.endDate = _timeline.everyDay ? null : _timeline.endDate;

          _timeline.startTime = _timeline.allDay ? null : _timeline.startTime;
          _timeline.endTime = _timeline.allDay ? null : _timeline.endTime;

          _saveRecurrence();

          _timeline.timeDefined = !_timeline.everyDay || !_timeline.allDay ||
            _timeline.hasRecurrence;
        };

        this.recurrence = _recurrence;
        this.timeline = _timeline;
      };
    }
  ]);
