(function (angular) {
  "use strict";
  angular.module("risevision.common.components.timeline")
    .directive("timelineTextbox", ["$modal",
      function ($modal) {
        return {
          restrict: "E",
          scope: {
            useLocaldate: "=",
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
              useLocaldate: $scope.useLocaldate,
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
