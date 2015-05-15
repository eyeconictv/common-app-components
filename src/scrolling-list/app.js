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
