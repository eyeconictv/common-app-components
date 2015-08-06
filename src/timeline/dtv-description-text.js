(function (angular) {
  "use strict";
  angular.module("risevision.common.components.timeline")
    .directive("timelineDescription", ["$filter",
      "TimelineDescriptionService",
      function ($filter, TimelineDescriptionService) {
        return {
          restrict: "A",
          link: function (scope, elem, attrs) {
            var timelineDescriptionService = new TimelineDescriptionService();
            scope.$watch(attrs.timeline, function () {
              scope.timeline.label = timelineDescriptionService.updateLabel(
                scope.timeline);
            }, true);
          }
        };
      }
    ]);
})(angular);
