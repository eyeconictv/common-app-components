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
