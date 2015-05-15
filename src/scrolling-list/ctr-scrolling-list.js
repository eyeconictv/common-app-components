"use strict";

angular.module("risevision.common.components.scrolling-list")
  .controller("scrollingListCtrl", ["$scope", "BaseList", "$location",
    "$loading",
    function ($scope, BaseList, $location, $loading) {
      var DB_MAX_COUNT = 20; //number of records to load at a time

      $scope.listItems = new BaseList(DB_MAX_COUNT);

      $scope.search = angular.extend({
        sortBy: "name",
        count: DB_MAX_COUNT,
        reverse: false,
      }, $location.search());

      $scope.$watch("loadingItems", function (loading) {
        if (loading) {
          $loading.start("scrolling-list-loader");
        } else {
          $loading.stop("scrolling-list-loader");
        }
      });

      var load = function () {
        if ($scope.listService && !$scope.listItems.list.length ||
          !$scope.listItems.endOfList && $scope.listItems.cursor) {
          $scope.loadingItems = true;

          $scope.listService($scope.search, $scope.listItems.cursor)
            .then(function (result) {
              $scope.listItems.add(result.items ? result.items : [],
                result.cursor);
            })
            .then(null, function (e) {
              $scope.error =
                "Failed to load list. Please try again later.";
            })
            .finally(function () {
              $scope.loadingItems = false;
            });
        }
      };

      load();

      $scope.sortBy = function (cat) {
        $scope.listItems.clear();

        if (cat !== $scope.search.sortBy) {
          $scope.search.sortBy = cat;
        } else {
          $scope.search.reverse = !$scope.search.reverse;
        }

        load();
      };

      $scope.doSearch = function () {
        $scope.listItems.clear();

        load();
      };

      $scope.handleScroll = function (event, isEndEvent) {
        // $log.debug(event.target.scrollTop + " / " + event.target.scrollHeight + " / " + isEndEvent);
        if (isEndEvent) {
          if (event.target.scrollTop && (event.target.scrollHeight - event.target
            .clientHeight -
            event.target.scrollTop) < 20) {
            //load more rows if less than 20px left to the bottom
            load();
          }
        }
      };

      $scope.navigate = function (path, event) {
        event.preventDefault();

        $location.path(path);
      };
    }
  ]);
