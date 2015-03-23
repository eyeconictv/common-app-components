"use strict";
describe("controller: tag lookup modal", function() {
  var tagsList = [
    {
      name: "tag1",
      value: "value1"
    },
    {
      name: "tag2",
      value: "value2"
    },
    {
      name: "tag3",
      value: "value3"
    }
  ];
  
  beforeEach(module("risevision.common.components.tag-selector"));
  beforeEach(module("risevision.common.components.tag-selector.services"));
  beforeEach(module(function ($provide) {
    $provide.service("tag",function(){
      return {
        flatList: function() {          
          var deferred = Q.defer();
          if(returnList){
            deferred.resolve(tagsList);
          }else{
            deferred.reject("ERROR; could not retrieve tags");
          }
          return deferred.promise;
        }
      };
    });
    $provide.service("$modalInstance",function(){
      return {
        dismiss : function() {
          modalStatus = "dismiss";
        },
        close : function(obj){
          modalStatus = "close";
          
          expect(obj).to.be.an.array;
          expect(obj).to.have.length(1);
        }
      }
    });
  }));
  var $scope, returnList, confirmResponse, functionCalled, modalStatus;
  beforeEach(function(){
    modalStatus = "";
    returnList = true;
    confirmResponse = false;
    functionCalled = undefined;

    inject(function($injector, $rootScope, $controller){
      $scope = $rootScope.$new();

      $controller("tagLookup", {
        $scope: $scope,
        tag: $injector.get("tag"),
        $modal: $injector.get("$modalInstance"),
        $loading: $injector.get("$loading"),
        $log: $injector.get("$log"),
        tags: []});
      $scope.$digest();
    });
  });
  
  beforeEach(function(done) {
    setTimeout(function(){
      expect($scope.loadingTags).to.be.false;
      done();
    },10);
  });
  
  it("should exist",function(){
    expect($scope).to.be.truely;

    expect($scope.selectTag).to.be.a("function");
    expect($scope.removeTag).to.be.a("function");
    expect($scope.cancel).to.be.a("function");
    expect($scope.apply).to.be.a("function");
  });
  
  it("should initialize",function(){
    expect($scope.selectedTags).to.be.an.array;
    expect($scope.selectedTags).to.have.length(0);

    expect($scope.availableTags).to.be.an.array;
    expect($scope.availableTags).to.have.length(3);
  });

  describe("selectTag: ",function(){
    it("should select a tag",function(){
      $scope.selectTag(tagsList[1]);
      
      expect($scope.selectedTags).to.have.length(1);
    });
  });
  
  describe("removeTag: ",function(){
    it("should remove the tag",function(){
      $scope.selectTag(tagsList[1]);
      $scope.selectTag(tagsList[2]);
      
      $scope.removeTag(1);
      
      expect($scope.selectedTags).to.have.length(1);
    });
  });

  describe("apply: ",function(){
    it("should apply changes",function(){
      $scope.selectTag(tagsList[1]);
      
      $scope.apply();
      
      expect(modalStatus).to.equal("close");
    });
  });
  
  describe("cancel: ",function(){
    it("should cancel",function(){
      $scope.cancel();
      
      expect(modalStatus).to.equal("dismiss");
    });
  });

});
