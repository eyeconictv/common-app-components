"use strict";

angular.module("risevision.common.components.scrolling-list")
  .directive("scrollingList", [

    function () {
      return {
        restrict: "E",
        $scope: {
          listService: "=",
          listConfig: "="
        },
        templateUrl: "scrolling-list/scrolling-list.html",
        link: function () {

        } //link()
      };
    }
  ]);
