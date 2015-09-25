/*globals browser */
'use strict';
/**
 * Usage: wait(element, label)
 * element : It will wait for this element to come into view
 * label : just used for the error message
 */
var wait = function (element, label) {
  return browser.wait(function () {
    return element.isPresent().then(function (state) {
      if (state === true) {
        return element.isDisplayed().then(function (state2) {
          if (state2 === true) {
            return element.isEnabled().then(function (state3) {
              return state3 === true;
            });
          }
        });
      } else {
        return false;
      }
    });
  }, 10000, label + " did not appear");
};
exports.wait = wait;

/**
 * Usage: waitDisappear(element, label)
 * element : It will wait for this element to disappear from view
 * label : just used for the error message
 */
var waitDisappear = function (element, label) {
  return browser.wait(function () {
    return element.isDisplayed().then(function (state) {
      return !state;
    });
  }, 10000, label + " did not disappear");
};

exports.waitDisappear = waitDisappear;

/**
 * Usage: clickWhenClickable(element, label)
 * element : It will click on the element when it is clickable
 * label : just used for the error message
 */
var clickWhenClickable = function (element, label) {
  return browser.wait(function () {
    return element.click().then(function () {
      return true;
    }, function () {
      return false;
    });
  }, 10000, label + " not clickable");
};

exports.clickWhenClickable = clickWhenClickable;
