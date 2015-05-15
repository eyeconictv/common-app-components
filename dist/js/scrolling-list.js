"use strict";

angular.module("risevision.common.components.scrolling-list", [
  "risevision.common.loading"
])
  .value("BaseList", function (maxCount) {
    this.list = [];
    this.maxCount = maxCount ? maxCount : 20;
    this.cursor = null;
    this.endOfList = false;
    this.searchString = "";
    this.clear = function () {
      this.list = [];
      this.cursor = null;
      this.endOfList = false;
    };
    this.append = function (items) {
      for (var i = 0; i < items.length; i++) {
        this.list.push(items[i]);
      }
    };
    this.concat = function (items) {
      this.list = this.list.concat(items);
    };
    this.add = function (items, cursor) {
      this.cursor = cursor;
      this.endOfList = items.length < maxCount;
      this.concat(items);
    };
    this.remove = function (index) {
      this.list.splice(index, 1);
    };
  });

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

(function(module) {
try {
  module = angular.module('risevision.common.components.scrolling-list');
} catch (e) {
  module = angular.module('risevision.common.components.scrolling-list', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('scrolling-list/scrolling-list.html',
    '<div ng-controller="scrollingListCtrl"><search-filter filter-config="listConfig.filter" search="search" do-search="doSearch"></search-filter><div class="content-box half-top"><div class="list-group scrollable-list" rv-scroll-event="handleScroll($event, isEndEvent)" rv-spinner="" rv-spinner-key="scrolling-list-loader" rv-spinner-start-active="1"><table class="table-2 table-hover"><thead><tr><th ng-repeat="column in listConfig.columns" class="{{column.class}}" ng-click="sortBy(column.id)">{{ column.heading | translate }} <i ng-if="search.sortBy == column.id" class="fa ng-scope fa-long-arrow-up" ng-class="{false: \'fa-long-arrow-up\', true: \'fa-long-arrow-down\'}[search.reverse]"></i></th></tr></thead><tbody><tr class="clickable-row" ng-repeat="item in listItems.list" ui-sref="displaysettings" ng-click="navigate(\'/display/{{display.id}}\', $event)"><td ng-repeat="column in listConfig.columns" class="{{column.class}}" ng-include="column.valueTemplate"></td></tr><tr ng-show="listItems.list.length === 0 && !search.query"><td colspan="3" class="text-center"><span translate="">{{listConfig.emptyMessage}}</span></td></tr><tr ng-show="listItems.list.length === 0 && search.query"><td colspan="3" class="text-center"><span translate="">{{listConfig.noResultsMessage}}</span></td></tr></tbody></table></div></div></div>');
}]);
})();
