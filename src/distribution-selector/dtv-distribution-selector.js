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
          if (typeof $scope.distributeToAll === "undefined") {
            $scope.distributeToAll = true;
          }
          var _getDistributionSelectionMessage = function () {
            var message = "0 Displays";

            if ($scope.distribution) {
              if ($scope.distribution.length === 1) {
                message = "1 Display";
              } else {
                message = $scope.distribution.length + " Displays";
              }
            }
            return message;
          };

          var _refreshDistributionSelectionMessage = function () {
            $scope.distributionSelectionMessage =
              _getDistributionSelectionMessage();
          };

          _refreshDistributionSelectionMessage();

          $scope.cleanSelection = function () {
            $scope.distribution = [];
            _refreshDistributionSelectionMessage();
          };

          $scope.manage = function () {

            var modalInstance = $modal.open({
              templateUrl: "distribution-selector/distribution-modal.html",
              controller: "selectDistributionModal",
              size: "md",
              resolve: {
                distribution: function () {
                  return $scope.distribution;
                }
              }
            });

            modalInstance.result.then(function (distribution) {
              $scope.distribution = distribution;
              _refreshDistributionSelectionMessage();
            });
          };
        } //link()
      };
    }
  ]);
