"use strict";

angular.module("risevision.common.components.userstate")
  .factory("canAccessApps", ["$q", "$state", "$location",
    "userState", "userAuthFactory", "urlStateService",
    function ($q, $state, $location, userState, userAuthFactory,
      urlStateService) {
      return function (authenticate, allowReturn) {
        var deferred = $q.defer();
        userAuthFactory.authenticate(false)
          .then(function () {
            if (userState.isRiseVisionUser()) {
              deferred.resolve();
            } else {
              return $q.reject();
            }
          })
          .then(null, function () {
            var newState;

            if (!userState.isLoggedIn()) {
              if (authenticate) {
                newState = "common.auth.unauthorized";
              } else {
                newState = "common.auth.createaccount";
              }
            } else if ($state.get("common.auth.unregistered")) {
              newState = "common.auth.unregistered";
            }

            if (newState) {
              $state.go(newState, {
                state: urlStateService.get()
              }, {
                reload: true
              });

              if (!allowReturn) {
                $location.replace();
              }

              deferred.reject();
            } else {
              deferred.resolve();
            }
          });
        return deferred.promise;
      };
    }
  ]);
