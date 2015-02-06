(function () {
"use strict";

angular.module("risevision.app.common.components.modal-lookup-textbox")
//updated url parameters to selected display status from status filter
    .controller("tagLookup", ["$scope", "tag", "$modalInstance", "$loading",
      "$log", "tags",
      function ($scope, tag, $modalInstance, $loading, $log, tags) {
        var _type = "LOOKUP";
        $scope.loadingTags = false;
        $scope.selectedTags = tags ? tags : [];

        $scope.$watch("loadingTags", function (loading) {
          if (loading) {
            $loading.start("tag-loader");
          } else {
            $loading.stop("tag-loader");
          }
        });

        var _flattenTagList = function(tags) {
          var res = [];
          for (var i = 0; i < tags.length; i++) {
            var tag = tags[i];

            if (tag.type === _type) {
              for (var j = 0; j < tag.values.length; j++) {
                res.push({
                  name: tag.name,
                  value: tag.values[j]
                });
              }
            }
          }
          return res;
        };

        var _init = function () {
          $scope.loadingTags = true;

          tag.list()
            .then(function (tagList) {
              return tagList.items;
            })
            .then(function (items) {
              $scope.availableTags = _flattenTagList(items);
            })
            .then(null, function(e) {
              $log.error("Could not load tags: ", e);
            }).finally(function() {
              $scope.loadingTags = false;
            });
        };

        _init();

        $scope.selectTag = function(tag) {
          $scope.selectedTags.push(tag);
        };

        $scope.removeTag = function(index) {
          //remove from array
          if (index > -1) {
            $scope.selectedTags.splice(index, 1);
          }
        };

        $scope.cancel = function() {
          $modalInstance.dismiss();
        };

        $scope.apply = function () {
          $modalInstance.close($scope.selectedTags);
        };

      }
    ]);
}());