/*jshint expr:true */
"use strict";

describe("service: Storage API Loader", function() {
  beforeEach(module("risevision.common.components.tag-selector.services"));
  var storageApiLoader;
  beforeEach(module(function ($provide) {
    $provide.service("gapiClientLoaderGenerator",function(){
      return function() {
        return function() {
          return "service";
        };
      }; 
    });
    $provide.value("STORAGE_API_ROOT", "");
  }));

  beforeEach(function(){
    inject(function($injector){  
      storageApiLoader = $injector.get("storageApiLoader");
    });
  });

  it("should exist",function(){
    expect(storageApiLoader).to.be.truely;
    expect(storageApiLoader).to.be.a.function;
  });
  
  it("should return service",function(){
    expect(storageApiLoader()).to.equal("service");
  });

});
