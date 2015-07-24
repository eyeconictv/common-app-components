"use strict";

angular.module("risevision.common.components.distribution-selector.services", [
  "risevision.common.gapi"
]);

angular.module("risevision.common.components.distribution-selector", [
  "risevision.common.components.distribution-selector.services",
  "risevision.common.components.scrolling-list",
  "risevision.common.loading",
  "ui.bootstrap"
])
  .value("CORE_URL",
    "https://rvacore-test.appspot.com/_ah/api");

"use strict";

/*jshint camelcase: false */

angular.module("risevision.common.components.distribution-selector.services")
  .constant("DISPLAY_SEARCH_FIELDS", [
    "name", "id"
  ])
  .service("displayService", ["$q", "$log", "coreAPILoader", "userState",
    "DISPLAY_SEARCH_FIELDS",
    function ($q, $log, coreAPILoader, userState, DISPLAY_SEARCH_FIELDS) {

      var createSearchQuery = function (fields, search) {
        var query = "";

        for (var i in fields) {
          query += "OR " + fields[i] + ":~\"" + search + "\" ";
        }

        query = query.substring(3);

        return query.trim();
      };

      var service = {
        list: function (search, cursor) {
          var deferred = $q.defer();

          var query = search.query ?
            createSearchQuery(DISPLAY_SEARCH_FIELDS, search.query) : "";

          var obj = {
            "companyId": userState.getSelectedCompanyId(),
            "search": query,
            "cursor": cursor,
            "count": search.count,
            "sort": search.sortBy + (search.reverse ? " desc" : " asc")
          };
          $log.debug("list displays called with", obj);

          coreAPILoader().then(function (coreApi) {
            return coreApi.display.list(obj);
          })
            .then(function (resp) {
              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              $log.error("Failed to get list of displays.", e);
              deferred.reject(e);
            });

          return deferred.promise;
        }
      };

      return service;
    }
  ]);

"use strict";

angular.module("risevision.common.components.distribution-selector")
  .directive("distributionSelector", ["$modal",
    function ($modal) {
      return {
        restrict: "E",
        scope: {
          distribution: "=",
          distributeToAll: "="
        },
        templateUrl: "distribution-selector/distribution-selector.html",
        link: function ($scope) {

          var getDistributionSelectionMessage = function () {
            var message = "0 Displays";
            if ($scope.distributeToAll) {
              message = "All Displays";
            } else {
              if ($scope.distribution) {
                if ($scope.distribution.length === 1) {
                  message = "1 Display";
                } else {
                  message = $scope.distribution.length + " Displays";
                }
              }
            }
            return message;
          };

          $scope.distributionSelectionMessage =
            getDistributionSelectionMessage();

          $scope.manage = function () {

            var modalInstance = $modal.open({
              templateUrl: "distribution-selector/distribution-modal.html",
              controller: "selectDistributionModal",
              size: "md",
              resolve: {
                distribution: function () {
                  return $scope.distribution;
                },
                distributeToAll: function () {
                  return $scope.distributeToAll;
                }
              }
            });

            modalInstance.result.then(function (distributionDetails) {
              $scope.distribution = distributionDetails[0];
              $scope.distributeToAll = distributionDetails[1];
              $scope.distributionSelectionMessage =
                getDistributionSelectionMessage();
            });
          };
        } //link()
      };
    }
  ]);

"use strict";
angular.module("risevision.common.components.distribution-selector")
  .controller("distributionListController", ["$scope", "$rootScope",
    "displayService", "$loading", "BaseList",
    function ($scope, $rootScope, displayService, $loading, BaseList) {
      var DB_MAX_COUNT = 40; //number of records to load at a time

      $scope.displays = new BaseList(DB_MAX_COUNT);
      $scope.search = {
        sortBy: "name",
        count: DB_MAX_COUNT,
        reverse: false
      };

      $scope.filterConfig = {
        placeholder: "Search Displays",
        id: "displaySearchInput"
      };

      $scope.$watch("loadingDisplays", function (loading) {
        if (loading) {
          $loading.start("display-list-loader");
        } else {
          $loading.stop("display-list-loader");
        }
      });

      $scope.load = function () {
        if (!$scope.displays.list.length || !$scope.displays.endOfList &&
          $scope.displays.cursor) {
          $scope.loadingDisplays = true;

          displayService.list($scope.search, $scope.displays.cursor)
            .then(function (result) {
              $scope.displays.add(result.items ? result.items : [],
                result.cursor);
            })
            .then(null, function (e) {
              $scope.error =
                "Failed to load displays. Please try again later.";
            })
            .finally(function () {
              $scope.loadingDisplays = false;
            });
        }
      };

      $scope.load();

      $scope.sortBy = function (cat) {
        $scope.displays.clear();

        if (cat !== $scope.search.sortBy) {
          $scope.search.sortBy = cat;
        } else {
          $scope.search.reverse = !$scope.search.reverse;
        }

        $scope.load();
      };

      $scope.doSearch = function () {
        $scope.displays.clear();

        $scope.load();
      };

      $scope.toggleDisplay = function (displayId) {
        var index = $scope.parameters.distribution.indexOf(displayId);
        if (index > -1) {
          $scope.parameters.distribution.splice(index, 1);
        } else {
          $scope.parameters.distribution.push(displayId);
        }
      };

      $scope.cleanSelection = function () {
        $scope.parameters.distribution = [];
      };


      $scope.isSelected = function (displayId) {
        var index = $scope.parameters.distribution.indexOf(displayId);
        if (index > -1) {
          return true;
        }

        return false;
      };

    }
  ]);

"use strict";

angular.module("risevision.common.components.distribution-selector")
  .controller("selectDistributionModal", ["$scope", "$modalInstance",
    "distribution", "distributeToAll",
    function ($scope, $modalInstance, distribution, distributeToAll) {
      $scope.parameters = {};

      $scope.parameters.distribution = (distribution) ? angular.copy(
        distribution) : [];
      $scope.parameters.distributeToAll = (distributeToAll) ? distributeToAll :
        false;

      $scope.apply = function () {
        console.debug("Selected Distribution: ", $scope.parameters.distribution);
        console.debug("Selected Distribution distributeToAll: ", $scope.parameters
          .distributeToAll);
        $modalInstance.close([$scope.parameters.distribution, $scope.parameters
          .distributeToAll
        ]);
      };

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };
    }
  ]);

(function(module) {
try {
  module = angular.module('risevision.common.components.distribution-selector');
} catch (e) {
  module = angular.module('risevision.common.components.distribution-selector', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('distribution-selector/distribution-list.html',
    '<div ng-controller="distributionListController"><div class="form-group"><label class="control-label"><input id="allDisplaysCheckbox" type="checkbox" ng-model="parameters.distributeToAll" class="add-right" ng-change="cleanSelection()"> All Displays</label></div><search-filter filter-config="filterConfig" search="search" do-search="doSearch"></search-filter><div class="content-box scrollable-list half-top" scrolling-list="load()" rv-spinner="" rv-spinner-key="display-list-loader" rv-spinner-start-active="1"><table id="displayListTable" class="table-2 table-hover" ng-class="{ \'animated fadeIn table-selector multiple-selector\': !parameters.distributeToAll}"><thead><tr><th id="tableHeaderName" ng-click="sortBy(\'name\')" class="clickable">Name<i ng-if="search.sortBy == \'name\'" class="fa" ng-class="{false: \'fa-long-arrow-up\', true: \'fa-long-arrow-down\'}[search.reverse]"></i></th><th id="tableHeaderAddress" class="text-right">Address</th></tr></thead><tbody><tr class="clickable-row display" ng-click="toggleDisplay(display.id);" ng-class="{\'active\' : isSelected(display.id) }" ng-repeat="display in displays.list"><td id="displayName-{{display.id}}" class="display-name">{{display.name}}</td><td id="displayAddress-{{display.id}}" class="display-address"><span class="text-muted">{{display.address}}</span></td></tr></tbody></table></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('risevision.common.components.distribution-selector');
} catch (e) {
  module = angular.module('risevision.common.components.distribution-selector', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('distribution-selector/distribution-modal.html',
    '<div id="distributionModal"><div class="modal-header"><button type="button" class="close" ng-click="dismiss()" aria-hidden="true"><i class="fa fa-times"></i></button><h3 class="modal-title">Edit Distribution</h3></div><div class="modal-body" ng-include="" src="\'distribution-selector/distribution-list.html\'"></div><div class="modal-footer"><button id="applyButton" class="btn-primary btn" ng-click="apply()">Apply <i class="fa fa-check icon-right"></i></button> <button id="distributionModalCancelButton" class="btn btn-default" ng-click="dismiss()">Cancel <i class="fa fa-times icon-right"></i></button></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('risevision.common.components.distribution-selector');
} catch (e) {
  module = angular.module('risevision.common.components.distribution-selector', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('distribution-selector/distribution-selector.html',
    '<label class="control-label">Distribution</label><div id="distributionField" class="content-box-editable remove-bottom clickable" ng-click="manage()"><div class="label label-tag"><span id="distributionFieldText" ng-bind="distributionSelectionMessage"></span></div></div>');
}]);
})();
