(function () {

  "use strict";

/* Filters */
// Tag Search Filter
angular.module("risevision.app.common.components.modal-lookup-textbox")
    .filter("tagSelection", [function($filter) {
      return function(tags, selectedTags) {
        if (!tags) {
          return [];
        }
        var res = [];
        for (var i = 0; i < tags.length; i++) {
          var found = false;
          for (var j = 0; j < selectedTags.length; j++) {
            if(tags[i].name === selectedTags[j].name &&
              tags[i].value === selectedTags[j].value){
              found = true;
              break;
            }
          }

          if (!found) {
            res.push(tags[i]);
          }
        }
        return res;
      };
    }
    ]);
}());
