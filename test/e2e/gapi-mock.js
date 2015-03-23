"use strict";

/*global gapi,handleClientJSLoad: false */

window.gapi = {};
gapi.client = {
  load: function(path, version, cb) {
    cb();
  },
  storage: {
    tagdef: {
      list: function () {
        return {
          result : {
            nextPageToken : 1,
            items : [
              {
                name: "tag1",
                values: [
                  "value1"
                ],
                type: "LOOKUP"
              },
              {
                name: "tag2",
                values: [
                  "value2"
                ],
                type: "LOOKUP"
              },
              {
                name: "tag3",
                values: [
                  "value3"
                ],
                type: "FREEFORM"
              }
            ]
          }
        };
      }
    }
  },
  setApiKey: function() {
  }
};

handleClientJSLoad();
