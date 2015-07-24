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
