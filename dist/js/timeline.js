"use strict";

angular.module("risevision.common.components.timeline.services", []);

angular.module("risevision.common.components.timeline", [
  "risevision.common.components.timeline.services",
  "ui.bootstrap"
]);

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
        var _getDateTime = function (hours, minutes) {
          var d = new Date();
          d.setHours(hours);
          d.setMinutes(minutes);

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
          _timeline.startDate = _timeline.startDate || new Date();
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

(function (angular) {
  "use strict";
  angular.module("risevision.common.components.timeline")
    .directive("weekDropdown",
      function () {
        return {
          restrict: "E",
          scope: {
            week: "="
          },
          templateUrl: "timeline/week-dropdown.html"
        };
      }
  );
})(angular);

(function (angular) {
  "use strict";
  angular.module("risevision.common.components.timeline")
    .directive("timelineTextbox", ["$modal",
      function ($modal) {
        return {
          restrict: "E",
          scope: {
            timeDefined: "=",
            startDate: "=",
            endDate: "=",
            startTime: "=",
            endTime: "=",
            recurrenceType: "=",
            recurrenceFrequency: "=",
            recurrenceAbsolute: "=",
            recurrenceDayOfWeek: "=",
            recurrenceDayOfMonth: "=",
            recurrenceWeekOfMonth: "=",
            recurrenceMonthOfYear: "=",
            recurrenceDaysOfWeek: "="
          },
          templateUrl: "timeline/timeline-textbox.html",
          link: function ($scope) {
            $scope.timeline = {
              timeDefined: $scope.timeDefined,
              startDate: $scope.startDate,
              endDate: $scope.endDate,
              startTime: $scope.startTime,
              endTime: $scope.endTime,
              recurrenceType: $scope.recurrenceType,
              recurrenceFrequency: $scope.recurrenceFrequency,
              recurrenceAbsolute: $scope.recurrenceAbsolute,
              recurrenceDayOfWeek: $scope.recurrenceDayOfWeek,
              recurrenceDayOfMonth: $scope.recurrenceDayOfMonth,
              recurrenceWeekOfMonth: $scope.recurrenceWeekOfMonth,
              recurrenceMonthOfYear: $scope.recurrenceMonthOfYear,
              recurrenceDaysOfWeek: $scope.recurrenceDaysOfWeek
            };

            $scope.openModal = function () {
              var modalInstance = $modal.open({
                templateUrl: "timeline/timeline-modal.html",
                controller: "timelineModal",
                resolve: {
                  timeline: function () {
                    return angular.copy($scope.timeline);
                  }
                },
                size: "md",
                backdrop: "static"
              });

              modalInstance.result.then(function (timeline) {
                //do what you need if user presses ok
                $scope.timeline = timeline;

                $scope.timeDefined = timeline.timeDefined;
                $scope.startDate = timeline.startDate;
                $scope.endDate = timeline.endDate;
                $scope.startTime = timeline.startTime;
                $scope.endTime = timeline.endTime;
                $scope.recurrenceType = timeline.recurrenceType;
                $scope.recurrenceFrequency = timeline.recurrenceFrequency;
                $scope.recurrenceAbsolute = timeline.recurrenceAbsolute;
                $scope.recurrenceDayOfWeek = timeline.recurrenceDayOfWeek;
                $scope.recurrenceDayOfMonth = timeline.recurrenceDayOfMonth;
                $scope.recurrenceWeekOfMonth = timeline.recurrenceWeekOfMonth;
                $scope.recurrenceMonthOfYear = timeline.recurrenceMonthOfYear;
                $scope.recurrenceDaysOfWeek = timeline.recurrenceDaysOfWeek;
              }, function () {
                // do what you need to do if user cancels
              });
            };
          }
        };
      }
    ]);
})(angular);

(function (angular) {
  "use strict";
  angular.module("risevision.common.components.timeline")
    .directive("monthDropdown",
      function () {
        return {
          restrict: "E",
          scope: {
            month: "="
          },
          templateUrl: "timeline/month-dropdown.html"
        };
      }
  );
})(angular);

(function (angular) {
  "use strict";
  angular.module("risevision.common.components.timeline")
    .directive("weekdayDropdown",
      function () {
        return {
          restrict: "E",
          scope: {
            weekday: "="
          },
          templateUrl: "timeline/weekday-dropdown.html"
        };
      }
  );
})(angular);

(function (angular) {
  "use strict";
  angular.module("risevision.common.components.timeline")
    .controller("timelineModal", ["$scope", "$modalInstance", "timeline",
      "TimelineFactory",
      function ($scope, $modalInstance, timeline, TimelineFactory) {
        var factory = new TimelineFactory(timeline);

        $scope.recurrence = factory.recurrence;
        $scope.timeline = factory.timeline;

        $scope.dateOptions = {
          formatYear: "yy",
          startingDay: 1,
          showWeeks: false,
          showButtonBar: false
        };

        $scope.today = new Date();
        $scope.datepickers = {};

        $scope.openDatepicker = function ($event, which) {
          $event.preventDefault();
          $event.stopPropagation();

          $scope.datepickers[which] = true;
        };

        $scope.save = function () {
          factory.save();

          $modalInstance.close($scope.timeline);
        };

        $scope.close = function () {
          $modalInstance.dismiss();
        };
      }
    ]);
})(angular);

(function(module) {
try {
  module = angular.module('risevision.common.components.timeline');
} catch (e) {
  module = angular.module('risevision.common.components.timeline', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('timeline/month-dropdown.html',
    '<select class="form-control" ng-model="month" integer-parser=""><option value="0">January</option><option value="1">February</option><option value="2">March</option><option value="3">April</option><option value="4">May</option><option value="5">June</option><option value="6">July</option><option value="7">August</option><option value="8">September</option><option value="9">October</option><option value="10">November</option><option value="11">December</option></select>');
}]);
})();

(function(module) {
try {
  module = angular.module('risevision.common.components.timeline');
} catch (e) {
  module = angular.module('risevision.common.components.timeline', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('timeline/timeline-modal.html',
    '<div id="timelineModal"><div class="modal-header"><button type="button" class="close" ng-click="close()" aria-hidden="true"><i class="fa fa-times"></i></button><h3 class="modal-title">Edit Timeline</h3></div><div class="modal-body"><form role="form" name="timelineDetails" novalidate=""><div class="timeline"><div class="content-box-editable clickable"><div class="label label-tag"><span>Start 02-Jan-2014 End 21-Jan-2014 08:00AM to 05:30PM Weekly (Sun,Sat)</span></div></div><section><label class="control-label half-bottom" for="everyday"><input type="checkbox" ng-model="timeline.everyDay"> <strong>Every Day</strong></label><div class="form-group row" ng-show="!timeline.everyDay"><div class="col-sm-4"><div class="form-group"><label class="control-label">Start Date</label><div class="input-group"><input type="text" id="startDate" name="startDate" class="form-control" datepicker-popup="dd-MMM-yyyy" ng-model="timeline.startDate" is-open="datepickers.startDate" min-date="today" datepicker-options="dateOptions" ng-required="!timeline.everyDay" close-text="Close"> <span class="input-group-btn"><button type="button" class="btn btn-default" ng-click="openDatepicker($event, \'startDate\')"><i class="fa fa-calendar"></i></button></span></div><div class="alert alert-danger" ng-show="timelineDetails.startDate.$invalid">Start Date is a required field</div></div></div><div class="col-sm-4"><div class="form-group"><label class="control-label">End Date</label><div class="input-group"><input type="text" id="endDate" class="form-control" datepicker-popup="dd-MMM-yyyy" ng-model="timeline.endDate" is-open="datepickers.endDate" min-date="timeline.startDate" datepicker-options="dateOptions" close-text="Close"> <span class="input-group-btn"><button type="button" class="btn btn-default" ng-click="openDatepicker($event, \'endDate\')"><i class="fa fa-calendar"></i></button></span></div></div><div class="alert alert-danger" ng-show="timeline.endDate && timeline.startDate.getDate() > timeline.endDate.getDate()">End Date must occur after Start Date</div></div></div></section><section><label class="control-label half-bottom"><input type="checkbox" ng-model="timeline.allDay"> <strong>All Day</strong></label><div class="row form-group" ng-hide="timeline.allDay"><div class="col-sm-4"><label class="control-label">Start Time</label><div class="time-picker"><timepicker id="startTime" ng-model="timeline.startTime" ng-change="changed()" hour-step="1" minute-step="15" show-meridian="true"></timepicker></div></div><div class="col-sm-4"><label class="control-label">End Time</label><div class="time-picker"><timepicker id="endTime" ng-model="timeline.endTime" ng-change="changed()" hour-step="1" minute-step="15" show-meridian="true"></timepicker></div></div></div></section><section><label class="control-label half-bottom" for="recurrence"><input type="checkbox" ng-model="timeline.hasRecurrence"> <strong>Recurrence</strong></label><div class="form-group" ng-show="timeline.hasRecurrence"><label for="Daily" class="add-right control-label"><input type="radio" ng-model="timeline.recurrenceType" value="Daily" id="Daily" name="recurrenceType"> Daily</label> <label for="Weekly" class="add-right control-label"><input type="radio" ng-model="timeline.recurrenceType" value="Weekly" id="Weekly" name="recurrenceType"> Weekly</label> <label for="Monthly" class="add-right control-label"><input type="radio" ng-model="timeline.recurrenceType" value="Monthly" id="Monthly" name="recurrenceType"> Monthly</label> <label for="Yearly" class="add-right control-label"><input type="radio" ng-model="timeline.recurrenceType" value="Yearly" id="Yearly" name="recurrenceType"> Yearly</label></div><div class="recurrence-option" ng-show="timeline.hasRecurrence"><div ng-if="timeline.recurrenceType === \'Daily\'"><div class="form-group"><label class="control-label">Every</label> <input type="number" class="form-control input-short" style="width: 40px; padding: 6px 0; text-align: center;" name="dailyRecurrenceFrequency" ng-model="recurrence.daily.recurrenceFrequency" min="1" max="999" ng-required="timeline.recurrenceType === \'Daily\'"> <label class="control-label">Day(s)</label><p class="text-danger" style="display: block;" ng-show="timelineDetails.dailyRecurrenceFrequency.$invalid">Daily Recurrence Frequency must be a number between 1 and 999</p></div></div><div ng-show="timeline.recurrenceType === \'Weekly\'"><div class="form-group"><label class="control-label">Every</label> <input type="number" class="form-control input-short" style="width: 40px; padding: 6px 0; text-align: center;" name="weeklyRecurrenceFrequency" ng-model="recurrence.weekly.recurrenceFrequency" min="1" max="999" ng-required="timeline.recurrenceType === \'Weekly\'"> <label class="control-label">Week(s)</label><p class="text-danger" style="display: block;" ng-show="timelineDetails.weeklyRecurrenceFrequency.$invalid">Weekly Recurrence Frequency must be a number between 1 and 999</p></div><div class="form-group timelineWeekdays"><label class="control-label"><input type="checkbox" ng-model="recurrence.weekly.monday"> Monday</label> <label class="control-label"><input type="checkbox" ng-model="recurrence.weekly.tuesday"> Tuesday</label> <label class="control-label"><input type="checkbox" ng-model="recurrence.weekly.wednesday"> Wednesday</label> <label class="control-label"><input type="checkbox" ng-model="recurrence.weekly.thursday"> Thursday</label> <label class="control-label"><input type="checkbox" ng-model="recurrence.weekly.friday"> Friday</label> <label class="control-label"><input type="checkbox" ng-model="recurrence.weekly.saturday"> Saturday</label> <label class="control-label"><input type="checkbox" ng-model="recurrence.weekly.sunday"> Sunday</label></div></div><div ng-if="timeline.recurrenceType === \'Monthly\'"><div class="form-group"><label class="control-label"><input ng-model="recurrence.monthly.recurrenceAbsolute" ng-value="true" type="radio"> Day</label><fieldset ng-disabled="!recurrence.monthly.recurrenceAbsolute"><input type="number" class="form-control input-short" style="width: 40px; padding: 6px 0; text-align: center;" name="monthlyAbsoluteRecurrenceDayOfMonth" ng-model="recurrence.monthly.absolute.recurrenceDayOfMonth" min="1" max="31" ng-required="timeline.recurrenceType === \'Monthly\' && recurrence.monthly.recurrenceAbsolute"> <label class="control-label">of Every</label> <input type="number" class="form-control input-short" style="width: 40px; padding: 6px 0; text-align: center;" name="monthlyAbsoluteRecurrenceFrequency" ng-model="recurrence.monthly.absolute.recurrenceFrequency" min="1" max="999" ng-required="timeline.recurrenceType === \'Monthly\' && recurrence.monthly.recurrenceAbsolute"> <label class="control-label">Month(s)</label></fieldset><p class="text-danger" style="display: block;" ng-show="timelineDetails.monthlyAbsoluteRecurrenceDayOfMonth.$invalid">Monthly Recurrence Day Of Month value must be between 1 and 31</p><p class="text-danger" style="display: block;" ng-show="timelineDetails.monthlyAbsoluteRecurrenceFrequency.$invalid">Monthly Recurrence Frequency must be a number between 1 and 999</p></div><div class="form-group"><label class="control-label"><input ng-model="recurrence.monthly.recurrenceAbsolute" ng-value="false" type="radio"> The</label><fieldset ng-disabled="recurrence.monthly.recurrenceAbsolute"><week-dropdown week="recurrence.monthly.relative.recurrenceWeekOfMonth"></week-dropdown><weekday-dropdown weekday="recurrence.monthly.relative.recurrenceDayOfWeek"></weekday-dropdown><label class="control-label">of Every</label> <input type="number" class="form-control input-short" style="width: 40px; padding: 6px 0; text-align: center;" name="monthlyRelativeRecurrenceFrequency" ng-model="recurrence.monthly.relative.recurrenceFrequency" min="1" max="999" ng-required="timeline.recurrenceType === \'Monthly\' && !recurrence.monthly.recurrenceAbsolute" <label="">Month(s)</fieldset><p class="text-danger" style="display: block;" ng-show="timelineDetails.monthlyRelativeRecurrenceFrequency.$invalid">Monthly Relative Recurrence Frequency must be a number between 1 and 999</p></div></div><div ng-if="timeline.recurrenceType === \'Yearly\'"><div class="form-group"><label class="control-label"><input type="radio" ng-model="recurrence.yearly.recurrenceAbsolute" ng-value="true"> Every</label><fieldset ng-disabled="!recurrence.yearly.recurrenceAbsolute"><month-dropdown month="recurrence.yearly.absolute.recurrenceMonthOfYear"></month-dropdown><input type="number" class="form-control input-short" style="width: 40px; padding: 6px 0; text-align: center;" name="yearlyAbsoluteRecurrenceDayOfMonth" ng-model="recurrence.yearly.absolute.recurrenceDayOfMonth" min="1" max="31" ng-required="timeline.recurrenceType === \'Yearly\' && recurrence.yearly.recurrenceAbsolute"></fieldset><p class="text-danger" style="display: block;" ng-show="timelineDetails.yearlyAbsoluteRecurrenceDayOfMonth.$invalid">Yearly Recurrence Day Of Month value must be between 1 and 31</p></div><div class="form-group"><label class="control-label"><input type="radio" ng-model="recurrence.yearly.recurrenceAbsolute" ng-value="false"> The</label><fieldset ng-disabled="recurrence.yearly.recurrenceAbsolute"><week-dropdown week="recurrence.yearly.relative.recurrenceWeekOfMonth"></week-dropdown><weekday-dropdown weekday="recurrence.yearly.relative.recurrenceDayOfWeek"></weekday-dropdown><label class="control-label">of</label><month-dropdown month="recurrence.yearly.relative.recurrenceMonthOfYear"></month-dropdown></fieldset></div></div></div></section></div></form></div><div class="modal-footer"><button type="button" class="btn btn-primary btn-fixed-width" ng-click="save()" ng-disabled="timelineDetails.$invalid">Apply <i class="fa fa-white fa-check icon-right"></i></button> <button type="button" class="btn btn-default btn-fixed-width" ng-click="close()">Cancel <i class="fa fa-times icon-right"></i></button></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('risevision.common.components.timeline');
} catch (e) {
  module = angular.module('risevision.common.components.timeline', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('timeline/timeline-textbox.html',
    '<div id="timelineTextbox" class="content-box-editable remove-bottom clickable" ng-click="openModal()"><div class="label label-tag">{{timeline.label}}</div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('risevision.common.components.timeline');
} catch (e) {
  module = angular.module('risevision.common.components.timeline', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('timeline/week-dropdown.html',
    '<select class="form-control" ng-model="week" integer-parser=""><option value="0">First</option><option value="1">Second</option><option value="2">Third</option><option value="3">Fourth</option><option value="4">Last</option></select>');
}]);
})();

(function(module) {
try {
  module = angular.module('risevision.common.components.timeline');
} catch (e) {
  module = angular.module('risevision.common.components.timeline', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('timeline/weekday-dropdown.html',
    '<select class="form-control" ng-model="weekday" integer-parser=""><option value="0">Sunday</option><option value="1">Monday</option><option value="2">Tuesday</option><option value="3">Wednesday</option><option value="4">Thursday</option><option value="5">Friday</option><option value="6">Saturday</option></select>');
}]);
})();
